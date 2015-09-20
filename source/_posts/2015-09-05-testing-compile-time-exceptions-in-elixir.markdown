---
layout: post
title: "Testing compile-time exceptions in Elixir"
date: 2015-09-05 12:12
comments: true
categories:
  - Elixir
  - ExUnit
  - Testing
---

You can usually test exceptions this way in Elixir:

``` elixir test/my_test.exs
defmodule MyTest do
  use ExUnit.Case

  test "my test" do
    assert_raise RuntimeError, "boom", fn ->
      raise "boom"
    end
  end
end
```

But if you're writing a macro, you can raise exceptions at compile time. This won't work:

``` elixir test/my_test.exs
defmodule MyMacro do
  defmacro boom do
    raise "boom at compile time"
  end
end

defmodule MyTest do
  use ExUnit.Case

  test "my test" do
    assert_raise RuntimeError, "boom at compile time", fn ->
      import MyMacro
      boom
    end
  end
end
```

`assert_raise` makes an assertion about runtime behavior, and won't catch that raise. Incidentally, `RuntimeError` is the unfortunate default type of exceptions – they can be raised at compile time, like we do here.

Having run into this limitation twice now, I thought I'd figure out a way around it. This is what I've come up with.

First, add these `CompileTimeAssertions` to your test helper:

``` elixir test/test_helper.exs
ExUnit.start()

defmodule CompileTimeAssertions do
  defmodule DidNotRaise, do: defstruct(message: nil)

  defmacro assert_compile_time_raise(expected_exception, expected_message, fun) do
    actual_exception =
      try do
        Code.eval_quoted(fun)
        %DidNotRaise{}
      rescue
        e -> e
      end

    quote do
      assert unquote(actual_exception.__struct__) == unquote(expected_exception)
      assert unquote(actual_exception.message) == unquote(expected_message)
    end
  end
end
```

Then this will work:

``` elixir test/my_test.exs
defmodule MyMacro do
  defmacro boom do
    raise "boom at compile time"
  end
end

defmodule MyTest do
  use ExUnit.Case
  import CompileTimeAssertions

  test "my test" do
    assert_compile_time_raise RuntimeError, "boom at compile time", fn ->
      import MyMacro
      boom
    end
  end
end
```

We use a macro so that our code, too, runs at compile time. We wrap around the code that raises. When it does, we rescue it. Then we generate test assertions to execute later, at runtime.

If the code does not in fact raise, the error will be something like:

    Assertion with == failed
    code: CompileTimeAssertions.DidNotRaise == RuntimeError
    lhs:  CompileTimeAssertions.DidNotRaise
    rhs:  RuntimeError

This is a fairly minimal and unpolished implementation that suited my needs. Please feel free to improve upon it, and write a comment if you do.

If you want to see this in action, have a look at my [FIXME for Elixir](https://github.com/henrik/fixme-elixir) library.
