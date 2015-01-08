---
layout: post
title: "Backslashy Ruby"
date: 2015-01-08 18:59
comments: true
categories:
  - Ruby
---

Ruby 2.1 changed method definitions from returning `nil` to returning the method name:

``` ruby
def foo; end  # => :foo
def self.foo; end  # => :foo
```

This enables shorter and [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)er code like

``` ruby
private_class_method def self.foo
end
```

instead of

``` ruby
def self.foo
end
private_class_method :foo
```

I've mostly used it for [Rails' `helper_method`](http://apidock.com/rails/AbstractController/Helpers/ClassMethods/helper_method) and once or twice for `private_class_method`.

I use a special syntax, though, that I would like to present for your consideration:

``` ruby
private_class_method \
def self.foo
end

helper_method \
def current_user
end
```

The trailing backslash is just [the (rarely used) Ruby syntax](http://phrogz.net/ProgrammingRuby/language.html#sourcelayout) to say "this expression continues on the next line". You can think of it as escaping the line break so it has no effect.

I know, it looks weird. But if you try it, I think you'll come to like it.

It has several benefits compared to the oneliner:

* It leaves the `def …` at the beginning of the line so the code is easier to scan.
* It puts the "decorating" method call (the `private_class_method` call, cf. [Python decorators](https://wiki.python.org/moin/PythonDecorators)) on its own line, making it stand out more clearly.
* It puts the decorating method call on its own line, making line diffs less noisy.
* It arguably scales better to multiple stacked decorating method calls, though I've only done that in [toy code](https://gist.github.com/henrik/8604570) so far:

``` ruby
memoize \
helper_method \
def expensive_calculation
  # …
end
```

(If you want to memoize with this very syntax, see [memoit](https://github.com/jnicklas/memoit) by Jonas Nicklas.)

It has one single downside that I can think of:

* It's unconvential, so it is likely to confuse new developers on a project.

I would argue that this is minor. If they know Ruby well enough to understand the oneliner, they can probably make sense of this as well (the initial headscratching is a one-time cost per developer). If not, feel free to send them to this post. You could link to it from your company styleguide.

And if you make sure to share this blog post with every Ruby developer you know, perhaps one day this syntax won't be considered unconventional at all.
