const cors = require('cors')
const express = require('express')
const connectToDB = require('./src/db')
const cookieParser = require('cookie-parser')
const router = require('./src/routes');
const app = express()
const http = require('http');
const { Server } = require('socket.io');

// setup middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Connect mongoDB atlas
connectToDB()

// routes
app.use('/api/v2', router)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
let onlineUsers = []
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on('addNewUser', (userId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({ userId, socket: socket.id })
    });
});

server.listen(8000, () => {
    console.log("Listen on port 8000")
})