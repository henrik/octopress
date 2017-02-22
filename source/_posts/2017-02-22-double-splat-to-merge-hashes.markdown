---
layout: post
title: "Double splat to merge hashes"
date: 2017-02-22 16:25 UTC
comments: true
categories:
  - Ruby
---

In much the same way as you can [use `*` for array concatenation](/2014/10/splat-for-concatenation) in Ruby, you can use `**` to merge hashes:

``` ruby linenos:false
hash = { b: 2, c: 3 }
{ a: 1, **hash }  # => { a: 1, b: 2, c: 3 }
```

If the same key exists in both hashes, the last one wins:

``` ruby linenos:false
hash = { a: :wins, b: 2 }
{ a: :loses, **hash }  # => { a: :wins, b: 2 }

hash = { a: :loses, b: 2 }
{ **hash, a: :wins }  # => { a: :wins, b: 2 }
```

I find this way of merging hashes convenient for factory methods in tests.

Instead of this:

``` ruby linenos:false
def build_user(overrides = {})
  User.new(
    {
      name: "John Doe",
      role: "admin",
    }.merge(overrides)
  )
end

user1 = build_user
user2 = build_user(role: "superadmin", age: 42)
```

You can just do this:

``` ruby linenos:false
def build_user(**overrides)
  User.new(
    name: "John Doe",
    role: "admin",
    **overrides
  )
end

user1 = build_user
user2 = build_user(role: "superadmin", age: 42)
```
