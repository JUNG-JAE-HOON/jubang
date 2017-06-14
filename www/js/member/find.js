angular.module('findController', [])
.controller('findCtrl', function($scope, $state, $stateParams, $http, $httpParamSerializerJQLike, $ionicPopup, Popup) {
    if($stateParams.type == "id") {
        $scope.title = "아이디";
    } else {
        $scope.title = "비밀번호";
    }

    $scope.find = {};
    $scope.find.type = $stateParams.type;

    $scope.infoFind = function() {
        if($scope.find.id == null && $stateParams.type == "pwd" || $scope.find.id == "" && $stateParams.type == "pwd") {
            Popup.alert("아이디를 입력해주세요.");
        } else if($scope.find.name == null || $scope.find.name == "") {
            Popup.alert("이름을 입력해주세요.");
        } else if($scope.find.phone1 == null || $scope.find.phone1 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if($scope.find.phone2 == null || $scope.find.phone2 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else if($scope.find.phone3 == null || $scope.find.phone3 == "") {
            Popup.alert("휴대폰 번호를 입력해주세요.");
        } else {
            var data = {
                id: $scope.find.id,
                name: $scope.find.name,
                phone: $scope.find.phone1 + "-" + $scope.find.phone2 + "-" + $scope.find.phone3,
                find: $scope.find.type
            }

            $http({
                method: 'POST',
                url: 'http://il-bang.com/jubang_ajax/member/memberFind.php',
                data: $httpParamSerializerJQLike(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                if(data.message == null) {
                    var message;

                    if($stateParams.type == "id") {
                        message = $scope.find.name + "님의 이름으로 가입된 아이디는 <br />";
                        message += "<div style='margin: 10px 0;'>";

                        for(var i=0; i<data.idList.length; i++) {
                            message += "<div style='font-weight: bold;'>" + data.idList[i].id + "</div>";
                        }

                        message += "</div>입니다.";

                        Popup.tapLogin(message);
                    } else {
                        $ionicPopup.confirm({
                            // cssClass: '클래스명',
                            title: "[" + $scope.find.id + "] 비밀번호 변경",
                            template: '<div class="input-padding">'
                                            + '<div class="list">'
                                            + '<label class="item item-input item-floating-label default-input1">'
                                            + '<input type="password" ng-model="find.pwd1" placeholder="비밀번호를 입력해주세요." />'
                                            + '</label>'
                                            + '</div>'
                                            + '<div class="list">'
                                            + '<label class="item item-input item-floating-label default-input1">'
                                            + '<input type="password" ng-model="find.pwd2" placeholder="비밀번호를 한번 더 입력해주세요." />'
                                            + '</label>'
                                            + '</div>'
                                            + '</div>',
                            scope: $scope,
                            buttons: [{
                                text: "취소",
                                type: "button-stable"
                            }, {
                                text: "변경",
                                type: "button-positive",
                                onTap: function() {
                                    if($scope.find.pwd1 == null || $scope.find.pwd1 == "") {
                                        Popup.alert("비밀번호를 입력해주세요.");
                                    } else if($scope.find.pwd1.length < 6) {
                                        Popup.alert("비밀번호가 너무 짧습니다. (6자 이상)");
                                    } else if($scope.find.pwd1 != $scope.find.pwd2) {
                                        Popup.alert("비밀번호가 맞지 않습니다.");
                                    } else {
                                        var data = {
                                            id: $scope.find.id,
                                            pwd: $scope.find.pwd1
                                        }

                                        $http({
                                            method: 'POST',
                                            url: 'http://il-bang.com/jubang_ajax/member/pwdUpdate.php',
                                            data: $httpParamSerializerJQLike(data),
                                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                        }).success(function (data, status, headers, config) {
                                            Popup.tapLogin(data);
                                        });
                                    }
                                }
                            }]
                        });
                    }
                } else {
                    Popup.alert(data.message);
                }
            });
        }
    }
})
