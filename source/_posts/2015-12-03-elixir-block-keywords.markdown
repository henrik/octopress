---
layout: post
title: "Elixir block keywords"
date: 2015-12-03 22:25
comments: true
categories:
  - Elixir
  - Macros
---

Exploring Elixir, I tried this:

``` elixir linenos:false
defmodule Example do
  def foobar(do: _, else: _) do
  end
end

Example.foobar do
 IO.puts "true"
else
 IO.puts "false"
end
```

And it worked. Well, in a sense. The code runs, but it outputs *both* "true" and "false".

What's going on here? Let's try another experiment:

``` elixir linenos:false
IO.inspect do
  "true"
else
  "false"
end

# => [do: "true", else: "false"]
```

[Turns out](https://groups.google.com/forum/#!topic/elixir-lang-talk/jVqCeLcaUV0/discussion) this is language-level syntactic sugar (e.g. [1](https://github.com/elixir-lang/elixir/blob/c37ea4e8740539918683eb03ca9fce28239a3cac/lib/elixir/src/elixir_tokenizer.erl#L1050-L1053), [2](https://github.com/elixir-lang/elixir/blob/c37ea4e8740539918683eb03ca9fce28239a3cac/lib/elixir/src/elixir_exp_clauses.erl), [3](https://github.com/elixir-lang/elixir/blob/c37ea4e8740539918683eb03ca9fce28239a3cac/lib/elixir/lib/macro.ex#L652)) that desugars to a plain keyword list. And that explains why the code above would output both "true" and "false" – it's equivalent to

``` elixir linenos:false
Example.foobar([do: IO.puts("true"), else: IO.puts("false")])
```

The keyword list is evaluated before it's even passed to the function, like any keyword list would be. That includes evaluating the `IO.puts` function calls.

Now that we have the full list of block keywords (from the Elixir source) we can go completely crazy:

``` elixir linenos:false
IO.inspect do
  "a"
else
  "b"
catch
  "c"
rescue
  "d"
after
  "e"
end

# => [do: "a", else: "b", catch: "c", rescue: "d", after: "e"]
```

So these are all available to your own functions, like in our `Example.foobar` example. But what use are they if every branch is evaluated all the time?

Macros to the rescue.

<a href="https://xkcd.com/208/"><img src="https://s3.amazonaws.com/f.cl.ly/items/1a201F0e150Y3E1s2X2f/everybody_stand_back.png" alt="" class="center no-box"></a>

[Elixir macros](http://elixir-lang.org/getting-started/meta/macros.html) get access to the syntax tree of a piece of code, without the code being evaluated first. They can then slice and dice the code and return another syntax tree, that *will* be evaluated.

Elixir's own `if/do/else` is [just a macro](https://github.com/elixir-lang/elixir/blob/c37ea4e8740539918683eb03ca9fce28239a3cac/lib/elixir/lib/kernel.ex#L2321-L2341) using these keyword lists.

Just for fun, we could make a macro that randomly executes one of two branches, and then always runs the `after` branch:

``` elixir linenos:false
defmodule MyMacro do
  defmacro pick([do: option1, else: option2, after: after_block]) do
    :random.seed(:os.timestamp)
    option = Enum.random([option1, option2])
    [option, after_block]
  end
end

defmodule Example do
  require MyMacro

  def run do
    MyMacro.pick do
      IO.write "dog"
    else
      IO.write "cat"
    after
      IO.puts "!"
    end
  end
end

Example.run

# Outputs either of these:
# dog!
# cat!
```

I haven't used this myself, other than in silly experiments. I can picture it being handy for some DSLs, though. If you apply this to anything interesting, please do let me know in a comment!
