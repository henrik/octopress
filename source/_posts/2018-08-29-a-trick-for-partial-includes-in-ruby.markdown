---
layout: post
title: "A trick for partial includes in Ruby"
date: 2018-08-29 21:20
comments: true
categories:
  - Ruby
---

In Ruby, an `include` will include *all* methods from that module. If you only really need one or two of the methods, it can feel messy to include all of them.

Here's a trick:

``` ruby
module MyModule
  def the_method_i_want
    "Hello!"
  end

  def method_i_do_not_want
    "I don't think so."
  end
end

class MyClass
  def run_demo
    # You can call the helper object explicitly:
    helpers.the_method_i_want

    # Or delegate (see below):
    the_method_i_want

    # This won't be available:
    method_i_do_not_want
  end

  private

  def helpers
    @helpers ||= Object.new.extend(MyModule)
  end

  extend Forwardable
  def_delegator :helpers, :the_method_i_want

  # In Ruby on Rails, you could instead delegate with:
  delegate :the_method_i_want, to: :helpers
end

MyClass.new.run_demo
```

Instead of including the module in your class, we create a new object instance for the purpose.

Since we're dealing with an object instance and not a class, we need to `extend` rather than `include`.

We use [rose memoization](/2016/01/rose-memoization/) (`@helpers ||= …`) so a new object is not created on every call.

A related trick is that you can extend a module with itself to make its instance methods available as module-level methods ("class methods"):

``` ruby
MyModule.extend(MyModule)

class MyClass
  def run_demo
    # You can call it directly on the module:
    MyModule.the_method_i_want

    # Or delegate (see below):
    the_method_i_want
  end

  private

  extend Forwardable
  def_delegator :MyModule, :the_method_i_want

  # In Ruby on Rails, you could instead delegate with:
  delegate :the_method_i_want, to: :MyModule
end
```

This feels a bit dirtier to me, since `MyModule` stays extended forever, having all those extra methods on the class level.

It's essentially the same as the first trick, but instead of dumping all those methods in a fresh new internal object made for the purpose, we dump them in the globally available module itself. For quick-and-dirty jobs, though, it can be handy.

If you want to use this to for routes or view helpers in Ruby on Rails, you'll be pleased to know that Rails already provides objects with the methods mixed in: `Rails.application.routes.url_helpers` for routes and `ApplicationController.helpers` for helpers. These have been known to move around a bit between Rails versions, so you may need to track down the right incantation for the one you're on.
