
const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logout, getUserById,registerOwner, loginOwner} = require('../Controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser)
router.post('/logout', logout)
router.get('/users/:id', getUserById)
router.post('/registerOwner', registerOwner);
router.post('/loginOwner', loginOwner);


module.exports = router;
