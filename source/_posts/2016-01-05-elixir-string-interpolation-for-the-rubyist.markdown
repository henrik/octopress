---
layout: post
title: "Elixir string interpolation for the Rubyist (and others)"
date: 2016-01-05 23:45
comments: true
categories:
  - Elixir
---

On the surface, Elixir string interpolation looks identical to what we know from Ruby:

``` ruby ruby.rb linenos:false
"Hello #{:world}"
# => "Hello world"
```

``` elixir elixir.exs linenos:false
"Hello #{:world}"
# => "Hello world"
```

But the similarities soon break down:

``` ruby ruby.rb linenos:false
"Hello #{[:a, :b]}"
# => "Hello [:a, :b]"

"Hello #{ArgumentError.new}"
# => "Hello ArgumentError"
```

``` elixir elixir.exs linenos:false
"Hello #{[:a, :b]}"
** (ArgumentError) cannot convert list to string. The list must contain only integers, strings or nested such lists; got: [:a, :b]

"Hello #{ %ArgumentError{message: "hi"} }"
** (Protocol.UndefinedError) protocol String.Chars not implemented for %ArgumentError{message: "hi"}
```

What's going on? It's a difference in philosophy.


## Ruby

In Ruby, string interpolation implicitly calls the `#to_s` method (with no arguments) on the value. So these are equivalent:

``` ruby ruby.rb linenos:false
"Hello #{:world}"
"Hello " + :world.to_s
```

The `#to_s` convention in Ruby is *very* inclusive. Almost everything in Ruby implements it. Either a class comes with its own implementation that provides a somewhat meaningful string representation (such as `Time#to_s` giving values like `"2016-01-05 18:20:41 +0100"`), or it inherits `Object#to_s` with a less meaningful representation (like `"#<Object:0x007feee284e648>"`).

Only `BasicObject` and its descendants may be missing a `#to_s`:

``` ruby ruby.rb linenos:false
"Hello #{BasicObject.new}"
NoMethodError: undefined method `to_s' for #<BasicObject:0x007feee2049b00>
```

There is some interesting nuance to Ruby's `#to_s`, `#to_str` and `Kernel#String`, and similar coercion methods for other types. If you're interested, you can read all about it in [Avdi Grimm's *Confident Ruby*](http://www.confidentruby.com/), or [research it online](http://stackoverflow.com/q/11182052/6962).


## Elixir

### The `String.Chars` protocol

In Elixir, string interpolation calls the [`Kernel.to_string/1`](http://elixir-lang.org/docs/stable/elixir/Kernel.html#to_string/1) macro, which evokes the `String.Chars` [protocol](http://elixir-lang.org/getting-started/protocols.html).

[By default](https://github.com/elixir-lang/elixir/blob/058222c4bcffb398749552a9f8c5644c2cae138c/lib/elixir/lib/string/chars.ex), it handles strings, atoms (including `nil`, `true`, `false` and module name aliases like `String` – which are all just atoms behind the scenes), integers, floats, and some lists. That's it.

So, quite intentionally, Elixir will not implicitly convert just anything to a string.

This is the philosophical difference. For anything that doesn't have an obviously meaningful string representation, Elixir wants you to be explicit.

This is why we couldn't just interpolate the `ArgumentError` struct above, or any other struct, or indeed tuples or maps.

So how can I interpolate my tuple, map, struct, or some lists?

### The `Inspect` protocol

The simplest thing is to use [`Kernel.inspect/2`](http://elixir-lang.org/docs/stable/elixir/Kernel.html#inspect/2):

``` elixir elixir.exs linenos:false
"Hello #{inspect {:a, :b}}"
# => "Hello {:a, :b}"
```

It behaves quite like `#inspect` in Ruby – even to the extent that any representation that can't be evaluated as code starts with a `#` sign:

``` ruby ruby.rb linenos:false
[:a, :b].inspect
# => "[:a, :b]"

lambda {}.inspect
# => "#<Proc:0x007fb94a8c94b0@(irb):1 (lambda)>"
```

``` elixir elixir.exs linenos:false
inspect({:a, :b})
# => "{:a, :b}"

inspect(fn -> :x end)
# => "#Function<20.54118792/0 in :erl_eval.expr/5>"
```

Unlike `String.Chars` (but a bit like `#to_s` in Ruby), this protocol is [configured to allow any input](https://github.com/elixir-lang/elixir/blob/3b601660d4d4eb0c69f824fcebbbe93a3f2ba463/lib/elixir/lib/inspect.ex#L55-L56), and [makes an effort](https://github.com/elixir-lang/elixir/blob/3b601660d4d4eb0c69f824fcebbbe93a3f2ba463/lib/elixir/lib/inspect.ex#L512-L528) to handle anything you throw at it.

### Implementing the `String.Chars` protocol

If we want to get fancy, we could implement the `String.Chars` protocol for one of our structs. This lets us use plain interpolation (without explicitly calling a function like `inspect`), and it also lets us control the string representation.

It's quite simple:

``` elixir elixir.exs linenos:false
defmodule User do
  defstruct [:name]
end

defimpl String.Chars, for: User do
  def to_string(user), do: "User #{user.name}"
end

defmodule Run do
  def run do
    IO.puts "Hello #{ %User{name: "José"} }"
  end
end

Run.run
# => "Hello User José"
```

### Lists

Oh, and I mentioned that `String.Chars` handles "some lists".

``` ruby ruby.rb linenos:false
"Hello #{[119, 111, 114, 108, 100]}"
# => "Hello [119, 111, 114, 108, 100]"
```

``` elixir elixir.exs linenos:false
"Hello #{[119, 111, 114, 108, 100]}"
# => "Hello world"
```

These are [the delightful char data](/2015/12/char-data/) lists – representing a string as a lists of strings, integer codepoints or other such lists.

The `String.Chars` implementation for lists will call [`List.to_string/1`](http://elixir-lang.org/docs/stable/elixir/List.html#to_string/1), which mostly consists of calling through to `:unicode.characters_to_binary/1`. And [`IO.chardata_to_string/1`](http://elixir-lang.org/docs/stable/elixir/IO.html#chardata_to_string/1), when given a list, calls through to that very same Erlang function.
