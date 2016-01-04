---
layout: post
title: "Static sites alongside Dokku on Digital Ocean"
date: 2016-01-04 19:05
comments: true
categories:
  - Dokku
  - Digital Ocean
  - Nginx
---

I host most of my dynamic sites with [Dokku](http://dokku.viewdocs.io/dokku/) on [Digital Ocean](https://www.digitalocean.com/?refcode=a94740416de7) (referral link), through [their one-click install](https://www.digitalocean.com/features/one-click-apps/dokku/?refcode=a94740416de7).

Dokku is basically a self-hosted [Heroku](https://www.docker.com/), letting you run all your Sinatra, Rails, Phoenix or what-have-you apps [containerized](https://www.docker.com/) with little hassle.

I also have some static sites, though, like this blog.

You [can get static sites on Dokku](https://www.florianheinemann.com/github/dokku/2014/11/17/Hosting-static-pages-on-Dokku.html), but it feels a bit bloated to me, adding some magic files and then building a container, when you could just deploy by copying the files. A simple static site takes some 15 seconds to deploy via Dokku, vs. 1 second via `rsync` or `scp`.

So instead, I hosted them alongside Dokku, using the same Nginx that fronts Dokku.

## Find a place on the server

If you set up Dokku with Digital Ocean's one-click installer, you will have a `dokku` user home directory (`/home/dokku`) and a `root` user home directory (`/root`).

Neither seemed appropriate to store the static sites. Dokku makes assumptions about files stored in the `dokku` home directory. And Nginx (the `www-data` user it runs as) can't access stuff under `/root`. Nevermind any security implications of using the root account for this.

So, I created a new user named `static`:

    adduser static

Enter some password (and store it away) when prompted. Just accept the defaults for the other fields.

Then, I put the static files somewhere under that user's home directory, like `/home/static/sites/my-site`.


## Configure Nginx

Dokku adds some stuff to Nginx but doesn't mess with the regular way of adding sites, so we can still use that.

For our "my-site" example above, add a file at `/etc/nginx/sites-enabled/my-site` with these contents:

``` nginx /etc/nginx/sites-enabled/my-site linenos:false
server {
  root /home/static/sites/my-site;
  server_name my-site.com;

  access_log /var/log/nginx/my-site-access.log;
  error_log  /var/log/nginx/my-site-error.log;

  listen 80;
  index index.html;

  location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying a 404.
    try_files $uri $uri/ =404;
  }
}
```

If you like, you can verify that there are no errors in the configuration:

    sudo nginx -t -c /etc/nginx/nginx.conf

Then restart Nginx so it picks up this addition:

    sudo service nginx restart

And that should be it.
