define([
		'aos/graphics/rect',
		'aos/graphics/point',
		'aos/graphics/size',
		'aos/graphics/surface',
		], function(Rect, Point, Size, Surface) {
	var module = {};
	
	module.create = function(sheetSurface, sheetSpec) {
		var self = {};
		
		var surfaceCache = [];
		
		for(var key in sheetSpec) {
			if(sheetSpec.hasOwnProperty(key)) {
				var iconRect = Rect.fromJson(sheetSpec[key]);
				var iconSurface = Surface.create(iconRect.size);
				iconSurface.blit(sheetSurface, null, iconRect);
				surfaceCache[key] = iconSurface;
			}
		}
		
		self.get = function(key) {
			return surfaceCache[key];
		}
		return self;
	};

	return module;
});
