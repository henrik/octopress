---
wordpress_id: 45
title: Getting the current UNIX timestamp with AppleScript
categories:
- OS X
- AppleScript
date: 2006-09-02 10:31
layout: post
comments: true
---
Since I couldn't find the answer on Google when I needed it:

``` applescript
(do shell script "date +%s") as integer
```
Or, verbosely (and possibly not portable across date formats):

``` applescript
current date - time to GMT - date "1970-01-01"
```
