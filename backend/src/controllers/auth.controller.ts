import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
