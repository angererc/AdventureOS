Object.prototype.respondsToMethod = function(name) {
	return typeof this[name] === 'function';
};

Object.prototype.callIfPresent = function(name, args) {
	var func = this[name];
	if(typeof func === 'function') {
		func.apply(this, args);
	}
}
