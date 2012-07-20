---
wordpress_id: 255
title: Getting rid of border-bottom on linked images with jQuery
categories:
- JavaScript
- CSS
- jQuery
date: 2008-11-04 23:37
layout: post
comments: true
---
When styling links with CSS, using something like <code>border-bottom: 1px solid #f00</code> instead of <code>text-decoration: underline</code> means more control over spacing, style (solid, dashed, dotted) and color. You might even use a background image for a fancy graphic underline.

With <code>text-decoration</code>, linked images won't get an underline unless there's text in the same link. But with <code>border-bottom</code>, they always get the border.

Since the border is on the <code>a</code> element, not the image, you have to somehow find the <code>a</code> elements based on their descendants. To my knowledge there is no CSS-only solution for that in modern browsers. Please let me know if I'm wrong.

The solution is simple with jQuery:

``` javascript
$(function() { $('a:has(img)').addClass('image'); });
```

When the DOM becomes available, all links containing images get the <code>image</code> class. You can then easily style them:

``` css
a { border-bottom: 1px solid #f00; }
a.image { border-bottom: none; }
```

See it in action on <a href="http://blog.johannaost.com">my girlfriend's new blog</a>.

Since the page will still work fine without JavaScript, only look a little less attractive, I think this solution is quite acceptable, though a CSS-only solution would be better still.
