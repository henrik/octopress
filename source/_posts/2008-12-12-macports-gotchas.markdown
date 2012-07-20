---
wordpress_id: 264
title: "MacPorts gotchas: staging ncurses, running mysql5"
categories:
- OS X
- SQL
- Git
date: 2008-12-12 16:07
layout: post
comments: true
---
Got my computer back from repairs. I'm reinstalling most things instead of just restoring from backup, to get rid of some cruft.

Ran into some gotchas when installing from <a href="http://www.macports.org/">MacPorts</a> that I thought I'd blog here for my own future reference and for others. This stuff is on Google, but can be hard to find.

<!--more-->

<h4>Running MySQL 5</h4>

I installed MySQL 5 with

``` bash
sudo port install mysql5 +server
```

Trying to start it with <code>mysql5</code> gave the error

    ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/opt/local/var/run/mysql5/mysqld.sock' (2)

There were a lot of mentions of this on Google, but solutions were hard to find.

What worked for me was to run

``` bash
sudo mysql_install_db5 --user=mysql
```
which I believe creates the required default databases, then start MySQL with

``` bash
sudo /opt/local/etc/LaunchDaemons/org.macports.mysql5/mysql5.wrapper start
```

<h4>Staging ncurses</h4>

I tried to install some ports (<code>git-core</code>, <code>readline</code>) that have <code>ncurses</code> as a dependency.

Installation seemed to get stuck at

    --->  Staging ncurses into destroot

The issue was as <a href="http://www.nabble.com/ncurses-install-hangs-td20580633.html">described here</a>.

Fixed by running

``` bash
sudo port clean --all ncurses ncursesw
sudo port upgrade ncursesw
sudo port install ncurses
```

After that, the ports that had previously stuck now completed fine.
