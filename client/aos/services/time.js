define([], function() {
	
	/*in the long run we should use requestAnimationFrame instead of interval
	see here:
	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	*/

	/*spec properties: 
		timerInterval, maxStep
	*/
	var createTimer = function(spec) {
		spec = spec || {};
		var self = {};
		
		var intervalID = undefined;
		var maxStep = spec.maxStep || 100;
		var gameTime = 0;		
		var lastTick = Date.now();
		var timerInterval = spec.timerInterval || 10;
		
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
			intervalID = window.setInterval(tick, timerInterval);
		}
		
		self.stop = function() {
			window.clearInterval(intervalID);
			intervalID = undefined;
		}
		
		/*
		add a callback function called every <interval> milliseconds.
		The interval is measured in gameTime, not in wall time!
		you are encouraged to register different callbacks for different
		intervals to reduce load. e.g. update the view every 10 ms but
		the updating AI or event handling only every 50 ms.
		If no interval is given we use 0; this means that the callback
		will be called every tick.
		*/ 
		self.registerTickCallback = function(callback, interval) {
			interval = interval || 0;
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
		
		self.deregisterTickCallback = function(callback, interval) {
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