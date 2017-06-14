angular.module('churchTab-controller', [])
.controller('churchTabCtrl',function($scope, $state, $http, $httpParamSerializerJQLike, $ionicModal, $ionicHistory, $sce, $ionicPopup, $localstorage, Popup) {
    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
        $scope.check = $localstorage.get("check");
    } else {
        $scope.id = sessionStorage.getItem("id");
        $scope.check = sessionStorage.getItem("check");
    }

    // 모든 채용공고 조회
    $scope.selboxData = {
        area_1st: [
            { no: "", list_name: '시' },
            { no: "1", list_name: '서울' },
            { no: "907", list_name: '인천' },
            { no: "1164", list_name: '광주' },
            { no: "1420", list_name: '대전' },
            { no: "7700", list_name: '세종' },
            { no: "1631", list_name: '대구' },
            { no: "1923", list_name: '부산' },
            { no: "2314", list_name: '울산' },
            { no: "2422", list_name: '경기' },
            { no: "3312", list_name: '강원' },
            { no: "3641", list_name: '충남' },
            { no: "3950", list_name: '충북' },
            { no: "4219", list_name: '전남' },
            { no: "4687", list_name: '전북' },
            { no: "5128", list_name: '경남' },
            { no: "5709", list_name: '경북' },
            { no: "6296", list_name: '제주' },
        ],
        area_2nd: [{ no: "", list_name: "구" }],
        resume_list: [ {resume_data_no: "", title:"이력서 제목" }]
    }

    $scope.page          = 0;
    $scope.items         = [];
    $scope.findChurchTab = {};
    $scope.findChurchTab.area_1st_no = "";
    $scope.findChurchTab.area_2nd_no = "";
    $scope.orderBy     = "all";     // all-전체, edit_date-최근순, score-별점순, distance-거리순
    $scope.photoItems  = [];
    $scope.employView  = {};
    $scope.employView.resume_data_no = "";
    $scope.employView.employ_data_no = "";

    $scope.getArea2ndList = function() {
        if($scope.findChurchTab.area_1st_no == "") {
            $scope.selboxData.area_2nd = [{ no: '', list_name: '구' }];
            $scope.findChurchTab.area_2nd_no = "";

            $scope.page         = 0;
            $scope.items        = [];
            $scope.loadMore();

            return;
        }

        var myData = { area_1st_no: $scope.findChurchTab.area_1st_no };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/form/getArea2ndList.php',
            data: $httpParamSerializerJQLike(myData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.selboxData.area_2nd = [{ no: '',list_name: '구' }];
            $scope.selboxData.area_2nd = $scope.selboxData.area_2nd.concat(data.listData);
            $scope.findChurchTab.area_2nd_no = '';

            $scope.page         = 0;
            $scope.items        = [];
            $scope.loadMore();
        });
    }

    $scope.selectArea2ndList = function() {
        $scope.page         = 0;
        $scope.items        = [];
        $scope.loadMore();
    }

    $scope.loadMore = function() {
        $scope.page = $scope.page + 1;

        var myData = {
            page        : $scope.page,
            area_1st_no : $scope.findChurchTab.area_1st_no,
            area_2nd_no : $scope.findChurchTab.area_2nd_no,
            orderBy     : $scope.orderBy
        }

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/list/getEmployList.php',
            data: $httpParamSerializerJQLike(myData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
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
        });
    }

    function asyncGreet() {
        setTimeout(function() {
            var rateYo = function() {
                for(var i=0; i<$scope.items.length; i++) {
                    $("#rateYo" + (i)).rateYo({
                        rating: $scope.items[i].score,
                        readOnly: true,
                        starWidth: '17px'
                    });
                }
            }

            rateYo();
        }, 1000);
    }

    $scope.selectOrderBy = function(type) {
        $scope.orderBy  = type;
        $scope.page     = 0;
        $scope.items    = [];
        $scope.loadMore();
    }

    $scope.backBtn = function() {
        $state.go("app.main");
    }

    $ionicModal.fromTemplateUrl('templates/church/view/detailPageModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.employ = {};
    $scope.reviewPage = 1;

    function getEmployReview(no, page, type) {
        var data = {
            no: no,
            type: type,
            page: page
        }

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/view/getEmployReview.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if($scope.reviewPage == 1 || type == "re") {
                $scope.employ.commentList = [];
                $scope.employ.commentList = data.commentList;

                if(data.paging.allPage > 1) {
                    $scope.commentMoreView = true;
                } else {
                    $scope.commentMoreView = false;
                }
            } else {
                $scope.employ.commentList = $scope.employ.commentList.concat(data.commentList);
            }

            if(data.paging.page >= data.paging.allPage) {
                $scope.commentMoreView = false;
            } else {
                $scope.commentMoreView = true;
            }
        });
    }

    $scope.commentMore = function() {
        $scope.reviewPage += 1;

        getEmployReview($scope.employ.no, $scope.reviewPage);
    }

    $scope.giveStar = function(no) {
        var score = $("#rateYoBig").rateYo("rating");

        if($scope.reviewCnt == 0) {
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
                            cnt: $scope.reviewCnt
                        };

                        $http({
                            method: 'POST',
                            url: 'http://il-bang.com/jubang_ajax/church/list/giveStar.php',
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


    $scope.getResumeTitleList = function () {
      if ($scope.id == "" || $scope.id == null) return;
      var myData = {
        uid : $scope.id
      }
      $http({
          method: 'POST',
          url: 'http://il-bang.com/jubang_ajax/church/view/getMatchingResumeList.php',
          data: $httpParamSerializerJQLike(myData),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function (data, status, headers, config) {
          $scope.selboxData.resume_list =[{resume_data_no: "", title:"이력서 제목 입니다." }];
          $scope.selboxData.resume_list = $scope.selboxData.resume_list.concat(data.listData) ;
      });
    }


    $scope.openModal = function(no) {
        $scope.modal.show();
        $scope.employView.employ_data_no = no;

        var data = { no: no };

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

                $scope.employ.no = no;
                $scope.employ.videoPath = $sce.trustAsResourceUrl(data.employData.video);
                $scope.employ.title = data.employData.title;
                $scope.employ.content = data.employData.content;
                $scope.employ.date = data.employData.date;
                $scope.employ.time = data.employData.time;
                $scope.employ.name = data.employData.name;
                $scope.employ.address = data.employData.addr;
                $scope.employ.eventDate = data.employData.eventDate;
                $scope.employ.pay = data.employData.pay;
                $scope.employ.profile = data.employData.profile;
                $scope.reviewCnt = data.employData.reviewCnt;

                $scope.snsShareNo = no;
                $scope.snsSharetype = 2;
                $scope.snsSharetitle = data.employData.title;
                setTimeout(function() {
                    var rateYo = function() {
                        $("#rateYoSmall").rateYo({
                            rating: data.employData.score,
                            readOnly: true,
                            starWidth: '13px'
                        });

                        $("#rateYoBig").rateYo({
                            rating: 5,
                            readOnly: false,
                            starWidth: '30px'
                        });
                    }

                    rateYo();
                });
            }

            getEmployReview(no, $scope.reviewPage, $scope.type);
            $scope.getResumeTitleList();
        });
    };

    $scope.apply = function() {
      if($scope.id == null){
        Popup.alert("로그인 하시면 채용공고에 지원할 수 있습니다.");
        return ;
      } else if($scope.employView.resume_data_no == "" ) {
        Popup.alert("지원할 이력서를 선택해 주세요.");
        return ;
      }

      var myData = {
        resume_data_no : $scope.employView.resume_data_no,
        employ_data_no : $scope.employView.employ_data_no

      }
      $http({
          method: 'POST',
          url: 'http://il-bang.com/jubang_ajax/church/view/getMatchingResumeList.php',
          data: $httpParamSerializerJQLike(myData),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function (data, status, headers, config) {
          $scope.selboxData.resume_list =[{resume_data_no: "", title:"이력서 제목 입니다." }];
          $scope.selboxData.resume_list = $scope.selboxData.resume_list.concat(data.listData) ;
      });

    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $(".tab-item").each(function(i){
        $(this).click(function(){
            $(".tab-item").removeClass("tab-item-active");
            $(this).addClass("tab-item-active");
        });
    });

    var boxHeight=$('.thumbnailist-cont').height();

    if(boxHeight > 90) {
        $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0,95) + '…');
    } else if(boxHeight < 90) {
        $(".thumbnailist-cont").text($(".thumbnailist-cont").text().substr(0,95) + '…');
    }
});
