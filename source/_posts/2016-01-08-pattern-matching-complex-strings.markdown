---
layout: post
title: "Pattern-matching complex strings"
date: 2016-01-09 00:45
comments: true
categories:
  - Elixir
---

We can pattern-match Elixir strings like any other binaries, with `<>` for concatenation and `<<…>>` to specify bit patterns:

``` elixir linenos:false
defmodule Example do
  def run_command("say:" <> <<digit::bytes-size(1)>> <> ":" <> thing) do
    count = String.to_integer(digit)
    String.duplicate(thing, count)
  end
  def run_command("say:" <> thing), do: thing
end

Example.run_command("say:hi")
# => "hi"
Example.run_command("say:3:hi")
# => "hihihi"
```

There is a major limitation, though: every part of a binary pattern must have a fixed width, except (optionally) the last one.

So for more complex patterns, things get tricky. What if there is more than one digit in the count, for example?

If we try to violate this fixed-width rule, Elixir will tell us off:

```elixir linenos:false
"say:" <> number <> ":" <> thing = "say:123:hi"
# ** (CompileError) a binary field without size is only allowed at the end of a binary pattern
```

If there is a limited range of lengths, adding more patterns could be fine:

``` elixir linenos:false
def run_command("say:" <> <<number::bytes-size(1)>> <> ":" <> thing), do: #…
def run_command("say:" <> <<number::bytes-size(2)>> <> ":" <> thing), do: #…
```

But if the number can be any length, this won't work.

We could give up on function-argument pattern matching and stick some logic inside a single function:

``` elixir linenos:false
def run_command("say:" <> stuff) do
  case String.split(stuff, ":") do
    [number, thing] -> # …
    [thing] -> # …
  end
end
```

This is a workable solution, but it's not quite the beautiful Elixir we know.

We can do better. What if we slice and dice the string, and *then* dispatch to function-argument pattern matching?

``` elixir linenos:false
def run_command(command) do
  do_run_command String.split(command, ":")
end

defp do_run_command(["say", number, thing]) do
  count = String.to_integer(number)
  String.duplicate(thing, count)
end
defp do_run_command(["say", thing]), do: thing
```

That's more like it. And we can keep dispatching to other functions, to unlock more pattern-matching power:

``` elixir linenos:false
defp do_run_command(["say", number, thing]) do
  count = String.to_integer(number)
  say(thing, count)
end

defp say(thing, count) when count < 100, do: String.duplicate(thing, count)
defp say(thing, _count) do: say(thing, 99) <> " etc"
```

It doesn't have to be lists, either. We can get regular expression matches as dictionaries, for example:

``` elixir linenos:false
def run_command(command) do
  regex = ~r/say:(?<number>\d+):(?<thing>.+)/
  captures = Regex.named_captures(regex, command)
  do_run_command(captures)
end

defp do_run_command(%{"number" => number, "thing" => thing}), do: #…
```

These examples are increasingly contrived, but hopefully the idea comes across.
