angular.module('cs-controller', [])
.controller('csCtrl', function($scope, $ionicModal, $timeout,$state,$ionicHistory) {
  $(".tab-item").each(function(i){
    $(this).click(function(){
      $(".tab-item").removeClass("tab-item-active");
      $(this).addClass("tab-item-active");
      $(".list-tab").hide();
      $(".list-tab"+(i+1)).show();

    });
  });

    $(".question-wrap").each(function(i){

        $(this).click(function(){
          $(".a"+(i+1)).slideToggle();
        });
    });

    $scope.hoho=false;
    $scope.showIcon=function(){
      $scope.icon=true;
    }

    $scope.hideIcon=function(){
      $scope.icon=false;
    }
    $scope.backBtn=function(){
       $ionicHistory.goBack()
    }
  });
