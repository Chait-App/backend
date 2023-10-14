const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const uuid = require("uuid");
const handler = require("./controllers/roomController");


const waitingClients = [];
const rooms = [];

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:8081', 'http://192.168.1.15:8081'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server res!');
});



io.on("connection", (socket) => {

  var roomId = handler.roomAssigner(socket, rooms);

  handler.sendRoomId(socket, roomId);

  io.to(roomId).emit('roomReady');

  socket.on('roomMessage', ({message}) => {
    io.to(roomId).emit('roomMessage', {sender: socket.id, message})
    console.log(`${message} seen on server.`)
  })

  socket.on('disconnect', (socket) => {
    console.log('A client has disconnected, Socket ID:', socket.id);
  })
});

server.listen(3000, () => {
  console.log('Server is listening at localhost:3000');
})