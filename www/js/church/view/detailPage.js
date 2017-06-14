angular.module('churchDetail-controller', [])
.controller('churchDetailCtrl', function($scope, $localstorage, $state, $stateParams, $http, $httpParamSerializerJQLike, $sce, $ionicPopup, Popup, $ionicHistory) {
    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
        $scope.check = $localstorage.get("check");
    } else {
        $scope.id = sessionStorage.getItem("id");
        $scope.check = sessionStorage.getItem("check");
    }

    $scope.no = $stateParams.no;
    $scope.page = 1;

    function getEmployData() {
        var data = { no: $scope.no };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/view/getEmployData.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if(data.message != null) {
                Popup.tapBack(data.message);
            } else {
                if(data.employPictures != null) {
                    for(var i=0; i<data.employPictures.length; i++) {
                        document.getElementById("imageList").innerHTML
                        += '<div>'
                        + '<img src="' + data.employPictures[i].photo + '" width="100" />'
                        + '</div>';
                    }

                    $('.thumbnail-list').slick({
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        arrows: true
                    });
                }

                $scope.videoPath = $sce.trustAsResourceUrl(data.employData.video);
                $scope.title = data.employData.title;
                $scope.content = data.employData.content;
                $scope.date = data.employData.date;
                $scope.time = data.employData.time;
                $scope.name = data.employData.name;
                $scope.address = data.employData.addr;
                $scope.eventDate = data.employData.eventDate;
                $scope.pay = data.employData.pay;
                $scope.profile = data.employData.profile;

                setTimeout(function() {
                    var rateYo = function() {
                        $("#rateYo").rateYo({
                            rating: data.employData.score,
                            readOnly: true,
                            starWidth: '13px'
                        });

                        $("#viewRateYo").rateYo({
                            rating: data.employData.score,
                            readOnly: true,
                            starWidth: '30px'
                        });
                    }

                    rateYo();
                })
            }
        });
    }

    function getEmployReview(page, type) {
        var data = {
            no: $scope.no,
            type: type,
            page: page
        }

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/view/getEmployReview.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if($scope.page == 1 || type == "re") {
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

            if(data.paging.page >= data.paging.allPage) {
                $scope.commentMoreView = false;
            } else {
                $scope.commentMoreView = true;
            }
        });
    }

    getEmployData();
    getEmployReview($scope.page, $scope.type);

    $scope.commentMore = function() {
        $scope.page += 1;

        getEmployReview($scope.page);
    }

    $scope.commentDelete = function(no) {
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
                            url: 'http://il-bang.com/jubang_ajax/church/view/commentDelete.php',
                            data: $httpParamSerializerJQLike(data),
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function (data, status, headers, config) {
                            Popup.alert(data);

                            getEmployReview($scope.page, "re");
                        });
                    } else {
                        Popup.noService();
                    }
                }
            }]
        });
    }

    $scope.employDelete = function(no) {
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
                            url: 'http://il-bang.com/jubang_ajax/church/view/employDelete.php',
                            data: $httpParamSerializerJQLike(data),
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function (data, status, headers, config) {
                            Popup.tapBack(data);
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

    $scope.backBtn = function() {
        $ionicHistory.goBack();
    }
});
