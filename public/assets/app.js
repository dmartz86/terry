(function pexApp() {
  window.angular.module('pexApp', [])
    .controller('MainController', ['$scope', '$http', '$timeout', MainController]);

  function MainController($scope, $http, $timeout) {
    var socket = window.io();
    socket.on('files', onFiles);
    socket.on('stdout', print);
    socket.on('stderr', print);
    socket.on('done', print);

    window.addEventListener('resize', resize);

    function resize() {
      if (window.outerWidth > 700) {
        $scope.desktop = true;
      } else {
        $scope.desktop = false;
      }
      $timeout(ack, 0);
    }

    function print(data) {
      $scope.tail += data;
      $timeout(ack, 0);
    }

    function init() {
      socket.emit('join', 'Default');
      resize();
    }

    function ack() {
      socket.emit('ack', new Date().getTime());
    }

    function onFiles(data) {
      $scope.files = data;
      $timeout(ack, 0);
    }

    function sortBy(key) {
      if ($scope.sort === key) {
        $scope.inverse = !$scope.inverse;
      } else {
        $scope.sort = key;
      }
    }

    function setContent(file, content) {
      $scope.file = file;
      $scope.content = content;
    }

    function setView(view) {
      $scope.view = view;
    }

    function test(program) {
      $scope.tail = '';
      socket.emit('test', { program: program, file: $scope.file });
    }

    $scope.files = [];
    $scope.search = '';
    $scope.content = '';
    $scope.sort = 'isDir';
    $scope.inverse = false;
    $scope.test = test;
    $scope.sortBy = sortBy;
    $scope.setView = setView;
    $scope.setContent = setContent;
    $scope.view = 'list';
    
    $timeout(init, 0);
  }
})();
