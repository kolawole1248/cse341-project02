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
  schemes: ['http', 'https'],
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
          },
          id: {
            type: 'string',
            description: 'Auto-generated contact ID'
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
const endpointsFiles = ['./routes/contacts.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  console.log('📄 File created: swagger-output.json');
}).catch((error) => {
  console.error('❌ Error generating Swagger documentation:', error);
});