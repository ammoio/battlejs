angular.module('app')
  
  .controller('MainController',
    function($scope, $location) {

      $scope.welcome = "Battle.js";

      $scope.newGame = function(){
        $location.path('/newGame');
      };
  });