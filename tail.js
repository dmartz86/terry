module.exports = (function tailFn() {
  'use strict';

  var spawn = require('child_process').spawn;
  var config = require('./config');

  function tail(socket, program, path) {
    if (!config.allowed.find(function (ele) { return ele===program})) {
      return socket.emit('error', 'Command not allowed');
    }
    
    path = config.base + '/' + path;

    var command = spawn(program, [path]);

    command.stdout.on('data', function (data) {
      socket.emit('stdout', data.toString());
    });

    command.stderr.on('data', function (data) {
      socket.emit('stderr', data.toString());
    });

    command.on('close', function (code) {
      socket.emit('done', 'child process exited with code ' + code.toString());
    });
  }

  return tail;
})();
