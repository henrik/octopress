---
layout: post
title: "Pair programming is not a substitute for code review"
date: 2015-06-20 09:20
comments: true
categories:
  - Code review
  - Pair programming
---

I think code review adds significant value, even when the code was produced by pair programming.

Both pair programming and code review can serve to catch errors and improve design. But the biggest strength of code review to me is getting the outsider perspective while there still is an insider.

A pair will build a shared understanding of the code they write. They start with something simple and change it, step by step. Each change may have been easy to understand, but the end result can be difficult to untangle. It's hard to see the code with fresh eyes when you've been part of its evolution.

A reviewer outside the pair is a proxy for the future coders who will have to make sense of the code. The reviewer, like the future coders, doesn't have the benefit of having just written it. If something is unclear or implicit, the person who just wrote the code is likely to fill in the blanks from their internalized understanding of the problem and solution. The reviewer is much more likely to see these gaps.

If the code review happens [soon after the code was written](/2014/02/code-review/), the authors can be consulted, to make their understanding explicit before it inevitably fades from memory.

Once it fades, the original authors of the code may find that the reviewer was their proxy, too.
