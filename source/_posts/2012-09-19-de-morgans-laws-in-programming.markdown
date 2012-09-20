---
layout: post
title: "De Morgan's laws in programming"
date: 2012-09-19 22:00
comments: true
categories:
  - Logic
  - General programming
  - Ruby
---

I learned about [De Morgan's laws](http://en.wikipedia.org/wiki/De_Morgan's_laws) back in logic class.

There's two of them, and they're very straightforward. All they say is that for any A and B, this is true:

``` ruby de_morgans_laws.rb
!(a && b) == (!a || !b)
!(a || b) == (!a && !b)
```

Or in logical representation:

```
¬(A ∧ B) ⇔ (¬A) ∨ (¬B)
¬(A ∨ B) ⇔ (¬A) ∧ (¬B)
```

I've found them pretty useful in programming.

Granted, they are fairly trivial and no more than you could figure out yourself with some thinking.

But having a name for these transformations means that you're more likely to recognize when they can be applied, and quicker and more confident about applying them. No need to ponder the truth tables – De Morgan already did.

So if you see this:

``` ruby
if !funny? && !cute?
  destroy
end
```

You know straight off that this is equivalent:

``` ruby
unless funny? || cute?
  destroy
end
```

And if you see this:

``` ruby
if !big? || !heavy?
  send_as_letter
end
```

You won't hesitate to change it to:

``` ruby
unless big? && heavy?
  send_as_letter
end
```

I'm very curious to hear about other transformation rules of logic or mathematics or similar that you've found generally useful in programming, and that might not be widely known.
