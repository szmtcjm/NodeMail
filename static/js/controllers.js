var mailView = angular.module('mailView', ['ngRoute', 'mailServices']);
mailView.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/inbox', {
        	templateUrl: 'partials/inbox.html',
        	controller: 'inboxCtrl'
        }).
		when('/readMail', {
			templateUrl: 'partials/readMail.html',
        	controller: 'readMailCtrl'
		}).
		when('/compose', {
			templateUrl: 'partials/compose.html',
        	controller: 'composeMailCtrl'
		}).
		otherwise({redirectTo: '/inbox'});
}]);

mailView.controller('filesCtrl', ['$scope', 'messages', '$http', function($scope, messages, $http) {
	$scope.refreshInbox = function() {
		messages.refresh('1', '1');
		console.log(1)
	}

	$scope.refreshInbox();
}]);

mailView.controller('inboxCtrl', ['$scope', 'code', 'request', 'messages', function($scope, code, request, messages) {
	$scope.messages = messages.messages;
	$scope.$on('messages.refresh', function(event) {
		$scope.messages = messages.messages;
	});
	setTimeout(function() {console.log(messages.messages)}, 4000);
	$scope.deleteMail = function(index) {
		$scope.messages.splice(index, 1);
	} 
	$scope.cleanupEmail = code.cleanupEmail;
	$scope.htmlEncode = code.htmlEncode;
	$scope.encodeBody = code.encodeBody;
}]);

mailView.controller('readMailCtrl', ['$scope', function($scope) {
	
}]);

mailView.controller('composeMailCtrl', ['$scope', function($scope) {
	
}]);