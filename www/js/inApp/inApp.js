angular.module('inApp',[])
  .controller('inAppCtrl', function ($scope, $ionicPlatform, $ionicLoading, $ionicPopup,$http,$httpParamSerializerJQLike,$localstorage) {   
   $scope.alert = function(data){
    var confirmPopup = $ionicPopup.confirm({
          cssClass: 'urgentPop',
          title: '<h4 class="fo">구매 알림</h4>',
          template:
          '<ul class="popupUl">'+'<li>'+'<p class="tc">'+data+'</p>'+'</li>'+'</ul>',
          buttons: [{
              text: '확인',
              type: 'button-default'
          }]
      });
    }
    if($localstorage.get("auto")=="yes"){
      $scope.uid        = $localstorage.get("id");
      $scope.member_no  = $localstorage.get("no");
      $scope.kind       = $localstorage.get("kind");
     }else{
       $scope.uid        = sessionStorage.getItem("id");
       $scope.member_no  = sessionStorage.getItem("no");
       $scope.kind       = sessionStorage.getItem("kind");
     }


    var androidProductIds = ["matching.one.church.android","matching.week.church.android","matching.month.church.android","view.one.church.android","view.week.church.android","view.month.church.android","sum.week.church.android","sum.month.church.android","emergency.one.church.android","matching.one.ministry.android","matching.week.ministry.android","matching.month.ministry.android","emergency.one.ministry.android"];
    var iosProductIds = ["matching.one.church.ios","matching.week.church.ios","matching.month.church.ios","view.one.church.ios","view.week.church.ios","view.month.church.ios","sum.week.church.ios","sum.month.church.ios","emergency.one.church.ios","matching.one.ministry.ios","matching.week.ministry.ios","matching.month.ministry.ios","emergency.one.ministry.ios"];
    var spinner = '<ion-spinner icon="dots" class="spinner-stable"></ion-spinner><br/>';
    $ionicLoading.show({ template: spinner + '구매정보 가져오는중...' });

    if(device.platform == "Android"){     //안드로이드 상품 가져오기
        inAppPurchase
          .getProducts(androidProductIds)
          .then(function (products) {
              $scope.products = products;
              console.log(JSON.stringify(products));
              $ionicLoading.hide();
          })
          .catch(function (err) {
              //  console.log(JSON.stringify(err));
              $ionicLoading.hide();
          });
    }else if(device.platform == "iOS"){   //ios 상품 가져오기
      inAppPurchase
        .getProducts(iosProductIds)
        .then(function (products) {
            $scope.products = products;
            //  console.log("controller:"+JSON.stringify(products));
            $ionicLoading.hide();
        })
        .catch(function (err) {
            //  console.log(JSON.stringify(err));
            $ionicLoading.hide();
        });
    }
  $scope.buy = function (itemName) {
    var itemSplit = itemName.split(".");
    console.log(itemSplit[2]);
    console.log($scope.kind);
    if($scope.kind == itemSplit[2]){


        if(device.platform == "Android"){    //안드로이드 결제
              var purchaseConfirm = {
                    device: "android",
                    id: $scope.uid,
                    item: itemName+".android",
                    kind: $scope.kind
                  };
              console.log(JSON.stringify(purchaseConfirm));
              //구매가능 확인
              $http({
                    method: 'POST',
                    url: 'http://il-bang.com/jubang_ajax/itemShop/inApp/purchaseConFirm.php',
                    data: $httpParamSerializerJQLike(purchaseConfirm),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).success(function (data, status, headers, config) {
                    console.log(data);
                    if(data=="구매가능"){
                        alert(data);
                            $ionicLoading.show({ template: spinner + '구매중...' });
                            inAppPurchase
                                  .buy(itemName)
                                  .then(function (data) {
                                          console.log(JSON.stringify(data));
                                          //  console.log('consuming transactionId: ' + data.transactionId);

                                          //구매정보
                                          var purchaseData = {
                                                  device: "android",
                                                  id: $scope.uid,
                                                  no: $scope.member_no,
                                                  packageName: 'com.ju.bang',
                                                  productId: data.productId,
                                                  receipt: JSON.stringify(data.receipt)
                                         };
                                         //구매정보 서버로 전송
                                         $http({
                                                  method: 'POST',
                                                  url: 'http://il-bang.com/jubang_ajax/itemShop/inApp/purchaseData.php',
                                                  data: $httpParamSerializerJQLike(purchaseData),
                                                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                         }).success(function (data, status, headers, config) {

                                                  if(data=='ok'){
                                                          //전송 성공
                                                          // console.log('전송 완료');
                                                  }else{
                                                          //전송 실패 이유
                                                          $scope.alert(data+", 전산관련 실패일 경우 영업일 기준으로 1~2일 후 환불 처리 됩니다. 자세한 사항은 고객센터로 연락주세요.(tel:02-2138-7365)");
                                                  }
                                        });
                                        //아이템 소모
                                        return inAppPurchase.consume(data.type, data.receipt, data.signature);
                                })
                                .then(function () {
                                        //구매 완료
                                        $ionicLoading.hide();
                                        $scope.alert("아이템 구매 완료!");
                                        //console.log('consume done!');

                                })
                                .catch(function (err) {
                                       //구매 실패
                                       $ionicLoading.hide();
                                       if(err.code=="-5"){
                                          $scope.alert("결제를 취소하였습니다.");
                                       }else{
                                          $scope.alert("결제에 실패하셨습니다.<br>"+JSON.stringify(err));
                                       }
                                });
                    }else{
                            //구매 불가
                            $scope.alert(data);
                    }
              });
        } else if(device.platform == "iOS"){

            var purchaseConfirm = {
                  device: "IOS",
                  id: $scope.uid,
                  item: itemName+".ios"
                };

            //구매가능 확인
            $http({
                  method: 'POST',
                  url: 'http://il-bang.com/ilbang_pc/ionic/http/purchaseConfirm.php',
                  data: $httpParamSerializerJQLike(purchaseConfirm),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data, status, headers, config) {

                  if(data=="구매가능"){
                          $ionicLoading.show({ template: spinner + '구매중...' });
                          inAppPurchase
                                .buy(itemName)
                                .then(function (data) {
                                        //  console.log(JSON.stringify(data));
                                        //  console.log('consuming transactionId: ' + data.transactionId);

                                        //구매정보
                                        var purchaseData = {
                                                device: "ios",
                                                id: $scope.uid,
                                                no: $scope.member_no,
                                                valid_no: $scope.valid_no,
                                                packageName: 'com.il.bang.ios',
                                                productId: itemName,
                                                receipt: JSON.stringify(data.receipt)
                                       };
                                       //구매정보 서버로 전송
                                       $http({
                                                method: 'POST',
                                                url: 'http://il-bang.com/ilbang_pc/ionic/http/purchaseData.php',
                                                data: $httpParamSerializerJQLike(purchaseData),
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                       }).success(function (data, status, headers, config) {

                                                if(data=='ok'){
                                                        //전송 성공
                                                        // console.log('전송 완료');
                                                }else{
                                                        //전송 실패 이유
                                                        $scope.alert(data);
                                                }
                                      });
                                      //아이템 소모
                                      return inAppPurchase.consume(data.type, data.receipt, data.signature);
                              })
                              .then(function () {
                                      //구매 완료
                                      $ionicLoading.hide();
                                      $scope.alert("아이템 구매 완료!");
                                      //console.log('consume done!');

                              })
                              .catch(function (err) {
                                     //구매 실패
                                     $ionicLoading.hide();
                                     $scope.alert("결제에 실패하셨습니다.<br>"+JSON.stringify(err));

                              });
                  }else{
                          //구매 불가
                          $scope.alert(data);
                  }
            });

        }
      }else{
          $scope.alert("회원 상태에 맞는 아이템만 구매할 수 있습니다.");
      }
    };
  });
