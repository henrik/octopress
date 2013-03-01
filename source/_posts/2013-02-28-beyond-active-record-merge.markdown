---
layout: post
title: "Beyond Active Record merge"
date: 2013-02-28 19:20
comments: true
categories:
  - Ruby on Rails
  - Object design
---

If you want maintainable, loosely coupled classes, you must mind what they know about one another.

For example, you don't want one Active Record model to know a lot about the schema of another.

## Using `merge`

Instead of this:

``` ruby app/models/user.rb
class User < ActiveRecord::Base
  has_one :subscription
  scope :with_active_subscription, joins(:subscription).where("subscriptions.active" => true)
end
```

``` ruby app/models/subscription.rb
class Subscription
end
```

You might use Active Record's [`merge`](http://apidock.com/rails/ActiveRecord/SpawnMethods/merge) and do something like:

``` ruby app/models/user.rb
class User < ActiveRecord::Base
  has_one :subscription
  scope :with_active_subscription, joins(:subscription).merge(Subscription.active)
end
```

``` ruby app/models/subscription.rb
class Subscription
  scope :active, where(active: true)
end
```

We're still coupled, of course, but to a higher and more stable abstraction.


## Beyond `merge`

For more complex SQL, `merge` won't cut it.

Today, I extracted columns like `invoices.posted_at` and `contracts.emailed_at` to a separate `events` table.

Now there are `Event` records which belong to a record (invoice or contract) and have an event name and a timestamp.

So a posted invoice may be represented by an `Event` record with these attributes:

``` ruby
{ record_id: 123, record_type: "Invoice", name: "posted", happened_at: "2013-02-28 16:00" }
```

Now, if you want a scope/method like `Invoice.unposted` (and perhaps `Contract.not_emailed`), how would you go about it?

You'll need a join that involves `events` columns.

You could put the join SQL in `Invoice`, but then it would know a lot about the `events` table. And you'd have to duplicate much of that SQL if `Contract` adds a similar method.

Instead, you can simply have `Event` own that SQL:

``` ruby app/models/event.rb
class Event < ActiveRecord::Base
  belongs_to :record, polymorphic: true

  def self.scope_unevented(scoped, event)
    klass = scoped.klass

    query = [
      "LEFT JOIN events
        ON events.record_id = #{klass.table_name}.#{klass.primary_key}
        AND events.record_type = ?
        AND events.name = ?",
      klass.base_class.name,  # STI uses the base class.
      event
    ]

    scoped.
      joins(sanitize_sql(query)).
      where("events.id IS NULL")
  end
end
```

``` ruby app/models/invoice.rb
class Invoice
  POSTED_EVENT = "posted"

  scope :loving_it, where(loving_it: true)

  def self.unposted
    # `scoped` is `Invoice.scoped`; a scope of all records.
    Event.scope_unevented(scoped, POSTED_EVENT)
  end

  def self.unposted_and_loving_it
    Event.scope_unevented(loving_it, POSTED_EVENT)
  end
end
```

Now all `Event` needs to know is that its record has a table name, a primary key and a class name, as any Active Record model will. These are fairly stable assumptions.
