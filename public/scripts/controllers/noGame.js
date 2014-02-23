angular.module('app')
  
  .controller('NoGameController',
    function($scope, $location, $rootScope, $timeout) {

      $scope.welcome = "Your game does not exist";

      $scope.mainPage = function(){
        $location.path('/');
      };
  });