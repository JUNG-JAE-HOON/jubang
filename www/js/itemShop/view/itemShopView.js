angular.module('itemShopView-controller', [])
  .controller('itemShopViewCtrl', function($scope, $state, $ionicHistory, Popup, $localstorage,$http,$httpParamSerializerJQLike) {

    $scope.backBtn = function() {
      $ionicHistory.goBack()
    }

    if ($localstorage.get("auto") == "yes") {
      $scope.uid = $localstorage.get("id");
      $scope.kind = $localstorage.get("kind");

    } else {
      $scope.uid = sessionStorage.getItem("id");
      $scope.kind = sessionStorage.getItem("kind");
    }

    var data = {
        id : $scope.uid,
        kind : $scope.kind
    }
    console.log(JSON.stringify(data));
    $http({
        method: 'POST',
        url: 'http://il-bang.com/jubang_ajax/itemShop/view/itemShopView.php',
        data: $httpParamSerializerJQLike(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function (data, status, headers, config) {
        console.log(JSON.stringify(data));
        if(data.result == 'success'){
            if($scope.kind=='church'){
              $scope.autoMatchingOne = data.data.autoMatchingOne;
              $scope.autoMatchingWeekStart = data.data.autoMatchingWeekStart;
              $scope.autoMatchingWeekEnd = data.data.autoMatchingWeekEnd;
              $scope.autoMatchingMonthStart = data.data.autoMatchingMonthStart;
              $scope.autoMatchingMonthEnd = data.data.autoMatchingMonthEnd;
              $scope.viewOne = data.data.viewOne;
              $scope.viewWeekStart = data.data.viewWeekStart;
              $scope.viewWeekEnd = data.data.viewWeekEnd;
              $scope.viewMonthStart = data.data.viewMonthStart;
              $scope.viewMonthEnd = data.data.viewMonthEnd;
              $scope.sumWeekStart = data.data.sumWeekStart;
              $scope.sumWeekEnd = data.data.sumWeekEnd;
              $scope.sumMonthStart = data.data.sumMonthStart;
              $scope.sumMonthEnd = data.data.sumMonthEnd;
              $scope.emergency = data.data.emergency;
            }else{
              $scope.autoMatchingOne = data.data.autoMatchingOne;
              $scope.autoMatchingWeekStart = data.data.autoMatchingWeekStart;
              $scope.autoMatchingWeekEnd = data.data.autoMatchingWeekEnd;
              $scope.autoMatchingMonthStart = data.data.autoMatchingMonthStart;
              $scope.autoMatchingMonthEnd = data.data.autoMatchingMonthEnd;
              $scope.emergency = data.data.emergency
            }
        }else if(data.result == 'fail'){
          Popup.alert('정보를 가져오는데 실패하였습니다. 다시 시도해 주세요.');
        }
    });

  })
