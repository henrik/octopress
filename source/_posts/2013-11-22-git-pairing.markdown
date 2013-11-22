---
layout: post
title: "Git pairing aliases, prompts and avatars"
date: 2013-11-22 21:55
comments: true
categories:
  - Git
---

When we pair program at [Barsoom](http://barsoom.se), we've started making commits in both users' names.

This emphasizes shared ownership and makes commands like `git blame` and `git shortlog -sn` (commit counts) more accurate.

There are tools like [hitch](https://github.com/therubymug/hitch) to help you commit as a pair, but I found it complex and buggy, and I've been happy with something simpler.

## Aliases

I just added [some simple aliases](https://github.com/henrik/dotfiles/blob/master/bash/lib/gitpair.sh) to my Bash shell:

``` bash ~/.bash_profile
alias pair='echo "Committing as: `git config user.name` <`git config user.email`>"'
alias unpair="git config --remove-section user 2> /dev/null; echo Unpaired.; pair"

alias pairf="git config user.pair 'FF+HN' && git config user.name 'Foo Fooson and Henrik Nyh' && git config user.email 'all+foo+henrik@barsoom.se'; pair"
alias pairb="git config user.pair 'BB+HN' && git config user.name 'Bar Barson and Henrik Nyh' && git config user.email 'all+bar+henrik@barsoom.se'; pair"
```

`pair` tells me who I'm committing as. `pairf` will pair me up with Foo Fooson; `pairb` will pair me up with Bar Barson. `unpair` will unpair me.

All this is done via Git's own persistent per-repository configuration.

The emails use plus addressing, supported by Gmail and some others: `all+whatever@barsoom.se` ends up at `all@barsoom.se`.

I recommend consistently putting the names in alphabetical order so the same pair is always represented the same way.

If you're quite promiscuous in your pairing, perhaps in a large team, the aliases will add up, and you may prefer something like hitch. But in a small team like ours, it's not an issue.


## Prompt

A killer feature of my solution, that doesn't seem built into hitch or other tools, is that it's easy to show in [your prompt](https://github.com/henrik/dotfiles/blob/master/bash/prompt.sh):

``` bash ~/.bash_profile
function __git_prompt {
  [ `git config user.pair` ] && echo " (pair: `git config user.pair`)"
}

PS1="\W\$(__git_prompt)$ "
```

This will give you a prompt like `~/myproject (pair: FF+HN)$ ` when paired, or `~/myproject$ ` otherwise.


## Avatars

GitHub looks better if pairs have a user picture.

You just need to [add a Gravatar](https://help.github.com/articles/how-do-i-set-up-my-avatar) for the pair's email address.

When we started committing as pairs, I toyed a little with generating pair images automatically. When [Thoughtbot wrote about pair avatars](http://robots.thoughtbot.com/how-to-create-github-avatars-for-pairs/) yesterday, I was inspired to ship something.

So I released [Pairicon](http://pairicon.herokuapp.com/), a tiny open source web app that uses the GitHub API and a free [Cloudinary](http://cloudinary.com) plan to generate pair avatars.

Try it out!
