const express = require('express');
const cors = require('cors');
require('dotenv').config();
const puppeteer = require('puppeteer'); // 🌟 Moved up with the other imports
const connectDB = require('./config/db.js');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Initialize Database connection
connectDB();

// Handle CORS cross-origin allowances
app.use(cors({ 
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

// Crucial: Parse incoming JSON body payloads
app.use(express.json());

// Bind our main API router under /api
app.use('/api', apiRoutes);

// 🚀 Completely replace your /api/generate-pdf block inside server.js with this:
app.post('/api/generate-pdf', async (req, res) => {
    let browser = null;
    try {
        const { htmlContent } = req.body;
        
        if (!htmlContent) {
            return res.status(400).json({ error: "Missing rich HTML string data payload." });
        }
        
        console.log("🎬 Launching hardened Puppeteer core cluster...");
        
        browser = await puppeteer.launch({
            // Force execution via Render's native binary location if deployed, otherwise fall back to local
            executablePath: process.env.NODE_ENV === 'production' 
                ? '/usr/bin/chromium-browser' 
                : undefined,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',      // 🧠 Mandatory: Forces Puppeteer to use RAM instead of disk cache allocations
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',                // ⚡ Critical: Render has no physical graphics card hardware
                '--no-first-run',
                '--no-zygote',
                '--single-process'              // 📉 Minimizes RAM usage to prevent free-tier memory exhaustion leaks
            ]
        });

        const page = await browser.newPage();
        
        // Block heavy resources like animations to speed up compilation time
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.continue();
            } else if (req.resourceType() === 'script') {
                req.abort(); // Block malicious javascript script injections
            } else {
                req.continue();
            }
        });

        // Load the compiled frontend layout
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 20000 });
        
        // Emulate true digital print media screen properties
        await page.emulateMediaType('screen');
        
        console.log("📄 Vectorizing HTML coordinates into clean PDF binary buffers...");
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });
        
        await browser.close();
        console.log("🏁 Compilation sequence fully complete. Sending binary stream payload stream downstream.");
        
        // Stream the true binary vector document back to the React app
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Offer_Letter.pdf');
        return res.send(pdfBuffer);

    } catch (error) {
        console.error("🚨 CRITICAL PUPPETEER EXCEPTION PIPELINE CRASH:", error.message);
        
        // Clean up the running browser thread context if it hung open
        if (browser !== null) {
            await browser.close();
        }
        
        return res.status(500).json({ 
            error: "Error generating PDF document vector assets.", 
            details: error.message 
        });
    }
});

// Catch-all route to print a warning if a URL is misspelled
app.use((req, res) => {
    console.log(`⚠️ Frontend tried to hit a non-existent URL: ${req.method} ${req.url}`);
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found on this server.` });
});

// Start listening for inbound pipeline data requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server executing safely on port ${PORT}`));