/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,auth,FIREBASE_URL,$firebaseAuth,$rootScope,$state,PersonService) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    //// LoginCtrl
   var chatRef = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(chatRef);

      $scope.login = function(socialPlatform) {
      console.log('loging attempt');
      
      $scope.loginProgress = true;
      auth.$authWithOAuthPopup(socialPlatform).then(function(authData) {
        console.log("Logged in as:", authData.uid);
        $scope.loggedIn = true;
        $scope.loginProgress = false;
        PersonService.SetLoginState(true);
      }).catch(function(error) {
        console.log("Authentication failed:", error);
        $scope.loginProgress = false;
        console.log(error);
        $scope.msg = "";
        $("#loginPage").effect("shake", {
          times: 4
        }, 1000);
      });
    }

     auth.$onAuth(function(authData) {
      // Once authenticated, instantiate Firechat with our user id and user name
      if (authData) {
        $scope.loginProgress = false;
        $scope.loggedIn = true;
        $rootScope.currentUser = "user";
        $scope.explModal.hide();
//        $window.location.href = "#/app/chat/";
        console.log('Chat controller. State name = ',$state.current.name);
        if($state.current.name == 'app.chat') {
      	  $state.go('app.chat');
//      	  $window.location.href = "#/app/chat/";
        } else {
      	  $state.go('app.map');
      	 // $window.location.href = "#/app/feeds";
        }
        if (authData.provider == 'facebook') {
          $scope.userName = authData.facebook.displayName;
          $scope.userImg = authData.facebook.profileImageURL;
          $scope.userEmail = authData.facebook.email; // Email works only if user has exposed.
          PersonService.SetAvatar(authData.facebook.profileImageURL);
          PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.facebook.displayName);
        }
        if (authData.provider == 'twitter') {
          $scope.userName = authData.twitter.displayName;
          $scope.userImg = authData.twitter.profileImageURL;
          $scope.userEmail = authData.twitter.email;
          PersonService.SetAvatar(authData.twitter.profileImageURL);
          PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.twitter.displayName);
        }
        if (authData.provider == 'google') {
          $scope.userName = authData.google.displayName;
          $scope.userImg = authData.google.profileImageURL;
          $scope.userEmail = authData.google.email;
          PersonService.SetAvatar(authData.google.profileImageURL);
          PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.google.displayName);
        }
        if (authData.provider == 'github') {
            $scope.userName = authData.github.displayName;
            $scope.userImg = authData.github.profileImageURL;
            $scope.userEmail = authData.github.email;
            PersonService.SetAvatar(authData.github.profileImageURL);
            PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.github.displayName);
          }
        
    
        
          // Removing firechat.
        // var chat = new FirechatUI(chatRef, angular.element(document.querySelector('#firechat-wrapper')));
        // chat.setUser(authData.uid, authData[authData.provider].displayName);
      }
    });

    /////



})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();


})




.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, PersonService,ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    var user = PersonService.GetUserDetails();
    $scope.imgUrl = user.img;

    $scope.name = user.name;
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('MapCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion,NgMap) {
     $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

//     
 var heatmap, vm = this;
  vm.onMapOverlayCompleted = function(e){
    console.log(e.type);
  };

  NgMap.getMap().then(function(map) {
      vm.map = map;
      heatmap = vm.map.heatmapLayers.foo;
    });

     $scope.toggleHeatmap= function(event) {
      heatmap.setMap(heatmap.getMap() ? null : vm.map);
    };

    $scope.changeGradient = function() {
        console.log('change gradient');
        
      var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
      heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    }

    $scope.changeRadius = function() {
      heatmap.set('radius', heatmap.get('radius') ? null : 20);
    }

    $scope.changeOpacity = function() {
      heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
    }

})


;
