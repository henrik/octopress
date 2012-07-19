// The file is named this way to come alphabetically after octopress.js.

/* Sky Slavin, Ludopoli. MIT license.  * based on JavaScript Pretty Date * Copyright (c) 2008 John Resig (jquery.com) * Licensed under the MIT license.  */
/* Updated considerably by Brandon Mathis */

octopress.prettyDate = function (time) {
  if (navigator.appName === 'Microsoft Internet Explorer') {
    return "<span>&infin;</span>"; // because IE date parsing isn't fun.
  }
  var say = {
    just_now:    " just now",
    minute_ago:  "1 minute ago",
    minutes_ago: " minutes ago",
    hour_ago:    "1 hour ago",
    hours_ago:   " hours ago",
    yesterday:   "1 day ago",
    days_ago:    " days ago",
    last_week:   "1 week ago",
    weeks_ago:   " weeks ago"
  };

  var current_date = new Date(),
      current_date_time = current_date.getTime(),
      current_date_full = current_date_time + (1 * 60000),
      date = new Date(time),
      diff = ((current_date_full - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);

  if (isNaN(day_diff) || day_diff < 0) { return "<span>&infin;</span>"; }

  return day_diff === 0 && (
    diff < 60 && say.just_now ||
    diff < 120 && say.minute_ago ||
    diff < 3600 && Math.floor(diff / 60) + say.minutes_ago ||
    diff < 7200 && say.hour_ago ||
    diff < 86400 && Math.floor(diff / 3600) + say.hours_ago) ||
    day_diff === 1 && say.yesterday ||
    day_diff < 7 && day_diff + say.days_ago ||
    day_diff === 7 && say.last_week ||
    day_diff > 7 && Math.ceil(day_diff / 7) + say.weeks_ago;
};

// Twitter fetcher for Octopress (c) Brandon Mathis // MIT License
// Modified by Henrik Nyh.
octopress.twitter = (function() {
  function linkifyTweet(text, url) {
    // Linkify urls, usernames, hashtags
    text = text.replace(/(https?:\/\/)([\w\-:;?&=+.%#\/]+)/gi, '<a href="$1$2">$2</a>')
      .replace(/(^|\W)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>')
      .replace(/(^|\W)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>');

    // Use twitter's api to replace t.co shortened urls with expanded ones.
    for (var u in url) {
      if(url[u].expanded_url != null){
        var shortUrl = new RegExp(url[u].url, 'g');
        text = text.replace(shortUrl, url[u].expanded_url);
        var shortUrl = new RegExp(">"+(url[u].url.replace(/https?:\/\//, '')), 'g');
        text = text.replace(shortUrl, ">"+url[u].display_url);
      }
    }
    return text
  }

  function render(tweets, twitter_user) {
    var timeline = document.getElementById('tweets'),
        content = '';

    for (var t in tweets) {
      var id = tweets[t].id_str;
      var date = octopress.prettyDate(tweets[t].created_at);
      var body = linkifyTweet(tweets[t].text.replace(/\n/g, '<br>'), tweets[t].entities.urls);
      content += '<li><p>'+body+' <a href="http://twitter.com/'+twitter_user+'/status/'+id+'" class="twitter-date">'+date+'</a></p></li>';
    }
    timeline.innerHTML = content;
  }

  return {
    getFeed: function(target){
      target = $(target);
      if (target.length == 0) return;
      var user = target.attr('data-user');
      var count = parseInt(target.attr('data-count'), 10);
      var replies = target.attr('data-replies') == 'true';
      $.ajax({
          url: "http://api.twitter.com/1/statuses/user_timeline/" + user + ".json?trim_user=true&count=" + (count + 20) + "&include_entities=1&exclude_replies=" + (replies ? "0" : "1") + "&callback=?"
        , dataType: 'jsonp'
        , error: function (err) { $('#tweets li.loading').addClass('error').text("Twitter's busted"); }
        , success: function(data) { render(data.slice(0, count), user); }
      });
    }
  }
})();
