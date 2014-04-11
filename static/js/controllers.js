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

mailView.controller('filesCtrl', ['$scope', 'messages', '$http', 'request', '$window', function($scope, messages, $http, request, $window) {
	$scope.clickInbox = function() {
		messages.folder = '1';
		messages.refresh('1', '1');
	};
	$scope.clickTrash = function() {
		messages.folder = '2';
		messages.refresh('2', '1');
	};

	$scope.emptyTrash = function() {
		if($window.confirm('是否清空？')) {
			messages.emptyTrash();
		}
	}
	messages.refresh('1', '1');
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

	$scope.restoreMail = function(index) {
		request({action: 'restoreMail', id: $scope.messages[index]['message-id'], folder: '2', page: $scope.currentPage, unread: $scope.unreadCheckbox ? true : false}, callback);
	}
	
	$scope.unreadOnchange = function() {
		request({action: 'getFolder', folder: messages.folder, page: 1, unread: $scope.unreadCheckbox ? true : false}, callback);
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
		if ($scope.currentPage === Math.ceil($scope.messageCount / 10)) {
			return;
		} else {
			$scope.currentPage ++;
			request({action: 'getFolder', folder: '1', page: $scope.currentPage, unread: $scope.unreadCheckbox ? true : false}, callback);
		}
	}

	if (messages.folder === '1') {
		$scope.folder = '收件箱';
		$scope.operateMail = $scope.deleteMail;
		$scope.imgSrc = 'icon_delete.gif';
	} else {
		$scope.folder = '垃圾箱';
		$scope.operateMail = $scope.restoreMail;
		$scope.imgSrc = 'icon_restore.gif';
	}

	$scope.$on('messages.changeFolder', function(event) {
		if (messages.folder === '1') {
			$scope.folder = '收件箱';
			$scope.operateMail = $scope.deleteMail;
			$scope.imgSrc = 'icon_delete.gif';
		} else {
			$scope.folder = '垃圾箱';
			$scope.operateMail = $scope.restoreMail;
			$scope.imgSrc = 'icon_restore.gif';
		}
	});
	function callback(data) {
		$scope.messages = messages.messages = data.messages;
		$scope.messageCount = messages.messageCount = data.messageCount;
	}
	
}]);

mailView.controller('readMailCtrl', ['$scope', function($scope) {
	
}]);

mailView.controller('composeMailCtrl', ['$scope', function($scope) {
	
}]);