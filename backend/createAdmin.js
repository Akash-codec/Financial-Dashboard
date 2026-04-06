const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    let adminUser = await User.findOne({ email: 'admin@findash.com' });
    
    if (adminUser) {
      console.log('Admin user already exists in the database.');
    } else {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@findash.com',
        password: 'AdminPassword123!',
        role: 'admin'
      });
      console.log('Admin user forcefully injected into the database.');
    }
    
    console.log('Admin Credentials:');
    console.log('Email: admin@findash.com');
    console.log('Password: AdminPassword123!');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();
