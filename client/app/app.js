var app = angular.module('app', [
	'ngRoute',
	'otherPost',
	'otherPosts',
	'otherProfile',
	'posts',
	'login',
	'signup',
	'storeItem',
	'storeItems',
	'storeProfile',
	'createItem',
	'editItem',
	'editSOProfile',
	'redeem',
	'sOItem',
	'sOItems',
	'sOProfile',
	'createPost',
	'editPost',
	'editProfile',
	'userItem',
	'userItems',
	'userPost',
	'userPosts',
	'userProfile',
	'wishItem',
	'wishlist',
	'infinite-scroll',
	'ja.qr'
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
		$rootScope.$broadcast('loggedIn');
		if(User.isSO())
			$location.path('/sOItems');
		else 
			$location.path('/posts');
	}
	else
		$location.path('/login');
}])
.controller('HeaderCtrl', ['$scope', '$location','AuthService', 'User', '$route',
	function($scope, $location, AuthService, User, $route){
	$scope.username = User.currentUser().username;
	$scope.isSO = User.isSO();
	$scope.isLoggedIn = User.isLoggedIn();
	// Listen to 'loggedIn' event
	$scope.$on('loggedIn', function(event, args) {
		$scope.isLoggedIn = true;
		$scope.isSO = User.isSO();
		if(User.currentUser().username)
			$scope.username = User.currentUser().username;
		else
			$scope.storeName = User.currentUser().storeName;
	});
	$scope.logout = function() {
		User.clearData();
		$scope.username = "";
		$scope.storeName = "";
		$scope.isSO = false;
		$scope.isLoggedIn = false;
		$location.path('/login');
	}
}]);

