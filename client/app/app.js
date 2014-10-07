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
	'ja.qr',
    'mgcrea.ngStrap',
    'mgcrea.ngStrap.dropdown',
    'focusOn'
	]);

app.config(['$routeProvider', '$locationProvider',
 function ($routeProvider, $locationProvider) {
  //$routeProvider.otherwise({redirectTo:'/'});
  //$locationProvider.html5Mode(true);
  
  }])
.controller('AppCtrl', ['User','$scope', '$location', '$rootScope', function(User, sc, loc, rsc) {
    User.restoreData();
	if(User.isLoggedIn()) {
		rsc.$broadcast('loggedIn');
		if(User.isSO())
			loc.path('/sOItems');
		else 
			loc.path('/posts');
	}
	else
		loc.path('/login');
}])
.controller('HeaderCtrl', ['$scope', 'AuthService', 'User', '$location',
	function(sc, AuthService, User, loc){
	sc.username = User.currentUser().username;
	sc.isSO = User.isSO();
	sc.isLoggedIn = User.isLoggedIn();
	// Listen to 'loggedIn' event
	sc.$on('loggedIn', function(event, args) {
		sc.isLoggedIn = true;
		sc.isSO = User.isSO();
		if(User.currentUser().username)
			sc.username = User.currentUser().username;
		else
			sc.storeName = User.currentUser().storeName;
	});
	sc.logout = function() {
		User.clearData();
		sc.username = "";
		sc.storeName = "";
		sc.isSO = false;
		sc.isLoggedIn = false;
		loc.path('/login');
	}
    sc.signup = function() {
        loc.path('/signup');
    }
    sc.login = function() {
    	loc.path('/login');
    }
    sc.storeItems = function() {
        loc.path('/storeItems');
    }
    sc.posts = function() {
        loc.path('/posts');
    }
    sc.userProfile = function() {
        loc.path('/userProfile');
    }
    sc.sOItems = function() {
        loc.path('/sOItems');
    }
    sc.redeem = function() {
        loc.path('/redeem');
    }
    sc.sOProfile = function() {
        loc.path('/sOProfile');
    }
}]);

app.factory('MySave', ['$window', function($window) {
	return {
		set: function(name, value) {
			//intel.xdk.cache.setCookie(name, value, -1);
			$window.localStorage.setItem(name, value);
		},
		get: function(name) {
			//return intel.xdk.cache.getCookie(name);
			return $window.localStorage.getItem(name);
		},
		clear: function() {
			//intel.xdk.cache.clearAllCookies();
			$window.localStorage.clear();
		}
	}
}]);

app.factory('AuthService', ['$http', '$location', '$rootScope', 'MySave',
 function($http, $location, $rootScope, MySave) {
	var expires;
	var token;
	function successCallback(res) {
		done(false, res);
	}
	function errorCallback(err) {
		done(err, null);
	}
	return {
		send: function(url, data, done){
			data.token = token;
			/*intel.xdk.device.getRemoteData("http://localhost:8080" + url, "POST", data, successCallback, errorCallback);*/
            $http.post('http://192.168.1.136:8080' + url, data)
			.success(function(res) {
				if(res.exp) {
					$http.post('http://192.168.1.136:8080/login', {username: $rootScope.username, password: $rootScope.password}, 
						function(res) {
						// TODO: set login message here somehow
					});
				}
				done(false, res);
			})
			.error(function(data) {
				console.log('Error: ' + data);
				done(data, null);
			});
		},
		setToken: function(tok){
			token = tok;
			MySave.set('token', token);
		},
		setExpires: function(exp) {
			expires = exp;
			MySave.set('expires', expires);
		}
	};
}]);

