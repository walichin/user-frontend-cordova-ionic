
angular.module('ionicApp', [
  'ionic',
  'ionicAppControllers',
  'ionicAppServices',
  'config'
  ])


//.run(function($ionicPlatform) {
.run(['$ionicPlatform', '$rootScope', '$window', '$location', '$localstorage', '$http', function ($ionicPlatform, $rootScope, $window, $location, $localstorage, $http) {

  // keep user logged in after page refresh
  //$rootScope.globals = $cookieStore.get('globals') || {};
  $rootScope.globals = $localstorage.getObject('globals') || {};

  if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) { // jshint ignore:line
      
      // if ($location.path() === '/login' && $rootScope.globals.currentUser) {
      //     $window.location.reload(true);
      // }

      // redirect to login page if not logged in
      if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
          $location.path('/login');
      }

  });


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

}])


.config(function($stateProvider, $urlRouterProvider) {
//.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // $httpProvider.interceptors.push(function() {
  //   return {
  //     response: function(res) {
  //       res.data = { data: data };
  //       res.data.meta = { status: res.status };
  //       return res;
  //     }
  //   };
  // });

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })
    .state('home', {
      url: "/home",
      templateUrl: "templates/home.html",
      controller: 'HomeCtrl'
    })
    .state('home.users', {
      url: "/users",
      views: {
        'homeContent': {
          templateUrl: "templates/users.html",
          controller: 'UsersCtrl'
        }
      }
    })
    .state('home.user-detail', {
      url: '/users/:userId',
      views: {
        'homeContent': {
          templateUrl: "templates/user-detail.html",
          controller: 'UserDetailCtrl'
        }
      }
    })
    .state('home.new-user', {
      url: "/new-user",
      views: {
        'homeContent': {
          templateUrl: "templates/new-user.html",
          controller: 'NewUserCtrl'
        }
      }
    })

  $urlRouterProvider.otherwise("/home/users");

});
