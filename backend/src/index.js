import dotenv from 'dotenv'

// Load env from project root first, then fallback to backend/.env
dotenv.config({ path: '../.env' });
if (!process.env.MONGODB_URI) {
        dotenv.config({ path: './.env' });
}
if (!process.env.MONGODB_URI) {
        console.warn('Warning: MONGODB_URI is not set. Check your .env at project root or backend/.env');
}
import { connectDb } from '../db/db.js'
import { app } from './app.js'
import { seedDefaultAdmin } from '../utils/seed.js'

const PORT = process.env.PORT || 5000

// promises send by this function
connectDb()
.then(
    async () =>{
        await seedDefaultAdmin();
        app.listen(PORT , () =>{
            console.log("Listening on Port :",PORT);
        })
    }
)
.catch(

    (err) => {
        console.log("Error in connecting to DB");
        console.log(err.message);
    }

)

// initalizing server






