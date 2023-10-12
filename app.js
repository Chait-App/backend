const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const uuid = require("uuid");

const waitingClients = [];
const rooms = [];

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server res!');
});

io.on("connection", (socket) => {
  console.log("A client has connected.");


  socket.on('disconnect', (socket) => {
    console.log('A client has disconnected, Socket ID:', socket.id);
  })
});

server.listen(3000, () => {
  console.log('Server is listening at localhost:3000');
})