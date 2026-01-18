// swagger.js - CORRECTED VERSION
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

// Get the base URL from environment or use localhost
const isProduction = process.env.NODE_ENV === 'production';
const renderUrl = process.env.RENDER_EXTERNAL_URL;
const localUrl = 'localhost:8080';

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contact information - CSE341 Project',
    version: '1.0.0',
    contact: {
      name: 'Student Name',
      email: 'student@byui.edu'
    }
  },
  host: isProduction ? (renderUrl ? new URL(renderUrl).host : 'your-render-app.onrender.com') : localUrl,
  schemes: isProduction ? ['https'] : ['http'],
  basePath: '/',
  tags: [
    {
      name: 'Contacts',
      description: 'Contact operations'
    },
    {
      name: 'API',
      description: 'API Information'
    }
  ],
  components: {
    schemas: {
      Contact: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
        properties: {
          id: {
            type: 'string',
            description: 'Auto-generated contact ID',
            readOnly: true
          },
          firstName: {
            type: 'string',
            example: 'John',
            description: 'First name of the contact'
          },
          lastName: {
            type: 'string',  // FIXED: Added quotes around 'string'
            example: 'Doe',
            description: 'Last name of the contact'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'Email address of the contact'
          },
          favoriteColor: {
            type: 'string',
            example: 'Blue',
            description: 'Favorite color of the contact'
          },
          birthday: {
            type: 'string',
            format: 'date',
            example: '1990-01-15',
            description: 'Birthday in YYYY-MM-DD format'
          }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js', './routes/contacts.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  if (isProduction && renderUrl) {
    console.log(`🌐 Production URL: ${renderUrl}`);
    console.log(`📚 Swagger UI: ${renderUrl}/api-docs`);
  } else {
    console.log(`🏠 Local URL: http://${localUrl}/api-docs`);
  }
}).catch((error) => {
  console.error('❌ Error generating Swagger documentation:', error);
});