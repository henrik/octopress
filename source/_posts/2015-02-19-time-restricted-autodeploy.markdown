---
layout: post
title: "Time-restricted autodeploy"
date: 2015-02-19 22:47
comments: true
categories:
  - Continuous Delivery
---

[At work](http://dev.auctionet.com/), we had CI automatically deploy our projects when all tests pass.

Except, that is, for our main site. It's our biggest project, with the most complex deploy process, and the most uptime-sensitive.

We worried that a quick commit in the evening or weekend might cause issues at a time when no one wanted to deal with them.

But manually triggering deploys got old. People forgot, or didn't want to be the one pulling the trigger in case something went wrong. We tried [rageguys](https://twitter.com/henrik/status/428157996913688578) (one per 5 commits). We tried [suggesting a deployer based on commit counts](https://twitter.com/henrik/status/476982655393996800).


## The benefits of autodeploy

We're strong believers in [continuous delivery](http://en.wikipedia.org/wiki/Continuous_delivery), and continuous deployment is part and parcel of that. Changes should go into production quickly so we get feedback (including bugs and exceptions) as soon as we can. Without automation, deployment won't be as continuous as it can be.

Automatic deploys *are* scary. When you juggle servers, things can go wrong. But [if it hurts, do it more often](http://martinfowler.com/bliki/FrequencyReducesDifficulty.html). You'll see the patterns, and you'll fix it.


## Office hours

As much as we like continuous delivery, we prefer it to keep office hours.

We realized that we could turn on autodeploy *and* reduce the risk of after-hours issues by simply making it keep a schedule.

When tests pass, we trigger another CI job to deploy staging. That job runs this bash script:

``` bash script/ci/build/deploy_staging.sh linenos:false
# …deploy staging…

allow_autodeploy=`TZ=CET ruby script/ci/support/is_autodeploy_allowed.rb`

# …conditionally trigger a production deploy…
```

Note that it specifies the time zone for the Ruby script (we're on CET) in case the host machine is in another time zone.

See [the code of our `is_autodeploy_allowed.rb` and its test](https://gist.github.com/henrik/7f817afcc3c53f665d5d).

The `is_autodeploy_allowed.rb` script outputs `"true"` or `"false"` for the bash variable. That value is then used to determine whether it should trigger a production deploy. We also make provisions for manual deploys, allowing them at any time.

The details of the deploy scripts and of setting up a CI chain are outside the scope of this post: I just want to give some idea of how you might integrate a time restriction into whatever you use now, or end up using. We happen to use [Jenkins](http://jenkins-ci.org/) for this project. [He's okay!](http://www.imdb.com/title/tt0073629/quotes?item=qt0437239)

Our `is_autodeploy_allowed.rb` script allows autodeploys during weekdays from 8:30 (the earliest time someone is at the office) until lunch. Then from 13:00 until 18:00 (when most people leave).

On Fridays, autodeploys stop at 16:30 per [this diagram](https://twitter.com/iamdevloper/status/450905958139834368).

If CI doesn't autodeploy, it will instead output the correct manual deployment command in our chat room, for copy-and-pasting.

If you've been scared of autodeploys, maybe a time restriction can ease your fears.
