---
layout: post
title: "Open in iTerm Vim from Finder"
date: 2015-02-01 11:25
comments: true
categories:
  - Vim
  - OS X
  - AppleScript
---

When I double-click a code file in Finder, I want it to open in Vim in a terminal. Not in MacVim. Not in some lesser editor.

There's [plenty](http://dustractor.github.io/vimini/) of [prior work](http://superuser.com/questions/139352/mac-os-x-how-to-open-vim-in-terminal-when-double-click-on-a-file), but nothing worked well for me on OS X 10.10 Yosemite, so I rolled my own.

The end result: double-clicking a file opens a new [iTerm](http://iterm2.com/) window with the file opened in Vim.

Since it `exec`s Vim (replaces the shell process), the window closes when you quit Vim. This also means you can't `⌃Z` out of the Vim session. Think of it as an editor window, not a full-fledged terminal.

## 1. Get an `.app`

[Download TerminalVim.app](http://cl.ly/0H3X3L1G2t05), unzip it and stick the app in `/Applications`.

Or make your own:

* Open Apple's "Automator" app.
* If you get a file dialog, opt to create a "New Document".
* Select the "Application" type.
* Search the action list for "Run AppleScript", double-click that option.
* Change the script to this (hat tip to [Rob Peck](http://www.robpeck.com/2010/05/scripting-iterm-with-applescript/)):

``` applescript linenos:false
on run {input, parameters}
	set myPath to POSIX path of input
	set cmd to "vim " & quote & myPath & quote

	tell application "iTerm"
		activate
		set myTerm to (make new terminal)
		tell myTerm
			set mySession to (make new session at the end of sessions)
			tell mySession to exec command cmd
		end tell
	end tell
end run
```

* Save as `/Applications/TerminalVim.app`.

## 2. Tell Finder to use your app

* In Finder, select some file you want to open in Vim, e.g. a `.rb` file.
* Hit `⌘I` to open the "Get Info" window.
* Under "Open with:", choose "TerminalVim.app". You may need to select "Other…" and then browse.
* Hit the "Change All…" button and confirm.

Now all `.rb` files in Finder will open in Vim.

## 3. Profit

That's it!
