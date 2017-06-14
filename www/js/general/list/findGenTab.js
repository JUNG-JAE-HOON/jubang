angular.module('genTab-controller',[])
.controller('genTabCtrl',function($scope,$ionicHistory,$http, $httpParamSerializerJQLike,$ionicModal,$ionicHistory,$ionicSlideBoxDelegate,$sce,$stateParams,Popup,$localstorage,$ionicPopup){
  //alert('t');
  $(".tab-item").each(function(i){
    $(this).click(function(){
      $(".tab-item").removeClass("tab-item-active");
      $(this).addClass("tab-item-active");
    });
  });


  // 리스트 dotdotdot
  var boxHeight=$('.thumbnailist-cont').height();
  if(boxHeight>90){
      // console.log($(".thumbnailist-cont").text());
      // console.log($(".thumbnailist-cont").text().length);
      $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0,95)+'…');
  }else if(boxHeight<90){
      // console.log($(".thumbnailist-cont").text());
      // console.log($(".thumbnailist-cont").text().length);
      $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0,95)+'…');
  }

  if($localstorage.get("auto") == "yes") {
      $scope.id = $localstorage.get("id");
      $scope.check = $localstorage.get("check");
  } else {
      $scope.id = sessionStorage.getItem("id");
      $scope.check = sessionStorage.getItem("check");
  }
  if($stateParams.no!=undefined){
    $scope.openModal($stateParams.no);
  }

  $scope.backBtn=function(){
     $ionicHistory.goBack()
  }

  // 모든 채용공고 조회

  $scope.selboxData = {
    area_1st : [
               {no:""    , list_name:'시'}
              ,{no:"1"   , list_name:'서울'}
              ,{no:"907" , list_name:'인천'}
              ,{no:"1164", list_name:'광주'}
              ,{no:"1420", list_name:'대전'}
              ,{no:"7700", list_name:'세종'}
              ,{no:"1631", list_name:'대구'}
              ,{no:"1923", list_name:'부산'}
              ,{no:"2314", list_name:'울산'}
              ,{no:"2422", list_name:'경기'}
              ,{no:"3312", list_name:'강원'}
              ,{no:"3641", list_name:'충남'}
              ,{no:"3950", list_name:'충북'}
              ,{no:"4219", list_name:'전남'}
              ,{no:"4687", list_name:'전북'}
              ,{no:"5128", list_name:'경남'}
              ,{no:"5709", list_name:'경북'}
              ,{no:"6296", list_name:'제주'}
            ],
    area_2nd :
              [
                {no:"", list_name:"구"}
              ]
  }

  $scope.page        = 0      ;
  $scope.items       = []     ;
  //$scope.area_1st_no = ""     ;
  //$scope.area_2nd_no = ""     ;
  $scope.orderBy     = "all"  ; // all-전체, edit_date-최근순, score-별점순, distance-거리순
  $scope.photoItems  = []     ;
  $scope.fGT = {}     ;
  $scope.fGT.area_1st_no = "";
  $scope.fGT.area_2nd_no = "";
  $scope.commentList = [];
  $scope.getArea2ndList = function() {
    if ($scope.fGT.area_1st_no == ""){
      $scope.selboxData.area_2nd = [{no:'',list_name:'구'}];
      $scope.fGT.area_2nd_no = ""


      $scope.page         = 0   ;
      $scope.items        = []  ;
      $scope.loadMore()         ;
      return;
    }
    var myData = {
      area_1st_no:  $scope.fGT.area_1st_no
    }
    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/church/form/getArea2ndList.php',
        data: $httpParamSerializerJQLike(myData),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {

        $scope.selboxData.area_2nd = [{no:'',list_name:'구'}]
        $scope.selboxData.area_2nd = $scope.selboxData.area_2nd.concat(data.listData);
        $scope.fGT.area_2nd_no  = ''  ;
        $scope.page         = 0   ;
        $scope.items        = []  ;
        $scope.loadMore()         ;
    }).error(function (data, status, headers, config) {

    });
  }

  $scope.selectArea2ndList = function() {
    $scope.page         = 0   ;
    $scope.items        = []  ;
    $scope.loadMore()         ;
  }


  $scope.loadMore = function() {

    $scope.page = $scope.page +1;
    var myData = {
      page        : $scope.page,
      area_1st_no : $scope.fGT.area_1st_no,
      area_2nd_no : $scope.fGT.area_2nd_no,
      orderBy     : $scope.orderBy
    }

    //  alert(J SON.stringify(myData))

    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/general/list/getResumeList.php',
        data: $httpParamSerializerJQLike(myData),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {

        //alert(JSON.stringify(data.photoData));

        $scope.items      = $scope.items.concat(data.listData);
        $scope.photoItems = $.extend($scope.photoItems,data.photoData);
        $scope.noMoreItemsAvailable = false;

        if (data.paging.page >= data.paging.allPage) {
           $scope.noMoreItemsAvailable = true;
        }

        $( document ).ready(function() {
            asyncGreet(data.listData);
        });

        $scope.$broadcast('scroll.infiniteScrollComplete');

    }).error(function (data, status, headers, config) {
        // handle error things
    });

  };


    function asyncGreet() {

      setTimeout(function() {
            var rateYo=function(){
               for(var i=0; i<$scope.items.length; i++){
                 //console.log("실행"+i);
                 //alert($scope.items[i].sore);
                 if($scope.items[i].score == null){
                   $scope.items[i].score=0.0;
                 }
                 $("#rateYo"+(i)).rateYo({
                   rating: $scope.items[i].score,
                   readOnly: true,
                   starWidth:'17px'
                 });
               }

            }
            rateYo();
      }, 1000);

    }


  $scope.selectOrderBy = function(type) {
    $scope.orderBy  = type    ;
    $scope.page     = 0       ;
    $scope.items    = []      ;
    $scope.loadMore()         ;
  }

  $ionicModal.fromTemplateUrl('templates/general/view/detailPageModal.html', {
   scope: $scope,
   animation: 'slide-in-up',
   cache: false
 }).then(function(modal) {
   $scope.modal = modal;
 });
 $scope.openModal = function(resumeDataNo) {
   $scope.modal.show();
   $scope.no = resumeDataNo;

   var data = {
        no : resumeDataNo,
        id : $scope.id
   };


   $http({
       method: 'POST',
       url: 'http://il-bang.com/jubang_ajax/general/view/getResumeData.php',
       data: $httpParamSerializerJQLike(data),
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
   }).success(function (data, status, headers, config) {

       $scope.reviewPage = 1;
       $scope.getResumeReview(resumeDataNo,$scope.reviewPage);
       console.log(JSON.stringify(data));
       if(data.message == '삭제된 이력서입니다.') {
           Popup.tapBack(data.message);
       } else if(data.message == '데이터 없음') {

       } else {
           if(data.resumePictures != null) {
               for(var i=0; i<data.resumePictures.length; i++) {
                   document.getElementById("imageList").innerHTML
                   += '<div>'
                   + '<img src="' + data.resumePictures[i] + '" width="100" height="100%" />'
                   + '</div>';
               }

               $('.thumbnail-list').slick({
                   infinite: true,
                   slidesToShow: 3,
                   slidesToScroll: 2,
                   arrows: true
               });
           }
           $scope.resumeDataUid = data.resumeData.resumeDataUid;
           $scope.videoPath = $sce.trustAsResourceUrl(data.resumeData.video);
           $scope.title = data.resumeData.title;
           $scope.content = data.resumeData.content;
           $scope.date = data.resumeData.date;
           $scope.name = data.resumeData.name;
           $scope.address = data.resumeData.address;
           $scope.eventDate = data.resumeData.eventDate;
           $scope.pay = data.resumeData.pay;
           $scope.profile = data.resumeData.profile;
           $scope.snsShareNo = $scope.no;
           $scope.snsSharetitle = $scope.title;
           $scope.snsSharetype = 1;
           $scope.score = data.resumeData.score;
           $scope.myScore = data.resumeData.myScore;
           if(data.resumeData.score==null){
             data.resumeData.score=0.0;
           }
           if(data.resumeData.myScore==null){
             data.resumeData.myScore=0.0;
           }

          score(data.resumeData.score);
          myScore(data.resumeData.myScore);

       }
   });
 };

 function score(score){
   $("#rateYo").rateYo({
       rating: score,
        readOnly: true,
        starWidth: '13px'
    });
 }



 function myScore(score) {
      $("#resumeRateYoBig").rateYo({
        rating: score,
        readOnly: false,
        starWidth: '30px'
     });
 }


 $scope.giveStar = function(no) {
     var score = $("#resumeRateYoBig").rateYo("rating");

     if($scope.myScore == 0) {
         var content = "이 글에 점수를 주시겠습니까? (" + score + "점)";
     } else {
         var content = "이미 점수를 주셨습니다. 점수를 변경하시겠습니까? (" + score + "점)";
     }

     $ionicPopup.confirm({
         // cssClass: '클래스명',
         template: content,
         buttons: [{
             text: "취소",
             type: "button-stable"
         }, {
             text: "확인",
             type: "button-positive",
             onTap: function() {
                 if($scope.check == "Y") {
                     var data = {
                         id: $scope.id,
                         no: no,
                         score: score,
                         preScore: $scope.score
                     };
                    //  console.log(JSON.stringify(data));
                     $http({
                         method: 'POST',
                         url: 'http://il-bang.com/jubang_ajax/general/list/giveStar.php',
                         data: $httpParamSerializerJQLike(data),
                         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                     }).success(function (data, status, headers, config) {
                         Popup.alert(data);
                     });
                 } else {
                     Popup.noService();
                 }
             }
         }]
     });
 }

 $scope.resumeReviewDelete = function(no,content){
   alert(no);
   $ionicPopup.confirm({
       // cssClass: '클래스명',
       template: '"'+content+'"<br>댓글을 삭제하시겠습니까?',
       buttons: [{
           text: "취소",
           type: "button-stable"
       }, {
           text: "삭제",
           type: "button-positive",
           onTap: function() {
             var data = {
               id: $scope.id,
               no: no
             }
             $http({
                 method: 'POST',
                 url: 'http://il-bang.com/jubang_ajax/general/view/resumeReviewDelete.php',
                 data: $httpParamSerializerJQLike(data),
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
             }).success(function (data, status, headers, config) {
                if(data=="삭제"){
                  $scope.reviewPage = 1;
                  $scope.getResumeReview($scope.no,$scope.reviewPage);
                  Popup.alert("삭제되었습니다.");
                }else{
                  Popup.alert("삭제에 실패했습니다. 다시 시도해주세요.");
                }
             });
           }
       }]
   });
 }
 $scope.moreResumeReview = function(){
   $scope.reviewPage = $scope.reviewPage+1;
   $scope.getResumeReview($scope.no,$scope.reviewPage);
 }
 $scope.getResumeReview = function(no, page) {
     var data = {
         no: no,
         page: page
     };
     $http({
         method: 'POST',
         url: 'http://il-bang.com/jubang_ajax/general/view/getResumeReview.php',
         data: $httpParamSerializerJQLike(data),
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
     }).success(function (data, status, headers, config) {
       $scope.lowerId = $scope.id.toLowerCase();
       $scope.commentMoreView = '';

         if($scope.reviewPage == 1) {
             $scope.commentList = [];
             $scope.commentList = data.commentList;
             if(data.paging.allPage > 1) {
                 $scope.commentMoreView = true;
             } else {
                 $scope.commentMoreView = false;
             }
         } else {
             $scope.commentList = $scope.commentList.concat(data.commentList);
         }
         if(data.commentList == null){

           $scope.noReview = "등록된 댓글이 없습니다.";
         }

         if(data.paging.page >= data.paging.allPage) {
             $scope.commentMoreView = false;
         } else {
             $scope.commentMoreView = true;
         }
     });
 }

