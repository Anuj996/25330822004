const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortcode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    validForMinutes: { type: Number, default: 30 },
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);