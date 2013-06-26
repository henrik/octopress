---
layout: post
title: "Waiting on non-DOM Ajax in Capybara"
date: 2013-02-12 22:30
comments: true
categories:
  - JavaScript
  - CoffeeScript
  - Capybara
  - Ruby
  - Ajax
---

The [Capybara](https://github.com/jnicklas/capybara) testing library has [built-in functionality for waiting on asynchronous JavaScript (Ajax)](https://github.com/jnicklas/capybara#asynchronous-javascript-ajax-and-friends).

For example, this works even if the content is added by Ajax:

``` ruby
click_link("Add to favorites")
page.should have_content("Added to favorites")
```

Behind the scenes, Capybara will retry finding the content if it's not yet present.

But if you write optimistic UIs that say "Added to favorites" immediately, and only *then* fire off the Ajax request, you may write a test more like this:

``` ruby
Favorite.count.should == 0
click_link("Add to favorites")
page.should have_content("Added to favorites")
Favorite.count.should == 1
```

And that test will fail, because Capybara will not know to wait a while before counting favorites. It only waits on UI changes.

My workaround is to make *every* Ajax request update *something* in the UI, and wait for that:

``` coffeescript app/assets/javascripts/capybara_wait_for_ajax_completion.js.coffee
$ ->

  KLASS = "ajax-completed"

  $(document.body)
    .on "ajaxSend", ->
      $(this).removeClass(KLASS)
    .on "ajaxComplete", ->
      $(this).addClass(KLASS)
```

``` ruby spec/support/helpers.rb
def wait_for_ajax_completion
  # page.document so it keeps working inside "within" blocks.
  page.document.should have_selector("body.ajax-completed")
end
```

``` ruby spec/requests/favoriting_spec.rb
Favorite.count.should == 0
click_link("Add to favorites")
page.should have_content("Added to favorites")
wait_for_ajax_completion
Favorite.count.should == 1
```

If you have a lot of Ajax going on at once and only want to wait on one particular request, you could do the same thing but on the particular element or request, instead of capturing every request's events like this.
