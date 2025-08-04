const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 7777; 

// --- MongoDB Connection ---
const MONGO_URI = 'mongodb+srv://prarthankp17:Dynamitegaming@cluster0.07dlwsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/chat-app'; // REPLACE THIS WITH YOUR CONNECTION STRING
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Start listening for connections only after the database is ready
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define a Mongoose Schema and Model for messages
const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  channel: String,
  timestamp: { type: Date, default: Date.now },
  avatar: String,
});
const Message = mongoose.model('Message', messageSchema);

// Serve the index.html file to the browser
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// A simple in-memory store for authenticated users
const authenticatedUsers = {};
const onlineUsers = new Set();

// --- Socket.IO Event Handling ---
io.on('connection', (socket) => {
  console.log(`A user connected with ID: ${socket.id}`);

  socket.on('login', async (userData, callback) => {
    const { username, email } = userData;
    if (!username || !email) {
      return callback({ status: 'error', message: 'Username and email are required.' });
    }

    authenticatedUsers[socket.id] = { username, email, avatar: username.charAt(0).toUpperCase() };
    onlineUsers.add(username);
    console.log(`User '${username}' authenticated and connected.`);
    
    callback({ status: 'ok' });
    io.emit('user_joined', { username });

    try {
      const history = await Message.find({ channel: 'general' }).sort({ timestamp: 1 }).lean();
      socket.emit('load_history', { channel: 'general', messages: history });
    } catch (err) {
      console.error('Failed to load message history:', err);
    }
  });

  socket.on('send_message', (message) => {
    const user = authenticatedUsers[socket.id];
    if (!user) return;
    
    const fullMessage = {
      ...message,
      username: user.username,
      avatar: user.avatar,
      timestamp: new Date(),
    };

    const newMessage = new Message(fullMessage);
    newMessage.save()
      .then(() => {
        io.to(message.channel).emit('new_message', { ...fullMessage, _id: newMessage._id });
      })
      .catch(err => console.error('Failed to save message:', err));
  });

  socket.on('typing_start', (data) => {
    const user = authenticatedUsers[socket.id];
    if (user) { socket.to(data.channel).emit('typing_start', { username: user.username }); }
  });

  socket.on('typing_stop', (data) => {
    const user = authenticatedUsers[socket.id];
    if (user) { socket.to(data.channel).emit('typing_stop', { username: user.username }); }
  });

  socket.on('join_channel', async (data) => {
    const user = authenticatedUsers[socket.id];
    if (user) {
        socket.rooms.forEach(room => { if (room !== socket.id) { socket.leave(room); } });
        socket.join(data.channel);
        console.log(`User '${user.username}' joined channel: ${data.channel}`);
        
        try {
          const history = await Message.find({ channel: data.channel }).sort({ timestamp: 1 }).lean();
          socket.emit('load_history', { channel: data.channel, messages: history });
        } catch (err) {
          console.error('Failed to load message history:', err);
        }
    }
  });

  socket.on('disconnect', () => {
    const user = authenticatedUsers[socket.id];
    if (user) {
      console.log(`User disconnected: '${user.username}'`);
      onlineUsers.delete(user.username);
      io.emit('user_left', { username: user.username });
      delete authenticatedUsers[socket.id];
    }
  });
});