---
layout: post
title: "The gestalt of comments"
date: 2014-12-05 20:20
comments: true
categories:
  - Code style
  - Review in review
---

This is a post in [my series](/tag/review-in-review) on things I've remarked on in code review.

[Gestalt theory](http://en.wikipedia.org/wiki/Gestalt_psychology) deals with how we perceive things. It is perhaps best known for its laws of visual perception: for example, the Law Of Proximity states that we "perceive objects that are close to each other as forming a group" ([Wikipedia](http://en.wikipedia.org/wiki/Gestalt_psychology#Gestalt_laws_of_grouping)).

We all *unconsciously* apply the Law of Proximity when we read code, so I try to do so *consciously* when I write it.

For example, instead of

``` ruby
def my_method
  return if foo
  # Info about bar.
  return if bar

  baz
end
```

I would prefer

``` ruby
def my_method
  return if foo

  # Info about bar.
  return if bar

  baz
end
```

so that the comment and the code it applies to form a group of their own.

I would especially steer clear of

``` ruby
def my_method
  # Info about bar.
  return if bar
  return if foo

  baz
end
```

In this example, the Law of Proximity suggests that the comment applies to both `bar` and `foo`, but it's only intended to apply to `bar`.

Similarly, a comment that applies to several paragraphs of code would suggest the wrong grouping if it's right next to the first paragraph:

``` ruby
# Info about foo and bar.
foo(1)
foo(2)

bar(1)
bar(2)
```

Instead, I'd do

``` ruby
# Info about foo and bar.

foo(1)
foo(2)

bar(1)
bar(2)
```

There's also horizontal proximity. Instead of

``` ruby linenos:false
foo # Info about foo.
```

I prefer

``` ruby linenos:false
foo  # Info about foo.
```

with two spaces, so the comment and code are more clearly separate.

With syntax highlighting, this horizontal separation is less important – per another law of Gestalt theory, the Law of Similarity, the different colors help us separate code from comment. Still, every bit helps.
