angular.module('app', ['ngRoute'])

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
        templateUrl: '/views/game.html',
        controller: 'GameController'
      });
    window.socket = io.connect('http://localhost');
  });