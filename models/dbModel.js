const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  message: String,
  time: Date
});

const roomSchema = new Schema({
  roomId: String,
  connectionTime: Date,
  firstClientId: String,
  secondClientId: String,
  messages: {
    firstClientMessages: [messageSchema],
    secondClientMessages: [messageSchema]
  }
});

const roomModel = mongoose.model('Room', roomSchema);

module.exports = {
  roomModel
}
