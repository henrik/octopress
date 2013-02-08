---
layout: post
title: "PORO validators in Rails"
date: 2013-02-08 19:56
comments: true
categories:
  - Ruby on Rails
---

The other day, I wanted to extract some validation logic from an Active Record model into its own class.

Initially I tried Rails' [`validates_with`](http://apidock.com/rails/ActiveModel/Validations/ClassMethods/validates_with) and [`ActiveModel::Validator`](http://api.rubyonrails.org/classes/ActiveModel/Validator.html).

It went something like this:

``` ruby
class MyModel < ActiveRecord::Base
  validates_with Validator
end

class MyModel
  class Validator < ActiveModel::Validator
    def validate(record)
      @record = record
      validate_not_bad
    end

    private

    def validate_not_bad
      record.errors.add_to_base("Bad!") if bad?
    end

    def bad?
      properties.include?(:evil) || properties.include?(:nasty)
    end

    def properties
      @properties ||= record.some_expensive_lookup
    end

    def record
      @record
    end
  end
end
```

I wanted private helper methods, and I didn't want to pass the record around as method arguments to each, so I treated the validator as a regular object, though Rails only offered me a `validate` method, not an initializer.

But it soon became apparent that it indeed wasn't the regular object I hoped for. In my tests, the memoized `properties` from one validation run would still be around when validating a second time.

The validator was not initialized once per validation run, as one might expect, but only once when the class loads.

So I rewrote it as a plain old Ruby object ("PORO") with a minimum of boilerplate and glue, and as far as I can tell, it works better, with less magic and less surprises:

``` ruby
class MyModel < ActiveRecord::Base
  validate do |record|
    Validator.new(record).validate
  end
end

class MyModel
  class Validator
    def initialize(record)
      @record = record
    end

    def validate
      validate_not_bad
    end

    private

    # The exact same private methods.
  end
end
```

After a brief look at [the Rails `Validator` code](https://github.com/rails/rails/blob/master/activemodel/lib/active_model/validator.rb), I suspect the class is defensible as a base for Rails' built-in validations, but it doesn't seem worthwhile to build your own validators around it, to me. But please let me know if I'm missing something.
