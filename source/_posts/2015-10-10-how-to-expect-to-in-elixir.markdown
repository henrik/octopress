---
layout: post
title: "How to \"expect(…).to\" in Elixir"
date: 2015-10-10 02:40
comments: true
categories:
  - Elixir
---

When I first came across [ESpec](https://github.com/antonmi/espec), I was perplexed by syntax like

``` elixir
expect(pet).to be("Cat")
```

That doesn't look like Elixir!

It is in fact a controversial feature of Erlang, that may be removed in future versions of Elixir. So you probably shouldn't use it, but it can still be interesting to know how it works.

ESpec's `expect` function returns a tuple like `{Expect, pet}`, containing a module name and the argument. So we effectively have

``` elixir
{Expect, pet}.to be("Cat")
```

This, in turn, is interpreted as an `Expect.to` function call, with the tuple itself as the last argument:

``` elixir
Expect.to(be("Cat"), {Expect, pet})
```

This applies to any number of arguments. If we had done

``` elixir
{Expect, 1, 2, 3}.to(4, 5, 6)
```

then it would be interpreted as

``` elixir
Expect.to(4, 5, 6, {Expect, 1, 2, 3})
```

and so on.


## How it all fits together

This is how you might implement a minimal version of `expect(…).to`:

``` elixir
defmodule Expect do
  def to({:be, value}, {Expect, value}) do
    IO.puts("Hooray, they're both '#{value}'!")
  end

  def to({:be, expected}, {Expect, actual}) do
    IO.puts("Nay! Expected '#{expected}' but got '#{actual}' :(")
  end
end

defmodule Example do
  def run do
    expect("Cat").to be("Cat")
    expect("Cat").to be("Dog")
  end

  defp expect(actual) do
    {Expect, actual}
  end

  defp be(expected) do
    {:be, expected}
  end
end

Example.run
```

Output:

    Hooray, they're both 'Cat'!
    Nay! Expected 'Dog' but got 'Cat' :(

If you want another example of how this might be used, see [my `ExMachina.with` sketch](https://gist.github.com/henrik/bff879a97f7df44a8830).


## What is this syntax?

This is Erlang [tuple modules](http://stackoverflow.com/questions/16960745/what-is-a-tuple-module-in-erlang).

They are [controversial](http://stackoverflow.com/questions/31954796/why-erlang-tuple-module-is-controversial) in Erlang and Elixir both, and José Valim [wants them gone in Elixir 2.0](https://github.com/elixir-lang/elixir/issues/3254). Problems include hard-to-read stacktraces, slower dispatch, and that they can encourage writing code in an object-oriented style, with "methods" on "instances".
