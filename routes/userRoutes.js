const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create User (Registration)
router.post('/create', userController.createUser);

// Read User (Get Profile by ID)
router.get('/all', userController.getAllUsers);

router.get('/:id', userController.getUser);

// Update User (Edit Profile)
router.put('/:id', userController.updateUser);

// Delete User
router.delete('/:id', userController.deleteUser);

module.exports = router;