angular.module('side-menu-controller',[])
.controller('sideMenuCtrl', function($scope, $state, $localstorage, $ionicPopup, $http, $httpParamSerializerJQLike, Popup,$ionicHistory) {
    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
        $scope.kind = $localstorage.get("kind");
    } else {
        $scope.id = sessionStorage.getItem("id");
        $scope.kind = sessionStorage.getItem("kind");
    }

    getMyInfo();

    function getMyInfo() {
        var data = { id: $scope.id };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/main/getMyInfo.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.profilePath = data.myInfo.profile;
            $scope.no = data.myInfo.no;
        });
    }

    $scope.logout = function() {
        $ionicPopup.confirm({
            // cssClass: '클래스명',
            template: "정말 로그아웃 하시겠습니까?",
            buttons: [{
                text: "취소",
                type: "button-stable"
            }, {
                text: "확인",
                type: "button-positive",
                onTap: function() {
                    if($localstorage.get("auto") == "yes") {
                        $localstorage.removeItem("id");
                        $localstorage.removeItem("kind");
                    } else {
                        sessionStorage.removeItem("id");
                        sessionStorage.removeItem("kind");
                    }

                    $localstorage.removeItem("auto");
                    Popup.alert("로그아웃 되었습니다.");
                    $state.go("login");
                }
            }]
        });
    }

    $scope.kindCheck = function(kind) {
        if($scope.kind == kind) {
            if($scope.kind == "church") {
                $state.go("churchRegi");
            } else {
                $state.go("generalRegi");
            }
        } else {
            if($scope.kind == "church") {
                Popup.alert("개인 회원만 이용할 수 있습니다.");
            } else {
                Popup.alert("기업 회원만 이용할 수 있습니다.");
            }
        }
    }

    $scope.btnInfos = [{
        left: "panel1.png",
        right: "panel2.png",
        twoTitle1: "교회 등록",
        twoTitle2: "사역자 등록",
        sref1: "churchRegi",
        sref2: "generalRegi"
    }];

    $scope.backBtn = function() {
        $ionicHistory.goBack()
    }
});
