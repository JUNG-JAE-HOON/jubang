angular.module('side-main-controller',[])
.controller('sideMainCtrl',function($scope, $stateParams, $http, $httpParamSerializerJQLike,$sce,$window){
  $scope.tete1="사진";
  $scope.tete2="더보기";
  $scope.btnInfos=[{
    left:"main-left.png",
    right:"main-right.png",
    sref1:"app.findGenTabs",
    sref2:"app.findChurchTabs"
  }]

  $scope.slideImgs=[{
    img1:'main-slide.png',
    img2:'main-slide.png',
    img3:'main-slide.png'
  }];
  $scope.btnImg=[{left:"asdkj1", right:"asdkj2"}];
  $scope.tlt1=[{tltLeft:"동영상", tltRight:"더보기 "}];
  $scope.tlt2=[{tltLeft:"사진", tltRight:"더보기 "}];
  $scope.tlt3=[{tltLeft:"글", tltRight:"더보기 "}];

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  $scope.searchBarMent="지역 및 교회 이름을 입력해주세요";



  $scope.goBack = function(){
    console.log("뒤로가기");
    $window.history.go(-1);
  }


  $scope.churchVideoItems = [];


  function setStarScore(dataList, startId,starSize) {

    setTimeout(function() {
          var rateYo=function(){
             for(var i=0; i<dataList.length; i++){
              //  console.log("실행"+i);
              //  console.log(dataList[i].score);
               $("#"+startId+(i)).rateYo({
                 rating: dataList[i].score,
                 readOnly: true,
                 starWidth:starSize+"px"
               });
             }

          }
          rateYo();
    }, 1000);

  }

  $scope.getMinistryMain = function() {

    var myData = {
      no:  $stateParams.no
    }

    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/main/getMinistryMainList.php',
        data: $httpParamSerializerJQLike(myData),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {
      //alert(JSON.stringify(data.videoList));


        $scope.ministryVideoItems   = data.videoList;

        for (var i=0; i<data.videoList.length; i++) {
          $scope.ministryVideoItems[i].videoPath = $sce.trustAsResourceUrl (data.videoList[i].video_url);
        }

        $scope.ministryPhotoItems   = data.photoList;
        $scope.ministryWritingItems = data.writingList;

        //alert(JSON.stringify($scope.ministryPhotoItems));


        $( document ).ready(function() {
            setStarScore($scope.ministryVideoItems,"ministryVideo",10);
            setStarScore($scope.ministryPhotoItems,"ministryPhoto",10);
            setStarScore($scope.ministryWritingItems,"ministryWriting",14);

        });

    }).error(function (data, status, headers, config) {

    });

  }

  $scope.getChurchMain = function() {

    var myData = {
      no:  $stateParams.no
    }

    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/main/getChurchMainList.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {

        $scope.churchVideoItems   = data.videoList;

        for (var i=0; i<data.videoList.length; i++) {
          $scope.churchVideoItems[i].videoPath = $sce.trustAsResourceUrl (data.videoList[i].video_url);
        }

        $scope.churchPhotoItems   = data.photoList;
        $scope.churchWritingItems = data.writingList;


        $( document ).ready(function() {
            setStarScore($scope.churchVideoItems,"churchVideo",10);
            setStarScore($scope.churchPhotoItems,"churchPhoto",10);
            setStarScore($scope.churchWritingItems,"churchWriting",14);
        });

    }).error(function (data, status, headers, config) {

    });

  }

  $scope.getMinistryMain();

  $(document).on("click",".main-tabs .tab-nav.tabs a",function(){

    var title=$(this).text();
          if (title=="찬양사역자" ){   $scope.getMinistryMain();
    }else if (title="교회공고"    ){  $scope.getChurchMain();
    }
  });
});
