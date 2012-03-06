Function.prototype.methods = function(obj) {
	for (var key in obj) {
		if obj.hasOwnProperty(key) {
			this.prototype[key] = obj[key];
		}
	}
}

Function.methods({
	extend: function(Parent) {
		this.prototype = new Parent();
		return this;
	}
});
