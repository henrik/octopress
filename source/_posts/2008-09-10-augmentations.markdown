---
wordpress_id: 244
title: Augmentations plugin for Rails
categories:
- Ruby
- Ruby on Rails
date: 2008-09-10 15:19
layout: post
comments: true
---
I've blogged previously about <a href="http://henrik.nyh.se/2008/02/rails-model-extensions">Rails model extensions</a>: how to use modules to break up complex models, or to share code between models.

So far I've been using the standard Ruby <code>include</code> to include the modules in the models, and the <code>self.included</code> hook to add class-level code.

This is not too elegant, so I came up with a plugin to make it more palatable.

See the <a href="http://github.com">github</a> repository for the code and more details:

<a href="http://github.com/henrik/augmentations">http://github.com/henrik/augmentations</a>
