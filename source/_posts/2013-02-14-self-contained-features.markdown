---
layout: post
title: "Self-contained features"
date: 2013-02-14 23:44
comments: true
categories:
  - Ruby on Rails
  - Object design
---

More and more, I've been trying to contain new features in their own class.

For example, on an eBay-like auction site, users can add items to their watchlist.

A typical way of doing that in Rails may involve `User.has_many :watchlistings` and `Item.has_many :watchlistings`. But `User` and `Item` so easily become [god classes](http://en.wikipedia.org/wiki/God_object) with too much responsibility.

So instead, you could have a `Watchlist` class that is the only thing in the system that knows about `Watchlisting` records.

``` ruby app/models/watchlisting.rb
class Watchlisting < ActiveRecord::Base
end
```

``` ruby app/models/watchlist.rb
class Watchlist
  def self.users_watching(item)
    ids = Watchlisting.where(item_id: item).pluck(:user_id)
    User.where(id: ids)
  end

  def initialize(user)
    @user = user
  end

  def items
    ids = Watchlisting.where(user_id: @user).pluck(:item_id)
    Item.where(id: ids)
  end

  def add(item)
    Watchlisting.create!(user_id: @user, item_id: item)
    item
  end
end
```

``` ruby example.rb
my_list = Watchlist.new(my_user)
my_list.add(an_item)
my_list.items  # => [an_item]
Watchlist.users_watching(an_item)  # => [my_user]
```

You could of course implement these with a single query and a `JOIN`, if you prefer:

``` ruby app/models/watchlist.rb
def items
  Item.joins("JOIN watchlistings ON items.id = watchlistings.item_id").where("watchlistings.user_id" => @user)
end
```

This does mean `Watchlist` has to do without some Active Record niceties. A few more ids mentioned, perhaps even some raw SQL joins. But the win is that items and users know *nothing* about watchlists. That's a trade-off I'm willing to make.

The alternative would be to add more public API to `Item` and `User`. That may be fine for one feature, but less so for three, or five, or ten as your app grows.

It reduces coupling. For now, there's a table named `watchlists` with an Active Record class on top. These details are internal to `Watchlist`. External code can't easily be coupled to them. With `User.has_many :watchlists`, that would be less likely.

I renamed a table in production without downtime the other week, and that was only feasible because access to that feature was well-contained.
