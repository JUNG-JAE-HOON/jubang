angular.module('modify-controller', [])
.controller('modifyCtrl',function($scope, $http, $httpParamSerializerJQLike, $localstorage, Popup,$ionicPopup) {
    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
        $scope.kind = $localstorage.get("kind");
    } else {
        $scope.id = sessionStorage.getItem("id");
        $scope.kind = sessionStorage.getItem("kind");
    }

    var notSpecialChar = /[^a-z A-Z ㄱ-ㅎ 가-힣 0-9]/;
    var engKorChar = /[^a-z A-Z ㄱ-ㅎ 가-힣]/;
    var notKorChar = /[^a-z A-Z 0-9]/;
    var onlyNum = /[^0-9]/;

    function getMemberInfo() {
        var data = { id: $scope.id };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/forms/getMemberInfo.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.no = data.memberData.no;
            $scope.name = data.memberData.name;
            $scope.order = data.memberData.order;
            $scope.church = data.memberData.church;
            $scope.ministry = data.memberData.ministry;
            $scope.phone1 = data.memberData.phone1;
            $scope.phone2 = data.memberData.phone2;
            $scope.phone3 = data.memberData.phone3;
            $scope.imgName = data.memberData.imgName;
            $scope.imagePath = data.memberData.img;
        });
    }

    getMemberInfo();

    $scope.infoModify = function(no) {
        if($scope.pwd1 != null && $scope.pwd1 != "" && $scope.pwd1.length < 6) {
            Popup.alert("비밀번호가 너무 짧습니다. (6자 이상)");
        } else if($scope.pwd1 != null && $scope.pwd1 != "" && $scope.pwd1 != $scope.pwd2) {
            Popup.alert("비밀번호가 맞지 않습니다.");
        } else if($scope.order == null || $scope.order == "") {
            Popup.alert("교단 이름을 입력해주세요.");
        } else if(notSpecialChar.test($scope.order)) {
            Popup.alert("교단 이름에 특수 문자는 사용할 수 없습니다.");
        } else if($scope.church == null || $scope.church == "") {
            Popup.alert("교회 이름을 입력해주세요.");
        } else if(notSpecialChar.test($scope.church)) {
            Popup.alert("교회 이름에 특수 문자는 사용할 수 없습니다.");
        } else if($scope.kind == "church" && $scope.ministry == null || $scope.kind == "church" && $scope.ministry == "") {
            Popup.alert("담임 목사 이름을 입력해주세요.");
        } else if($scope.kind == "church" && engKorChar.test($scope.ministry)) {
            Popup.alert("담임 목사 이름은 영문, 한글만 사용할 수 있습니다.");
        } else if($scope.phone1 == null || $scope.phone1 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if($scope.phone2 == null || $scope.phone2 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if($scope.phone3 == null || $scope.phone3 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if(onlyNum.test($scope.phone1) || onlyNum.test($scope.phone2) || onlyNum.test($scope.phone3)) {
            Popup.alert("휴대폰 번호는 숫자만 입력할 수 있습니다.");
        } else {
            var data = {
                id: $scope.id,
                pwd: $scope.pwd1,
                kind: $scope.kind,
                order: $scope.order,
                church: $scope.church,
                ministry: $scope.ministry,
                phone: $scope.phone1 + "-" + $scope.phone2 + "-" + $scope.phone3
            }

            $http({
                method: 'POST',
                url: 'http://il-bang.com/jubang_ajax/forms/infoModify.php',
                data: $httpParamSerializerJQLike(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                Popup.alert(data);
            });
        }
    }
    var widthdraw = $ionicPopup.show({
      // templateUrl: '/templates/roll-timer-popup.html',
      template: '회원 탈퇴하시면 고객님의 앱 이용 내역이 모두 삭제되면 주방 서비스를 더이상 이용하실 수 없습니다.("탈퇴한 계정은 6개월 뒤에 이용하실 수 있습니다.") 정말 탈퇴하시겠습니까?',
      title: '정말 탈퇴 하시겠습니까?',
      // subTitle: 'Please use normal things',
      cssClass:"question",
      scope: $scope,
      buttons: [
        { text: '확인',
        onTap: function(e) {
                test();
          }
        },
        {
          text: '취소',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.wifi) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.wifi;
            }
          }
        },
      ]
    });
    function test(){
      var widthdraw = $ionicPopup.show({
        // templateUrl: '/templates/roll-timer-popup.html',
        templateUrl: 'templates/pop/widthdraw.html',
        title: '회원 탈퇴 하기',
        // subTitle: 'Please use normal things',
        cssClass:"widthdraw-form",
        scope: $scope,
        buttons: [
          { text: '확인',
          onTap: function(e) {

            }
          },
          {
            text: '취소',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          },
        ]
      });
    }
})
