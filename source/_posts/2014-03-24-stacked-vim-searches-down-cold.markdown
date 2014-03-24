---
layout: post
title: "Stacked Vim searches down :cold"
date: 2014-03-24 20:45
comments: true
categories:
  - Vim
---

When you do a project-wide search in Vim, you probably use something like [ack.vim](https://github.com/mileszs/ack.vim) or [git-grep-vim](https://github.com/henrik/git-grep-vim). Those plugins make use of the Vim [quickfix list](http://vimdoc.sourceforge.net/htmldoc/quickfix.html) – a split window that shows each matching line.

There are some useful commands to navigate the quickfix list.

You probably already know that you can use `:cn` (or `:cnext`) to jump to the next result and `:cp` (or `:cprevious`) to jump to the previous result.

Maybe you even know about `:cnf` (`:cnfile`) and `:cpf` (`:cpfile`) to jump to the next or previous *file* with a result.

But my favorite quickfix list command is `:cold` (`:colder`).

Say you project-search for "foo" to look into an issue. You hit `:cn` a few times.

But then you realize the rabbit hole runs deeper. What's that "bar" doing there?

So you project-search for "bar" and navigate that quickfix list for a while.

Now you want to get back to "foo".

You could search for "foo" again… or you could run `:cold`.

`:cold` jumps back to the last (older) list. It even remembers which item in the list you were on.

This effectively gives you a stack of project searches. You can make searches within searches and then jump back to previous ones.

To go forward again, there's `:cnew` (`:cnewer`). Vim remembers the ten last used lists for you.
