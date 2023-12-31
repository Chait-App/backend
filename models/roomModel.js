const {isKeyFilled} = require("../helpers/helper")

const room = {
  roomId: String,
  connectionTime : Date,
  firstClientId: undefined,
  secondClientId: undefined,
  messages : {
    firstClientMessages: [
      {
        message: String,
        time: Date
      }
    ],
    secondClientMessages: [
      {
        message: String,
        time: Date
      }
    ]
  }
}

module.exports = {
  room
}