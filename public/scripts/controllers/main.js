angular.module('app')
  
  .controller('MainController',
    function($scope, $location) {

      $scope.welcome = "Battle.js";

      $scope.startGame = function(){
        $location.path('/newGame');
      };
  });