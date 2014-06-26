var loginModule = angular.module('loginModule', ['ngRoute', 'ngAnimate']);

loginModule.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/login', {
			templateUrl: 'partials/loginbuttons.html',
			controller: 'buttonControllers'
		}).
		when('/signin', {
			templateUrl: 'partials/signin.html',
			controller: 'signinController'
		}).
		when('/register', {
			templateUrl: 'partials/register.html',
			controller: 'registerController'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);