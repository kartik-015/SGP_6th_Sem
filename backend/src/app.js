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
import equipmentRouter from "../routes/equipment.routes.js"
import borrowRouter from "../routes/borrow.routes.js"
import penaltyRouter from "../routes/penalty.routes.js"

// routes 
app.use('/user' ,userRouter)
app.use('/equipment', equipmentRouter)
app.use('/borrow', borrowRouter)
app.use('/penalty', penaltyRouter)

// localhost

export {app}

