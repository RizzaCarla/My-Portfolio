import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'PortfolioDatabase',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'rizza' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const adminUser = new User({
      username: 'rizza',
      password: 'admin2024!', // This will be hashed automatically
      name: 'Rizza Marzo',
      role: 'admin',
      isActive: true
    });
    
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('Username: rizza');
    console.log('Password: admin2024!');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();