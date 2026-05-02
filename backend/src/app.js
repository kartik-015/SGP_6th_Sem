import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import userRouter from '../routes/user.routes.js'
const app = express()

// middlewares are init here

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
import importRouter from "../routes/import.routes.js"
import approvalsRouter from "../routes/approvals.routes.js"
import notifyRouter from "../routes/notify.routes.js"

// routes 
app.use('/user' ,userRouter)
app.use('/equipment', equipmentRouter)
app.use('/borrow', borrowRouter)
app.use('/penalty', penaltyRouter)
app.use('/import', importRouter)
app.use('/approvals', approvalsRouter)
// lightweight notify endpoint (can be used with SKIP_DB mode)
app.use('/notify', notifyRouter)

// localhost

export {app}

