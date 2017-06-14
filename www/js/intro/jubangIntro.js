angular.module('intro-controller', [])
.controller('introCtrl', function($scope, $state, $ionicHistory) {

$scope.backBtn=function(){
            // $ionicHistory.goBack()
     $state.go('app.main');
  }
});
