---
layout: post
title: "The Rails flash isn't just for messages"
date: 2012-08-19 01:00
comments: true
categories:
  - Ruby on Rails
---

[The Rails flash](http://guides.rubyonrails.org/action_controller_overview.html#the-flash) is typically used for short messages:

``` ruby app/controllers/sessions_controller.rb
redirect_to root_url, notice: "You have been logged out."
```

But it can be used for more than that, any time that you redirect and want to pass along some state without making it part of the URL.

These are some things I've used it for.


## Identifiers for more complex messages

Maybe you want to show a more complex message after signing up, containing things like links and bullet points.

Rather than send all that in the flash, you can send some identifier that your views know how to handle.

This could be the name of a partial:

``` ruby app/controllers/users_controller.rb
class UsersController < ApplicationController
  def create
    @user = actually_create_user
    flash[:partial] = "welcome"
    redirect_to some_path
  end
end
```

``` haml app/views/layouts/application.html.haml
- if flash[:partial]
  = render partial: "shared/flashes/#{flash[:partial]}"
```

``` haml app/views/shared/flashes/_welcome.html.haml
%p Welcome!
%ul
  %li= link_to("Do this!", this_path)
  %li= link_to("Do that!", that_path)
```

Or just a flag:

``` ruby app/controllers/users_controller.rb
flash[:signed_up] = true
redirect_to root_path
```

``` haml app/views/welcomes/show.html.haml
- if flash[:signed_up]
  %p Welcome!
```


## Pass on the referer

Say you have some filter redirecting incoming requests. Maybe you're detecting the locale and adding it to the URL, or verifying credentials.

You can use the flash to make sure the redirected-to controller gets the original referer.

``` ruby app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_filter :keep_original_referer
  before_filter :make_locale_explicit

  private

  def make_locale_explicit
    if params[:locale].blank? && request.get?
      redirect_to params.merge(locale: I18n.locale)
    end
  end

  def keep_original_referer
    # Don't overwrite existing value, for redirect chains.
    flash[:original_referer] ||= request.referer
  end

  def original_referer
    flash[:original_referer]
  end
end
```

Now, any controller that cares about the referer could get it with `original_referer`.


## Google Analytics events

Say you want to track a [Google Analytics event](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide) event with JavaScript when a user has signed up.
You could do something like this.

Send event data from the controller:

``` ruby app/controllers/users_controller.rb
class UsersController < ApplicationController
  def create
    @user = actually_create_user
    flash[:events] = [ ["_trackEvent", "users", "signup"] ]
    redirect_to some_path
  end
end
```

Then turn it into JavaScript in your view:

``` ruby app/helpers/layout_helper.rb
def analytics_events
  Array(flash[:events]).map do |event|
    "_gaq.push(#{raw event.to_json});"
  end.join("\n")
end
```

``` haml app/views/layouts/application.html.haml
:javascript
  = analytics_events
```


## The flash vs. params

You may have considered that any of the above could have be done with query parameters instead. Including common flash messages:

``` ruby app/controllers/sessions_controller.rb
redirect_to root_url(notice: "You have been logged out.")
```

``` haml app/views/layouts/application.html.haml
- if params[:notice]
  %p= params[:notice]
```

Using the flash means that the passed data doesn't show in the URL, so it won't happen twice if the link is shared, bookmarked or reloaded. Also the URL will be a little cleaner.

Additionally, the user can't manipulate the flash, as it's stored in the session. This adds some protection. If the flash partial example above used `params`, a user could pass in `../../admin/some_partial` to see things they shouldn't.


## Fin

I'd love to hear about what unconventional uses you've put the flash to!