app.factory('AuthService', ['$http', '$location', '$rootScope', '$window',
 function($http, $location, $rootScope, $window) {
	var expires;
	var token;
	return {
		send: function(url, data, done){
			data.token = token;
			$http.post('http://localhost:8080' + url, data)
			.success(function(res) {
				if(res.exp) {
					$http.post('http://localhost:8080/login', {username: $rootScope.username, password: $rootScope.password}, 
						function(res) {
						// TODO: set login message here somehow
					});
				}
				done(false, res);
			})
			.error(function(data) {
				console.log('Error: ' + data);
				done(data, null);
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
	var user = {Items: []};
	return {
		isSO: function() {
			if($window.localStorage.getItem('storeName'))
				return true;
			return false;
		},
		isUser: function() {
			if(!$window.localStorage.getItem('storeName') && $window.localStorage.getItem('username'))
				return true;
			return false;
		},
		isNonUser: function() {
			if(!$window.localStorage.getItem('username'))
				return true;
			return false;
		},
		send : function(url, data, done) {
			AuthService.send(url, data, function(err, res) {
				if(!$window.localStorage.getItem('storeName') && $window.localStorage.getItem('username')) {
					user.coins = res.coins;
					user.likes = res.likes;
					$window.localStorage.setItem('coins', user.coins);
					$window.localStorage.setItem('likes', user.likes);
				}
				done(err, res);
			});
		},
		addItem: function(itemId) {
			//=user.Items.push(itemId);
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
			if($window.localStorage.getItem('storeName')) {
				user.storeName = $window.localStorage.getItem('storeName');
				AuthService.setToken($window.localStorage.getItem('token'));
			} else if($window.localStorage.getItem('username')) {
				user.coins = $window.localStorage.getItem('coins');
				user.likes = $window.localStorage.getItem('likes');
				AuthService.setToken($window.localStorage.getItem('token'));
				AuthService.send('/update', {}, function(err, res) {
					$window.localStorage.setItem('coins', res.coins);
					$window.localStorage.setItem('likes', res.likes);
					user.coins = res.coins;
					user.likes = res.likes;
				});
			} else {
				return;
			}
			user.username = $window.localStorage.getItem('username');
			user.password = $window.localStorage.getItem('password');
			user.email = $window.localStorage.getItem('email');
			user.firstName = $window.localStorage.getItem('firstName');
			user.lastName = $window.localStorage.getItem('lastName');
			AuthService.setExpires($window.localStorage.getItem('expires'));
		},
		setUser: function(res) {
			if(res.user) {
				user = res.user;
				$window.localStorage.setItem('coins', user.coins);
				$window.localStorage.setItem('likes', user.likes);
			} else {
				user = res.storeOwner;
				$window.localStorage.setItem('storeName', user.storeName);
			}
			$window.localStorage.setItem('username', user.username);
			$window.localStorage.setItem('password', user.password);
			$window.localStorage.setItem('email', user.email);
			$window.localStorage.setItem('firstName', user.firstName);
			$window.localStorage.setItem('lastName', user.lastName);
		}
	};
}]);

app.factory('Posts', ['$http', '$location', 'AuthService', 'User', 
	function($http, $location, AuthService, User) {
	var data = function(username) {
		this.username = username; // null means get all posts
		this.sorts = [{text: "Date added (newest - oldest)", id: 0},
		 {text: "Date added (oldest - newest)", id: 1}, {text: "Most popular", id: 2}];
		this.selectedSort = this.sorts[0];
		this.prevSort = this.selectedSort;
		this.numPosts = 0;
		this.posts = [];
		this.lastDate = null;
		this.page = 0; // For Most Popular
		this.monthToStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
		"October", "November", "December"];
	};
	data.prototype.showMore = function() {
		User.send('/posts', {username: this.username, 
			sort: this.selectedSort.id, lastDate: this.lastDate, page: this.page}, function(err, res) {
			if(this.selectedSort.id == 2) {
				++this.page;
			} else if(res.posts.length) {
				this.lastDate = res.posts[res.posts.length-1].created;
			}
			for(var i = 0; i < res.posts.length; ++i) {
				var date = new Date(res.posts[i].created);
				res.posts[i].created = {month: this.monthToStr[date.getMonth()], day: date.getDate(),
				 year: date.getFullYear()};
				this.posts.push(res.posts[i]);
			}
			this.numPosts = res.numPosts;
		}.bind(this));
	}
	data.prototype.changeSort = function() {
		if(this.prevSort.id == this.selectedSort.id)
			return;
		this.prevSort = this.selectedSort;
		this.posts = [];
		this.lastDate =  null;
		this.page = 0;
		this.showMore();
	}
	return data;
}]);

app.factory('MyDate', [function() {
	return {
		date: function(dateStr) {
			var monthToStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
			"October", "November", "December"];
			var date = new Date(dateStr);
			return {month: monthToStr[date.getMonth()], day: date.getDate(), year: date.getFullYear()};
		}
	};
}]);

app.factory('Items', ['$http', '$location', 'AuthService', 'User', 
	function($http, $location, AuthService, User) {
	var data = function(all, url) {
		this.url = url || '/items'; // default parameter for url
		this.all = all;
		this.sorts = [{text: "Date added (newest - oldest)", id: 0}, {text: "Date added (oldest - newest)", id: 1},
			{text: "Most sold", id: 2}, {text: "Most redeemed", id:3}];
		this.selectedSort = this.sorts[0];
		this.prevSort = this.selectedSort;
		this.numItems = 0;
		this.items = [];
		this.lastDate = null;
		this.page = 0; // For Most sold/redeemed
		this.monthToStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
		"October", "November", "December"];
	};
	data.prototype.showMore = function(done) {
		User.send(this.url, {all: this.all, isSO: User.isSO(), isUser: User.isUser(), isNonUser: User.isNonUser(),
		 sort: this.selectedSort.id, lastDate: this.lastDate, page: this.page}, function(err, res) {
			if(this.selectedSort.id > 1) {
		 		++this.page;
		 	} else if(res.items.length) {
		 		this.lastDate = res.items[res.items.length-1].created;
		 	}
			for(var i = 0; i < res.items.length; ++i) {
				var date = new Date(res.items[i].created);
				res.items[i].created = {month: this.monthToStr[date.getMonth()], day: date.getDate(), year: date.getFullYear()};
				if(User.isUser()) {
					var ownsItem = false;
					for(var j = 0; j < res.extraItemInfo.length; ++j) {
						if(res.extraItemInfo[j].id == res.items[i].id) {
							ownsItem = true;
							res.items[i].num = res.extraItemInfo[j].num;
							if(User.isUser() && !this.all)
								res.items[i].QRCode = res.extraItemInfo[j].QRCode;
							break;
						}
					}
					if(!ownsItem)
						res.items[i].num = 0;
				}
				this.items.push(res.items[i]);
			}
			this.numItems = res.numItems;
			if(done)
				done();
		}.bind(this));
	}
	data.prototype.changeSort = function(done) {
		if(this.prevSort.id == this.selectedSort.id)
			return;
		this.prevSort = this.selectedSort;
		this.items = [];
		this.lastDate =  null;
		this.page = 0;
		this.showMore(function() {
			if(done)
				done();
		});
	}
	data.prototype.delete = function(index) {
		User.send('/deleteItem', {id: this.items[index].id}, function(err, res) {
			this.items.splice(index, 1);
			this.numItems = this.numItems-1;
		}.bind(this));
	}
	return data;
}]);

app.directive('dotdotdot', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			clamp(element[0], {
				clamp: 3});
		}
	}
});

app.directive('nodotdotdot', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			clamp(element[0], {
				clamp: 50
			});
		}
	}
});