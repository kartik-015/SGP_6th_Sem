import dotenv from 'dotenv'

// Load env from project root first, then fallback to backend/.env
dotenv.config({ path: '../.env' });
if (!process.env.MONGO_URL) {
        dotenv.config({ path: './.env' });
}
if (!process.env.MONGO_URL) {
        console.warn('Warning: MONGO_URL is not set. Check your .env at project root or backend/.env');
}
import { connectDb } from '../db/db.js'
import { app } from './app.js'

const PORT = process.env.PORT || 5000

// promises send by this function
connectDb()
.then(
        () =>{

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






