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
ActionMailer::Base.register_interceptor(FakeDataMailInterceptor)
```

Define the interceptor, making sure to modify the conditions to suit your needs:

``` ruby lib/fake_data_mail_interceptor.rb
class FakeDataMailInterceptor
  RE = /dev\+.*@example\.com/

  def self.delivering_email(message)
    if every_recipient_is_fake?(message)
      message.perform_deliveries = false
    end
  end

  def self.every_recipient_is_fake?(message)
    message.to.all? { |recipient| recipient.match(RE) }
  end
end
```

And spec it:

``` ruby spec/lib/fake_data_mail_interceptor_spec.rb
require 'spec_helper'

describe FakeDataMailInterceptor, "delivery interception" do
  it "prevents mailing fake recipients" do
    expect {
      deliver_mail_to("dev+foo@example.com")
    }.not_to change(ActionMailer::Base.deliveries, :count)
  end

  it "does not prevent mailing other recipients" do
    expect {
      deliver_mail_to("user@example.com")
    }.to change(ActionMailer::Base.deliveries, :count)
  end

  def deliver_mail_to(email)
    ActionMailer::Base.mail(to: email, from: "fake@example.com").deliver
  end
end

describe FakeDataMailInterceptor, ".every_recipient_is_fake?" do
  it "is true for recipients like dev+*@example.com" do
    message = mock(to: %w[dev+123@example.com])
    FakeDataMailInterceptor.every_recipient_is_fake?(message).should be_true
  end

  it "is false for other recipients" do
    message = mock(to: %w[user@example.com])
    FakeDataMailInterceptor.every_recipient_is_fake?(message).should be_false
  end
end
```

Done!
