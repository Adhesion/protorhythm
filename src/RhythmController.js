"use strict";

var RhythmController = me.Renderable.extend({
    init: function(x, y, width, height) {
        this._super(me.Renderable, "init", [x, y, width, height]);

        this.noteData = [];
        this.onScreenNotes = [];
        this.onScreenTimeMS = 1250.0;

        this.noteStartY = 0;
        this.noteEndY = 640;

        this.parseNoteData(me.loader.getJSON("longtest"));
        this.currentTime = 0.0;
        me.audio.play("longtest");

        this.maxHitWindow = 116.666;
        // This should be sorted smallest to largest!
        this.hitWindows = [
            { min: 16.666, max: 16.666, value: "RAD!" },
            { min: this.maxHitWindow, max: this.maxHitWindow, value: "meh" }
        ];

        this.keysub = me.event.subscribe(me.event.KEYDOWN, this.handleNoteInput.bind(this));

        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);
    },

    parseNoteData: function(noteJSON) {
        for (var trackName in noteJSON) {
            var track = noteJSON[trackName];
            track.forEach(function(event) {
                if (event["type"] === "noteOn") {
                    var note = { timeMS: event["timeMS"], note: event["note"]};
                    this.noteData.push(note);
                }
            }.bind(this));
        }

        // sort by timeMS
        this.noteData.sort(function(a, b) {
            return a["timeMS"] - b["timeMS"];
        });
    },

    noteNumToKey: function(noteMIDI) {
        return noteMIDI % 4;
    },

    isNoteInWindow: function(note) {
        var time = note["timeMS"];

        for (var i = 0; i < this.hitWindows.length; i++) {
            var window = this.hitWindows[i];
            //console.log("checking " + time + " with " + window["min"] + ", " + window["max"] + " at " + this.currentTime);
            if (time >= this.currentTime - window["min"] && time <= this.currentTime + window["max"]) {
                return window["value"];
            }
        }

        return null;
    },

    handleNoteInput: function(action, keycode, edge) {
        console.log("note input: " + action + ", " + keycode + ", " + edge);
        if (action) {
            for (var i = 0; i < this.onScreenNotes.length; i++) {
                var note = this.onScreenNotes[i];
                var keyString = "note" + note["key"].toString();

                if (action == keyString) {
                    var inWindow = this.isNoteInWindow(note);

                    if (inWindow) {
                        console.log("hit! " + inWindow);
                        this.removeNoteAt(i);
                        return;
                    }
                }
            }
        }
    },

    addNoteToScreen: function(noteData) {
        var key = this.noteNumToKey(noteData["note"]);
        var x = 100 + key * 100;
        var image = new me.AnimationSheet(x, this.noteStartY, {image: "intro_glasses1", framewidth: 144, frameheight: 24});
        image.alwaysUpdate = true;

        noteData["image"] = image;
        noteData["key"] = key;

        this.onScreenNotes.push(noteData);
        me.game.world.addChild(image, 1);
    },

    removeNoteAt: function(index) {
        me.game.world.removeChild(this.onScreenNotes[index]["image"]);
        this.onScreenNotes.splice(index, 1);
    },

    updateScreenNotes: function() {
        for (var i = this.onScreenNotes.length - 1; i >= 0; i--) {
            var note = this.onScreenNotes[i];

            // notes travel from start y to end y
            // start y is equivalent to current time + on screen time
            // end y is equivalent to current time
            var proportionalDistance = (this.currentTime + this.onScreenTimeMS - note["timeMS"]) / this.onScreenTimeMS;
            var y = this.noteStartY + (this.noteEndY - this.noteStartY) * proportionalDistance;
            note["image"].pos.y = y;
            //console.log("updating note " + note["key"] + " to " + y + " with prop " + proportionalDistance);

            // Remove notes that are past our hit window
            if (note["timeMS"] < this.currentTime - this.maxHitWindow) {
                this.removeNoteAt(i);
                console.log("miss!");
                //console.log("screen notes: " + this.onScreenNotes.length);
            }
        }
    },

    update: function(dt) {
        this._super(me.Entity, "update", [dt]);

        while(this.noteData.length > 0 && this.noteData[0]["timeMS"] <= this.currentTime + this.onScreenTimeMS) {
            //console.log("passed note: " + this.noteData[0]["note"] + " at " + this.noteData[0]["timeMS"]);
            this.addNoteToScreen(this.noteData[0]);
            this.noteData.shift();
        }

        this.updateScreenNotes();

        this.currentTime += dt;
    }
});
