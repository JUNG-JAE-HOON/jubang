angular.module("matchingChurch-controller",[])
.controller("matchingChurchCtrl",function($scope,$ionicHistory,$http,$httpParamSerializerJQLike,$localstorage){

  if($localstorage.get("auto") == "yes") {
      $scope.uid        = $localstorage.get("id");
      $scope.member_no  = $localstorage.get("member_no");
      $scope.valid_no   = $localstorage.get("valid_no");
  } else {
      $scope.uid        = sessionStorage.getItem("id");
      $scope.member_no  = sessionStorage.getItem("member_no");
      $scope.valid_no   = sessionStorage.getItem("valid_no");
  }

  document.getElementById("matchingListLeft").classList.add("tab-item-active");

  $scope.selboxData = {
        resume_list : [ {resume_data_no:"",title:"이력서를 선택해 주세요."}
        ]
  }
  //$scope.uid                     = "p20513";
  $scope.matching                = {};
  $scope.matching.resume_data_no = "";
  $scope.matching.type            = "cur";
  $scope.page                     = 0;
  $scope.items                    = [];

  var myData = {
    uid : $scope.uid
  }

  //alert($scope.uid);

  $http({
      method: 'POST',
      url: 'http://il-bang.com/jubang_ajax/church/view/getMatchingResumeList.php',
      data: $httpParamSerializerJQLike(myData),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).success(function (data, status, headers, config) {

      console.log(JSON.stringify(data));

      $scope.selboxData.resume_list = $scope.selboxData.resume_list.concat(data.listData) ;
      /*
      if (data.result == "1"){
          Popup.tapBack(data.msg);
      } else if (data.result == "0"){
          Popup.alert(data.msg);
      }*/
  });

  $scope.changeResumeTitle = function() {
    //alert($scope.matching.resume_data_no);
    $scope.page   = 0;
    $scope.items  = [];
    $scope.loadMore();
  }

  $scope.loadMore = function() {

    $scope.page = $scope.page +1;

    var myData = {
      page           : $scope.page,
      resume_data_no : $scope.matching.resume_data_no,
      type           : $scope.matching.type
    }

    //alert(JSON.stringify(myData))

    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/church/list/getMyCurMatchingList.php',
        data: $httpParamSerializerJQLike(myData),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {

        // console.log(JSON.stringify(data));
        $scope.items      = $scope.items.concat(data.listData);

        if (data.paging.page >= data.paging.allPage) {
           $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');

    }).error(function (data, status, headers, config) {
        // handle error things
    });

  };

  $scope.selectTab = function(type) {
    if(type=='cur'){
      document.getElementById("matchingListLeft").classList.add("tab-item-active");
      document.getElementById("matchingListRigth").classList.remove("tab-item-active");
    }else{
      document.getElementById("matchingListRigth").classList.add("tab-item-active");
      document.getElementById("matchingListLeft").classList.remove("tab-item-active");
    }
    $scope.matching.type = type;
    $scope.items = [];
    $scope.page  = 0;
    $scope.loadMore();

  }


  $scope.hihi=function(){
    /*
    $(".tab-item").each(function(i){
      $(this).click(function(){
        $(".tab-item").removeClass("tab-item-active");
        $(this).addClass("tab-item-active");
        $(".list-tab").hide();
        $(".list-tab"+(i+1)).show();

      });
    });
    */
  }
  $scope.backBtn = function() {
      $ionicHistory.goBack();
  }
});
