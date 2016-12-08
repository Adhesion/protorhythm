"use strict";

var PlayScreen = me.ScreenObject.extend({
	init: function(game) {
		this._super(me.ScreenObject, 'init', []);
		this.game = game;
	},

	onResetEvent: function() {
		me.game.world.autoSort = true;
		me.game.world.autoDepth = false;

		var keys = {
			note0: [me.input.KEY.X],
			note1: [me.input.KEY.C],
			note2: [me.input.KEY.V],
			note3: [me.input.KEY.B],
		};

		Object.keys(keys).forEach(function(k) {
			keys[k].forEach(function(code) {
				me.input.bindKey(code, k);
			})
		})

		window.onReady(function () {
			me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.Z);
		});

		if(me.input.GAMEPAD) {
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_1, keys.note0[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_2, keys.note1[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_3, keys.note2[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_4, keys.note3[0]);
		}

		this.rhythmController = new RhythmController(0, 0, this.game.screenWidth, this.game.screenHeight);
		me.game.world.addChild(this.rhythmController);
	},

	onDestroyEvent: function() {

	},
});
