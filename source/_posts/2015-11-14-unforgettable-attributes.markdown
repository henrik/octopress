---
layout: post
title: "Unforgettable attributes"
date: 2015-11-14 08:55
comments: true
categories:
  - Design patterns
  - Ruby
  - Ruby on Rails
---

*This blog post describes a design pattern for ensuring you consider every attribute in certain situations. I'll use Ruby on Rails in the examples, but the general pattern should apply to any language or framework.*


## The problem

On [our](http://dev.auctionet.com) [auction site](https://auctionet.com), there are "lots" (items for sale). Each lot has a title, description, a cached "highest bid amount" and several more attributes.

(I'm simplifying the data model for the sake of the example. It's actually composed of more than one model, and doesn't work precisely as described here.)

If a lot goes unsold, it may be relisted. Since we want to keep the history of listings, we make a copy.

So what should we copy? The title and description should be included. The highest bid amount should not, since the new listing won't have any bids to start with.

Alright, we'll write our code:

``` ruby relister.rb linenos:false
includes = %w[ title description ]
new_lot = Lot.new
new_lot.attributes = old_lot.attributes.slice(*includes)
new_lot.save!
```

Then a few months later, someone adds an "artist" attribute. They forgot all about our relister, so relisted lots don't carry it over as we would have liked.

We could instead list the attributes to *exclude*, but then if someone adds a new attribute and forgets to revise the relister, we would include that new attribute even if we shouldn't.


## The solution

The solution we settled on for situations like this is to list all includes *and* excludes.

When we relist, we go through every attribute. We include the ones we should, ignore the ones we shouldn't, and raise an exception if we encounter a new attribute that we don't know how to handle.

This is that rare thing, a perfect solution. We're guaranteed that we can't forget to declare how to handle a new attribute. If we do, we'll be told.

If the relisting is covered by integrated tests at all, they will trigger these exceptions as soon as you add a new attribute and forget to declare it.

### Example code

``` ruby relister.rb linenos:false
new_lot = Lot.new
new_lot.attributes = Lot::IncludesAndExcludes.attributes_from_lot(old_lot)
new_lot.save!
```

``` ruby lot/includes_and_excludes.rb linenos:false
class Lot::IncludesAndExcludes
  LOT_INCLUDES = [
    :title,
    :description,
  ]

  LOT_EXCLUDES = [
    :id, :created_at, :updated_at,
    :highest_bid_amount,
  ]

  def self.attributes_from_lot(lot)
    new(lot, LOT_INCLUDES, LOT_EXCLUDES).attributes
  end

  def initialize(record, includes, excludes)
    @record, @includes, @excludes = record, includes, excludes
  end

  def attributes
    attributes = @record.attributes.symbolize_keys

    attributes.keys.each_with_object({}) { |name, hash|
      if @includes.include?(name)
        hash[name] = attributes.fetch(name)
      elsif @excludes.include?(name)
        # Ignore this known exclude.
      else
        raise "Don't know whether or not to include #{@record.class.name}##{name}!"
      end
    }
  end
end
```

The `attributes_for_lot` class method passes in the constants to the instance, to illustrate how it may work if you're dealing with more than one model. In the real world, we have more than one model in place of `Lot`.

This also makes it very easy to test – and you can test it lightning-fast without loading Rails, if you have that set up.

``` ruby spec/lot/includes_and_excludes_spec.rb linenos:false
describe Lot::IncludesAndExcludes, "#attributes" do
  it "includes the attributes to include" do
    record = double(attributes: { name: "Foo", age: 42 })

    actual = Lot::IncludesAndExcludes.new(record, [ :name ], [ :age ]).attributes
    expect(actual).to include(:name)
  end

  it "excludes the attributes to exclude" do
    record = double(attributes: { name: "Foo", age: 42 })

    actual = Lot::IncludesAndExcludes.new(record, [ :name ], [ :age ]).attributes
    expect(actual).not_to include(:age)
  end

  it "raises if an undeclared attribute is present" do
    record = double(
      attributes: { name: "Foo", age: 42, location: "Bar" },
      class: double(name: "MyClass"),
    )

    expect {
      Lot::IncludesAndExcludes.new(record, [ :name ], [ :age ]).attributes
    }.to raise_error(/MyClass#location/)
  end
end
```


## Other uses

This can be used for anything, of course. We've used it for relisting things and for cloning things more generally.

Most recently, we used it for reversing financial vouchers in an accounting system: basically, you create a copy but invert some of the numbers. For the copy part, we employed this pattern.
