angular.module('tutorial-controller',[])
.controller('tutoCtrl',function($scope){


    $scope.img1='img/tuto/tuto1.png';
    $scope.img2='img/tuto/tuto2.png';
    $scope.img3='img/tuto/tuto3.png';


  $scope.button1=[{
    button1:"시작하기"
  }];
  $scope.button1Link="ref";

});
