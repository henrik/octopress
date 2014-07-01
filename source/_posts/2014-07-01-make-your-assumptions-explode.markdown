---
layout: post
title: "Make your assumptions explode"
date: 2014-07-01 18:40
comments: true
categories:
  - Review in review
---

This is a post in [my series](/tag/review-in-review) on things I've remarked on in code review.

You constantly make simplifying assumptions in code. Like this one:

``` ruby
class Order < ActiveRecord::Base
  has_many :line_items

  def currency
    # All line items have the same currency.
    line_items.first.currency
  end
end
```

The assumption in itself is a good thing: we shouldn't design for multiple currencies if we don't need to.

But it's dangerous that the assumption is left unchecked. It may be true today, but will it be true tomorrow? Mixing up currencies can have pretty dire consequences.

There's a simple solution. Make your assumptions explode!

``` ruby
def currency
  currencies = line_items.map(&:currency).uniq
  raise "Assumed all line items have the same currency" if currencies.length > 1
  currencies.first
end
```

You still reap the benefits of the simplifying assumption but can also trust that it remains valid.

If you make the same type of assertion in multiple places, you can of course extract it, or find [some gem](https://github.com/jorgemanrubia/solid_assert). We do `CurrencyVerification.assert_single_currency(records)` in one project, for example.

[Assertive programming](https://www.google.com/?q="assertive+programming"#q=%22assertive+programming%22) is a thing, but I haven't see it a lot in Ruby outside tests.
