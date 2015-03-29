# TweetDeck Enhancer 6

rewrite of things

## Building
You will need [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

The project source is in, not surprisingly, the `source` directory. Running `make` will download Node.js modules if needed, and create a directory called `stage` containing the compiled source that can be imported as an unpacked extension in Chrome/Safari. Release builds for Chrome Web Store (zip) and manual importing into Chrome (crx) can be generated with `make release`. A private key at `tools/key.pem` is required to sign the Chrome/Opera releases.

CSS is applied over the top of TweetDeck's, unlike prior releases of TweetDeck Enhancer that replaced the stylesheet completely. This allows the CSS to be cleaner and there's less chance of a code change in TweetDeck breaking it.

Source is linted to ensure high quality code. Use `make lint` to run the tests.
