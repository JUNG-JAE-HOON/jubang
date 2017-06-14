angular.module('jubang.service', [])
.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        removeItem: function(key) {
            return $window.localStorage[key] = null;
        }
    }
}])
.factory('Popup', ['$ionicPopup', '$state', '$ionicHistory', function($ionicPopup, $state, $ionicHistory) {
    return {
        alert: function(content) {
            $ionicPopup.alert({
                // cssClass: '클래스명',
                template: content,
                buttons: [{
                    text: "확인",
                    type: "button-positive"
                }]
            });
        },
        tapBack: function(content) {
            $ionicPopup.alert({
                // cssClass: '클래스명',
                template: content,
                buttons: [{
                    text: "확인",
                    type: "button-positive",
                    onTap: function() {
                        $ionicHistory.goBack();
                    }
                }]
            });
        },
        noService: function() {
            $ionicPopup.alert({
                // cssClass: '클래스명',
                template: "추천 서류가 승인된 후 이용할 수 있습니다.",
                buttons: [{
                    text: "확인",
                    type: "button-positive"
                }]
            });
        },
        tapLogin: function(content) {
            $ionicPopup.confirm({
                // cssClass: '클래스명',
                template: content,
                buttons: [{
                    text: "취소",
                    type: "button-stable"
                }, {
                    text: "로그인 하기",
                    type: "button-positive",
                    onTap: function() {
                        $state.go("login");
                    }
                }]
            });
        },
        bandShare: function(content,no,url,strMsg) {
            $ionicPopup.confirm({
                // cssClass: '클래스명',
                template: content,
                buttons: [{
                    text: "취소",
                    type: "button-stable"
                },{
                    text: "어플공유",
                    type: "button-positive",
                    onTap: function() {
                      window.open("bandapp://create/post?text=" + encodeURIComponent(strMsg) + encodeURIComponent("\n") + encodeURIComponent(url) + "&route=" + encodeURIComponent(url),'_system');
                    }
                },{
                    text: "웹 공유",
                    type: "button-positive",
                    onTap: function() {
                      window.open("http://band.us/plugin/share?body=" + encodeURIComponent(strMsg) + encodeURIComponent("\n") + encodeURIComponent(url) + "&route=" + encodeURIComponent(url),'_system');
                    }
                }]
            });
        },
    }
}]);
