---
layout: post
title: "Pow port forwarding with Vagrant"
date: 2013-03-01 19:26
comments: true
categories:
  - Vagrant
  - Pow
  - OS X
---

We're experimenting with [Vagrant](http://www.vagrantup.com/) virtual machines for development.

To use your host machine browser against a virtual machine web server, Vagrant must [forward](http://docs.vagrantup.com/v1/docs/config/vm/forward_port.html) some host machine port to the server's port.

So on your host machine, you may use `http://localhost:8001` for app1 and `http://localhost:8002` for app2.

This avoids port conflicts, but it's a bit rough.

If you have [Pow](http://pow.cx/) installed on your OS X host machine, though, you can use its [port proxying](http://pow.cx/manual.html#section_2.1.4) feature. Just do this:

``` bash
echo 8001 > ~/.pow/app1
echo 8002 > ~/.pow/app2
```

You can now use `http://app1.dev` instead of `http://localhost:8001`, and `http://app2.dev` instead of `http://localhost:8002`.
