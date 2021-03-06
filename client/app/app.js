var app = angular.module('app', [
	'ngRoute',
	'otherPost',
	'otherPosts',
	'otherProfile',
	'posts',
    'welcome',
	'login',
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
    'focusOn',
    'cgBusy',
    'FBAngular'
	]);

app.config(['$routeProvider', '$locationProvider',
 function ($routeProvider, $locationProvider) {
  //$routeProvider.otherwise({redirectTo:'/'});
  //$locationProvider.html5Mode(true);
  
  }])
.controller('AppCtrl', ['User','$scope', '$location', '$rootScope', 'avatars', 'MySave', 
                        function(User, $scope, $location, $rootScope, avatars, MySave) {
    User.restoreData();
    if(User.isLoggedIn()) {
		$rootScope.$broadcast('loggedIn');
        var tokenStore = [];
        tokenStore['fbtoken'] = MySave.get('fbtoken');
        openFB.init({appId: '1558759474355532', tokenStore: tokenStore});
        $location.path('/posts');
	} else {
        openFB.init({appId: '1558759474355532'});
		$location.path('/welcome');
    }
    
    /*openFB.logout();
    openFB.getLoginStatus(function(response) {
        console.log("res: " + response.status);
        if (response.status === 'connected') {
            $location.path('/posts');
        } else {
            $location.path('/welcome');
        }
    });
    User.restoreData();
    
    */
    
    // Using code from https://github.com/YoBanfa/yo-banfa
    //openFB.logout(function() {
      
    //});
    

    /*$scope.exit = function() {
        console.log("exito");
        avatars.setExitFullScreen(true);
    }*/
}])
.controller('HeaderCtrl', ['$scope', 'AuthService', 'User', '$location', 'MySave', '$rootScope',
	function($scope, AuthService, User, $location, MySave, $rootScope){
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
        openFB.logout();
        $location.path('/welcome');
	}
    $scope.login = function() {
        openFB.login(function(response) {
        if(response.status === 'connected') {
            MySave.set('fbtoken', response.authResponse.token);
            openFB.api({path: '/me', success: function(data){
                console.log("login data: " + JSON.stringify(data, undefined, 2));
                MySave.set('FBuserID', data.id);
                MySave.set('FBuserName', data.name);
                MySave.set('FBuserLocale', data.locale);
                openFB.api({
                    path: '/me/picture',
                    params: {redirect:false},
                    success: function(data) {
                        MySave.set('FBuserPic', data.data.url);
                        console.log("MySaveID: " + MySave.get('FBuserID'));
                        $scope.loginPromise = User.sendPromise('/login', {id: MySave.get('FBuserID'), access_token: MySave.get('fbtoken')});
                        $scope.loginPromise.then(function(res) {
                            if(res.data.message) {
                                $scope.message = res.data.message;
                                console.log("msg: " + $scope.message);
                            } else {
                                User.setUser(res.data);
                                $rootScope.$broadcast('loggedIn');
                                AuthService.setToken(res.data.token, res.data.expires);
                                $location.path('/posts');
                            }
                        });
                    },
                    error: function(err) {console.log(err);}
                });
            }, error: function(err) {console.log(err);}});
          } else {
            alert('Facebook login failed: ' + response.error);
          }
        }, {scope: 'email, read_stream, user_groups'}); 
    }
    $scope.storeItems = function() {
        $location.path('/storeItems');
    }
    $scope.posts = function() {
        $location.path('/posts');
    }
    $scope.userProfile = function() {
        $location.path('/userProfile');
    }
    $scope.sOItems = function() {
        $location.path('/sOItems');
    }
    $scope.redeem = function() {
        $location.path('/redeem');
    }
    $scope.sOProfile = function() {
        $location.path('/sOProfile');
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

app.factory("avatars", function($rootScope) {
    var scope = $rootScope.$new(true);
    scope.avatars = []; // {id: "aCanvas", isFullScreen: false}
    scope.exitFullScreen = false;
    scope.isFullScreen = {isFullScreen: false};
    return {
        all: function() {
            return scope.avatars;
        },
        exitFullScreen: function() {
            return scope.exitFullScreen;
        },
        setFullScreen: function(index, isFullScreen) {
            scope.isFullScreen = isFullScreen;
            scope.avatars[index].isFullScreen = isFullScreen;
        },
        setExitFullScreen: function(exitFullScreen) {
            scope.isFullScreen = exitFullScreen;
            scope.exitFullScreen = exitFullScreen;
        },
        set: function(index, value) {
            scope.avatars[index] = value;
        },
        get: function(index) {
            return scope.avatars[index];
        },
        index: function(id) {
            for(var i = 0; i < scope.avatars.length; ++i) {
                if(scope.avatars[i].id == id) {
                    return i;
                }
            }
            return -1;
        },
        push: function(id, isFullScreen) {
            scope.avatars.push({id: id, isFullScreen: isFullScreen});
        },
        isFullScreen: function() {
            return scope.isFullScreen;
        }
    }
});

app.factory('AuthService', ['$http', '$location', '$rootScope', 'MySave',
 function($http, $location, $rootScope, MySave) {
	var expires;
	var token;
    //var serverIP = "http://54.172.93.78:8080";
    var serverIP = "http://192.168.1.146:8080";
	function successCallback(res) {
		done(false, res);
	}
	function errorCallback(err) {
		done(err, null);
	}
	return {
		send: function(url, data, done){
			data.token = token;
			/*
ec2-54-172-93-78.compute-1.amazonaws.com

			intel.xdk.device.getRemoteData("http://localhost:8080" + url, "POST", data, successCallback, errorCallback);*/
            $http.post(serverIP + url, data)
			.success(function(res) {
				if(res.exp) {
					$http.post(serverIP + '/login', {username: $rootScope.username, password: $rootScope.password}, 
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
		sendPromise: function(url, data) {
			data.token = token;
			return $http.post(serverIP + url, data);
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
		sendPromise: function(url, data) {
			return AuthService.sendPromise(url, data);
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
			MySave.set('email', user.facebook.email);
			MySave.set('firstName', user.facebook.firstName);
			MySave.set('lastName', user.facebook.lastName);
            MySave.set('name', user.facebook.name);
            MySave.set('gender', user.facebook.gender);
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
		this.promise;
		this.noMorePosts = false;
		this.timeToRefresh = false;
		this.prevTime = 0;
	};
	data.prototype.showMore = function(done) {
		if(this.noMorePosts) {
			var d = new Date();
			var currTime = d.getTime();
			if(currTime-this.prevTime > 10000) {
				this.timeToRefresh = true;
				this.prevTime = currTime;
			}
			else
				this.timeToRefresh = false;
		}
		if(this.busy || (this.noMorePosts && !this.timeToRefresh))
			return;
		this.busy = true;
		this.promise = User.sendPromise('/posts', {username: this.username, 
			sort: this.prevIndex, lastDate: this.lastDate, page: this.page});
		this.promise.then(function(res) {
			res = res.data;
			if(this.prevIndex == 2) {
				++this.page;
			} else if(res.posts.length) {
				this.lastDate = res.posts[res.posts.length-1].created;
			}
			if(res.posts.length)
				this.noMorePosts = false;
			else
				this.noMorePosts = true;
			for(var i = 0; i < res.posts.length; ++i) {
				var date = new Date(res.posts[i].created);
				res.posts[i].created = {month: this.monthToStr[date.getMonth()], day: date.getDate(),
				 year: date.getFullYear()};
				this.posts.push(res.posts[i]);
			}
			this.numPosts = res.numPosts;
			this.busy = false;
            if(done)
                done();
		}.bind(this));
		/*User.send('/posts', {username: this.username, 
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
		}.bind(this));*/
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
		this.promise;
		this.noMoreItems = false;
		this.timeToRefresh = false;
		this.prevTime = 0;
		this.showMoreCB = null;
	};
	data.prototype.showMore = function() {
		if(this.noMoreItems) {
			var d = new Date();
			var currTime = d.getTime();
			if(currTime-this.prevTime > 10000) {
				this.timeToRefresh = true;
				this.prevTime = currTime;
			}
			else
				this.timeToRefresh = false;
		}
		if(this.busy || (this.noMoreItems && !this.timeToRefresh))
			return;
		this.busy = true;
		this.promise = User.sendPromise(this.url, {all: this.all, isSO: User.isSO(), isUser: User.isUser(),
		 isNonUser: User.isNonUser(), sort: this.prevIndex, lastDate: this.lastDate, page: this.page});
		this.promise.then(function(res) {
			res = res.data;
			if(this.prevIndex > 1) {
		 		++this.page;
		 	} else if(res.items.length) {
		 		this.lastDate = res.items[res.items.length-1].created;
		 	}
		 	if(res.items.length)
				this.noMoreItems = false;
			else
				this.noMoreItems = true;
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
			this.busy = false;
			if(this.showMoreCB)
				this.showMoreCB();
		}.bind(this));

/*
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
		}.bind(this));*/
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