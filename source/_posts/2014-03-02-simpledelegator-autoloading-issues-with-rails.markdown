---
layout: post
title: "SimpleDelegator autoloading issues with Rails"
date: 2014-03-02 09:15
comments: true
categories:
  - Ruby on Rails
---

Be aware that if you use [SimpleDelegator](http://www.ruby-doc.org/stdlib-2.1.1/libdoc/delegate/rdoc/SimpleDelegator.html) with Rails, you may see autoloading issues.


## The problem

Specifically, if you have something like

``` ruby app/models/my_thing.rb
class MyThing < SimpleDelegator
end
```

``` ruby app/models/my_thing/subthing.rb
class MyThing::Subthing
end
```

then that class won't be autoloaded. In a Rails console:

    >> MyThing
    => MyThing
    >> MyThing::Subthing
    NameError: uninitialized constant Subthing
    >> require "my_thing/subthing"
    => true
    >> MyThing::Subthing
    => MyThing::Subthing

Both Rails ([code](https://github.com/rails/rails/blob/92fdd6516287f677cd6687e5c31298fa68931baa/activesupport/lib/active_support/dependencies.rb#L178-L181)) and SimpleDelegator ([code](https://github.com/ruby/ruby/blob/bcaec55695c0592b911d361750834ef0c1a7842f/lib/delegate.rb#L60-L62)) hook into [`const_missing`](http://ruby-doc.org/core-2.1.1/Module.html#method-i-const_missing). Rails does it for autoloading. Since the `SimpleDelegator` superclass is earlier in the inheritance chain than `Module` (where Rails mixes it in), this breaks Rails autoloading.


## Workarounds

How do you get around this?

You could stop using `SimpleDelegator`.

An explicit `require` won't work well – I think what happens is that the Rails development reloading magic undefines the constant when the file is changed.

An explicit [`require_dependency`](http://stackoverflow.com/a/5214667/6962) does appear to work:

``` ruby
class MyThing < SimpleDelegator
  require_dependency "my_thing/subthing"
end
```

This blog post is mainly intended to describe the problem – I'm afraid I don't know of a great solution. If you have any insight, please share in a comment.
