angular.module('app')
  
  .controller('MainController',
    function($scope, $location, $rootScope, $timeout) {

      $('input[type="radio"]:checked').parent('label').addClass('active');

      $scope.welcome = "BattleJS";


      $scope.newGame = function(){
        var gameName = window.prompt("Give this game a name!");
        $rootScope.socket.emit('newGame', {gameName: gameName});
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
  });