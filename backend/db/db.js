import mongoose from 'mongoose'

//  function

export const connectDb =  async () => {
            console.log("Connecting to MongoDB :",process.env.MONGO_URL);
        try{
                await mongoose.connect(process.env.MONGO_URL)
                .then(
               () => { console.log("Mongo Db connection Successfull")}
                )
            }
        catch(err){

            console.log("Mongo DB connection Error : ",err.message)
        }
        

}