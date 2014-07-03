loginModule.controller('buttonControllers', [

	function() {

	}
]);

loginModule.controller('signinController', [

	function() {}
]);

loginModule.controller('registerController', ['$scope', '$http',
	function($scope, $http) {
		$scope.submitClass = {
			button: true,
			submit: true,
			disabled: !regForm.$valid
		};
		$scope.submitForm = function() {
			alert(1);
		}
		$scope.verifyUsername = function() {
			$scope.verifying = true;
			$http.get('/verifyUsername', {
				params: {
					username: $scope.username
				}
			}).
			success(function(data, status, headers, config) {
				if (data.existed) {
					$scope.usernameExisted = true;
				}
				setTimeout(function() {
					$scope.usernameExisted = false;
				}, 3000);
			}).
			error(function(data, status, headers, config) {

			}).
			finally(function() {
				$scope.verifying = false;
			});
		}
	}
]);