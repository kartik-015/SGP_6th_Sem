import dotenv from 'dotenv'
import { connectDb } from '../db/db.js'
import { app } from './app.js'
import { seedDefaultAdmin } from '../utils/seed.js'

// Load env from project root first, then fallback to backend/.env
dotenv.config({ path: '../.env' });
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await connectDb();
        await seedDefaultAdmin();

        app.listen(PORT, () => {
            console.log(`Listening on Port: ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exitCode = 1;
    }
}

start();






