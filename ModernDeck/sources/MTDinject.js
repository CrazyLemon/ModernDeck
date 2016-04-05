// MTDinject.js
// Copyright (c) 2016 Dangered Wolf, Jumono

// made with love <3

"use strict";

var SystemVersion = "6.0";
var MTDBaseURL = "https://dangeredwolf.com/assets/mtdtest/"; // Defaults to streaming if nothing else is available (i.e. legacy firefox)

var msgID = 0;
var messagesAccounted = [];

var MTDDark = true;

var addedColumnsLoadingTagAndIsWaiting = false;
var replacedLoadingSpinnerNew = false;
var progress = null;
var FindProfButton;

var TreatGeckoWithCare = false;
var profileProblem = false;
var wasTweetSheetOpen = false;
var WantsToBlockCommunications = true;
var WantsToDisableSecureStylesheets = false;

var FetchProfileInfo = 0;

var elements = function(a,b,c){return $(document.getElementsByClassName(a,b,c))};
var find1Obj = function(selector){return $(document.querySelector(selector))};

var Preferences = [];
var openmodal;

var make = function(a){return $(document.createElement(a))};
var head = $(document.head);
var body = $(document.body);
var html = $(document.querySelector("html")); // Only 1 result; faster to find

// Asks MTDLoad for the storage
window.postMessage({
	type: "getStorage"
}, "*");

// Adds each key in the extension storage to localStorage
window.addEventListener("message", function(e) {
	console.log(e.data);
	if (e.source == window) {
		if (e.data.type == "sendStorage") {
			var settings = e.data.message;
			for (var key in settings) {
				localStorage.setItem(key, settings[key]);
			}
		}
	}
});

window.addEventListener("beforeunload", function(e){
	var storage = {}
	for(var i = 0; i < localStorage.length; i++){
		var key = localStorage.key(i);
		if (key == "guestID" || key == "metrics.realtimeData") {
			continue;
		} else {
			storage[key] = localStorage[key];
		}
	}

	window.postMessage({
		type: "setStorage",
		message: storage
	}, "*");
})

Preferences.Appearance = [
	[
		"flag",
		"mtd-round-avatars",
		"mtd_round_avatars",
		"mtd-rounded-profiles-control",
		"Use rounded profile pictures",
		true
	],
]

Preferences.Accessibility = [
	[
		"flag",
		"mtd-outlines",
		"mtd_outlines",
		"mtd-outlines-control",
		"Always show outlines on focussed items",
		false
	]
]

if (typeof MTDURLExchange === "object" && typeof MTDURLExchange.getAttribute === "function") {
	MTDBaseURL = MTDURLExchange.getAttribute("type") || "https://dangeredwolf.com/assets/mtdtest/";
	console.info("MTDURLExchange completed with URL " + MTDBaseURL);
}

if (typeof chrome === "undefined" && typeof safari === "undefined") {
	TreatGeckoWithCare = true;
}

function getPref(id) {
	if (localStorage[id] === "true") {
		return true;
	} else if (localStorage[id] === "false") {
		return false;
	} else {
		return localStorage[id];
	}
}

function setPref(id,p) {
	localStorage[id] = p;
}

function GetURL(url) {
	return MTDBaseURL + url;
}

function fontParseHelper(a) {
	if (typeof a !== "object" || a === null) {
		throw "you forgot to pass the object";
	}

	return "@font-face{font-family:'" + (a.family || "Roboto") + "';font-style:" + (a.style || "normal") + ";font-weight:" + (a.weight || "300") + ";src:url(" + MTDBaseURL + "sources/fonts/" + a.name + ".woff2) format('woff2');unicode-range:" + (a.range || "U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF,U+2C60-2C7F,U+A720-A7FF") + "}";
}

