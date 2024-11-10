require('dotenv').config();
const mongoose = require('mongoose');
const apiKeyModel = require('../models/apiKey.model');
const {
  db: { host, name, port },
} = require('../configs/config');

const connectString = `mongodb://${host}:${port}/${name}?authSource=admin`;

const API_KEY =
  '403a72ca498ac3d199ab073ff90f91d3522691be48231b39a3e33a2b3d8d75814b70f58299d3580bb19a1e9a91726fb6a9cb3edd0b9fedb67f00390b9f68e5d5';

async function resetDB() {
  // Connect to MongoDB
  await mongoose.connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Drop the database (use cautiously, this deletes all data)
  console.log(`Dropping database: ${name}...`);
  await mongoose.connection.dropDatabase();
  console.log(`Database ${name} reset successfully`);

  // Close the connection
  await mongoose.disconnect();
}

async function seedAdmin() {
  // Connect to the database
  await mongoose.connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Check if the admin API key already exists
  const existingApiKey = await apiKeyModel.findOne({
    key: API_KEY,
  });

  if (!existingApiKey) {
    // Create the admin API key
    await apiKeyModel.create({
      key: API_KEY,
      permissions: ['0000'], // Example permissions, adjust as needed
    });

    console.log(`API KEY ${API_KEY} created successfully`);
  } else {
    console.log('API KEY already exists');
  }

  // Close the database connection
  await mongoose.disconnect();
}

// Execute the reset and seeding process
async function init() {
  try {
    // Reset the database (drop all collections)
    await resetDB();

    // Seed the admin data
    await seedAdmin();

    console.log('Init seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding process:', err);
    process.exit(1);
  }
}

init();
