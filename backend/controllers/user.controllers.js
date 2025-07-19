import {User} from "../models/user.models.js";
// import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
// import { verifyJwt } from "../middlewares/auth.middlewares.js";
// import jwt from "jsonwebtoken";


const generateToken = async (userId) =>{
      try{
               const user = await User.findById(userId)

               const accessToken = user.generateAccessTokem()
              //  const refreshToken = user.generateRefreshTokem()

              //  user.refreshToken = refreshToken
              await user.save({validateBeforeSave: false}) // to stop check password

              return {accessToken}
      }
      catch(err){
            throw new apiError(500 ,err.message)
      }
}

// Register
export const register = asyncHandler(async (req, res) => {

    const {name , email, password , role} = req.body;

    if(!name || !email || !password || (role && !['user', 'admin'].includes(role))) {
      new apiError(400 , "Please fill all fields") 
    }
    // Check if user already exists
try{
    const exitingUser = await User.findOne({ email})

    if (exitingUser) {
      new apiError(400, "User already exists");
    }

    const newUser  = await User.create({
      name,
      email,
      password, // Hash the password
      role
    })

    // Generate access token
    const {accessToken} = await generateToken(newUser._id);
    const options = {
      httpOnly: true, // modified by server only
      secure: true // use secure cookies in production
    };
    // Send response
    return res.status(201).cookie("accessToken", accessToken, options).json(new apiResponse(201, { user: newUser, accessToken }, "User Registered Successfully"));
} catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json(new apiError(500, "Internal Server Error"));
  }
});

// Login
export const loginUser = asyncHandler(async (req , res) => {

      // req body take data
      const {email   ,password} = req.body
      // email is correct and exist 

      if( !email){
            return res.status(400).json({
               success: false,
               message : "Enter all fields"
            })
      }

      const existedUser = await User.findOne({email})

      if(!existedUser){
         return res.status(404).json( {
            success : false ,
            message : "User not Found"
         })
      }
      // password check 
      // console.log(existedUser.password)
      // const isValidPassword = await existedUser.isPasswordCorrect(password)
      const isValidPassword = existedUser.password == password
      if(!isValidPassword){
         // console.log("*")
            return res.status(401).json({
               success :false,
               message : "Invalid User Credential"
            })
      }
      // generate Access and Refresh token

      const {accessToken } =await generateToken(existedUser._id)

      // send cookie
     const loggedInUser =  await User.findById(existedUser._id).select("-password");
      const options = {
            httpOnly : true,// modified by server only
            secure : true
      }
      return res.status(200).cookie("accessToken" , accessToken ,options).json(new apiResponse(200,{user : loggedInUser ,accessToken}, "User Logged in Successfully"));
})

// Get current user
export const logoutUser = asyncHandler(async (req ,res) => {
      const _id = req.user._id
      console.log(req.user)
      const options = {
            httpOnly : true, // modified by server only
            secure : true
      }

      return res.status(200).clearCookie("accessToken",options).json(new apiResponse(200 ,"User LoggedOut"))
})