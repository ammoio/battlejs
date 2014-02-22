angular.module('app')
  
  .controller('GameController',
    function($scope, $rootScope, $location) {

      $scope.game = "Battle.js Game";

      $scope.startGame = function(){
        // Initiate game
      };

      $scope.setMode = function(mode){
        if(mode === "normal") {
          player.setKeyboardHandler("");
        } else {          
          player.setKeyboardHandler('ace/keyboard/' + mode);
        }
      };

      $scope.runCode = function() {
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
        // opponent.setValue(player.getValue(), 1); 
        socket.emit('update', { data: player.getValue(), gameID: gameID });
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


      if (!$rootScope.playerOne){
        var gameID = $location.path();
        gameID = gameID.slice(gameID.lastIndexOf('/') + 1);
        socket.emit('joinGame', {'gameID': gameID});
      }

      socket.on('gameReady', function(data){
        console.log('hello', data);
      });
      
      socket.on('gameFull', function(data){
        $location.path('/watch/' + gameID);
      });

      socket.on('updated', function(data){
        console.log(data);
        opponent.setValue(data.data, 1);
      });

  });