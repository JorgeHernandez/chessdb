var chessdbControllers = angular.module('chessdbControllers', []);

chessdbControllers.controller('GameListCtrl', [
    '$scope', 
    '$http',
    function ($scope, $http) {
        $http.get('data/games.json').success(function(data) {
            $scope.games = data;
        });
        $scope.gameOrder = 'id';
    }
]);

chessdbControllers.controller('GameDetailCtrl', [
    '$scope', 
    '$routeParams', 
    '$http',
    function($scope, $routeParams,$http) {
        $scope.id = $routeParams.id;
        $http.get('data/game_' + $routeParams.id + '.json').success(function(data) {
            $scope.movements = data;
        });
    }
]);