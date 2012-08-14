---
layout: post
title: "Rails STI and form_for"
date: 2012-08-14 12:15
categories:
- Ruby on Rails
- STI
---

Rails' `form_for` conveniently uses "record identification" to figure out the correct URL based on the model:

``` haml _form.html.haml
= form_for([:admin, @item]) do |f|
  = f.text_field :name
```

It's also used to figure out the HTTP verb, the field name prefixes, HTML classes and HTML id.

So this form would POST to `admin_items_path` for a new record, or PUT to `admin_item_path(@item)` for an existing record.

But it can break when you use STI (Single Table Inheritance).

``` ruby items_controller.rb
def edit
  @item = Item.find(123)  # A SpecialItem record.
end
```

``` haml _form.html.haml
= form_for([:admin, @item]) do |f|
  = f.text_field :name
  = f.select :type, [Item.name, SpecialItem.name]
```

You want `edit_admin_item_path(@item)` but Rails tries the non-existent `edit_admin_special_item_path(@item)`.

The [Rails form helper guide](http://guides.rubyonrails.org/form_helpers.html) says you can't rely on record identification with STI.

You can, though, with some fiddling. This is what I just did:

``` haml _form.html.haml
= form_for([:admin, @item.dup.becomes(Item)]) |f|
  - f.object = @item
  = f.text_field :name
  = f.select :type, [Item.name, SpecialItem.name]
```

[#becomes](http://apidock.com/rails/ActiveRecord/Persistence/becomes) changes the `SpecialItem` to an `Item` for the benefit of the record identification.

But then the form will have a plain `Item`, so our `type` dropdown won't pre-select "SpecialItem". So to fix that, I restore the form object on line 2.

Also note that I used `@item.dup` on line 1, because `#becomes` will otherwise mutate the attributes inside the original `@item`.
