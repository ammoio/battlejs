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
        console.log('changing route', gameID);
        $timeout(function(){$location.path('/game/' + '2345');}, 0);

      });
  });