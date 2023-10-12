const room = {
  roomId: String,
  isFull: Boolean,
  connectionTime : Date,
  firstClientId: String,
  secondClientId: String,
  messages : {
    clientOneMessages: [
      {
        message: String,
        time: Date
      }
    ],
    clientTwoMessages: [
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