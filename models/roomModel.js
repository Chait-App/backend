const room = {
  roomId: String,
  connectionTime : Date,
  firstClientId:"",
  secondClientId:"",
  isFull: Boolean,
  removeClient(clientId) {
    if(this.firstClientId == clientId) {
      this.firstClientId = null
    } else if (this.secondClientId == clientId){
      this.secondClientId == null
    }
  },
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