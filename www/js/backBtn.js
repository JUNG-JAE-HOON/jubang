angular.module('backBtn',[])
.controller('backBtnCtrl', function($scope,$state,$ionicHistory) {

    $scope.backBtn=function(){
           $ionicHistory.goBack()
    }

});
