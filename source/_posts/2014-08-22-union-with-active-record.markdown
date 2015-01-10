---
layout: post
title: "UNION with Active Record"
date: 2014-08-22 10:30
comments: true
categories:
  - Ruby on Rails
---

I wanted to do a `UNION` query in Active Record, combining the results of two subqueries.

This is how I did it in Rails 4.1.5 with Postgres:

``` ruby
category = Category.find(123)
items = category.items
query1 = items.some_scope
query2 = items.other_scope

# Get a real category_id instead of "$1" in the generated SQL.
sql = Item.connection.unprepared_statement {
  "((#{query1.to_sql}) UNION (#{query2.to_sql})) AS items"
}

Item.from(sql).order("we_can_add_an_order_if_we_like ASC")
```

The generated query will be something like

``` sql
SELECT items.*
  FROM ((SELECT …) UNION (SELECT …)) AS items
  ORDER BY we_can_add_an_order_if_we_like ASC;
```

This is of course not guaranteed to be fast just because it's raw SQL.

Consider [UNION vs. UNION ALL](http://www.cybertec.at/common-mistakes-union-vs-union-all/), benchmark as needed, and use multiple queries or Ruby code if that's faster or more readable in your situation.
