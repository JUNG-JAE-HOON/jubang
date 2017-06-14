angular.module('general-write',[])
.controller('generalWriteCtrl',function($scope, $http, $httpParamSerializerJQLike, $cordovaFileTransfer, $cordovaCamera,$localstorage, Popup ){

      if($localstorage.get("auto")=="yes"){
        $scope.uid        = $localstorage.get("id");
        $scope.member_no  = $localstorage.get("member_no");
        $scope.valid_no   = $localstorage.get("valid_no");
        $scope.check      = $localstorage.get("check");
      }else{
        $scope.uid        = sessionStorage.getItem("id");
        $scope.member_no  = sessionStorage.getItem("member_no");
        $scope.valid_no   = sessionStorage.getItem("valid_no");
        $scope.check      = sessionStorage.getItem("check");
      }
      // alert($scope.member_no);

      //  테스트 나중에 지워야함.
      //  $scope.member_no  = "0";
      //$scope.uid        = "p20513";
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
                  ,
        start_date : ["시작일"],
        end_date   : ["종료일"],
        start_time : ["시작시간"],
        end_time   : ["종료시간"]
      }

      var hh = "";
      var mi = "";

      for (var i=0; i<=24; i+=1) {
          for (var j=0; j<=59; j+=30) {
              if (i == 24 && j == 30) continue;

              if (i.toString().length == 1) hh = "0"+i  ;
              else                          hh= i       ;

              if (j.toString().length == 1) mi = "0"+j  ;
              else                          mi = j      ;

              $scope.selboxData.start_time .push(hh +":"+ mi);
              $scope.selboxData.end_time   .push(hh +":"+ mi);
          }
      }


      function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
      }

      for (var i=0; i<=365; i++){
          var eventDate = new Date();
          eventDate.setDate(eventDate.getDate()+i);
          $scope.selboxData.start_date .push(formatDate(eventDate).toString());
          $scope.selboxData.end_date   .push(formatDate(eventDate).toString());
      }


      $scope.getArea2ndList = function() {
        var myData = {
          area_1st_no:  $scope.generalForm.area_1st_no
        }
        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/general/form/getArea2ndList.php',
            data: $httpParamSerializerJQLike(myData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            $scope.selboxData.area_2nd = [{no:'',list_name:'구'}]
            $scope.selboxData.area_2nd = $scope.selboxData.area_2nd.concat(data.listData);
            $scope.generalForm.area_2nd_no = '';
        }).error(function (data, status, headers, config) {

        });
      }

      $scope.generalForm = {};
      $scope.generalForm.area_1st_no    = "";
      $scope.generalForm.area_2nd_no    = "";

      $scope.generalForm.start_date     = "시작일";
      $scope.generalForm.end_date       = "종료일";
      $scope.generalForm.imageList      = [];
      $scope.generalForm.start_time     = "시작시간";
      $scope.generalForm.end_time       = "종료시간";
      $scope.generalForm.matchingOneYn  = "N";


      $scope.insertForm = function() {

        var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
        var num_check=/^[0-9]*$/;

        if ($scope.uid == null || $scope.uid == undefined || $scope.uid == ''){
          Popup.tapLogin("로그인 하세요.");
          return ;
        } else if ($scope.generalForm.title == undefined || $scope.generalForm.title == ''    ) {
          Popup.alert("이력서 제목을 입력해주세요.");
          return ;
        } else if (special_pattern.test($scope.generalForm.title) == true     ) {
          Popup.alert("이력서 제목에 특수문자는 입력할 수 없습니다.");
          return ;
        } else if ($scope.generalForm.name == undefined || $scope.generalForm.name == ''    ) {
          Popup.alert("성함을 입력해주세요.");
          return ;
        } else if (special_pattern.test($scope.generalForm.name) == true     ) {
          Popup.alert("성함에 특수문자는 입력할 수 없습니다.");
          return ;
        } else if ($scope.generalForm.area_1st_no == undefined || $scope.generalForm.area_1st_no == ''  ) {
          Popup.alert("시를 선택해 주세요.");
          return ;
        } else if ($scope.generalForm.area_2nd_no == undefined || $scope.generalForm.area_2nd_no == ''  ) {
          Popup.alert("구를 선택해 주세요.");
          return ;
        } else if ($scope.generalForm.address == undefined || $scope.generalForm.address == ''    ) {
          Popup.alert("상세주소를 입력해주세요.");
          return ;
        } else if ($scope.generalForm.start_date == '시작일'  ) {
          Popup.alert("행사 시작일을 선택해 주세요.");
          return ;
        } else if ($scope.generalForm.end_date   == '종료일'  ) {
          Popup.alert("행사 종료일을 선택해 주세요.");
          return ;
        } else if ($scope.generalForm.start_time == '시작시간'  ) {
          Popup.alert("행사 시작시간을 선택해 주세요.");
          return ;
        } else if ($scope.generalForm.end_time   == '종료시간'  ) {
            Popup.alert("행사 종료시간을 선택해 주세요.");
            return ;
        } else if($scope.generalForm.start_date > $scope.generalForm.end_date) {
            Popup.alert("행사 종료날짜는 시작 날짜보다 빠를 수 없습니다.");
            return;
        } else if($scope.generalForm.start_time > $scope.generalForm.end_time) {
            Popup.alert("행사 종료시간은 시작 시간보다 빠를 수 없습니다.");
            return;
        } else if ($scope.generalForm.pay == undefined || $scope.generalForm.pay        == ''  ) {
          Popup.alert("금액을 입력해 주세요.");
          return ;
        } else if (!num_check.test($scope.generalForm.pay)) {
          Popup.alert("금액은 숫자만 입력가능합니다.");
          return ;
        } else if ($scope.generalForm.content == undefined ||$scope.generalForm.content    == ''  ) {
          Popup.alert("내용을 입력해 주세요.");
          return ;
        }

        $scope.generalForm.uid       = $scope.uid        ;
        $scope.generalForm.member_no = $scope.member_no  ;
        $scope.generalForm.lat       = ''                ;
        $scope.generalForm.lng       = ''                ;

        //Popup.alert(JSON.stringify($scope.generalForm));
        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/general/form/insertResumeData.php',
            data: $httpParamSerializerJQLike($scope.generalForm),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            //alert(JSON.stringify(data)); 
            console.log("[" +data.resultCd + "]");
            //alert(JSON.stringify(data));
            if (data.result == "1"){
              if(data.matchingMsg == ""){
                Popup.tapBack(data.msg );
              } else {
                Popup.tapBack(data.msg +" ("+data.matchingMsg+")");
              }

            } else if (data.result == "0"){
                Popup.alert(data.msg);
            }

        }).error(function (data, status, headers, config) {

        });
      }

      $scope.getPicture = function() {

          if($scope.generalForm.imageList == 6) {
            Popup.alert("이미지는 최대 6개까지 등록 가능합니다. 더이상 등록할 수 없습니다.");
            return;
          }

          Popup.alert("사진 업로드에는 데이터가 사용됩니다. 가능하면 wifi환경을 이용해 주세요.");

          var options = {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              encodingType: Camera.EncodingType.JPEG,
              mediaType: Camera.MediaType.PICTURE,
              allowEdit: false,
              correctOrientation: false
          }

          $cordovaCamera.getPicture(options).then(function(imageData) {
            imageUpload(imageData);
          });
      }

      //$scope.uid = "p20513";

      $scope.changeMatchingOneYn = function(){
               if ($scope.generalForm.TMPmatchingOneYn == true)  { $scope.generalForm.matchingOneYn = "Y";
        } else if ($scope.generalForm.TMPmatchingOneYn == false) { $scope.generalForm.matchingOneYn = "N";
        }
      }

      function imageUpload(imagePath) {

          /* 나중에 주석 풀어야함.
          if ($scope.uid == null || $scope.uid == undefined || $scope.uid == ''){
            Popup.alert("로그인 하세요.");
            return ;
          }
          */

          var url = "http://il-bang.com/jubang_ajax/general/form/imageUpload.php";
          var modifiedFile = imagePath.split("?");
          var filename = modifiedFile[0].split("/").pop();
          var options = {
                  fileKey: "file",
                  fileName: filename,
                  chunkedMode: false,
                  mimeType: "image/jpeg",
                  params: {
                      'directory': ' ',
                      'filename': filename,
                      'uid': $scope.uid
                  }
              };

          $cordovaFileTransfer.upload(url, imagePath, options).then(function(result) {
              if(result.response == "") {
                  if(result.bytesSent > 10485760) {
                      Popup.alert("파일 용량이 10MB를 초과했습니다. 다른 파일을 선택해주세요.");
                  } else {
                      Popup.alert("업로드에 실패했습니다. 다른 파일을 선택해주세요.");
                  }
              } else {
                      $scope.generalForm.imageList.push(result.response);
              }
          }, function(err) {
              Popup.alert("파일 업로드 실패\n" + JSON.stringify(err));
          });
      }
});
