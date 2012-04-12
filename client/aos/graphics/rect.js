define([
	'aos/graphics/point',
	'aos/graphics/size',
	'aos/additions/object', 
], function(point, size) {
	
	//we keep an explicit point and size object
	//but the Rect interface makes it easy to change that in the
	//future, in case performance needs that
	//(i.e., keep everything in the rect object)
	var Rect = function(point, size) {
		this.origin = point;
		this.size = size;
	};
	
	Rect.prototype.isRect = true;
	
	Rect.prototype.clone = function() {
		return new Rect(this.origin.clone(), this.size.clone());
	}
	
	Rect.prototype.createAccessor('x',
		function() { return this.origin.x; },
		function(val) { this.origin.x = val; });
		
	Rect.prototype.createAccessor('left',
		function() { return this.origin.x; },
		function(val) { this.origin.x = val; });
	
	Rect.prototype.createAccessor('right',
		function() { return this.origin.x + this.size.width; },
		function(val) { this.origin.x = val - this.size.width; });
	
	Rect.prototype.createAccessor('y',
		function() { return this.origin.y; },
		function(val) { this.origin.y = val; });
		
	Rect.prototype.createAccessor('top',
		function() { return this.origin.y; },
		function(val) { this.origin.y = val; });
			
	Rect.prototype.createAccessor('bottom',
		function() { return this.origin.y + this.size.height; },
		function(val) { this.origin.y = val - this.size.height; });
	
	Rect.prototype.createAccessor('center',
		function() { return point.createPoint(
								this.origin.x + this.size.width/2,
								this.origin.y + this.size.height/2); },
		function(centerPoint) { 
					this.origin.x = centerPoint.x - this.size.width/2;
					this.origin.y = centerPoint.y - this.size.height/2; });
					
	Rect.prototype.createAccessor('width',
		function() { return this.size.width; },
		function(val) { this.size.width = val; });
		
	Rect.prototype.createAccessor('height',
		function() { return this.size.height; },
		function(val) { this.size.height = val; });
			
	Rect.prototype.moveBy = function(vec) {
		var newOrigin = this.origin.add(vec);
		return new Rect(newOrigin, this.size);
	};
	
	Rect.prototype.moveByInPlace = function(vec) {
		this.origin = this.origin.add(vec);
	}
	
	Rect.prototype.union = function(rect) {
	   var x, y, width, height;

	   x = Math.min(this.left, rect.left);
	   y = Math.min(this.top, rect.top);
	   width = Math.max(this.right, rect.right) - x;
	   height = Math.max(this.bottom, rect.bottom) - y;
	   return new Rect(point.createPoint(x, y), size.createSize(width, height));
	};
	
	Rect.prototype.collidePoint = function(point) {
	   return (this.left <= point.x && point.x <= this.right) &&
	       (this.top <= point.y && point.y <= this.bottom);
	};
	
	Rect.prototype.collideRect = function(rect) {
	   return !(this.left > rect.right || this.right < rect.left ||
	      this.top > rect.bottom || this.bottom < rect.top);
	};
	
	Rect.prototype.clip = function(rect) {
	   if(!this.collideRect(rect)) {
	      return new Rect(point.createPoint(0,0),size.createSize(0,0));
	   }

	   var x, y, width, height;

	   // Left
	   if ((this.left >= rect.left) && (this.left < rect.right)) {
	      x = this.left;
	   } else if ((rect.left >= this.left) && (rect.left < this.right)) {
	      x = rect.left;
	   }

	   // Right
	   if ((this.right > rect.left) && (this.right <= rect.right)) {
	      width = this.right - x;
	   } else if ((rect.right > this.left) && (rect.right <= this.right)) {
	      width = rect.right - x;
	   }

	   // Top
	   if ((this.top >= rect.top) && (this.top < rect.bottom)) {
	      y = this.top;
	   } else if ((rect.top >= this.top) && (rect.top < this.bottom)) {
	      y = rect.top;
	   }

	   // Bottom
	   if ((this.bottom > rect.top) && (this.bottom <= rect.bottom)) {
	     height = this.bottom - y;
	   } else if ((rect.bottom > this.top) && (rect.bottom <= this.bottom)) {
	     height = rect.bottom - y;
	   }
	   return new Rect(point.createPoint(x, y), size.createSize(width, height));
	};
	
	Rect.prototype.collideLine = function(startPoint, endPoint) {
	   var x1 = startPoint.x;
	   var y1 = startPoint.y;
	   var x2 = endPoint.x;
	   var y2 = endPoint.y;

	   function linePosition(pt) {
	      var x = pt[0];
	      var y = pt[1];
	      return (y2 - y1) * x + (x1 - x2) * y + (x2 * y1 - x1 * y2);
	   }

	   var relPoses = [[this.left, this.top],
	                   [this.left, this.bottom],
	                   [this.right, this.top],
	                   [this.right, this.bottom]
	                  ].map(linePosition);

	   var noNegative = true;
	   var noPositive = true;
	   var noZero = true;
	   relPoses.forEach(function(relPos) {
	      if (relPos > 0) {
	         noPositive = false;
	      } else if (relPos < 0) {
	         noNegative = false;
	      } else if (relPos === 0) {
	         noZero = false;
	      }
	   }, this);

	   if ( (noNegative || noPositive) && noZero) {
	      return false;
	   }
	   return !((x1 > this.right && x2 > this.right) ||
	            (x1 < this.left && x2 < this.left) ||
	            (y1 < this.top && y2 < this.top) ||
	            (y1 > this.bottom && y2 > this.bottom)
	            );
	};
	
	Rect.prototype.toString = function() {
		return "[" + this.origin.toString() + "|" + this.size.toString() + "]";
	}
	
	var module = {};

	module.createRect = function(point, size) {
		return new Rect(point, size);
	};
	
	return module;
});