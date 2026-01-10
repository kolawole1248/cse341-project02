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
    
    static async getAll() {
        try {
            const db = getDatabase();
            const contacts = await db.collection('contacts').find({}).toArray();
            return contacts.map(contact => new Contact(contact));
        } catch (error) {
            console.error('Database error in getAll:', error.message);
            // Return empty array for now
            return [];
        }
    }
    
    static async getById(id) {
        try {
            const db = getDatabase();
            
            if (!ObjectId.isValid(id)) {
                return null;
            }
            
            const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
            return contact ? new Contact(contact) : null;
        } catch (error) {
            console.error('Database error in getById:', error.message);
            return null;
        }
    }
    
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