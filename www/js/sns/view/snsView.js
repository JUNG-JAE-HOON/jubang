angular.module('snsShare', [])
  .controller('snsShareCtrl', function($scope, $state, $cordovaSocialSharing, Popup, $cordovaSms) {
    $scope.facebook = function(no, type) {
      var image = 'http://il-bang.com/mobile/img/logo.jpg';
      // var image = '';
      var message = '';


      if (type == 1) { //채용공고 공유
        var url = 'http://il-bang.com/jubang_ajax/gujik.php?no=' + no;
      } else if (type == 2) { //이력서 공유
        var url = 'http://il-bang.com/jubang_ajax/guin.php?no=' + no;
      } else { //설치 경로 공유
        var url = 'http://il-bang.com/jubang_ajax/aligi.php?no=' + no;
      }


      $cordovaSocialSharing
        .shareViaFacebook(message, image, url)
        .then(function(result) {
          // $scope.defaultAlert("페이스북 공유 완료!");
        }, function(err) {
          if ((err == 'false') || (err == false)) {
            Popup.alert('페이스북이 설치되어 있지 않거나 취소되었습니다.');
          }
          console.log('facebook:' + err);
        });
    }


    $scope.kakaoShareInfo = function(title, type, no) {
      //var titleFomat = '▶ 교회 공고\n-' + title + '\n\n▶ 회사\n-' + company_name + '\n\n▶ 지역\n-' + area;

      if (type == 1) { //채용공고 공유
        var imagePath = 'http://il-bang.com/jubang_ajax/180.png';
        var webLink = 'http://il-bang.com/jubang_ajax/gujik.php?no=' + no;
      } else if (type == 2) { //이력서 공유
        var imagePath = 'http://il-bang.com/jubang_ajax/180.png';
        var webLink = 'http://il-bang.com/jubang_ajax/guin.php?no=' + no;
      } else { //설치 경로 공유
        var imagePath = 'http://il-bang.com/jubang_ajax/180.png';
        var webLink = 'http://il-bang.com/jubang_ajax/aligi.php?no=' + no;
      }
      KakaoTalk.share({
          text: title,
          image: {
            src: imagePath,
            width: 300,
            height: 200,
          },
          weblink: {
            url: webLink,
            text: '상세내용 확인하기'
          }
        },
        function(success) {
          Popup.alert('카카오톡으로 공유 완료');
        },
        function(error) {
          console.log('kakao share error:\n' + error + "\n:\n");
          if (error == "Exception error : java.lang.RuntimeException: Can't create handler inside thread that has not called Looper.prepare()") {
            // $scope.defaultAlert("kakao Talk이 설치되어 있지 않습니다.");
          }
        });
    }

    $scope.sms = function(no, type) {
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT' // send SMS with the native android SMS messaging
          //intent: '' // send SMS without open any other app
        }
      };
      var success = function() {
        // alert('Message sent successfully');
      };
      var error = function(e) {
        Popup.alert('Message Failed:' + e);
      };

      if (type == 1) { //채용공고 공유
        var url = 'http://il-bang.com/jubang_ajax/gujik.php?no=' + no;
      } else if (type == 2) { //이력서 공유
        var url = 'http://il-bang.com/jubang_ajax/guin.php?no=' + no;
      } else { //설치 경로 공유
        var url = 'http://il-bang.com/jubang_ajax/aligi.php?no=' + no;
      }
      sms.send(' ', url, options, success, error);
    }

    $scope.band = function(strTitle, type, no) {
      var strMsg=strTitle;
      if (type == 1) { //채용공고 공유
        var url = 'http://il-bang.com/jubang_ajax/gujik.php?no=' + no;
      } else if (type == 2) { //이력서 공유
        var url = 'http://il-bang.com/jubang_ajax/guin.php?no=' + no;
      } else { //설치 경로 공유
        var url = 'http://il-bang.com/jubang_ajax/aligi.php?no=' + no;
      }
      var image = "http://il-bang.com/jubang_ajax/180.png";

      if(device.platform == "Android"){
        var sApp = startApp.set({
          action: "ACTION_VIEW",
          uri: "bandapp://create/post?text=" + encodeURIComponent(strMsg) + encodeURIComponent("\n") + encodeURIComponent(url) + "&route=" + encodeURIComponent(url)
        });
          sApp.start(function() { /* success */
            console.log("여기");
          }, function(error) { /* fail */
            console.log("여기"+error);
            window.open("http://band.us/plugin/share?body=" + encodeURIComponent(strMsg) + encodeURIComponent("\n") + encodeURIComponent(url) + "&route=" + encodeURIComponent(url),'_system');
          });
      }else if(device.platform == "iOS"){
          Popup.bandShare("밴드로 공유하는 기능입니다. 어플 선택시 밴드 어플이 설치되어 있지 않으면 정상적으로 실행되지 않을 수 있습니다.",no,url,strMsg);

      }

      // if(true){

      // }else{
      //   window.open("http://band.us/plugin/share?body=" + encodeURIComponent(strMsg) + encodeURIComponent("\n") + encodeURIComponent(url) + "&route=" + encodeURIComponent(url),'_system');
      // }
    }
  });
