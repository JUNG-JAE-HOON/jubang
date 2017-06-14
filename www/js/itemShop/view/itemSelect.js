angular.module('itemSelect-controller', [])
.controller('itemSelCtrl', function($scope, $state, $ionicHistory,$stateParams) {

$scope.backBtn=function(){
     $ionicHistory.goBack();

  }

  $scope.pageNum=$stateParams.item;
  });
