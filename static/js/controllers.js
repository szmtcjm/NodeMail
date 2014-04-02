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

mailView.controller('inboxCtrl', ['$scope', 'code', 'request', function($scope, code, request) {
	$scope.messages = [{from: 'cjm', subject: 'fuck', date: '2014-04-01'}, 
					   {from: 'cjm2', subject: 'fuck2', date: '2014-04-02'}];
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