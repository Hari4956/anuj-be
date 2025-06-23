const express = require('express');
const { login, logout, userProfile } = require('../../controller/Auth/userController');
const { jwtVerification } = require('../../middleware/JwtVerfication');

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout)
router.get('/profile', jwtVerification, userProfile)

module.exports = router;