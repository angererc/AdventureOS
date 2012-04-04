define(['aos/additions/object', 'aos/additions/array'], function() {	
	var createGame = function() {
		var self = {};
		var registry = {};
	
		self.register = function(name, service) {
			registry[name] = service;
			service.callIfPresent('hasBeenAddedToGameWithName', [name]);
		};
		
		self.get = function(name) {
			if(registry.hasOwnProperty(name)) {
				return registry[name];
			} else {
				return undefined;
			}
		}
		
		self.deregister = function(name) {
			var service = registry[name];
			if(service) {
				service.callIfPresent('willBeRemovedFromGame'); 
				delete this[name];
				service.callIfPresent('hasBeenRemovedFromGame');
			}
		};
		
		return self;
	};
	
	//export module API
	return {
		createGame: createGame,
	}
});