---
layout: post
title: "Vim's life-changing c%"
date: 2014-03-03 20:45
comments: true
categories:
  - Vim
---

When my pair programming partner saw how I use Vim's `c%` operator-motion combo, he described it as "life-changing". While that might be overstating things, it *is* quite useful.

Say you want to change `link_to("text", my_path("one", "two"))` into `link_to("text", one_two_path)`.

Assume the caret is on the `m` in `my_path`:

    link_to("text", my_path("one", "two"))
                    ^

You could hit `cf)` to change up-to-and-including the next ")".

Or you could hit `c%` to do the same thing.

This saves you one character. Nice, but not a big deal.

Now let's say the input text was `link_to("text", my_path(singularize("one"), pluralize(double("two"))))`.

You could count the brackets carefully and hit `c4f)`.

Or you could just hit `c%`.

How does this work?

The `%` motion finds the next parenthesis on the current line and then jumps to its matching parenthesis.

    link_to("text", my_path(singularize("one"), pluralize(double("two"))))
                    ^      A                                            B

So the `%` motion finds `A`, then jumps to its matching parenthesis `B`. Everything between `^` and `B` (inclusive) will be changed.

That's not quite all `%` does. It also handles `[]` square brackets, `{}` curly braces and some other things. It can be used as a standalone motion or with other operators than `c`.

For example, you could use `%d%` to change `remove_my_argument(BigDecimal(123))` into `remove_my_argument`.

Or if you're at the beginning of the line `hash.merge(one: BigDecimal(1), two: BigDecimal(2)).invert` and want to add a key just before the ending parenthesis, just hit `%` to go there.

See `:help %` and `:help matchit` for more.
