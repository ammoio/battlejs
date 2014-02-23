angular.module('app')
  
  .controller('MainController',
    function($scope, $location, $rootScope, $timeout) {

      $scope.wantsNewGame = true;

      $scope.welcome = "BattleJS";


      $scope.newGame = function(){
        $rootScope.socket.emit('newGame', {newGame: $scope.wantsNewGame});
      };

      $rootScope.socket.on('gameID', function(data){
        var gameID = data.gameID;

        if ($scope.wantsNewGame){

          $rootScope.gameID = gameID;
          //Flag for first player
          $rootScope.playerOne = true;
          //Handles angular digest cycle
          $timeout(function(){$location.path('/game/' + gameID);}, 0);
        } else {
          $timeout(function(){$location.path('/game/' + gameID);}, 0);
        }

      });

      $scope.new = function(){
        $scope.wantsNewGame = true;
      };
      $scope.join = function(){
        $scope.wantsNewGame = false;
      };
  });