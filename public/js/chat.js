const socket = io();


// autoscrolling
function scrollToBottom () {

  // Selectors
  let messages = jQuery('#messages');
  let newMessage = messages.children('li:last-child');

  // Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.animate({scrollTop:scrollHeight}, 1000);
    return false;
  }
}
//___________________________________________________


// start socket connection
socket.on('connect', () => {
  let params = jQuery.deparam(window.location.search);
  //console.log(params); <-- get search query object

  // emit for join page, catch invalid user`s data
  socket.emit('join', params, (err) => {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error)');
    }
  });
});
//___________________________________________________


// end socket connection
socket.on('disconnect', () => console.log('Disconnected from server'));
//___________________________________________________


// listen emit 'updateUserList' from server.js
socket.on('updateUserList', (users) => {

  // render user list at chat.html
  let ul = jQuery('<ul></ul>');
  users.forEach((user) => ul.append(jQuery('<li></li>').text(user)));
  jQuery('#users').html(ul);
});
//___________________________________________________


// listen emit 'newMessage' from server.js
socket.on('newMessage', (message) => {

  let formattedTime = moment(message.createdAt).format('HH:mm:ss');

  // render message on appropriate template at chat.html
  let template = jQuery('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});
//___________________________________________________


// add event on send button and emit 'createMessage'
jQuery('#message-form').on('submit', (e) => {
  e.preventDefault();

  let messageTextbox = jQuery('[name=message]');

  // emit 'createMessage'
  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, () => messageTextbox.val(''));
});
//___________________________________________________


// add event on location button and emit 'createLocationMessage'
let locationButton = jQuery('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  // change text attr while fetching data
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition( (position) => {

    // emit 'createLocationMessage'
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

    locationButton.removeAttr('disabled').text('Location');
  }, () => {
    locationButton.removeAttr('disabled').text('Location');
    alert('Uable to fetch location');
  });
});
//___________________________________________________


// listen emit 'newLocationMessage' from server.js
socket.on('newLocationMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('HH:mm:ss');

  // render message on appropriate template at chat.html
  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template, {
    createdAt: formattedTime,
    from: message.from,
    url: message.url
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});
//___________________________________________________


// add event on media button and emit 'createMediaMessage'
let handleFiles = () => {
  let reader = new FileReader();
  let media = document.getElementById('media').files[0];

  reader.addEventListener("loadend", result => {

    // emit 'createLocationMessage'
    socket.emit('createMediaMessage', {
      media: result.target.result
    });
    // console.log(result.target.result);
  }, false);
  reader.readAsDataURL(media);
};
//___________________________________________________


// listen emit 'newMediaMessage' from server.js
socket.on('newMediaMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('HH:mm:ss');

  // render message on appropriate template at chat.html
  if(message.media.indexOf('image') !== -1) {
    let template = jQuery('#image-message-template').html();
    let html = Mustache.render(template, {
      createdAt: formattedTime,
      from: message.from,
      media: message.media
    });

    jQuery('#messages').append(html);
    scrollToBottom();

  } else {
    let template = jQuery('#media-message-template').html();
    let html = Mustache.render(template, {
      createdAt: formattedTime,
      from: message.from,
      media: message.media
    });

    jQuery('#messages').append(html);
    scrollToBottom();
  }
});
//___________________________________________________
