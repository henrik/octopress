---
layout: post
title: "Customizing Rails.vim"
date: 2013-01-12 19:35
comments: true
external-url:
categories:
  - Vim
  - Ruby on Rails
---

I read through `:help rails.txt` to see if Rails.vim included anything useful that I wasn't using already.

The biggest discovery was how customizable it is.


## Customize alternate file mappings

Rails.vim lets you jump between "alternate files" with `:A`. Typically, that's something like `app/models/item.rb` ↔ `spec/models/item_spec.rb`.

If you stray too far from the Rails conventions, though, `:A` can no longer help you.

We have a Rails-less test suite in `unit` and engines right inside the main app for technical reasons. When we're working on any of those files, `:A` does not work and we grumble. Clearly we were not intended to test things outside Rails.

But it [turns out](https://github.com/tpope/vim-rails/issues/146) it's fairly easy to add your own mappings, even with fallbacks. This is now in our Vim configs:

``` vim
" :A on lib/foo.rb -> unit/lib/foo_spec.rb
autocmd User Rails/lib/* let b:rails_alternate = 'unit/' . rails#buffer().name()[0:-4] . '_spec.rb'

" :A on unit/lib/foo_spec.rb -> lib/foo.rb
autocmd User Rails/unit/lib/* let b:rails_alternate = rails#buffer().name()[5:-9] . '.rb'

" :A on engines/foo/bar.rb -> {spec,unit}/engines/foo/bar_spec.rb
autocmd User Rails/engines/* let common = rails#buffer().name()[0:-4].'_spec.rb' | let spec = 'spec/'.common | let unit = 'unit/'.common | let b:rails_alternate = filereadable(spec) ? spec : unit

" :A on spec/engines/foo/bar_spec.rb -> engines/foo/bar.rb
autocmd User Rails/spec/engines/* let b:rails_alternate = rails#buffer().name()[5:-9] . '.rb'

" :A on unit/engines/foo/bar_spec.rb -> engines/foo/bar.rb
autocmd User Rails/unit/engines/* let b:rails_alternate = rails#buffer().name()[5:-9] . '.rb'
```

Note that in the third example, it looks for an alternate in `spec`, with `unit` as a fallback.

Though I haven't seen a use for it yet, you could change the `:R` "related file" mappings in much the same way. Maybe to jump between your two god classes?


## Customize navigation commands

Rails.vim comes with commands like `:Rmodel` and :`Rcontroller` to open a certain type of file with autocompletion.

Turns out you can add your own navigation commands. I added two, for [Fabrication](http://www.fabricationgem.org/) (which we're moving away from) and [FactoryGirl](https://github.com/thoughtbot/factory_girl) factories:

``` vim
" :Rfac item
autocmd User Rails Rnavcommand factory    spec/factories   -suffix=_factory.rb

" :Rfab item
autocmd User Rails Rnavcommand fabricator spec/fabricators -suffix=_fabricator.rb
```

With that, you simply run `:Rfac item<Enter>` or `:Rfac it<Tab><Enter>` to open `spec/factories/item_factory.rb`.
