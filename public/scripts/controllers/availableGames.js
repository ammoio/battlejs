angular.module('app')
  .controller('AvailableGamesController', function($scope, $rootScope, $timeout) {
    $scope.availableGames = [];

              /*socket logic to get available games*/
    //after receiving the available games
    $rootScope.socket.on('receivedAvailableGames', function(data) {
      console.log('received', data);
      $timeout(function() {
        $scope.availableGames = data;
      }, 0);
    });

    //request to get available games
    $scope.getNewGames = function() {
      $rootScope.socket.emit('getAvailableGames');
      console.log('sending');
    };

    /* code to run immediately*/
    $scope.getNewGames();
  });
