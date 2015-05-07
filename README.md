# TweetDeck Enhancer 6

rewrite of things

## Building
You will need [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

The project source is in, not surprisingly, the `source` directory. Running `make` will download Node.js modules if needed, and create a directory called `stage` containing the compiled source that can be imported as an unpacked extension in Chrome/Safari. Release builds for Chrome Web Store (zip) and manual importing into Chrome (crx) can be generated with `make release`. A private key at `tools/key.pem` is required to sign the Chrome/Opera releases.

CSS is applied over the top of TweetDeck's, unlike prior releases of TweetDeck Enhancer that replaced the stylesheet completely. This allows the CSS to be cleaner and there's less chance of a code change in TweetDeck breaking it.

Source is linted to ensure high quality code. Use `make lint` to run the tests.

### Safari
**INCOMPLETE**

Safari likes to make things harder. First, you need to have [mackyle's fork of xar](https://mackyle.github.io/xar/). If you use Homebrew, try `brew install hbang/repo/xar-mackyle`. Otherwise, download and compile it from the website. You also need to have a developer certificate from the [Safari dev center](https://developer.apple.com/account/safari/certificate/certificateList.action). A Safari developer subscription is free.

Open Keychain Access (in /Applications/Utilities) and find your Safari developer certificate's private key. Right click it and choose Export. Save it somewhere, don't worry about giving it a password (you won't need this exported file afterwards), and then enter your password.

From Terminal, run the following, providing the certificate's password or just pressing enter:

```bash
openssl pkcs12 -in ~/Desktop/cert.p12 -nodes | openssl x509 -outform der -out tools/safari.der
openssl pkcs12 -in ~/Desktop/cert.p12 -nodes | openssl rsa -out tools/safari.pem
openssl dgst -sign tools/safari.pem -binary < tools/safari.pem | wc -c > size.txt
```

*Courtesy of [this Stack Overflow answer](http://stackoverflow.com/a/20338339/709376).*

