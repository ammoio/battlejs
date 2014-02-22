angular.module('app')
  
  .controller('MainController',
    function($scope, $location, $rootScope, $timeout) {

      $scope.welcome = "Battle.js";

      $scope.newGame = function(){
        socket.emit('newGame', {});
      };
      socket.on('gameID', function(data){

        var gameID = data.gameID;

        $rootScope.gameID = gameID;
        //Flag for first player
        $rootScope.playerOne = true;
        //Handles angular digest cycle
        $timeout(function(){$location.path('/game/' + gameID);}, 0);

      });
  });