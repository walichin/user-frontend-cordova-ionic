var ionicAppServices = angular.module('ionicAppServices', ['config']);

ionicAppServices


.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])


.factory('Users', ['$http', '$rootScope', 'ENV', function($http, $rootScope, ENV) {

    // var archiveData = {};

    // archiveData.users = []; // to keep state

    // $rootScope.archiveData = {};
    // $rootScope.archiveData.users = [];

    return {
        create: function(user, callback) {

            var urlNewUser = ENV.backend + '/newUser';
            console.log('urlNewUser:' + urlNewUser);
            console.log('user.name:' + user.name);

            var response = {};
            var result = {};
            var $params = {
                name: user.name,
                login: user.login,
                password: user.password
                };

            return $http({
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                    },
                url: urlNewUser,
                data: $params
            }).success(function(data) {
                //data = {"result":"1"}
                response.code = data.result;
                //response.message = data.description;
                response.message = "";
                callback(response);
            }).error(function(data) {
                response.code = data.status;
                response.message = data.statusText;
                callback(response);
            });


        },


        count: function() {

            var urlUsers = ENV.backend + '/users';
            console.log('urlUsers:' + urlUsers);

            var users = [];
            var length = 0;
            
            return $http.get(urlUsers, {
            //$http.get(urlUsers, {
                params : {
                }
                }).success(function(data) {
                    
                    return data;

                }).error(function(data) {
                    
                    return data;
                    
                });
        },


        all: function() {

            var urlUsers = ENV.backend + '/users';
            console.log('urlUsers:' + urlUsers);
            
            return $http.get(urlUsers, {
            //$http.get(urlUsers, {
                params : {
                }
                }).success(function(data) {
                    
                    //$rootScope.archiveData.users = data.users;
                    return data;

                }).error(function(data) {
                    
                    //$rootScope.archiveData.users = [];
                    data.users = [];
                    return data;
                    
                });
        },


        remove: function(user) {

            var users = $rootScope.users;

            users.splice(users.indexOf(user), 1);

            $rootScope.users = users;

            return users;
        },

        get: function(userId) {

            var users = $rootScope.users;
            
            for (var i = 0; i < users.length; i++) {
                if (users[i].user_id === parseInt(userId)) {
                    return users[i];
                }
            }
            return null;
        }

    };
          
}])



.factory('AuthenticationService',
    ['Base64', '$http', '$localstorage', '$rootScope', '$timeout','ENV',
    function (Base64, $http, $localstorage, $rootScope, $timeout, ENV) {

    var service = {};
    console.log('AuthenticationService:' + ENV);

    var urlLogin = ENV.backend + '/login';
    console.log('urlLogin:' + urlLogin);

	service.Login = function (username, password, callback) {

		//$timeout(function () {

            console.log('username:' + username);
            console.log('password:' + password);

            var response = {};
			var result = {};
			var $params = {
				login: username,
				password: password
				};

			return $http({
				method: 'POST',
				
                // headers: {
                //     "Content-Type": "application/x-www-form-urlencoded",
                //     "Access-Control-Allow-Origin": "*",
                //     "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                //     "access-control-allow-headers": "content-type, accept"
                // },

                headers: {"Access-Control-Allow-Origin": "*","Content-Type": "application/x-www-form-urlencoded"},
                //headers: {"Content-Type": "application/x-www-form-urlencoded"},
                
                //headers: {"Content-Type":"application/x-www-form-urlencoded","Accept":"application/json, text/plain, */*","Authorization":"Basic "},

				transformRequest: function(obj) {
					var str = [];
					for(var p in obj) {
						//login=colmillo&password=colmillo
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
					return str.join("&");
					},


				url: urlLogin,
				data: $params

			}).success(function(data) {
				//data = {"result":"1"}
				response.code = data.result;
				//response.message = data.description;
                response.message = "";
 				callback(response);

			//}).error(function(data) {
            }).error(function (error, status, headers, config) {

                // $ionicPopup.alert({
                //     title: 'error',
                //     template: JSON.stringify(error) + " >> " + JSON.stringify(status)+ " >> " + JSON.stringify(headers) + " >> " + JSON.stringify(config)
                // });
                //reject(error);

                console.log('config:' + JSON.stringify(config));
                // response.code = data.status;
                // response.message = data.statusText;
                response.code = JSON.stringify(status);
                response.message = JSON.stringify(config);
				callback(response);

			});

		//}, 1000);

	};

    service.SetCredentials = function (username, password) {
        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line

        //$cookieStore.put('globals', $rootScope.globals);
        $localstorage.setObject('globals', $rootScope.globals);
    };

    service.ClearCredentials = function () {
        $rootScope.globals = {};

        //$cookieStore.remove('globals');
        $localstorage.setObject('globals', {});

        $http.defaults.headers.common.Authorization = 'Basic ';
    };

    return service;
}])

.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});
