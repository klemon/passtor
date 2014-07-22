var app = angular.module('app', [
	'ngRoute',
	'dashboard',
	'store',
	'login',
	'signup',
	'profile',
	'editProfile',
	'createPost',
	'inventory',
	'createItem',
	'editItem',
	'post',
	'posts',
	'editPost'
	]);

app.config(['$routeProvider', '$locationProvider',
 function ($routeProvider, $locationProvider) {
  
  $routeProvider.otherwise({redirectTo:'/'});
  $locationProvider.html5Mode(true);
  
  }])
.controller('AppCtrl', ['$rootScope', '$location', 'User', '$timeout',
	function($rootScope, $location, User, $timeout) {
	User.restoreData();
	if(User.isLoggedIn()) {
		//$timeout(function(){
	      //  $rootScope.$broadcast('loggedIn');
	    //}, 100);
		$rootScope.$broadcast('loggedIn');
		$location.path('/dashboard');
	}
	else
		$location.path('/login');
}])
.controller('HeaderCtrl', ['$scope', '$location','AuthService', 'User',
	function($scope, $location, AuthService, User){

	$scope.username = User.currentUser().username;
	$scope.storeName = User.currentUser().storeName;
	$scope.isLoggedIn = User.isLoggedIn();
	$scope.$on('loggedIn', function(event, args) {
		$scope.isLoggedIn = true;
		if(User.currentUser().username)
			$scope.username = User.currentUser().username;
		else
			$scope.storeName = User.currentUser().storeName;
	});
	$scope.logout = function() {
		User.clearData();
		$scope.username = "";
		$scope.storeName = "";
		$scope.isLoggedIn = false;
		$location.path('/login');
		//$http.post('/logout', {token: $rootScope.token}, function(res) {
		//});
	}
	$scope.profile = function() {
		User.setOtherUser(User.currentUser().username);
		$location.path('/profile');
	}
}]);

app.factory('AuthService', ['$http', '$location', '$rootScope', '$window',
 function($http, $location, $rootScope, $window) {
	var expires;
	var token;
	return {
		send: function(url, data, done){
			data.token = token;
			$http.post(url, data)
			.success(function(res) {
				if(res.exp) {
					$http.post('/login', {username: $rootScope.username, password: $rootScope.password}, 
						function(res) {
						// TODO: set login message here somehow
					});
				}
				done(false, res);
			})
			.error(function(data) {
				console.log('Error: ' + data);
				done(data, res);
			})
		},
		setToken: function(tok){
			token = tok;
			$window.localStorage.setItem('token', token);
		},
		setExpires: function(exp) {
			expires = exp;
			$window.localStorage.setItem('expires', expires);
		}
	};
}]);

app.factory('User', ['AuthService', '$window', function(AuthService, $window) {
	var user = {username: "", storeName: ""};
	var otherUsername = "";
	return {
		setOtherUsername: function(usrname) {
			otherUsername = usrname;
		},
		otherUsername: function() {
			return otherUsername;
		},
		currentUser: function() {
			return  user;
		},
		password: function() {
			return password;
		},
		update: function(data) {
			user.username = data;
			$window.localStorage.setItem('username', user.username);
		},
		clearData: function() {
			user = {};
			$window.localStorage.clear();
		},
		isLoggedIn: function() {
			return user.username;
		},
		storeName: function() {
			return user.storeName;
		},
		restoreData: function() {
			if(!$window.localStorage.getItem('username')) {
				return;
			} else {
				user.username = $window.localStorage.getItem('username');
				user.password = $window.localStorage.getItem('password');
				user.email = $window.localStorage.getItem('email');
				user.firstName = $window.localStorage.getItem('firstName');
				user.lastName = $window.localStorage.getItem('lastName');
				user.coins = $window.localStorage.getItem('coins');
				user.likes = $window.localStorage.getItem('likes');
				AuthService.setToken($window.localStorage.getItem('token'));
				AuthService.setExpires($window.localStorage.getItem('expires'));
			}
		},
		setUser: function(usr) {
			user = usr;
			$window.localStorage.setItem('username', user.username);
			$window.localStorage.setItem('password', user.password);
			$window.localStorage.setItem('email', user.email);
			$window.localStorage.setItem('firstName', user.firstName);
			$window.localStorage.setItem('lastName', user.lastName);
			$window.localStorage.setItem('coins', user.coins);
			$window.localStorage.setItem('likes', user.likes);
		}
	};
}]);
/*
isLoggedIn: function() {
			if($window.localStorage.getItem('username')) {
				$rootScope.username = $window.localStorage.getItem('username');
				$rootScope.password = $window.localStorage.getItem('password');
				$rootScope.token = $window.localStorage.getItem('token');
				return true;
			}
			return false;
		},*/



app.factory('Store', ['$http', '$location', 'AuthService', function($http, $location, AuthService) {
	var items;
	var storeName;
	var editItem;
	return {
		update: function(data) {
			currentUser = data;
		},
		createItem: function(data, done) {
			$http.post('/createItem', 
				{username: AuthService.currentUser(), password: AuthService.password(), item: data})
				.success(function(res) {
					console.log(res);
					items = res.items;
					done(res.message);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		},
		items: function(done) {
			if(!items)
			{
				$http.post('/getItems',
					{username: AuthService.currentUser(), password: AuthService.password()})
				.success(function(res) {
					console.log(res);
					items = res.items;
					done(items);
				})
				.error(function(data) {
					console.log("Error: " + data);
					done(items);
				});
			}
			done(items);
		},
		deleteItem: function(item, done) {
			$http.post('/deleteItem',
					{username: AuthService.currentUser(), password: AuthService.password(), item: item})
				.success(function(res) {
					console.log(res);
					items = res.items;
					done(items);
				})
				.error(function(data) {
					console.log("Error: " + data);
					done(items);
				});
		},
		editItem: function(item, done) {
			$http.post('/editItem',
					{username: AuthService.currentUser(), password: AuthService.password(), item: item})
				.success(function(res) {
					console.log(res);
					items = res.items;
					done(res.message);
				})
				.error(function(data) {
					console.log("Error: " + data);
					done(res.message);
				});
		},
		prepareToEditItem: function(item) {
			editItem = item;
			$location.path('/editItem');
		},
		getEditItem: function() {
			return editItem;
		}
	};
}]);

app.factory('Posts', ['$http', '$location', 'AuthService', function($http, $location, AuthService) {
	var post;
	return {
		edit: function(p) {
			post = p;
			$location.path('/editPost');
		},
		getPost: function() {
			return post;
		},
		view: function(p) {
			post = p;
			$location.path('/post');
		},
		monthToStr: function(num) {
			if(num == 1)
				return "January";
			else if(num == 2)
				return "February";
			else if(num == 3)
				return "March";
			else if(num == 4)
				return "April";
			else if(num == 5)
				return "May";
			else if(num == 6)
				return "June";
			else if(num == 7)
				return "July";
			else if(num == 8)
				return "August";
			else if(num == 9)
				return "September";
			else if(num == 10)
				return "October";
			else if(num == 11)
				return "November";
			else
				return "December";
		}	
	};
}]);