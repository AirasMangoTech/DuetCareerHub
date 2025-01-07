const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Create Admin (Register)
router.post('/create', adminController.createAdmin);


router.get('/all', adminController.getAllAdmins); ;
// Read Admin (Get Admin by ID)

router.get('/:id', adminController.getAdmin);

// Update Admin
router.put('/:id', adminController.updateAdmin);

// Delete Admin
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;