angular.module('jubang', ['ionic', 'starter.controllers', 'ngCordova', 'jubang.service'])
  .run(function($ionicPlatform, $localstorage, $http, $httpParamSerializerJQLike, $cordovaGeolocation) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false); //iphone done 표시
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      var deviceType = device.platform;
      if ($localstorage.get("auto") == "yes") {
        var uid = $localstorage.get("id");
      } else {
        var uid = sessionStorage.getItem("id");
      }
      if (uid != undefined && uid != null) {
        var posOptions = {
          timeout: 10000,
          enableHighAccuracy: false
        };
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function(position) {
            console.log(JSON.stringify(position));
            var lat = position.coords.latitude; //위도 값을 가져옵니다.
            var lng = position.coords.longitude; //경도 값을 가져옵니다.
            $localstorage.set("lat", lat);
            $localstorage.set("lng", lng);

            var locateParam = {
              latitude: lat, //위도
              longitude: lng, //경도
              id: uid,
              device: deviceType
            };
            console.log(JSON.stringify(locateParam));
            $http({
              method: 'POST',
              url: 'http://il-bang.com/jubang_ajax/appJs/saveGeolocation.php',
              data: $httpParamSerializerJQLike(locateParam),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).success(function(data, status, headers, config) {
              console.log(JSON.stringify(data));
            }).error(function(data, status, headers, config) {});
          });


        FCMPlugin.getToken(function(token) {
          var point = {
            device: deviceType,
            uid: uid,
            token: token,
            androidVer: 1.0,
            iosVer: 1.0
          };
          console.log(JSON.stringify(point));
          console.log(token);
          $http({
            method: 'POST',
            url: 'http://il-bang.com/jubang_ajax/appJs/appExecute.php',
            data: $httpParamSerializerJQLike(point),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).success(function(data, status, headers, config) {
            console.log(JSON.stringify(data));
          }).error(function(data, status, headers, config) {});
        }, function(err) {});
      }
      FCMPlugin.onNotification(
        function(data) {
          if (data.wasTapped) {
            alert(JSON.stringify(data));
          } else {
            alert(JSON.stringify(data));
          }
        },
        function(msg) {
          console.log('onNotification callback successfully registered: ' + msg);
        },
        function(err) {
          console.log('Error registering onNotification callback: ' + err);
        }
      );
    });
  })
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text('');
    $stateProvider

      .state('ref', {
        url: '/ref',
        templateUrl: 'templates/ref.html'
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/main/sideMenu.html',
        controller: 'AppCtrl'
      })
      .state('app.main', {
        url: '/main',
        views: {
          'menuContent': {
            templateUrl: 'templates/main/sideHome.html'
          }
        }
      })
      .state('notice', {
        url: '/notice',
        templateUrl: 'templates/notice/notice.html'         
      })
      .state('readDetail', {
        url: '/read-detail:no',
        templateUrl: 'templates/notice/readDetail.html'

      })
      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.emergencyGuin', {
        url: '/emergencyGuin',
        views: {
          'menuContent': {
            templateUrl: 'templates/emergencyGuin.html'
          }
        }
      })
      .state('app.cs', {
        url: '/cs',
        views: {
          'menuContent': {
            templateUrl: 'templates/cs/csCenter.html'
          }
        }
      })
      // .state('app.jubangIntro', {
      //     url: '/intro',
      //     views: {
      //         'menuContent': {
      //             templateUrl: 'templates/intro/jubangIntro.html',
      //         }
      //     }
      // })
      .state('jubangIntro', {
        url: '/jubang-intro',
        templateUrl: 'templates/intro/jubangIntro.html'
      })
      .state('cs', {
        url: '/cs',
        templateUrl: 'templates/cs/csCenter.html'
      })

      // .state('itemShop.itemSelect', {
      //     url: '/item-select/{hoho}',
      //     templateUrl: 'templates/itemShop/view/itemSelect.html'
      // })
      .state('itemSelect', {
        url: '/item-select/{item}',
        templateUrl: 'templates/itemshop/view/itemSelect.html'
      })
      // 긴급구인
      .state('app.emergency', {
        url: '/emergency',
        views: {
          'menuContent': {
            // templateUrl: 'templates/emergency/view/view.html'
          }
        }
      })

      // 일방 알리기
      // .state('app.itemShop', {
      //     url: '/itemShop',
      //     views: {
      //         'menuContent': {
      //             templateUrl: 'templates/itemshop/view/itemShop.html'
      //         }
      //     }
      // })
      .state('itemShop', {
        url: '/item-shop',
        templateUrl: 'templates/itemshop/view/itemShop.html'
      })
      .state('itemUseList', {
        url: '/itemUseList',
        templateUrl: 'templates/itemshop/view/itemShopView.html'
      })
      // 서비스 인트로 슬라이드
      .state('tutorial', {
        url: '/tutorial',
        templateUrl: 'templates/tutorial/tutorial.html'
      })

      // 회원가입
      .state('memKind', {
        url: '/mem-kind',
        templateUrl: 'templates/member/memberKind.html'
      })
      .state('signUpBasic', {
        url: '/signup-basic',
        templateUrl: 'templates/member/form/signUpBasic.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/member/login.html'
      })
      .state('find', {
        url: '/find:type',
        templateUrl: 'templates/member/find.html'
      })
      .state('stepGeneral', {
        url: '/step-general:kind',
        templateUrl: 'templates/member/form/generalStep.html'
      })
      .state('stepChurch', {
        url: '/step-church:kind',
        templateUrl: 'templates/member/form/churchStep.html'
      })
      .state('fab', {
        url: '/fab',
        templateUrl: 'templates/buttons/fab.html'
      })
      .state('churchRegi', {
        url: '/church-regi',
        templateUrl: 'templates/church/view/regi.html'
      })
      .state('generalRegi', {
        url: '/general-regi',
        templateUrl: 'templates/general/view/regi.html'
      })
      .state('churchWrite', {
        url: '/church-write:em_yn',
        templateUrl: 'templates/church/form/writeForm.html'
      })
      .state('churchModify', {
        url: '/church-modify:no',
        templateUrl: 'templates/church/form/modifyForm.html'
      })
      .state('generalWrite', {
        url: '/general-write:em_yn',
        templateUrl: 'templates/general/form/writeForm.html'
      })
      .state('generalModify', {
        url: '/general-modify:no',
        templateUrl: 'templates/general/form/modifyForm.html'
      })
      .state('app.findGenTabs', {
        url: '/find-general',
        views: {
          'menuContent': {
            templateUrl: 'templates/general/view/findGenTabs.html'
          }
        }
      })
      .state('app.findChurchTabs', {
        url: '/find-church',
        views: {
          'menuContent': {
            templateUrl: 'templates/church/view/findChurchTabs.html'
          }
        }
      })
      // 찬양자찾기 상세페이지
      .state('detailGeneral', {
        url: '/detail-general:no',
        templateUrl: 'templates/general/view/detailPage.html'
      })
      // 교회찾기 상세페이지
      .state('detailChurch', {
        url: '/detail-church:no',
        templateUrl: 'templates/church/view/detailPage.html'
      })
      .state('message', {
        url: '/message',
        templateUrl: 'templates/views/list/message.html'
      })
      .state('messagePop', {
        url: '/message-pop',
        templateUrl: 'templates/views/pop/messagePop.html'
      })
      // 정보수정 페이지
      .state('modifyPage', {
        url: '/modify-page',
        templateUrl: 'templates/forms/modifyPage.html'
      })
      .state('csWrite', {
        url: '/csWrite',
        templateUrl: 'templates/cs/csWrite.html'
      })
      .state('csView', {
        url: '/csView',
        templateUrl: 'templates/cs/csView.html'
      })
      .state('agreement', {
        url: '/agreement',
        templateUrl: 'templates/agreement.html'
      })
      .state('matchingChurch', {
        url: '/matching-church',
        templateUrl: 'templates/church/view/matching.html'
      })
      .state('matchingGeneral', {
        url: '/matching-general',
        templateUrl: 'templates/general/view/matching.html'
      })
      // 내 매칭안료 리스트
      .state('matchingFinChurch', {
        url: '/matching-fin-church',
        templateUrl: 'templates/church/list/matchingFin.html'
      })
      .state('matchingFinGeneral', {
        url: '/matching-fin-general',
        templateUrl: 'templates/general/list/matchingFin.html'
      })
      // 긴급구인
      .state('emergencySearch', {
        url: '/emergency-search',
            templateUrl: 'templates/emergency/view/emergencySearch.html'
      })
      .state('emergencyRegiChurch', {
        url: '/erc',
        templateUrl: 'templates/emergency/view/church/regi.html'
      })
      .state('emergencyRegiGeneral', {
        url: '/erg',
        templateUrl: 'templates/emergency/view/general/regi.html'
      })
      .state('emergencyListChurch', {
        url: '/elc',
        templateUrl: 'templates/emergency/view/church/list.html'
      })
      .state('emergencyListGeneral', {
        url: '/elg',
        templateUrl: 'templates/emergency/view/general/list.html'
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/main');
  });