function MTDInit(){

	if (typeof document.getElementsByClassName("js-signin-ui block")[0] !== "undefined" && !replacedLoadingSpinnerNew) {
		document.getElementsByClassName("js-signin-ui block")[0].innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
		replacedLoadingSpinnerNew = true;
	}
	if (
		typeof $ === "undefined" ||
		typeof TD_mustaches === "undefined" ||
		typeof TD === "undefined" ||
		typeof TD.util === "undefined" ||
		typeof TD.util.prettyTimeString === "undefined" ||
		typeof TD_mustaches["settings/global_setting_filter_row.mustache"] === "undefined"
	) {
		setTimeout(MTDInit,500);
		return;
	}

	// TD.controller.stats.dataminrApiRequest = function(){};
	// TD.controller.stats.dataminrAuthRequest = function(){};
	// TD.controller.stats.dataminrClickImpression = function(){};

	$(document.head).append(make("style").html(
		fontParseHelper({name:"Roboto300latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({name:"Roboto300latinext"}) +
		fontParseHelper({weight:"400",name:"Roboto400latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"400",name:"Roboto400latinext"}) +
		fontParseHelper({weight:"500",name:"Roboto500latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"500",name:"Roboto500latinext"}) +
		fontParseHelper({family:"Material Icons",weight:"400",name:"MaterialIcons",range:"U+0000-F000"}) +
		fontParseHelper({family:"Font Awesome",weight:"400",name:"fontawesome",range:"U+0000-F000"})
	));

	document.getElementsByClassName("js-modals-container")[0].removeChild = function(rmnode){
		$(rmnode).addClass("mtd-modal-window-fade-out");
		setTimeout(function(){
			rmnode.remove();
		},200);
	};

	$(document.getElementsByClassName("application")[0].childNodes).each(function(obj){

	})

	if (find1Obj(".js-modal").length > 0) {
		find1Obj(".js-modal").on("removeChild",function(rmnode){
			$(rmnode).addClass("mtd-modal-window-fade-out");
			setTimeout(function(){
				rmnode.remove();
			},200);
		});
	}

	body.on("removeChild",function(i) {
		if ($(i).hasClass("tooltip")) {
			setTimeout(function(){
				i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
			},500);
		} else {
	 		i.remove();
		}
 	});

	$("link[rel=\"shortcut icon\"]").attr("href",MTDBaseURL + "sources/favicon.ico");
	$(document.querySelector("audio")).attr("src",GetURL("sources/alert_2.mp3"));
	TD_mustaches["settings/global_setting_filter_row.mustache"]='<li class="list-filter cf"> {{_i}}<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div> {{>text/global_filter_value}}{{/i}} <input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative"> </li>';
	TD_mustaches["column_loading_placeholder.mustache"] = TD_mustaches["column_loading_placeholder.mustache"].replace("<span class=\"spinner-small\"></span>",'<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["spinner_large.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	TD_mustaches["spinner_large_white.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	TD_mustaches["spinner.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	TD_mustaches["column.mustache"] = TD_mustaches["column.mustache"].replace("Loading...","");
	TD_mustaches["media/media_gallery.mustache"] = TD_mustaches["media/media_gallery.mustache"].replace('<div class="js-embeditem med-embeditem"> ','<div class="js-embeditem med-embeditem"> <div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["modal.mustache"] = TD_mustaches["modal.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}" />','<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["twitter_profile.mustache"] = TD_mustaches["twitter_profile.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ','<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["follow_button.mustache"] = TD_mustaches["follow_button.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ','<div class="preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>')
	TD_mustaches["login/2fa_verification_code.mustache"] = TD_mustaches["login/2fa_verification_code.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["login/login_form_footer.mustache"] = TD_mustaches["login/login_form_footer.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["compose/docked_compose.mustache"] = TD_mustaches["compose/docked_compose.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');

	if (getPref("mtd_round_avatars") === false)
		html.addClass("mtd-no-round-avatars");
	else
		setPref("mtd_round_avatars",true);

	if (getPref("mtd_dark_media") === true)
		html.addClass("mtd-dark-media-previews");
	else
		setPref("mtd_dark_media",false);

	if (getPref("mtd_outlines") === true)
		html.addClass("mtd-acc-focus-ring");
	else
		setPref("mtd_outlines",false);

	html.addClass("mtd-back-" + getPref("mtd_theme"));

	TD.util.prettyTimeString = function(e) {
		return TD.i("{{hours12}}:{{minutes}} {{amPm}}, {{day}} {{month}} {{fullYear}}", TD.util.prettyTime(e));
	};

	NavigationSetup();

}

function WaitForLogin() {
	if (find1Obj(".app-signin-form").length > 0) {
		html.removeClass("signin-sheet-now-present");
		return;
	}
	setTimeout(WaitForLogin,500);
}

function SendNotificationMessage(txt) {
	var knotty = $(MTDNotification);
	if (knotty.hasClass("mtd-appbar-notification-hidden")) {
		knotty.removeClass("mtd-appbar-notification-hidden").html(txt);
	} else {
		knotty.addClass("mtd-appbar-notification-hidden").delay(300).queue(function(){knotty.html(txt).removeClass("mtd-appbar-notification-hidden")});
	}
}

function WaitForNotificationDismiss(node,prevmsgID) {
	if (typeof node === "undefined" || node === null || typeof node.parentNode === "undefined" || node.parentNode === null) {
		if (msgID === prevmsgID) {
			$(MTDNotification).addClass("mtd-appbar-notification-hidden");
			messagesAccounted[node] = undefined;
			return;
		} else {
			return;
		}
	}

	setTimeout(function(){WaitForNotificationDismiss(node,prevmsgID);},500);
}

function WorldTick(){

	// TODO: ADD THINGS FOR js-modal

	$(document).on('DOMNodeInserted', function(e) {
		var tar = $(e.target);
    if (tar.hasClass("dropdown")) {
			console.log("dropdown!!!");
			e.target.parentNode.removeChild = function(dropdown){
				$(dropdown).addClass("mtd-dropdown-fade-out");
				setTimeout(function(){
					dropdown.remove();
				},200);
			}
    } else if (tar.hasClass("status-message")) {
			console.log("status-message!!!");
			if (typeof messagesAccounted[this] === "undefined") {
				var thing = this;
				msgID++;
				SendNotificationMessage(this.childNodes[1].innerHTML);
				WaitForNotificationDismiss(thing,msgID);
				messagesAccounted[this] = true;
			}
		} else if (tar.hasClass("overlay")) {
			console.log("overlay!!!");
			if (!tar.hasClass("is-hidden")) {
				if (tar.hasClass("is-hidden")) {
					tar.addClass("mtd-modal-window-fade-out");
					setTimeout(function(){
						tar.remove();
					},300);
				}
			} else {
				var observer = new MutationObserver(function(mutations) {
					console.log("its gone now!");
				  if (tar.hasClass("is-hidden")) {
						tar.addClass("mtd-modal-window-fade-out");
						setTimeout(function(){
							tar.remove();
							observer.disconnect();
						},300);
					}
				});
				observer.observe(e.target, { attributes: true, childList: false, characterData: false });
			}
		}
	});

}

setTimeout(WorldTick,600);

function ResetSettingsUI() {
	$("#mtd-appearance-form,#mtd-accessibility-form,#mtd-about-form").css("display","none");
	$("#mtd-appearance-li,#mtd-accessibility-li,#mtd-about-li").removeClass("selected");
}

function PrefsListener() {
	console.log("Testing...");
	if (document.querySelector("#mtd-round-avatars-control") !== null ) {
		console.log("waiting...");

		if (localStorage.mtd_round_avatars === "true" && !$("#mtd-round-avatars-control")[0].checked) {
			console.log("Hey false!!");
			localStorage.mtd_round_avatars = false;
			html.addClass("mtd-no-round-avatars");
		}

		if (localStorage.mtd_round_avatars === "false" && $("#mtd-round-avatars-control")[0].checked) {
			console.log("Hey true!!");
			localStorage.mtd_round_avatars = true;
			html.removeClass("mtd-no-round-avatars");
		}

		if (localStorage.mtd_dark_media === "false" && $("#mtd-dark-media-control")[0].checked) {
			console.log("Hey true!!");
			localStorage.mtd_dark_media = true;
			html.addClass("mtd-dark-media-previews");
		}

		if (localStorage.mtd_dark_media === "true" && !$("#mtd-dark-media-control")[0].checked) {
			console.log("Hey false!!");
			localStorage.mtd_dark_media = false;
			html.removeClass("mtd-dark-media-previews");
		}

		if (localStorage.mtd_outlines === "false" && $("#mtd-outlines-control")[0].checked) {
			console.log("Hey true!!");
			localStorage.mtd_outlines = true;
			html.addClass("mtd-acc-focus-ring");
		}

		if (localStorage.mtd_outlines === "true" && !$("#mtd-outlines-control")[0].checked) {
			console.log("Hey false!!");
			localStorage.mtd_outlines = false;
			html.removeClass("mtd-acc-focus-ring");
		}

		if (localStorage.mtd_theme !== $("#mtd-theme-control option:selected")[0].value) {
			html.removeClass("mtd-back-" + localStorage.mtd_theme);
			localStorage.mtd_theme = $("#mtd-theme-control option:selected")[0].value;
			html.addClass("mtd-back-" + $("#mtd-theme-control option:selected")[0].value);
		}

		setTimeout(PrefsListener,500);
	}
}

function MTDSettings() {
	MTDPrepareWindows();
		setTimeout(function(){$(".js-app-settings").click();},10);
		setTimeout(function(){
			$("a[data-action='globalSettings']").click();
			var mtdsettingsmodalview = $("#settings-modal .mdl");
			mtdsettingsmodalview.addClass("mtd-settings-panel");
			var mtdsettingsmodalinner = $("#settings-modal .mdl .mdl-inner");
			$("#settings-modal .mdl .js-header-title").removeClass("js-header-title");
			$("#settings-modal .mdl .mdl-header-title").html("ModernDeck Settings");
			mtdsettingsmodalinner.html('<div class="mdl-content js-mdl-content horizontal-flow-container"> <div class="l-column mdl-column mdl-column-sml"> <div class="l-column-scrollv scroll-v	scroll-alt "> <ul class="lst-group js-setting-list">\
			<li id="mtd-appearance-li" class="selected"><a href="#" class="list-link" id="mtd_settings_appearance_button" data-action="general"><strong>Appearance</strong></a></li>\
			\
			<li id="mtd-accessibility-li"><a href="#" class="list-link" id="mtd_settings_accessibility_button" data-action="general"><strong>Accessibility</strong></a></li>\
			\
			<li id="mtd-about-li"><a href="#" class="list-link" id="mtd_settings_about_button" data-action="general"><strong>About</strong></a></li>\
			\
			\
			</ul> </div> </div> <div class="l-column mdl-column mdl-column-lrg"> <div class="l-column-scrollv scroll-v	scroll-alt mdl-col-settings">\
			\
			\
			<form action="#" id="mtd-appearance-form" accept-charset="utf-8" class="frm"><fieldset id="general_settings"><div class="control-group" style="padding-top:10px;"><label class="checkbox">Use rounded profile pictures<input type="checkbox" name="streaming-updates" checked="checked" id="mtd-round-avatars-control"> </label><label class="checkbox">Dark media viewer in light mode<input type="checkbox" name="streaming-updates" checked="checked" id="mtd-dark-media-control"> </label><label class="control-label">Theme<select name="streaming-updates" id="mtd-theme-control" type="select"><option value="none">Default</option><option value="paper">Paper</option><option value="grey">Grey</option><option value="red">Red</option><option value="pink">Pink</option><option value="orange">Orange</option><option value="violet">Violet</option><option value="teal">Teal</option><option value="green">Green</option><option value="yellow">Yellow</option><option value="cyan">Cyan</option><option value="black">Black</option><option value="blue">Blue</option></select></label></div></fieldset></form>\
			\
			<form action="#" id="mtd-accessibility-form" accept-charset="utf-8" class="frm" style="display:none;"><fieldset id="general_settings"><label class="checkbox">Always show outlines on focussed items<input type="checkbox" checked="checked" id="mtd-outlines-control"> </label></fieldset></form>\
			\
			<form action="#" id="mtd-about-form" accept-charset="utf-8" class="frm" style="display:none;"><fieldset id="general_settings"><img src="' + MTDBaseURL + 'sources/mtdabout.png" class="mtd-logo"><h1 class="list-placeholder mtd-about-title">ModernDeck</h1><h2 class="mtd-version-title">You\'re running version ' + SystemVersion + '</h2><div class="mdl-links" style="margin-bottom:-10px"> <a href="https://dangeredwolf.com/TweetDeckEnhancer/privacy.txt" style="display:none" target="_blank">Privacy Policy</a> </div></fieldset></form>\
			\
			</div> </div> </div>');

			$("#mtd-round-avatars-control").attr("checked",localStorage.mtd_round_avatars === "true" && true || false);
			$("#mtd-outlines-control").attr("checked",localStorage.mtd_outlines === "true" && true || false);
			$("#mtd-dark-media-control").attr("checked",localStorage.mtd_dark_media === "true" && true || false);
			$("#mtd-theme-control").val(localStorage.mtd_theme);


			PrefsListener();

			$("#mtd_settings_about_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#mtd-about-li").addClass("selected");
				$("#mtd-about-form").css("display","block");
			});

			$("#mtd_settings_appearance_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#mtd-appearance-li").addClass("selected");
				$("#mtd-appearance-form").css("display","block");
			});

			$("#mtd_settings_accessibility_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#mtd-accessibility-li").addClass("selected");
				$("#mtd-accessibility-form").css("display","block");
			});
		},100);
}

function PrepareLoginStuffs() {
	//console.log("Start prepare login stuffs");
	if (typeof $ === "undefined") {
		setTimeout(PrepareLoginStuffs,200);
		return;
	}

	FetchProfileInfo = 0;

	FindProfButton = $(".account-settings-row:first-child a[rel='user']");
	if (FindProfButton.length < 1) {
		$(".js-show-drawer.js-header-action").click();
		profileProblem = true;
		if (document.querySelector(".js-app.hide-detail-view-inline") !== null) {
			wasTweetSheetOpen = true;
		}
		console.log("profile problem!");
		setTimeout(PrepareLoginStuffs,50);
		return;
	}
	FindProfButton.click();
	setTimeout(FinaliseLoginStuffs,0);

	$(".js-click-trap").addClass("is-hidden").delay(50).queue(function(){$(this).addClass("is-hidden")});
}

function FinaliseLoginStuffs() {
	$(".js-click-trap").addClass("is-hidden");

	if ($(".prf-header").length < 1) {
		FetchProfileInfo++;

		if (FetchProfileInfo > 10) {
			console.log("this is not even working, uh lets try again");
			setTimeout(PrepareLoginStuffs,0);
			return;
		}
		setTimeout(FinaliseLoginStuffs,50);
		return;
	}

	if ($(".prf-header").attr("style").search("td_profile_empty") > 0) {
		$(mtd_nd_header_image).attr("style",$(".prf-header").attr("style")); // Fetch header and place in nav drawer
	}

	$(".prf-card-inner .username>.prf-follow-status").remove();

	$(mtd_nd_header_photo).attr("src",$(".prf-img>img").attr("src")); // Fetch profile picture and place in nav drawer
	$(mtd_nd_header_username).html($(".prf-card-inner .username").html()); // Fetch twitter handle and place in nav drawer

	console.log("Finished login stuffs! you are in the nav drawer, I think!");

	// TD.storage.clientController.client = [];
	// TD.storage.clientController.client.isDirty = false; // Attempts to get around TD bug

	if (profileProblem) {
		profileProblem = false;
		if (wasTweetSheetOpen) {
			find1Obj(".js-show-drawer.btn-compose").click();
		} else {
			find1Obj(".js-hide-drawer[data-title='Accounts']").click();
		}
		console.log("repaired profile problem with tweet thing");
	}
}

function NavigationSetup() {
	if (find1Obj(".app-header-inner").length < 1) {
		setTimeout(NavigationSetup,100);
		return;
	}

	$(".app-header-inner").append(
		make("a")
		.attr("id","mtd-navigation-drawer-button")
		.addClass("js-header-action mtd-drawer-button link-clean cf app-nav-link")
		.html('<div class="obj-left"><div class="mtd-nav-activator"></div><div class="nbfc padding-ts"></div>')
		.click(function(){
			// TODO: Wire button to open navigation drawer
			// TODO: Remove the above TODO from back when i was developing mtd 5.0

			if (typeof mtd_nav_drawer_background !== "undefined") {
				$("#mtd_nav_drawer_background").attr("class","mtd-nav-drawer-background");
			}
			if (typeof mtd_nav_drawer !== "undefined") {
				$("#mtd_nav_drawer").attr("class","mtd-nav-drawer");
			}
		})
	);

	$("body").append(
		make("div")
		.attr("id","mtd_nav_drawer")
		.addClass("mtd-nav-drawer mtd-nav-drawer-hidden")
		.append(
			make("img")
			.attr("id","mtd_nd_header_image")
			.addClass("mtd-nd-header-image")
			.attr("style","background:#00BCD4"),
			make("img")
			.addClass("avatar size73 mtd-nd-header-photo")
			.attr("id","mtd_nd_header_photo")
			.attr("src",""),
			make("div")
			.addClass("mtd-nd-header-username")
			.attr("id","mtd_nd_header_username")
			.html("PROFILE ERROR<br>Tell @dangeredwolf i said hi"),
			make("button")
			.addClass("btn mtd-nav-button mtd-settings-button")
			.attr("id","tdset")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/tweetdecksmall.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(function(){
				MTDPrepareWindows();

				setTimeout(function(){$(".js-app-settings").click()},10);
				setTimeout(function(){$("a[data-action='globalSettings']").click()},20);
			})
			.append("TweetDeck Settings"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","mtdsettings")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/MTDsmall.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(MTDSettings)
			.append("ModernDeck Settings"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","btdsettings")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/BTDsmall.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(function(){
				MTDPrepareWindows();
				setTimeout(function(){
					var opn = window.open("chrome-extension://micblkellenpbfapmcpcfhcoeohhnpob/options/options.html", '_blank');
					opn.focus();
				},200);
			})
			.append("Better TweetDeck Settings"),
			make("div")
			.addClass("mtd-nav-divider"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","mtd_signout")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/logout.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(function(){
				MTDPrepareWindows();
				setTimeout(function(){$(".js-app-settings").click()},10);
				setTimeout(function(){$("a[data-action='signOut']").click()},20);
			})
			.append("Sign Out"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","tdaccsbutton")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/accounts.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(function(){
				MTDPrepareWindows();
				$(".js-show-drawer.js-header-action").click();
			})
			.append("Your Accounts"),
			make("div")
			.addClass("mtd-nav-divider"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","kbshortcuts")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/KBshortcuts.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(function(){
				MTDPrepareWindows();
				setTimeout(function(){$(".js-app-settings").click()},10);
				setTimeout(function(){$("a[data-action='keyboardShortcutList']").click()},20);
			})
			.append("Keyboard Shortcuts"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","addcolumn")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/AddColumn.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(function(){
				MTDPrepareWindows();
				$(".js-header-add-column").click();
			})
			.append("Add Column")
		),
		make("div")
		.attr("id","mtd_nav_drawer_background")
		.addClass("mtd-nav-drawer-background mtd-nav-drawer-background-hidden")
		.click(function(){
			$(this).addClass("mtd-nav-drawer-background-hidden");
			$(mtd_nav_drawer).addClass("mtd-nav-drawer-hidden");
		})
	);

	$(".app-header-inner").append(
		make("div")
		.addClass("mtd-appbar-notification mtd-appbar-notification-hidden")
		.attr("id","MTDNotification")
	)

	window.MTDPrepareWindows = function() {
		$("#update-sound,.js-click-trap").click();
		mtd_nav_drawer_background.click();
	}

	if (TreatGeckoWithCare) {
		btdsettings.remove();
	}

	PrepareLoginStuffs();
}

