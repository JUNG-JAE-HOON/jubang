angular.module('readDetail-controller', [])
.controller('readDetailCtrl', function($scope, $state, $ionicHistory, $http, $httpParamSerializerJQLike, $stateParams) {
  var viewNum = { no:  $stateParams.no }

$http({
    method: 'POST',
    url: 'http://il-bang.com/ilbang_pc/ionic/http/getNotice.php',
    data: $httpParamSerializerJQLike(viewNum),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (data, status, headers, config) {
    $scope.items = [];
    $scope.items = data.noticeFileList;

    var notice = data.noticeList;

    $scope.title = notice.title;
    $scope.content = notice.content;
    $scope.name = notice.name;
    $scope.date = notice.date;
    $scope.link1 = notice.link1;
    $scope.link2 = notice.link2;
})
$scope.backBtn=function(){
     $state.go('app.notice');
  }
});
