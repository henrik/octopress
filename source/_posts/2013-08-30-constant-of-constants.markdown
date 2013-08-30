---
layout: post
title: "Constant of constants"
date: 2013-08-30 07:23
comments: true
categories:
  - Ruby
---

This is a convenient Ruby trick I often use for things like states:

``` ruby
class Auction < ActiveRecord::Base
  STATES = [
    NEW_STATE = "new",
    PUBLISHED_STATE = "published",
    SOLD_STATE = "sold",
    UNSOLD_STATE = "unsold"
  ]

  validates :state, inclusion: { in: STATES }

  def publish
    self.state = PUBLISHED_STATE
  end
end
```

Or perhaps:

``` ruby
class Auction
  class State
    ALL = [
      NEW = "new",
      # …
    ]
  end
end
```

Another use case might be listing DNA nucleotides:

``` ruby
class DNA
  NUCLEOTIDES = [
    GUANINE  = "G",
    ADENINE  = "A",
    THYMINE  = "T",
    CYTOSINE = "C"
  ]
end
```

If you type `GUANINE = "G"` into `irb`, you'll see `=> "G"`. That means the assignment expression returns `"G"` as its value.

We simply take that value and stick it in an array assigned to another constant.

In Ruby, [almost everything is an expression](http://phrogz.net/programmingruby/tut_expressions.html) and every expression returns a value, including things like assignments, conditionals and class definitions.

That same principle is why this works without explicit returns:

``` ruby
def my_method
  if condition
    "One return value"
  else
    "Another return value"
  end
end
```

The value of a string is itself, the value of a conditional is the value of its realized branch, and calling a method will implicitly return the last value of its body.
