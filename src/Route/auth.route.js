const express = require('express')
const { signin, signup, validateUser } = require('../Controller/auth.controller');
const isAuthenticated = require('../Middleware/auth.middleware');

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/validate', isAuthenticated, validateUser);

module.exports = router;