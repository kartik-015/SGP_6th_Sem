import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  studentId: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ['user', 'admin'], // You can also add 'HOD', etc.
    default: 'user'
  },
  institute: { type: String, trim: true },
  department: { type: String, trim: true },
  year: { type: Number, min: 1, max: 6 },
  semester: { type: Number, min: 1, max: 8 }
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
       const secret = process.env.ACCESS_TOKEN_SECRET || 'dev-secret';
       const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || '7d';
       return jwt.sign({
                _id : this._id,
                email:this.email ,
                username : this.username
        },
        secret,
        { expiresIn }
    
    )
}

// hash password before save if modified
userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});
export const User =   mongoose.model('User' , userSchema)