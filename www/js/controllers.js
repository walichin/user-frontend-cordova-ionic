var ionicAppControllers = angular.module('ionicAppControllers', ['ionicAppServices', 'config']);

ionicAppControllers


.controller('MapCtrl', function($rootScope, $scope, $window, $localstorage) {
//.controller('MapCtrl', function($rootScope, $scope, $window, $localstorage) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

 
  $scope.choice = "A";
  $scope.addressEnabled = true;


  // $scope.addressEnabled = false;
  // $scope.latitude = '';
  // $scope.longitude = '';
  // $scope.addressEnabled = true;
  // $scope.googleaddress = '';


  $scope.setUpChoice = function(choice) {

    if (choice === "A") {

      this.latitude = '';
      this.longitude = '';
      // $scope.latitude = '';
      // $scope.longitude = '';
      $scope.addressEnabled = true;
    
    } else {

      this.googleaddress = '';
      // $scope.googleaddress = '';
      $scope.addressEnabled = false;
    }

  }


  if (!$rootScope.datamap.address) {

    $rootScope.datamap = {
      googleaddress: "Sydney, NSW",
      latitude: -34.397, //37.9357576
      longitude: 150.644 //-122.34774859999999
    };

    $localstorage.setObject('datamap', $rootScope.datamap);

  }


  var initMap = function() {

    $scope.map = new google.maps.Map($window.document.getElementById('map'), {

      zoom: 8,
      center: {lat: $rootScope.datamap.latitude, lng: $rootScope.datamap.longitude}

    });
    
    $scope.geocoder = new google.maps.Geocoder();

    $scope.googleaddress = $rootScope.datamap.googleaddress;
    $scope.latitude = $rootScope.datamap.latitude;
    $scope.longitude = $rootScope.datamap.longitude;
   
  };


  $scope.$on('$ionicView.enter', function(ev) {
    
    // Here your code to run always (example: to refresh data)
    console.log('This runs always!');

    // Here your code to run once
    if(ev.targetScope !== $scope) return;
      
      console.log('This runs once');
      initMap();

  });


  $scope.search = function(choice, googleaddress, latitude, longitude) {

    $scope.panel = this;

    if (choice === 'A') {

      $scope.geocoder.geocode({'address': googleaddress}, function(results, status) {
        
        if (status === 'OK') {

          $scope.map.setCenter(results[0].geometry.location);
          
          var marker = new google.maps.Marker({
            map: $scope.map,
            position: results[0].geometry.location
          });

          $scope.$apply(function() {

            $scope.addressEnabled = false;
            $scope.panel.latitude = results[0].geometry.location.lat();
            $scope.panel.longitude = results[0].geometry.location.lng();

            $scope.addressEnabled = true;
            $scope.panel.googleaddress = results[0].formatted_address;

            $rootScope.datamap = {
              googleaddress: results[0].formatted_address,
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng()
            };

            $localstorage.setObject('datamap', $rootScope.datamap);

          });        
        
        } else {
          alert('Map search was not successful for the following reason: ' + status);
        }
      });
    }

    else {

      if (latitude && longitude) {

        var location = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        // var location = { lat: latitude, lng: longitude };

        $scope.geocoder.geocode({'location': location}, function(results, status) {
          
          if (status === 'OK') {

            $scope.map.setCenter(results[0].geometry.location);

            //map.setZoom(11);
            
            var marker = new google.maps.Marker({
              map: $scope.map,
              position: results[0].geometry.location
            });

            // var newAddress;

            // if (results[1]) {
            //   newAddress = results[0].formatted_address;
            // } else {
            //   newAddress = "No address found";
            // }

            $scope.$apply(function() {

              $scope.addressEnabled = true;
              $scope.panel.googleaddress = results[0].formatted_address;

              $scope.addressEnabled = false;
              $scope.panel.latitude = results[0].geometry.location.lat();
              $scope.panel.longitude = results[0].geometry.location.lng();

              $rootScope.datamap = {
                googleaddress: results[0].formatted_address,
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng()
              };

              $localstorage.setObject('datamap', $rootScope.datamap);

            });        
          
          } else {
            alert('Map search was not successful for the following reason: ' + status);
          }
        });
      }
    }
  }
})


