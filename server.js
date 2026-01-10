const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
let mongoClient;

async function connectToMongoDB() {
    try {
        if (!process.env.MONGODB_URI) {
            console.log('⚠️  MONGODB_URI not found in .env - using mock data');
            return;
        }
        
        mongoClient = new MongoClient(process.env.MONGODB_URI);
        await mongoClient.connect();
        db = mongoClient.db();
        console.log('✅ Connected to MongoDB');
        
        // Create contacts collection if it doesn't exist
        const collections = await db.listCollections({ name: 'contacts' }).toArray();
        if (collections.length === 0) {
            await db.createCollection('contacts');
            console.log('✅ Created contacts collection');
            
            // Add sample data if empty
            const count = await db.collection('contacts').countDocuments();
            if (count === 0) {
                await db.collection('contacts').insertMany([
                    {
                        firstName: "John",
                        lastName: "Doe",
                        email: "john.doe@example.com",
                        favoriteColor: "Blue",
                        birthday: "1990-01-15"
                    },
                    {
                        firstName: "Jane",
                        lastName: "Smith",
                        email: "jane.smith@example.com",
                        favoriteColor: "Green",
                        birthday: "1992-03-22"
                    },
                    {
                        firstName: "Bob",
                        lastName: "Johnson",
                        email: "bob.johnson@example.com",
                        favoriteColor: "Red",
                        birthday: "1988-07-10"
                    }
                ]);
                console.log('✅ Added sample contacts');
            }
        }
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('⚠️  Using mock data instead');
    }
}

// Mock data for when MongoDB is not available
const mockContacts = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        favoriteColor: 'Blue',
        birthday: '1990-01-15'
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        favoriteColor: 'Green',
        birthday: '1992-03-22'
    },
    {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        favoriteColor: 'Red',
        birthday: '1988-07-10'
    }
];

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Contacts API is running!',
        version: '1.0.0',
        database: db ? 'Connected to MongoDB' : 'Using mock data',
        endpoints: {
            getAllContacts: 'GET /contacts',
            getSingleContact: 'GET /contacts/:id',
            health: 'GET /health'
        }
    });
});

// Health endpoint
app.get('/health', async (req, res) => {
    if (db) {
        try {
            await db.command({ ping: 1 });
            res.json({
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.json({
                status: 'degraded',
                database: 'disconnected',
                timestamp: new Date().toISOString()
            });
        }
    } else {
        res.json({
            status: 'healthy',
            database: 'mock_data',
            timestamp: new Date().toISOString()
        });
    }
});

// GET all contacts
app.get('/contacts', async (req, res) => {
    try {
        if (db) {
            // Get from MongoDB
            const contacts = await db.collection('contacts').find({}).toArray();
            const formattedContacts = contacts.map(contact => ({
                id: contact._id.toString(),
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                favoriteColor: contact.favoriteColor,
                birthday: contact.birthday
            }));
            
            res.json({
                success: true,
                count: formattedContacts.length,
                data: formattedContacts,
                source: 'mongodb'
            });
        } else {
            // Use mock data
            res.json({
                success: true,
                count: mockContacts.length,
                data: mockContacts,
                source: 'mock_data'
            });
        }
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contacts'
        });
    }
});

// GET single contact by ID
app.get('/contacts/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        
        if (db) {
            // Try MongoDB
            if (!ObjectId.isValid(contactId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid contact ID format'
                });
            }
            
            const contact = await db.collection('contacts').findOne({ 
                _id: new ObjectId(contactId) 
            });
            
            if (contact) {
                res.json({
                    success: true,
                    data: {
                        id: contact._id.toString(),
                        firstName: contact.firstName,
                        lastName: contact.lastName,
                        email: contact.email,
                        favoriteColor: contact.favoriteColor,
                        birthday: contact.birthday
                    },
                    source: 'mongodb'
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Contact not found'
                });
            }
        } else {
            // Use mock data
            const contact = mockContacts.find(c => c.id === contactId);
            
            if (contact) {
                res.json({
                    success: true,
                    data: contact,
                    source: 'mock_data'
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Contact not found'
                });
            }
        }
    } catch (error) {
        console.error('Error getting contact:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contact'
        });
    }
});

// Week 2 endpoints (placeholders)
app.post('/contacts', (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Not implemented',
        message: 'POST endpoint will be implemented in Week 2'
    });
});

app.put('/contacts/:id', (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Not implemented',
        message: 'PUT endpoint will be implemented in Week 2'
    });
});

app.delete('/contacts/:id', (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Not implemented',
        message: 'DELETE endpoint will be implemented in Week 2'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The endpoint ${req.url} does not exist`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Start server
async function startServer() {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
        console.log(`✅ Contacts API running on http://localhost:${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️  Database: ${db ? 'MongoDB connected' : 'Mock data'}`);
    });
}

startServer();

module.exports = app;