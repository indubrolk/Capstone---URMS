import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'URMS Backend is running' });
});

// Import and use routes here
// app.use('/api/users', userRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

export default app;