function KeyboardShortcutHandler(e) {
	if (document.querySelector("input:focus,textarea:focus") !== null || e.keyCode !== 81) {
		return; // uses querySelector for optimal speed
	}

	if ($(mtd_nav_drawer).hasClass("mtd-nav-drawer-hidden")) {
		$("#mtd-navigation-drawer-button").click();
	} else {
		$(mtd_nav_drawer_background).click();
	}
}

function ReloadTheme() {
		var stuff = $(".application,html");
		stuff.removeClass("mtd-light mtd-dark");

		if (document.querySelector("meta[http-equiv='default-style']").content === "light") {
			stuff.addClass("mtd-light");
			MTDDark = false;
		} else {
			stuff.addClass("mtd-dark");
			MTDDark = true;
		}

		$("html").addClass("mtd-back-" + localStorage.mtd_theme);
}

function DisableSecureStylesheets() {
	if (!WantsToDisableSecureStylesheets) {
		console.log("Are you sure you want to disable secure stylesheets?");
		console.log("Bugfix and security updates will become slower and rely on core extension updates.");
		console.log("Run this command again to disable it.");
		WantsToDisableSecureStylesheets = true;
		return;
	} else {
		localStorage.mtd_flag_block_secure_ss = true;
		console.log("Secure stylesheets have been disabled");
	}
}

