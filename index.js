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
// let onlineUsers = []
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    // socket.on('addNewUser', (userId) => {
    //     !onlineUsers.some((user) => user.userId === userId) &&
    //         onlineUsers.push({ userId, socket: socket.id })
    // });

    socket.on('joinRoom', ({ userId, chatRoomId }) => {
        socket.join(chatRoomId);
        console.log(`User ${userId} joined room ${chatRoomId}`);
    });

    socket.on('sendMessage', ({ userId, chatRoomId, text }) => {
        console.log({ userId, chatRoomId, text })
        io.to(chatRoomId).emit('receiveMessage', { _id: 1, senderId: userId, chatRoomId, text });
    });

    socket.on("leaveRoom", ({ userId, chatRoomId }) => {
        socket.leave(chatRoomId);
        console.log(`User ${userId} left room ${chatRoomId}`);
    });
});

server.listen(8000, () => {
    console.log("Listen on port 8000")
})