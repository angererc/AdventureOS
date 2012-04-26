define(
	[
		'aos/convenience/spriteSheet',
	], function (SpriteSheetUtil) {
		
	test('SpriteSheet util regular grid, one-dimensional', function() {
		var surface = {size:{width:464, height:83}};
		var spec = SpriteSheetUtil.regularGridSpec(surface, 4);
		deepEqual(spec, [
									{x:0,y:0,width:116,height:83},
									{x:116,y:0,width:116,height:83},
									{x:232,y:0,width:116,height:83},
									{x:348,y:0,width:116,height:83},
								]);
	});
	
	test('SpriteSheet util regular grid, one-dimensional, y-direction', function() {
		var surface = {size:{width:83, height:464}};
		var spec = SpriteSheetUtil.regularGridSpec(surface, 1, 4);
		deepEqual(spec, [
									{x:0,y:0,  height:116,width:83},
									{x:0,y:116,height:116,width:83},
									{x:0,y:232,height:116,width:83},
									{x:0,y:348,height:116,width:83},
								]);
	});
	
	test('SpriteSheet util regular grid, two-dimensional', function() {
		var surface = {size:{width:464, height:166}};
		var spec = SpriteSheetUtil.regularGridSpec(surface, 4, 2);
		deepEqual(spec, 
			{
				'0x0': {x:0,  y:0,width:116,height:83},
				'1x0': {x:116,y:0,width:116,height:83},
				'2x0': {x:232,y:0,width:116,height:83},
				'3x0': {x:348,y:0,width:116,height:83},
				'0x1': {x:0,  y:83,width:116,height:83},
				'1x1': {x:116,y:83,width:116,height:83},
				'2x1': {x:232,y:83,width:116,height:83},
				'3x1': {x:348,y:83,width:116,height:83},
			});
	});
	
	//ToDo: test with X and Y padding
});