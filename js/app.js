    'use strict';

    var app = angular.module('puzzle',['slidingPuzzle','ui.router']);



    app.controller('slidingAdvancedCtrl', function($scope) {
        $scope.rows = 3;
        $scope.cols = 3;
   });

  

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/puzzle");
  $stateProvider
    .state('puzzle', {
      url: "/puzzle",
      templateUrl: "partials/puzzle.html",
      conroller:"slidingAdvancedCtrl"
    })
    .state('results', {
      url: "/results",
      templateUrl: "partials/results.html",
      controller: function($scope) {
        $scope.results = JSON.parse(localStorage.getItem('results'));
      }
    });
});


app.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});

app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])