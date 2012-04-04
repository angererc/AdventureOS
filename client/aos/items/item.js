define(['exports'], function(exports) {
	var module = {};
	module.__INTERNAL__createItem = function(id) {
		var self = {};
		var aspects = {};
		
		self.getID = function() {
			return id;
		}
		
		self.set = function(name, obj) {
			if(!aspects[name] || aspects.hasOwnProperty(name)) {
				aspects[name] = obj;
				obj.callIfPresent('hasBeenAttachedToItem', [self])
			} else {
				throw {
					name:'AspectException', 
					message:
						'aspect with name ' + name 
						+ ' would override parent property.' 
						+ ' Choose a different name',
				};
			}
		}
		
		self.get = function(name) {
			return aspects[name];
		}
		
		self.removeAspect = function(name) {
			var obj;
			if(aspects.hasOwnProperty(name)) {
				obj = aspects[name];
				obj.callIfPresent('willBeRemovedFromItem');
				delete aspects[name];
				obj.callIfPresent('hasBeenRemovedFromItem');
			}
		}
		
		//calls func(aspect) for each aspect of the item
		//can be used in a timer, for example, to propagate tick events
		self.eachAspect = function(func) {
			var name;
			for(name in aspects) {
				if(aspects.hasOwnProperty(name)) {
					func(aspects[name]);
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