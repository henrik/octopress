---
wordpress_id: 240
title: Updating plugins for Adium 1.3
categories:
- OS X
- Cocoa
- Adium
date: 2008-08-28 11:20
layout: post
comments: true
---
I just got my <a href="http://www.adiumxtras.com/index.php?a=xtras&xtra_id=4282">File Transfer Sender Subdirectories plugin</a> working with Adium 1.3.

I also moved <a href="http://github.com/henrik/file_transfer_sender_subdirectories_plugin/">the source</a> to git/GitHub.

A mail sent out to all <a href="http://adiumxtras.com">adiumxtras.com</a> plug-in authors gave some pointers on moving to Adium 1.3:

All plugins must be recompiled for Adium 1.3, since <code>adium</code> was changed from instance variable to global constant.

You must also add a minimum Adium version to the <code>Info.plist</code> file, e.g.

``` xml
<key>AIMinimumAdiumVersionRequirement</key>
<string>1.3</string>
```

I did these things, but my plugin would not build. I needed to include two more headers – many thanks to <code>Catfish_Man</code> in <a href="irc://irc.freenode.net/adium-devl">#adium-devl</a> for helping me out.

<!--more-->

<h4>AIUtilities/AITigerCompatibility.h</h4>

My plugin was originally configured to compile for OS X 10.4 Tiger. This is a good idea, since Adium 1.3 itself is still compatible with Tiger.

But I got these errors trying to build the plugin:

    error: syntax error before 'NSUInteger'

referencing the code

``` c
/*!
 * @brief Get the visbile object at a given index
*/
- (AIListObject *)visibleObjectAtIndex:(NSUInteger)index;
```

and

    fatal error: method definition not in @implementation context

referencing

``` obj-c
- (void)listObject:(AIListObject *)listObject didSetOrderIndex:(float)inOrderIndex;
```

To fix that, I had to include another header in my plugin's main <code>.h</code> file:

``` obj-c
#import <AIUtilities/AITigerCompatibility.h>
```

<h4>Adium/AISharedAdium.h</h4>

When that was done, or if I built for OS X 10.5 Leopard only, I instead got a couple of

    error: ‘adium’ undeclared (first use in this function)

from lines trying to use that constant.

That required another header:

``` obj-c
#import <Adium/AISharedAdium.h>
```

Hope this helps someone.
