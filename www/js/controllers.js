var ionicAppControllers = angular.module('ionicAppControllers', ['ionicAppServices', 'config']);

ionicAppControllers


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


  $ionicModal.fromTemplateUrl('modal.html', function (modal) {
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
    ['$scope', '$window', '$rootScope', '$location', 'AuthenticationService', 'ENV', function ($scope, $window, $rootScope, $location, AuthenticationService, ENV) {


    if ($location.path() === '/login') AuthenticationService.ClearCredentials();

    $scope.clearError = function () {
      $scope.error = "";
    }

    $scope.login = function (form) {
        //$scope.dataLoading = true;

        console.log('$scope.username:' + $scope.username);;

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
                $scope.error = response.code + "-" + response.message;
                form.$setPristine();

                var element = $window.document.getElementById("username");
                element.focus();
            }
        });
    };

}])

  
.controller('AppCtrl', function() {

  ionic.Platform.ready(function() {

  });
});

