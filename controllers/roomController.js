// roomController.js

const uuid = require("uuid");
const { room } = require('../models/roomModel');
const { isKeyFilled } = require('../helpers/helper');

const addClientToRoom = function (roomObj, clientId) {
  if (!isKeyFilled((roomObj.firstClientId))) {
    roomObj.firstClientId = clientId;
  } else if (!isKeyFilled(roomObj.secondClientId)) {
    roomObj.secondClientId = clientId;
  } else {
    return null;
  }
  return roomObj;
}

function generateRoomId() {
  return uuid.v4();
}

function sendRoomId(socket, roomId) {
  socket.emit('roomId', roomId);
}

const assignRoomToClient = (roomId, clientId) => {
  var newRoom = { ...room };

  newRoom.roomId = roomId;
  newRoom.connectionTime = new Date();

  addClientToRoom(newRoom, clientId);

  return newRoom;
}

const removeClientFromRoom = (io, roomId, socketId, rooms) => {
  const roomIndex = rooms.findIndex(room => room.roomId === roomId);
  const room = rooms[roomIndex];

  if (roomIndex !== -1) {
    io.to(roomId).emit(`User ${socketId} has left the room`);
    if (room.firstClientId === socketId) {
      room.firstClientId = undefined;
    } else if (room.secondClientId === socketId) {
      room.secondClientId = undefined;
    }
  }
  return room;
}

const checkIfRoomValid = (room) => {
  return !(room.firstClientId === undefined && room.secondClientId === undefined);
}

const roomAssigner = (socket, rooms) => {
  const availableRoomIndex = rooms.findIndex(room => !isKeyFilled(room.secondClientId) || !isKeyFilled(room.firstClientId));

  if (availableRoomIndex === -1) {
    var roomId = generateRoomId();
    var newRoom = assignRoomToClient(roomId, socket.id);
    rooms.push(newRoom);
    socket.join(roomId);
    console.log("A new client has connected and created room for that client.");
    console.log(rooms);
  } else {
    var roomIndex = availableRoomIndex;
    addClientToRoom(rooms[roomIndex], socket.id);
    socket.join(rooms[roomIndex].roomId);
    console.log("Another client has connected and assigned to an available room.");
    console.log(rooms);
  }

  return rooms.find(room => room.firstClientId === socket.id || room.secondClientId === socket.id).roomId;
}


module.exports = {
  generateRoomId,
  assignRoomToClient,
  addClientToRoom,
  removeClientFromRoom,
  checkIfRoomValid,
  roomAssigner,
  sendRoomId,
};
