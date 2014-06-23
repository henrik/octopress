---
layout: post
title: "Midnight fragile tests"
date: 2014-06-23 21:25
comments: true
categories:
  - Testing
  - Review in review
---

This is a post in [my series](/tag/review-in-review) on things I've remarked on in code review.

Do you see a problem with this test?

``` ruby
describe EventFinder, ".find_all_on_date" do
  it "includes events that happen on that date" do
    event = create(Event, happens_on: Time.zone.today)
    found_events = EventFinder.find_all_on_date(Time.zone.today)
    expect(found_events).to include(event)
  end
end
```

What happens if this test runs right around midnight, or around a daylight saving transition?

The `event` might be created just as Monday ends, and `EventFinder.find_all_on_date` may run just as Tuesday starts.

So we'd create a Monday event but search for Tuesday events, and the test will fail.

In this case the fix is trivial:

``` ruby
describe EventFinder, ".find_all_on_date" do
  it "includes events that happen on that date" do
    today = Time.zone.today
    event = create(Event, happens_on: today)
    found_events = EventFinder.find_all_on_date(today)
    expect(found_events).to include(event)
  end
end
```

In more complex cases, you may need to call a [time cop](https://github.com/travisjeffery/timecop) and ask them to freeze time for the duration of your test.

Admittedly, this isn't a major issue. I see these types of tests failures a few times a year – it doesn't happen often if you don't often run your tests around midnight.

But it's also easy to avoid once you're aware of it, so I recommend writing tests not to be midnight fragile from now on.
