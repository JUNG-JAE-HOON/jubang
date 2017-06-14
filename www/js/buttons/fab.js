var app = angular.module('fab-controller', ['ng-mfb']);

app.controller('fabCtrl', function($scope,$ionicBackdrop) {
  $scope.name = 'World';
  $scope.menuState = 'closed';

  // $scope.action = function() {
  //    $ionicBackdrop.retain();
  //  };
  //     // $ionicBackdrop.release();
  //     $(".backdrop").click(function(){
  //       $ionicBackdrop.release();
  //     });
});
