const express = require('express');
const isAuthenticated  = require('../Middleware/auth.middleware');
const authRouter = require('./auth.route');
const photoRouter = require('./photos.route');
const uploadRouter = require('./upload.route');

const app = express();

app.use('/auth', authRouter);
app.use('/photo', isAuthenticated, photoRouter);
app.use('/upload', isAuthenticated, uploadRouter);

module.exports = app;