---
wordpress_id: 222
title: irb readline support on Leopard
categories:
- Ruby
- OS X
date: 2008-03-22 22:40
layout: post
comments: true
---
The <code>irb</code> (Interactive Ruby) that ships with OS X Leopard does not have <code><a href="http://en.wikipedia.org/wiki/GNU_readline">readline</a></code> support. Instead it uses <a href="http://www.thrysoee.dk/editline/">libedit</a>.

This means that things like <code>⌃R</code> for reverse history search don't work. More importantly to me, you can't use non-ASCII characters like Swedish "å", "ä" and "ö".

Compiling your own Ruby (with readline) is one solution. If you just want ctrl+R, <a href="http://www.macosxhints.com/article.php?story=20080313113705760">macosxhints has another</a>.

The solution I'm currently using is the work of jptix, a regular on the <a href="irc://irc.freenode.net/##textmate">##textmate</a> IRC channel. He asked me to blog about it, so here it is.

<!--more-->

Get <a href="http://www.macports.org/">MacPorts</a> and install <code>readline</code> (you must specify <code>+universal</code>, even on Intel):

``` bash
sudo port install readline +universal
```

Get the Ruby extension for <code>readline</code>:

``` bash
svn co http://svn.ruby-lang.org/repos/ruby/tags/v1_8_6_111/ext/readline/ readline
```

Apply <a href="http://pastie.textmate.org/168767">a small patch</a> to <code>readline/extconf.rb</code>:

``` bash
curl http://pastie.textmate.org/pastes/168767/download | patch readline/extconf.rb
```

Compile and install the extension. You likely need the <a href="http://developer.apple.com/tools/download/">OS X developer tools</a>, or have a C compiler from elsewhere:

``` bash
cd readline
ruby extconf.rb
make
sudo make install
```

All döne. Håppy häcking.
