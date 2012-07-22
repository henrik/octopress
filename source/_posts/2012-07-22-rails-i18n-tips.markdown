---
layout: post
title: "Rails i18n tips"
date: 2012-07-22 13:15
comments: true
categories:
  - Ruby on Rails
  - i18n
---

Working on [my styleguide](https://github.com/henrik/styleguide), I ended up writing too much about this topic, so I figured I should turn it into a blog post instead.

These are some tips based on my experiences of working with [Rails i18n](http://guides.rubyonrails.org/i18n.html).


## Avoid translated view files

If you ever need to work with external translators, it's a bit of a pain sending both your YML files and a bunch of views like `index.en.html.erb`.

For one thing, you need some code to find all those files and send them, and put them back after receiving the translations. For another, your translator must respect the markup and code of the template, and know not to translate them. And if you want to use tools like [WebTranslateIt](https://webtranslateit.com/), it's easier to stick to YML.

But it's helpful for the translator to have context rather than a lot of short strings, and less fiddly on your part.

So I use [YAML block literals](http://en.wikipedia.org/wiki/Yaml#Block_literals) when I can:

``` yml la.yml
long_text: |
  Lorem ipsum dolor sit amet.

  Consectetur adipisicing elit.
```

Don't forget the `|` or YAML will fold your newlines.

What about the markup? Read on.


## Group translations instead of using markup

Again, sending markup to the translator is a bad idea because they have to know to handle it. Also, you risk duplicating knowledge if you go as far as to hard-code link URLs in your translations.

What I do is split up the translations, but keep them under the same key:

``` yml en.yml
  log_in_or_sign_up:
    text: "%{log_in} or %{sign_up} to do stuff."
    log_in: "Log in"
    sign_up: "Sign up"
```

``` erb header.erb
<%= t(
  :'log_in_or_sign_up.text',
  log_in:  link_to(t(:'log_in_or_sign_up.log_in'),  login_path),
  sign_up: link_to(t(:'log_in_or_sign_up.sign_up'), signup_path)
) %>
```

This way, the translator sees no code or markup (except for the i18n interpolation syntax) and there is no duplication.


## Take advantage of simpler syntaxes

Interpolation is a bit tedious. I find Rails' [simple_format](http://api.rubyonrails.org/classes/ActionView/Helpers/TextHelper.html#method-i-simple_format) handy if you just want some paragraph breaks:

``` yml la.yml
long_text: |
  Lorem ipsum dolor sit amet.

  Consectetur adipisicing elit.
```

``` erb index.erb
<%= simple_format t(:'long_text') %>
```

This becomes:

``` html
<p>Lorem ipsum dolor sit amet.</p>

<p>Consectetur adipisicing elit.</p>
```

Another common case is lists, where I tend to do something simple like:

``` yml la.yml
selling_points: |
  Lorem.
  Ipsum…
  Dolor!
```

``` erb signup.erb
<ul>
<% t(:'selling_points').each_line do |point| %>
  <li><%= point %></li>
<% end %>
</ul>
```

This becomes:

``` html
<ul>
  <li>Lorem.</li>
  <li>Ipsum…</li>
  <li>Dolor!</li>
</ul>
```


## When you *do* need translated view files

If you need some fairly complex document with a bunch of headers, links and bullet points, perhaps your terms of use, you probably *do* want some markup and to use separate files.

But you can still use the simplest syntax possible – perhaps [Markdown](http://en.wikipedia.org/wiki/Markdown). Or implement your own subset, like [Prawndown](https://gist.github.com/2775319).

And instead of putting the files somewhere under `app/views`, keep them centralized, e.g. `config/locales/documents/terms.en.yml`, if they're not in your CMS.


## Use multiple YML files

If your app has different parts with different i18n needs, consider using multiple i18n files.

Perhaps you have an admin section with only one or two locales, and a public section with a bunch.

Instead of having the translator needlessly translate your admin section to every locale, split it into a `config/locales/en.yml` and a `config/locales/admin.en.yml`.


## Naming your keys

One of the trickiest things when I started doing i18n was naming keys. You will have to find your own conventions, but it may be a little helpful to see what mine are.

I use the controller and action as the path for controllers and views, and I try to be consistent about recurring concepts like page title and flash messages (though I try not to use flash messages at all if I can help it):

``` yml en.yml
# FoosController
foos:
  # action/view
  index:
    title: "Foos"
  create:
    success: "Foo created."
    failure: "Foo could not be created."
```

Similarly for mailers:

``` yml en.yml
mailers:
  # FooMailer
  foo:
    # action
    arrived:
      subject: "Your foo just arrived"
      body: |
        Come get your foo!
```

I use a `shared` key at the appropriate level for shared stuff:

``` yml en.yml
shared:
  actions:
    add: "Add"
    remove: "Remove"
```


## Beware highly inflected languages

This will of course depend on your perspective, but: beware Finnish and other highly inflected languages.

As a grammar nerd, I actually love this stuff. But judging by my colleagues, you won't.

In languages like English and Swedish, you express something like "From New York" with a preposition (the word "from"). This is trivial to translate:

``` yml en.yml
from_x: "From %{x}"
```

``` yml sv.yml
from_x: "Från %{x}"
```

But in a language like Finnish, you inflect the word itself: "New Yorkista" means "from New York". And the suffix isn't predictable without a dictionary: "from Berlin" is "Berliinistä". This would be [the ablative case](http://en.wikipedia.org/wiki/Ablative_case).

You could list these variations in your translation files or other data source, but that takes some effort.

The easiest solution I [found](http://www.ruby-forum.com/topic/1897522) for this was simply to make small tweaks to avoid it altogether, e.g. "From: New York" instead of "From New York".

``` yml en.yml
from: "From:"
```

``` yml sv.yml
from: "Från:"
```

``` yml fi.yml
from: "Lähettäjä:"
```

Consult a speaker of the target language and see if you can come up with a workaround similar to this.


## YAML flattener plugin for Vim

I wrote [a plugin for Vim](https://github.com/henrik/vim-yaml-flattener) that lets you easily toggle a YML file between nested format:

``` yml xx.yml
en:
  foo:
    bar: "baare"
  baz: "baize"
```

and a flat format:

``` yml xx.yml
en.foo.bar: "baare"
en.baz: "baize"
```

This is really useful, as the flat format is easier to search and edit.

One could write a custom Rails i18n backend to always use the flat format, but the nested format has the benefits of convention, for use with other tools and services.

A nice side-effect of the plugin is that every time you toggle it, the keys will be sorted.


## Test that translations match up

I've also found it really useful to have a test in my test suite that verifies that all translations match up. So if `en.yml` has `foo.bar`, `sv.yml` should have it as well.

[This is an example of such a test.](https://gist.github.com/2994129) It handles pluralization differences – these match up fine:

``` yml en.yml
table:
  one: "%{count} table"
  other: "%{count} tables"
```

``` yml sv.yml
table: "%{count} bord"
```

And as described above, you can use multiple YML files if you want to exclude some translation keys from this test, because they won't be translated or haven't been translated yet.


## Fin

I'm interested to hear what tools and methods others use, and if you do things different from this.
