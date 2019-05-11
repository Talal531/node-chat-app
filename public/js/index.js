var socket = io();

socket.on('connect', function() {
    console.log('connected to server');
});
socket.on('disconnect', function() {
    console.log('Disconnected from server')
});

socket.on('newMessage', function(message){
    
    var formattedTime = moment(message.createdAt).format('h:mm a');
    
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${formattedTime}: ${message.text}`);
    
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    var formattedTime = moment(message.createdAt).format('h:mm a');
    
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    
    li.append(a);
    jQuery('#messages').append(li);
});


// Add jquery
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var messageTextBox = jQuery('[name=message]');

    // Emit an event from client
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('');
    });
});

// get current location
var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation) {
        return alert('Geolocation not supported to your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Locaiton...');
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        
    }, function(err){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location')
    });
});