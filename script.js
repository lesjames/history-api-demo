if (window.history && 'pushState' in history) {

	(function (){
	
		"use strict";
		
		function loadPage(href) {
			var request = $.ajax({
				url : href
			});
			return request;
		}
		
		function displayContent(state) {	
			if (state === null) { return; } 
			document.title = state.title;
			$('#content').html(state.content);
			$('#photo').attr('src', state.photo);
		}
		
		function createState(html) {
			var $page = $(html);
			var state = {
				content : $page.find('#content').html(),
				photo : $page.find('#photo').attr('src'),
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
			displayContent(e.state);
		});
		
		// handle init page load
		var state = createState($('html').html());
		history.replaceState(state, document.title, document.location.href);
	
	}());

}