
const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logout, getUserById} = require('../Controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser)
router.post('/login', logout)
router.get('/users/:id', getUserById)


module.exports = router;