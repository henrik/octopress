---
layout: post
title: "Understanding Elixir macros"
date: 2015-10-31 16:25
comments: true
categories:
  - Elixir
  - Macros
---

Elixir macros are conceptually quite simple, though they can be daunting when you're starting out.

It took me plenty of flailing about to get a clear [mental model](https://en.wikipedia.org/wiki/Mental_model) of how they work, and plenty of experimentation.

I thought I'd write up some of my insights, in case they help others get there sooner.

This is not [a "write your first macro" tutorial](http://elixir-lang.org/getting-started/meta/macros.html). The reader is expected to have made at least an attempt or two at writing macros, but may still feel that they're hard to grasp.


## Compile-time vs. run-time

Consider this example:

``` elixir example.ex linenos:false
defmodule MyMacro do
  defmacro example({value, _, _}) do
    IO.puts "You'll see me at compile-time: #{inspect value}"

    quote do
      IO.puts "You'll see me at run-time: #{inspect unquote(value)}"
    end
  end
end

defmodule Lab do
  import MyMacro

  def run do
    IO.puts "Someone called the run function."
    example(hello)
  end
end
```

Let's compile that file:

    $ elixirc example.ex
    You'll see me at compile-time: :hello

And now let's call the `Lab.run` function:

    $ elixir -e Lab.run
    Someone called the run function.
    You'll see me at run-time: :hello

What is happening here is crucial to understanding macros.

Even though we put `example(hello)` inside the `run` function, the macro executes *when we compile the file*. So the macro runs at compile-time.

It doesn't matter whether or not we'll ever call the `Lab.run` function. We could even do something like `if false, do: example(hello)`. The macro will still run when we compile.

So why don't we see the "You'll see me at run-time" message at compile-time?

[`quote`](http://elixir-lang.org/docs/stable/elixir/Kernel.SpecialForms.html#quote/2) will turn Elixir code into an abstract syntax tree (AST), without executing that code:

    iex(1)> quote do: IO.puts("Hello")
    {{:., [], [{:__aliases__, [alias: false], [:IO]}, :puts]}, [], ["Hello"]}

So the return value of the macro is an AST much like `{…, [], ["Hello"]}`. The code inside the block is never executed at compile time.

The compiler will then effectively replace `example(hello)` with the code represented by this return value, as though we had written

``` elixir linenos:false
def run do
  IO.puts "Someone called the run function."
  IO.puts "You'll see me at run-time: #{inspect :hello}"
end
```

This also implies that you want to do as much work as possible outside the `quote` block, because that work will only happen during compilation, and not on each run.


## AST in, AST out

Another crucial insight is that macros simply take an abstract syntax tree (AST) as input, and return another as output. Anything else is just implementation details.

(To be accurate, macros don't *have* to take any input or return any output. But they typically do. And when they do, it's all ASTs.)

These ASTs are sometimes called "quoted expressions" in Elixir, because you can use [`quote`](http://elixir-lang.org/docs/stable/elixir/Kernel.SpecialForms.html#quote/2) to create them from code expressions.

But `quote` is just one of those implementation details. It's just a convenience. You can write a macro without it. Elixir doesn't care how you build the AST:

``` elixir linenos:false
defmodule MyMacro do
  defmacro example do
    {:+, [], [1, 2]}
  end
end

defmodule Run do
  import MyMacro

  def run do
    IO.puts example()
  end
end

Run.run  # => Output: 3
```

Because `quote` is just a detail, it also doesn't have to be the last thing you do in the function, and you can do it more than once. For example, with `Enum.map`:


``` elixir linenos:false
defmodule MyMacro do
  defmacro make_methods(numbers) do
    Enum.map numbers, fn (num) ->
      quote do
        def unquote(:"say_#{num}")() do
          IO.puts unquote(num)
        end
      end
    end
  end
end

defmodule Run do
  import MyMacro

  make_methods([1, 2])

  def run do
    say_1
    say_2
  end
end

Run.run
```

The `Enum.map` returns a list of ASTs. A list of ASTs is just another, more complex AST.

We can verify this with a smaller experiment:

    iex(1)> Code.eval_quoted [ quote(do: IO.puts(1)), quote(do: IO.puts(2)) ]
    1
    2

If you want a more useful example, I implemented a [`regex_case` macro](https://gist.github.com/henrik/d482d41288d732f97f2d) that liberally mixes `quote` with "raw" ASTs.


## Visualizing the AST

It can be hard for a human brain to parse a complex AST accurately.

I think much more clearly if I can visualize things, so I made [a small Phoenix app called QED](http://qed.elixir.pm/) to show Elixir ASTs.

It looks something like this:

![QED screenshot](https://s3.amazonaws.com/f.cl.ly/items/1D1I0q453B1A23092z2a/Screenshot%202015-10-31%2016.42.01.png)

[Try it out.](http://qed.elixir.pm)


## Questions?

Please let me know if anything above is unclear, or if I got anything wrong.

Also, if there is anything else about Elixir macros that you find hard to grasp, do write a comment. I enjoy figuring these things out.
