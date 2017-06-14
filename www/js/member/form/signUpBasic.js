angular.module('signUp-controller',[])
.controller('signUpCtrl', function($scope, $http, $httpParamSerializerJQLike, $state, $stateParams, $cordovaFileTransfer, $cordovaCamera, $ionicPopup, Popup) {
    $scope.idChecked = false;

    $scope.allChecked = function() {
       if(!$scope.allCheck) {
           $scope.check1 = false;
           $scope.check2 = false;
           $scope.check3 = false;
           $scope.check4 = false;
       }
    }

    $scope.nextStep1 = function() {
        if($scope.check1 && $scope.check2 && $scope.check3 && $scope.check4 || $scope.allCheck) {
            $(".basic-wrap1").hide();
            $(".basic-wrap2").show();
        } else {
            Popup.alert("약관에 동의 해주시기 바랍니다.");
        }
    }

    $scope.getPicture = function(type) {
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
                        if(type == "profile") {
                            $scope.profilePath = imageData;
                        } else if(type == "documents") {
                            $scope.documentsPath = imageData;

                            imageUpload($scope.documentsPath, 'documents');
                        } else {
                            $scope.churchPath = imageData;

                            imageUpload($scope.churchPath, 'church');
                        }
                    });
                }
            }]
        });
    }

    function imageUpload(imagePath, type) {
        var url = "http://il-bang.com/jubang_ajax/member/form/imageUpload.php";
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
                    'type': type,
                    'id': $scope.id
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
                if(type == "profile") {
                    $scope.imageProfile = result.response;
                } else if(type == "documents") {
                    $scope.imageDocuments = result.response;
                } else {
                    $scope.imageChurch = result.response;
                }
            }
        }, function(err) {
            Popup.alert("파일 업로드 실패\n" + JSON.stringify(err));
        });
    }

    var notSpecialChar = /[^a-z A-Z ㄱ-ㅎ 가-힣 0-9]/;
    var engKorChar = /[^a-z A-Z ㄱ-ㅎ 가-힣]/;
    var notKorChar = /[^a-z A-Z 0-9]/;
    var onlyNum = /[^0-9]/;

    $scope.nextStep2 = function() {
        if($scope.profilePath == null || $scope.profilePath == "") {
            Popup.alert("프로필 사진을 선택해주세요.");
        } else if($scope.id == null || $scope.id == "") {
            Popup.alert("아이디를 입력해주세요.");
        } else if($scope.id.length < 5) {
            Popup.alert("아이디가 너무 짧습니다. (5자 이상)");
        } else if(notKorChar.test($scope.id)) {
            Popup.alert("아이디는 영문, 숫자만 사용할 수 있습니다.");
        } else if($scope.name == null || $scope.name == "") {
            Popup.alert("이름을 입력해주세요.");
        } else if($scope.name.length < 2) {
            Popup.alert("이름이 너무 짧습니다. (2자 이상)");
        } else if(engKorChar.test($scope.name)) {
            Popup.alert("이름은 영문, 한글만 사용할 수 있습니다.");
        } else if($scope.pwd1 == null || $scope.pwd1 == "") {
            Popup.alert("비밀번호를 입력해주세요.");
        } else if($scope.pwd1.length < 6) {
            Popup.alert("비밀번호가 너무 짧습니다. (6자 이상)");
        } else if($scope.pwd2 == null || $scope.pwd2 == "") {
            Popup.alert("비밀번호를 입력해주세요.");
        } else if($scope.pwd1 != $scope.pwd2) {
            Popup.alert("비밀번호가 맞지 않습니다.");
        } else {
            if(!$scope.idChecked) {
                alert("아이디 중복 체크를 눌러주세요.");
            } else {
                imageUpload($scope.profilePath, 'profile');

                if($stateParams.kind == "ministry") {
                    $(".general-step1").show();
                } else {
                    $(".church-step1").show();
                }

                $(".basic-wrap2").hide();
            }
        }
    }

    $scope.idCheck = function() {
        if($scope.id == null || $scope.id == "") {
            Popup.alert("아이디를 입력해주세요.");
        } else if($scope.id.length < 5) {
            Popup.alert("아이디가 너무 짧습니다. (5자 이상)");
        } else if(notKorChar.test($scope.id)) {
            Popup.alert("아이디는 영문, 숫자만 사용할 수 있습니다.");
        } else {
            var data = { id: $scope.id };

            $http({
                method: 'POST',
                url: 'http://il-bang.com/jubang_ajax/member/form/idCheck.php',
                data: $httpParamSerializerJQLike(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                if(data == 0) {
                    Popup.alert("사용할 수 있는 아이디입니다.");

                    $scope.idChecked = true;
                } else if(data == 1) {
                    Popup.alert("사용할 수 없는 아이디입니다.");

                    $scope.idChecked = false;
                } else {
                    Popup.alert("이미 사용중인 아이디입니다.");

                    $scope.idChecked = false;
                }
            });
        }
    }

    $scope.nextStep3 = function() {
        if($scope.order == null || $scope.order == "") {
            Popup.alert("교단 이름을 입력해주세요.");
        } else if(notSpecialChar.test($scope.order)) {
            Popup.alert("특수 문자는 사용할 수 없습니다.");
        } else if($scope.church == null || $scope.church == "") {
            Popup.alert("교회 이름을 입력해주세요.");
        } else if(notSpecialChar.test($scope.church)) {
            Popup.alert("특수 문자는 사용할 수 없습니다.");
        } else if($scope.ministry == null && $stateParams.kind == "church" || $scope.ministry == "" && $stateParams.kind == "church") {
            Popup.alert("담임 목사 이름을 입력해주세요.");
        } else if(engKorChar.test($scope.ministry)) {
            Popup.alert("담임 목사 이름은 영문, 한글만 사용할 수 있습니다.");
        } else if($scope.phone1 == null || $scope.phone1 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if($scope.phone2 == null || $scope.phone2 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if($scope.phone3 == null || $scope.phone3 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if(onlyNum.test($scope.phone1) || onlyNum.test($scope.phone2) || onlyNum.test($scope.phone3)) {
            Popup.alert("휴대폰 번호를 똑바로 입력해주세요.");
        } else if($scope.churchPath == null && $stateParams.kind == "church" || $scope.churchPath == "" && $stateParams.kind == "church") {
            Popup.alert("교회 전면 사진을 선택해주세요.");
        } else if($scope.documentsPath == null && $stateParams.kind == "ministry" || $scope.documentsPath == "" && $stateParams.kind == "ministry") {
            Popup.alert("추천 서류를 선택해주세요.");
        } else {
            var data = {
                id: $scope.id,
                name: $scope.name,
                pwd: $scope.pwd1,
                kind: $stateParams.kind,
                order: $scope.order,
                church: $scope.church,
                ministry: $scope.ministry,
                phone: $scope.phone1 + "-" + $scope.phone2 + "-" + $scope.phone3,
                imageProfile: $scope.imageProfile,
                imageChurch: $scope.imageChurch,
                imageDocuments: $scope.imageDocuments
            };

            $http({
                method: 'POST',
                url: 'http://il-bang.com/jubang_ajax/member/form/memberJoin.php',
                data: $httpParamSerializerJQLike(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                if(data.result == "success") {
                    if($stateParams.kind == "ministry") {
                        $(".general-step-fin").show();
                        $(".general-step1").hide();
                    } else {
                        $(".church-step-fin").show();
                        $(".church-step1").hide();
                    }
                } else {
                    Popup.alert(data.message);
                }
            });
        }
    }

    $scope.backStep1 = function() {
        $(".basic-wrap1").show();
        $(".basic-wrap2").hide();
    }

    $scope.backStep2 = function() {
        $(".basic-wrap2").show();

        if($stateParams.kind == "ministry") {
            $(".general-step1").hide();
        } else {
            $(".church-step1").hide();
        }
    }

    $scope.singupFin = [{ button1: "로그인 하기" }];
});
