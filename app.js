const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const uuid = require("uuid");
const handler = require("./controllers/roomController");

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
  if(handler.checkAvailableRoom(rooms) == -1) {
    var roomId = handler.generateRoomId();
    var newRoom = handler.assignRoomToClient(roomId, socket.id);
    rooms.push(newRoom);
    console.log("A new client has connected and created room for that client.")
    console.log(rooms)
    socket.join(roomId)
    handler.sendRoomId(socket, roomId);
  } 
  else {
    var roomIndex = handler.checkAvailableRoom(rooms);
    handler.addClientToRoom(rooms[roomIndex], socket.id)
    console.log("Another client has connected and assigned to available room.")
    console.log(rooms);
    socket.join(roomId)
    handler.sendRoomId(socket, roomId);
  }


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