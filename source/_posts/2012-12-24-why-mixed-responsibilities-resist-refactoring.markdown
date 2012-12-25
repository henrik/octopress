---
layout: post
title: "Why mixed responsibilities resist refactoring"
date: 2012-12-24 12:45
comments: true
categories:
  - Object design
---


Mixing responsibilities in the same class discourages refactoring, much [like class methods do](http://blog.codeclimate.com/blog/2012/11/14/why-ruby-class-methods-resist-refactoring/).

Say you have a `Receipt` that you need to check for fraud.

You could just add another method:

``` ruby
class Receipt < ActiveRecord::Base
  # …

  def fraudulent?
    # …
  end
end
```

If `Receipt#fraudulent?` becomes complex enough, you may want to refactor by extracting private methods:

``` ruby
class Receipt < ActiveRecord::Base
  validate :validate_something

  def fraudulent?
    check_this
    check_that
  end

  private

  def validate_something
    # …
  end

  def check_this
    # …
  end

  def check_that
    # …
  end
end
```

But this quickly becomes a mess.

The class can end up with a high number of unrelated private methods, making the class harder to understand and making bugs and dead code more likely. Perhaps you start to organize with clumsy names like `check_this_for_fraud`, or with comment headers, or you avoid extracting them at all.

You may even accidentally break unrelated `Receipt` code while working on the fraud detection. You will definitely see code unrelated to fraud when that's all you need to focus on, and that may lead you to load more context into your head than you need for the task at hand.


## Extracting the responsibility

You can extract the responsibility to a class of its own:

``` ruby
class Receipt
  class FraudChecker
    def initialize(receipt)
      @receipt = receipt
    end

    def fraudulent?
      check_this
      check_that
    end

    private

    def check_this
      # …
    end

    def check_that
      # …
    end
  end
end
```

Since this class is only concerned with receipts, I would probably call it `Receipt::FraudChecker`, consider it an internal detail of `Receipt`, and delegate to it:

``` ruby
class Receipt < ActiveRecord::Base
  def fraudulent?
    FraudChecker.new(self).fraudulent?
  end
end
```

This means code outside `Receipt` has less things to care about – the single method `Receipt#fraudulent?` instead of the entire class `Receipt::FraudChecker` and whatever it may contain.

Alternatively, we could remove this delegation and make `Receipt` totally unaware of `FraudChecker`. That would give some benefits. The dependency would only go in one direction, so changes to `FraudChecker` wouldn't necessitate changes in `Receipt`. But as `Receipt` only knows a minimum about `FraudChecker`, and we do get good value from that knowledge, I wouldn't break them apart any further.

Oh, and the fraud checking is no longer in a subclass of `ActiveRecord::Base`, so it's easier to test without Rails if that's what you're into.


## Using a module

You could also use a module for this:


``` ruby
class Receipt < ActiveRecord::Base
  include FraudCheckable
end

module Receipt::FraudCheckable
  def fraudulent?
    check_this
    check_that
  end

  private

  def check_this
    # …
  end

  def check_that
    # …
  end
end
```

This has many of the same benefits. However, there is some risk of method collisions. Even if they probably won't collide, you would need to keep the entire class in your head (or your editor) to make sure. The responsibility of checking for fraud will be a little muddied by the fact that the code runs in the context of a full `Receipt` instance.

Those are admittedly not very strong arguments against modules. But since extracting classes is about the same amount of ceremony, I'd go with that.


## Discussion

I've found extracting classes this way to be very low cost and high yield. It's very little extra code and takes very little extra time. It's very little extra indirection and not hard to follow.

As with any other technique, it's not always the answer. It might not be worth it for a method that's just a few lines of code. The more code, the more obviously it's a responsibility worth separating.

The important thing is to be aware that mixed responsibilities resist refactoring, so you consider extraction in situations like the above.

For further reading, see: [single responsibility principle (SRP)](http://en.wikipedia.org/wiki/Single_responsibility_principle), [the Extract Class refactoring](http://en.wikipedia.org/wiki/Extract_class), [the Replace Method with Method Object refactoring](http://sourcemaking.com/refactoring/replace-method-with-method-object).

This post was inspired by discussion on the [Ruby Rogues Parley mailing list](http://rubyrogues.com/). I can really recommend it if you like discussing higher-level subjects like object design, testing strategies and music for hackers.
