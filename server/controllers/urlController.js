const ShortUrl = require('../models/ShortUrl');
const { nanoid } = require('nanoid');
const Joi = require('joi');

const schema = Joi.object({
    originalUrl: Joi.string().uri().required(),
    shortcode: Joi.string().alphanum().min(4).max(10),
    validForMinutes: Joi.number().integer().positive()
});

exports.createShortUrl = async (req, res) => {
    try {
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        let { originalUrl, shortcode, validForMinutes } = value;
        if (!shortcode) {
            let unique = false;
            while (!unique) {
                shortcode = nanoid(6);
                const existing = await ShortUrl.findOne({ shortcode });
                if (!existing) unique = true;
            }
        } else {
            const existing = await ShortUrl.findOne({ shortcode });
            if (existing) return res.status(409).json({ error: 'Shortcode already exists' });
        }

        const newShort = new ShortUrl({
            originalUrl,
            shortcode,
            validForMinutes: validForMinutes || 30
        });

        await newShort.save();
        res.status(201).json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortcode}` });

    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.redirectToOriginal = async (req, res) => {
    try {
        const { shortcode } = req.params;
        const record = await ShortUrl.findOne({ shortcode });
        if (!record) return res.status(404).json({ error: 'Shortcode not found' });

        const now = new Date();
        const expiry = new Date(record.createdAt.getTime() + record.validForMinutes * 60000);
        if (now > expiry) return res.status(410).json({ error: 'Short URL has expired' });

        res.redirect(record.originalUrl);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};