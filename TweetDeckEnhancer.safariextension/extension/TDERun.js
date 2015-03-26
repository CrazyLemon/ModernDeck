// TDERun.js
// TweetDeck Enhancer
// Copyright (c) 2015 Dangered Wolf & The TweetDeck Enhancer Open Source Project

// object.watch

function Initialise() {
    if (!Object.prototype.watch) {
        Object.prototype.watch = function (prop, handler) {
            var oldval = this[prop], newval = oldval,
            getter = function () {
                return newval;
            },
            setter = function (val) {
                oldval = newval;
                console.log(prop);
                console.log(val);
                return newval = handler.call(this, prop, oldval, val);
            };
            if (delete this[prop]) { // can't watch constants
                if (Object.defineProperty) { // ECMAScript 5
                    Object.defineProperty(this, prop, {
                        get: getter,
                        set: setter
                    });
                } else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
                    Object.prototype.__defineGetter__.call(this, prop, getter);
                    Object.prototype.__defineSetter__.call(this, prop, setter);
                }
            }
        };
    }

    // object.unwatch

    if (!Object.prototype.unwatch) {
        Object.prototype.unwatch = function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        };
    }

    if (document.querySelector("link[title='dark']")) {
        document.querySelector("link[title='dark']").watch("disabled",function(dark) {
            console.log("uhm");
            console.log(dark);
        });
    }
}

Initialise();