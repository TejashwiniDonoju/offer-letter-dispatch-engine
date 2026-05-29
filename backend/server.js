const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Initialize Database connection
connectDB();

// Handle CORS cross-origin allowances
app.use(cors({ 
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    credentials: true 
}));

// Crucial: Parse incoming JSON body payloads
app.use(express.json());

// Bind our API router under /api
app.use('/api', apiRoutes);

// Catch-all route to print a warning if a URL is misspelled
app.use((req, res) => {
    console.log(`⚠️ Frontend tried to hit a non-existent URL: ${req.method} ${req.url}`);
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found on this server.` });
});

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server executing safely on port ${PORT}`));