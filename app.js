// app.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const uuid = require("uuid");
const handler = require("./controllers/roomController");
const session = require("express-session")
const dbController = require("./controllers/dbController");


process.env.DB

const rooms = [];

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:8081', process.env.ALLOWED_IP],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  }
});

const PORT = process.env.PORT || 3000;

io.on("connection", async (socket) => {
  
  var socketId = socket.id;
  var roomId = handler.roomAssigner(socket, rooms);

  handler.sendRoomId(socket, roomId);
  io.to(roomId).emit('roomReady');

  socket.on('roomMessage', (message) => {

    dbController.updateMessages(roomId, socketId, message)
    io.to(roomId).emit('message', { sender: socketId, message: message });
    //rooms.find(r => r.roomId === roomId).messages.push({ sender: socketId, message: message });
    console.log(`${message} message sent from ${socketId} in room ${roomId}`);
  });

  socket.emit("roomInfo", rooms.find(r => r.roomId === roomId))

  socket.on('disconnect', () => {
    var newRoom = handler.removeClientFromRoom(io, roomId, socketId, rooms);
    if (handler.checkIfRoomValid(newRoom)) {
      rooms[rooms.findIndex(r => r.roomId === roomId)] = newRoom;
    } else {
      rooms.splice(rooms.findIndex(r => r.roomId === roomId), 1);
    }
    console.log(rooms);
    console.log('A client has disconnected, Socket ID:', socketId);
  });
});



server.listen(3000, () => {
  console.log('Server is listening at localhost:3000');
});
