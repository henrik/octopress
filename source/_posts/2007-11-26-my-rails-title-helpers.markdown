---
wordpress_id: 196
title: My Rails title helpers
categories:
- Ruby
- Ruby on Rails
date: 2007-11-26 17:37
layout: post
comments: true
---
I figured I should blog the title helpers I made of late.

<h4>Usage</h4>

First, example usage. In an erb view:

``` rhtml
<% self.title = "Foo" -%>
```
gives a title like "Foo – My Site".

``` rhtml
<% self.full_title = "Foo" -%>
```
gives the title "Foo".

``` rhtml
<% self.full_title = "Welcome to %s!" -%>
```
gives the title "Welcome to My Site!".

Things look even nicer in <a href="http://haml.hamptoncatlin.com/">Haml</a>:

``` ruby
- self.full_title = "Welcome to %s!"
```

<!--more-->

<h4>Displaying the title</h4>

I like to define an <code>ApplicationLayoutHelper</code> for helpers that will only be used in that layout (you'll need to declare <code>helper :all</code> or <code>helper ApplicationLayoutHelper</code> in your <code>ApplicationController</code>). If you want to, though, you can just stick this helper method in <code>ApplicationHelper</code>:

``` ruby
def title
  h(@title_full ? @title_full : [@title_prefix, SITE_TITLE].compact.join(' – '))
end
```

<code>SITE_TITLE</code> is e.g. "My Site" from the examples above. Instead of a constant, you might want to use an environment variable or a configuration object – whatever.

Note that we apply <code>h()</code> in this helper, so don't apply it to the title again or things can become overescaped.

Now, just use this helper where you want to display the title – typically in your application layout:

``` rhtml
<title><%= title %></title>
```

<h4>Setting the title</h4>

I like to be able to set the title from controller as well as from its views. Thus, the setters are defined in <code>ApplicationController</code>:

``` ruby
class ApplicationController < ActionController::Base
  helper_method :title=, :full_title=

  ⋮

protected

  def title=(title)
    @title_prefix = title
    @template.instance_variable_set("@title_prefix", @title_prefix)  # Necessary if set from view
  end

  def full_title=(title)
    @title_full = title % SITE_TITLE
    @template.instance_variable_set("@title_full", @title_full)  # Necessary if set from view
  end

end
```

The <code>instance_variable_set</code> bits are necessary when you set the title from a view: in Rails, controllers and views only share instance variables because Rails copies them to the view behind the scenes. If we set an instance variable on the controller <em>after</em> that has happened, we must copy it over ourselves.

Bonus tip: you can override these setters per-controller if you want to:

``` ruby
class UsersController < ApplicationController
protected
  def title=(title)
    super("Users: #{title}")
  end
end
```

This isn't rocket surgery, but I thought it was worth blogging. I like the <code>self.title=</code> syntax a lot.
