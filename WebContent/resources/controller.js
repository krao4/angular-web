var app = angular.module('SpringAppModule', []);


app.service('authService', function(){

	  var user = {};
	  user.role = sessionStorage.getItem('user');
	  return{
	    getUser: function(){
	      return user;
	    },
	    generateRoleData: function(){
	      /* this is resolved before the router loads the view and model */
	      /* ... */
	    }
	  }
	});

app.directive('restrict', function(authService){
	    return{
	        restrict: 'A',
	        prioriry: 100000,
	        scope: false,
	        link: function(){
	            // alert('ergo sum!');
	        },
	        compile:  function(element, attr, linker){
	            var accessDenied = true;
	            var user = authService.getUser();
	           
	            var attributes = attr.access.split(" ");
	            for(var i in attributes){
	                if(user.role == attributes[i]){
	                    accessDenied = false;
	                }
	            }

	            if(accessDenied){
	                element.children().remove();
	                element.remove();           
	            }

	        }
	    }
	});


app.controller("appcontroller", function ($scope, $http) {
	var userkey = "user";
	
	
	
  	$scope.gotoUser = 
		function(user){
  			window.location.href = '/angularapp/user/admin.html'
  			sessionStorage.setItem(userkey, user);
		}
  	$scope.gotoAdmin = 
		function(user){
  			window.location.href = '/angularapp/user/admin.html';
  			sessionStorage.setItem(userkey, user);
		} 
  	$scope.gotoPolicy = 
		function(){
  			window.location.href = '/angularapp/policy/list.html';
		}
  	$scope.gotoCustomer = 
		function(){
  			window.location.href = '/angularapp/customer/list.html';
		}
  	$scope.gotoIntegration = 
		function(){
  			window.location.href = '/angularapp/integration/list.html';
		}  	
	

	$http.get("/VOYAAPP/policy", { headers: { 'Accept': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } }).success(
			function(response) {
				$scope.policies = response;
			}
		);
	
	$http.get("/VOYAAPP/customer", { headers: { 'Accept': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } }).success(
			function(response) {
				$scope.customers = response;
			}
		);	
	
	$scope.onDeletePolicy = 
		function(id) {
			$http.delete("/VOYAAPP/policy/"+id, { headers: { 'Content-Type': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } }).success(
				function() {
					$http.get("/VOYAAPP/policy", { headers: { 'Accept': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } }).success(
							function(response, status) {
								$scope.policies = response;
							}
						)
				}
			).error (
					function(response, status) {
						if(status===403) {
							$scope.errorText = "Access Denied!";						}
					}
			);
		}
			
  	$scope.onSubmitLoadBlogs = 
		function(){
  			$http.get("/VOYAAPP/blogs", { headers: { 'Accept': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } }).success(
	  			function(response) {
  					alert("Blogs loaded in file!");
  				}
  			);
		};
		

	$scope.onSubmitConvTemp = 
			function(){
				$http.get("/VOYAAPP/tempconv/"+$scope.temp, { headers: { 'Accept': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } } ).success(
	  			function(response) {
						$scope.convertedTempVal = response;
					}
				);
		};
		
	
	$scope.logout = 
		function() {
			$http.get("/VOYAAPP/userservice/logout", { headers: { 'Accept': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } }).success(
					function(response){
						$scope.logoutMessage = "The user has been logged out!";
					}
			);
	};
	
	$scope.cleanPolicyCache = 
		function() {
			$http.get("/VOYAAPP/policy/cleanCache", { headers: { 'Accept': 'application/json', 'SM_USER':sessionStorage.getItem(userkey) } }).success(
					function(response){
						
					}
			);
	};	
	
});