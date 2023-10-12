const uuid = require("uuid");
const {room} = require('../models/roomModel'); 

const rooms = []

const addClientToObject = function(roomObj,clientId) {
    if(!roomObj.firstClientId) {
      roomObj.firstClientId = clientId
    } else if (!roomObj.secondClientId) {
      roomObj.secondClientId = clientId;
    }
  return roomObj;
}

function generateRoomId(io) {
  io.engine.generateId = (req) => {
    return uuid.v4(); // must be unique across all Socket.IO servers
  }
}

const createRoom = (io, socket) => {
  const roomId = generateRoomId(io);
  socket.join(roomId);
  socket.to(roomId).emit('user joined', socket.id);
}

const deleteRoom = (socket, roomId) => {
  
}

const assignClientToRoom = (roomId, clientId) => {
  let newRoom = {...room}
  
  newRoom = addClientToObject(newRoom,clientId)

  newRoom.roomId = roomId

  return newRoom;
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

const isRoomEmpty = (roomId) => {
  return roomId.roomInfo[isFull];
}

const isRoomFull = (roomId) => {
  return roomId.roomInfo[isFull];
}

const isQueueEmpty = (queueArr) => {
  return !(queueArr.length > 0);
}

module.exports = {
  createRoom,
  deleteRoom,
  isRoomEmpty,
  isRoomFull,
  isQueueEmpty
}