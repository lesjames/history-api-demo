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

Now that links are disabled, we need to bring in the pages they link to through AJAX. Let's make a request deferred and set up done and fail methods on it. We'll build the success code in a minute, but be sure to handle a request failure. We are simply going to force the page to navigate to the link's url if something goes wrong.

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