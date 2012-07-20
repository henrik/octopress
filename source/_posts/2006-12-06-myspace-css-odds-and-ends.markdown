---
wordpress_id: 81
title: "MySpace CSS odds and ends "
categories:
- Annoyances
- CSS
date: 2006-12-06 18:52
layout: post
comments: true
---
My girlfriend joined <a href="http://www.myspace.com">MySpace</a>, to see if it would bring traffic to <a href="http://www.johannaost.com">her art site</a>.

I haven't looked closely at MySpace before, and I was surprised to find it sucks a lot more than I had guessed.

The information architecture is awful, the language is poor ("Friends Comments" as opposed to "Friends' Comments"), there are lots of small touches of crap ("1 comments"), and so on.

And the HTML. The HTML is absolutely horrid. You are allowed and (I think) encouraged to change the appearance of your profile using CSS. However, there is very little in the way of obvious handles for this.

Mike Davidson has written <a href="http://www.mikeindustries.com/blog/archive/2006/04/hacking-myspace-layouts">an interesting post on this topic</a>. I used some tricks from it, and came up with some of my own, that I thought I would share.

<!--more-->

To get rid of the border around the "N N's Friends Comments" table, this works in Firefox (and, I assume, all other modern browsers):

``` css
table table table table[width='441'] {
  border-collapse:collapse;
  border:0;
}
```


To get rid of the "N N is in your extended network" box, you can use this:

``` css
td.text table[id='Table1'] {
  display:none;
}
```

MySpace doesn't allow id selectors (<code>#Table1</code>). There are in fact two elements using that id, so <code>td.text</code> is necessary.

The search form below the banner can be removed with a simple

``` css
form {
  display:none;
}
```

You can single out the "N N's Blurbs" header to e.g. hide it, like so:

``` css
.orangetext15 {
  display:none;
}

table table table table .orangetext15 {
  display:inline;
}
```

Finally, one way of achieving image separators (lines) between sections in the right-hand column is to make the header a block element, set the image as a centered background, and add some top padding:


``` css
table table table table .orangetext15 {
  display:block;
  background:url(http://johannaost.com/imgs/line.gif) no-repeat top center;
  padding-top:25px;
}
```

My girlfriend's MySpace profile is <a href="http://myspace.com/johannaost">here</a>, though I can't guarantee all these changes will still be there when you read this.
