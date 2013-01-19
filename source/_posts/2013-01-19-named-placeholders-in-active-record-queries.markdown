---
layout: post
title: "Named placeholders in Active Record queries"
date: 2013-01-19 21:50
comments: true
categories:
  - Ruby on Rails
---

As you likely know, Active Record supports placeholder values in queries:

``` ruby
User.where("email LIKE ? OR username LIKE ?", query, query)
```

But it is perhaps less well-known that it [also supports named placeholders](http://api.rubyonrails.org/classes/ActiveRecord/Base.html#label-Conditions):

``` ruby
User.where("email LIKE :query OR username LIKE :query", query: query)
User.where("(fooable = :true AND foo_id = :foo_id) OR (barable = :true AND bar_id = :bar_id)", true: true, foo_id: 123, bar_id: 456)
```

These are great when you use the same value more than once, or to make complex queries more readable.
