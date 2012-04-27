define([], function() {
	var module = {};
	module.__INTERNAL__createItem = function(id) {
		var self = {};
		var roles = {};
		
		self.getID = function() {
			return id;
		}
		
		self.set = function(name, obj) {
			if(!roles[name] || roles.hasOwnProperty(name)) {
				roles[name] = obj;
				obj.callIfPresent('hasBeenAttachedToItem', [self])
			} else {
				throw new Error('role with name ' + name 
						+ ' would override parent property.' 
						+ ' Choose a different name');
			}
		}
		
		self.get = function(name) {
			return roles[name];
		}
		
		self.removeRole = function(name) {
			var obj;
			if(roles.hasOwnProperty(name)) {
				obj = roles[name];
				obj.callIfPresent('willBeRemovedFromItem');
				delete roles[name];
				obj.callIfPresent('hasBeenRemovedFromItem');
			}
		}
		
		//calls func(role) for each role of the item
		//can be used in a timer, for example, to propagate tick events
		self.eachRole = function(func) {
			var name;
			for(name in roles) {
				if(roles.hasOwnProperty(name)) {
					func(roles[name]);
				}
			}
		}
		
		return self;
	};
	
	/*
	we don't want you to create items directly but only through the world
	service. See comment there.
	*/
	return module;
});