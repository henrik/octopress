---
layout: post
title: "Backslashy Ruby"
date: 2015-01-08 18:59
comments: true
categories:
  - Ruby
---

Ruby 2.1 changed method definitions from returning `nil` to returning the method name:

``` ruby linenos:false
def foo; end  # => :foo
def self.foo; end  # => :foo
```

This enables shorter and [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)er code like

``` ruby linenos:false
private_class_method def self.foo
end
```

instead of

``` ruby linenos:false
def self.foo
end
private_class_method :foo
```

I've mostly used it for [Rails' `helper_method`](http://apidock.com/rails/AbstractController/Helpers/ClassMethods/helper_method) and once or twice for `private_class_method`.

I use a special syntax, though, that I would like to present for your consideration:

``` ruby linenos:false
private_class_method \
def self.foo
end

helper_method \
def current_user
end
```

The trailing backslash is just [the (rarely used) Ruby syntax](http://phrogz.net/ProgrammingRuby/language.html#sourcelayout) to say "this expression continues on the next line". You can think of it as escaping the line break so it has no effect (as a mnemonic – it's not what actually happens).

I know, it looks weird. But if you try it, I think you'll come to like it.

I see these benefits compared to the pre-2.1 style:

* By not repeating the method name, renames are easier and less bug-prone.
* It puts the method "metadata" right before the method name, instead of after the entire method body, which I think reads clearer.
* In the (admittedly rare) cases where you stack multiple "decorating" method calls (cf. [Python decorators](https://wiki.python.org/moin/PythonDecorators)), the above benefits are clearer still:

``` ruby linenos:false
memoize \
helper_method \
def expensive_calculation
  # …
end

# vs.

def expensive_calculation
  # …
end
memoize :expensive_calculation
helper_method :expensive_calculation
```

(If you want to memoize with this very syntax, see [memoit](https://github.com/jnicklas/memoit) by Jonas Nicklas.)

I see these benefits compared to the `helper_method def foo` oneliner style:

* It leaves the `def …` at the beginning of the line so the code is easier to scan.
* It puts the decorating method call on its own line, making it stand out more clearly.
* It makes line diffs less noisy.
* All of the above is even more true if you have multiple stacked decorating method calls.

It has one single downside that I can think of:

* It's unconvential, so it is likely to confuse new developers on a project.

I would argue that this is minor. Any initial headscratching is a one-time cost per developer. If they know Ruby well enough to understand the oneliner, they can make sense of this as well.

If not, feel free to send them to this post.
