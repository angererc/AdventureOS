function Item(id) {
	this.id = id;
}

Item.methods({
	addAspect: function(name, obj) {
		assert(name !== "id" && !obj.item);
		this[name] = obj;
		obj.item = this;
	},
	
	removeAspect: function(name) {
		obj = this[name];
		this[name] = null;
		if (obj !== null) {
			obj.item = null;
		}
	},
	
	aspects: function() {
		result = [];
		for (var name in this) {
			if (name !== "id" && this.hasOwnProperty(name)) {
				result.push(this[name]);
			}
		}
		return result;
	},
	
	preTick: function(gameTime) {
		for (var name in this.aspects()) {
			this[name].preTick(gameTime);
		}
	},
	
	tick: function(gameTime) {
		for (var name in this.aspects()) {
			this[name].tick(gameTime);
		}
	}
});