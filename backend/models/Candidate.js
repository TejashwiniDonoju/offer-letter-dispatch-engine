const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: '' },
    salary: { type: String, default: '' }
}, { 
    timestamps: true, 
    strict: false // Allows extra custom columns from your CSV to be saved seamlessly
});

module.exports = mongoose.model('Candidate', CandidateSchema);