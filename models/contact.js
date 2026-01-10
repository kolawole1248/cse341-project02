const { ObjectId } = require('mongodb');
const { getDatabase } = require('./mongoConnection');

class Contact {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.favoriteColor = data.favoriteColor;
        this.birthday = data.birthday;
        
        if (data._id) {
            this._id = data._id;
        }
    }
    
    // Get all contacts
    static async getAll() {
        const db = getDatabase();
        const contacts = await db.collection('contacts').find({}).toArray();
        return contacts.map(contact => new Contact(contact));
    }
    
    // Get single contact by ID
    static async getById(id) {
        const db = getDatabase();
        try {
            const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
            return contact ? new Contact(contact) : null;
        } catch (error) {
            if (error.message.includes('ObjectId')) {
                return null;
            }
            throw error;
        }
    }
    
    // Save contact (will be used in Week 2)
    async save() {
        const db = getDatabase();
        const contactData = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            favoriteColor: this.favoriteColor,
            birthday: this.birthday
        };
        
        if (this._id) {
            // Update existing contact
            await db.collection('contacts').updateOne(
                { _id: new ObjectId(this._id) },
                { $set: contactData }
            );
        } else {
            // Insert new contact
            const result = await db.collection('contacts').insertOne(contactData);
            this._id = result.insertedId;
        }
        
        return this;
    }
    
    // Delete contact (will be used in Week 2)
    static async deleteById(id) {
        const db = getDatabase();
        const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
    
    // Convert to JSON
    toJSON() {
        return {
            id: this._id ? this._id.toString() : undefined,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            favoriteColor: this.favoriteColor,
            birthday: this.birthday
        };
    }
}

module.exports = Contact;