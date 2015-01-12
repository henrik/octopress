---
layout: post
title: "Array#to_proc for hash access"
date: 2014-11-05 19:30
comments: true
categories:
  - Ruby
  - Metaprogramming
---

In Ruby, these are equivalent:

``` ruby linenos:false
[ 1, 2, 3 ].map { |number| number.to_s }
[ 1, 2, 3 ].map(&:to_s)
```

At work today, we discussed having something similar for hash access. I came up with this:

``` ruby linenos:false
[ { name: "A" }, { name: "B" } ].map(&[:name])  # => [ "A", "B" ]
```

I'm very happy with that syntax; it's quite clear what it does.

The implementation is minimal:

``` ruby linenos:false
class Array
  def to_proc
    ->(h) { length == 1 ? h[first] : h.values_at(*self) }
  end
end
```

It could be even smaller if it didn't support multiple keys, but it does – and not just symbols, either:

``` ruby linenos:false
[ { name: "A", "age" => 41 }, { name: "B", "age" => 42 } ].map(&[:name, "age"])
# => [ [ "A", 41 ], [ "B", 42 ] ]
```

There's no default `Array#to_proc`, so this doesn't collide with anything built into the language.

I'm not the first one to blog about an `Array#to_proc` ([1][a], [2][b], [3][c]) but I haven't seen it used for hash access.

For a tiny hack, it's pretty cool.

[a]: http://www.sanityinc.com/articles/adding-array-to-proc-to-ruby/
[b]: https://rails.lighthouseapp.com/projects/8994/tickets/1253-arrayto_proc
[c]: http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-talk/199820
