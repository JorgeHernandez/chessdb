var chessdbApp = angular.module('chessdbApp', [
  'ngRoute',
  'chessdbControllers'
]);

chessdbApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/games', {
        templateUrl: 'partials/game-list.html',
        controller: 'GameListCtrl'
      }).
      when('/game/:id', {
        templateUrl: 'partials/game-detail.html',
        controller: 'GameDetailCtrl'
      }).
      otherwise({
        redirectTo: '/games'
      });
  }]);