const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const shortUrlRoutes = require('./routes/shortUrlRoutes');
const logger = require('./middleware/logger');

dotenv.config();
const app = express();
app.use(express.json());
app.use(logger);

app.use('/shorturls', shortUrlRoutes);
app.use('/:shortcode', require('./routes/redirectRoute'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log('Server running...');
        });
    })
    .catch((err) => console.error(err));