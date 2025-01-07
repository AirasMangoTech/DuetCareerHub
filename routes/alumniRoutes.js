const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');

// Create Alumni (Register)
router.post('/create', alumniController.createAlumni);


router.get('/all', alumniController.getAllAlumni);
// Read Alumni (Get Alumni by ID)
router.get('/:id', alumniController.getAlumni);

// Update Alumni
router.put('/:id', alumniController.updateAlumni);

// Delete Alumni
router.delete('/:id', alumniController.deleteAlumni);

module.exports = router;