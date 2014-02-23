angular.module('app')
  
  .controller('MainController',
    function($scope, $location, $rootScope, $timeout) {

      $('input[type="radio"]:checked').parent('label').addClass('active');

      $scope.wantsNewGame = true;

      $scope.welcome = "BattleJS";


      $scope.newGame = function(){
        $rootScope.socket.emit('newGame', {newGame: $scope.wantsNewGame});
      };

      $rootScope.socket.on('gameID', function(data){
        var gameID = data.gameID;

        if (!data.second){

          $rootScope.gameID = gameID;
          //Flag for first player
          $rootScope.playerOne = true;
          //Handles angular digest cycle
          $timeout(function(){window.location.href('' + $location.path('/game/' + gameID));}, 0);
        } else {
          $timeout(function(){window.location.href('' + $location.path('/game/' + gameID));}, 0);
        }

      });

      $scope.new = function(){
        $scope.wantsNewGame = true;
      };
      $scope.join = function(){
        $scope.wantsNewGame = false;
      };
  });