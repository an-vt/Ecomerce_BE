module.exports = {
  async up(db, client) {
    const userSchema = {
      bsonType: 'object',
      required: ['usr_id', 'usr_slug', 'usr_email'],
      properties: {
        usr_id: {
          bsonType: 'int',
          description: 'must be an integer and is required',
        },
        usr_slug: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        usr_name: {
          bsonType: 'string',
          description: 'must be a string',
        },
        usr_password: {
          bsonType: 'string',
          description: 'must be a string',
        },
        usr_salt: {
          bsonType: 'string',
          description: 'must be a string',
        },
        usr_email: {
          bsonType: 'string',
          description: 'must be a string and is required',
          pattern: '^.+@.+$', // Simple email validation
        },
        usr_phone: {
          bsonType: 'string',
          description: 'must be a string',
        },
        usr_sex: {
          bsonType: 'string',
          description: 'must be a string',
        },
        usr_avatar: {
          bsonType: 'string',
          description: 'must be a string',
        },
        usr_date_of_birth: {
          bsonType: 'date',
          description: 'must be a date',
        },
        usr_role: {
          bsonType: 'objectId',
          description: 'must be an ObjectId reference',
        },
        usr_status: {
          bsonType: 'string',
          enum: ['pending', 'active', 'block'],
          description: "must be one of 'pending', 'active', 'block'",
        },
      },
    };

    // Create the 'users' collection with validation
    await db.createCollection('Users', {
      validator: {
        $jsonSchema: userSchema,
      },
    });

    console.log('Migration applied: Created users collection with validation');
  },

  async down(db, client) {
    // Drop the 'Users' collection
    await db.collection('Users').drop();
    console.log('Migration rolled back: Dropped users collection');
  },
};
