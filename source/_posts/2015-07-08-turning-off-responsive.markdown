---
layout: post
title: "Turning off responsive"
date: 2015-07-08 23:35
comments: true
categories:
  - Responsive design
---

We made [Auctionet.com](https://auctionet.com) responsive, and then some customers wanted the old site back. Turns out they liked the overview you get with a scaled-down desktop site.

My first reaction was "won't fix" – we'd just thrown away the old non-responsive code, and good riddance.

But then I realized we could add back a "desktop mode" with almost no code – so we did. It's pretty obvious once you think of it – I'm [not](http://stackoverflow.com/q/22423687/6962#comment34101665_22423687) the first. But here it is:

On mobile browsers (as detected by user agent), we show a desktop/mobile toggle link.

The link just causes a "desktop_mode" cookie to be set or unset.

If the cookie is set, our pages say

``` html
<meta name="viewport" content="width=1000">
```

instead of

``` html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

so the mobile browser renders the page at 1000px width. For us, that's the minimum width that doesn't trigger small-display breakpoints.

And that's it!

If you want to see it in action, [visit Auctionet.com](https://auctionet.com/) in a mobile browser or emulator (like [the one built into Chrome](https://developer.chrome.com/devtools/docs/device-mode)). The toggle is at the very bottom.

We only show the toggle links to mobile browsers, because desktop browsers don't respect `viewport` declarations, so it would have no effect there.

Ideally, browsers would be detected by feature (whether they respect `viewport`) and not by user agent, but [this seems difficult to achieve](http://stackoverflow.com/questions/5636774/best-method-to-determine-if-viewport-or-standard-browser).

If a mobile browser has a viewport at 1000px or wider (e.g. a landscape iPad), the toggle won't be meaningful. I didn't bother with that case (the user is likely to ignore the toggle), but you can if you like.
