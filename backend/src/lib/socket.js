
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import Message from '../models/Message.js';

export const app = express();
export const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

const onlineUsers = new Map();


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-message', async ({ senderId, receiverId, content }) => {

        const message = new Message({ sender: senderId, receiver: receiverId, content });
        await message.save();

        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit('receive-message', {
                senderId, content, timestamp: message.timestamp
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (let [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                break;
            }
        }
    });
});