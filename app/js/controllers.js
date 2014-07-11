var chessdbControllers = angular.module('chessdbControllers', []);


//DEPRECATED
chessdbControllers.controller('LoginCtrl',['$scope','AUTH_EVENTS',
    function ($scope) {
        $scope.credentials = {
            username: '',
            password: ''
        };

        //probando ng-view
        $scope.loggedIn = false;

        $scope.login = function (credentials,$location) {
            //alert('WTF'+MI_CONSTANTE);//Can't access constant!!!!!!
            loggedIn = false;

            //replace this with a service
            if(credentials.username=='admin'&&credentials.password=='1234'){
                //alert('access granted '+credentials.username);
                $scope.loggedIn = true;
            }
//*
//ellocation no funciona. No puede setear path de undefined
            if(loggedIn==true){
                //$location.path("/games");
            } else {
                //$location.path("/login");
            }
//*/
        };
    }
]);


//DEPRECATED
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

//DEPRECATED
chessdbControllers.controller('GameDetailCtrl', [
    '$scope', 
    '$routeParams', 
    '$http',
    function($scope, $routeParams,$http) {
        $scope.id = $routeParams.id;
        $http.get('data/game_' + $routeParams.id + '.json').success(function(data) {
            $scope.movements = data;
        });

        //init chessboard
        var board1 = new ChessBoard('board1', {position:'start',showNotation: true});

        $scope.updateBoard = function(position){
            board1.position({
                a4: 'bK',
                c4: 'wK',
                a7: 'wR'
            });
        }
    }
]);

chessdbControllers.controller('GridCtrl', [
    '$scope',
    '$http',
    'AuthFactory',
    'USER_ROLES','AUTH_EVENTS',
    function($scope,$http,AuthFactory,USER_ROLES,AUTH_EVENTS){

someData = AuthFactory.getData();
console.dir(someData);
console.log('=============');
console.dir(AUTH_EVENTS);//HAY QUE INYECTARLO EN EL CONROLLER CON COMILLAS Y LUEGO PASAR EL PARAM  EN LA FUNCION!!!!!!!!!!!!!!



        //user login
        $scope.credentials = {
            username: '',
            password: ''
        };


        /*
        $scope.loggedIn = false;

        $scope.login = function (credentials,$location) {
            loggedIn = false;
            if(credentials.username=='admin'&&credentials.password=='1234'){
                $scope.loggedIn = true;
                $scope.username = credentials.username;
            }
        };
        */
        $scope.login = function (credentials,$location) {
            test = AuthFactory.login(credentials);
            console.dir(test);
        }


        //init chessboard
        var board1 = new ChessBoard('board1', {position:'start',showNotation: true});

        //var ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';
        //var board1 = new ChessBoard('board1', ruyLopez);

        $scope.mySelections = [];

        $http.get('data/games.json').success(function(data) {
            $scope.myData = data;
        });

        $scope.gridOptions = { 
            data: 'myData',
            selectedItems: $scope.mySelections,
            multiSelect: false,
            afterSelectionChange: function() {
                angular.forEach($scope.mySelections, function(item) {
                    $http.get('data/game_' + item.id + '.json').success(function(gamedata) {
                        $scope.movements = gamedata;
                    });
                    $scope.selectedId    = item.id;
                    $scope.selectedDate  = item.date;
                    $scope.selectedWhite = item.white;
                    $scope.selectedBlack = item.black;
                    $scope.updateBoard = function(position){
                        //console.log(position);
                        board1.position(position);
                    }
                });
            },
            columnDefs: [{
                field:'id', 
                displayName:'ID'
            }, {
                field:'date', 
                displayName:'Date'
            }, {
                field:'white',
                displayName:'White'
            }, {
                field:'black',
                displayName:'Black'
            }, {
                field:'opening',
                displayName:'Opening'
            }, {
                field:'result',
                displayName:'Winner'
            }, {
                field:'synopsis',
                displayName:'Synopsis'
            }]
        };
    }

]);

chessdbControllers.controller('ErrorCtrl', [
    '$scope', 
    function ($scope) {
        $scope.errorMsg = "The requested url doesn't exist";
    }
]);








/*
//Paginacion


app.controller('MyCtrl', function($scope, $http) {
    
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 

    $scope.totalServerItems = 0;

    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };  

    $scope.setPagingData = function (data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {        
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };
    
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});
*/