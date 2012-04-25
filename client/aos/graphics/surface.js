/**
 * A Surface represents a bitmap image with a fixed width and height. The
 * most important feature of a Surface is that they can be `blitted`
 * onto each other.
 *
 * @example
 * new gamejs.Surface([width, height]);
 * new gamejs.Surface(width, height);
 * new gamejs.Surface(rect);
 * @constructor
 *
 * @param {Array} dimensions Array holding width and height

	adapted from the GameJS framework
 */
define([
		'aos/graphics/matrix',
		'aos/graphics/rect',
		'aos/graphics/point',
		'aos/graphics/size',
		'aos/graphics/math',
		'aos/additions/object',
		], function(Matrix, Rect, Point, Size, math) {
	var module = {};
	
	//pass an existing canvas or otherwise specify a size and we will create a
	//canvas
	module.create = function(sizeOrCanvas) {
		var self = {};
		
		var size, canvas;
		if(sizeOrCanvas.isSize) {
			size = sizeOrCanvas.clone();
			canvas = document.createElement('canvas');
			canvas.width = size.width;
			canvas.height = size.height;
		} else {
			canvas = sizeOrCanvas;
			size = Size.create(canvas.clientWidth, canvas.clientHeight);
		}
		
		var context = canvas.getContext('2d');
		
		var matrix = Matrix.createIdentity();
		var blitAlpha = 1.0;
		
		self.isSurface = true;
		
		self.createAccessor('alpha', 
			function() {
				return (1 - blitAlpha);
			},
			function(alpha) {
				if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      				return;
   				}

   				blitAlpha = (1 - alpha);
   				return (1 - blitAlpha);
			});
			
		self.createAccessor('blitAlpha', 
			function() {
				return blitAlpha;
			});
			
		self.createAccessor('matrix', 
			function() {
				return matrix;
			});
			
		self.createAccessor('size', 
			function() {
				return size;
			});
			
		self.createAccessor('context', 
			function() {
				return context;
			});
			
		self.createAccessor('canvas', 
			function() {
				return canvas;
			});
			
		self.smooth = function() {
   			canvas.style.setProperty(
				"image-rendering", 
				"optimizeQuality", 
				"important");
   			canvas.style.setProperty(
				"-ms-interpolation-mode", 
				"bicubic", 
				"important");
   			context.mozImageSmoothingEnabled = true;
		};
		
		self.noSmooth = function() {
			// disable image scaling
			// see https://developer.mozilla.org/en
			// /Canvas_tutorial/Using_images#Controlling_image_scaling_behavior
			// and https://github.com/jbuck/processing-js/commit
			// /65de16a8340c694cee471a2db7634733370b941c
			canvas.context.mozImageSmoothingEnabled = false;
		   	canvas.style.setProperty(
				"image-rendering", 
				"optimizeSpeed", 
				"important");
		   	canvas.style.setProperty(
				"image-rendering", 
				"-moz-crisp-edges", 
				"important");
		   	canvas.style.setProperty(
				"image-rendering", 
				"-webkit-optimize-contrast", 
				"important");
		   	canvas.style.setProperty(
				"image-rendering", 
				"optimize-contrast", 
				"important");
		   	canvas.style.setProperty(
				"-ms-interpolation-mode", 
				"nearest-neighbor", 
				"important");
		   return;
		};

		/**
		 * Fills the whole Surface with a color. Usefull for erasing a Surface.
		 * @param {String} CSS color string, e.g. 
		 * '#0d120a' or '#0f0' or 'rgba(255, 0, 0, 0.5)'
		 */
		self.fill = function(color) {
		   context.save();
		   context.fillStyle = color || "#000000";
		   context.fillRect(0, 0, size.width, size.height);
		   context.restore();
		   return;
		};

		/**
		 * Clear the surface.
		 */
		self.clear = function() {
		   context.clearRect(0, 0, size.width, size.height);
		   return;
		};
		
		/**
		 * The data must be represented in left-to-right order, 
		 * row by row top to bottom,
		 * starting with the top left, with each pixel's red, 
		 * green, blue, and alpha components
		 * being given in that order for each pixel.
		 * @see http://dev.w3.org/html5/2dcontext/#canvaspixelarray
		 * @returns {ImageData} an object holding the pixel image 
		 * data {data, width, height}
		 */
		self.getImageData = function() {
		   return context.getImageData(0, 0, size.width, size.height);
		};
		
		self.clone = function() {
			var newSurface = module.create(size);
			newSurface.blit(this);
			return newSurface;
		};
		
		/**
		 * Blits srcSurface onto self
		 * destRect defines rect in self that will be paintet in. 
		 * If null: [0@0|srcSurface.size]
		 * srcRect defines the rect in the source from which we will blit. 
		 * if null: [0@0|srcSurface.size]
		 * translationMatrix: extra translation matrix that is applied if not null. If
		 * translatioMatrix is null we'll apply the srcSurface Matrix
		 * compositeOperation: 'source-over' if null
		 */
		self.blit = function(srcSurface, destRect, srcRect, translationMatrix, compositeOperation) {

			if(! destRect) {
		   		destRect = Rect.create(Point.create(0,0), srcSurface.size);
			}
			
			if(! srcRect) {
				srcRect = Rect.create(Point.create(0,0), srcSurface.size);
			}
			
		   	compositeOperation = compositeOperation || 'source-over';

		   	if (isNaN(destRect.left) || isNaN(destRect.top) || isNaN(destRect.width) || isNaN(destRect.height)) {
		     	throw new Error('[blit] bad parameters, destination is ' + destRect);
		   	}

		   	context.save();
		   	context.globalCompositeOperation = compositeOperation;
		
		   	// first translate, then rotate
		   	var m = Matrix.createIdentity().translate(destRect.left, destRect.top);
		   	if(! translationMatrix) {
				m = m.multiply(srcSurface.matrix);
			} else {
				m = m.multiply(translationMatrix);
			}
		   	context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
		   
		   	// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
		   	context.globalAlpha = srcSurface.blitAlpha;
		   	context.drawImage(
				srcSurface.canvas, 
				srcRect.left, srcRect.top, srcRect.width, srcRect.height, 
				0 /*shouldn't it be: destRect.left? Maybe not because we do matrix translation before*/, 
				0 /*shouldn't it be: destRect.top?*/, 
				destRect.width, destRect.height);
		
		   context.restore();
		   return;
		};
		
		self.rotate = function (angle) {
			var halfSize = Size.create(self.size.width/2, self.size.height/2);
			var radians = math.radians(angle);
			var newSize = size;
			// find new bounding box
			if (angle % 360 !== 0) {
				var points = [
					Point.create(-halfSize.width, halfSize.height),
					Point.create(halfSize.width, halfSize.height),
					Point.create(-halfSize.width, -halfSize.height),
					Point.create(halfSize.width, -halfSize.height)
				];
				var rotPoints = points.map(function(p) {
				   return p.rotate(radians);
				});
				var xs = rotPoints.map(function(p) { return p.x; });
				var ys = rotPoints.map(function(p) { return p.y; });
				
				var left = Math.min.apply(Math, xs);
				var right = Math.max.apply(Math, xs);
				var bottom = Math.min.apply(Math, ys);
				var top = Math.max.apply(Math, ys);
				
				newSize = Size.create(right-left, top-bottom);
			}
			
			var newMatrix = self.matrix;
			newMatrix = newMatrix.translate(halfSize.width, halfSize.height);
			newMatrix = newMatrix.rotate(radians);
			newMatrix = newMatrix.translate(-halfSize.width, -halfSize.height);
			
			var newSurface = module.create(newSize);
			var offset = Point.create(
								(newSize.width - self.size.width) / 2, 
								(newSize.height - self.size.height) / 2);			
			newSurface.blit(surface, Rect.create(offset, self.size), null, newMatrix);
			return newSurface;
		};
		
		self.scale = function(scaleToSize) {
			var width = scaleToSize.width;
			var height = scaleToSize.height;
			if (width <= 0 || height <= 0) {
			   throw new Error('[aos.graphics.surface.scale] Invalid arguments for height and width', [width, height]);
			}
			
			var scaleVector = Point.create(width/self.size.width, height/self.size.height);
			var newMatrix = self.matrix.scale(scaleVector);
			
			var newSurface = module.create(scaleToSize);
			newSurface.blit(self, null, null, newMatrix);

			return newSurface;
		};

		//start out smooth
		self.smooth();
		
		return self;
	};
	
	return module;
});



