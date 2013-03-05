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

Let's jump out of our click handler and create a function that will create a state object for us. We'll pass it the HTML from our page. It will pick that HTML apart and store the info we want in an object. We are going to store the page content, title and photo source in the history we create. Finally, we'll return that state object so that we can use it later.

```javascript
// create a state object from html
function createState(html) {

    // create a jQuery selection
    var $page = $(html);

    // create state object
    var state = {
        content : $page.find('.content').html(),
        photo : $page.find('.photo').attr('src'),
        title : $page.filter('title').text()
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

Inside of our AJAX success method let's use the new functions we just wrote to create a state and use it to change the content of the page.

```javascript
// what to do with ajax success
req.done(function (data) {

    // create state object
    var state = createState(data);

    // change the page content
    displayContent(state);

});
```

We are almost there. We have changed the content of the page after requesting new content through AJAX. We just need to update our page URL to reflect that change. Time to use pushState! Let's add it to the end of our success method. Remember that pushState takes three arguments; state object, page title, url.

```javascript
// what to do with ajax success
req.done(function (data) {

    // create state object
    var state = createState(data);

    // change the page content
    displayContent(state);

    // push the state into history
    history.pushState(state, state.title, evt.target.href);
    
});
```