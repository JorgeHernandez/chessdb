var chessdbApp = angular.module('chessdbApp', [
  'ngRoute',
  'chessdbControllers',
  'ngGrid'
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
      when('/grid', {
        templateUrl: 'partials/grid.html',
        controller: 'GridCtrl'
      }).
      otherwise({
        redirectTo: '/games'
      });
  }]);