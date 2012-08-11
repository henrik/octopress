---
layout: post
title: "Sinatra with rack-cache on Heroku"
date: 2012-07-23 09:40
comments: true
categories:
  - rack-cache
  - Sinatra
  - Heroku
---

I'm running some [Sinatra](http://www.sinatrarb.com)-based RSS scrapers on [Heroku](http://heroku.com) ([for blocket.se](http://blocket.herokuapp.com/) and [Etsy](http://etsy-rss.herokuapp.com/)).

Since they make slow web requests, they would time out. To make them faster on Heroku's free plan, my first step was to [run Unicorn for 4x concurrency](http://blog.railsonfire.com/2012/05/06/Unicorn-on-Heroku.html).

But I also wanted caching. Heroku's Aspen and Bamboo stacks [support Varnish](https://devcenter.heroku.com/articles/http-caching). With the Cedar stack, needed for Unicorn, you can use [rack-cache](http://rtomayko.github.com/rack-cache/) instead.

rack-cache stands between the visitor and the app and enforces HTTP caching. Say I request `/foo` and it comes back with a `Cache-Control: public, max-age=123` header. For the next 123 seconds, requests for `/foo` will only hit the cache and not the app.

I found examples of using rack-cache with Ruby on Rails on Heroku, but not with Sinatra, so here goes.


## Setting up Heroku

Install the free memcache addon (5 MB). In a terminal, in your app directory:

    heroku addons:add memcache


## Setting up your app

Your `Gemfile` should include `dalli` (a memcache client) and `rack-cache`:

``` ruby Gemfile
source :rubygems

gem "sinatra"
gem "dalli"
gem "rack-cache"

group :production do
  gem "unicorn"
end
```

Update `Gemfile.lock` for Heroku (and install gems locally). In the terminal:

    bundle

In your Sinatra app, require the dependencies. I like to do it this way so I don't have to repeat myself:

``` ruby app.rb
require "rubygems"
require "bundler"
Bundler.require :default, (ENV["RACK_ENV"] || "development").to_sym
```

But you could do this if you prefer:

``` ruby app.rb
require "rubygems"
require "bundler/setup"

require "sinatra"
require "dalli"
require "rack-cache"
```

Configure Rack::Cache to use memcache for storage:

``` ruby config.ru
require "./app"

# Defined in ENV on Heroku. To try locally, start memcached and uncomment:
# ENV["MEMCACHE_SERVERS"] = "localhost"
if memcache_servers = ENV["MEMCACHE_SERVERS"]
  use Rack::Cache,
    verbose: true,
    metastore:   "memcached://#{memcache_servers}",
    entitystore: "memcached://#{memcache_servers}"
end

run Sinatra::Application
```

Then have the app set whatever HTTP caching headers you like:

``` ruby app.rb
get "/foo" do
  cache_control :public, max_age: 1800  # 30 mins.
  "Hello world at #{Time.now}!"
end
```

## All together

``` ruby config.ru
require "./app"

# Defined in ENV on Heroku. To try locally, start memcached and uncomment:
# ENV["MEMCACHE_SERVERS"] = "localhost"
if memcache_servers = ENV["MEMCACHE_SERVERS"]
  use Rack::Cache,
    verbose: true,
    metastore:   "memcached://#{memcache_servers}",
    entitystore: "memcached://#{memcache_servers}"
end

run Sinatra::Application
```

``` ruby app.rb
require "rubygems"
require "bundler"
Bundler.require :default, (ENV["RACK_ENV"] || "development").to_sym

get "/foo" do
  cache_control :public, max_age: 1800  # 30 mins.
  "Hello world at #{Time.now}!"
end
```

If you want to see this in a real app, check out the [Etsy scraper on GitHub](https://github.com/henrik/etsy-rss/).
