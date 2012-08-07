---
layout: post
title: "Captio with multiple recipients"
date: 2012-08-04 21:30
comments: true
categories:
  - Apps
  - Tips
  - Gmail
---

I love [Captio](http://boonbits.com/captio/) ($1.99 [in the App Store](http://itunes.apple.com/app/captio-email-yourself-1-tap/id370899391?mt=8)) on my iPhone for quick notes-to-self.

You launch the app, type, hit the "Send" button and it mails you the note.

It only has one "Send" button, though, and my notes are sometimes for work, sometimes for home.

I came up with a simple workaround [until Captio adds multiple-recipient support](https://twitter.com/benlenarts/status/230407417211518976). It assumes you use Gmail.

Simply set up a Gmail filter that forwards all Captio mail containing the word "jj" to your work e-email, and then type "jj" in those notes. "jj" is quick to type, unlikely to yield false positives, isn't autocorrected, and suggests your **j**ob.

## Instructions

In the Gmail search box, type or paste

    from:(captio@boonbits.com) jj

and click the "Show search options" triangle on the right side of the search box.

![Screenshot](http://f.cl.ly/items/2u1S2d1c3f2n3J0j1V2S/filter.png)

Then click "Create filter with this search", and make it skip the inbox and forward. You will need to add the forwarding address if you haven't before.

![Screenshot](http://f.cl.ly/items/0o1m383D2C3J1S1k1b0k/filter2.png)

And that's it. Just add a "jj" to your note and it goes to work instead of home.

It only matches "jj" as a separate word, not as part of a word. It's case-insensitive, so if the iPhone autocapitalizes to "Jj", that's fine.

You can, of course, use another keyword if you prefer. Or add more rules with more keywords if you want more than two different recipients.

Depending on what you want to happen, tweak the rule to not archive, or to archive *and* mark as read, or to delete instead.
