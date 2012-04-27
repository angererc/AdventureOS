define(
	['aos/graphs/graph'], function (Graph) {
	
	function createGraph() {
		var g = Graph.create();
		g.addNode('a'); //add first node, just to see what happens
		g.addNode('x'); //stand-alone node
		
		//we use the graph from the topological sorting example from wikipedia
		g.addEdge('a', 'd');
		g.addEdge('a', 'e');
		
		g.addEdge('b', 'd');
		
		g.addEdge('c', 'e');
		g.addEdge('c', 'h');
		
		g.addEdge('d', 'f');
		g.addEdge('d', 'g');
		g.addEdge('d', 'h');
		
		g.addEdge('e', 'g');
		
		return g;

	};
	
	test('Edge creation', function(){
		var g = createGraph();
		
		deepEqual(g.nodes.sort(), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'x']);
		
		deepEqual(g.getOutgoingEdges('a').sort(), ['d', 'e']);
		deepEqual(g.getOutgoingEdges('b').sort(), ['d']);
		deepEqual(g.getOutgoingEdges('c').sort(), ['e', 'h']);
		deepEqual(g.getOutgoingEdges('d').sort(), ['f', 'g', 'h']);
		deepEqual(g.getOutgoingEdges('e').sort(), ['g']);
		deepEqual(g.getOutgoingEdges('f').sort(), []);
		deepEqual(g.getOutgoingEdges('g').sort(), []);
		deepEqual(g.getOutgoingEdges('h').sort(), []);
		deepEqual(g.getOutgoingEdges('x').sort(), []);
		
		deepEqual(g.getIncomingEdges('a').sort(), []);
		deepEqual(g.getIncomingEdges('b').sort(), []);
		deepEqual(g.getIncomingEdges('c').sort(), []);
		deepEqual(g.getIncomingEdges('d').sort(), ['a', 'b']);
		deepEqual(g.getIncomingEdges('e').sort(), ['a', 'c']);
		deepEqual(g.getIncomingEdges('f').sort(), ['d']);
		deepEqual(g.getIncomingEdges('g').sort(), ['d', 'e']);
		deepEqual(g.getIncomingEdges('h').sort(), ['c', 'd']);
		deepEqual(g.getIncomingEdges('x').sort(), []);
	});
	
	test('Edge deletion', function(){
		var g = createGraph();
		
		g.removeEdge('d', 'g');
		
		deepEqual(g.getOutgoingEdges('d').sort(), ['f', 'h']);
		deepEqual(g.getIncomingEdges('g').sort(), ['e']);
	});
	
	test('Node deletion', function(){
		var g = createGraph();
		
		g.removeNode('d');
		
		deepEqual(g.nodes.sort(), ['a', 'b', 'c', 'e', 'f', 'g', 'h', 'x']);
		
		deepEqual(g.getOutgoingEdges('a').sort(), ['e']);
		deepEqual(g.getOutgoingEdges('b').sort(), []);
		deepEqual(g.getOutgoingEdges('c').sort(), ['e', 'h']);
		deepEqual(g.getOutgoingEdges('e').sort(), ['g']);
		deepEqual(g.getOutgoingEdges('f').sort(), []);
		deepEqual(g.getOutgoingEdges('g').sort(), []);
		deepEqual(g.getOutgoingEdges('h').sort(), []);
		deepEqual(g.getOutgoingEdges('x').sort(), []);
		
		deepEqual(g.getIncomingEdges('a').sort(), []);
		deepEqual(g.getIncomingEdges('b').sort(), []);
		deepEqual(g.getIncomingEdges('c').sort(), []);
		deepEqual(g.getIncomingEdges('e').sort(), ['a', 'c']);
		deepEqual(g.getIncomingEdges('f').sort(), []);
		deepEqual(g.getIncomingEdges('g').sort(), ['e']);
		deepEqual(g.getIncomingEdges('h').sort(), ['c']);
		deepEqual(g.getIncomingEdges('x').sort(), []);
	});
	
	test('Topological sort', function(){
		var g = createGraph();
		
		var sorted = g.topologicalSorting();
		
		var lt = function(a, list) {
			if(sorted.indexOf(a) < 0) return false;
			
			for(var i = 0; i < list.length; i++) {
				if(! (sorted.indexOf(a) < sorted.indexOf(list[i])))
					return false;
			}
			return true;
		}
		
		ok(lt('a', ['d', 'e', 'f', 'g', 'h']));
		ok(lt('b', ['d', 'f', 'g', 'h']));
		ok(lt('c', ['e', 'g', 'h']));
		ok(lt('d', ['f', 'g', 'h']));
		ok(lt('e', ['g']));

	});
	
	test('Topological sort with cycle', function(){
		var g = createGraph();
		
		g.addEdge('g', 'c');
		
		raises(function() {g.topologicalSorting();}, Error);
		
	});

});