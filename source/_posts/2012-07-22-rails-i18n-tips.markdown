---
layout: post
title: "Rails i18n tips"
date: 2012-07-22 13:15
comments: true
categories:
  - Ruby on Rails
  - i18n
  - Tips
---

These are some tips based on my experiences of working with [Rails i18n](http://guides.rubyonrails.org/i18n.html), extracted from [my styleguide](https://github.com/henrik/styleguide).


## Avoid translated view files

If you ever need to work with external translators, it's a bit of a pain sending both your YML files and a bunch of views like `index.en.html.erb`.

For one thing, you need some code to find all those files and send them, and put them back after receiving the translations. For another, your translator must respect the markup and code of the template, and know not to translate them. And if you want to use tools like [WebTranslateIt](https://webtranslateit.com/), it's easier to stick to YML.

You probably don't want one translation key per sentence, though. It's helpful for the translator to have context rather than a lot of short strings, and less fiddly on your part.

So I use [YAML block literals](http://en.wikipedia.org/wiki/Yaml#Block_literals) when I can:

``` yml la.yml
long_text: |
  Lorem ipsum dolor sit amet.

  Consectetur adipisicing elit.
```

Don't forget the `|` or YAML will fold your newlines.

You still want markup, though – that's up next.


## Take advantage of simpler syntaxes

I find Rails' [simple_format](http://api.rubyonrails.org/classes/ActionView/Helpers/TextHelper.html#method-i-simple_format) handy if you just want some paragraph breaks:

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


## Group translations instead of translating markup

Then there's markup inside each paragraph, like links and such.

You could do it right in the translation strings, but your translator then needs to know how to handle the markup, and you risk duplicating knowledge if you go as far as to hard-code link URLs.

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


## When you *do* need translated view files

If you need some fairly complex document with a bunch of headers, links and bullet points, perhaps your terms of use, you probably *do* want some markup and to use separate files.

But you can still use the simplest syntax possible – perhaps [Markdown](http://en.wikipedia.org/wiki/Markdown). Or implement your own subset, like [Prawndown](https://gist.github.com/2775319).

And instead of putting the files somewhere under `app/views`, keep them centralized, e.g. `config/locales/documents/terms.en.yml`, if they're not in your CMS.


## Use multiple YML files

If your app has different parts with different i18n needs, consider using multiple files.

Perhaps you have an admin section with only one or two locales, and a public section with a bunch.

Instead of having the translator needlessly translate your admin section to every locale, split it into a `config/locales/en.yml` and a `config/locales/admin.en.yml`.

Multiple files isn't just about limiting what you send to translators. It also means you can limit what you send to your automatic scripts, like tests, as described below.

By default, Rails will load all translations matching `config/locales/*.{rb,yml}`.


## Beware highly inflected languages

This will of course depend on your perspective, but: beware Finnish and other highly inflected languages.

As a grammar nerd, I actually love this stuff. But judging by my colleagues, *you* won't.

In languages like English and Swedish, you express something like "From New York" with a preposition (the word "from"). This is trivial to translate:

``` yml en.yml
from_x: "From %{x}"
```

``` yml sv.yml
from_x: "Från %{x}"
```

But in a language like Finnish, you inflect the word itself ([the ablative case](http://en.wikipedia.org/wiki/Ablative_case)): "New Yorkista" means "from New York". And the suffix isn't predictable without a dictionary: "from Berlin" is "Berliinistä".

You could list these variations in your translation files or other data source, but that takes some effort.

The easiest solution I [found](http://www.ruby-forum.com/topic/1897522) for this was simply to make small tweaks to avoid it altogether, e.g. "From: New York" instead of "From New York".

``` yml en.yml
from_x: "From: %{x}"
```

``` yml sv.yml
from_x: "Från: %{x}"
```

``` yml fi.yml
from_x: "Lähettäjä: %{x}"
```

Apparently this is enough to avoid inflecting the place name. Consult a speaker of the target language and see if you can come up with a workaround similar to this.


## YAML flattener plugin for Vim

I wrote [a plugin for Vim](https://github.com/henrik/vim-yaml-flattener) that lets you easily toggle a YML file between nested format:

``` yml xx.yml
en:
  baz: "baize"
  foo:
    bar: "baare"
```

and a flat format:

``` yml xx.yml
en.baz: "baize"
en.foo.bar: "baare"
```

This is really useful, as the flat format is easier to search and edit.

One could write a custom Rails i18n backend to always use the flat format, but the nested format has the benefit of being conventional, for use with other tools and services.

A nice side-effect of the plugin is that every time you toggle it, the keys will be sorted.


## Test that translations match up

I've also found it really useful to have a test in my test suite that verifies that all translations match up. So if `en.yml` has the key `foo.bar.baz`, then `sv.yml` should have it as well.

It's caught me a number of times when I mistakenly add a translation to only one locale, or remove a translation from only one locale.

[This is an example of such a test.](https://gist.github.com/2994129)

It even handles pluralization differences – these match up fine:

``` yml en.yml
table:
  one: "%{count} table"
  other: "%{count} tables"
```

``` yml sv.yml
table: "%{count} bord"
```

And if you want to exclude some translations from this test, because they won't be translated or haven't been translated yet, you can just use multiple YML files as described above. Simply make sure that the test knows which files to check and which to skip.


## Fin

I'm very interested to hear what tools and methods others use, and if you do things different from this. Let me know!
