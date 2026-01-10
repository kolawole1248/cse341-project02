const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

// GET all contacts
router.get('/', contactsController.getAllContacts);

// GET single contact by ID
router.get('/:id', contactsController.getSingleContact);

// POST create new contact (Week 2 - placeholder)
router.post('/', (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Not implemented yet',
        message: 'POST endpoint will be implemented in Week 2'
    });
});

// PUT update contact (Week 2 - placeholder)
router.put('/:id', (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Not implemented yet',
        message: 'PUT endpoint will be implemented in Week 2'
    });
});

// DELETE contact (Week 2 - placeholder)
router.delete('/:id', (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Not implemented yet',
        message: 'DELETE endpoint will be implemented in Week 2'
    });
});

// Make sure you're exporting the router, not an object
module.exports = router;