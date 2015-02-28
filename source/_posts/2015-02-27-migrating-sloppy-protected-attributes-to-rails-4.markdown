---
layout: post
title: "Migrating sloppy protected attributes to Rails 4"
date: 2015-02-27 20:05
comments: true
categories:
  - Ruby on Rails
---

I'm updating an old project from Rails 3 to Rails 4.

I installed the [`protected_attributes`](https://github.com/rails/protected_attributes/) gem so our old-style `attr_accessible` and `attr_protected` keep working until we can switch over to the new "strong parameters" style.

The behavior isn't quite identical, though. I had test failures where attributes weren't assigned correctly. I could reproduce it in a console, something like:

    >> Image.new(item_id: 123)
    WARNING: Can't mass-assign protected attributes for Image: item_id

We had intentionally been a bit sloppy about protected attributes: we would declare them in models editable by the public, but not in models editable only by admins.

In Rails 3, a model with undeclared attribute protection would be left unprotected.

In Rails 4 with `protected_attributes`, it seems a model with undeclared attribute protection is fully protected – no attributes are accessible.

This is how I reproduced the Rails 3 behavior on Rails 4:

``` ruby config/initializers/protected_attributes_backwards_compatibility.rb linenos:false
# On Rails 3, leaving attr protection undefined meant a model was unprotected.
# On Rails 4 with the "protected_attributes" gem, leaving it undefined seems to mean it is fully protected.
# We should replace all this with "strong parameters" anyway.

module ProtectedAttributesBackwardsCompatibility
  def inherited(klass)
    # Make a column explicitly protected (that is protected by default anyway) so the other attributes become unprotected.
    klass.attr_protected :id
    super
  end
end

class ActiveRecord::Base
  class << self
    prepend ProtectedAttributesBackwardsCompatibility
  end
end
```

Basically, it's a roundabout way of declaring `attr_protected :id` in every model. By making *some* attribute protected (one that is protected by default anyway), the rest are unlocked.

For once, I didn't write a test, since it seemed quite difficult in relation to the value. I did confirm manually that any declaration (whether `attr_accessible` or `attr_protected`) in a model will overwrite this declaration.

Hopefully this helps someone. If nothing else, the `prepend` trick may be of interest.
