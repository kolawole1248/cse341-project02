// routes/index.js
const express = require('express');
const router = express.Router();

// Import contact routes
const contactRoutes = require('./contacts');

// Mount contact routes
router.use('/contacts', contactRoutes);

// Root route
router.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    api: 'Contacts API',
    version: '1.0.0',
    description: 'API for managing contact information',
    documentation: `${baseUrl}/api-docs`,
    endpoints: {
      contacts: {
        get_all: 'GET /contacts',
        get_by_id: 'GET /contacts/:id',
        create: 'POST /contacts',
        update: 'PUT /contacts/:id',
        delete: 'DELETE /contacts/:id'
      }
    },
    database: 'MongoDB',
    required_fields: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
    note: 'All fields are required when creating a contact'
  });
});

module.exports = router;