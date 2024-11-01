const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);

module.exports = router;
