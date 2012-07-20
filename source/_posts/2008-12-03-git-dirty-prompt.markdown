---
wordpress_id: 263
title: Show Git dirty state (and branch) in the prompt
categories:
- Shell scripting
- Git
date: 2008-12-03 18:57
layout: post
comments: true
---
I've been using <a href="http://www.simplisticcomplexity.com/2008/03/13/show-your-git-branch-name-in-your-prompt/">this excellent hack</a> for a while to get the current git branch in my shell prompt.

That takes care of knowing what branch you're on, but I still found myself running <code>git status</code> often after <code>cd</code>:ing into a working directory, to find out if it was dirty (had uncommitted stuff). If it is, I want to handle that before starting on something else.

I hacked that in, and now my prompt looks like e.g.

    henrik@Hyperion ~/dev/blog.johannaost.com[master]$

when the working directory is clean, and

    henrik@Hyperion ~/dev/blog.johannaost.com[master*]$

when it's dirty – an asterisk is added.

Code for bash, goes into <code>~/.bashrc</code>:

{% gist 31631 %}

I have nearly no experience in shell scripting, so please let me know how this can be improved. For one thing, I expect it could be made more efficient by just running <code>git status</code> once and getting both branch and dirtiness from that.

Feel free to contribute versions for other shells.
