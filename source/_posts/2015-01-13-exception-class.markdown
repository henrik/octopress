---
layout: post
title: "When to define an exception class and when not to"
date: 2015-01-13 20:45
comments: true
categories:
  - Ruby
  - Exceptions
---

In Ruby, when should you define your own exception class and when shouldn't you bother?

Defining your own exception class looks something like

``` ruby linenos:false
class UnparsableValueError < StandardError; end

def parse(value)
  raise UnparsableValueError unless value.start_with?("number:")

  actually_parse(value)
end
```

Raising a generic `RuntimeError` from a string looks like

``` ruby linenos:false
def parse(value)
  raise "Couldn't parse: #{value.inspect}" unless value.start_with?("number:")

  actually_parse(value)
end
```

This is how I decide:

* If other parts of my code want to rescue this exception (e.g. to show a "parse error" message), I define a class. Because rescuing *all* exceptions is dangerous, and rescuing by class beats rescuing by message (easier, less fragile).
* If I'm writing a library for other parties, I usually define a class, if there's any chance that they may want to rescue that specific error type.
* Otherwise – with exceptions in my own code that I don't expect to rescue – I just raise a string. E.g. if parsing *should* never fail but I want an exception logged if it does anyway. Raising a string is less code and it's easier to phrase clearly ([perhaps with documentation URLs](/2014/05/exceptions-with-documentation-urls/)) as a string than as a class name. Coming up with a good class name is harder.

You could raise a custom class with a message string, of course, to get the clear phrasing, but that still means adding a class you don't need.

In [*Practical Object Oriented Design in Ruby*](http://www.sandimetz.com/products), Sandi Metz says:

> When the future cost of doing nothing is the same as the current cost, postpone the decision. Make the decision only when you must with the information you have at that time.

That's why I don't introduce exception classes until I need them.
