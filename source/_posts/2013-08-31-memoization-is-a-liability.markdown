---
layout: post
title: "Memoization is a liability"
date: 2013-08-31 23:37
comments: true
categories:
  - Ruby
---

This is another post extracted from discussions I've had on [exercism](http://exercism.io).

It's quite common to see [memoization](http://en.wikipedia.org/wiki/Memoization) like this:

``` ruby
class Word
  def initialize(string)
    @string = string
  end

  def letters
    @letters ||= @string.chars
  end

  def do_something
    10.times do |i|
      whatever(letters)
    end
  end
end
```

Since we'll call `letters` multiple times, the code author stores away and reuses the value on the assumption that it's more efficient.

I wouldn't advise it.

Memoization is caching. Caching easily bites you in the ass. It's another thing you have to keep correct as you update your complex system.

Say we add a `#string=` method to change that string at any time. Will you remember to clear the cache?

Say we add a `#string` reader and someone does `word.string.upcase!`. Or we add a `word.upcase!` method. The cached value is wrong again.

A more advanced memoization could handle that:

``` ruby
def letters
  @letters ||= {}
  @letters[@string] ||= @string.chars
end
```

But you probably didn't think about that, because caching is hard. If you did think about it, you might find it clutters up your class, obscuring the actual logic.

Of course, caching can be very useful and the right thing to do. If your code has a performance issue, it may be better, all things considered, to trade away some simplicity for speed – guided by benchmarks. But if you don't suspect a performance issue, don't bother.

In many cases, your code *with* memoization is fast enough and more bug prone; your code *without* memoization is fast enough and less bug prone.
