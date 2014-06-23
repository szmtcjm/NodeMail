(function(window, angular, undefined) {
	angular.module('tipbox', []).
	directive('cTipbox', ['offset', function(offset) {
		var boxTemplater = '<div style="position:relative;"></div><tipbox><symbol1>&#9670;</symbol1><symbol2>&#9670;</symbol2><div ng-transclude></div></tipbox>';
		return {
			restrict: 'AE',
			transclude: true,
			template: boxTemplater,
			link: function(scope, iElement, iAttrs) {
				var o = offset(iElement.parent()[0]);
				console.log(o.top)
				console.log(o.left)
				var height = iElement.parent().css('height').replace(/[\d]+/, function(hi) {
					return o.top;
				});
				var width = iElement.parent().css('width').replace(/[\d]+/, function(wi) {
					return o.left;
				});
				iElement.find('tipbox').css({
					position: 'absolute',
					background: 'white',
					display: 'block',
					width: '200px',
					height: '200px',
					//top: height,
					//left: width,
					'z-index': '10',
					border: '1px solid black',
					'border-radius': '10px',
					'-moz-border-radius': '25px',
					'box-shadow': '2px 2px 3px #aaaaaa',
					'-moz-box-shadow': '2px 2px 3px #aaaaaa'
				});

				iElement.find('symbol1').css({
					display: 'block',
					width: '30px',
					height: '16px',
					'font-size': '29px',
					overflow: 'hidden',
					position: 'relative',
					'margin-left': '25%',
					'margin-top': '-15px',
					color: 'black'
				});
				iElement.find('symbol2').css({
					display: 'block',
					width: '30px',
					height: '16px',
					'font-size': '29px',
					overflow: 'hidden',
					position: 'relative',
					'margin-left': '25%',
					'margin-top': '-14px',
					color: 'white'
				});
			}
		};
	}]).
	factory('offset', [

		function() {
			return function(element) {
				var t = element.offsetTop;
				var l = element.offsetLeft;
				while (element = element.offsetParent) {
					t += element.offsetTop;
					l += element.offsetLeft;
				}

				return {
					left: l,
					top: t
				};
			}
		}
	]);
})(window, window.angular);