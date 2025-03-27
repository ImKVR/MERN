// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

// Initialize Express application
const app = express();
const PORT = 3000;

// Middleware to log incoming requests
app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile(path.join(__dirname, 'server.log'), log, (err) => {
        if (err) {
            console.error('Failed to write to log file');
        }
    });
    console.log(log.trim());
    next();
});

// Homepage route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Full Stack Development Rethik!!</h1>');
});

// About page route
app.get('/about', (req, res) => {
    res.send('<h1>About This Application</h1><p>This is a simple Express.js application.</p>');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
