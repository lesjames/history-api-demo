# HTML5 History API Demo

This is a demo based off of a [demo page](http://html5doctor.com/demos/history/) created by [Mike Robinson](https://twitter.com/akamike) for an [HTML5 Doctor article](http://html5doctor.com/history-api/). Images are courtesy of [placekitten](http://placekitten.com/).

## Guard your code

First thing we need to do is guard our code against older browsers that don't support the HTML5 history API. This is a simple guard and won't protect you from the dragons that lurk in Android 2 and iOS 4 which claim support but are really filthy liars. Let's also set up a [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) to encapsulate our code.

```
if (window.history && 'pushState' in history) {
    (function () {
        'use strict';
        
        // code goes here
        
    }());
}
```