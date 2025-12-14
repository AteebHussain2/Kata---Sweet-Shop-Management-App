import connectDB from './lib/connectDB';
import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config();

const promoteUser = async () => {
    console.log("Starting script...");
    try {
        connectDB();

        const users = await User.find({});
        console.log("Found users:", users.map(u => ({ u: u.username, e: u.email, r: u.role })));

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
