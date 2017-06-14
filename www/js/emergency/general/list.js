angular.module('emergnecyGeneralList', [])
.controller('eglCtrl', function($scope, $localstorage, $state, $http, $httpParamSerializerJQLike, $ionicPopup, Popup,$ionicPopover) {
    $scope.button11 = [{ button1: "기존 채용공고 불러오기" }];
    $scope.button22 = [{ button2: "채용공고 작성하기" }];
    $scope.emptyCon = "진행중인 채용 공고가 없습니다.<br />채용 공고를 작성하시겠습니까?";
    $scope.type = "ing";

    // 리스트 dotdotdot
    var boxHeight = $('.thumbnailist-cont').height();

    if(boxHeight > 45) {
        $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0, 95) + '…');
    } else if(boxHeight < 45) {
        $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0, 95) + '…');
    }

    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
        $scope.check = $localstorage.get("check");
    } else {
        $scope.id = sessionStorage.getItem("id");
        $scope.check = sessionStorage.getItem("check");
    }

    getEmployList("ing");

    $scope.employCheck = function(type) {
        if(type == "ing") {
            $scope.type = type;
            $scope.writeBtn = true;
            $scope.emptyCon = "진행중인 채용 공고가 없습니다.<br />채용 공고를 작성하시겠습니까?";
            document.getElementById("left").classList.add("tab-item-active");
            document.getElementById("right").classList.remove("tab-item-active");
        } else {
            $scope.type = type;
            $scope.writeBtn = false;
            $scope.emptyCon = "지난 채용 공고가 없습니다.";
            document.getElementById("right").classList.add("tab-item-active");
            document.getElementById("left").classList.remove("tab-item-active");
        }

        getEmployList(type);
    }

    function getEmployList(type) {
        var data = {
            id: $scope.id,
            type: type
        };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/view/getEmployList.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if(data.employList == null) {
                $scope.not = true;
                $scope.totalList = 0;
            } else {
                $scope.not = false;
                $scope.employList = [];
                $scope.employList = data.employList;
                $scope.totalList = data.total;

                setTimeout(function() {
                    var rateYo = function() {
                        for(var i=0; i<data.employList.length; i++) {
                            $("#rate" + i).rateYo({
                                rating: data.employList[i].score,
                                readOnly: true,
                                starWidth: '13px'
                            });
                        }
                    }

                    rateYo();
                })
            }
        });
    }

    $scope.employDelete = function(no) {
        $ionicPopup.confirm({
            // cssClass: '클래스명',
            template: '정말 삭제하시겠습니까?',
            buttons: [{
                text: "취소",
                type: "button-stable"
            }, {
                text: "삭제",
                type: "button-positive",
                onTap: function() {
                    if($scope.check == "Y") {
                        var data = { no: no };

                        $http({
                            method: 'POST',
                            url: 'http://il-bang.com/jubang_ajax/church/view/employDelete.php',
                            data: $httpParamSerializerJQLike(data),
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function (data, status, headers, config) {
                            Popup.alert(data);
                            getEmployList($scope.type);
                        });
                    } else {
                        Popup.noService();
                    }
                }
            }]
        });
    }

    $scope.modifyCheck = function(no) {
        var data = { no: no };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/view/modifyCheck.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if($scope.check == "Y") {
                if(data == "ok") {
                    $state.go("churchModify", { no: no });
                } else {
                    Popup.alert(data);
                }
            } else {
                Popup.noService();
            }
        });
    }

    $scope.churchWriteCheck = function(emergency) {
        var data = { id: $scope.id };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/view/churchWriteCheck.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if($scope.check == "Y") {
                if(data == "ok") {
                    $state.go("churchWrite", { em_yn: emergency });
                } else {
                    Popup.alert(data);
                }
            } else {
                Popup.noService();
            }
        });
    }
});
