define(['aos/graphs/graph'], function(Graph) {
	var module = {};
	
	
	var findOrdering = function(dependencies) {
		var g = Graph.create();
		for(var name in dependencies) {
			if(dependencies.hasOwnProperty(name)) {
				//make sure we add the node in case there are no outgoing edges
				g.addNode(name);
				var dependsOnList = dependencies[name];
				for(var i = 0; i < dependsOnList.length; i++) {
					var dependsOn = dependsOnList[i];
					g.addEdge(dependsOn, name);
				}
			}
		}
		
		return g.topologicalSorting();
	};
			
	module.__INTERNAL__createItem = function(id) {
		var self = {};
		//instantiated roles; if null we have to re-generate them because something has changed
		var roles = null;
		var roleOrdering;
		//uninstantiated roles.
		var roleConstructors = {};
		var dependencies = {};
		
		//find a topological ordering for all the roles
		//and then instantiate each of them
		var reconstructRoles = function() {
			roles = {};
			roleOrdering = findOrdering(dependencies);
			//instantiate roles in the order of the constructors
			for(var i = 0; i < roleOrdering.length; i++) {
				var name = roleOrdering[i];
				var constructor = roleConstructors[name];
				if(typeof constructor === 'function') {
					var deps = dependencies[name];
					var params = [];
					for(var j = 0; j < deps.length; j++) {
						var dep = roles[deps[j]];
						if(! dep) {
							throw new Error("This should not happen... dependencies should be resolved by now");
						}
						params.push(dep);
					}
					roles[name] = constructor.apply({}, params);
				} else {
					roles[name] = constructor;
				}
			}
		}
		
		self.createAccessor('topologicalRoleOrdering',
			function() {
				if(! roles) {
					reconstructRoles();
				}
				return roleOrdering;
			});
		
		self.getID = function() {
			return id;
		}
		
		self.set = function(name, objOrFunction, dependenciesList) {
			roleConstructors[name] = objOrFunction;
			//make sure we have a depencencies list and it's a list, not a single role name
			if(! dependenciesList) {
				dependenciesList = [];
			} else if(! dependenciesList instanceof Array) {
				dependenciesList = [dependenciesList];
			}
			dependencies[name] = dependenciesList;
			roles = null; //re-construct
		}
		
		self.get = function(name) {
			if(! roles) {
				reconstructRoles();
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