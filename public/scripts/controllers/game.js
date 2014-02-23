angular.module('app')
  
  .controller('GameController',
    function($scope, $rootScope, $location, $timeout) {
      $scope.complete = false;
      $scope.opponentComplete = false;
      $scope.gameID = $location.path();
      $scope.gameLocation = 'http://' + $location.host() + $location.path();
      $('#link').text( 'Share this link:  ' + $scope.gameLocation );
      $scope.gameID = $scope.gameID.slice($scope.gameID.lastIndexOf('/') + 1);
      $scope.status = 0; //0 is waiting, 1 is countdown, 2 is game in progress
      $scope.countDown = 5;

      
      if (!$rootScope.playerOne){
        $rootScope.socket.emit('joinGame', {'gameID': $scope.gameID});
      }

      $rootScope.socket.on('gameReady', function(data){
        $rootScope.playerTwo = true;        
      });
      
      $rootScope.socket.on('gameFull', function(data){
        $timeout(function(){$location.path('/watch/' + $scope.gameID);},0);
      });

      $rootScope.socket.on('updated', function(data){
        opponent.setValue(data.data, 1);
      });

      $rootScope.socket.on('testResults', function(obj) {
        $('.console').text('Console:');
        obj.console.forEach(function(result) {
          $('.console').append('<div>' + result + '</div>');
        });
      });

      $rootScope.socket.on('submitResults', function(obj) {
        console.log(obj);
        if(obj.success){
          $scope.complete = true;
        } 
      });

      $rootScope.socket.on('gameDoesNotExist', function(data){
        $timeout(function(){ $location.path('/gameDoesNotExist'); },0);
      });

      $rootScope.socket.on('startGame', function(data) {
        console.log('starting: ', data);
        $scope.status = 1; //countdown starts
        $scope.countDown = 6;
        var shortBeep = document.getElementById('shortBeep');
        var longBeep = document.getElementById('longBeep');
        var countDown = function() {
          $scope.countDown--;
          if ($scope.countDown > 0) {
            $timeout(countDown, 1000);
            shortBeep.play();
          } else {
            longBeep.play();
            $scope.status = 2;
            $scope.$broadcast('timer-start');
            $scope.timerRunning = true; 
            player.setValue(data.boilerplate, 1);
          }
        };
        $timeout(countDown, 1000);

        $scope.functionName = data.functionName;
      });

      $scope.game = "Battle.js Game";

      $scope.startGame = function(){
        $rootScope.socket.emit('ready', {'gameID': $scope.gameID});
        $scope.gameStarted = true;
      };

      $scope.setMode = function(mode){
          player.setKeyboardHandler('ace/keyboard/' + mode);
      };

      $scope.runCode = function() {
        $rootScope.socket.emit('test', { data: player.getValue(), gameID: $scope.gameID });
      };

      $scope.submitCode = function() {
        $rootScope.socket.emit('submit', { data: player.getValue(), gameID: $scope.gameID, functionName: $scope.functionName });
      };

      $scope.increaseFont = function() {
        fontSize++;
        playerElement.style.fontSize = fontSize + 'px';
        opponentElement.style.fontSize = fontSize + 'px';
      };

      $scope.decreaseFont = function() {
        fontSize--;
        playerElement.style.fontSize = fontSize + 'px';
        opponentElement.style.fontSize = fontSize + 'px';
      };

      var fontSize = 12;

      var player = ace.edit("player");
      player.setTheme("ace/theme/twilight");
      player.getSession().setMode("ace/mode/javascript");
      player.setShowPrintMargin(false);
      player.getSession().setTabSize(2);
      player.getSession().setUseSoftTabs(true);
      player.getSession().on('change', function(e) {
        $rootScope.socket.emit('update', { data: player.getValue(), gameID: $scope.gameID });
      });

      var opponent = ace.edit("opponent");
      opponent.setReadOnly(true); 
      opponent.setTheme("ace/theme/twilight");
      opponent.getSession().setMode("ace/mode/javascript");
      opponent.setShowPrintMargin(false);
      opponent.getSession().setTabSize(2);
      opponent.getSession().setUseSoftTabs(true);

      var playerElement = document.getElementById('player');
      var opponentElement = document.getElementById('opponent');
  });