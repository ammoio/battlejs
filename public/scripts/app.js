angular.module('app', ['ngRoute', 'ngSanitize', 'timer'])


  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider

      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainController'
      })
      .when('/game/:id', {
        templateUrl: '/views/game.html',
        controller: 'GameController'
      })
      .when('/watch/:id', {
        templateUrl: '/views/watch.html',
        controller: 'WatchController'
      })
      .when('/gameDoesNotExist', {
        templateUrl: '/views/noGame.html',
        controller: 'NoGameController'
      });
  })

  .run(function($location, $rootScope) {
    $rootScope.socket = io.connect('http://' + $location.host());
  });

