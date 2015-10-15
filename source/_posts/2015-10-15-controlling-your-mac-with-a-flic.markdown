---
layout: post
title: "Controlling your Mac with a Flic"
date: 2015-10-15 20:15
comments: true
categories:
  - Automation
  - OS X
  - Ruby
---

I just got the [Flic](https://flic.io?r=98459f) (referral link) from [an Indiegogo campaign](https://www.indiegogo.com/projects/flic-the-wireless-smart-button#/) I helped fund almost a year ago.

It's a pretty little push button that connects to your phone over Bluetooth. Click, double-click or hold it to trigger actions.

I don't quite remember what I wanted it for originally. My Apple Watch can do many of the things it does: find my phone, control audio playback on the phone.

There might be some fun use cases if it could control a computer, though. I've wanted a "pause music playing on any of our computers" button for some time. A computer could do that via some AppleScript and shell commands.

Flic can currently only pair with an iOS or Android device, so I set out to figure out a way to make it control my computer anyway. Mostly for the fun of it.

Note that these instructions are aimed at other developers. If it's gibberish to you, please let Flic know you want this feature built in and wait for that to happen.

With that out of the way:

The basic idea is for Flic to talk to your phone, for the phone to then make a HTTP request to your computer over the local network, and for a tiny web app on the computer to then do your bidding.

This means there are a couple of gotchas. It won't work if your phone is not in Bluetooth range of the button. Your phone and your computer must be on the same network.

## Sinatra app

On my computer, I made a tiny [Sinatra](http://www.sinatrarb.com/) app:

``` ruby ~/apps/flic/config.ru
require "sinatra"

get "/click" do
  system("say", "hello world")
  "OK!"
end

run Sinatra::Application
```

You may need to `(sudo) gem install sinatra` to get this library.

This example app runs the shell command `say "hello world"`, which on OS X will speak those words. But you could do *anything* here.

Then it just returns "OK!" as the response text.

## Pow

To keep the web app running, I use [Pow](http://pow.cx/). Once it's installed, enabling this project is just

```
cd ~/.pow
ln -s ~/apps/flic
```

If you change the app code, you need to

```
mkdir tmp  # Once, so it exists.
touch tmp/restart.txt
```

to reload it.

Now you should see (and hear!) the app on <http://flic.dev/click> on your machine.

## xip.io

To conveniently access the app from your phone, you can use the [xip.io](http://xip.io/) service.

There's nothing to install: just visit <http://flic.192.168.1.2.xip.io/click>, replacing `192.168.1.2` with the IP address of that machine.

You can confirm the address works on your computer first, for convenience. Then make sure it works from your phone. (They need to be on the same network.)

## Configure the Flic app

Now just configure the Flic app to use the "HTTP Request" action.

The URL should be the `xip.io` URL above.

The HTTP method should be "GET" in this case.

You can specify "Show response: No" if you don't want that feedback.

If you want to handle double-clicks and holds as well, just add them to your Sinatra app (and restart it):

``` ruby
get "/click" do
  system("say", "click")
  "OK!"
end

get "/double_click" do
  system("say", "double click")
  "OK!"
end

get "/hold" do
  system("say", "hold")
  "OK!"
end
```

Then change the URL path accordingly.


## Press the Flic

Press the Flic. Your computer should run the command.

If anyone else sets this up, I'd love to hear what you use it for!
