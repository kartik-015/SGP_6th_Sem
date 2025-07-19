import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import userRouter from '../routes/user.routes.js'
const app = express()

// middlewares are init here

app.use(cors(
    {
        origin : '*',
        credentials:true
    }   
))
app.use(express.json())

app.use(express.urlencoded({
    extended:true
}))

// public assets 
app.use(cookieParser())
// checking 
app.get('/', (req, res) => {
    res.send('API is running...')
})

// routes decaleration
import userRouter from "../routes/user.routes.js"

// routes 
app.use('/user' ,userRouter)

// localhost

export {app}

