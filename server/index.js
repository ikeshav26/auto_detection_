import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './src/config/Db.js'
import cookieParser from 'cookie-parser'
import userRoutes from './src/routes/user.routes.js'
import adminRoutes from './src/routes/admin.routes.js'
import cors from 'cors'


dotenv.config()


const app=express()

// More permissive CORS for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}))

connectDB()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello, World!')
})
app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})