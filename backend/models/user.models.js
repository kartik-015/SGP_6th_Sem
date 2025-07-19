import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  role: {
    type: String,
    enum: ['user', 'admin'], // You can also add 'HOD', etc.
    default: 'user'
  }
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
}

);


userSchema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password , this.password)
}


// methods for generating access token
userSchema.methods.generateAccessTokem = function () {
       return jwt.sign({
                _id : this._id,
                email:this.email ,
                username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    
    )
}
export const User =   mongoose.model('User' , userSchema)