var socket = io();

socket.on('connect', function() {
    console.log('connected to server');
});
socket.on('disconnect', function() {
    console.log('Disconnected from server')
});

socket.on('newMessage', function(message){
    
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    
    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message){

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
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