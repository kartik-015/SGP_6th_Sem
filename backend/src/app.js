import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import userRouter from '../routes/user.routes.js'
const app = express()

// middlewares are init here

// Simple CORS: allow any origin in dev, no credentials
app.use(cors({
    origin: true,
    credentials: false,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));
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
// optional health check for frontend tooling
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

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

