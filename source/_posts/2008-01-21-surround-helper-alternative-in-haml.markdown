---
wordpress_id: 202
title: surround helper alternative in Haml
categories:
- Ruby
- Ruby on Rails
- Haml
date: 2008-01-21 13:22
layout: post
comments: true
---
I've previously blogged <a href="http://henrik.nyh.se/2007/11/comma-after-link-in-haml">a simple alternative</a> to the Haml <code><a href="http://haml.hamptoncatlin.com/docs/rdoc/classes/Haml/Helpers.html#M000013">succeed</a></code> helper.

Today I wanted to put a link in parentheses. There is a <code><a href="http://haml.hamptoncatlin.com/docs/rdoc/classes/Haml/Helpers.html#M000011">surround</a></code> helper, but that syntax isn't pretty.

This is what I do instead:

``` haml
%li
  =h item.name
  = "(%s)" % link_to_remote("x", item, :method => :delete)
```

The code

``` ruby
"(%s)" % "foo"
```
in Ruby is short for

``` ruby
format("(%s)", "foo")
```
or

``` ruby
sprintf("(%s)", "foo")
```
and will simply return

    (foo)
