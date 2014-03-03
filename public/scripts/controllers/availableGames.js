angular.module('app')
  .controller('AvailableGamesController', function($scope, $rootScope, $timeout, $interval) {
    $scope.availableGames = [];

    /*socket logic to get available games*/
    //after receiving the available games
    $rootScope.socket.on('receivedAvailableGames', function(data) {
      $timeout(function() {
        $scope.availableGames = data;
      }, 0);
    });

    //request to get available games
    $scope.getNewGames = function() {
      $rootScope.socket.emit('getAvailableGames');
    };

    /* code to run immediately*/
    $interval(function() {
      $scope.getNewGames();
    }, 3000);
  });
