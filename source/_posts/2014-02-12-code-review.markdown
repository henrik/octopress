---
layout: post
title: "The risks of feature branches and pre-merge code review"
date: 2014-02-12 23:56
comments: true
categories:
  - Git
  - Code review
  - Continuous Delivery
---

[Our team](http://barsoom.se) has been doing only spontaneous code review for a good while – on commits in the master branch that happen to pique one's interest. This week, we started systematically reviewing all non-trivial features, as an experiment, but this is still *after* it's pushed to master and very likely after it has been deployed to production.

This is because we feel strongly about continuous delivery. Many teams adopt the practice of feature branches, pull requests and pre-merge (sometimes called "pre-commit") code review – often without, I think, realizing the downsides.


## Continuous delivery

[Continuous delivery](http://en.wikipedia.org/wiki/Continuous_delivery) is about constantly deploying your code, facilitated by a pipeline: if some series of tests pass, the code is good to go. Ideally it deploys production automatically at the end of this pipeline.

Cycles are short and features are often released incrementally, perhaps using [feature toggles](http://en.wikipedia.org/wiki/Feature_toggle).

This has major benefits. But if something clogs that pipeline, the benefits are reduced. And pre-merge code review clogs that pipeline.


## The downsides of pre-merge review

Many of these downsides can be mitigated by keeping feature branches small and relatively short-lived, and reviewing continuously instead of just before merging – but even then, most apply to some extent.

* Bugs are discovered later. With long-lived feature branches, sometimes *much* later.

  With continuous delivery, you may have to look for a bug in that one small commit you wrote 30 minutes ago. You may have to revert or fix that one commit.

  With a merged feature branch, you may have several commits or one big squashed commit. The bug might be in code you wrote a week ago. You may need to roll back an entire, complex feature.

  There is an obvious risk to deploying a large change all at once vs. deploying small changes iteratively.

* Feedback comes later.

  Stakeholders and end-users are more likely to use the production site than to review your feature branch. By incrementally getting it out there, you can start getting real feedback quickly – in the form of user comments, support requests, adoption rates, performance impact and so on. Would you rather get this feedback on day 1 or after a week or more of work?

* Merge conflicts or other integration conflicts are more likely.

* It is harder for multiple pairs to work on related features since integration happens less often.

  If they share a feature branch, all features have to be reviewed and merged together.

* The value added by your feature or bug fix takes longer to reach the end user.

  Reviews can take a while to do and to get to.

* It is frustrating to the code author not to see their code shipped.

  It may steal focus from the next task, or even block them or someone else from starting on it.


## The downsides of post-merge review

Post-merge review isn't without its downsides.

* Higher risk of releasing bugs and other defects.

  Anything a pre-merge review would catch may instead go into production.

  Then again, since releases are small and iterative, usually these are smaller bugs and easier to track down.

* Renaming database tables and columns without downtime in production is a lot of work.

  Assuming you want to [deploy without downtime](https://github.com/barsoom/devbook/tree/master/deploy_without_downtime), database renames are a lot of work. When you release iteratively, you will add tables and columns to production sooner, perhaps before discovering better names. Then you have to rename them in production.

  This can be annoying, but it's not a dealbreaker.

  We try to mitigate this by always getting a second opinion on non-obvious table or column names.

* New hires may be insecure about pushing straight to master.

  Pair programming could help that to some extent. You can also do pre-merge code review temporarily for some person or feature.

I fully acknowledge these downsides. This *is* a trade-off. It's not that post-merge review is flawless; I just feel it has more upsides and fewer downsides all in all.


## Technical solutions for post-merge review

I think GitHub's excellent tools around [pull requests](https://help.github.com/articles/using-pull-requests) is a major reason for the popularity of pre-merge review.

We only started with systematic post-merge reviews this week, and we're doing it the simplest way we could think of: a "Review" column for tickets ("cards") in [Trello](http://trello.com), digging through `git log` and writing comments on the GitHub commits.

This is certainly less smooth than pull requests.

We have some ideas. Maybe use pull requests anyway with immediately-merged feature branches. Or some commit-based review tool like [Barkeep](http://getbarkeep.org/) or [Codebrag](http://codebrag.com).

But we don't know yet. Suggestions are welcome.


## Our context

To our team, the benefits are clear.

We are a small team of 6 developers, mostly working from the same room in the same office. We often discuss complex code in person before it's committed.

We're not in day trading or life-support systems, so we can accept a little risk for other benefits. Though I'm not sure pre-release review actually reduces risks overall, as discussed above.

If you're in another situation than ours, your trade-off may be different. It would be interesting to hear about that in the comments.