app.factory('User', ['AuthService', 'MySave', function(AuthService, MySave) {
	var user = {Items: []};
	return {
		isSO: function() {
			if(MySave.get('storeName'))
				return true;
			return false;
		},
		isUser: function() {
			if(!MySave.get('storeName') && MySave.get('username'))
				return true;
			return false;
		},
		isNonUser: function() {
			if(!MySave.get('username'))
				return true;
			return false;
		},
		send : function(url, data, done) {
			AuthService.send(url, data, function(err, res) {
				if(!MySave.get('storeName') && MySave.get('username')) {
					user.coins = res.coins;
					user.likes = res.likes;
					MySave.set('coins', user.coins);
					MySave.set('likes', user.likes);
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
			MySave.set('username', user.username);
		},
		clearData: function() {
			user = {};
			MySave.clear();
		},
		isLoggedIn: function() {
			return user.username;
		},
		storeName: function() {
			return user.storeName;
		},
		restoreData: function() {
			if(MySave.get('storeName')) {
				user.storeName = MySave.get('storeName');
				AuthService.setToken(MySave.get('token'));
			} else if(MySave.get('username')) {
				user.coins = MySave.get('coins');
				user.likes = MySave.get('likes');
				AuthService.setToken(MySave.get('token'));
				AuthService.send('/update', {}, function(err, res) {
					MySave.set('coins', res.coins);
					MySave.set('likes', res.likes);
					user.coins = res.coins;
					user.likes = res.likes;
				});
			} else {
				return;
			}
			user.username = MySave.get('username');
			user.password = MySave.get('password');
			user.email = MySave.get('email');
			user.firstName = MySave.get('firstName');
			user.lastName = MySave.get('lastName');
			AuthService.setExpires(MySave.get('expires'));
		},
		setUser: function(res) {
			if(res.user) {
				user = res.user;
				MySave.set('coins', user.coins);
				MySave.set('likes', user.likes);
			} else {
				user = res.storeOwner;
				MySave.set('storeName', user.storeName);
			}
			MySave.set('username', user.username);
			MySave.set('password', user.password);
			MySave.set('email', user.email);
			MySave.set('firstName', user.firstName);
			MySave.set('lastName', user.lastName);
		}
	};
}]);

app.factory('Posts', ['$http', '$location', 'AuthService', 'User', 
	function($http, $location, AuthService, User) {
	var data = function(username) {
		this.username = username; // null means get all posts
		this.sorts = [{text: "Date added (newest - oldest)", click: "pF.changeSort(0)"},
		 {text: "Date added (oldest - newest)", click: "pF.changeSort(1)"}, {text: "Most popular", click: "pF.changeSort(2)"}];
		this.selectedSort = {text: this.sorts[0].text, click: this.sorts[0].click};
		this.prevIndex = 0;
		this.numPosts = 0;
		this.posts = [];
		this.lastDate = null;
		this.page = 0; // For Most Popular
		this.monthToStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
		"October", "November", "December"];
	};
	data.prototype.showMore = function(done) {
		User.send('/posts', {username: this.username, 
			sort: this.prevIndex, lastDate: this.lastDate, page: this.page}, function(err, res) {
			if(this.prevIndex == 2) {
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
            if(done)
                done();
		}.bind(this));
	}
	data.prototype.changeSort = function(index) {
        if(this.prevIndex == index)
			return;
        var t = this.sorts[index];
        this.selectedSort = {text: t.text, click: t.click};
		this.prevIndex = index;
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

app.factory('Items', ['$location', 'AuthService', 'User', 
	function($location, AuthService, User) {
	var data = function(all, url) {
		this.url = url || '/items'; // default parameter for url
		this.all = all;
		this.sorts = [{text: "Date added (newest - oldest)", click: "iF.changeSort(0)"}, {text: "Date added (oldest - newest)", click: "iF.changeSort(1)"}, {text: "Most sold", click: "iF.changeSort(2)"}, {text: "Most redeemed", click: "iF.changeSort(3)"}];
		this.selectedSort = {text: this.sorts[0].text, click: this.sorts[0].click};
		this.prevIndex = 0;
		this.numItems = 0;
		this.items = [];
		this.lastDate = null;
		this.page = 0; // For Most sold/redeemed
		this.monthToStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
		"October", "November", "December"];
	};
	data.prototype.showMore = function(done) {
		User.send(this.url, {all: this.all, isSO: User.isSO(), isUser: User.isUser(), isNonUser: User.isNonUser(),
		 sort: this.prevIndex, lastDate: this.lastDate, page: this.page}, function(err, res) {
			if(this.prevIndex > 1) {
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
	data.prototype.changeSort = function(index) {
		if(this.prevIndex == index)
			return;
        var t = this.sorts[index];
        this.selectedSort = {text: t.text, click: t.click};
		this.prevIndex = index;
		this.items = [];
		this.lastDate =  null;
		this.page = 0;
		this.showMore();
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