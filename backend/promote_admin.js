
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const promoteUser = async () => {
    console.log("Starting JS script...");
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/kata';
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("Connected.");

        const users = await User.find({});
        console.log("Found users (JS):", users.map(u => ({ u: u.username, e: u.email, r: u.role })));

        const user = await User.findOne({ username: 'adminsuper' });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log('User promoted to admin successfully.');
        } else {
            console.log('User "adminsuper" not found.');
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Done.");
    }
};

promoteUser();
