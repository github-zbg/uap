// The main app
var app = angular.module('uap', ['ngCookies']);

app.controller('ApplyController',
    ['$scope', '$http', '$cookies',
     function($scope, $http, $cookies) {
  $scope.user = $cookies.getObject('user');
  $scope.name = '';
  $scope.email = '';
  $scope.saveResult = null;

  // On inputbox change
  $scope.onChange = function() {
    $scope.saveResult = null;
  }

  $scope.save = function() {
    var query = 'name=' + $scope.name + '&email=' + $scope.email;
    $http.get('/api/save?' + query).
        then(function(response) {  // on success
          $scope.saveResult = response.data;
        }, function(response) {  // on error
          $scope.saveResult =
            response.status + ': ' + response.statusText + ', ' + response.data;
        });
  };
}]);

app.controller('LoginController',
    ['$scope', '$http', '$window', '$cookies',
     function($scope, $http, $window, $cookies) {
  $scope.nickname = '';
  $scope.userid = '';
  $scope.password = '';
  $scope.message = null;

  $scope.register = function() {
    $scope.message = null;
    if (!$scope.nickname || !$scope.userid || !$scope.password) {
      $scope.message = 'Missing required fields to register';
      return;
    }
    var user = {
      userid: $scope.userid,
      nickname: $scope.nickname,
      password: $scope.password,
    };
    $http.post('/api/register', user).then(
        function(response) {  // on success
          userInfo = angular.fromJson(response.data);
          $scope.message = 'redirecting ...';
          $cookies.putObject('user', userInfo);
          $window.location.href = '/';
        },
        function(response) {  // on error
          $scope.message =
            response.status + ': ' + response.statusText + ', ' + response.data;
        });
  };

  $scope.login = function() {
    $scope.message = null;
    if (!$scope.userid || !$scope.password) {
      $scope.message = 'Missing UserId or Password to login';
      return;
    }
    var user = {
      userid: $scope.userid,
      password: $scope.password,
    };
    $http.post('/api/login', user).then(
        function(response) {  // on success
          userInfo = angular.fromJson(response.data);
          $scope.message = 'redirecting ...';
          $cookies.putObject('user', userInfo);
          $window.location.href = '/';
        },
        function(response) {  // on error
          $scope.message =
            response.status + ': ' + response.statusText + ', ' + response.data;
        });
  };
}]);
