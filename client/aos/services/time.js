define([], function() {
	
	/*in the long run we should use requestAnimationFrame instead of interval
	see here:
	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	*/

	/*spec properties: 
		minInterval, maxStep
	*/
	var createTimer = function(spec) {
		spec = spec || {};
		var self = {};
		
		var intervalID = undefined;
		var maxStep = spec.maxStep || 100;
		var gameTime = 0;		
		var lastTick = Date.now();
		var minInterval = spec.minInterval || 10;
		
		//a map from time intervals to objects of the form
		// { lastCall:<game time>, callbacks:<list of callback functions>}
		var registry = {};
		
		var tick = function() {
			var now = Date.now();
			var waited = Math.min(now - lastTick, maxStep);
			gameTime += waited;
			lastTick = now;

			var interval, regInfo, timeSinceLastCall;
			for(interval in registry) {
				if(registry.hasOwnProperty(interval)) {
					regInfo = registry[interval];
					//check for each specified interval 
					//'whether the last call was too long ago'
					timeSinceLastCall = gameTime - regInfo.lastCall;
					if(interval <= timeSinceLastCall) {
						regInfo.lastCall = gameTime;
						regInfo.callbacks.forEach(
							function(callback){callback(gameTime);}
						);
					}
				}
			}
		};

		self.start = function() {
			if(intervalID) { self.stop(); }
			intervalID = window.setInterval(tick, minInterval);
		}
		
		self.stop = function() {
			window.clearInterval(intervalID);
			intervalID = undefined;
		}
		
		self.addTickCallback = function(callback, interval) {
			interval = interval || minInterval;
			var regInfo = registry[interval];
			if(! regInfo) {
				regInfo = {
					lastCall: gameTime,
					callbacks: [],
				};
				registry[interval] = regInfo;
			}
			regInfo.callbacks.push(callback);
		}
		
		self.removeTickCallback = function(callback, interval) {
			var regInfo = registry[interval];
			if(!regInfo) { return; }
			
			regInfo.callbacks.remove(callback);
			if(regInfo.callbacks.length === 0) {
				delete registry[interval];
			}
		}
		
		return self;
	};
	
	return {
		createTimer: createTimer,
	};
});