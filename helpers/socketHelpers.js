const uuid = require("uuid");


function generateRoomId(io) {
  io.engine.generateId = (req) => {
    return uuid.v4(); // must be unique across all Socket.IO servers
  }
}

function createRoom(roomId){

}

function deleteRoom(roomId) {

}