define(['aos/additions/object'], function(obj) {
	var module = {};
	
	module.create = function() {
		var self = {};
		
		var groups = [];
		var alive = true;
		var image = null;
		var rect = null;
		
		self.createAccessor('groups', function() { return groups; });
		self.createAccessor('image', 
			function() { return image; },
			function(im) { image = im; }
		);
		
		self.kill = function() {
			alive = false;
   			groups.forEach(function(group) {
      			group.removeSprite(self);
   			});
   			return;
		};
		
		self.isDead = function() {
			return !alive;
		};
		
		self.remove = function(aGroups) {
			if (!(aGroups instanceof Array)) {
				aGroups = [aGroups];
   			}

   			aGroups.forEach(function(group) {
      			group.removeSprite(self);
   			});
   			return;
		};

		self.add = function(aGroups) {
		   if (!(aGroups instanceof Array)) {
		      aGroups = [aGroups];
		   }

		   aGroups.forEach(function(group) {
		      group.addSprite(self);
		   });
		   return;
		};
			
		/**
 		* Draw this sprite onto the given surface. The position is defined by
 		* this sprite's rect.
 		* @param {gamejs.Surface} surface The surface to draw on
 		*/
		self.draw = function(surface) {
			surface.blit(image, rect);
   			return;
		};
		
		return self;
	};

	return module;
});
