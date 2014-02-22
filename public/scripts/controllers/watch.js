angular.module('app')
  
  .controller('WatchController',
    function($scope, $location, $rootScope, $timeout) {

      $scope.welcome = "Battle.js Viewer";
      
      $scope.gameID = $location.path();
      $scope.gameID = $scope.gameID.slice($scope.gameID.lastIndexOf('/') + 1);

      $rootScope.socket.emit('addMeAsWatcher', {
        gameID: $scope.gameID        
      });

      //need this here to redirect to not exist page because game.js is not controller
      $rootScope.socket.on('gameDoesNotExist', function(data){
        $timeout(function(){ $location.path('/gameDoesNotExist'); },0);
      });
      
      $scope.setMode = function(mode){
        if(mode === "normal") {
          player.setKeyboardHandler("");
        } else {          
          player.setKeyboardHandler('ace/keyboard/' + mode);
        }
      };

      var player1 = ace.edit("player1");
      player1.setReadOnly(true);
      player1.setTheme("ace/theme/twilight");
      player1.getSession().setMode("ace/mode/javascript");
      player1.setShowPrintMargin(false);
      player1.getSession().setTabSize(2);
      player1.getSession().setUseSoftTabs(true);

      var player2 = ace.edit("player2");
      player2.setReadOnly(true); 
      player2.setTheme("ace/theme/twilight");
      player2.getSession().setMode("ace/mode/javascript");
      player2.setShowPrintMargin(false);
      player2.getSession().setTabSize(2);
      player2.getSession().setUseSoftTabs(true);

      var player1Element = document.getElementById('player1');
      var player2Element = document.getElementById('player2');

      $rootScope.socket.on('viewerUpdate', function(response){
        console.log("View Update: ", response);
        if(response.player === 1) {
          player1.setValue(response.data, 1);
        } else {
          player2.setValue(response.data, 1);
        }
      });



      $scope.messages = [];

      $scope.chatRef = new Firebase('https://battlejs.firebaseio.com/chat/' + $scope.gameID);

      $scope.sendMessage = function(){
        if ($scope.name && $scope.text){
          $scope.chatRef.push({name: $scope.name, text: $scope.text});
          $scope.text = '';
        };
      };

      $scope.chatRef.on('child_added', function(snapshot) {
        $timeout(function(){$scope.messages.unshift(snapshot.val());},0);
      });
      
  });