// controllers/contactsController.js - SIMPLIFIED VERSION
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

let db;
let client;

// Initialize MongoDB connection
async function initDB() {
  if (!db && process.env.MONGODB_URI) {
    try {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      db = client.db();
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
    }
  }
  return db;
}

// Get database instance
async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}

const contactsController = {
    // GET /contacts - Get all contacts
    getAllContacts: async (req, res) => {
        try {
            const database = await getDB();
            if (!database) {
                return res.status(500).json({
                    success: false,
                    error: 'Database not available'
                });
            }
            
            const contacts = await database.collection('contacts').find({}).toArray();
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
                data: formattedContacts
            });
        } catch (error) {
            console.error('Error getting all contacts:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch contacts',
                message: error.message
            });
        }
    },
    
    // GET /contacts/:id - Get single contact
    getSingleContact: async (req, res) => {
        try {
            const contactId = req.params.id;
            
            if (!contactId || !ObjectId.isValid(contactId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid contact ID format'
                });
            }
            
            const database = await getDB();
            if (!database) {
                return res.status(500).json({
                    success: false,
                    error: 'Database not available'
                });
            }
            
            const contact = await database.collection('contacts').findOne({ 
                _id: new ObjectId(contactId) 
            });
            
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    error: 'Contact not found',
                    message: `No contact found with ID: ${contactId}`
                });
            }
            
            const formattedContact = {
                id: contact._id.toString(),
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                favoriteColor: contact.favoriteColor,
                birthday: contact.birthday
            };
            
            res.json({
                success: true,
                data: formattedContact
            });
        } catch (error) {
            console.error('Error getting single contact:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch contact',
                message: error.message
            });
        }
    },
    
    // POST /contacts - Create new contact
    createContact: async (req, res) => {
        try {
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
            const missingFields = [];
            
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    missingFields.push(field);
                }
            }
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
                    message: `The following fields are required: ${missingFields.join(', ')}`
                });
            }
            
            const database = await getDB();
            if (!database) {
                return res.status(500).json({
                    success: false,
                    error: 'Database not available'
                });
            }
            
            // Check if email already exists
            const existingContact = await database.collection('contacts').findOne({ 
                email: req.body.email.toLowerCase() 
            });
            
            if (existingContact) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already exists'
                });
            }
            
            // Create contact
            const contactData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email.toLowerCase(),
                favoriteColor: req.body.favoriteColor,
                birthday: req.body.birthday,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await database.collection('contacts').insertOne(contactData);
            
            const newContact = {
                id: result.insertedId.toString(),
                ...contactData
            };
            
            res.status(201).json({
                success: true,
                message: 'Contact created successfully',
                id: result.insertedId.toString(),
                data: newContact
            });
        } catch (error) {
            console.error('Error creating contact:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create contact',
                message: error.message
            });
        }
    },
    
    // PUT /contacts/:id - Update contact
    updateContact: async (req, res) => {
        try {
            const contactId = req.params.id;
            
            if (!contactId || !ObjectId.isValid(contactId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid contact ID format'
                });
            }
            
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Data to update can not be empty!'
                });
            }
            
            const database = await getDB();
            if (!database) {
                return res.status(500).json({
                    success: false,
                    error: 'Database not available'
                });
            }
            
            // Check if contact exists
            const existingContact = await database.collection('contacts').findOne({ 
                _id: new ObjectId(contactId) 
            });
            
            if (!existingContact) {
                return res.status(404).json({
                    success: false,
                    error: 'Contact not found',
                    message: `Cannot update contact with id=${contactId}. Contact not found!`
                });
            }
            
            // If email is being updated, check if new email already exists
            if (req.body.email && req.body.email !== existingContact.email) {
                const emailExists = await database.collection('contacts').findOne({ 
                    email: req.body.email.toLowerCase(),
                    _id: { $ne: new ObjectId(contactId) }
                });
                
                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        error: 'Email already exists'
                    });
                }
                req.body.email = req.body.email.toLowerCase();
            }
            
            // Update contact
            const updateData = {
                ...req.body,
                updatedAt: new Date()
            };
            
            const result = await database.collection('contacts').updateOne(
                { _id: new ObjectId(contactId) },
                { $set: updateData }
            );
            
            // Get updated contact
            const updatedContact = await database.collection('contacts').findOne({ 
                _id: new ObjectId(contactId) 
            });
            
            const formattedContact = {
                id: updatedContact._id.toString(),
                firstName: updatedContact.firstName,
                lastName: updatedContact.lastName,
                email: updatedContact.email,
                favoriteColor: updatedContact.favoriteColor,
                birthday: updatedContact.birthday
            };
            
            res.json({
                success: true,
                message: 'Contact updated successfully',
                data: formattedContact
            });
        } catch (error) {
            console.error('Error updating contact:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update contact',
                message: error.message
            });
        }
    },
    
    // DELETE /contacts/:id - Delete contact
    deleteContact: async (req, res) => {
        try {
            const contactId = req.params.id;
            
            if (!contactId || !ObjectId.isValid(contactId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid contact ID format'
                });
            }
            
            const database = await getDB();
            if (!database) {
                return res.status(500).json({
                    success: false,
                    error: 'Database not available'
                });
            }
            
            // Check if contact exists
            const existingContact = await database.collection('contacts').findOne({ 
                _id: new ObjectId(contactId) 
            });
            
            if (!existingContact) {
                return res.status(404).json({
                    success: false,
                    error: 'Contact not found',
                    message: `Cannot delete contact with id=${contactId}. Contact not found!`
                });
            }
            
            // Delete contact
            await database.collection('contacts').deleteOne({ 
                _id: new ObjectId(contactId) 
            });
            
            const formattedContact = {
                id: existingContact._id.toString(),
                firstName: existingContact.firstName,
                lastName: existingContact.lastName,
                email: existingContact.email,
                favoriteColor: existingContact.favoriteColor,
                birthday: existingContact.birthday
            };
            
            res.json({
                success: true,
                message: 'Contact deleted successfully',
                data: formattedContact
            });
        } catch (error) {
            console.error('Error deleting contact:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete contact',
                message: error.message
            });
        }
    }
};

module.exports = contactsController;