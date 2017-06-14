angular.module('side-main-controller',[])
.controller('sideMainCtrl',function($scope,$sate,Popup){
  $scope.hoho=function(){
    Popup.alert("hehe");
  }
});
