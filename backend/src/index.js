import dotenv from 'dotenv'
import { connectDb } from '../db/db.js'
import { app } from './app.js'
import { seedDefaultAdmin } from '../utils/seed.js'

// Load env from backend/.env with override to ensure fresh values
dotenv.config({ path: './.env', override: true });

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        if (process.env.SKIP_DB === 'true') {
            console.log('SKIP_DB=true, skipping database connect and seeding (dev mode)');
        } else {
            await connectDb();
            await seedDefaultAdmin();
        }

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






