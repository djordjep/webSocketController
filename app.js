navigator.serviceWorker && navigator.serviceWorker.register('sw.js').then(function(registration) {
  console.log('Excellent, registered with scope: ', registration.scope);
});

if(window.DeviceOrientationEvent){
  window.addEventListener("deviceorientation", orientation, false);
}else{
  console.log("DeviceMotionEvent is not supported");
}

function orientation(event){
  var tiltLR = Math.round(event.gamma);
  var tiltFB =  Math.round(event.beta);
  // gamma is the left-to-right tilt in degrees, where right is positive
  if( tiltLR > -15){
    socket.emit('chat message', {id:"Accelerometer", message:"up"});
  }
  if(tiltLR < -25){
    socket.emit('chat message', {id:"Accelerometer", message:"down"});
  }
  // beta is the front-to-back tilt in degrees, where front is positive
  if(tiltFB > 5){
    socket.emit('chat message', {id:"Accelerometer", message:"right"});
  }
  if(tiltFB < -5){
    socket.emit('chat message', {id:"Accelerometer", message:"left"});
  }
}

function doTilt(direction){
switch (direction) {
case "up":  /* Up was passed trough socket */
if (y - dy > 0){
y -= dy;
}
break;
case "down":  /* Down was passed trough socket */
if (y + dy < HEIGHT){
y += dy;
}
break;
case "left":  /* Left was passed trough socket */
if (x - dx > 0){
x -= dx;
}
break;
case "right":  /* Right was passed trough socket */
if (x + dx < WIDTH){
x += dx;
}
break;
}
}

sessionStorage.id = "Anonimus";
var socket = io();
function submitMsg(){
  socket.emit('chat message', {id:sessionStorage.id, message:$('#m').val()});
  $('#m').val('');
  return false;
}
function pullHistory(){
  socket.emit('history', "");
  return false;
}
function clearHistory(){
  socket.emit('clearHistory', "");
  return false;
}

$('#sendMsg').click(function(){
  submitMsg();
});
$('#m').keypress(function (e) {
  if (e.which == 13) {
    submitMsg();
    return false;
  }
});
$('#history').click(function(){
  pullHistory();
});
$('#clearHistory').click(function(){
  clearHistory();
});

socket.on('id', function(msg){
  $('#id').val(msg);
  sessionStorage.id =  msg;
});
socket.on('chat message', function(msg){
  //$('#messages').append($('<dt>').text(msg.id + ":"));
  //$('#messages').append($('<dd>').text(" -- "+msg.message));
  doTilt(msg.message);
});
socket.on('history', function(msg){
  if(msg.length > 0){
    for ( var index=0; index<msg.length; index++ ) {
      $('#messages').append($('<dt>').text(msg[index].id + ":"));
      $('#messages').append($('<dd>').text(" -- "+msg[index].message));
    }
  }else{
    $('#messages').html("");
  }
});
$('#id').change(function(){
  sessionStorage.id =  $('#id').val();
  $('#id').prop('disabled', true);
});