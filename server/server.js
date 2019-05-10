const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

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
    socket.emit('newMessage', {
        from: 'John',
        text: 'Anything else',
        createAt: new Date().toDateString()
    });

    socket.on('createMessage', (message) => {
        console.log('Create Message', message);
    });

    // every time browser closes this message shows up
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, (err) => {
    console.log(`Server is up on port ${port}`);
});