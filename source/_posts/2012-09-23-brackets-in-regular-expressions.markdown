---
layout: post
title: "Brackets in regular expressions"
date: 2012-09-23 21:00
comments: true
categories:
  - Regular expressions
---

For some reason, people often seem to confuse `()` and `[]` in regular expressions.

Say you want to match only the strings "bar" and "car".

I sometimes see this mistake:

``` ruby
/[b|c]ar/
```

It will indeed match "bar" and "car" as intended. But it will also match "|ar".

Round brackets do grouping (and capture groups, and some other things). Within the group, you can use `|` for alternation. So this would work as expected:

``` ruby
/(b|c)ar/
```

But square brackets are *not* the same as round brackets. Square brackets are syntax sugar for character-level alternation.

`[abcd]` effectively expands to `(a|b|c|d)`.

So if you do `[b|c]`, that's syntax sugar for `(b|\||c)`. Probably not what you want.

Instead do this:

``` ruby
/[bc]ar/
```
