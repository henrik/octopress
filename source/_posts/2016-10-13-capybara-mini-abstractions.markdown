---
layout: post
title: "Capybara mini-abstractions"
date: 2016-10-13 19:15
comments: true
categories:
- Capybara
- Testing
---

Here's a trick I use in my [Capybara](https://github.com/jnicklas/capybara) tests.

Instead of something like this:

``` ruby
describe "My page" do
  it "lists the item" do
    item = create_item

    within(".test-item-#{item.id}") do
      expect(page).to have_content(item.title)
    end
  end
end
```

I might do this:

``` ruby
describe "My page" do
  it "lists the item" do
    item = create_item

    within_item_row(item) do
      expect(page).to mention_item(item)
    end
  end

  private

  def within_item_row(item, &block)
    within(".test-item-#{item.id}", &block)
  end

  def mention_item(item)
    have_content(item.title)
  end
end
```

The `private` is mostly there as a visual separator; whether the methods are public or private isn't a practical concern.
