const mongoose = require('mongoose');
const { roomModel } = require('../models/dbModel');
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.DB);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB con err:'));
db.once('open', () => {
   console.log('MongoDB succ');
});

async function updateMessages(roomId, clientId, newMessage) {

  try {

    let room = await roomModel.findOne({ roomId });

    if (!room) {
      room = new roomModel({
        roomId,
        connectionTime: new Date(),
        firstClientId: clientId,
        secondClientId: null,
        messages: {
          firstClientMessages: [],
          secondClientMessages: []
        }
      });
    }

    const clientType = room.firstClientId === clientId ? 'first' : (room.secondClientId === clientId ? 'second' : null);

    let messagesArray = clientType === 'first' ? room.messages.firstClientMessages : room.messages.secondClientMessages;

    messagesArray.push({
      message: newMessage,
      time: new Date()
    });

    await room.save();

    console.log(`Message updated successfuly: ${newMessage}`);
  } catch (error) {
    console.error('Error while updating the message:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

module.exports = {
  updateMessages
}