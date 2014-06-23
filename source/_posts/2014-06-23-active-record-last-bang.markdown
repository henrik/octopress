---
layout: post
title: "Use Active Record's last! in tests"
date: 2014-06-23 20:35
comments: true
categories:
  - Ruby on Rails
  - Review in review
---

I thought I'd start [a series](/tag/review-in-review) of short blog posts on things I remark on during code review that could be of wider interest.

Do you see anything to improve in this extract from a feature spec, assuming we're fine with doing assertions against the DB?

``` ruby
fill_in "Title", with: "My title"
click_link "Create item"

item = Item.last
expect(item.title).to eq "My title"
```

What happens if `item` is nil? The test will explode on the last line with `NoMethodError: undefined method 'title' for nil:NilClass`.

If we would instead do

``` ruby
item = Item.last!
```

then it would explode on that line, with `ActiveRecord::RecordNotFound`.

That's a less cryptic error that triggers earlier, at the actual point where your assumption is wrong.

Active Record's [FinderMethods](http://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html) also include `first!`, `second!`, `third!`, `fourth!`, `fifth!` and `forty_two!`.
