const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);

// Route protégée : yelzem un token valide
router.get('/me', protect, me)

module.exports = router;