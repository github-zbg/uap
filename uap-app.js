// The main app
var app = angular.module('uap', []);

app.controller('SaveController',
    ['$scope', '$http', function($scope, $http) {
  $scope.name = '';
  $scope.email = '';
  $scope.saveResult = null;

  $scope.onChange = function() {
    $scope.saveResult = null;
  }

  $scope.save = function() {
    var query = 'name=' + $scope.name + '&email=' + $scope.email;
    $http.get('/save?' + query).then(function(response) {
      $scope.saveResult =
        response.status + ': ' + response.statusText + ', ' + response.data;
    });
  };

}]);