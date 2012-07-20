---
wordpress_id: 175
title: object.in?(collection)
categories:
- Ruby
date: 2007-09-14 10:01
layout: post
comments: true
---
I often find <code>collection.include?(object)</code> to read backwards. Consider

``` ruby
puts "Nice doggie!" if [:pug, :bulldog].include?(dog)
```
I think

``` ruby
puts "Nice doggie!" if dog.in?(:pug, :bulldog)
```
reads a lot better.

<!--more-->

This may seem obvious to many. My intention is to promote the <em>idea</em> of doing things this way to those who hadn't considered it, and the (rather straightforward) implementation as a convenience.

This is the code I use in a current Rails project:

``` ruby
class Object
  def in?(*args)
    collection = (args.length == 1 ? args.first : args)
    collection.include?(self)
  end
end
```

The conditionals make it so you can do either <code>dog.in?([:pug, :bulldog])</code> (easier if the collection is in a variable/constant) or <code>dog.in?(:pug, :bulldog)</code> (easier if you enumerate the collection right there). If you just want the former syntax,

``` ruby
class Object
  def in?(collection)
    collection.include?(self)
  end
end
```

will do.

For better readability still, try something like

``` ruby
alias_method :one_of?, :in?
```
and then

``` ruby
puts "Nice doggie!" if dog.one_of?(:pug, :bulldog)
```
