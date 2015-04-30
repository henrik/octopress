---
layout: post
title: "Wrap instance variables passed to layouts"
date: 2015-04-29 22:50
comments: true
categories:
  - Ruby on Rails
---

If your layout template shows a breadcrumb but you want to hide it on some pages, this is a reasonable way to do it:

``` ruby my_controller.rb linenos:false
def show
  @hide_breadcrumbs = true
  # …
end
```

``` erb layout.html.erb linenos:false
<% unless @hide_breadcrumbs %>
  <nav class="breadcrumbs">…</nav>
<% end %>
```

Of late I've started wrapping these instance variables in thin methods:

``` ruby application_controller.rb linenos:false
def hide_breadcrumbs
  @hide_breadcrumbs = true
end

helper_method \
def show_breadcrumbs?
  !@hide_breadcrumbs
end
```

``` ruby my_controller.rb linenos:false
def show
  hide_breadcrumbs
  # …
end
```

``` erb layout.html.erb linenos:false
<% if show_breadcrumbs? %>
  <nav class="breadcrumbs">…</nav>
<% end %>
```

(If you want to learn more about `helper_method \`, see ["Backslashy Ruby"](/2015/01/backslashy-ruby/).)

I like this pattern because I've found instance variables in views to be bug prone and a bit difficult to maintain. I [don't](/2013/05/locals/) use them when rendering action views, either.

If an instance variable is not set, it defaults to `nil`. So if I set one in a controller over here, and read it in a view over there, that's two places that need to write the variable in exactly the same way, and if they don't, you might get silent bugs.

When you wrap them in methods like this, the write and the read are adjacent in code, so they're easier to maintain.

You also get the expressiveness, the encapsulation and the flexibility of using a method. For example, notice how I defined a `#show_breadcrumbs?` to avoid the double negative of `unless @hide_breadcrumbs`.

Try it out!
