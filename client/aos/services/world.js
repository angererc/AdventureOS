define(['aos/items/item'], function(Item) {
	var module = {};
	
	module.create = function() {
		var self = {};
		/*
		the world service keeps track of all items. Later, the world
		service will also deal with stuff like persistence and server
		communication for multi-player games. Therefore, we don't allow
		you to create items manually but only through the world service,
		in case we have to augment the items with persistence etc.
		functionality later.
		*/
		self.Item = {
			create: Item.__INTERNAL__createItem,
		};
		
		return self;
	}
	
	return module;
});