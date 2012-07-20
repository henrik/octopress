---
title: jQuery in GreaseKit
categories: [JavaScript, jQuery, Userscripts, Greasemonkey, GreaseKit]
date: 2009-07-21 19:05
layout: post
comments: true
---

When writing [userscripts](http://en.wikipedia.org/wiki/Greasemonkey), I almost always want to include the [jQuery](http://jquery.com/) lib.

Since version 0.8.0 of Greasemonkey, you can use `@require` as [described e.g. here](http://www.keyvan.net/2008/10/greasemonkey-jquery/). But if you use other userscript engines like [GreaseKit](http://8-p.info/greasekit/) for Safari/WebKit (works fine in Safari 4, by the way), you can't use `@require`.

Rather than [polling](http://joanpiedra.com/jquery/greasemonkey/), you can do this:

``` javascript
function jQueryIsReady($) {

  $("#foo").text("bar");

}


// -----------------------------------------------------------------
// Greasemonkey/GreaseKit compatibility
// -----------------------------------------------------------------

if (typeof(unsafeWindow) === 'undefined') {
 unsafeWindow = window;
}

// -----------------------------------------------------------------
// jQuery
// -----------------------------------------------------------------

var script = document.createElement('script');
script.src = 'http://jquery.com/src/jquery-latest.js';
script.type = 'text/javascript';
script.addEventListener("load", function() {
  unsafeWindow.jQuery.noConflict();
  jQueryIsReady(unsafeWindow.jQuery);
}, false);
document.getElementsByTagName('head')[0].appendChild(script);
```

See it in the context of [a real userscript](http://userscripts.org/scripts/review/4169).

Many thanks to [Johan Sundström](http://ecmanaut.blogspot.com/) who did most of the work figuring this out.
