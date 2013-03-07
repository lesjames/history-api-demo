// guard against browsers w/o pushState (beware Android 2 & iOS 4)
if (window.history && 'pushState' in history) {

    // encapsulate with an IIFE
    (function () {

        // because JSHint told me to
        'use strict';

        function displayContent(state, reverse) {

            // chrome inits with popstate
            // so bail out if state is null
            if (state === null) { return; }

            // change the page title
            document.title = state.title;

            // replace the current content
            //$('.content').html(state.content);
            //$('.photo').attr('src', state.photo);

            // clone the current wrapper
            var $clone = $('.wrapper').clone();

            // replace the content in the clone
            $clone.find('.content').html(state.content);
            $clone.find('.photo').attr('src', state.photo);

            $('.wrapper')

                // add transition class to current wrapper
                .addClass((!reverse) ? 'transition-out' : 'transition-in')

                // append clone after current wrapper and add a transition class
                .after($clone.addClass((!reverse) ? 'transition-in' : 'transition-out'))

                // when finished animating remove old wrapper
                .one('webkitTransitionEnd', function () {
                    $(this).remove();
                });

            // animate new content in after short delay
            setTimeout(function () {
                $clone.removeClass((!reverse) ? 'transition-in' : 'transition-out');
            }, 200);

        }

        // create a state object from html
        function createState($content) {

            // create state object
            var state = {
                content : $content.find('.content').html(),
                photo : $content.find('.photo').attr('src'),
                title : $content.filter('title').text()
            };

            // return the object
            return state;
        }

        // handle click on link
        $(document).on('click', 'a', function (evt) {

            // prevent normal navigation
            evt.preventDefault();

            // request new page through ajax
            var req = $.ajax(this.href);

            // what to do with ajax success
            req.done(function (data) {

                // create state object
                var state = createState($(data));

                // change the page content
                displayContent(state);

                // push the state into history
                history.pushState(state, state.title, evt.target.href);

            });

            // what to do if ajax fails
            req.fail(function () {

                // revert to normal navigaiton
                document.location = evt.target.href;

            });

        });

        // handle forward/back buttons
        window.onpopstate = function(evt) {

            // get the state and change the page content
            displayContent(evt.state, true);

        };

        // create state on page init and replace the current history with it
        var state = createState( $('title, body') );
        history.replaceState(state, document.title, document.location.href);

    }());

}