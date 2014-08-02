---
layout: post
title: "Font Awesome icons on file fields in WebKit"
date: 2014-08-02 11:45
comments: true
categories:
  - CSS
---

<img src="http://cl.ly/image/3z0s1C3N2b15/Image%202014-08-02%20at%2011.47.58%20am.png" alt="Screenshot" class="center">

I wanted to add a [Font Awesome icon](http://fortawesome.github.io/Font-Awesome/) to an `<input type="file">` field.

This is a private project that will only be used with WebKit browsers (e.g. Chrome or Mobile Safari), so **I have not considered cross-browser compatibility or fallbacks**.

You can position an element on top of the file field and pass clicks through as described e.g. [on QuirksMode.org](http://www.quirksmode.org/dom/inputfile.html), but it requires JavaScript for some things and gets complicated.

Keeping in mind that I only cared about WebKit browsers, I simply did this:

``` css
input[type=file]::-webkit-file-upload-button {
  padding: 6px 10px;  /* Make it pretty. */
  /* …other prettification like background color… */

  /* Make room for icon. */
  padding-left: 35px;
}

input[type=file] {
  position: relative;
}

input[type=file]:before {
  font-family: "FontAwesome";
  /* http://fortawesome.github.io/Font-Awesome/icon/picture-o/ */
  content: "\f03e";
  color: #aaa;

  position: absolute;
  top: 0;
  left: 0;

  padding: 6px 10px;  /* NOTE: Same padding as on the upload button. */
  line-height: 21px;  /* Magic number :/ Modify this until it looks good. */
}
```

So the file upload button gets padding to make room for the icon.

Then the icon is absolutely positioned within the file field (couldn't get it to work within the upload button).

The `content` value is a `\` followed by the Unicode code point as listed [on each icon's page](http://fortawesome.github.io/Font-Awesome/icon/picture-o/) or in [the cheatsheet](http://fortawesome.github.io/Font-Awesome/cheatsheet/) (after `&#x`).


## font-awesome-sass

If you use [font-awesome-sass](https://github.com/FortAwesome/font-awesome-sass) in a Ruby/Rails project, you can even use its variables:

``` scss
input[type=file] {
  // …

  &:before {
    // …
    content: $fa-var-picture-o;
  }
}
```

Just make sure to import the lib with `@import "font-awesome";` and not `//= require font-awesome` in your `application.scss`. Otherwise the variables will not be available.
