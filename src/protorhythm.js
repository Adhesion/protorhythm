"use strict";

function protorhythm() {
	this.screenHeight = 640;
	this.screenWidth = 960;
	this.options = {};
}

protorhythm.prototype.onload = function() {
	// Load URL parameters

	window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		this.options[key] = value;
	}.bind(this));

	// Initialize the video.
	if (!me.video.init(this.screenWidth, this.screenHeight, {
		wrapper: "screen",
		scale: 1.0,
	})) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "?debug=1" to the URL to enable the debug Panel
	if (this.options.debug) {
		window.onReady(function () {
			me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
		});
	}

	me.audio.init("mp3,ogg");
	me.loader.onload = this.loaded.bind(this);
	me.loader.preload(GameResources);
	me.state.change(me.state.LOADING);
}

protorhythm.prototype.loaded = function() {
	me.state.set(me.state.PLAY, new PlayScreen(this));
	me.state.change(me.state.PLAY);
}
