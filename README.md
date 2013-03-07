# HTML5 History API Demo

This is a demo based off of a [demo page](http://html5doctor.com/demos/history/) created by [Mike Robinson](https://twitter.com/akamike) for an [HTML5 Doctor article](http://html5doctor.com/history-api/). Images are courtesy of [placekitten](http://placekitten.com/).

## Step 1: Guard your code

First thing we need to do is guard our code against older browsers that don't support the HTML5 history API. This is a simple guard and won't protect you from the dragons that lurk in Android 2 and iOS 4 which claim support but are really filthy liars. Let's also set up a [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) to encapsulate our code.

```javascript
if (window.history && 'pushState' in history) {
    
    // encapsulate with an IIFE
    (function () {

        'use strict';
        
        // the rest of our code goes here
        
    }());

}
```

## Step 2: Hijack your links

We need to disable the links we want to use pushState for so the browser doesn't do a hard refresh when clicking on them.

```javascript
$(document).on('click', 'a', function (evt) {

    // prevent normal navigation    
    evt.preventDefault();
    
}
```

## Step 3: AJAX our links

Now that links are disabled, we need to bring in the pages they link to through AJAX. Let's make a request deferred and set up done and fail methods on it. We'll build the success code in a couple minutes, but be sure to handle a request failure. We are simply going to force the page to navigate to the link's url if something goes wrong.

```javascript
$(document).on('click', 'a', function (evt) {

    // prevent normal navigation
    evt.preventDefault();

    // request new page through ajax
    var req = $.ajax(this.href);

    // what to do with ajax success
    req.done(function (data) {

        // success code goes here

    });

    // what to do if ajax fails
    req.fail(function () {

        // revert to normal navigaiton
        document.location = evt.target.href;

    });

});
```

## Step 4: Make a state object

Let's jump out of our click handler and create a function that will create a state object for us. We'll pass it a jQuery section of the HTML from our page. It will pick that HTML apart and store the info we want in an object. We are going to store the page content, title and photo source in the history we create. Finally, we'll return that state object so that we can use it later.

```javascript
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
```

## Step 5: Handle display change

We now have the info we need, which is stored in a state object, to update our page. Lets add another function to handle the display change. We are going to send it our newly created state object.

```javascript
function displayContent(state) {

    // change the page title
    document.title = state.title;

    // replace the current content
    $('.content').html(state.content);
    $('.photo').attr('src', state.photo);

}
```

## Step 6: AJAX success

Inside of our AJAX success method let's use the new functions we just wrote to create a state and use it to change the content of the page. Remember to pass our AJAX data as a jQuery selection.

```javascript
// what to do with ajax success
req.done(function (data) {

    // create state object
    var state = createState($(data));

    // change the page content
    displayContent(state);

});
```

We are almost there. We have changed the content of the page after requesting new content through AJAX. We just need to update our page URL to reflect that change. Time to use pushState! Let's add it to the end of our success method. Remember that pushState takes three arguments; state object, page title, url.

```javascript
// what to do with ajax success
req.done(function (data) {

    // create state object
    var state = createState($(data));

    // change the page content
    displayContent(state);

    // push the state into history
    history.pushState(state, state.title, evt.target.href);
    
});
```

## Step 7: Forward/Back buttons

Now that we are navigating and creating history as we go, we need to handle what happens if we go back in time. The browser forward and back buttons fire and event called 'popstate'. That event gets passed to it whatever we stored in the state object. Since that object has all the information we need to update the page let's just send it to our display function.

```javascript
// handle forward/back buttons
window.onpopstate = function(evt) {

    // get the state and change the page content
    displayContent(evt.state);

};
```

This poses a slight problem though. Chrome fires the popstate event on page load. So this code will fire on your initial page load and try to pass an empty state object to our display function. This will cause and error because our function expects there to be data in that state object. Let's guard against this by adding a check for the state object.

```javascript
// handle forward/back buttons
window.onpopstate = function(evt) {
    
    // chrome inits with popstate so check for state
    if (evt.state) {
        // get the state and change the page content
        displayContent(evt.state);    
    }

};
```

## Step 8: Handle the first page

So far we have been creating history when someone clicks on a link. This poses one final problem for us. What happens when the back button gets back to the first page. That page doesn't have a state object stored with it, because we didn't use an internal link to get there. This is where replaceState steps in. On page load, we need to replace our history entry for that page with a state object containing that's pages content. Before the end of our IIFE let's create a state object and load it into history with replaceState.

```javascript
// create state on page init and replace the current history with it
var state = createState( $('title, body') );
history.replaceState(state, document.title, document.location.href);
```

## Step 9: Profit!

To this point we have simply been recreating everything the browser does on it's own. We are requesting the content of a link, displaying the content of that link and recording a record of the previous page in our history. All this work for what is essentially, exactly the same experience. However with our new AJAX and pushState foundation we can now animate the differce between pages. This is something you just can't do with hard page refreshes. We are going to use CSS transtions to animate our content in and out. In our CSS let's add some transition and transform styles.

```css
.wrapper {
	-webkit-transition: all .5s ease-in-out;
}
.transition-out {
	opacity: 0;
	-webkit-transform: scale(.75) rotate(-10deg);
}
.transition-in {
	opacity: 0;
	-webkit-transform: scale(1.25) rotate(10deg);
}

```

Now let's play with our displayContent function. Remove the previous code that switched our content and photo. Let's clone our `.wrapper` element and change the content inside that clone.

```javascript
// clone the current wrapper
var $clone = $('.wrapper').clone();

// replace the content in the clone
$clone.find('.content').html(state.content);
$clone.find('.photo').attr('src', state.photo);
```

Now let's append our clone and transition content out with our classes. On our old `.wrapper` let's add a one time event listener for when the transition out has finished. When that event fires we are going to remove the old content from the DOM.

```javascript
$('.wrapper')

    // add transition class to current wrapper
    .addClass('transition-out')

    // append clone after current wrapper and add a transition class
    .after($clone.addClass('transition-in'))

    // when finished animating remove old wrapper
    .one('webkitTransitionEnd', function () {
        $(this).remove();
    });
```

That handles our old content. With our new content ready and waiting we just need to remove the transtion class to trigger the animation. We want to give the old content a little time to get out of the way so we'll remove the class after a short timeout.

```javascript
// animate new content in after short delay
setTimeout(function () {
    $clone.removeClass('transition-in');
}, 200);
```

## Step 10: A finishing touch

Our content now animates in and out as we navigate through our site. It makes sense that hitting the back button should reverse that content transition. So let's reverse the transition classes if our displayContent function gets fired from the popstate event. Let's add a second argument to the function call in the popstate event. We'll use a truthy value to trigger a reverse transition.

```javascript
// handle forward/back buttons
window.onpopstate = function(evt) {
    
    // chrome inits with popstate so check for state
    if (evt.state) {
        // get the state and change the page content
        displayContent(evt.state, true);    
    }

};
```

Now let's check for that truthy value and use a turnary statment to switch our classes. Here is the final display function.

```javascript
function displayContent(state, reverse) {

    // change the page title
    document.title = state.title;

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
```