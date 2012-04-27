define([], function() {
	var module = {};
	
	
	var reconstructRoles = function(roleConstructors, dependencies) {
		var sorted = topologicalSort(dependencies);
	};
			
	module.__INTERNAL__createItem = function(id) {
		var self = {};
		//instantiated roles; if null we have to re-generate them because something has changed
		var roles = null;
		//uninstantiated roles.
		var roleConstructors = {};
		var dependencies = {};
		
		self.getID = function() {
			return id;
		}
		
		self.set = function(name, objOrFunction, dependenciesList) {
			roleConstructors[name] = objOrFunction;
			//make sure we have a depencencies list and it's a list, not a single role name
			if(! dependenciesList) {
				dependenciesList = [];
			} else if(! dependenciesList.isArray) {
				dependenciesList = [dependenciesList];
			}
			dependencies[name] = dependenciesList;
			roles = null; //re-construct
		}
		
		self.get = function(name) {
			if(! roles) {
				roles = reconstructRoles(roleConstructors, dependencies);
			}
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