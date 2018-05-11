var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var history = require("./history.json");
var connectedUsers = {};

function yourCallback(){
//   if(history.length > 10){
//     history.splice(-10,10);
//   }
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/app.js', function(req, res){
  res.sendFile(__dirname + '/app.js');
});
app.get('/manifest.json', function(req, res){
  res.sendFile(__dirname + '/manifest.json');
});
app.get('/sw.js', function(req, res){
  res.sendFile(__dirname + '/sw.js');
});
app.get('/canvas.js', function(req, res){
  res.sendFile(__dirname + '/canvas.js');
});

io.on('connection', function(socket){
  username = Math.random().toString(36).substring(21);
  connectedUsers[username] = socket;
  connectedUsers[username].emit('id', username);
  console.log('a user '+ username +' connected');
  connectedUsers[username].on('disconnect', function(){
    console.log('user '+ username +' disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    //history.push(msg);
    //fs.writeFile( "history.json", JSON.stringify( history ), "utf8", yourCallback );
  });
  socket.on('history', function(msg){
    io.emit('history', history);
  });
  socket.on('clearHistory', function(msg){
    history = JSON.parse("[]");
    fs.writeFile( "history.json", JSON.stringify( history ), "utf8", yourCallback );
    io.emit('history',history);
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});