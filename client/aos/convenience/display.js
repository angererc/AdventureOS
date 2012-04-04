/*
this display convenience module contains some commonly used cameras and
renderers

a camera is a function of the form function(gameTime, display)

a renderer is a function of the form function(gameTime, rootItem, bounds, context);
*/
define([], function() {
	var module = {};
	
	//A camera that simply renders the whole room. 
	//Doesn't follow any item or anything
	module.createRoomCamera = function(room, renderer) {
		return function(gameTime, display) {
			renderer(
				gameTime, 
				room, 
				display.getFrame(), 
				display.getContext2D());
		}
	}
	
	//A renderer that renders the item tree using the items'
	//sprite aspects
	//uses (will use) GameJS as its backend
	module.createGameJSSpriteRenderer = function() {
		return function(gameTime, rootItem, bounds, context) {
			context.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
			
			context.fillStyle = "rgb(200,0,0)";  
			context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
			
			context.fillStyle = "rgb(0,200,0)";  
			context.fillRect (
				rootItem.get('position').x, 
				rootItem.get('position').y, 
				25, 
				20);
		}
	}
	
	return module;
});