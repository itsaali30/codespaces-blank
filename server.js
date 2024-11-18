const express = require('express');
const serverless = require('serverless-http');
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());

// Example route
app.get('/api/messages', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json(response.data.slice(0, 10));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Real-time chat with Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

module.exports.handler = serverless(app);
