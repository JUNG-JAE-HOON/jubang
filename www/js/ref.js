angular.module('ref-controller',[])
.controller('refCtrl',function($scope,$ionicPopup){

$(function(){
  var star=function(){
    $(".rateYo").rateYo({
      starWidth: "13px",
     rating: "50%",
     precision: 0
    });

  }
  star()
});
$(function(){
  var star2=function(){
    $(".rateYo2").rateYo({
      starWidth: "13px",
     rating: "50%",
     precision: 0
    });

  }
  star2()
});

  $scope.button1="버튼1";
  $scope.button2="버튼2";
  $scope.placeHold="교단 이름을 입력해주세요";
  $scope.inputTitle="교단 이름을 입력해주세요";
  $scope.checkbox1="체크박스1";
  $scope.carTitle="askdjalskdj";
  $scope.cardTxt="hohoaskdjalskjdlaskdjalkjsdlasjdlaskjflaksjfdlskdj";
  $scope.checkboxTxt="개인회원 약관에 동의";
  $scope.checkboxTxt2="개인정보 수집 및 이용동의";
  $scope.checkboxTxt3="개인정보 제 3자 제공 및 위탁사항 이용 동의";
  $scope.checkboxTxt4="위치기반 서비스 이용약관";
  // $scope.checkboxTxt5="(필수)";
  $scope.tltLeft="좌측 타이틀";
  $scope.tltRight="더보기";
  $scope.checkbox2Txt="자동로그인";

  $(function () {
    function star(){
      $(".rateYo").rateYo({
        starWidth: "13px",
       rating: "50%",
       precision: 0
      });
    }

    star();

  });

  // 팝업

// A confirm dialog
$scope.showConfirm = function() {
 var confirmPopup = $ionicPopup.confirm({
   title: 'Consume Ice Cream',
   template: 'Are you sure you want to eat this ice cream?'
 });

 confirmPopup.then(function(res) {
   if(res) {
     console.log('You are sure');
   } else {
     console.log('You are not sure');
   }
 });
};

// An alert dialog
$scope.showAlert = function() {
 var alertPopup = $ionicPopup.alert({
   title: 'Don\'t eat that!',
   template: 'It might taste good'
 });

 alertPopup.then(function(res) {
   console.log('Thank you for not eating my delicious ice cream cone');
 });
};
});
