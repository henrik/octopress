---
layout: post
title: "The Apple Watch is not a Fitbit wristband"
date: 2015-05-21 07:05
comments: true
categories:
  - Apple Watch
  - Health
---

![](/images/content/watch-pedometer.jpg)

I've previously blogged about [using the iPhone as a step counter together with the Fitbit app](http://thepugautomatic.com/2015/03/the-ten-thousand-steps/).

I had hoped that the Apple Watch could fit into this arrangement, but I'm afraid it doesn't. It does count steps, but not in a way that you can use with Fitbit challenges.

There are two ways for an iPhone app to access step data: through the pedometer (technical reference: [CMPedometer from Core Motion](https://developer.apple.com/library/ios/documentation/CoreMotion/Reference/CMPedometer_class/index.html#//apple_ref/occ/cl/CMPedometer)), or through the Health app (technical reference: [HealthKit](https://developer.apple.com/healthkit/)).

The pedometer data only comes from what the phone itself tracks. You can view it from the watch with e.g. [Pedometer++](http://pedometerplusplus.com/), but the watch will not contribute any data.

The Health data comes from *both* the phone and the watch (if there are simultaneous steps, it only counts one source for that period, giving the watch priority).

The Fitbit app uses pedometer data – the data that only comes from the phone.

They [might or might not](http://9to5mac.com/2014/10/08/fitbit-says-it-has-no-current-plans-for-ios-8-health-app-integration/) add Health integration in the future.

It does not, perhaps, make business sense for them to ever add it. The iPhone tracking seems a good way to hook users that then want a wristband (we've had a few of those at work) – but someone who can track steps on their watch might not be interested in their wristbands. On the other hand, a big community is inviting in its own right, so keeping Apple Watch users in the fold may mean more wristband sales to their Apple Watch-less co-workers, friends and family.

The [Sync Solver app]((http://syncsolver.com/) can sync data from Health to Fitbit, but these steps [do not count towards challenges](http://syncsolver.com/healthfitbit/support/#ad9a05f2) and [only sync hourly](http://syncsolver.com/healthfitbit/support/#c1486976) among [other limitations](http://syncsolver.com/healthfitbit/support/).

Thus I can't see a way to use the watch for Fitbit in a meaningful way – you still need to carry the phone around for tracking, or buy a wristband.

Please comment with any corrections or suggestions.
