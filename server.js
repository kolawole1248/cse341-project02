// server.js - UPDATED FOR RENDER
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Load environment variables
require('dotenv').config();

// Import Swagger UI
const swaggerUi = require('swagger-ui-express');
let swaggerDocument;

try {
  swaggerDocument = require('./swagger-output.json');
  
  // Update Swagger host dynamically for Render
  if (process.env.RENDER_EXTERNAL_URL) {
    const renderHost = new URL(process.env.RENDER_EXTERNAL_URL).host;
    swaggerDocument.host = renderHost;
    swaggerDocument.schemes = ['https'];
    console.log(`🌐 Swagger configured for Render: ${renderHost}`);
  }
  
  console.log('✅ Swagger documentation loaded');
} catch (error) {
  console.warn('⚠️  Swagger documentation not found. Run: npm run swagger');
  swaggerDocument = { 
    info: { 
      title: 'Contacts API', 
      version: '1.0.0',
      description: 'API documentation'
    } 
  };
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Documentation - FIXED PATH
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve Swagger JSON
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
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Contacts API is running!',
      note: 'Routes not loaded properly'
    });
  });
}

// MongoDB connection status
if (process.env.MONGODB_URI) {
  console.log('📊 MongoDB URI configured');
  
  // Test MongoDB connection
  const { MongoClient } = require('mongodb');
  async function testMongoDB() {
    try {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      console.log('✅ MongoDB connection test successful');
      await client.close();
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
    }
  }
  testMongoDB();
} else {
  console.log('⚠️  MONGODB_URI not found in environment variables');
}

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Contacts API Server Started');
  console.log('='.repeat(60));
  
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`🌐 Production URL: ${process.env.RENDER_EXTERNAL_URL}`);
    console.log(`📚 Swagger UI: ${process.env.RENDER_EXTERNAL_URL}/api-docs`);
  } else {
    console.log(`🏠 Local URL: http://localhost:${PORT}`);
    console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  }
  
  console.log(`🔧 API Root: /`);
  console.log(`📇 Contacts API: /contacts`);
  console.log('='.repeat(60) + '\n');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: {
      root: 'GET /',
      getAllContacts: 'GET /contacts',
      getContactById: 'GET /contacts/:id',
      createContact: 'POST /contacts',
      updateContact: 'PUT /contacts/:id',
      deleteContact: 'DELETE /contacts/:id',
      apiDocs: 'GET /api-docs',
      healthCheck: 'GET /health'
    }
  });
});

module.exports = app;