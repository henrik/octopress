---
layout: post
title: "The !!! operator"
date: 2015-01-10 00:13
comments: true
categories:
  - Ruby
---

A quick tip, based on a comment I wrote in [the Ruby Rogues Parley "Operator nicknames" thread](http://parley.rubyrogues.com/t/operator-nicknames/704) (paid membership) a while back and just stumbled across again.

I'm sure you've used `!` in Ruby – it means "not": `!true  # => false`

You might have used `!!` to coerce a truthy or falsy value into a bona fide boolean: `!!nil  # => false`

I sometimes use `!!!`.

It's just three of the `!` operator in a row. It flips, flops and then flips back again, so it's really the same as a single one: `!!!true  # => false`

In that forum thread, I called it the "temporarily reverse the value of this bool to try something out, but it should stand out enough that I don't accidentally leave it in" operator. And that's what I use it for.

Even if you do accidentally leave it in, someone's bound to spot it in review. You could even prevent committing it altogether by technical means ([1][1], [2][2]).

Other name suggestions were "the mad hype operator" from [Mike McDonald](http://crazymykl.herokuapp.com/) or "tri-not" ("the Yoda operator") from [Christian Schlensker](http://cswebartisan.com/).

By any name, it's pretty sweet.

[1]: https://github.com/henrik/dotfiles/blob/master/git_template/hooks/pre-commit
[2]: https://github.com/henrik/dotfiles/blob/master/git_template/hooks/pre-commit-keywords.rb
