const uuid = require("uuid");
const {room} = require('../models/roomModel'); 
const {isKeyFilled} = require('../helpers/helper')

const rooms = []

const addClientToRoom = function(roomObj,clientId) {
    if(!isKeyFilled((roomObj.firstClientId))) {
      roomObj.firstClientId = clientId
    } else if(!isKeyFilled(roomObj.secondClientId)) {
      roomObj.secondClientId = clientId
    } else {
      return null
    }
    return roomObj
}

function generateRoomId() {
  return uuid.v4(); 
}

function sendRoomId(socket,roomId) {
  socket.emit('roomId', roomId)
}

const createRoom = (io, socket) => {
  const roomId = generateRoomId(io);
  socket.join(roomId);
  socket.to(roomId).emit('user joined', socket.id);
}

const deleteRoom = (socket, roomId) => {
  
}

const assignRoomToClient = (roomId, clientId) => {
  var newRoom = { ...room };

  newRoom.roomId = roomId;
  newRoom.connectionTime = new Date();

  addClientToRoom(newRoom,clientId);

  return newRoom;
}

const checkAvailableRoom = function(rooms) {
  var roomIndex = rooms.findIndex((room) => !isRoomFull(room))
  return roomIndex
}

const removeClientFromRoom = (roomId, socket, rooms) => {
  const modifiedRoom = rooms.find((room) => room.roomId === roomId);
  if (modifiedRoom) {
    socket.leave(roomId);
    socket.to(roomId).emit('user left', socket.id);

    if (modifiedRoom.firstClientId === socket.id) {
      modifiedRoom.firstClientId = null;
    } else if (modifiedRoom.secondClientId === socket.id) {
      modifiedRoom.secondClientId = null;
    }
  }
  return modifiedRoom;
}

const isRoomFull = (room) => {
  return isKeyFilled(room.firstClientId) && isKeyFilled(room.secondClientId)
}

const isQueueEmpty = (queueArr) => {
  return !(queueArr.length > 0);
}

const roomAssigner = (socket, rooms) => {

  if(checkAvailableRoom(rooms) == -1) {
    var roomId = generateRoomId();
    var newRoom = assignRoomToClient(roomId,socket.id);
    rooms.push(newRoom);
    socket.join(roomId);
    console.log("A new client has connected and created room for that client.")
    console.log(rooms)
  }
  else {
    var roomIndex = checkAvailableRoom(rooms);
    addClientToRoom(rooms[roomIndex], socket.id);
    socket.join(roomId);
    console.log("Another client has connected and assigned to available room.")
    console.log(rooms);
  }

  return rooms.find(room => room.firstClientId == socket.id || room.secondClientId == socket.id).roomId;
}

module.exports = {
  generateRoomId,
  createRoom,
  deleteRoom,
  checkAvailableRoom,
  assignRoomToClient,
  addClientToRoom,
  removeClientFromRoom,
  isRoomFull,
  isQueueEmpty,
  roomAssigner,
  sendRoomId
}