angular.module('login', [])
.controller('loginCtrl', function($scope, $http, $httpParamSerializerJQLike, $localstorage, $state, Popup,$cordovaGeolocation) {
    $scope.loginTypeChange = function() {
        if($scope.loginType == "ministry") {
            $(".left").addClass("activate");
            $(".right").removeClass("activate");
        } else {
            $(".right").addClass("activate");
            $(".left").removeClass("activate");
        }
    }

    $scope.login = function() {
        if($scope.id == null || $scope.id == "") {
            Popup.alert('아이디를 입력해주세요.');
        } else if($scope.pwd == null || $scope.pwd == "") {
            Popup.alert('비밀번호를 입력해주세요.');
        } else {
            var data = {
                id: $scope.id,
                pwd: $scope.pwd,
                kind: $scope.loginType
            }
            $http({
                method: 'POST',
                url: 'http://il-bang.com/jubang_ajax/member/login.php',
                data: $httpParamSerializerJQLike(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                if(data.login) {
                    if($scope.auto == true) {
                        $localstorage.set("auto", "yes");
                        $localstorage.set("id", $scope.id);
                        $localstorage.set("kind", $scope.loginType);
                        $localstorage.set("member_no", data.no);
                        $localstorage.set("check", data.check);
                    } else {
                        $localstorage.set("auto", "no");
                        sessionStorage.setItem("id", $scope.id);
                        sessionStorage.setItem("kind", $scope.loginType);
                        sessionStorage.setItem("member_no", data.no);
                        sessionStorage.setItem("check", data.check);
                    }
                    //
                    // var deviceType=device.platform;
                    // var posOptions = {timeout: 10000, enableHighAccuracy: false};
                    // $cordovaGeolocation
                    // .getCurrentPosition(posOptions)
                    // .then(function (position) {
                    //     console.log(JSON.stringify(position));
                    //     var lat  = position.coords.latitude; //위도 값을 가져옵니다.
                    //     var lng = position.coords.longitude; //경도 값을 가져옵니다.
                    //     $localstorage.set("lat",lat);
                    //     $localstorage.set("lng",lng);
                    //     var locateParam = {
                    //           latitude  : lat,            //위도
                    //           longitude : lng,          //경도
                    //           id        : $scope.id,
                    //           device    : deviceType
                    //     };
                    //     console.log(JSON.stringify(locateParam));
                    //     $http({
                    //           method: 'POST',
                    //           url: 'http://il-bang.com/jubang_ajax/appJs/saveGeolocation.php',
                    //           data: $httpParamSerializerJQLike(locateParam),
                    //           headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    //     }).success(function (data, status, headers, config) {
                    //       console.log(JSON.stringify(data));
                    //     }).error(function (data, status, headers, config) {
                    //     });
                    // });
                    // FCMPlugin.getToken(function(token){
                    //   var point={
                    //         device     : device.platform,
                    //         uid        : $scope.id,
                    //         token      : token,
                    //   };
                    //   console.log(JSON.stringify(point));
                    //   $http({
                    //         method: 'POST',
                    //         url: 'http://il-bang.com/jubang_ajax/appJs/appExecute.php',
                    //         data: $httpParamSerializerJQLike(point),
                    //         headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    //   }).success(function (data, status, headers, config) {
                    //     console.log(JSON.stringify(data));
                    //   }).error(function (data, status, headers, config) {
                    //   });
                    // },function(err){});

                    $state.go("app.main");
                } else {
                    Popup.alert(data.message);
                }
            });
        }
    }
})
