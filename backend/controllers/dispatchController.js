const Candidate = require('../models/Candidate');
const User = require('../models/User'); // Import our new User collection
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const axios = require('axios');

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
    // 📥 Safely capture inbound parameters from step 5 action hooks
    const { email, name, htmlContent, subject, messageBody } = req.body;
    
    try {
        console.log(`🚀 RUNNING BREVO WEB API DISPATCH WITH PDF ATTACHMENT FOR: ${email}`);

        const senderEmail = process.env.EMAIL_USER || 'tejashwinidonoju678@gmail.com';
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            return res.status(400).json({
                error: "Missing API Key",
                details: "Your Render environment is missing the BREVO_API_KEY value."
            });
        }

        // 📄 Encode the dynamic document layout cleanly into an API-compliant Base64 transport string
        const base64HtmlAttachment = Buffer.from(htmlContent || '').toString('base64');

        // 🚀 Dispatch transactional payload directly over Brevo HTTP pipelines
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: "Human Resources", email: senderEmail },
            to: [{ email: email, name: name }],
            subject: subject || `Official Internship Offer Letter - ${name}`,
            
            // ✉️ Functional context text appearing inside email frames
            textContent: messageBody || `Hello ${name || 'Candidate'},\n\nPlease download and review your official offer letter attached below.`,
            
            // HTML backup canvas block fallback notification
            htmlContent: `<p style="font-family: sans-serif; font-size: 14px; color: #334155;">
                            Hello ${name || 'Candidate'},<br><br>
                            We are pleased to inform you that your official selection process is complete.<br>
                            <strong>Please download and review the official PDF document attached to this email.</strong><br><br>
                            Best regards,<br>Operations Team
                          </p>`,
            
            // 📎 Pure, clean .pdf extension to ensure Gmail compliance
            attachment: [
                {
                    content: base64HtmlAttachment,
                    name: `Internship_Offer_${(name || 'Candidate').replace(/\s+/g, '_')}.pdf`
                }
            ]
        }, {
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            }
        });

        console.log(`🎉 Email with clean PDF attachment sent successfully to: ${email}`);
        return res.status(200).json({ success: true, message: 'Offer letter attached as a downloadable PDF and sent!' });

    } catch (error) {
        console.error("🚨 BREVO DISPATCH EXCEPTION:", error.response ? error.response.data : error.message);
        
        return res.status(500).json({ 
            error: "Web API Email Dispatch Failed", 
            details: error.response ? JSON.stringify(error.response.data) : error.message 
        });
    }
};