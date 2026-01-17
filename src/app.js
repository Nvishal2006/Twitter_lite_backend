const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tweets', require('./routes/tweetRoutes'));
app.use('/api/users', require('./routes/userRoutes'));



app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
