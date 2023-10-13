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
  return uuid.v4(); // must be unique across all Socket.IO servers
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

module.exports = {
  generateRoomId,
  createRoom,
  deleteRoom,
  checkAvailableRoom,
  assignRoomToClient,
  addClientToRoom,
  removeClientFromRoom,
  isRoomFull,
  isQueueEmpty
}