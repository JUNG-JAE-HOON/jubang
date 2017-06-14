angular.module('itemShop-controller', [])
.controller('itemShopCtrl', function($scope, $state, $ionicHistory) {

$scope.backBtn=function(){
     $state.go('app.main');
  }

  $scope.param=function(i){
       $state.go('itemSelect',{item:i});
    }

    })
