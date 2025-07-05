import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// middlewares 

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

//routes


// routes decaleration


// localhost

export {app}

