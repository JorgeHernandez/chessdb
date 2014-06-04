var chessdbApp = angular.module('chessdbApp', []);

chessdbApp.controller('GameListCtrl', function ($scope, $http) {
  $http.get('data/games.json').success(function(data) {
    $scope.games = data;
  });
$scope.gameOrder = 'id';

});