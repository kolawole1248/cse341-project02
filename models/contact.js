module.exports = (mongoose) => {
  const Contact = mongoose.model(
    'contacts',
    mongoose.Schema(
      {
        firstName: {
          type: String,
          required: [true, 'First name is required'],
          trim: true
        },
        lastName: {
          type: String,
          required: [true, 'Last name is required'],
          trim: true
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          lowercase: true,
          trim: true
        },
        favoriteColor: {
          type: String,
          required: [true, 'Favorite color is required'],
          trim: true
        },
        birthday: {
          type: Date,
          required: [true, 'Birthday is required']
        }
      },
      { 
        timestamps: true,
        toJSON: {
          virtuals: true,
          transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            ret.birthday = ret.birthday.toISOString().split('T')[0];
            return ret;
          }
        }
      }
    )
  );

  return Contact;
};