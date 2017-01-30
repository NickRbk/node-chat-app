const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage, generateMediaMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let users = new Users();

// render public dir
app.use( express.static(publicPath) );


// start public io connection
io.on('connection', (socket) => {
  console.log('New user connected');

  // listen emit 'join' from chat.js  and catch error
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required');
    } else if (users.addUser(socket.id, params.name, params.room) === 0) {
      return callback('Duplicate user name!');
    }

    // join to exact room
    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // emit updateUserList
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

              // socket.leave(params.room);

              //  io.emit() -> io.to(params.room).emit
              //  socket.broadcast.emit() -> socket.broadcast.to(params.room).emit
              //  socket.emit ->

    // greeting new User and emit message
    socket.to(params.room).emit('newMessage',
      generateMessage('Admin', 'Welcome to the Chat App'));

    // notificate users about new User
    socket.broadcast.to(params.room).emit('newMessage',
      generateMessage('Admin', `${params.name} has joined`));

    callback();
  });
  //___________________________________________________


  // listen emit 'createMessage' from chat.js and emit 'newMessage'
  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    // emit 'newMessage'
    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });
  //___________________________________________________


  // listen emit 'createLocationMessage' from chat.js and emit 'newLocationMessage'
  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    // emit 'newLocationMessage'
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
  });
  //___________________________________________________


  // listen emit 'createMediaMessage' from chat.js and emit 'newMediaMessage'
  socket.on('createMediaMessage', (base64) => {
    let user = users.getUser(socket.id);

    // emit 'newMediaMessage'
    io.to(user.room).emit('newMediaMessage', generateMediaMessage(user.name, base64.media));
  });
  //___________________________________________________
  

  // end public io connection
  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} hes left...`));
    }
  });
  //___________________________________________________

});
//___________________________________________________


server.listen(port, () => console.log(`Server is up on port ${port}`));
