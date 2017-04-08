---
layout: post
title: "Add documentation where you looked for it"
date: 2017-04-02 20:10 GMT
comments: true
categories:
  - Documentation
---

It may seem obvious, but I've noticed not everyone does this:

Add documentation where you looked for it.

You're trying to find out how to set up another Foo service integration. You look in `FooClient`, but it's not there.

Ah! Someone put it under a "Foo" header of the README. I guess that makes sense. Time to move on?

No.

First add a comment to `FooClient` saying this information can be found in the README. The next time, you (or someone who thinks like you) will find it more easily.

If you make sure the docs are in their own dedicated file, they're easier to "link" to, because you can then use commands like [Vim's `gf`](http://vim.wikia.com/wiki/Open_file_under_cursor). You could put the docs in `developer_documentation/foo.md`, for example, and then have a comment like:

``` ruby foo_client.rb linenos:false
# Foo docs and setting up new integrations: developer_documentation/foo.md

class FooClient
  # …
end
```

This applies to more than code. Maybe you looked for documentation in a 1Password note, but it was in the company wiki. Maybe you looked for documentation in the wiki, and it was in a coworker's head.

I see this as one application of [The Golden Rule for programmers](/2014/07/golden-rule/).
