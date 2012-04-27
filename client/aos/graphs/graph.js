define(['aos/additions/array'], function() {
	var module = {};
	
	module.create = function() {
		var self = {};
		
		var nodes = [];
		var incoming = {};
		var outgoing = {};
		
		/*
		 * add a single node to the graph; you don't have to
		 * do this before adding an edge, the graph adds new
		 * nodes used in edges automatically
		 */
		self.addNode = function(node) {
			if(nodes.indexOf(node) < 0) {
				nodes.push(node);
			}
		};
		
		//return a copy of all the nodes
		self.createAccessor('nodes', function() { return nodes.slice(0); });
		
		/*
		 * only inserts the edge if it doesn't exist yet
		 * therefore, no multi-edges supported
		 */
		self.addEdge = function(from, to) {
			var edges;
			
			self.addNode(from);
			self.addNode(to);
			
			edges = outgoing[from] || (outgoing[from] = []);
			if(edges.indexOf(to) < 0) {
				edges.push(to);
			}
			
			edges = incoming[to] || (incoming[to] = []);
			if(edges.indexOf(from) < 0) {
				edges.push(from);
			}
		};
		
		self.removeEdge = function(from, to) {
			var edges = outgoing[from] || [];
			edges.remove(to);
			edges = incoming[to] || [];
			edges.remove(from);
		};
		
		self.removeNode = function(node) {
			nodes.remove(node);
			var edges;
			
			edges = self.getOutgoingEdges(node);
			for(var i = 0; i < edges.length; i++) {
				self.removeEdge(node, edges[i]);
			}
			
			edges = self.getIncomingEdges(node);
			for(var i = 0; i < edges.length; i++) {
				self.removeEdge(edges[i], node);
			}
			
			delete outgoing[node];
			delete incoming[node];
		}
		
		self.getOutgoingEdges = function(node) {
			var edges = outgoing[node];
			return edges ? edges.splice(0) : [];
		};
		
		self.getIncomingEdges = function(node) {
			var edges = incoming[node];
			return edges ? edges.splice(0) : [];
		};
		
		self.topologicalSorting = function() {
			//see wikipedia for the algorithm
			var result = [];
			var S = []; 
			var visited = [];
		
			//helper variables
			var node, i;
		
			//find roots
			for(i = 0; i < nodes.length; i++) {
				node = nodes[i];
				if((outgoing[node] || []).length == 0) {
					S.push(node);
				}
			}
		
			for(i = 0; i < nodes.length; i++) {
				node = nodes[i];
				visit(node, []);
			}
			
			//onStack keeps track of the currently visited nodes
			//and is used for cycle detection
			function visit(node, onStack) {
				if(onStack.indexOf(node) >= 0) {
					throw new Error("Graph contains cycles; no topological sorting possible");
				} else {
					onStack.push(node);
				}
				if(visited.indexOf(node) < 0) {
					visited.push(node);
					var edges = incoming[node] || [];
					for(var i = 0; i < edges.length; i++) {
						visit(edges[i], onStack);
					}
					result.push(node);
				}
			}
			return result;
		}
		
		return self;
	};
	
	return module;
});