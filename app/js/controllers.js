var chessdbControllers = angular.module('chessdbControllers', []);

chessdbControllers.controller('GameListCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/games.json').success(function(data) {
      $scope.games = data;
    });
    $scope.gameOrder = 'id';
  }]);

chessdbControllers.controller('GameDetailCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.id = $routeParams.id;
  }]);
