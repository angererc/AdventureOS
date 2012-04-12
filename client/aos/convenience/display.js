/*
this display convenience module contains some commonly used cameras and
renderers

a camera is a function of the form function(gameTime, display)

a renderer is a function of the form function(gameTime, rootItem, bounds, context);
*/
define(['aos/graphics/surface'], function(surface) {
	var module = {};
	
	//A camera that simply renders the whole room. 
	//Doesn't follow any item or anything
	module.createRoomCamera = function(display, room, renderer) {
		return function(gameTime) {
			renderer(
				gameTime, 
				room);
		}
	}
	
	//A renderer that renders the item tree using the items'
	//sprite aspects
	module.createSpriteRenderer = function(display) {
		var bounds = display.getFrame();
		var surface = surface.createSurface(bounds, display.getCanvas(), display.getContext());

		var s1 = new Sprite([200,200]);
		s1.image = gamejs.image.load("images/ship.png");
		var s2 = new Sprite([20,20]);
		s2.image = gamejs.image.load("images/ship.png");
		return function(gameTime, rootItem, bounds) {
			surface.fill("#FFFFFF");
			s1.draw(surface);
			s2.draw(surface);
		}
	}
	
	return module;
});