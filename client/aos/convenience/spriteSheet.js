define([
	], function() {
	var module = {};
	
	/*
	 * creates a sprite sheet specification for a sprite sheet that
	 * is layed out as a regular grid
	 * the names of the sprites will be a string like '2x5' for the tile
	 * in the second column, 5th row.
	 * however, if numX or numY == 1 we will return an array instead
	 * (i.e., the name of the tile is only an int)
	
	 * if numY == undefined then we use numY = 1
	
	 * you can also give an additional padding in case there is a small
	 * extra space between the tiles
	 */
	module.regularGridSpec = function(picSurface, numX, numY, padX, padY) {
		function getName(x, y) {
			     if(numY == 1) { return x; } 
			else if(numX == 1) { return y; } 
			else               { return x + 'x' + y; }
		}
		
		padX = padX || 0;
		padY = padY || 0;
		numY = numY || 1;
		
		var picSize = picSurface.size;
		var spec = (numX == 1 || numY == 1) ? [] : {};
		
		var tileWidth = (picSize.width / numX) - padX;
		var tileHeight = (picSize.height / numY) - padY;
		
		var currentX = padX;
		var currentY = padY;
		for(var x = 0; x < numX; x++) {
			for(var y = 0; y < numY; y++) {
				var detail = {
					x: currentX, y: currentY,
					width: tileWidth, height: tileHeight
				};
				spec[getName(x, y)] = detail;
								
				currentY += (tileHeight+padY);
			}
			currentX += (tileWidth+padX);
			currentY = padY;
		}
		
		return spec;
	}
	
	return module;
});