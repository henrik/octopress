---
layout: post
title: "Don't mix in your privates"
date: 2014-02-13 16:45
comments: true
categories:
  - Ruby
---

Say we have this module:

``` ruby
module Greeter
  def greet(name)
    "HELLO, #{normalize(name)}!"
  end

  private

  def normalize(name)
    name.strip.upcase
  end
end
```

We can include it to make instances of a class correspond to a "greeter" interface:

``` ruby
class Person
  include Greeter
end

person = Person.new
person.greet("Joe")  # => "HELLO, JOE!"
```

Is `greet` the whole interface?

It is the only public methods the module gives us, but it also has a private `normalize` method, part of its internal API.


## The risk of collision

The private method has a pretty generic name, so there's some risk of collision:

``` ruby
class Person
  include Greeter

  def initialize(age)
    @age = normalize(age)
  end

  private

  def normalize(age)
    [age.to_i, 25].min
  end
end

person = Person.new(12)
person.greet("Joe")  # => "HELLO, 0!"
```

The module's `greet` method will call `Person`'s `normalize` method instead of the module's – modules are much like superclasses in this respect.

You could reduce the risk by making the method names unique enough, but it's easy to forget and reads poorly.


## Extract a helper

Instead, you can move the module's internals into a separate module or class that is not mixed in:

``` ruby
module Greeter
  module Mixin
    def greet(name)
      "HELLO, #{Name.normalize(name)}!"
    end
  end

  module Name
    def self.normalize(name)
      name.strip.upcase
    end
  end
end

class Person
  include Greeter::Mixin

  # …
end
```

Since the helper class is outside the mixin, collisions are highly unlikely.

This is for example [how my Traco gem does it](https://github.com/barsoom/traco/commit/04681eb47e45a06cfa807adda7df658369ad2397).

Introducing additional objects also makes it easier to refactor the code further.

Note that if the helper object is defined inside the mixin itself, there *is* [a collision risk](https://gist.github.com/sandal/8978473) as [Gregory Brown](https://practicingruby.com/) pointed out in a comment.


## Intentionally mixing in privates

Sometimes, it *does* make sense to mix in private methods. Namely when they're part of the interface that you want to mix in, and not just internal details of the module.

You often see this with [the Template Method pattern](http://en.wikipedia.org/wiki/Template_method_pattern):

``` ruby
module Greeter
  def greet(name)
    "#{greeting_phrase}, #{name}!#{post_greeting}"
  end

  private

  def greeting_phrase
    raise "You must implement this method!"
  end

  def post_greeting
    # Defaults to empty.
  end
end

class Person
  include Greeter

  private

  def greeting_phrase
    "Hello"
  end

  def post_greeting
    "!!1"
  end
end
```


## Summary

Mind the private methods of your modules, since they are mixed in along with the public methods. If they're not part of the interface you intend to mix in, they should probably be extracted to some helper object.