.controller('HomeCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, AuthenticationService, Users) {              
  
  $scope.$on('$ionicView.enter', function(ev) {
    
    // Here your code to run always (example: to refresh data)
    var $call = Users.count();
    $call.success(function(data) {
      
      var numUsers = data.users.length;
      $scope.numUsers = numUsers;

    });

    if(ev.targetScope !== $scope) return;
    // Here your code to run once

  });


  $ionicModal.fromTemplateUrl('templates/modal.html', function (modal) {
    $scope.modal = modal;
  }, {
    animation: 'slide-in-up'
  });

  $scope.clearCredentials = function() {

    AuthenticationService.ClearCredentials();
  };
 
})


.controller('UserDetailCtrl', function($scope, $stateParams, Users) {
  
  $scope.user = Users.get($stateParams.userId);

  if ($scope.user.is_admin === null || $scope.user.is_admin === '0') {
    $scope.checked = false;
  } else {
    $scope.checked = true;
  }


  $scope.setIsAdmin = function() {

    if ($scope.checked) $scope.user.is_admin = '1';
    else $scope.user.is_admin = '0';
  };

  $scope.updateUser = function(form) {

  };

})


.controller('NewUserCtrl',
  ['$scope', '$window', '$ionicHistory', '$state', '$location', 'Users', function($scope, $window, $ionicHistory, $state, $location, Users) {
  

  $scope.user = {};
  $scope.user.is_admin = '1';
  $scope.checked = true;

  $scope.$on('$ionicView.enter', function(ev) {
    
    // Here your code to run always (example: to clear data)
    
    if(ev.targetScope !== $scope) return;
    // Here your code to run once

  });

  
  $scope.clearError = function () {
    $scope.error = "";
  }

  $scope.setIsAdmin = function() {

    if ($scope.checked) $scope.user.is_admin = '1';
    else $scope.user.is_admin = '0';
  };

  $scope.createUser = function(form) {

    console.log('$scope.user.name:' + $scope.user.name);;

    Users.create($scope.user, function (response) {
        
      if (response.code === '1') {

        $scope.user = {};
        form.$setPristine();
        form.$setUntouched();        

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        //$location.path('/home/users');
        $state.go('home.users');
        //$state.go('^.users');

      } else {
          //$scope.error = response.message;
          $scope.error = "User data not valid";
      }

    });

  };

}])


.controller('UsersCtrl', function($scope, Users) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.$on('$ionicView.enter', function(ev) {
    
    // Here your code to run always (example: to refresh data)
    var $call = Users.all();
    $call.success(function(data) {
      
      $scope.users = data.users;

    });

    if(ev.targetScope !== $scope) return;
    // Here your code to run once

  });


  $scope.remove = function(user) {
    $scope.users = Users.remove(user);
  };

})


.controller('LoginCtrl',
  ['$scope', '$ionicSideMenuDelegate', '$ionicModal', '$window', '$rootScope', '$location', 'AuthenticationService', 'ENV', function ($scope, $ionicSideMenuDelegate, $ionicModal, $window, $rootScope, $location, AuthenticationService, ENV) {


  if ($location.path() === '/login') AuthenticationService.ClearCredentials();

  $scope.clearError = function () {
    $scope.error = "";
  }

  $scope.login = function (form) {
      //$scope.dataLoading = true;

      console.log('$scope.username:' + $scope.username);

      AuthenticationService.Login($scope.username, $scope.password, function (response) {
          if (response.code === '1') {
              AuthenticationService.SetCredentials($scope.username, $scope.password);
              $scope.username = "";
              $scope.password = "";
              $scope.error = "";
              //$scope.dataLoading = false;
              form.$setPristine();
              $location.path('/home/users');
          } else if (response.code === '0') {
              //$scope.dataLoading = false;
              $scope.username = "";
              $scope.password = "";
              $scope.error = "Username or password not valid";
              form.$setPristine();

              var element = $window.document.getElementById("username");
              element.focus();
          } else {
              //$scope.dataLoading = false;
              $scope.username = "";
              $scope.password = "";
          
              form.$setPristine();

              var element = $window.document.getElementById("username");
              element.focus();

              //$scope.error = response.code + "-" + response.message;
              $scope.message = response.code + "-" + response.message;
              $scope.modal.show();

          }
      });
  };


  // $ionicModal.fromTemplateUrl('templates/modal.html', function (modal) {
  //   $scope.modal = modal;
  // }, {
  //   animation: 'slide-in-up'
  // });


  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });


}])

  
.controller('AppCtrl', function() {

  ionic.Platform.ready(function() {

  });
});

