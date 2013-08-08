---
layout: post
title: "How to make negative assertions in tests"
date: 2013-04-27 16:10
comments: true
categories:
  - Testing
---

Negative assertions in tests are problematic.

Positive assertions like `page.should have_content("Welcome")` simply pass as long as that content is present, and fail if is is removed.

But negative assertions like `page.should_not have_selector(".widget")` or `Notifier.should_not_receive(:invoice_overdue)` may pass because your code works as intended – or because you renamed `widget` to `thingy` and forgot to update the test.

Negative assertions are (hopefully) meaningful when you write them, but after that, there are no guarantees they'll stay that way.

So what can you do about it?


## Balance with a DRY opposite

You can make negative assertions a lot more reliable by also making the opposite assertion (when the thing *should* happen) and making sure to share the common reference:

``` ruby
describe "Home page" do
  it "sometimes has a widget" do
    page.should have_widget
  end

  it "sometimes doesn't have a widget" do
    page.should_not have_widget
  end

  def have_widget
    have_selector(".widget")
  end
end
```

This way, if you rename `widget`, your positive assertion will fail. When you make the positive assertion pass again, the negative assertion will automatically stay relevant.

The common reference could be a method call like `have_selector(…)` above, or just a shared selector like `".widget"`, or a string of copy:

``` ruby
page.should have_content(warning_message)

page.should_not have_content(warning_message)

def warning_message
  "Don't!"
end
```

The commonalities could be shared by way of a method, like we just did (`def have_widget`), or it could be an [RSpec `let` statement](https://www.relishapp.com/rspec/rspec-core/v/2-11/docs/helper-methods/let-and-let), or a constant.


## Adjacent helper methods

Sometimes, making the common code DRY makes the test hard to read. Adjacent helper methods may be good enough:

``` ruby
describe "Invoicing" do
  it "sometimes invoices" do
    invoice = create_invoice
    expect_to_notify_about_invoice(invoice)
    Invoicing.do_it
  end

  it "sometimes doesn't invoice" do
    invoice = create_invoice
    expect_not_to_notify_about_invoice(invoice)
    Invoicing.do_it
  end

  def expect_to_notify_about_invoice(invoice)
    Notifier.should_receive(:invoice_overdue).with(invoice)
  end

  def expect_not_to_notify_about_invoice(invoice)
    Notifier.should_not_receive(:invoice_overdue).with(invoice)
  end
end
```

Because the positive and negative assertions are adjacent, and the notifier class and message are only in those two places, the negative assertion is far less likely to become irrelevant.

They *could* be made completely DRY, sharing the `Notifier` class name and `:invoice_overdue` message name, but the above may be enough. And if it's not, the helper methods will at least make them more readable:

``` ruby
def expect_to_notify_about_invoice(invoice)
  notifier.should_receive(message).with(invoice)
end

def expect_not_to_notify_about_invoice(invoice)
  notifier.should_not_receive(message).with(invoice)
end

def notifier
  Notifier
end

def message
  :invoice_overdue
end
```

Aside from making negative assertions more reliable, helper methods like these have the additional benefit of making the tests read better, because they tell the story at a higher level of abstraction.