$scope.resumeReviewAdd = function(){
  var newReview;
  newReview = document.getElementById("reviewInput").value;
  if(newReview==''){
      Popup.alert("글 입력 후 눌러주세요.");
  }else if($scope.id == $scope.resumeDataUid){
      Popup.alert("로그인 후 사용해 주세요.");
  }else{
    var data = {
        no        : $scope.no,
        content   : newReview,
        id        : $scope.id,
        resumeId  : $scope.resumeDataUid
    };
    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/general/view/insertReview.php',
        data: $httpParamSerializerJQLike(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function (data, status, headers, config) {
        if(data=="등록"){
          $scope.reviewPage = 1;
          $scope.getResumeReview($scope.no,$scope.reviewPage);
          $('[id=reviewInput]').val('');
        }else{
          Popup.alert("등록에 실패하였습니다. 다시 시도해 주세요.");
        }
    });
  }
}


 $scope.closeModal = function() {
   $scope.modal.hide();
   document.getElementById("imageList").innerHTML=" ";
   $scope.commentList = [];
   $('[id=reviewInput]').val('');

      score("0");
      myScore("0");
 };


     $scope.next = function() {
       $ionicSlideBoxDelegate.next();
     };
     $scope.prev = function() {
       $ionicSlideBoxDelegate.previous();
     };
});
