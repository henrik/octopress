---
layout: post
title: "Using a headless Rails for tasks and tests"
date: 2014-06-25 21:00
comments: true
categories:
  - Ruby on Rails
---

You might know that the Rails console gives you an `app` object to interact with:

```
>> app.items_path
# => "/items"
>> app.get "/items"
# => 200
>> app.response.body
# => "<!DOCTYPE html><html>My items!</html>"
>> app.response.success?
# => true
```

You might also know that this is the same thing you're using in Rails integration tests:

``` ruby
get "/items"
expect(response).to be_success
```

In both cases you're interacting with an [ActionDispatch::Integration::Session](http://api.rubyonrails.org/classes/ActionDispatch/Integration/Session.html).

Here are two more uses for it.


## Rake tasks

If you have an app that receives non-GET webhooks, it's a bit of a bother to `curl` those when you want to trigger them in development.

Instead, you can do it from a Rake task:

``` ruby
namespace :dev do
  desc "Fake webhook"
  task :webhook => :environment do
    session = ActionDispatch::Integration::Session.new(Rails.application)
    response = session.post "/my_webhook", { my: "data" }, { "X-Some-Header" => "some value" }
    puts "Done with response code #{response}"
  end
end
```

I used this [in a current project](https://github.com/henrik/remit/blob/master/lib/tasks/dev_events.rake) to fake incoming GitHub webhooks.

You could of course make your controller a thin wrapper around some object that does most of the work, and just call that object from tasks, but the HTTP part isn't neglible with things like webhooks, and it can be useful to go through the whole thing sometimes during development.


## Non-interactive sessions in feature tests

Your Capybara tests [can alternate between multiple interactive sessions](http://blog.bruzilla.com/post/20889863144/using-multiple-capybara-sessions-in-rspec-request-specs) very easily, which is [super handy](https://github.com/henrik/remit/blob/master/spec/features/commits_spec.rb) for testing real time interactions, e.g. a chat.

But Capybara only wants you to test through the fingers of a user. If the user doesn't click to submit a form, you can't easily trigger a POST request.

So if you want to test something like an incoming POST webhook *during* an interactive user session, you can again use our friend `ActionDispatch::Integration::Session`:

``` ruby
it "reloads when a webhook comes in" do
  visit "/"

  expect_page_to_reload do
    the_heroku_webhook_is_triggered
  end
end

def expect_page_to_reload
  page.evaluate_script "window.notReloaded = true"
  yield
  sleep 0.01  # Sadly, we need this.
  expect(page.evaluate_script("window.notReloaded")).to be_falsy
end

def the_heroku_webhook_is_triggered
  session = ActionDispatch::Integration::Session.new(Rails.application)
  session.post("/heroku_webhook")
end
```

This too is extracted from [a current project](https://github.com/henrik/remit/blob/master/spec/features/heroku_webhook_spec.rb).
