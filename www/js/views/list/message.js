angular.module('messagePop-controller', [])
.controller('messageCtrl', function($scope, $http, $httpParamSerializerJQLike, $localstorage, $ionicPopover, $ionicPopup, Popup,$ionicHistory) {
    if($localstorage.get("auto") == "yes") {
        $scope.id = $localstorage.get("id");
    } else {
        $scope.id = sessionStorage.getItem("id");
    }

    $scope.page = 1;
    $scope.moreView = false;

    function getMessageList(page, start) {
        var data = {
            page: page,
            id: $scope.id,
            check: start
        };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/views/list/message.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.messageList = [];
            $scope.messageList = data.messageList;

            if(start == 'yes' && data.paging.allPage > 1) {
                $scope.moreView = true;
            }

            if(start == 'no' && data.paging.page == data.paging.allPage) {
                $scope.moreView = false;
            }
        });
    }

    getMessageList($scope.page, 'yes');

    $scope.moreMessage = function() {
        $scope.page += 1;

        var data = {
            page: $scope.page,
            id: $scope.id,
            check: 'yes'
        };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/views/list/message.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if(data.paging.page <= data.paging.allPage) {
                $scope.messageList = $scope.messageList.concat(data.messageList);
            }

            if(data.paging.page == data.paging.allPage) {
                $scope.moreView = false;
            }
        });
    }

    $scope.messageDelete = function(no) {
        $ionicPopup.confirm({
            // cssClass: 'estiPop',
            // title: '<h4 class="fo">알림</h4>',
            template: '정말 삭제하시겠습니까?',
            buttons: [{
                text: '취소',
                type: 'button-stable'
            }, {
                text: '확인',
                type: 'button-positive',
                onTap: function() {
                    var data = { no: no };

                    $http({
                        method: 'POST',
                        url: 'http://il-bang.com/jubang_ajax/views/list/messageDelete.php',
                        data: $httpParamSerializerJQLike(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function (data, status, headers, config) {
                        $ionicPopup.alert({
                            // cssClass : 'estiPop',
                            // title : '<h4 class="fo"><img src="img/cloud.png" width="15%"></h4>',
                            template : data,
                            buttons : [{
                                text : '확인',
                                type : 'button-default',
                                onTap: function() {
                                    getMessageList($scope.page, 'no');
                                    $scope.popover.hide();
                                }
                            }]
                        });
                    });
                }
            }]
        });
    }

    $ionicPopover.fromTemplateUrl('templates/views/pop/messagePop.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function(no) {
        $scope.no = no;

        var data = { no: no };

        $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/views/list/messageData.php',
            data: $httpParamSerializerJQLike(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            $scope.content = data;
        });

        $scope.popover.show();

        getMessageList($scope.page, 'no');
    }

    $scope.closePopover = function() {
        $scope.popover.hide();
    }
    $scope.backBtn=function(){
       $ionicHistory.goBack()
    }
});
