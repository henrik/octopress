---
wordpress_id: 110
title: Using gsub with blocks to strip attributes from HTML tags
categories:
- Ruby
date: 2007-03-03 00:28
layout: post
comments: true
---
I love Ruby's <code>gsub</code> used with blocks. To strip specified attributes from HTML tags becomes almost too easy:

``` ruby

html = 'Getting <a href="#" id="foo">rid</a> of <code id="bar">id</code> attributes, but not in text: id="not this".'

html.gsub(/<(.*?)>/) {|innards| innards.gsub(/ id=("|').*?\1/, '') }

# => Getting <a href="#">rid</a> of <code>id</code> attributes, but not in text: id="not this".
```
