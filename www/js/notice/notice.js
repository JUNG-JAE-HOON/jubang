angular.module('notice-controller', [])
.controller('noticeCtrl', function($scope, $state, $ionicHistory, $http, $httpParamSerializerJQLike) {

$scope.backBtn=function(){
     $ionicHistory.goBack();
  }

  $scope.page = 1;

      var listParam = { page: $scope.page, val: "notice" }

      $http({
          method: 'POST',
          url: 'http://il-bang.com/ilbang_pc/ionic/http/getNoticeList.php',
          data: $httpParamSerializerJQLike(listParam),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function (data, status, headers, config) {
          // handle success things
          $scope.items = [];
          $scope.items = data.noticeList;
          $scope.listShow = true;

          // $scope.noMoreItemsAvailable = false;
          //
          // if (data.paging.page >= data.paging.allPage ) {
          //    $scope.noMoreItemsAvailable = true;
          // }

          // $scope.$broadcast('scroll.infiniteScrollComplete');
      })

      $scope.loadMore = function() {
          $scope.page = $scope.page + 1;

          var myData = { page: $scope.page, val: "notice" }

          $http({
              method: 'POST',
              url: 'http://il-bang.com/ilbang_pc/ionic/http/getNoticeList.php',
              data: $httpParamSerializerJQLike(myData),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).success(function (data, status, headers, config) {
              $scope.items = $scope.items.concat(data.noticeList);
              $scope.listShow = true;

              if (data.paging.page >= data.paging.allPage) {
                 $scope.listShow = false;
              }

              // $scope.noMoreItemsAvailable = false;
              //
              // if (data.paging.page >= data.paging.allPage) {
              //    $scope.noMoreItemsAvailable = true;
              // }
              //
              // $scope.$broadcast('scroll.infiniteScrollComplete');
          })
      };
      $scope.backBtn=function(){
           $state.go('app.main');
          // $ionicHistory.back();
        }

});
