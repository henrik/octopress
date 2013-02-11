---
layout: post
title: "RSpec shared examples with template methods"
date: 2013-02-11 13:30
comments: true
categories:
  - RSpec
  - Ruby on Rails
---

It's pretty common to have multiple tests that are nearly the same.

In one app, we support bidding on both online and hammer auctions (live auctions with online pre-bidding). They're in distinct controllers but with a lot of shared code and behavior.

We want to test both, but we'd rather not write two almost identical tests if we can help it.

So we've been using RSpec shared examples, with the [template method pattern](http://en.wikipedia.org/wiki/Template_method_pattern) to account for the differences.

Here's a simplified example:

``` ruby spec/request/online_bidding_spec.rb
require "spec_helper"
require "support/shared_examples/bidding"

describe "Bidding online" do
  include_examples :bidding do
    let(:auction) { FactoryGirl.create(:online_auction) }

    def auction_path
      online_auction_path(auction)
    end
  end
end
```

``` ruby spec/request/hammer_bidding_spec.rb
require "spec_helper"
require "support/shared_examples/bidding"

describe "Bidding at hammer auction" do
  include_examples :bidding do
    let(:auction) { FactoryGirl.create(:hammer_auction) }

    def auction_path
      hammer_auction_path(auction)
    end
  end
end
```

``` ruby spec/support/shared_examples/bidding.rb
shared_examples :bidding do
  it "lets you bid when logged in" do
    log_in  # Implemented somewhere else.
    visit auction_path
    place_bid
    bid_should_be_accepted
  end

  it "doesn't let you bid when not logged in" do
    visit item_path
    place_bid
    bid_should_be_rejected
  end

  def auction_path
    raise "Implement me."
  end

  def place_bid
    fill_in "Bid", with: 123
    click_button "Place bid"
  end

  def bid_should_be_accepted
    page.should have_content("OK! :)")
  end

  def bid_should_be_rejected
    page.should have_content("NO! :(")
  end
end
```

The only template method here is `auction_path`. The shared example makes sure, by raising, that it's overridden in your concrete specs.
