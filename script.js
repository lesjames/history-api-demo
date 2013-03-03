if (window.history && 'pushState' in history) {

	(function (){
	
		"use strict";
		
		function loadPage(href) {
			return $.ajax(href);
		}
		
		function displayContent(state, reverse) {	
			if (state === null) { return; } 

			document.title = state.title;
			//$('.content').html(state.content);
			//$('.photo').attr('src', state.photo);
			
			var $clone = $('.wrapper').clone();
			$clone.find('.content').html(state.content);
			$clone.find('.photo').attr('src', state.photo);
			
			$('.wrapper')
				.addClass((reverse) ? 'transition-in' : 'transition-out')
				.after($clone.addClass((!reverse) ? 'transition-in' : 'transition-out'))
				.one('webkitTransitionEnd', function () {
					$(this).remove();
			});
			
			setTimeout(function () {
				$clone.removeClass((!reverse) ? 'transition-in' : 'transition-out');
			}, 200);		
			
		}
		
		function createState(html) {
			var $page = $(html);
			var state = {
				content : $page.find('.content').html(),
				photo : $page.find('.photo').attr('src'),
				title : $page.filter('title').text()
			};
			return state;
		}
		
		// handle click on link
		$(document).on('click', 'a', function (e) {
			
			e.preventDefault();
					
			var req = loadPage(this.href);
			req.done(function (data) {
							
				var state = createState(data);
				displayContent(state);			
				history.pushState(state, state.title, e.target.href);
							
			});
		
		});
		
		// handle forward/back buttons
		window.addEventListener('popstate', function(e) {
			displayContent(e.state, true);
		});
		
		// handle init page load
		var state = createState($('html').html());
		history.replaceState(state, document.title, document.location.href);
	
	}());

}