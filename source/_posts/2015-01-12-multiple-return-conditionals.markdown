---
layout: post
title: "Express complex conditionals with multiple returns"
date: 2015-01-12 21:55
comments: true
categories:
- Ruby
---

I've found multiple returns to be a good way of expressing long or complex conditionals.

This typically applies to [policy objects](http://blog.codeclimate.com/blog/2012/10/17/7-ways-to-decompose-fat-activerecord-models/#policy-objects) or policy methods, e.g. code concerned with whether an action is possible.

Today, for example, [Tomas](http://twitter.com/tskogberg) and I came across a method like

``` ruby linenos:false
def changeable?
  auction.buyer && !auction.withdrawn? && the_only_auction_on_its_invoices?
end
```

Our task called for adding a fourth condition.

Instead of piling onto this long expression, we first refactored it to use multiple returns:

``` ruby linenos:false
def changeable?
  return false unless auction.buyer
  return false if auction.withdrawn?
  return false unless the_only_auction_on_its_invoices?
  true
end
```

I feel this reads better. It also makes for nicer diffs: adding, removing or changing a single condition affects a single line. It's clearer where any raised exceptions come from. Debugging is easier.

You might argue that multiple exit points are bad and should be avoided. But when the conditions are all bunched together like this, it's just a compact conditional.

[*Refactoring*](http://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672?tag=delishlist-20) by Martin Fowler and friends has this to say:

> […] one exit point is really not a useful rule. Clarity is the key principle: If the method is clearer with one exit point, use one exit point; otherwise don't.

That book (as well as [*Refactoring: Ruby Edition*](http://www.amazon.com/Refactoring-Edition-Addison-Wesley-Professional-Series/dp/0321984137?tag=delishlist-20)) includes a ["Replace Nested Conditional with Guard Clauses"](http://refactoring.com/catalog/replaceNestedConditionalWithGuardClauses.html) refactoring, which is closely related to what I describe above.
