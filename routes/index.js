// routes/index.js - UPDATED FOR RENDER
const express = require('express');
const router = express.Router();

// Import contact routes
const contactRoutes = require('./contacts');

// Mount contact routes
router.use('/contacts', contactRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Information
 *     tags: [API]
 *     description: Get API information and available endpoints
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 api:
 *                   type: string
 *                 version:
 *                   type: string
 *                 description:
 *                   type: string
 *                 documentation:
 *                   type: string
 *                 endpoints:
 *                   type: object
 *                 database:
 *                   type: string
 *                 required_fields:
 *                   type: array
 *                   items:
 *                     type: string
 *                 note:
 *                   type: string
 */
router.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const apiDocsUrl = `${baseUrl}/api-docs`;
  
  res.json({
    api: 'Contacts API',
    version: '1.0.0',
    description: 'API for managing contact information - CSE341 Project',
    documentation: apiDocsUrl,
    endpoints: {
      contacts: {
        get_all: 'GET /contacts',
        get_by_id: 'GET /contacts/{id}',
        create: 'POST /contacts',
        update: 'PUT /contacts/{id}',
        delete: 'DELETE /contacts/{id}'
      },
      api: {
        documentation: 'GET /api-docs',
        health_check: 'GET /health'
      }
    },
    database: 'MongoDB Atlas',
    required_fields: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
    note: 'All fields are required when creating a contact',
    status: 'operational',
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;