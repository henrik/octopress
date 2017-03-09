---
layout: post
title: "Custom factory methods alongside factory_girl"
date: 2017-03-09 19:30
comments: true
categories:
  - Factories
  - factory_girl
---

Here's a small (and perhaps obvious) trick I sometimes use with [factory_girl](https://github.com/thoughtbot/factory_girl).

You may find yourself doing some complex or recurring setup in tests.

That complexity doesn't really belong in the tests themselves, but it's also difficult to model in factory_girl's definition language. Perhaps you have tricky callbacks or dependencies across deep object graphs that are hard to get rid of.

Then make a plain Ruby method alongside your factory definitions:

``` ruby item_factory.rb linenos:false
FactoryGirl.define do
  factory :item do
    title "Default title"
  end
end

def FactoryGirl.create_item_with_complex_stuff(attributes)
  item = FactoryGirl.create(:item, attributes)
  item.some.deeply.nested.thing.update_attribute(:foo, "bar")
  item
end
```

Now you can just do `FactoryGirl.create_item_with_complex_stuff(title: "My item")` in any test.

Since the method is in your factory files, it's easy to find alongside your other factory definitions. The complexity no longer clutters up your tests, and you have all the power of Ruby at your disposal.
