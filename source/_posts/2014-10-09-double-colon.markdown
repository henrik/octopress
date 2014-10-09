---
layout: post
title: ":: is a code smell"
date: 2014-10-09 21:04
comments: true
categories:
  - Ruby
  - Review in review
---

This is a post in [my series](/tag/review-in-review) on things I've remarked on in code review.

I'm increasingly seeing `::` as a [code smell](http://en.wikipedia.org/wiki/Code_smell) in Ruby.

When you do `Foo::Bar.baz`, you couple yourself to knowing `Foo` contains a `Bar`. If you instead do `Foo.baz` or perhaps `Foo.bar_baz`, you encapsulate that knowledge. `Foo` might delegate to `Foo::Bar` internally or it might not.

The `::` also simply adds line noise. Which reads better?

``` ruby
# Before
Fraud::SuspiciousIp.flag("1.2.3.4")

# After
Fraud.flag_suspicious_ip("1.2.3.4")
```

That's a real example from recent code review. Another:

``` ruby
# Before
Fraud::SuspiciousIp.buyers_with_flag(Fraud::SuspiciousIp::FRAUDULENT)

# After
Fraud.buyers_flagged_as_fraudulent
```

This change gets rid not only of the colons leading up to the method, but also in the method argument. That's another instance where the calling code is unnecessarily coupled to internals.

When you get rid of your `::`s, consider that you're not constrained by the methods and classes that existed before. Call the API you wish you had: minimal, no more coupled than it needs to be, and at your current level of abstraction.

As with all code smells, this doesn't mean `::` is always bad. It's not; it's an essential part of Ruby. But it often indicates an API that could be improved.

Give your code base a colonic; treat `::` as a code smell and see if you can't get clearer code without it.
