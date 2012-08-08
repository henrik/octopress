---
layout: post
title: "SendGrid metadata and Rails"
date: 2012-08-07 20:30
comments: true
categories:
  - SendGrid
  - Ruby on Rails
  - Action Mailer
---

We have a Rails app that sends its mail through [SendGrid](http://sendgrid.com/).

SendGrid lets you specify metadata in your mail headers, which you can put to excellent use.


## The activity log

SendGrid's highly useful [activity log](http://sendgrid.com/logs/index) ([docs](http://docs.sendgrid.com/documentation/delivery-metrics/email-activity/)) lists the last week of sent mail. Not the full mail, but the recipient e-mail address, the time it was sent, and its state (delivered, link in mail was clicked etc) as far as SendGrid can tell.

You can filter the list by e-mail address, which is really handy for debugging and customer support.

But the list doesn't contain the mail body, or subject, or anything to help you tell which mail is which.

This can be solved with SendGrid metadata and some Action Mailer trickery.


## Categories

You can set up to 10 [categories](http://docs.sendgrid.com/documentation/delivery-metrics/categories/) as SendGrid metadata on each mail:

``` ruby
class MyMailer < ActionMailer::Base
  def hello
    headers "X-SMTPAPI" => {
      category: ["Unsolicited", "Greetings"],
    }.to_json

    mail(to: "someone@example.com") do |format|
      format.text { render(text: "Hello!") }
    end
  end
end
```

They're not predefined, so you can use an unlimited number of categories in total.

You can use categories to filter your [statistics](http://sendgrid.com/statistics/email). Categories are also displayed in the activity log, which may give you an idea of what we'll do in a bit.


## Unique arguments

You can also add any keys and values you like as so-called [unique arguments](http://docs.sendgrid.com/documentation/api/smtp-api/developers-guide/unique-arguments/):

``` ruby
headers "X-SMTPAPI" => {
  unique_args: {
    locale: I18n.locale,
    environment: Rails.env
  }
}.to_json
```

They're also shown in the activity log.

Note that the values will be turned into strings. If a value is a Ruby array, you'll just see "Array" in SendGrid, so if you want them, do:

``` ruby
headers "X-SMTPAPI" => {
  unique_args: {
    my_array: ["one", "two"].to_json
  }
}.to_json
```


## Setting metadata from mail automatically

So how do we automatically store the mailer and action (and some additional goodies) in the SendGrid metadata?

``` ruby app/mailers/application_mailer.rb
class ApplicationMailer < ActionMailer::Base
  # Call add_sendgrid_headers after generating each mail.
  def initialize(method_name=nil, *args)
    super.tap do
      add_sendgrid_headers(method_name, args) if method_name
    end
  end

  private

  # Set headers for SendGrid.
  def add_sendgrid_headers(action, args)
    mailer = self.class.name
    args = Hash[ method(action).parameters.map(&:last).zip(args) ]
    headers "X-SMTPAPI" => {
      category:    [ mailer, "#{mailer}##{action}" ],
      unique_args: { environment: Rails.env, arguments: args.inspect }
    }.to_json
  end
end
```

Any mailer that inherits from `ApplicationMailer` will now get the following metadata:

* A category with the name of the mailer, e.g. "MyMailer"
* A category with the mailer and action, e.g. "MyMailer#hello"
* A unique argument with the Rails environment, e.g. "production"
* A unique argument with the arguments passed into the mailer as a hash from argument name to value, like "{:foo_id=>123, :bar_id=>456}"

The mailer arguments will be rather a lot of text if you pass in full Active Record instances. If you use [resque_mailer](https://github.com/zapnap/resque_mailer/) like we do, you will usually be passing only record ids, so it will be more compact.

Instead of this:

![Screenshot](http://f.cl.ly/items/0g1914381r1a0z1f0D15/sendgrid-before.png)

The log will show this:

![Screenshot](http://f.cl.ly/items/191C17201J2p0J191F2t/sendgrid-after.png)

Having this data is really handy, and I was pretty happy with this implementation. Sure beats [looking at the call chain](https://gist.github.com/2775581) :)
