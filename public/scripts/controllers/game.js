angular.module('app')
  
  .controller('GameController',
    function($scope, $rootScope, $location, $timeout, SpinService) {
      $scope.game = "Battle.js Game";
      $scope.timing = false;
      $scope.complete = false;
      $scope.loser = false;
      $scope.opponentComplete = false;
      $scope.gameID = $location.path();
      $scope.gameLocation = 'http://' + $location.host() + $location.path();
      $('#link').html( '<p class="navbar-text no-padding">Share this link:  </p>' + '<input type="text" value="' +  $scope.gameLocation + '" class="form-control">');
      $scope.gameID = $scope.gameID.slice($scope.gameID.lastIndexOf('/') + 1);
      $scope.status = 0; //0 is waiting for player 2, 1 is waiting for ready, 2 is countdown, 3 is game in progress
      $scope.countDown = 5;
      $scope.timer = 0;
      $scope.minutesString = "00";
      $scope.secondsString = "00";
      SpinService.spin();
      $scope.possibleWeapons = ['VIM', 'EMACS', 'FREEZE', 'HIDE_SELF'];
      $scope.availableWeapons = ['VIM', 'EMACS', 'FREEZE', 'HIDE_SELF']; //copy of possibleWeapons that changes
      $scope.showOpponent = true;
      $scope.weapons = [];
      $scope.gameInProgress = false;

      $scope.reset = function() {
        $scope.status = 1;
        player.setReadOnly(false); 
        opponent.setReadOnly(false); 
        $scope.gameInProgress = false;
        $scope.timing = false;
        $scope.complete = false;
        $scope.loser = false;
        $scope.opponentComplete = false; 
        $scope.countDown = 5;
        $scope.timer = 0;
        $scope.weapons = [];
        $scope.gameStarted = false;
        player.setTheme("ace/theme/twilight");
        opponent.setTheme("ace/theme/twilight");
        $timeout.cancel($scope.countUpTimer); //cancel original timer
      };

      var promptName = $timeout(function() {
        $rootScope.playerName = "code warrior";//= window.prompt("State your name!");
        $('#vsModal').modal();
        $rootScope.socket.emit('playerName', {
          playerName: $scope.playerName,
          gameID: $scope.gameID
        });
      }, 1000);

      
      if (!$rootScope.playerOne){
        $rootScope.socket.emit('joinGame', {'gameID': $scope.gameID});
      }

      $rootScope.socket.on('gameReady', function(data){
        // $rootScope.playerTwo = true;
        $timeout(function(){
          $scope.status = 1;
          $rootScope.playerName = data.playerName;
          $scope.opponentName = data.opponentName;
          $('#vsModal').modal();
        }, 0);
        SpinService.stop();
      });

      $rootScope.socket.on('playerName', function(data) {
        $timeout(function(){
          $scope.playerName = data.name;
        }, 0);        
      });

      $rootScope.socket.on('opponentName', function(data){
        $timeout(function(){
          $scope.opponentName = data.name;
        }, 0);
      });
      
      $rootScope.socket.on('gameFull', function(data){
        $timeout.cancel(promptName);
        $timeout(function(){$location.path('/watch/' + $scope.gameID);},0);
      });

      $rootScope.socket.on('updated', function(data){
        if ($scope.showOpponent) {
          opponent.setValue(data.data, 1);
        }
      });

      $rootScope.socket.on('testResults', function(obj) {
        $('.console').text('Console:');
        obj.console.forEach(function(result) {
          $('.console').append('<div>' + result + '</div>');
        });
        if(obj.result.indexOf("Error") !== -1) {
          $('.console').append('<div>' + obj.result + '</div>');
        }
      });

      $rootScope.socket.on('submitResults', function(obj) {
        if(obj.success && !$scope.loser){
          $scope.timing = false;
          // $scope.timer = 0;
          $scope.complete = true;
          player.setTheme("ace/theme/dreamweaver");
          player.setValue(player.getValue() + "\n\n" + youWin + "\n\n// Performance: " + obj.timed + "ms", 1);
          player.setReadOnly(true); 
          $rootScope.socket.emit('winner', { data: player.getValue(), gameID: $scope.gameID });
        } else if (obj.success){
          $rootScope.socket.emit('gameOver', { data: player.getValue(), gameID: $scope.gameID });
        } else {
          $('.console').text(obj.result);
        }
      });

      $rootScope.socket.on('gameDoesNotExist', function(data){
        $timeout.cancel(promptName);
        $timeout(function(){ $location.path('/gameDoesNotExist'); },0);
      });

      $rootScope.socket.on('startGame', function(data) {
        console.log('starting: ', data);
        $scope.status = 2; //countdown starts
        $scope.countDown = 5;
        var shortBeep = document.getElementById('shortBeep');
        var longBeep = document.getElementById('longBeep');

        $timeout((function(){
            countDown(data);
        }), 1000);
        $scope.functionName = data.functionName;
      });

      $rootScope.socket.on('attacked', function(data) {
        if (data.weapon === 'VIM') {
          $('.VIMed').css('display', 'block');
          $timeout(function(){$('.VIMed').css('display', 'none')}, 3000);
          player.setKeyboardHandler('ace/keyboard/vim'); 
          $timeout(function() {
             player.setKeyboardHandler(''); 
          }, 30000);
        } else if (data.weapon === 'EMACS') {
          $('.EMACSed').css('display', 'block');
          $timeout(function(){$('.EMACSed').css('display', 'none')}, 3000);
          player.setKeyboardHandler('ace/keyboard/emacs'); 
          $timeout(function() {
             player.setKeyboardHandler(''); 
          }, 30000);
        } else if (data.weapon === 'DELETE_LINE') {
          console.log('delete a line');
          //Daniel DELETE LINE
        } else if (data.weapon === 'FREEZE') {
          $('.FREEZEed').css('display', 'block');
          $timeout(function(){$('.FREEZEed').css('display', 'none')}, 3000);
          var stopClicks = function(e) {
            e.stopPropagation();
            e.preventDefault();
          };
          player.setReadOnly(true);
   
          $timeout(function(){
            player.setReadOnly(false);
          }, 10000);
        } else if (data.weapon === 'HIDE_SELF') {
          $('.HIDE_SELFed').css('display', 'block');
          $timeout(function(){$('.HIDE_SELFed').css('display', 'none')}, 3000);
          $scope.showOpponent = false;
          $timeout(function(){
            $scope.showOpponent = true;
          }, 30000);
        } else {
          console.log('unknown weapon', data.weapon);
        }
      });

      var countDown = function(data) {
        console.log("TIME: ", data)
        $scope.countDown--;
        if ($scope.countDown > 0) {
          $timeout((function(){
            countDown(data);
        }), 1000);
          shortBeep.play();
        } else {
          ////start of the game!//////
          $('#vsModal').modal('hide');
          $scope.timing = true;
          longBeep.play();
          $scope.status = 3;
          $scope.giveRandomWeapon();
          $scope.gameInProgress = true;
          $timeout(countUp, 1000);
          player.setValue(data.boilerplate, 1);
        }
      };

      var countUp = function() {
        if($scope.timing){
          $scope.timer++;
        }
        $scope.minutesString = ~~($scope.timer / 60);
        $scope.secondsString = $scope.timer % 60;
        if ($scope.secondsString < 10) { //format seconds
          $scope.secondsString = "0" + $scope.secondsString;
        }
        if ($scope.minutesString < 10) {
          $scope.minutesString = "0" + $scope.minutesString;
        }
        //give random weapon
        if ($scope.timing && $scope.timer % 30 === 0) {
          $scope.giveRandomWeapon();
        }
        if ($scope.gameInProgress) {
          $timeout(countUp, 1000);
        }
      };

      $scope.game = "Battle.js Game";

      $scope.ready = function() {
        $rootScope.socket.emit('ready', {'gameID': $scope.gameID});
        $scope.gameStarted = true;
      };

      $scope.setMode = function(mode){
          player.setKeyboardHandler('ace/keyboard/' + mode);
      };

      $scope.runCode = function() {
        $rootScope.socket.emit('test', { data: player.getValue(), gameID: $scope.gameID });
      };

      $scope.submitCode = function() {
        $rootScope.socket.emit('submit', { data: player.getValue(), gameID: $scope.gameID, functionName: $scope.functionName });
      };


      /************ weapons **************/
      $scope.attack = function(index) {
        var weapon = $scope.weapons.splice(index, 1)[0];
        console.log('weapon attack', weapon);
        $rootScope.socket.emit('attack', {
          weapon: weapon,
          gameID: $scope.gameID
        });
      };

      $scope.giveRandomWeapon = function() {
        var generateRandomWeapon = function() {
          if ($scope.availableWeapons.length === 0) { //repopulate when all weapons used
            $scope.availableWeapons = $scope.possibleWeapons;
          }
          var index = ~~(Math.random() * $scope.availableWeapons.length);
          return $scope.availableWeapons.splice(index, 1)[0];
        };
        $scope.weapons.push(generateRandomWeapon());  
      };

      $scope.increaseFont = function() {
        fontSize++;
        playerElement.style.fontSize = fontSize + 'px';
        opponentElement.style.fontSize = fontSize + 'px';
      };

      $scope.decreaseFont = function() {
        fontSize--;
        playerElement.style.fontSize = fontSize + 'px';
        opponentElement.style.fontSize = fontSize + 'px';
      };

      var fontSize = 15;

      var player = ace.edit("player");
      player.setTheme("ace/theme/twilight");
      player.getSession().setMode("ace/mode/javascript");
      player.setShowPrintMargin(false);
      player.getSession().setTabSize(2);
      player.getSession().setUseSoftTabs(true);
      player.getSession().on('change', function(e) {
        $rootScope.socket.emit('update', { data: player.getValue(), gameID: $scope.gameID });
      });

      var opponent = ace.edit("opponent");
      opponent.setReadOnly(true); 
      opponent.setTheme("ace/theme/twilight");
      opponent.getSession().setMode("ace/mode/javascript");
      opponent.setShowPrintMargin(false);
      opponent.getSession().setTabSize(2);
      opponent.getSession().setUseSoftTabs(true);

      var playerElement = document.getElementById('player');
      var opponentElement = document.getElementById('opponent');

      var youWin = "// __     ______  _    _  __          _______ _   _ \n" +
      "// \\ \\   / / __ \\| |  | | \\ \\        / /_   _| \\ | |\n" +
      "//  \\ \\_/ / |  | | |  | |  \\ \\  /\\  / /  | | |  \\| |\n" +
      "//   \\   /| |  | | |  | |   \\ \\/  \\/ /   | | |     |\n" +
      "//    | | | |__| | |__| |    \\  /\\  /   _| |_| |\\  |\n" +
      "//    |_|  \\____/ \\____/      \\/  \\/   |_____|_| \\_|\n" ;

      $scope.increaseFont();




     $scope.startNewGame = function(){
       $scope.reset();
       $rootScope.socket.emit('startNewGame', { data: player.getValue(), gameID: $scope.gameID });
       $('#vsModal').modal();
       player.setValue('// Write your Code here!', 0);
       // if ($scope.loser){
       //  $scope.showLoser();
       // } else {
       //  $scope.showWinner();
       // }
     };

     $rootScope.socket.on('loser', function(){
       $scope.loser = true;
     });

     $scope.showWinner = function(){
       $('#winnerModal').modal('toggle')
     }

     $scope.showLoser = function(){
       $('#loserModal').modal('toggle')
     }

     $rootScope.socket.on('show', function(){
       if ($scope.loser){
        $scope.showLoser();
       } else {
        $scope.showWinner();
       }
     });

     $scope.mainPage = function(){
        $location.path('/');
     };


  });
