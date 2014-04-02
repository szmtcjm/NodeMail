var mailView = angular.module('mailView', ['mailServices']);
mailView.config('$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/inbox', {
        	templateUrl: 'partials/inbox.html',
        	controller: 'inboxCtrl'
        }).
		when('/readMail', {
			templateUrl: 'partials/readMail.html',
        	controller: 'readMailCtrl'
		}).
		when('/composeMail', {
			templateUrl: 'partials/composeMail.html',
        	controller: 'composeMailCtrl'
		}).
		otherwise({redirectTo: '/inbox'});
});

mailView.controller('inboxCtrl', ['$scope', 'code', function($scope, code) {
	$scope.messages = [];
	$scope.cleanupEmail = code.cleanupEmail;
	$scope.htmlEncode = code.htmlEncode;
	$scope.encodeBody = code.encodeBody;
}]);

mailView.controller('readMailCtrl', ['$scope', function($scope) {
	
}]);

mailView.controller('composeMailCtrl', ['$scope', function($scope) {
	
}]);