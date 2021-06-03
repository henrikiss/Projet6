const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const xssAuth = require("../middleware/xss-auth.js");

router.post('/signup',xssAuth, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;