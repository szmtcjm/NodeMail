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
	$scope.cleanupEmail = code.cleanupEmail;
	$scope.htmlEncode = code.htmlEncode;
	$scope.encodeBody = code.encodeBody;
	$scope.messages = messages.messages;
	$scope.messageCount = messages.messageCount;
	$scope.currentPage = 1;
	$scope.$on('messages.update', function(event) {
		$scope.messages = messages.messages;
		$scope.messageCount = messages.messageCount;
	});
	$scope.deleteMail = function(index) {
		request({action: 'deleteMail', id: $scope.messages[index]['message-id'], folder: '1', page: $scope.currentPage, unread: $scope.unreadCheckbox ? true : false}, callback);
	} 
	
	$scope.unreadOnchange = function() {
		request({action: 'getFolder', folder: '1', page: 1, unread: $scope.unreadCheckbox ? true : false}, callback);
		$scope.currentPage = 1;
	}

	$scope.prePage = function() {
		if ($scope.currentPage === 1) {
			return;
		} else {
			$scope.currentPage --;
			request({action: 'getFolder', folder: '1', page: $scope.currentPage, unread: $scope.unreadCheckbox ? true : false}, callback);
		}

	}

	$scope.nextPage = function() {
		if ($scope.currentPage === Math.ceil($scope.messageCount / 2)) {
			return;
		} else {
			$scope.currentPage ++;
			request({action: 'getFolder', folder: '1', page: $scope.currentPage, unread: $scope.unreadCheckbox ? true : false}, callback);
		}
	}

	function callback(data) {
		$scope.messages = data.messages;
		$scope.messageCount = messages.messageCount = data.messageCount;
	}
	$scope.folder = '收件箱';
}]);

mailView.controller('readMailCtrl', ['$scope', function($scope) {
	
}]);

mailView.controller('composeMailCtrl', ['$scope', function($scope) {
	
}]);