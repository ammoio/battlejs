angular.module('app')
  
  .controller('GameController',
    function($scope, $rootScope, $location) {
      $scope.gameID = $location.path();
      $scope.gameID = $scope.gameID.slice($scope.gameID.lastIndexOf('/') + 1);


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
        $rootScope.socket.emit('test', { data: player.getValue(), gameID: gameID, player: $rootScope.playerOne });
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


      if (!$rootScope.playerOne){
        $rootScope.socket.emit('joinGame', {'gameID': $scope.gameID});
        var gameID = $location.path();
        gameID = gameID.slice(gameID.lastIndexOf('/') + 1);
        $rootScope.socket.emit('joinGame', { 'gameID': gameID });
      }

      $rootScope.socket.on('gameReady', function(response){
        //response.name = name of the problem
        player.setValue(response.biolerplate, 1);
      });
      
      $rootScope.socket.on('gameFull', function(data){
        $location.path('/watch/' + $scope.gameID);
      });

      $rootScope.socket.on('updated', function(data){
        opponent.setValue(data.data, 1);
      });

      $rootScope.socket.on('testResults', function(obj) {
        console.log(obj);
      });
  });