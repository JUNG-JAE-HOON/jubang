angular.module('church-modify', [])
.controller('churchModifyCtrl',function($scope, $http, $httpParamSerializerJQLike, $cordovaFileTransfer, $cordovaCamera, $ionicPopup, $localstorage, Popup, $stateParams) {
    if($localstorage.get("auto") == "yes") {
      $scope.id = $localstorage.get("id");
    } else {
      $scope.id = sessionStorage.getItem("id");
    }

    $scope.selboxData = {
        area_1st: [
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
            { no: "6296", list_name: '제주' }
        ],
        area_2nd: [],
        start_date: [],
        start_time: [],
        end_date: [],
        end_time: []
    }

    function formatDate(date) {
        var cal = new Date(date);
        var year = cal.getFullYear();
        var month = '' + (cal.getMonth() + 1);
        var day = '' + cal.getDate();

        if(month.length < 2) {
            month = '0' + month;
        }

        if(day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }

    for(var i=0; i<=24; i++) {
        for(var j=0; j<=59; j+=30) {
            if(i == 24 && j == 30) {
                continue;
            }

            if(i.toString().length == 1) {
                var hour = "0" + i;
            } else {
                var hour = i;
            }

            if(j.toString().length == 1) {
                var minute = "0" + j;
            } else {
                var minute = j;
            }

            $scope.selboxData.start_time.push(hour + ":" + minute);
            $scope.selboxData.end_time.push(hour + ":" + minute);
        }
    }

    for(var i=0; i<=365; i++) {
        var eventDate = new Date();

        eventDate.setDate(eventDate.getDate() + i);
        $scope.selboxData.start_date.push(formatDate(eventDate).toString());
        $scope.selboxData.end_date.push(formatDate(eventDate).toString());
    }

    $scope.getArea2ndList = function(area1) {
        var data = { area_1st_no: area1 };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/church/form/getArea2ndList.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.selboxData.area_2nd = data.listData;
        });
    }

    var data = {
        no: $stateParams.no,
        id: $scope.id
    };

    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/church/form/getEmployData.php',
        data: $httpParamSerializerJQLike(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function (data, status, headers, config) {
        $scope.order = data.churchData.order;
        $scope.church = data.churchData.church;
        $scope.ministry = data.churchData.ministry;

        $scope.area1 = data.employData.area1;
        $scope.area2 = data.employData.area2;
        $scope.address = data.employData.addr;
        $scope.event = data.employData.event;
        $scope.startDate = data.employData.startDate;
        $scope.endDate = data.employData.endDate;
        $scope.startTime = data.employData.startTime;
        $scope.endTime = data.employData.endTime;
        $scope.pay = data.employData.pay;
        $scope.videoUrl = data.employData.video;
        $scope.content = data.employData.content;
        $scope.payModify = data.payModify;

        $scope.imageList = [];

        if(data.imageList != null) {
            $scope.seq = data.imageList.length;
            $scope.imageList = data.imageList;
        } else {
            $scope.seq = 0;
        }

        $scope.getArea2ndList($scope.area1);
    });

    $scope.imageChange = function(type, index) {
        $ionicPopup.confirm({
            // cssClass: '클래스명',
            template: "해당 이미지를 변경 또는 삭제하시겠습니까?",
            buttons: [{
                text: "취소",
                type: "button-stable"
            }, {
                text: "변경",
                type: "button-positive",
                onTap: function() {
                    $scope.getPicture(type, index);
                }
            }, {
                text: "삭제",
                type: "button-positive",
                onTap: function() {
                    $scope.imageList.splice(index, 1);
                    $scope.seq = $scope.imageList.length;
                }
            }]
        });
    }

    $scope.getPicture = function(type, index) {
        $ionicPopup.confirm({
            // cssClass: '클래스명',
            template: '사진 업로드에는 데이터가 사용됩니다. 가능하면 wifi환경을 이용해 주세요.',
            scope: $scope,
            buttons: [{
                text: "취소",
                type: "button-stable"
            }, {
                text: "확인",
                type: "button-positive",
                onTap: function() {
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
                        imageUpload(imageData, type, index);
                    });
                }
            }]
        });
    }

    function imageUpload(imagePath, type, index) {
        var url = "http://il-bang.com/jubang_ajax/church/form/imageUpload.php";
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
                    'uid': $scope.id
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
                var url = "http://il-bang.com/jubang_ajax/imageGuin/" + result.response;

                if(type == "push") {
                    $scope.imageList.push({ image: result.response });
                    $scope.seq++;
                } else {
                    $scope.imageList[index].image = result.response;
                }
            }
        }, function(err) {
            Popup.alert("파일 업로드 실패\n" + JSON.stringify(err));
        });
    }

    var notSpecialChar = /[^a-z A-Z ㄱ-ㅎ 가-힣 0-9]/;
    var onlyNum = /[^0-9]/;

    $scope.churchModify = function() {
        if($scope.address == null || $scope.address == "") {
            Popup.alert("상세 주소를 입력해주세요.");
        } else if($scope.event == null || $scope.event == "") {
            Popup.alert("행사명을 입력해주세요.");
        } else if($scope.startDate > $scope.endDate) {
            Popup.alert("종료 날짜는 시작 날짜보다 빠를 수 없습니다.");
        } else if($scope.startTime > $scope.endTime) {
            Popup.alert("종료 시간은 시작 시간보다 빠를 수 없습니다.");
        } else if($scope.pay == null || $scope.pay == "") {
            Popup.alert("금액을 입력해주세요.");
        } else if(onlyNum.test($scope.pay) && $scope.payModify == true) {
            Popup.alert("금액은 숫자만 입력할 수 있습니다.");
        } else if($scope.content == null || $scope.content == "") {
            Popup.alert("내용을 입력해주세요.");
        } else {
            var data = {
                no: $stateParams.no,
                address: $scope.address,
                area1: $scope.area1,
                area2: $scope.area2,
                pay: $scope.pay,
                payModify: $scope.payModify,
                event: $scope.event,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                video: $scope.videoUrl,
                content: $scope.content,
                imageList: $scope.imageList
            };

            $http({
                method: 'POST',
                url: 'http://il-bang.com/jubang_ajax/church/form/modifyEmployData.php',
                data: $httpParamSerializerJQLike(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                Popup.tapBack(data);
            });
        }
    }
})
