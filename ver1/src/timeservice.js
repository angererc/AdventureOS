function mk_time_service(min_interval) {
	var registered = [];
	var last_awoken_at = Date.now();
	var max_step = 100;
	var game_time = 0;
	var timeout_id = 0;
	
	function tick() {
		var now = Date.now();
		var diff = now - last_awoken_at;
		if (diff > max_step) { diff = max_step; }
		game_time += diff;
		last_awoken_at = now;
		for (int i = 0; i < registered.length; i++) {
			registered[i].tick(game_time);
		}
	}
	
	return {
		start: function() {
			timeout_id = window.setInterval(tick, min_interval);
		},
		
		addListener: function(listener) {
			registered.push(listener);
		},
		
		game_time: function() {
			return game_time;
		}
		
		stop: function() {
			window.clearInterval(timeout_id);
			timeout_id = 0;
		}
	};
}