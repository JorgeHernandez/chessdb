var chessdbApp = angular.module('chessdbApp', [
  'ngRoute',
  'chessdbControllers',
  'ngGrid'
]);

/*
http://localhost:8000/#/login
http://localhost:8000/#/grid
*/
chessdbApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login',{
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/grid', {
        templateUrl: 'partials/grid.html',
        controller: 'GridCtrl'
      }).
      when('/games', {
        templateUrl: 'partials/game-list.html',
        controller: 'GameListCtrl'
      }).
      when('/game/:id', {
        templateUrl: 'partials/game-detail.html',
        controller: 'GameDetailCtrl'
      }).
      when('/error',{
        templateUrl: 'partials/error.html',
        controller: 'ErrorCtrl'
      }).
      otherwise({
        redirectTo: '/error'
      });
  }]);

chessdbApp.constant('AUTH_EVENTS', {
    loginSuccess:       'auth-login-success',
    loginFailed:        'auth-login-failed',
    logoutSuccess:      'auth-logout-success',
    sessionTimeout:     'auth-session-timeout',
    notAuthenticated:   'auth-not-authenticated',
    notAuthorized:      'auth-not-authorized'
});

chessdbApp.constant('USER_ROLES', {
    all:    '*',
    admin:  'admin',
    editor: 'editor',
    guest:  'guest'
});

chessdbApp.factory('AuthFactory', function ($http, Session,USER_ROLES,AUTH_EVENTS) {
    
    var factory = {};

    factory.login = function (credentials) {
        /*
        console.log('USER_ROLES');
        console.dir(USER_ROLES);
        console.log('credentials');
        console.dir(credentials);
        //*/

        /*
        //return $http.get('http://localhost:8080/chessdb/api/index.php/login').success(function(data){
        return $http.get('http://localhost:8000/api/login').success(function(data){
            console.log('data');
            console.dir(data);
            //$scope.data = data;
            return true;
        }).error(function(){
            console.log('HTTP get error. Cannot reach rest API');
        });
        */

        return $http
        .get('http://localhost:8000/api/login', credentials)
        .then(function (res) {
            Session.create(res.id, res.userid, res.role);
            console.log('res');
            console.dir(res.data);
            console.dir(Session);
        });

        return credentials;
    }

    factory.isAuthenticated = function () {
        return !!Session.userId;
    }

    factory.isAuthorized = function () {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (this.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);
    }

    return factory;
});


chessdbApp.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id       = sessionId;
        this.userId   = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id       = null;
        this.userId   = null;
        this.userRole = null;
    };
    return this;
});