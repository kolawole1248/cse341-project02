// server.js - UPDATED VERSION
const express = require('express');
const cors = require('cors');
const app = express();

// Import Swagger UI
const swaggerUi = require('swagger-ui-express');
let swaggerDocument;

try {
  swaggerDocument = require('./swagger-output.json');
  console.log('✅ Swagger documentation loaded');
} catch (error) {
  console.warn('⚠️  Swagger documentation not found. Run: npm run swagger');
  swaggerDocument = { 
    info: { 
      title: 'Contacts API', 
      version: '1.0.0',
      description: 'API documentation not generated. Run: npm run swagger'
    } 
  };
}

// Initialize contacts controller to setup database connection
const contactsController = require('./controllers/contactsController');

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve Swagger JSON file
app.get('/swagger-output.json', (req, res) => {
  try {
    res.json(swaggerDocument);
  } catch (error) {
    res.status(404).json({ error: 'Swagger documentation not found' });
  }
});

// Import and use routes
try {
  const routes = require('./routes');
  app.use('/', routes);
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  // Simple fallback route
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Contacts API is running!',
      error: 'Routes not loaded properly',
      available: '/api-docs'
    });
  });
}

// MongoDB connection info
require('dotenv').config();
if (process.env.MONGODB_URI) {
  console.log('📊 MongoDB URI configured');
} else {
  console.log('⚠️  MONGODB_URI not found in .env - using default');
  console.log('💡 Create a .env file with: MONGODB_URI=mongodb://localhost:27017/contactsDB');
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Contacts API Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`🔧 API Root: http://localhost:${PORT}/`);
  console.log(`📇 Contacts API: http://localhost:${PORT}/contacts`);
  console.log('='.repeat(50) + '\n');
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler - MUST BE LAST MIDDLEWARE
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: {
      root: 'GET /',
      getAllContacts: 'GET /contacts',
      getSingleContact: 'GET /contacts/:id',
      createContact: 'POST /contacts',
      updateContact: 'PUT /contacts/:id',
      deleteContact: 'DELETE /contacts/:id',
      documentation: 'GET /api-docs'
    }
  });
});

module.exports = app;