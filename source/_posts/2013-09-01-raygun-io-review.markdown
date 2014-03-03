---
layout: post
title: "Review: Raygun error reporting"
date: 2013-09-01 11:55
comments: true
categories:
  - Review
  - Tools
---

## Disclaimer

I'll start this off with a disclaimer: [Raygun](http://raygun.io), an error reporting service, asked me if I would review them on my blog in return for a free account. They made it very clear that they wanted honest feedback, not to buy a positive review.


## Why you should use an error reporting service

Whichever one you pick, I very much recommend using *some* error reporting service.

Swallowing exceptions is quite irresponsible if your app is important. Exceptions are the test failures of the wild™.

Mailing exceptions with [some free plugin](https://github.com/rails/exception_notification) is better than nothing, but you won't get things like intelligent grouping and notification, exception states and comments shared within a team, statistics, or chat notifications.


## Raygun

I've been using [Honeybadger](https://www.honeybadger.io) for almost a year, so that will be my baseline. I switched to Honeybadger from [Airbrake](htts://airbrake.io) because their UI got frustratingly slow and they didn't seem to address it.

First and of the least significance, I like the name. Short, memorable and evocative of old sci-fi. I always forget what Honeybadger is called.


### Responsiveness to feedback

Responsiveness to feedback is pretty important to me in a service. I tend to notice a lot of bugs and have a lot of opinions on interfaces.

Raygun have been great about this. Submitting feedback right in their dashboard is super easy via [Intercom.io](https://www.intercom.io/), and they reply quickly [on Twitter](http://twitter.com/raygunio). They seem to appreciate the feedback and act on it.


### Stack agnostic

Raygun is stack agnostic for better or worse. It supports Ruby on Rails and Ruby in general, Java, .NET and a bunch more, including submission by a REST API for anything they missed.

By comparison, Honeybadger is geared toward Ruby/Rails specifically, and it shows. Backtraces in Honeybadger intelligently filter out lines outside your app, and intelligently strip the Rails root out of the file paths. It can even link to the line of code in context on GitHub.

As a mostly Ruby and Rails developer, I do appreciate those things, but if you deploy on other stacks, Raygun would be the better choice.


### Intelligent notifications and grouping

Raygun can notify by e-mail and to e.g. HipChat, Campfire, Trello and GitHub out of the box. There's no read API yet for things like your custom dashboard, but [webhooks may be in the works](https://twitter.com/raygunio/status/374087983307059200).

[Raygun claims](http://raygun.io/features) to do smart notification throttling:

> Raygun doesn't send you emails for every error. It intelligently keeps you posted on changes based on first sightings, recurrence, rate increases and threshold changes.

I haven't used it enough to speak to that, but I did notice Raygun correctly (in my view) grouped two occurrences together that Honeybadger saw as separate, so I have some faith in the smarts.


### Managing exception state

Raygun exceptions can be active, resolved, ignored or permanently ignored.

The difference isn't explained clearly in the UI, so I found it confusing at first, but I think it's pretty clever now that I get it.

"Active" is for new exceptions. "Resolved" and "Ignored" do the same thing – making the exception non-active – but having two buckets with separate meanings is valuable. You can "resolve" an error when you believe it's fixed for good; you can "ignore" an error when it's not important to address right now.

"Permanently ignored" is for e.g. errors triggered by bots, that you'll never fix. Honeybadger has the same feature, and I'm of two minds about it. I prefer to rescue those things in my app, not in my error reporting service of the day, but pragmatically it can take hours to code and test a fix, so just ignoring it may be a better return on investment.


### UI

![Screenshot of Raygun dashboard](http://f.cl.ly/items/1W3j0X2r152I1G2A0e3r/Screen%20Shot%202013-09-01%20at%2011.17.14.png)

Raygun has a pretty and modern UI, but I feel it's a little wasteful of space and doesn't always order content optimally.

It's also on the slow side compared to Honeybadger. Honeybadger is optimized for both loading speed and speed of use, with keyboard shortcuts, quick flows and compact information with the most important stuff at the top. That's hard to give up when you've had it.

For example, Honeybadger lets you resolve errors with one click from the error list view or from the individual error view. In Raygun, it's three clicks from the list view and two clicks from the individual error view.

Honeybadger also has some details I prefer over Raygun's UI: putting the exception class next to the exception message, giving a full linked URL to the offending page, showing the user agent and bot status graphically.

On Raygun, the "Latest Error Reports" list is just too far down the page. Honeybadger has it about 300 px down the page; Raygun has it about 900 px down the page. That would be offscreen on a small monitor.


### Graphs and activity log

The things that push down the content are pretty cool, though. There are graphs of error counts over time.

![Screenshot of Raygun error count graph](http://f.cl.ly/items/03471e3g243m302i0039/Screen%20Shot%202013-09-01%20at%2011.43.01.png)

The activity log that mixes comments and occurrences is very clever; by comparison, the Honeybadger comments are tucked away at the bottom of the page where they see little use.

![Screenshot of Raygun activity log](http://f.cl.ly/items/1b0l1o2Y192b2z3U3Q2R/Screen%20Shot%202013-09-01%20at%2011.38.19.png)


### Overall impression

All in all, I think Raygun has all the things you would expect, good smarts and some cool features. The main thing that would make me reluctant to switch from Honeybadger is the speed issue: in terms of page load times and ease of use.
