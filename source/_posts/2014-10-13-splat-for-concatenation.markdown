---
layout: post
title: "Splat for concatenation"
date: 2014-10-13 17:40
comments: true
categories:
  - Ruby
---

As you probably know, you can use Ruby's splat operator (`*`) for any-length argument lists:

``` ruby linenos:false
def make_into_array(*args)
  args
end

make_into_array(1, 2)  # => [ 1, 2 ]
```

It has another handy use, though, as a list flattener.

You can use it for nicer array concatenation:

``` ruby linenos:false
foos = [ 1, 2 ]

# Not as nice
foos + [ "more" ]
# => [ 1, 2, "more" ]

# Nicer
[ *foos, "more" ]
# => [ 1, 2, "more" ]

# More advanced
[ "more", *foos, *foos, "even more" ]
# => [ "more", 1, 2, 1, 2, "even more" ]
```

There's also `foos << "more"`, but that mutates the original array, so it's often not an option.

You can also use it for method argument concatenation. For example with `attr_accessible` in Ruby on Rails:

``` ruby linenos:false
COMMON_ACCESSIBLE = [ :name, :email ]
attr_accessible *COMMON_ACCESSIBLE, as: :user

# Not as nice
attr_accessible *(COMMON_ACCESSIBLE + [ :is_admin ]), as: :admin

# Nicer
attr_accessible *COMMON_ACCESSIBLE, :is_admin, as: :admin

# Another option
ADMIN_ACCESSIBLE = [ :is_admin ]
attr_accessible *COMMON_ACCESSIBLE, *ADMIN_ACCESSIBLE, as: :admin
```

The above is true of Ruby 1.9 and later. Ruby 1.8.7 only lets the single last list element be splatted.

Basically, splat lets you put an array or argument list anywhere inside another array or argument list in a "flat" way – making the elements part of that list itself. I've found it can make for quite pleasant code.
