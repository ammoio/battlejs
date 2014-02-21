angular.module('app')
  
  .controller('GameController',
    function($scope) {

      $scope.game = "Battle.js Game";

      $scope.startGame = function(){
        // Initiate game
      };

      $scope.submitCode = function(){
        // Test code
      };
  });