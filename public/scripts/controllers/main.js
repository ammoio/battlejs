angular.module('app')
  
  .controller('MainController',
    function($scope, $location, $rootScope) {

      $scope.welcome = "Battle.js";

      $scope.newGame = function(){
        socket.emit('newGame', {});
        socket.on('gameID', function(data){

          var gameID = data.gameID;

          $rootScope.gameID = gameID;

          $location.path('/game/' + gameID);

        });
      };
  });