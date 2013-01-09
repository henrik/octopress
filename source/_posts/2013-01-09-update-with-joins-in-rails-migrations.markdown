---
layout: post
title: "Update with joins in Rails migrations with Postgres"
date: 2013-01-09 14:31
comments: true
external-url:
categories:
  - Ruby on Rails
  - SQL
---

If you're migrating a lot of data, you may feel the need for SQL updates with joins.

Active Record doesn't have an abstraction for this, but you can run the SQL manually.

Note that this is for Postgres. The syntax likely differs for other database engines.

It took me a while to figure out the syntax the first time I did it, though, so here it is for reference.

In this contrived example, an order belongs to an item which belongs to a company, and you want to set every order's `company_code` from its item's company's `code`.

``` ruby
class MyMigration < ActiveRecord::Migration
  def up
    update_sql("
      UPDATE orders
        SET company_code = companies.code
        FROM items, companies
        WHERE
          orders.item_id = items.id AND
          items.company_id = companies.id
    ")
  end

  def down
    # Whatever.
  end
end
```
