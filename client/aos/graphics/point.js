define(['aos/additions/object', 'aos/graphics/math'], function(obj, math) {
	
	//Point implementation. A Point is also a Vector
	var Point = function (x, y) {
		this.x = x;
		this.y = y;
	};
	
	Point.prototype.isPoint = true;
	
	Point.prototype.clone = function() {
		return new Point(this.x, this.y);
	};
	
	Point.prototype.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};

	Point.prototype.add = function(other) {
		return new Point(this.x + other.x, this.y + other.y);
	};

	Point.prototype.subtract = function(other) {
		return new Point(this.x - other.x, this.y - other.y);
	};

	Point.prototype.multiply = function(s) {
		if(typeof s === 'number') {
			return new Point(this.x*s, this.y*s);
		} else if (s.isPoint) {
			return new Point(this.x*s.x, this.y*s.y);
		} else {
			throw new Error("cannot multiply vector with " + s);
		}
	};

	Point.prototype.divide = function(s) {
		if(typeof s === 'number') {
			return new Point(this.x/s, this.y/s);
		} else {
			throw new Error("only divide by scalar supported");
		}
	};

	Point.prototype.unit = function() {
		var len = this.length();
		if(len) {
			return this.divide(len);
		} else {
			return new Point(0, 0);
		}
	};

	Point.prototype.rotate = function(angle) {
		angle = math.normalizeRadians(angle);
		return new Point(
			this.x*Math.cos(angle) - this.y*Math.sin(angle),
          		this.x*Math.sin(angle) + this.y*Math.cos(angle));
	};

	Point.prototype.distance = function(other) {
		return this.subtract(other).length();
	};

	Point.prototype.dot = function(other) {
		return this.x*other.x + this.y*other.y;
	};

	Point.prototype.angle = function(other) {
		var dot = this.unit().dot(other.unit());
		return Math.acos(dot);
	};

	Point.prototype.truncate = function(maxLength) {
		if(this.length() > maxLength) {
			return this.unit(point).multiply(maxLength);
		} else {
			return point;
		}
	};
	
	Point.prototype.toString = function() {
		return this.x + "@" + this.y;
	}
	
	var module = {};
	
	//we keep the createXYZ() pattern for the outside world
	//even though we use a function and prototype for points
	//for efficiency reasons (there are a lot of points created all
	//the time and we don't want to create single objects with
	//single functions every time)
	module.createPoint = function(x, y) {
		return new Point(x, y);
	}
	
	return module;
});