---
layout: post
title: "Testing callbacks in Elixir"
date: 2015-09-20 11:15
comments: true
categories:
  - Elixir
  - ExUnit
  - Testing
---

Say you have this code:

``` elixir example.ex
defmodule Example do
  def run(callback) do
    callback.(:hello, :world)
    do_more_stuff
  end
end
```

You want to assert that it calls back with `:hello` and `:world`.

It might not be immediately clear how to do that in ExUnit.

``` elixir example_test.exs
test "callback runs" do
  callback = fn (greeting, celestial_body) ->
    # ?
  end

  Example.run(callback)

  #?
end
```

We could assert inside the callback… but if the callback never runs, the assertion won't run either.

In a language like Ruby, you could do it by changing state outside the anonymous function:

``` ruby example_test.rb
did_it_run = false
fun = -> { did_it_run = true }
fun.()
assert did_it_run
```

But with Elixir's immutability, we would need to start a server process to do something similar – a bit of a bother.

There are other ways to communicate than shared state, though. Message passing to the rescue!

``` elixir example_test.exs
test "callback runs" do
  callback = fn (greeting, celestial_body) ->
    send self, {:called_back, greeting, celestial_body}
  end

  Example.run(callback)

  assert_received {:called_back, :hello, :world}
end
```

We simply [`send`](http://elixir-lang.org/docs/v1.0/elixir/Kernel.html#send/2) a message to our own process from the callback. Now it's in our process mailbox.

Then we [assert](http://elixir-lang.org/docs/v1.0/ex_unit/ExUnit.Assertions.html#assert_received/2) that we received it.

Quite elegant!
