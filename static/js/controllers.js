var mailView = angular.module('mailView', ['ngRoute', 'mailServices', 'ngCookies', 'tipbox']);
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

mailView.controller('filesCtrl', ['$scope', 'messages', '$http', 'request', '$window', '$rootScope', function($scope, messages, $http, request, $window, $rootScope) {
	$scope.clickInbox = function() {
		messages.folder = '1';
		$rootScope.$broadcast('messages.changeFolder');
	};
	$scope.clickTrash = function() {
		messages.folder = '2';
		$rootScope.$broadcast('messages.changeFolder');
	};

	$scope.emptyTrash = function() {
		if($window.confirm('是否清空？')) {
			request({action: 'emptyTrash'}, function() {
                if (messages.folder === '2') {
                    messages.messages = [];
                    messages.messageCount = 0;
                    $rootScope.$broadcast('messages.update');
                } 
            });
		}
	}
}]);

mailView.controller('inboxCtrl', ['$scope', 'code', 'request', 'messages', '$filter', '$window', '$cookieStore', function($scope, code, request, messages, $filter, $window, $cookieStore) {
	$scope.cleanupEmail = code.cleanupEmail;
	$scope.htmlEncode = code.htmlEncode;
	$scope.encodeBody = code.encodeBody;

	$scope.$on('messages.changeFolder', function(event) {
		$scope.currentPage = 1;
		setFolder();
		request({action: 'getFolder', 
				folder: $scope.folder, 
				page: $scope.currentPage, 
				unread: false}, 
				setMessages);
	});

	$scope.$on('messages.update', function(event) {
		$scope.currentPage = 1;
		setMessages();
	});

	$scope.deleteMail = function(index) {
		request({action: 'deleteMail',
				id: $scope.messages[index]['message-id'], 
				folder: '1', 
				page: $scope.currentPage, 
				unread: $scope.unreadCheckbox ? true : false}, 
				setMessages);
	} 

	$scope.restoreMail = function(index) {
		request({action: 'restoreMail', 
				id: $scope.messages[index]['message-id'], 
				folder: '2', 
				page: $scope.currentPage, 
				unread: $scope.unreadCheckbox ? true : false}, 
				setMessages);
	}
	
	$scope.unreadOnchange = function() {
		request({action: 'getFolder', 
				folder: messages.folder, 
				page: 1, 
				unread: $scope.unreadCheckbox ? true : false}, 
				setMessages);
	}
	$scope.prePage = function() {
		if ($scope.currentPage === 1) {
			return;
		} else {
			$scope.currentPage--;
			request({action: 'getFolder', 
					folder: '1', 
					page: $scope.currentPage, 
					unread: $scope.unreadCheckbox ? true : false}, 
					setMessages);
		}
	}
	$scope.nextPage = function() {
		if ($scope.currentPage === Math.ceil($scope.messageCount / 15)) {
			return;
		} else {
			$scope.currentPage++;
			request({action: 'getFolder', 
					folder: '1', 
					page: $scope.currentPage, 
					unread: $scope.unreadCheckbox ? true : false}, 
					setMessages);
		}
	}
	$scope.readMail = function(index) {
		messages.readMail = messages.messages[index];
		request({action: 'readMail', 
				id: messages.readMail['message-id'], 
				unread: messages.readMail.unread});
	}

	var setFolder = function() {
		if (messages.folder === '1') {
			$scope.folder = '1';
			$scope.folderName = '收件箱';
			$scope.operateMail = $scope.deleteMail;
			$scope.imgSrc = 'icon_delete.gif';
			$cookieStore.put('folder', '1');
		} else {
			$scope.folder = '2';
			$scope.folderName = '垃圾箱';
			$scope.operateMail = $scope.restoreMail;
			$scope.imgSrc = 'icon_restore.gif';
			$cookieStore.put('folder', '2');
		}
	};

	var setMessages = function(data) {
		if (data) {
			messages.messages = data.messages;
			messages.messageCount = data.messageCount;
		}
		$scope.messages = messages.messages;
		$scope.messageCount = messages.messageCount;
		$scope.totalPage = Math.ceil($scope.messageCount / 15);
		$cookieStore.put('currentPage', $scope.currentPage);
	}

	$scope.folder = messages.folder = $cookieStore.get('folder') || '1';
	$scope.currentPage = messages.currentPage = parseInt($cookieStore.get('currentPage')) || 1;
	setFolder();
	request({action: 'getFolder', 
		folder: $scope.folder, 
		page: $scope.currentPage, 
		unread: $scope.unreadCheckbox ? true : false}, 
		setMessages
		);
	$scope.showTipbox = [];
	$scope.mouseOverFrom = function(index) {
		$scope.showTipbox[index] = true;
	}
	$scope.mouseLeaveFrom = function(index) {
		$scope.showTipbox[index] = false;
	}

}]);

mailView.controller('readMailCtrl', ['$scope', 'messages', function($scope, messages) {
	$scope.readMail = messages.readMail;
}]);

mailView.controller('composeMailCtrl', ['$scope', function($scope) {
	
}]);

mailView.controller('noticeCtrl', ['$scope', 'notice', function($scope, notice) {
	$scope.notice = notice.noticeString;
	$scope.noticeClass = '';
	$scope.$on('notice', function(event) {
		$scope.notice = notice.noticeString;
		if (notice.noticeString) {
			$scope.noticeClass = 'alert alert-warning';
		} else {
			$scope.noticeClass = '';
		}
	});
}]);