---
layout: post
title: "Explain the trade-off"
date: 2014-06-30 20:45
comments: true
categories:
  - Review in review
---

This is a post in [my series](/tag/review-in-review) on things I've remarked on in code review.

Say there's a commit with a message like

    Bump number of workers to fix image upload problem

and a change like

``` diff
- "number_of_workers": 4,
+ "number_of_workers": 8,
```

Then I'm left wondering why it wasn't at 8 to start with. Or why we don't bump it all the way to 16, or 32. Surely more workers are better?

Usually there's a trade-off at play. More workers use more memory, perhaps.

If you tweak a value I want to know that you've considered that trade-off.

Ideally, a code comment (rather than the commit message) will explain what the trade-off is. Then the next tweaker sees it, and the next code reviewer too.
