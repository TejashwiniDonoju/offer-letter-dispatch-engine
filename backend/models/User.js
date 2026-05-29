const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // Optional for Google OAuth users
    googleId: { type: String }, // Stores the unique Google Sub-ID
    picture: { type: String },
    role: { type: String, default: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);