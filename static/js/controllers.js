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

mailView.controller('inboxCtrl', ['$scope', 'code', 'request', 'messages', '$filter', function($scope, code, request, messages, $filter) {
	$scope.messages = messages.messages;
	$scope.totalCount = messages.totalCount;
	$scope.$on('messages.update', function(event) {
		$scope.messages = messages.messages;
		$scope.totalCount = messages.totalCount;
	});
	$scope.deleteMail = function(index) {
		$scope.messages.splice(index, 1);
	} 
	$scope.cleanupEmail = code.cleanupEmail;
	$scope.htmlEncode = code.htmlEncode;
	$scope.encodeBody = code.encodeBody;

	$scope.unreadOnchange = function() {
		request({action: 'getFolder', folder: 1, page: 1, unread: $scope.unreadCheckbox ? true : false}, function(data, header) {
			$scope.messages = messages.messages = data.messages;
			$scope.totalCount = messages.totalCount = data.count;
		});
	}

	$scope.prePage = function() {
		if ($scope.page === 1) {
			return;
		} else {

		}

	}

	$scope.nextPage = function() {
		if ($scope.page === Math.ceil($scope.messages.length / 10)) {
			return;
		} else {
			request({action: 'getFolder', folder: 1, page: 1, fnCallback: callback});
		}

		function callback(content, data) {

		}
	}


}]);

mailView.controller('readMailCtrl', ['$scope', function($scope) {
	
}]);

mailView.controller('composeMailCtrl', ['$scope', function($scope) {
	
}]);