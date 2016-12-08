"use strict";

var GameResources = (function() {
	/**
	 * @param {String} name file name relative to data/audio.
	 */
	function _Audio( name ) {
		return { name: name, type: "audio", src: "data/audio/" , channels: 2 };
	}

	function _Image( name ) {
		return { name: name, type: "image", src: "data/" + name + ".png" };
	}

	var GameResources = [
		{ name: "ld23space", type: "json", src: "data/ld23space-aftertouch.json" },
		{ name: "longtest", type: "json", src: "data/longtest.json" },
		_Audio("ld23-space"),
		_Audio("longtest"),
		_Image("intro_glasses1"),
	];

	return GameResources;
})();
