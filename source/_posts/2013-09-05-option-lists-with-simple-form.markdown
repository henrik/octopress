---
layout: post
title: "Option lists with simple_form"
date: 2013-09-05 00:09
comments: true
categories:
  - Ruby on Rails
  - Ruby
  - simple_form
---

This is the pattern I've used lately to enumerate values for [simple_form](https://github.com/plataformatec/simple_form) `select` options:

Values:

``` ruby app/models/order/status.rb
class Order
  class Status
    KEYS = [
      NEW       = "new",
      INVOICED  = "invoiced",
      PAID      = "paid",
      SHIPPED   = "shipped"
    ]

    def self.keys
      KEYS
    end

    def self.all
      keys.map { |key| new(key) }
    end

    def initialize(key)
      @key = key
    end

    # simple_form automatically uses `id` for the option value.
    def id
      @key
    end

    # simple_form automatically uses this for the option text.
    def name
      I18n.t(@key, scope: :"models.order.statuses")
    end
  end
end
```

View:

``` ruby app/views/orders/_form.html.erb
…
<%= f.input :status, collection: Order::Status.all %>
…
```

And you can validate like this:

``` ruby app/models/order.rb
class Order < ActiveRecord::Base
  validates :status, inclusion: { in: Status.keys }
end
```

If you have something better, let me know!
