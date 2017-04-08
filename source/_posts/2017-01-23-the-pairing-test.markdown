---
layout: post
title: "The pairing test for naming things"
date: 2017-01-23 20:15
comments: true
categories:
  - Naming things
---

Naming things is famously [one of the hard things in computer science](https://martinfowler.com/bliki/TwoHardThings.html).

One simple technique I use to avoid bad naming is something I think of as "the pairing test".

Take a piece of code that someone is likely to want to understand as a whole. It could be a group of classes that interact to make a feature, or the methods within a class.

Picture a list of the class or method names running down the left-hand side, and a randomly sorted list of explanations of what they do running down the right-hand side.

![Left: ItemBuilder; BuildItem; Item. Right: Models an item; Persists an item to database, given some attributes; Builds an item in memory, given some attributes.](/images/content/pairing-test-1.png)

Now, imagine that you asked someone who did not write this code to draw lines to pair up the names with the explanations. Could they confidently do it?

![Item paired to "Models an item"; ItemBuilder and BuildItem not paired up with anything.](/images/content/pairing-test-2.png)

If not, your naming probably stands to be improved.

In the above example, names like `PersistItem` and `BuildItem` might be more distinct.

I don't actually tend to draw these out on paper – it's usually as simple as noticing that two interacting things that are different have names that are interchangeable. But the model in my head is of these visual pairings.
