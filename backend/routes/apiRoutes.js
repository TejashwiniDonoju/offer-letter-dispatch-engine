const express = require('express');
const router = express.Router();
const dispatchController = require('../controllers/dispatchController');

// 🌟 NEW: Google OAuth Endpoint (Maps to POST http://localhost:5000/api/auth/google)
router.post('/auth/google', dispatchController.googleLogin);

// 🔒 Legacy Standard Fallback Email/Password Login
router.post('/login', dispatchController.login);

// 📋 Candidate Database Storage Matrices
router.post('/candidates', dispatchController.saveCandidates); // Uses your existing function name!
router.get('/candidates', dispatchController.getCandidates);
router.put('/candidates/:id', dispatchController.updateCandidate);

// ✉️ Automated Document Dispatch Pipeline Engine
router.post('/dispatch', dispatchController.dispatchLetter);

module.exports = router;