function EnableSecureStylesheets() {
	localStorage.mtd_flag_block_secure_ss = false;
	console.log("Thanks! For quicker updates and improvements, you have now enabled optional secure stylesheets.");
}

function diag() {
	try {
		attemptdiag();
	}
	catch(err) {
		$("#open-modal,.js-app-loading").append(
			make("div")
			.addClass("mdl s-tall-fixed")
			.append(
				make("header")
				.addClass("mdl-header")
				.append(
					make("h3")
					.addClass("mdl-header-title")
					.html("Diagnostics")
				),
				make("div")
				.addClass("mdl-inner")
				.append(
					make("div")
					.addClass("mdl-content")
					.css("padding-left","20px")
					.html("Well, that's unfortuate. I can't seem to be able to fetch diagnostics right now. Maybe refresh and try again?<br><br>(P.S. the error is " + (err ? err.toString() : "[miraculously, undefined.]") + ")")
				)
			)
		)
		.css("display","block");
	}
}

function closediag() {
	$("#open-modal,.js-app-loading").css("display","none");
}

function attemptdiag() {
	openmodal = find1Obj("#open-modal,.js-app-loading");

	openmodal.append(
			make("div")
			.addClass("mdl s-tall-fixed")
			.append(
					make("header")
					.addClass("mdl-header")
					.append(
							make("h3")
							.addClass("mdl-header-title")
							.html("Diagnostics")
					),
					make("div")
					.addClass("mdl-inner")
					.append(
							make("div")
							.addClass("mdl-content")
							.css("padding-left","20px")
							.html('\
							\
							\
							\
							<button class="btn" onclick="closediag();">Close Diagnostics</button>\
							<br>SystemVersion: ' + SystemVersion + '\
							<br>userAgent: ' + navigator.userAgent + '\
							<br>vendor: ' + navigator.vendor + '\
							<br>vendorSub: ' + navigator.vendorSub + '\
							<br>appCodeName: ' + navigator.appCodeName + '\
							<br>appName: ' + navigator.appName + '\
							<br>cookieEnabled: ' + navigator.cookieEnabled + '\
							<br>language: ' + navigator.language + '\
							<br>platform: ' + navigator.platform + '\
							<br>TreatGeckoWithCare: ' + TreatGeckoWithCare + '\
							<br>audiosrc: ' + document.getElementsByTagName("audio")[0].src + '\
							<br>MTDBaseURL: ' + MTDBaseURL + '\
							<br>MTDDark: ' + MTDDark + '\
							<br>FetchProfileInfo: ' + FetchProfileInfo + '\
							<br>mtd_round_avatars: ' + localStorage.mtd_round_avatars + '\
							<br>mtd_flag_block_secure_ss: ' + localStorage.mtd_flag_block_secure_ss + '\
							<br>mtd_flag_block_communications: ' + localStorage.mtd_flag_block_communications + '\
							<br>mtd_nd_header_image: ' + (typeof $("#mtd_nd_header_image")[0] !== "undefined" && $("#mtd_nd_header_image")[0].style.cssText) + '\
							<br>mtd_nd_header_username: ' + (typeof $("#mtd_nd_header_username")[0] !== "undefined" && $("#mtd_nd_header_username")[0].innerHTML) + '\
							<br>mtd_nd_header_photo: ' + (typeof $("#mtd_nd_header_photo")[0] !== "undefined" && $("#mtd_nd_header_photo")[0].src) + '\
							<br>guestID: ' + (TD.storage.store._backend.guestID) + '\
							<br>msgID: ' + (msgID) + '\
							<br>InjectFonts?: ' + (typeof InjectFonts !== "undefined") + '\
							\
							\
							\
							')
					)
			)
	)
	.css("display","block");
}

