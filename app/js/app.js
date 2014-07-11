var chessdbApp = angular.module('chessdbApp', [
  'ngRoute',
  'chessdbControllers',
  'ngGrid'
]);

/*
http://localhost:8000/chessdb/app/#/login
http://localhost:8000/chessdb/app/#/grid
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
  console.dir(AUTH_EVENTS);
  console.dir(USER_ROLES);

  var factory = {};

  var someData = [
    {name:'john'},
    {name: 'mary'},
    {name: 'paul'}
  ];
  factory.getData = function () {
    return someData;
  }

  factory.login = function (credentials) {
    console.dir('USER_ROLES');
    /*
    return $http
      .post('/login', credentials)
      .then(function (res) {
        Session.create(res.id, res.userid, res.role);
      });
    */
    return credentials;
  }
  factory.isAuthenticated = function () {
    //return !!Session.userId;
    return true;
  }
  factory.isAuthorized = function () {
    /*
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (this.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
    */
    return true;
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