import dotenv from 'dotenv'

dotenv.config(
        {
            path: './.env'
        }
)
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






