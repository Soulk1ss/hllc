'use strict';
const connection = require('./configs/database')
const modelConversation = connection.model('activitydinnerconversations', {
  u_id: String,
  u_username: String,
  adc_text: String,
  adc_updated: Date
})
const modelLiveConversation = connection.model('activityliveconversations', {
  u_id: String,
  u_username: String,
  adc_text: String,
  adc_updated: Date
})
class Events {
  constructor(io) {
    this.io = io;
    this.users = {};
  }
  socketEvents(io) {
    io.on('connection', (socket) => {
      socket.on('connected', (user) => {
        this.users[socket.id] = user;
        io.emit('users', this.users);
      });
      socket.on('returnLog', function () {
        
        modelConversation.find().sort('-adc_updated').limit(100).then((res, err) => {
         
          var message = {};
          var response = [];
          for(var i=0;i<res.length;i++){
            response.push({ 
              user:{
                id: res[i].u_id,
                name: res[i].u_username
              },
              message: res[i].adc_text
            })
          }
          socket.emit('returnLogResponse', response)
        })
        
        //socket.emit('returnLogResponse', { message: 'xxx' })
      })
      socket.on('disconnect', () => {
        delete this.users[socket.id];
        io.emit('users', this.users);
      });
      socket.on('messageLive', (message) => {
        io.emit('messageLive', message);
        const newLiveConver = new modelLiveConversation({
          u_id: message.user.id,
          u_username: message.user.name,
          adc_text: message.message,
          adc_updated: Date.now()
        })
        newLiveConver.save().then((res, err) => { })
      });
      socket.on('messageDinner', (message) => {
        io.emit('messageDinner', message);
        const newConver = new modelConversation({
          u_id: message.user.id,
          u_username: message.user.name,
          adc_text: message.message,
          adc_updated: Date.now()
        })
        newConver.save().then((res, err) => { })
      });
    });
  }
  /**
   *  Initialize socket events
   */
  eventsConfig() {
    this.socketEvents(this.io);
  }
}
module.exports = Events;
