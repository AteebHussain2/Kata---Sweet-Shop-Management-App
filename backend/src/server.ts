import 'dotenv/config';
import connectDB from '../lib/connectDB';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import sweetRoutes from './routes/sweet.routes';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());

try {
    connectDB();
} catch (error) {
    console.error('Error connecting to database:', error);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.get('/', (req: Request, res: Response) => {
    res.send('Sweet Shop API is running');
});

// Start Server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;
