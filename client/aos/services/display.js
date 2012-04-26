define([
	'aos/graphics/point',
	'aos/graphics/size',
	'aos/graphics/rect',
	'aos/graphics/surface',
	'aos/additions/object',
	], function(Point, Size, Rect, Surface) {
	var create = function(canvasID) {
		var self = {};
		
		//camera is a function of the form function(gameTime, display)
		//that is called when the display should be painted
		//the camera function probably knows about some 
		//item (a room or another item)
		//that it should follow. The camera then determines the
		//root item (e.g. the current room of a followed item)
		//and other view params, such as the bounds and zoom and such things.
		//the camera then may use an extra renderer
		//that does the actual drawing by inspecting the item tree starting
		//from the root item. Each renderer is associated with one or more
		//item aspects that it uses to store information. e.g. the 
		//spriteRenderer uses a sprite aspect that contains all the
		//relevant info and it may store sprite objects in it.
		//another renderer (e.g. a "radar screen renderer") may only
		//use the coordinates and simple shapes such as circles or something.
		//you can write your own camera functions but there are some useful
		//ones in the aos/convenience/display module
		var camera, canvas, surface;
		
		self.createAccessor('canvas', 
			function() {
				if(!canvas) {
					canvas = document.getElementById(canvasID);
					context = canvas.getContext('2d');
				}
				return canvas;
			}
		);
		
		self.createAccessor('surface', 
			function() {
				if(!surface) {
					surface = Surface.create(self.canvas);
				}
				return surface;
			}
		);
		
		self.createAccessor('camera',
			function() { return camera; },
			function(aCamera) { camera = aCamera; }
		);
		
		self.paint = function(gameTime) {
			if(camera) {
				camera(gameTime, self);
			}
		};
		
		return self;
	};
	
	return {
		create: create,
	};
});