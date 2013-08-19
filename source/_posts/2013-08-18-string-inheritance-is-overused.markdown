---
layout: post
title: "String inheritance is overused"
date: 2013-08-18 20:11
comments: true
categories:
- Ruby
---

Inheriting from `String` as a shortcut for classes that initialize with strings isn't necessarily a great idea.

I've seen it used most recently to define a `DNA` class on [exercism.io](http://exercism.io), e.g.

``` ruby
class DNA < String
  def to_rna
    gsub("T", "U")
  end
end

dna = DNA.new("GATTACA")
dna.to_rna  # => "GAUUACA"
```

This is often misguided for [much the same reasons that inheriting from `Struct` is](/2013/08/struct-inheritance-is-overused/).


## String arguments are not required

Your subclass will happily do this:

``` ruby
dna = DNA.new
```

Unlike with `Struct` inheritance, a missing argument won't cause a method like `#to_rna` to explode with `nil` errors, as `self` will still be an empty string. Instead of exceptions you risk unexpected behavior, like empty strands of DNA kicking around your application. Exploding would be preferable.


## String subclassing suggests a string

By subclassing `String` you suggest that `DNA` is a specialized string.

It will get [a ton of methods](http://ruby-doc.org/core-2.0/String.html) in its API, such as `#upcase!`, `#match`, `#valid_encoding?` and `#each_line`. Do those make sense for your class?

With the `DNA` class above, it's impossible to tell what subset of methods you intended to inherit and think make sense for this class. Only the initializer? Also `#to_s`? You should only inherit a class when all its methods make sense for the subclass.

If it's the initializer you want, just write your own or use [some library to reduce boilerplate](http://github.com/barsoom/attr_extras). If it's some other method, delegate those to a string – composition instead of inheritance. It will make the API of your class clearer.


## Strings are equal if their values are equal

With `DNA`, it's probably reasonable that `DNA.new("GATTACA") == DNA.new("GATTACA")`. If that's not how you want identity to work, though, be aware that your class will inherit this behavior.


## Inheriting core classes comes with gotchas

[Steve Klabnik mentions](http://words.steveklabnik.com/beware-subclassing-ruby-core-classes) some gotchas of inheriting a core class like `String`.

`#to_s` is not called implicitly with interpolation. Your initializer won't always be called.

You won't trigger these gotchas most of the time, but some time you might, and it's easily avoided by not inheriting from `String`.
