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
		'aos/graphics/size',
		'aos/additions/object',
		], function(matrix, size) {
	var module = {};
	
	module.createSurface = function(bounds, canvas, context) {
		var self = {};
		
		var matrix = matrix.identity();
		var blitAlpha = 1.0;
		
		self.createAccessor('bounds', function() { return bounds; });
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
				return size.createSize(canvas.width, canvas.height);
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
			this.context.mozImageSmoothingEnabled = false;
		   	this.canvas.style.setProperty(
				"image-rendering", 
				"optimizeSpeed", 
				"important");
		   	this.canvas.style.setProperty(
				"image-rendering", 
				"-moz-crisp-edges", 
				"important");
		   	this.canvas.style.setProperty(
				"image-rendering", 
				"-webkit-optimize-contrast", 
				"important");
		   	this.canvas.style.setProperty(
				"image-rendering", 
				"optimize-contrast", 
				"important");
		   	this.canvas.style.setProperty(
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
		   context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
		   context.restore();
		   return;
		};

		/**
		 * Clear the surface.
		 */
		self.clear = function() {
		   context.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
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
		   return context.getImageData(
						bounds.x, bounds.y, 
						bounds.width, bounds.height);
		};
		
		/**
		 * Blits another Surface on this Surface. 
		 * The destination where to blit to
		 * can be given (or it defaults to the top left corner) as well as the
		 * Area from the Surface which should be blitted 
		 * (e.g., for cutting out parts of
		 * a Surface).
		 */
		self.blit = function(srcSurface, dest, area, compositeOperation) {

		   dest = dest.clone();
		   if (!dest.width) {
		      dest.width = srcSurface.size.width;
		   }
		   if (!dest.height) {
		      dest.height = srcSurface.size.height;
		   }
		   
		   compositeOperation = compositeOperation || 'source-over';

		   if (isNaN(dest.left) || isNaN(dest.top) || isNaN(dest.width) || isNaN(dest.height)) {
		      throw new Error('[blit] bad parameters, destination is ' + dest);
		   }

		   context.save();
		   context.globalCompositeOperation = compositeOperation;
		
		   // first translate, then rotate
		   var m = matrix.createIdentity().translate(dest.left, dest.top);
		   m = m.multiply(srcSurface.matrix);
		   context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
		   var srcSurfaceRect = srcSurface.rect;
		
		   // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
		   context.globalAlpha = srcSurface.blitAlpha;
		   context.drawImage(srcSurface.canvas, area.left, area.top, area.width, area.height, 0, 0, dest.width, dest.height);
		   
		   context.restore();
		   return;
		};
		
		self.rotate = function (angle) {
		   var origSize = self.size;
		   var radians = (angle * Math.PI / 180);
		   var newSize = origSize;
		   // find new bounding box
		   if (angle % 360 !== 0) {
		      var points = [
		         [-origSize.width/2, origSize.height/2],
		         [origSize.width/2, origSize.height/2],
		         [-origSize.width/2, -origSize.height/2],
		         [origSize.width/2, -origSize.height/2]
		      ];
		      var rotPoints = points.map(function(p) {
		         return vectors.rotate(p, radians);
		      });
		      var xs = rotPoints.map(function(p) { return p[0]; });
		      var ys = rotPoints.map(function(p) { return p[1]; });
		      var left = Math.min.apply(Math, xs);
		      var right = Math.max.apply(Math, xs);
		      var bottom = Math.min.apply(Math, ys);
		      var top = Math.max.apply(Math, ys);
		      newSize = [right-left, top-bottom];
		   }
		   var newSurface = new Surface(newSize);
		   var oldMatrix = surface._matrix;
		   surface._matrix = matrix.translate(surface._matrix, origSize[0]/2, origSize[1]/2);
		   surface._matrix = matrix.rotate(surface._matrix, radians);
		   surface._matrix = matrix.translate(surface._matrix, -origSize[0]/2, -origSize[1]/2);
		   var offset = [(newSize[0] - origSize[0]) / 2, (newSize[1] - origSize[1]) / 2];
		   newSurface.blit(surface, offset);
		   surface._matrix = oldMatrix;
		   return newSurface;
		};

		
		return self;
	};
	
	return module;
});



