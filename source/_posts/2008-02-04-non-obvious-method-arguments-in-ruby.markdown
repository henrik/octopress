---
wordpress_id: 209
title: Non-obvious method arguments in Ruby
categories:
- Ruby
date: 2008-02-04 13:13
layout: post
comments: true
---
I really dislike non-obvious method arguments in Ruby (and elsewhere).

Ruby doesn't have named arguments, but the idiom is to fake that with a hash argument:

``` ruby
colonel_mustard.do_it(:with => :icepick, :in => :rumpus_room)
```

Methods can take non-named arguments that are still pretty obvious. This is true for most one-argument methods like <code>print</code>. Another example is <code>alias_method</code> where the mnemonic is in the name – specify the alias, then the method (though a lot of people don't seem to get this).

Some methods take very non-obvious arguments, though. <code>Module#attr</code> takes a boolean second argument to specify whether the attribute should be writable or not. So you might do

``` ruby
attr :name, true
```

Thankfully, in many cases there are wrapper methods that abstract the non-obvious arguments into method names: in this case,

``` ruby
attr_accessor :name
```
will in effect run

``` ruby
attr :name, true
```

When there's no wrapper method, though, and you don't want to make your own, here's a tip: simply use throw-away local variables to make your code more readable. So instead of

``` ruby
do_cryptic_stuff(true, false, 5)
```
consider

``` ruby
do_cryptic_stuff(indefinitely = true, with_flair = false, minutes = 5)
```

That's it. Quite obvious, but perhaps the kind of obvious you never realize.
