---
layout: post
title: "Exceptions with documentation URLs"
date: 2014-05-27 21:25
comments: true
categories:
  - Exceptions
  - Documentation
---

In a discussion today about GitHub wikis for internal documentation, I mentioned that we include a wiki URL in some exceptions.

More than one person thought it was a great idea that they hadn't thought of, so I'm writing it up, though it's a simple thing.

For example, we send events from our auction system to an accounting system by way of a serial (non-parallel) queue. It's important that event A is sent *successfully* before we attempt to send event B. So if sending fails unrecoverably, we stop the queue and raise an exception.

This happens maybe once a month or so, and requires some investigation and manual action each time.

We raise something like this:

``` ruby
if broken?
  stop_the_queue
  raise SerialJobError, "A serial job failed, so the queue is paused! https://github.com/our_team/our_project/wiki/Serial-queue Job arguments: #{arguments.inspect}"
end
```

That wiki page documents what the exception is about and what to do about it.

This saves time: when the error happens, the next step is a click away. You don't have to chase down that vaguely recalled piece of documentation.

And for new developers that have never seen this exception nor the docs, it's pretty clear where they can go to read up.

Admittedly, it's better if errors can be recovered from automatically. But for those few cases where a page of documentation is the best solution, be sure to provide a URL in the exception message.
