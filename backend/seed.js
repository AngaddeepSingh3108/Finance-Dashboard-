const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config({ path: './.env' });

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete existing users to prevent duplicate emails
        await User.deleteMany();

        // Create the 3 base users
        await User.create([
            { name: 'Admin User', email: 'admin@finance.com', role: 'Admin' },
            { name: 'Analyst User', email: 'analyst@finance.com', role: 'Analyst' },
            { name: 'Viewer User', email: 'viewer@finance.com', role: 'Viewer' }
        ]);

        console.log('Database successfully seeded with Admin, Analyst, and Viewer accounts!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
