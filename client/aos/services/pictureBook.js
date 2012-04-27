define([
		'aos/graphics/size',
		'aos/graphics/surface',
		'aos/additions/object'], function(Size, Surface) {
	var module = {};
	
	/*
	 * the picture book allows you to load images
	 * (an image is a surface with the image content)
	 * the images are cached by their path
	 * later, we can also support "internationalization"
	 * where the image path may be translated into another
	 * path depending on the device, to support different
	 * resolutions, for example
	*/
	module.create = function() {
		var self = {};
		
		var cache = {};
		
		self.load = function(imagePaths, readyCallback) {
			if(!imagePaths instanceof Array) {
				imagePaths =[imagePaths];
			}
			var countLoaded = 0;
			var countTotal = imagePaths.length;
			
			function incrementLoaded() {
				countLoaded++;
				if(countLoaded == countTotal) {
					readyCallback();
				}
			}
			
			function successHandler(path, img) {
				return function() {
					var size = Size.create(
									img.naturalWidth || img.width,
									img.naturalHeight || img.height);
					var surface = Surface.create(size);
					surface.context.drawImage(img, 0, 0);
					cache[path] = surface;
					incrementLoaded();
				};
			}
			
			function failureHandler(path, img) {
				return function() {
					incrementLoaded();
					throw new Error('Error loading image ' + path);
				};
			}
			
			for(var i = 0; i < countTotal; i++) {
				var path = imagePaths[i];
				if(!cache[path]) {
					var img = new Image();
					img.addEventListener('load', successHandler(path, img), true);
					img.addEventListener('error', failureHandler(path, img), true);
					img.src = path;
				} else {
					incrementLoaded();
				}
			}
			
			return function() {
				if(countLoaded == countTotal) {
					return 'done';
				} else {
					countTotal > 0 ? countLoaded / countTotal : 1;
				}
			}
		};
		
		self.get = function(path) {
			var surface = cache[path];
			if(! surface) {
				throw new Error("You must call PictureBook.load(['path/to/img.gif'], ...) before getting the images");
			} else {
				return surface;
			}
		};
		
		return self;
	};

	return module;
});