// TDERun.js
// TweetDeck Enhancer
// Copyright (c) 2015 Dangered Wolf & The TweetDeck Enhancer Open Source Project

function ReloadTheme() {
    document.querySelector("html").className = document.querySelector("html").className.replace(" tde-dark","").replace(" tde-light","")
    if (document.querySelector("link[title='dark'][disabled]") !== null) {
        document.querySelector("html").className += " tde-light";
    } else {
        document.querySelector("html").className += " tde-dark";
    }
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    ReloadTheme();
  });    
});

observer.observe(document.querySelector("link[title='dark']"), {attributes:true,childList:true,characterData:true});

ReloadTheme();