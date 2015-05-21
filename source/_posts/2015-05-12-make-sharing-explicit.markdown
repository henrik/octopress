---
layout: post
title: "Make sharing explicit"
date: 2015-05-12 20:50
comments: true
categories:
  - Ruby on Rails
---

When you reuse something, like a Ruby on Rails partial or i18n translation string, it's tempting to just reference it by its current name.

Maybe `admin/customers/show.html.erb` renders the `admin/customers/_invoices.html.erb` partial, and now you want to render it from `superadmin/customers/show.html.erb` as well.

Or maybe you use `t("customers.show.title")` to output a translation string in the `customers/show.html.erb` template, and now you want to reuse it in a customer widget elsewhere.

If you don't rename the partial or the translation key, the name will be left incorrectly suggesting it's related to just that one controller, or just that one template.

Now every future change is in jeopardy of this reasonable misunderstanding. Someone intends to change a page title but also accidentally changes the widget. They don't necessarily have the same reason to change.

Instead, you can make the sharing explicit.

You could move the partial to `shared/customers/_invoices.html.erb`, and the translation key to `shared.customers.title`.

Now if you change any of these values, you will *expect* them to have a wider effect.

I think of this a bit like private methods: being private suggests only being used in the same file. Being public suggests a wider scope.

As always, there are nuances and trade-offs. Using `customers.show.title` in a link to that page could make sense, for example, since we specifically want to reference the page title.
