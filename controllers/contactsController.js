const Contact = require('../models/contact');

const contactsController = {
    // GET /contacts - Get all contacts
    getAllContacts: async (req, res) => {
        try {
            const contacts = await Contact.getAll();
            const contactsJSON = contacts.map(contact => contact.toJSON());
            
            res.json({
                success: true,
                count: contactsJSON.length,
                data: contactsJSON
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
            
            if (!contactId || contactId.length !== 24) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid contact ID format'
                });
            }
            
            const contact = await Contact.getById(contactId);
            
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    error: 'Contact not found',
                    message: `No contact found with ID: ${contactId}`
                });
            }
            
            res.json({
                success: true,
                data: contact.toJSON()
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
    
    // POST /contacts - Create new contact (Week 2)
    createContact: async (req, res) => {
        // Will be implemented in Week 2
        res.status(501).json({
            success: false,
            error: 'Not implemented yet',
            message: 'POST endpoint will be implemented in Week 2'
        });
    },
    
    // PUT /contacts/:id - Update contact (Week 2)
    updateContact: async (req, res) => {
        // Will be implemented in Week 2
        res.status(501).json({
            success: false,
            error: 'Not implemented yet',
            message: 'PUT endpoint will be implemented in Week 2'
        });
    },
    
    // DELETE /contacts/:id - Delete contact (Week 2)
    deleteContact: async (req, res) => {
        // Will be implemented in Week 2
        res.status(501).json({
            success: false,
            error: 'Not implemented yet',
            message: 'DELETE endpoint will be implemented in Week 2'
        });
    }
};

module.exports = contactsController;