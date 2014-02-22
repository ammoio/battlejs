angular.module('app')
  
  .controller('WatchController',
    function($scope, $location, $rootScope, $timeout) {

      $scope.welcome = "Battle.js Viewer";
      
      $scope.gameID = $location.path();
      $scope.gameID = $scope.gameID.slice($scope.gameID.lastIndexOf('/') + 1);

      
      $scope.setMode = function(mode){
        if(mode === "normal") {
          player.setKeyboardHandler("");
        } else {          
          player.setKeyboardHandler('ace/keyboard/' + mode);
        }
      };

      var player1 = ace.edit("player1");
      player2.setReadOnly(true);
      player1.setTheme("ace/theme/twilight");
      player1.getSession().setMode("ace/mode/javascript");
      player1.setShowPrintMargin(false);
      player1.getSession().setTabSize(2);
      player1.getSession().setUseSoftTabs(true);
      player1.getSession().on('change', function(e) {
        // opponent.setValue(player.getValue(), 1); 
        $rootScope.socket.emit('update', { data: player1.getValue(), gameID: $scope.gameID });
      });

      var player2 = ace.edit("palyer2");
      player2.setReadOnly(true); 
      player2.setTheme("ace/theme/twilight");
      player2.getSession().setMode("ace/mode/javascript");
      player2.setShowPrintMargin(false);
      player2.getSession().setTabSize(2);
      player2.getSession().setUseSoftTabs(true);

      var player1Element = document.getElementById('player1');
      var player2Element = document.getElementById('player2');

      $rootScope.socket.on('updated', function(data){
        console.log(data);
        player2.setValue(data.data, 1);
      });
      
  });