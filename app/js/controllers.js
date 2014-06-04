var chessdbApp = angular.module('chessdbApp', []);

chessdbApp.controller('GameListCtrl', function ($scope) {
  $scope.games = [{
    "id":1,
    "date":"01/01/1970",
    "white":"Karpov",
    "black":"Kasparov",
    "opening":"Sicilian Defense",
    "result":"white",
    "synopsis":"very boring match...."
},{
    "id":2,
    "date":"01/01/1970",
    "white":"Karpov",
    "black":"Kasparov",
    "opening":"Sicilian Defense",
    "result":"white",
    "synopsis":"very boring match...."
},{
    "id":1,
    "date":"01/01/1970",
    "white":"Karpov",
    "black":"Kasparov",
    "opening":"Sicilian Defense",
    "result":"white",
    "synopsis":"very boring match...."
}];
});