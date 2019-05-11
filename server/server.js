const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

var io = SocketIO(server);

app.use(express.static(publicPath));

// io.on lets you register for new event, we can listen for new event and do something when its happen
// connection event lets you listen for new connection, do something when new connection comes in.
io.on('connection', (socket) => {
    console.log('New User Connected');

    // emit or creating an event rather than listen
    // socket.emit - emit an event to single connection

    // emit 2 events
    // when a user connects
    socket.emit('newMessage', generateMessage('Admin', 'Welcome  to the Chat'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'User Joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('Create Message', message);
        // io.emit - emit an event to every single connection
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
        // socket.brodcast fires event for everybody except myself
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createAt: new Date().getTime()
        // })
    });

    // every time browser closes this message shows up
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, (err) => {
    console.log(`Server is up on port ${port}`);
});