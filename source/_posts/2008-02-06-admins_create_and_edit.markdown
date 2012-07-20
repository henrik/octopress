---
wordpress_id: 212
title: admins_create_and_edit
categories:
- Ruby
- Ruby on Rails
date: 2008-02-06 16:32
layout: post
comments: true
---
With RESTful Rails resource controllers, it's a fairly common pattern that creating and editing a resource is for admins only, but showing, indexing etc is for everyone.

Assuming an <code>admin_only</code> before filter, add this <code>protected</code> method to your <code>ApplicationController</code>:

``` ruby
  def self.admins_create_and_edit(options={})
    actions = [:new, :create, :edit, :update]
    actions += Array(options[:and])
    before_filter :admin_only, :only => actions
  end
```

Now, you can just do

``` ruby
admins_create_and_edit
```
in your controller to protect the four actions around creation and editing. You can optionally pass additional methods to protect, like

``` ruby
admins_create_and_edit :and => :destroy
```
or

``` ruby
admins_create_and_edit :and => [:destroy, :invert]
```
