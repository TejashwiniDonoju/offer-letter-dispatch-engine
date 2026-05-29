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

// 🚀 PDF GENERATION ENGINE ROUTE (Placed dynamically before catch-all endpoints)
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const { htmlContent } = req.body;
        
        if (!htmlContent) {
            return res.status(400).json({ error: "Missing rich HTML string data payload." });
        }
        
        // Launch a headless browser instance on the server
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required flags for cloud environments like Render
        });
        const page = await browser.newPage();
        
        // Set the HTML content provided by the frontend
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        // Generate the PDF buffer
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        
        await browser.close();
        
        // Stream the binary buffer cleanly back to the client container UI
        res.contentType("application/pdf");
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Puppeteer engine failure:", error);
        res.status(500).json({ error: "Error generating PDF document vector assets.", details: error.message });
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