var posts = angular.module('posts', []);

posts.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/posts', {
    templateUrl:'app/dashboard/posts.tpl.html',
    controller: 'PostsCtrl',
    resolve: posts.resolve
  });
}]);

posts.controller('PostsCtrl', ['$scope', '$location', 'User', '$rootScope', 'Posts', '$anchorScroll', 'avatars', 'Fullscreen',
	function($scope, $location, User, $rootScope, Posts, $anchorScroll, avatars, Fullscreen) {
    $location.hash("body");
    $anchorScroll();
 	$scope.pF = new Posts(null); // pF = postsFactory, must use pF as name
	$scope.view = function(post) {
		$rootScope.post = post;
		if(post.creator == User.currentUser().username)
			$location.path('/userPost');
		else
			$location.path('/otherPost');
	}
	$scope.profile = function(username) {
		$rootScope.username = username;
		if(username == User.currentUser().username)
			$location.path('/userProfile');
		else
			$location.path('/otherProfile');
	}
	$scope.createPost = function() {
		$location.path('/createPost');
	}
   /* $scope.start = function(canvasObj) {
        var canvas = document.getElementById(canvasObj.id);
        var engine = new BABYLON.Engine(canvas, true);
        var createScene = function () {
            var scene = new BABYLON.Scene(engine);

            var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);

            camera.attachControl(canvas, true);

            var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);

            //Creation of a box
            //(name of the box, size, scene)
            var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);

            //Creation of a sphere 
            //(name of the sphere, segments, diameter, scene) 
            var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);

            //Creation of a plan
            //(name of the plane, size, scene)
            var plan = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);

            //Creation of a cylinder
            //(name, height, diameter, tessellation, scene, updatable)
            var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene, false);

            // Creation of a torus
            // (name, diameter, thickness, tessellation, scene, updatable)
            var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene, false);

            // Creation of a knot
            // (name, radius, tube, radialSegments, tubularSegments, p, q, scene, updatable)
            var knot = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.5, 128, 64, 2, 3, scene);

            // Creation of a lines mesh
            var lines = BABYLON.Mesh.CreateLines("lines", [
                new BABYLON.Vector3(-10, 0, 0),
                new BABYLON.Vector3(10, 0, 0),
                new BABYLON.Vector3(0, 0, -10),
                new BABYLON.Vector3(0, 0, 10)
            ], scene);

            // Moving elements
            box.position = new BABYLON.Vector3(-10, 0, 0);   // Using a vector
            sphere.position = new BABYLON.Vector3(0, 10, 0); // Using a vector
            plan.position.z = 10;                            // Using a single coordinate component
            cylinder.position.z = -10;
            torus.position.x = 10;
            knot.position.y = -10;

            return scene;
        };
        var scene = createScene();
        var isAlreadyFullScreen = false;
        var margins = [];
        var paddings = [];
        document.getElementById(canvasObj.id).style.width = "100%";
        document.getElementById(canvasObj.id).style.height = "100%";
        document.getElementById(canvasObj.id).style.zIndex = "-1";
        document.getElementById("exit").style.zIndex = "1";
        scene.activeCamera.detachControl(canvas);
        document.body.style.overflow = "visible";
        document.getElementById(canvasObj.id).style.touch_action = "auto";
        
        var swapEl = document.getElementById("swap");
        var avatarEl = document.getElementById("avatar");
        engine.runRenderLoop(function () {
          if(canvasObj.isFullScreen && !isAlreadyFullScreen) {
              isAlreadyFullScreen = true;
              console.log("enter fullscreen");
              
              //var noParent = false;
             // var child = document.getElementById(canvasObj.id);
              //while(noParent) {
            //    if(child
            //  }
              //$("#swap").before($("#"+canvasObj.id));
              //$("#"+canvasObj.id).before($("#swap"));
              //$("#avatar").prepend($("#"+canvasObj.id));
              //document.getElementById(canvasObj.id).parentElement.insertBefore(document.getElementById("swap"), document.getElementById(canvasObj.id));
              //document.getElementById("avatar").appendChild(document.getElementById(canvasObj.id));
              //canvas.parentElement.insertBefore(swapEl, canvas);
              //avatarEl.appendChild(canvas);
              scene.activeCamera.attachControl(canvas);
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
              document.body.style.overflow = "hidden";
              document.body.style.touch_action = "none";
              $location.hash(canvasObj.id);
              $anchorScroll();
              document.body.style.position = "fixed";
              document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0");
          }
            
          if(avatars.exitFullScreen()) {
              $scope.isFullScreen = false;
              console.log("exit fullscreen");
              //$("#"+canvasObj.id).before($("#swap"));
             // $("#"+canvasObj.id).before($("#swap"));
             // $("#swap").before$($("#"+canvasObj.id));
              //console.log("cvs: " + document.getElementById(canvasObj.id));
             //document.getElementById("swap").parentElement.insertBefore(document.getElementById(canvasObj.id), document.getElementById("swap"));
              //swapEl.parentElement.insertBefore(canvas, swapEl);
              //document.getElementById("swap").beforebegin(document.getElementById(canvasObj.id));
              scene.activeCamera.detachControl(canvas);
              document.body.style.overflow = "visible";
              document.body.style.touch_action = "auto";
              document.body.style.position = "static";
              document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1.0");
              canvasObj.isFullScreen = false;
              avatars.setExitFullScreen(false);
              isAlreadyFullScreen = false;
          }
          document.body.style.backgroundColor = "#33334d";
          scene.render();
      });

      function resize() {
        if(canvasObj.isFullScreen) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        engine.resize();
      }
      // Resize
      window.addEventListener("resize", resize);
    }
    $scope.isFullScreen = false;
    avatars.push("aCanvas", false);
    $scope.start(avatars.get(0));
    $scope.fullScreen = function(canvasId) {
        $scope.isFullScreen = true;
        avatars.setFullScreen(avatars.index(canvasId), true);
    }
    $scope.exit = function() {
        console.log("exitohohohj");
        avatars.setExitFullScreen(true);
    }*/
}]);