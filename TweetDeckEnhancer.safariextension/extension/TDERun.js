// TDERun.js
// TweetDeck Enhancer
// Copyright (c) 2015 Dangered Wolf & The TweetDeck Enhancer Open Source Project

function Initialise() {
    if (document.querySelector("link[title='dark'][disabled]") !== null) {
        document.querySelector("html").className += " tde-light";
    } else {
        document.querySelector("html").className += " tde-dark";
    }
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    console.log(mutation.type);
  });    
});

Initialise();