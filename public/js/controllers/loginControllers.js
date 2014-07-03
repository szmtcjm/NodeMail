loginModule.controller('buttonControllers', [

	function() {

	}
]);

loginModule.controller('signinController', [

	function() {}
]);

loginModule.controller('registerController', ['$scope', '$http',
	function($scope, $http) {
		var oldusername;
		$scope.valid = {};

		$scope.submitClass = {
			button: true,
			submit: true,
			disabled: !regForm.$valid
		};
		$scope.submitForm = function() {
			alert(1);
		}
		$scope.verifyUsername = function() {
			if ($scope.account.username === '' ||
				$scope.account.username === oldusername) {
				return;
			}
			$scope.valid.verifying = true;
			$http.get('/verifyUsername', {
				params: {
					username: $scope.account.username
				}
			}).
			success(function(data, status, headers, config) {
				setTimeout(function() {
					$scope.valid.usernameExisted = false;
				}, 3000);
				$scope.valid.verifying = false;
				oldusername = $scope.account.username;
				if (data.existed) {
					$scope.valid.usernameExisted = true;
					$scope.valid.usernameValid = false;
				} else {
					$scope.valid.usernameValid = true;
				}
			}).
			error(function(data, status, headers, config) {
				$scope.valid.verifying = false;
				$scope.valid.usernameValid = false;
			});
		}
		$scope.verifyConfPassword = function() {
			$scope.valid.confPasswordvalid =
				($scope.regForm.loginPasswordConfirm.$valid &&
				$scope.account.password === $scope.account.confirmPassword);
		}
	}
]);