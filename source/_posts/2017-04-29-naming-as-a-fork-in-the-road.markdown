---
layout: post
title: "Naming as a fork in the road"
date: 2017-04-29 08:15 BST
comments: true
categories:
  - Naming things
---

In programming, naming things is not just taking one concept and finding a better or worse name for it.

It's an act of choosing between concepts, picking among potential abstrations, betting on the future. It's a fork in the road.

A co-worker asked me about adding a flag named "internal" to contracts. Is that a good name?

Before trying to answer that question, I suggested looking at the fork in the road.

First, what is our current intent? We remind customers about their contracts. Some customer accounts belong to site admins. They should not receive these reminders.

We might go with that "internal" flag; it could be used to solve our problem at hand. What does it imply about the future? It makes no specific mention of reminders, so we might use for other things if the need arises. Perhaps to highlight all the internal contracts in a list. As an abstraction, it's fairly wide in scope.

Or we could get quite specific with a flag like "disable_reminders". The current intent is clearer, but it's also less open to other uses in the future. If we wanted to highlight internal contracts in a list, this would not be a suitable name. But it also lets us disable reminders for non-internal contracts. Perhaps we have a customer that is not an admin, but has special needs, and for whom we want to disable these reminders.

Or we might look elsewhere in the system. Perhaps the *customer* could have a "belongs_to_admin" flag, and we use that to disable reminders for their contracts. This would mean we don't have to set the flag on each contract. And we could use it for more things than contracts. But it also means we can't turn it on and off per contract.

There are more options, and you can mix and match these ones. You could have a flag on the contract, with a fallback to a flag on the customer, and so on.

There are also further, smaller forks. A name like "disable_reminders" could apply to emails as well as push notifications and messages on the website. A name like "disable_email_reminders" would be more specific.

The point here is the fork in the road. All these solutions solve our problem at hand, but they leave us with different options for the future.

Often it can be hard to choose among futures. And the choice is rarely irreversible, though changing an abstraction tends to get increasingly costly as you keep building on top of it.

Once you've staked out your path, there is still the rest of naming to do. There are all kinds of considerations: consistency, domain terminology, technical precision, aesthetics and so on.

But before you get into that, consider the fork in the road.
