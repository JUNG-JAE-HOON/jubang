angular.module('generalRegi-controller', [])
.controller('generalRegi',function($scope, $state, $localstorage, $http, $httpParamSerializerJQLike, $ionicPopup, Popup,$ionicHistory) {
    $scope.button11=[{ button1: "이력서 작성하기" }];
    $scope.button22 = [{ button2: "긴급 구직" }];
    $scope.emptyCon = "작성한 이력서가 없습니다.<br />이력서를 작성하시겠습니까?";
    $scope.writeBtn = true;
    $scope.type = "ing";

    var boxHeight=$('.thumbnailist-cont').height();

    if(boxHeight > 45) {
        $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0,95) + '…');
    } else if(boxHeight < 45) {
        $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0,95) + '…');
    }

    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
        $scope.check = $localstorage.get("check");
    } else {
        $scope.id = sessionStorage.getItem("id");
        $scope.check = sessionStorage.getItem("check");
    }

    getResumeList("ing");

    function getResumeList(type) {
        var data = {
            id: $scope.id,
            type: type
        };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/general/view/getResumeList.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.resumeList = [];
            $scope.resumeList = data.resumeList;
            $scope.resumeCnt = data.resumeCnt;

            if(data.resumeList != null) {
                setTimeout(function() {
                    var rateYo = function() {
                        for(var i=0; i<data.resumeList.length; i++) {
                            $("#rate" + i).rateYo({
                                rating: data.resumeList[i].score,
                                readOnly: true,
                                starWidth: '13px'
                            });
                        }
                    }

                    rateYo();
                });
            } else {
                $scope.resumeCnt = 0;
            }
        });
    }

    $scope.changeResume = function(type) {
        if(type == "ing") {
            $scope.writeBtn = true;
            $scope.emptyCon = "작성한 이력서가 없습니다.<br />이력서를 작성하시겠습니까?";
            document.getElementById("left").classList.add("tab-item-active");
            document.getElementById("right").classList.remove("tab-item-active");
        } else {
            $scope.writeBtn = false;
            $scope.emptyCon = "지난 이력서가 없습니다.";
            document.getElementById("right").classList.add("tab-item-active");
            document.getElementById("left").classList.remove("tab-item-active");
        }

        $scope.type = type;
        getResumeList(type);
    }

    $scope.resumeDelete = function(no) {
        $ionicPopup.confirm({
            // cssClass: '클래스명',
            template: "정말 삭제하시겠습니까?",
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
                            url: 'http://il-bang.com/jubang_ajax/general/view/resumeDelete.php',
                            data: $httpParamSerializerJQLike(data),
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function (data, status, headers, config) {
                            Popup.alert(data);
                            getResumeList($scope.type);
                        });
                    } else {
                        Popup.noService();
                    }
                }
            }]
        });
    }

    $scope.modifyCheck = function(no) {
        if($scope.check == "Y") {
            if($scope.type == "past") {
                Popup.alert("지난 이력서는 수정할 수 없습니다.");
            } else {
                $state.go("generalModify", { no: no });
            }
        } else {
            Popup.noService();
        }
    }

    $scope.writeCheck = function(emergency) {
        if($scope.check == "Y") {
            var data = { id: $scope.id };

            $http({
                method: 'POST',
                url: 'http://il-bang.com/jubang_ajax/general/view/writeCheck.php',
                data: $httpParamSerializerJQLike(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                if(data == "ok") {
                    $state.go("generalWrite", { em_yn: emergency });
                } else {
                    Popup.alert(data);
                }
            });
        } else {
            Popup.noService();
        }
    }
    $scope.backBtn=function(){
       $ionicHistory.goBack()
      //  $state.go('app.findChurchTabs');
    }
});
