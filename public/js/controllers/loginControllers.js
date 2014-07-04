loginModule.controller('buttonControllers', [

	function() {

	}
]);

loginModule.controller('signinController', ['$scope', '$http',
	function($scope, $http) {
		$scope.account = {
			username: '',
			password: ''
		}
		$scope.submit = function() {
			$http.post('/login', $scope.account).
			success(function(data) {
				if (!data.success) {
					showError($scope, data.message);
				} else {
					location.href = '/pages/index.html';
				}
			}).
			error(function(data) {
				showError($scope, data);
			});
		}
	}
]);

loginModule.controller('registerController', ['$scope', '$http', '$location',
	function($scope, $http, $location) {
		var oldusername;
		$scope.account = {
			username: '',
			password: ''
		};
		$scope.valid = {
			username: false,
			password: false,
			confirmPassword: false,
			verifying: false,
		};
		$scope.focus = {
			username: false,
			password: false,
			confirmPassword: false
		};

		$scope.submit = function() {
			$http.post('/register', $scope.account).
			success(function(data) {
				if (!data.success) {
					showError($scope, data.msg);
				} else {
					location.href = '/pages/regsuccess.html';
				}
			}).
			error(function(data) {
				showError($scope, data);
			});
		}
		$scope.verifyUsername = function() {
			$scope.focus.usermaneFocus = false;
			if ($scope.account.username === '' ||
				$scope.account.username === oldusername ||
				$scope.regForm.username.$invalid) {
				return;
			}
			$scope.valid.verifying = true;
			$http.get('/verifyUsername', {
				params: {
					username: $scope.account.username
				}
			}).
			success(function(data) {
				$scope.valid.verifying = false;
				oldusername = $scope.account.username;
				if (data.existed) {
					$scope.valid.username = false;
					showError($scope, 'The username is existed!');
				} else {
					$scope.valid.username = true;
				}
			}).
			error(function(data, status, headers, config) {
				$scope.valid.verifying = false;
				$scope.valid.username = false;
				showError($scope, data);
			});
		}
		$scope.verifyConfPassword = function() {
			$scope.valid.confPassword =
				($scope.regForm.loginPasswordConfirm.$valid &&
				$scope.account.password === $scope.account.confirmPassword);
		};
	}
]);

function showError($scope, errorMsg) {
	$scope.error = $scope.error ? $scope.error : {};
	$scope.error.errorMsg = errorMsg;
	$scope.error.showError = true;
	setTimeout(function() {
		$scope.error.showError = false;
	}, 3000);
}