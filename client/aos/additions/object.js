Object.prototype.respondsToMethod = function(name) {
	return typeof this[name] === 'function';
};

Object.prototype.callIfPresent = function(name, args) {
	var func = this[name];
	if(typeof func === 'function') {
		func.apply(this, args);
	}
}

/**
 	* Create object accessors
	* @param {Object} object The object on which to define the property
	* @param {String} name name of the property
	* @param {Function} get
	* @param {Function} set
 	* @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty
	 */
Object.prototype.createAccessor = function(name, get, set) {
	// ECMA5
	if (Object.defineProperty !== undefined) {
 		Object.defineProperty(this, name, {
    		get: get,
    		set: set
 		});
	// non-standard
	} else if (Object.prototype.__defineGetter__ !== undefined) {
 		this.__defineGetter__(name, get);
 		if (set) {
    		this.__defineSetter__(name, set);
 		}
	} else {
		throw {name:'Accessors not supported'};
	}
	return;
};
