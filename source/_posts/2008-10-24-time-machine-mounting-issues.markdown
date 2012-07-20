---
wordpress_id: 254
title: Time Machine mounting issues
categories:
- OS X
date: 2008-10-24 21:44
layout: post
comments: true
---
When Time Machine won't work, I've found it's often a matter of the drive being mounted already, by the user. Time Machine wants to mount the drive as itself (backupd). Console.app can often tell you if this is the case.

Sometimes, it's enough to eject the drive in the Finder. If that doesn't work, or you don't see it there, fire up Terminal.app and do

``` bash
ls /Volumes
```

If it lists your drive, try

``` bash
diskutil unmount /Volumes/Backup
```
or whatever the name is.

If you get

    Unmount blocked by dissenter with status code 0x0000c001 and message (null)
    Unmount failed for /Volumes/Backup

then try

``` bash
diskutil unmount force /Volumes/Backup
```

A related issue: when setting up Time Machine to use a certain drive, you'll need to have it mounted to be able to select it, but after that you may need to manually eject it, before it can be used for backing up.
