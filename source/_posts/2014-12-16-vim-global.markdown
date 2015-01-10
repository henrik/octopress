---
layout: post
title: "Remove debug code with Vim's :global"
date: 2014-12-16 10:25
comments: true
categories:
  - Vim
---

Say you have this file open in Vim:

``` javascript example.js linenos:false
one();

console.log("about to do two");
two();
console.log("did two");

three();

console.log("about to do four");
four();
console.log("did four");
```

The logging helped you figure out an issue and now you want to be rid of the `console.log` lines.

There's (not surprisingly) a quick way to do that in Vim:

``` linenos:false
:g/log/d
```

Any line matching the Vim regular expression `/log/` will be removed.

More generally, `:g[lobal]` runs the given Ex command on the matching lines. In this case, the command is `:d[elete]`.

For more details, see `:help :g`.

I've only used this to remove lines, but it has [all sorts of applications](http://vim.wikia.com/wiki/Power_of_g).
