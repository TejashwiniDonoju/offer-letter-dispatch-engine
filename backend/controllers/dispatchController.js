const Candidate = require('../models/Candidate');
const User = require('../models/User'); // Import our new User collection
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-enterprise-token-key-999';

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ error: "Missing Google Token." });

        // Verify the token integrity directly with Google security servers
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { name, email, picture, sub: googleId } = ticket.getPayload();

        // Check if user already exists, or register them on the fly
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, googleId, picture });
            console.log(`✨ Brand new user registered via Google OAuth: ${email}`);
        } else if (!user.googleId) {
            // Link Google accounts cleanly if they signed up via email before
            user.googleId = googleId;
            user.picture = picture;
            await user.save();
        }

        // Generate an official signed JWT session token valid for 24 hours
        const sessionToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            success: true,
            token: sessionToken,
            user: { name: user.name, email: user.email, picture: user.picture }
        });
    } catch (error) {
        console.error("🚨 GOOGLE AUTH EXCEPTION:", error);
        res.status(500).json({ error: "Google identity authentication cycle failed." });
    }
};

// Standard fallback Email/Password authentication
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid account credentials." });

        // If they have a password set, verify it with bcrypt
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: "Invalid account credentials." });
        } else {
            return res.status(400).json({ error: "Please sign in using your linked Google Profile." });
        }

        const sessionToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token: sessionToken, user: { name: user.name, email: user.email } });
    } catch (e) {
        res.status(500).json({ error: "Internal core authorization sequence failure." });
    }
};

// Save newly uploaded CSV items to MongoDB
exports.saveCandidates = async (req, res) => {
    try {
        const { candidates } = req.body;
        if (!candidates || !candidates.length) {
            return res.status(400).json({ error: "No candidate record data found." });
        }
        
        console.log("Clearing previous queue documents...");
        await Candidate.deleteMany({});
        
        console.log("Inserting rows into MongoDB...");
        const savedData = await Candidate.insertMany(candidates);
        
        res.status(201).json({ success: true, count: savedData.length, data: savedData });
    } catch (error) {
        console.error("🚨 MONGODB FAULT:", error);
        // Pass the exact internal system string to the frontend
        res.status(500).json({ error: "Database save failed.", details: error.message });
    }
};

// Retrieve records from MongoDB for Step 3 Review Grid
exports.getCandidates = async (req, res) => {
    try {
        const data = await Candidate.find({});
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch grid items." });
    }
};

// Update record modifications from Step 3 inline adjustments
exports.updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRecord = await Candidate.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedRecord });
    } catch (error) {
        res.status(500).json({ error: "Failed to sync element update." });
    }
};

exports.dispatchLetter = async (req, res) => {
    const { email, name, htmlContent } = req.body;
    
    try {
        console.log(`🚀 RUNNING SECURE SMTP PRODUCTION DISPATCH FOR: ${email}`);

        // 🌟 REPAIR 1: Read the exact variable keys saved on your Render Dashboard
        const gmailUser = process.env.EMAIL_USER || process.env.GMAIL_USER || process.env.SMTP_USER;
        const gmailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

        console.log("Checking loaded keys...");
        console.log("- GMAIL_USER found:", !!gmailUser);
        console.log("- GMAIL_APP_PASSWORD found:", !!gmailPass);

        if (!gmailUser || !gmailPass) {
            return res.status(400).json({
                error: "Missing Environmental Variables",
                details: "Your Render environment is missing valid EMAIL_USER or EMAIL_PASS values entirely."
            });
        }

        // 🌟 REPAIR 2: Use direct SMTP configuration via Port 465 to bypass Render's firewall filters
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for port 465
            auth: { 
                user: gmailUser, 
                pass: gmailPass 
            },
            tls: {
                rejectUnauthorized: false // Bypasses corporate network SSL tracking rejections
            },
            connectionTimeout: 20000, // Extend timeouts to 20 seconds
            greetingTimeout: 20000
        });

        // 2. Dispatch a clean HTML email directly
        await transporter.sendMail({
            from: `"Human Resources" <${gmailUser}>`,
            to: email,
            subject: `Official Job Offer Letter - ${name}`,
            html: htmlContent 
        });

        console.log(`🎉 Test email sent successfully straight to: ${email}`);
        return res.status(200).json({ success: true, message: 'Offer letter template sent directly to inbox!' });

    } catch (error) {
        console.error("🚨 TEST DISPATCH EXCEPTION:", error);
        
        return res.status(500).json({ 
            error: error.message || "Unknown SMTP internal error context", 
            details: error.stack 
        });
    }
};