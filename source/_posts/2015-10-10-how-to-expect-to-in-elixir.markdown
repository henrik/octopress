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

ESpec's `expect` function actually returns a tuple like `{Expect, pet}`, containing a module name and the argument. So we effectively have

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


## Minimal `expect(…).to` implementation

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

It's been surprisingly difficult to figure out what this is. It might be making use of Erlang's [tuple modules](http://stackoverflow.com/questions/16960745/what-is-a-tuple-module-in-erlang). And/or it's related to [records](http://elixir-lang.org/docs/v1.1/elixir/Record.html). If you know, let me know.

Whatever it is, it seems controversial ([1](http://stackoverflow.com/questions/31954796/why-erlang-tuple-module-is-controversial), [2](https://groups.google.com/forum/#!topic/elixir-lang-talk/6EJVEXTszIc)), in large part because it can encourage writing code in an object-oriented style, with "methods" on "instances".

This post aims to clarify what this syntax is and not to promote its use in general, or the use of `expect(…).to` in particular. You be the judge of whether the syntax is worth it.
