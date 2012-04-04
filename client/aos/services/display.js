define([], function() {
	var createDisplay = function(canvas) {
		var self = {};
		
		var focusItem, renderer;
		
		self.paint = function() {
			if(renderer) {
				renderer.render(canvas.getContext('2d'), focusItem)
			}
		};
		
		self.setFocusItem = function(aFocusItem) {
			focusItem = aFocusItem;
		}
		
		self.setRenderer = function(aRenderer) {
			renderer = aRenderer;
		}
		
		return self;
	};
	
	var createDummyRenderer = function() {
		return {
			//a super stupid dummy renderer, 
			//just to see if anything happens at all...
			render: function(context, focusItem) {
				context.clearRect(0, 0, 300, 300);
				context.fillStyle = "rgb(200,0,0)";  
 				context.fillRect (focusItem.x, focusItem.y, 55, 50);
			}
		};
	};
	
	return {
		createDisplay: createDisplay,
		createDummyRenderer: createDummyRenderer,
	};
});