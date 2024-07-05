const cors = require('cors')
const express = require('express')
const connectToDB = require('./src/db')
const cookieParser = require('cookie-parser')
const router = require('./src/routes');
const app = express()

// setup middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Connect mongoDB atlas
connectToDB()

// routes
app.use('/api/v2', router)

app.listen(8000, () => {
    console.log("Listen on port 8000")
})