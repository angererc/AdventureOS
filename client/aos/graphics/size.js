define([], function() {
	//implementation of Size. we use a constructor and prototypes
	//here for efficiency reasons because we create a lot of Sizes, Points
	// and Rects. see comment at Point for more detail
	var Size = function(width, height) {
		this.width = width;
		this.height = height;
	};
	
	Size.prototype.isSize = true;
	
	Size.prototype.clone = function() {
		return new Size(this.width, this.height);
	};
	
	Size.prototype.toString = function() {
		return this.width + "x" + this.height;
	}
	
	var module = {};
	
	module.create = function(width, height) {
		return new Size(width, height);
	}
	
	return module;
});