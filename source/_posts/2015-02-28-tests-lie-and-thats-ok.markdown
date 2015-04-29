---
layout: post
title: "Tests lie and that's OK"
date: 2015-02-28 12:15
comments: true
categories:
- Testing
---

I wrote a test something like this:

```ruby linenos:false
describe Page, "#normalize" do
  it "strips spaces in every column" do
    page = Page.new
    page.title = "  Title  "
    page.description = "  Desc  "

    page.normalize

    expect(page.title).to eq("Title")
    expect(page.description).to eq("Desc")
  end
end
```

A code review comment said: Doesn't this test lie? It makes claims about *every* column, but only tests two of them.

I've been thinking about this disparity for a while.

A lot of tests – perhaps most tests – lie in this sense. A test claims `it "uppercases input"` but only actually verifies a few transformations out of the infinite input space.

If you uppercase infinite input, you simply can't cover every case. So you pick some interesting ones. Bugs are interesting cases you didn't think of beforehand.

With `Page#normalize`, you *could* cover every column, but the value is low. If we write the test and code in tandem and in good faith, this approximation is fine and enough to give us confidence that it works as described.

If we cover every column by listing them all, we will probably forget to update the test when new columns are added, so the completeness is fleeting. That could be guarded against with more code, but the effort isn't proportional to the derived value.

If we cover every column by introspection, we'll probably write test code that mirrors the implementation, which depreciates the value of the test.

And even if we cover every column, we don't cover every possible input. We need to draw the line somewhere.

I think of the test *description* as a statement of unbridled intent: we want the code to strip spaces in every column. The test *implementation* is then a kind of pragmatic judgment sampling that often will not correspond completely to the description. An optimistic lie. And that's OK.
