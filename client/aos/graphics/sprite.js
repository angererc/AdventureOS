define(['aos/additions/object'], function(obj) {
	var module = {};
	
	/*
	 * A sprite is essentially an animated sprite sheet
	 * the animation spec is an object of the form 
	 * {
	     mode1: {speed:8, frames:['1x3','standing']}
	     mode2: {speed:10, frames:[1, function(gameTime) {...}, 4, false]}
	   }
	 * that is, it maps a "mode" to a sequence of tiles in the
	 * sprite sheet. In general, the animations cycle unless the
	 * last entry is false
	 * 
	 * a frame can be a function which is passed the current
	 * game time. The function then must return the corresponding
	 * frame name. You can use such functions also to 
	 * piggy-back callbacks
	 * at certain animation points
	 */
	module.create = function(spriteSheet, animationSpec) {
		var self = {};
		
		var frameDuration = null;
		
		var currentImage;
		
		var currentMode;
		var currentAnimationSpec;
		var currentFrame;
		var currentFrameDuration;
		
		self.createAccessor('mode', 
			function() {return currentMode;},
			function(aMode) {
				currentMode = aMode;
				currentAnimationSpec = animationSpec[currentMode];
				frameDuration = 1000 / (currentAnimationSpec.speed || 6);
				currentFrame = 0;
				currentFrameDuration  = 0;				
			}
		);
		
		self.draw = function(surface) {
			surface.blit(currentImage);
		};
		
		self.tick = function(gameTime, deltaTime) {
			var setCurrentImage = function() {
				var tileName = currentAnimationSpec.frames[currentFrame];
				if(typeof tileName === 'function') {
					tileName = tileName(gameTime, deltaTime);
				}	
				currentImage = spriteSheet.get(tileName);
				if(! currentImage) {
					throw new Error("No tile with name " + tileName + " found in spriteSheet");
				}
			};
		
			if(! currentMode) {
				throw new Error('No sprite mode set');
			}
			
			if(! currentImage) {
				setCurrentImage();
			}
			
			currentFrameDuration += deltaTime;
			if(currentFrameDuration >= frameDuration) {
				//next frame
				//look ahead if last entry is false; then we do nothing
				if(currentAnimationSpec[currentFrame + 1] !== false) {
					//it's not false, so go ahead
					currentFrame = (currentFrame + 1) % currentAnimationSpec.frames.length;
					setCurrentImage();					
				}
				
				currentFrameDuration = 0;
			}
		}
		
		return self;
	};

	return module;
});
