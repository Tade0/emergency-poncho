<img src="assets/poncho.svg" width=200 />

**This project is very far from production-ready. Use at your own risk.**

Emergency Poncho
====

Emergency Poncho is an [HTTP Archive](https://confluence.atlassian.com/kb/generating-har-files-and-analyzing-web-requests-720420612.html) replayer, grouping responses by URL and serving them in the order they were originally requested.

## Usage

 1. Save a *.har file from the Network tab in your Browser.
 1. Go to this repo's directory and `npm link`.
 1. `emergency-poncho my-archive.har`

## Use cases
 - Bug reproduction
 - Mock backend

----

Logo by the irreverent [Yanson](https://www.instagram.com/yansonart/).

## Caveats

- By default Firefox limits the size of recorded responses to 1MB. To switch this off, go to `about:config` and set `devtools.netmonitor.responseBodyLimit` to `0`.