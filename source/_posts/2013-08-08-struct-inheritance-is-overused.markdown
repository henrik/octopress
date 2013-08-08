---
layout: post
title: "Struct inheritance is overused"
date: 2013-08-08 10:41
comments: true
categories:
  - Ruby
---

Too many people inherit from `Struct.new(:some, :attributes)` as a shorthand without understanding the implications.

Take this for example:

``` ruby
class Greeter < Struct.new(:person)
  def greet
    puts "Hello, #{person.name}!"
  end
end
```

Sure, it's convenient. It saves you writing an initializer. But that's not all it does.


## Struct arguments are not required

That class will happily let you instantiate a `Greeter.new` without an argument, and later explode as `person` is unexpectedly `nil`:

``` ruby
greeter = Greeter.new
greeter.greet  # => raises NoMethodError: undefined method `name' for nil:NilClass
```

A struct that takes five arguments will happily instantiate with four, or one, or none.

This may be exactly what you want, but if not, don't inherit from `Struct`.


## Structs create public accessors

Your `Greeter` instances will have public `person` and `person=` methods.

``` ruby
greeter = Greeter.new(joe)
greeter.person = bob
greeter.person  # => bob
```

If you don't need them, the public interface of your class will be larger than necessary. Encapsulation of `person` is poor.

This may be exactly what you want, but if not, don't inherit from `Struct`.


## Structs suggest a data container

To me, `Struct` is a data container; a glorified hash.

They're excellent when data containment is all you need:

``` ruby
Item = Struct.new(:title, :price, :url)

def parse
  …
  item = Item.new(link.title, price.content, link.href)
  …
end
```

But when you're modelling a domain concept and expect to have domain behavior, inheriting from a data container is weird.

`Struct` has [a bunch of data container methods](http://www.ruby-doc.org/core-2.0/Struct.html) that your class will inherit: `length`, `members`, `each_pair`, `values`, `values_at` and more.

Do you think of your class as a specialized data container? If not, don't inherit from `Struct`.


## Alternatives

The obvious alternative is to just type it out:

``` ruby
class Greeter
  def initialize(person)
    @person = person
  end

  def greet
    puts "Hello, #{@person.name}!"
  end
end
```

But the boilerplate *can* get annoying to type all the time, and it *can* distract the reader from the interesting bits.

If you want to encapsulate `@person` in a private reader, that's even more boilerplate.

I wrote the [attr\_extras](https://github.com/barsoom/attr_extras) gem for this purpose. [Where I work](http://barsoom.se), we use it in every project.

With `attr_extras` you could do:

``` ruby
class Greeter
  attr_initialize :person
  attr_private :person

  def greet
    puts "Hello, #{person.name}!"
  end
end
```

Or shorter but more obscure:

``` ruby
class Greeter
  pattr_initialize :person

  def greet
    puts "Hello, #{person.name}!"
  end
end
```

You don't inherit anything, all arguments are required, and there are no public accessors unless you explicitly declare them.

To be clear, I think there are valid cases for inheriting from `Struct.new`. I think many people do it in other cases as well, though, because they're not aware of the implications.
