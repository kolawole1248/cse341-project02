// swagger.js
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contact information',
    version: '1.0.0',
    contact: {
      name: 'Student Name',
      email: 'student@byui.edu'
    }
  },
  host: 'localhost:8080',
  schemes: ['http'],
  basePath: '/',
  tags: [
    {
      name: 'Contacts',
      description: 'Contact operations'
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
            type: 'string',
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
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            description: 'Error message'
          },
          message: {
            type: 'string',
            description: 'Detailed error message'
          }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
// IMPORTANT: Include both route files
const endpointsFiles = ['./routes/index.js', './routes/contacts.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  console.log('📄 File created: swagger-output.json');
  console.log('🔗 Swagger UI will be available at: http://localhost:8080/api-docs');
}).catch((error) => {
  console.error('❌ Error generating Swagger documentation:', error);
});