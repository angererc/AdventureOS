define([], function() {
	//2x3 matrices used for transformations and such
	
	var Matrix = function(a, b, c, d, e, f) {
		this[0] = a;
		this[1] = b;
		this[2] = c;
		this[3] = d;
		this[4] = e;
		this[5] = f;
	};
	
	Matrix.prototype.isMatrix = true;
	
	Matrix.prototype.add = function(other) {
		return new Matrix(
			this[0] + other[0],
			this[1] + other[1],
			this[2] + other[2],
			this[3] + other[3],
			this[4] + other[4],
			this[5] + other[5]
		);
	};
	
	Matrix.prototype.multiply = function(other) {
		return new Matrix(
			this[0] * other[0] + this[2] * other[1],
			this[1] * other[0] + this[3] * other[1],
			this[0] * other[2] + this[2] * other[3],
			this[1] * other[2] + this[3] * other[3],
			this[0] * other[4] + this[2] * other[5] + this[4],
			this[1] * other[4] + this[3] * other[5] + this[5]
		);
	};
	
	Matrix.prototype.translate = function(dx, dy) {
		return this.multiply([1,0,0,1,dx,dy]);
	};
	
	Matrix.prototype.rotate = function(angle) {
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		return this.multiply([cos, sin, -sin, cos, 0, 0]);
	};
	
	Matrix.prototype.rotation = function() {
		return Math.atan2(this[1], this[0]);
	};
	
	Matrix.prototype.scale = function(svec) {
		return this.multiply([svec.x, 0, 0, svec.y, 0, 0]);
	};
	
	return {
		createIdentity: function() {
			return new Matrix(1,0,0,1,0,0);
		},
	};
});