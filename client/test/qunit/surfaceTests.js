define(
	[
		'aos/graphics/point',
		'aos/graphics/size',
		'aos/graphics/rect',
		'aos/graphics/surface',
	], function (Point, Size, Rect, Surface) {
		
	test('SurfaceConstructor', function() {
		expect(2);
		var size = Size.create(30, 40);
		var surface = Surface.create(size);
		ok(surface.isSurface);
		deepEqual(surface.size, Size.create(30, 40));
	});
	
	test('SurfaceFillClear', function() {
		var pixelEqual = QUnit.pixelEqual;
		var surface = Surface.create(Size.create(10, 10));
		
		surface.fill('rgb(55, 66, 77)');
		pixelEqual(surface, Point.create(1,1), [55, 66, 77, 255]);
		
		surface.fill('#ff0000');
   		pixelEqual(surface, Point.create(1,1), [255, 0, 0, 255]);

		surface.fill('rgb(12, 13, 14)');
   		pixelEqual(surface, Point.create(1,1), [12, 13, 14, 255]);

   		surface.clear();
   		pixelEqual(surface, Point.create(1,1), [0, 0, 0, 0]);
	});
	
	test('SurfaceClone', function() {
   		var surfaceEqual = QUnit.surfaceEqual;

   		var surface = Surface.create(Size.create(20,20));

   		surface.fill('#20394');

   		var clone = surface.clone();
   		equal(surface.width, clone.width);
   		equal(surface.height, clone.height);
   		equal(surface.alpha, clone.alpha);
   		surfaceEqual(surface, clone);
	});
	
	test('SurfaceAlpha', function() {
   		var pixelEqual = QUnit.pixelEqual;

   		var first = Surface.create(Size.create(20,20));
   		var second = Surface.create(Size.create(20, 20));
   		second.fill('rgb(255,0,0)');
   		second.alpha = 0.5;

   		first.blit(second);
   		pixelEqual(first, Point.create(5,5), [255,0,0,128]);
	});

	test('SurfaceBlit', function() {
		var surfaceEqual = QUnit.surfaceEqual;
		var pixelEqual = QUnit.pixelEqual;

		var big = Surface.create(Size.create(100,100));
		big.fill('rgb(255,0,0)');

		var second = Surface.create(Size.create(10,10));
		second.fill('rgb(0,255,0)');

		// blitting without target puts it into top left corner
		big.blit(second);
		pixelEqual(big, Point.create(0,0), [0,255,0]);
		pixelEqual(big, Point.create(9,9), [0,255,0]);
		pixelEqual(big, Point.create(10,10), [255,0,0]);
		pixelEqual(big, Point.create(99,99), [255,0,0]);

		// blitting with whole big rect effectively fills
		big.fill('rgb(255,0,0)');
		big.blit(second, Rect.create(Point.create(0,0), big.size));
		pixelEqual(big, Point.create(0,0), [0,255,0]);
		pixelEqual(big, Point.create(9,9), [0,255,0]);
		pixelEqual(big, Point.create(10,10), [0,255,0]);
		pixelEqual(big, Point.create(99,99), [0,255,0]);

		// blitting at position
		big.fill('rgb(255,0,0)');
		big.blit(second,  Rect.create(Point.create(20,20), second.size));
		pixelEqual(big, Point.create(0,0), [255,0,0]);
		/*test nr 10*/pixelEqual(big, Point.create(19,19), [255,0,0]);
		pixelEqual(big, Point.create(20,20), [0,255,0]);
		pixelEqual(big, Point.create(29,29), [0,255,0]);
		pixelEqual(big, Point.create(30,30), [255,0,0]);

		// blitting at position with smaller source area
		big.fill('rgb(255,0,0)');
		big.blit(second, 
		 			Rect.create(Point.create(20,20), second.size), 
		 			Rect.create(Point.create(0,0),Size.create(5,5)));
		pixelEqual(big, Point.create(0,0), [255,0,0]);
		/*test nr 15*/pixelEqual(big, Point.create(19,19), [255,0,0]);
		pixelEqual(big, Point.create(20,20), [0,255,0]);
		pixelEqual(big, Point.create(24,24), [0,255,0]);
		pixelEqual(big, Point.create(25,25), [0,255,0]);
		pixelEqual(big, Point.create(26,26), [0,255,0]);
		pixelEqual(big, Point.create(30,30), [255,0,0]);
	});
});