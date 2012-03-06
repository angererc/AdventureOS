function TimeService(minInterval) {
	this.registered = [];
	this.lastAwokenAt = Date.now();
	this.maxStep = 100;
	this.gameTime = 0;
	this.timeoutId = 0;
}

TimeService.methods({
	tick: function() {
		var now = Date.now();
		var diff = now - this.lastAwokenAt;
		if (diff > this.maxStep) { diff = this.maxStep; }
		this.gameTime += diff;
		this.lastAwokenAt = now;
		for (int i = 0; i < this.registered.length; i++) {
			this.registered[i].tick(this.gameTime);
		}
	},
	
	start: function() {
		var self = this;
		this.timeoutId = window.setInterval(
			function() { self.tick() },
			this.minInterval);
	},
		
	addListener: function(listener) {
		this.registered.push(listener);
	},
		
	stop: function() {
		window.clearInterval(this.timeoutId);
		this.timeoutId = 0;
	}
});