function dxdiag() {

		openmodal = find1Obj("#open-modal,.js-app-loading");

		openmodal.append(
				make("div")
				.addClass("mdl s-tall-fixed")
				.append(
						make("header")
						.addClass("mdl-header")
						.append(
								make("h3")
								.addClass("mdl-header-title")
								.html("DxDiag Help")
						),
						make("div")
						.addClass("mdl-inner")
						.append(
								make("div")
								.addClass("mdl-content")
								.css("padding-left","20px")
								.html('\
								This is a guide to help you acquire your DxDiag if asked by a developer.\
								<br><br>\
								Warning: This only applies for Windows. If you\'re running OS X / Linux / etc., this won\'t work.\
								<br><br>\
								Step 1: Press the Windows key + R key to open the Run dialog.<br>\
								Step 2: In the box of the new window, type in "dxdiag", and press the Enter key.<br>\
								Step 3: In the DirectX Diagnostic window, click the "Save All Information..." button at the bottom.<br>\
								Step 4: Save this file somewhere you\'ll remember, like the Desktop.<br>\
								Step 5: Upload the file to a file hosting site, for example, <a target="_blank" href="https://mega.nz">Mega</a> (no signup needed), or whereever you can easily share the link for the file with developers.\
								')
						)
				)
		)
		.css("display","block");
}

