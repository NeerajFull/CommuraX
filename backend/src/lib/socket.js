
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

        // Notify other users this user is online
        socket.broadcast.emit('user-online', userId);
    });

    socket.on('send-message', async ({ senderId, receiverId, content, type }) => {

        const message = new Message({ sender: senderId, receiver: receiverId, content, type });
        await message.save();

        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit('receive-message', {
                senderId, content, timestamp: message.timestamp, type
            });
        }
    });

    socket.on('show-online-status', () => {
        const onlineUserIds = Array.from(onlineUsers.keys());
        socket.emit('online-users', onlineUserIds);
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                socket.broadcast.emit('user-offline', key); // 🔥 Notify others
                break;
            }
        }
    });
});