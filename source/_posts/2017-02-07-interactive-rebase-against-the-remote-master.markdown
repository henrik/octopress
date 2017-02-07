---
layout: post
title: "Interactive rebase against the remote master"
date: 2017-02-07 19:55 GMT
comments: true
categories:
  - Git
---

Here's a Git command I've started to use a lot:

``` bash linenos:false
git rebase -i origin/master
```

In fact, I use it often enough that I made a shell alias:

``` bash linenos:false
alias grb='git rebase -i origin/master'
```

What does it do? It lists all the commits I made locally but didn't push to the remote `master` branch yet.

``` bash linenos:false
pick 3b052b2 New blog post: Interactive rebase against the remote master
pick 2b05fe3 Work work
pick d37dda8 More work

# Rebase 39faea5..d37dda8 onto 39faea5 (3 command(s))
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
```

The list opens in my editor as a Git ["interactive rebase"](https://robots.thoughtbot.com/git-interactive-rebase-squash-amend-rewriting-history#interactive-rebase), which means I can easily modify the list to rephrase commits, reorder them, and squash multiple commits into one.

If you're an experienced Git user, you have probably used interactive rebase before. But what makes *this* command so handy is how you don't have to dig through your `git log` and figure out which commit to rebase from. It changes interactive rebase from something you spend maybe 30 seconds on to something you spend maybe 5 seconds on.

If you think about it, the commits you haven't pushed yet are usually exactly the ones you want. You don't want to rewrite what's already been pushed. You may not want to change *every* unpushed commit, but you can change some and leave the rest as-is.

You can [learn all about interactive rebase elsewhere](https://robots.thoughtbot.com/git-interactive-rebase-squash-amend-rewriting-history#interactive-rebase), but here's one thing I do often, as an example:

Say I made a commit for feature A, then one for feature B. Then I realise I wanted to get some more stuff into the first commit.

I just make those changes as a third commit with a temporary commit message.

``` bash linenos:false
abc123 Implement feature A
def456 Implement feature B
789cba Temp
```

Then I open the interactive rebase with my `grb` alias. I move that temporary commit below "feature A" and say to "fixup" the commit – to meld it into the preceding commit, discarding the temporary commit message.

``` bash linenos:false
pick abc123 Implement feature A
f 789cba Temp
pick def456 Implement feature B
```

When I save and close this window (a quick [`ZZ`](http://vimdoc.sourceforge.net/htmldoc/editing.html#ZZ) in Vim), it's all done.

``` bash linenos:false
123bca Implement feature A
465efd Implement feature B
```

There are other ways to achieve the same (e.g. with the `edit` command and no third commit), but this is how I like to do it.

I work almost exclusively in the `master` branch locally, pushing directly to the remote `master` branch. This is [very intentional](https://thepugautomatic.com/2014/02/code-review/) and something I recommend exploring. If you prefer feature branches, I'm sure the command could be adapted to account for whatever remote branch you're currently tracking. Feel free to share that in the comments!
