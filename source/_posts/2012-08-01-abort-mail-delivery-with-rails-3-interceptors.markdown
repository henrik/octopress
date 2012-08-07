---
layout: post
title: "Abort mail delivery with Rails 3 interceptors"
date: 2012-08-01 19:40
comments: true
categories:
  - Ruby on Rails
  - Action Mailer
---

It can be a good idea to use anonymized production data in development and staging. You might change every user email to `dev+user123@example.com`, say.

It's unnecessary to send real mail to these users, but you might not want to deactivate sending *all* mail. It's nice if things like the signup flow work, including mail delivery.

You can use Rails 3 [interceptors](http://api.rubyonrails.org/classes/ActionMailer/Base.html#label-Observing+and+Intercepting+Mails) for this. Every mail is passed to the interceptor before delivery. The interceptor can modify the `Mail::Message` instance. As [discussed here](https://github.com/mikel/mail/issues/114), interceptors don't let you abort delivery in an obvious way, but you can achieve it by setting `message.perform_deliveries = false`.

Note that if you use something like [Resque::Mailer](https://github.com/zapnap/resque_mailer/), the mail will still be enqueued; delivery isn't aborted until the job is processed.

## Example

Register the interceptor:

``` ruby config/initializers/action_mailer.rb
ActionMailer::Base.register_interceptor(PreventMailInterceptor)
```

Define the interceptor, making sure to modify the conditions to suit your needs:

``` ruby lib/prevent_mail_interceptor.rb
class PreventMailInterceptor
  RE = /dev\+.*@example\.com/

  def self.delivering_email(message)
    unless deliver?(message)
      message.perform_deliveries = false
      Rails.logger.debug "Interceptor prevented sending mail #{message.inspect}!"
    end
  end

  def self.deliver?(message)
    message.to.any? { |recipient| recipient !~ RE }
  end
end
```

And spec it:

``` ruby spec/lib/prevent_mail_interceptor_spec.rb
require 'spec_helper'

describe PreventMailInterceptor, "delivery interception" do
  it "prevents mailing some recipients" do
    PreventMailInterceptor.stub(:deliver? => false)
    expect {
      deliver_mail
    }.not_to change(ActionMailer::Base.deliveries, :count)
  end

  it "allows mailing other recipients" do
    PreventMailInterceptor.stub(:deliver? => true)
    expect {
      deliver_mail
    }.to change(ActionMailer::Base.deliveries, :count)
  end

  def deliver_mail
    ActionMailer::Base.mail(to: "a@foo.com", from: "b@foo.com").deliver
  end
end

describe PreventMailInterceptor, ".deliver?" do
  it "is false for recipients like dev+*@example.com" do
    message = mock(to: %w[dev+123@example.com])
    PreventMailInterceptor.deliver?(message).should be_false
  end

  it "is true for other recipients" do
    message = mock(to: %w[user@example.com])
    PreventMailInterceptor.deliver?(message).should be_true
  end
end
```

Done!
