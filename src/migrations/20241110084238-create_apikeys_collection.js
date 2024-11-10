'use strict';

module.exports = {
  async up(db, client) {
    const apiKeySchema = {
      bsonType: 'object',
      required: ['key', 'permissions'], // 'key' and 'permissions' are required
      properties: {
        key: {
          bsonType: 'string',
          description: 'API key must be a string and is required',
        },
        status: {
          bsonType: 'bool',
          description: 'status must be a boolean and is optional',
        },
        permissions: {
          bsonType: 'array',
          description:
            'permissions must be an array of strings and is required',
          items: {
            bsonType: 'string',
            enum: ['0000', '1111', '2222'], // Enum values for permissions
          },
        },
      },
    };

    // Create the 'Apikeys' collection with schema validation
    await db.createCollection('Apikeys', {
      validator: {
        $jsonSchema: apiKeySchema,
      },
    });

    console.log(
      'Migration applied: Created Apikeys collection with validation'
    );
  },

  async down(db, client) {
    // Drop the 'Apikeys' collection
    await db.collection('Apikeys').drop();
    console.log('Migration rolled back: Dropped Apikeys collection');
  },
};
