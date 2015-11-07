---
layout: post
title: "The emergent elegance of Elixir scoping"
date: 2015-11-07 00:50
comments: true
categories:
  - Ruby
  - Elixir
  - Macros
---

I've been struck by the emergent elegance of [Elixir's scoping rules](http://elixir-lang.readthedocs.org/en/latest/technical/scoping.html).

In my native Ruby, `import`/`extend` is a scattershot affair. You can do it within an individual method, but it applies to the entire module:

``` ruby linenos:false
module MyModule
  def say_hello(sender)
    puts "Hello from #{sender}."
  end
end

module MyOtherModule
  extend self

  def method_that_did_extend
    extend MyModule
    say_hello("method_that_did_extend")
  end

  def method_that_did_not_extend
    say_hello("method_that_did_not_extend")
  end
end

MyOtherModule.method_that_did_extend      # => "Hello from method_that_did_extend."
MyOtherModule.method_that_did_not_extend  # => "Hello from method_that_did_not_extend."
```

In Elixir, on the other hand, an `import` (or `require`, or `alias`) inside a function only applies *within that function*. It actually goes further than that: if it happens inside a logic branch (in e.g. an `if`, `cond` or `case`) it only applies *within that branch*.

And it's from this simple fact that the elegance emerges.


## `with` with `import`

A few days ago, I saw [this code example](https://github.com/SenecaSystems/gutenex#usage):

``` elixir linenos:false
Gutenex.begin_text
|> Gutenex.set_font("Helvetica", 48)
|> Gutenex.text_position(40, 180)
|> Gutenex.text_render_mode(:fill)
|> Gutenex.write_text("ABC")
|> Gutenex.end_text
```

It would be nice to get rid of the noise of that repetition. `import` will do it, within our current scope only, without spilling into other code:

``` elixir linenos:false
def render_gutenex do
  import Gutenex

  begin_text
  |> set_font("Helvetica", 48)
  |> text_position(40, 180)
  |> text_render_mode(:fill)
  |> write_text("ABC")
  |> end_text
end

def do_all_the_things do
  render_gutenex

  # Wouldn't compile: end_text/1 is not available here.
  # end_text
end
```

This reminds me of [the notorious JavaScript `with` statement](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/with). We could very easily implement a `with`-alike in Elixir:

``` elixir linenos:false
defmodule With do
  defmacro with(module, do: block) do
    quote do
      fn ->
        import unquote(module)
        unquote(block)
      end.()
    end
  end
end

defmodule Run do
  import With

  def run do
    with String do
      IO.puts "hi" |> reverse  # => Output: "ih"
    end

    # Wouldn't compile: reverse/1 is not available here.
    # IO.puts "hi" |> reverse
  end
end

Run.run
```

In the macro, we create and then immediately call an anonymous function, to limit the scope of the `import`.

We could also limit the scope with a dummy conditional, but this comes with a higher WTF factor:

``` elixir linenos:false
if true do
  import unquote(module)
  unquote(block)
end
```

Note that the macro function definition and the `quote do … end` block on their own would *not* limit the scope of the `import`, because they are part of the macro infrastructure. They generate some code and then effectively disappear from the scoping hierarchy.

Also note that Elixir may be gaining [something else called `with`](https://github.com/elixir-lang/elixir/issues/3902) in the future, so if you start using the above, don't get attached to the name…


## An `instance_eval` for a more civilized age

When I started out learning Elixir, I found myself wanting to understand how things like [Ecto migrations](https://hexdocs.pm/ecto/Ecto.Migration.html) work. So I painstakingly reimplemented the interesting parts of the syntax.

Let's say we want to support this:

``` elixir linenos:false
create table(:users) do
  add :name, :string
end
```

In my first implementation, I had an `add` function that you could call inside that block… and anywhere else as well. I wanted to do better.

In Ruby, I would have used [`instance_eval`](http://ruby-doc.org/core-2.2.0/BasicObject.html#method-i-instance_eval) to evaluate a block of code in a context that has an `add` method available.

By [consulting the mailing list](https://groups.google.com/d/msg/elixir-lang-talk/J5j0t_UYEnI/OmzIOD49ReYJ), the elegance of Elixir scoping was finally revealed to me.

Of course, the solution was simply to `import` a module in a limited scope, just like `with` above.

If you're interested, you can [see the implementation as a Gist](https://gist.github.com/henrik/25516815e6680e1c7a82).


## Overriding operators locally

Another elegant effect is that you can override operators within a single function, or a single logic branch.

The [Pipespect](https://github.com/alco/pipespect) library replaces the regular `|>` with one that inspects every intermediate value.

[Its implementation](https://github.com/alco/pipespect/blob/25b38113e254e0a13485d239f4575257aa830a97/lib/pipespect.ex) is all about `import`s, so the scoping rules are the same ones that we discussed above:

``` elixir linenos:false
if some_condition do
  use Pipespect
  "This will be inspected." |> String.reverse
else
  "This will not." |> String.reverse
end
```


## Out of scope

That's it. Any other interesting implications of the Elixir scoping rules? Let me know in the comments or [on Twitter](https://twitter.com/henrik)!

For some related reading, also see ["The Value of Explicitness" by Drew Olson](http://blog.drewolson.org/the-value-of-explicitness/).
