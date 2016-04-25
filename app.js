(function main() {
  "use strict";

  var path = require('path');
  var express = require('express');
  var app = express();
  var server = require('http').createServer(app);
  var io = require('socket.io')(server);
  var features = require('./features');
  var tail = require('./tail');

  io.on('connection', connection);
  app.use(express.static(path.join(__dirname, '/public')));
  app.set('port', 1344);
  server.listen(app.get('port'), listen);

  function listen() {
    console.log('Listening ', app.get('port'));
  }

  function connection(socket) {
    console.log('Connected');
    socket.on('join', socket.join);
    socket.on('leave', socket.leave);
    socket.on('ack', console.log);
    socket.on('test', testFile)
    
    features(featureFiles);
    
    function testFile(data) {
      tail(socket, data.program, data.file);
    }
    
    function featureFiles(data) {
      socket.emit('files', data);
    }
  }
})();