function addSpaceSuggestion(mtdtxt,clickd) {
	find1Obj(".mtd-no-chars-suggestions").append(
		make("button")
		.addClass("btn mtd-no-transform-case")
		.html(mtdtxt)
		.click(clickd)
		.click(function(){this.remove()})
	);
}

function checkSpaceSuggestions() {
	var tweetTxt = find1Obj(".compose-text").val();

	if (tweetTxt.match(/ ( )+/g) !== null) {
		addSpaceSuggestion("Trim excess space inside",function(){
			find1Obj(".compose-text").val(tweetTxt.replace(/ ( )+/g," "));
		});
	}

	if (tweetTxt.match(/(^\s+)|([^\w|.|\.|\!|\?]+?$)/gm) !== null) {
		addSpaceSuggestion("Trim excess space around edges",function(){
			find1Obj(".compose-text").val(tweetTxt.replace(/(^\s+)|([^\w|.|\.|\!|\?]+?$)/gm,""));
		});
	}

}

// TODO: write this future library as jquery

function outtaSpaceSuggestions() {

	if (typeof $(".js-media-added")[0] !== "undefined" && typeof $(".character-count-compose")[0] !== "undefined") {
		if (parseInt($(".character-count-compose")[0].value) < 0) {

			if (typeof $(".mtd-out-of-space-suggestions")[0] === "undefined") {

				NoCharsNotification = document.createElement("div");
				NoCharsNotification.className = "compose-media-bar-holder padding-al mtd-out-of-space-suggestions";
				NoCharsNotification.innerHTML = '<div class="compose-media-bar"><div class="mtd-no-chars-suggestions"><div class="txt weight-light txt-extra-large margin-b--10">Oops, you\'re over the character limit.</div>Here are suggestions to help:<br></div></div>';

				$(".js-media-added")[0].appendChild(NoCharsNotification);
				$(".js-media-added")[0].className = "js-media-added";

				checkSpaceSuggestions();
			}

		} else if (typeof $(".mtd-out-of-space-suggestions")[0] !== "undefined" && parseInt($(".character-count-compose")[0].value) >= 0) {
			$(".mtd-out-of-space-suggestions")[0].remove();
			$(".js-media-added")[0].className = "js-media-added is-hidden";
		}
	}

	setTimeout(outtaSpaceSuggestions,2000);
}

function spawnModule(fun,del) {
	if (typeof fun === "undefined") {
		console.error("WARNING: MTD attempted to spawn a module that doesn't exist. This is a software bug.");
	}
	setTimeout(fun,del);
}

spawnModule(MTDInit,0);
spawnModule(WorldTick,0);
//spawnModule(outtaSpaceSuggestions,7000);

html.addClass("mtd-preferences-differentiator mtd-api-ver-5-4 mtd-js-loaded");

ReloadTheme();

window.addEventListener("keyup",KeyboardShortcutHandler,false);

(new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		ReloadTheme();
	});
})).observe(document.querySelector("meta[http-equiv='default-style']"), {attributes:true});

console.log("MTDinject loaded");
