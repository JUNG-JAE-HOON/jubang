angular.module('generalDetail-controller',[])
.controller('genDetailCtrl',function($scope, $state, $stateParams, $http, $httpParamSerializerJQLike, $localstorage, $sce, $ionicPopup, Popup){
    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
        $scope.check = $localstorage.get("check");
    } else {
        $scope.id = sessionStorage.getItem("id");
        $scope.check = sessionStorage.getItem("check");
    }

    $scope.no = $stateParams.no;
    $scope.page = 1;

    $scope.getResumeData= function(no) {
        var data = { no: no };


        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/general/view/getResumeData.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
          console.log(JSON.stringify(data));
            if(data.message == '삭제된 이력서입니다.') {
                Popup.tapBack(data.message);
            } else if(data.message == '데이터 없음') {

            } else {
                if(data.resumePictures != null) {
                    for(var i=0; i<data.resumePictures.length; i++) {
                        document.getElementById("imageList").innerHTML
                        += '<div>'
                        + '<img src="' + data.resumePictures[i] + '" width="100" />'
                        + '</div>';
                    }
                    //
                    // $('.thumbnail-list').slick({
                    //     infinite: true,
                    //     slidesToShow: 3,
                    //     slidesToScroll: 3,
                    //     arrows: true
                    // });
                }

                $scope.videoPath = $sce.trustAsResourceUrl(data.resumeData.video);
                $scope.title = data.resumeData.title;
                $scope.content = data.resumeData.content;
                $scope.date = data.resumeData.date;
                $scope.name = data.resumeData.name;
                $scope.address = data.resumeData.address;
                $scope.eventDate = data.resumeData.eventDate;
                $scope.pay = data.resumeData.pay;
                $scope.profile = data.resumeData.profile;

                setTimeout(function() {
                    var rateYo = function() {
                        $("#rateYo").rateYo({
                            rating: data.resumeData.score,
                            readOnly: true,
                            starWidth: '13px'
                        });

                        $("#viewRateYo").rateYo({
                            rating: data.resumeData.score,
                            readOnly: true,
                            starWidth: '30px'
                        });
                    }

                    rateYo();
                });
            }
        });
    }

    function getResumeReview(page, type) {
        var data = {
            no: $stateParams.no,
            page: page,
            type: type
        };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/general/view/getResumeReview.php',
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

    if($stateParams.no!=undefined){
          $scope.getResumeData($stateParams.no);
          getResumeReview($scope.page, $scope.type);

    }

    $scope.commentMore = function() {
        $scope.page += 1;

        getResumeReview($scope.page);
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
                            url: 'http://il-bang.com/jubang_ajax/general/view/commentDelete.php',
                            data: $httpParamSerializerJQLike(data),
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function (data, status, headers, config) {
                            Popup.alert(data);

                            getResumeReview($scope.page, "re");
                        });
                    } else {
                        Popup.noService();
                    }
                }
            }]
        });
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
            url: 'http://il-bang.com/jubang_ajax/general/view/modifyCheck.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if($scope.check == "Y") {
                if(data == "ok") {
                    $state.go("generalModify", { no: no });
                } else {
                    Popup.alert(data);
                }
            } else {
                Popup.noService();
            }
        });
    }

    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    }

});
