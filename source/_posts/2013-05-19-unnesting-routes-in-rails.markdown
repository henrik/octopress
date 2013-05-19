---
layout: post
title: "Unnesting routes in Rails"
date: 2013-05-19 13:30
comments: true
categories:
  - Ruby on Rails
---

If your app has sellers with contracts, you may reasonably end up with paths like `/sellers/1/contracts`.

After all, you need the seller id to know what subset of contracts to list.

If contracts then have items, you may find yourself with paths like `/sellers/1/contracts/2/items/3/edit`.

That's a mouthful, and you need to provide all those ids every time you generate a path: `edit_seller_contract_item_path(seller, contract, item)`

Instead, let's rethink it.

Sure, you need the seller id to know what subset of contracts to list. So `/sellers/1/contracts` is fine.

But when you show a specific contract, the seller id is redundant. Therefore `/contracts/2` is enough.

What about the other actions?

Whenever you have the contract id, the seller id is redundant. So that applies to the `show`, `edit`, `update` and `destroy` actions.

Only `index`, `new` and `create` require the seller id, because the contract doesn't yet exist.

This all works really well in Rails. Just route them separately:

``` ruby config/routes.rb
resources :contracts, only: [ :show, :edit, :update, :destroy ]

resources :sellers, only: [ :index, :show ] do
  resources :contracts, only: [ :index, :new, :create ]
end
```

Of course, you only list the actions you use. If you have many routes, [you want to do this anyway](http://guides.rubyonrails.org/routing.html#restricting-the-routes-created), for speed.

[You can even specify `shallow: true`](http://edgeguides.rubyonrails.org/routing.html#shallow-nesting) and Rails will do this for you:

``` ruby config/routes.rb
resources :sellers, only: [ :index, :show ] do
  resources :contracts, only: [ :index, :show, … ], shallow: true
end
```


Rails is clever enough that all the contract routes will go to one and the same controller with no extra effort:

``` ruby app/controllers/contracts_controller.rb
class ContractsController < ApplicationController
  def index
    @seller = Seller.find(params[:seller_id])
    @contracts = @seller.contracts
  end

  def show
    @contract = Contract.find(params[:id])
  end

  # …
end
```

Because you typically nest routes under `show` – and rarely under `index`, `new` or `create` – this ensures that you'll rarely have more than two levels of nesting, even if the chain of records is long.

So even if your sellers have contracts with items with viewings, the routes at the far end of that graph will be no longer than `/viewings/4`, instead of `/sellers/1/contracts/2/items/3/viewings/4`.
