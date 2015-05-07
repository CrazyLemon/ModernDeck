ifeq ($(shell uname -s),Darwin)
CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
else
CHROME=google-chrome
endif

VERSION=$(shell ./tools/getversion.js)
ZIPNAME=../release/tde-chrome-$(VERSION).zip
STAGE=stage/TweetDeckEnhancer.safariextension

all: stage

npm:
ifeq ($(shell hash npm 2>&1 && echo 1),)
	$(error You need Node.js. See https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
endif

ifeq ($(shell [[ -d "node_modules" ]] && echo 1),)
	npm install
endif

lint: stage
	node_modules/csslint/cli.js \
		--ignore=box-sizing,bulletproof-font-face,fallback-colors \
		--errors=duplicate-properties,empty-rules,regex-selectors,vendor-prefix \
		$(wildcard stage/sources/css/*.css)

release: npm clean stage
	mkdir release

	cd stage && zip -qqr $(ZIPNAME) .
	cd tools && zip -qq $(ZIPNAME) key.pem

	$(CHROME) --no-message-box --pack-extension=$(PWD)/stage --pack-extension-key=tools/key.pem
	mv stage.crx release/tde-$(VERSION).crx

	xar -czf release/tde-$(VERSION).safariextz --distribution stage/TweetDeckEnhancer.safariextension/
	xar --sign -f release/tde-$(VERSION).safariextz --digestinfo-to-sign digest.dat --sig-size $(openssl dgst -sign tools/safari.pem -binary < tools/safari.pem | wc -c) --cert-loc tools/safari.der --cert-loc tools/safari01 --cert-loc tools/safari02
	openssl rsautl -sign -inkey certs/key.pem -in digest.dat -out sig.dat
	xar --inject-sig sig.dat -f release/tde-$(VERSION).safariextz
	rm -f sig.dat digest.dat

stage: npm clean
	mkdir stage

	rsync -ra source/ $(STAGE) --exclude=sources/scss
	cp {LICENSE,PRIVACY.md} $(STAGE)

	npm run build

clean:
	-[[ -d "stage" ]] && rm -r stage
	-[[ -d "release" ]] && rm -r release
