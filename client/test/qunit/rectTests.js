define(
	['aos/graphics/rect', 'aos/graphics/point', 'aos/graphics/size'], 
	function (Rect, Point, Size) {

	var PT = Point.create;
	var SZ = Size.create;
	var REC = Rect.create;
	
	test('isRect', function(){
		expect(2);
		var p = PT(1, 1);
		var s = SZ(2, 3);
		var r = REC(p, s);
	    ok(r.isRect);
		deepEqual(r.origin, p);
	});
	
	test('toString', function(){
		expect(1);
		var r = REC(PT(1, 2), SZ(3, 4));
		equal(r.toString(), "[1@2|3x4]");
	});
	
	test('union', function(){
		expect(8);
		var r1 = REC(PT(1,1), SZ(2,3));
		var r2 = REC(PT(5,5), SZ(3,2));
		var r3 = REC(PT(2,3), SZ(4,3));
		var r4 = REC(PT(2, 3), SZ(2, 2));
		
		var t1 = r1.union(r2); //non-overlapping
		var t2 = r3.union(r1); //top-left of r3 inside r1
		var t3 = r3.union(r2); //bottom right of r3 inside r2
		var t4 = r4.union(r3); //r4 inside r3
		
	    ok(t1.origin.x === 1 && t1.origin.y === 1);
		ok(t1.size.width === 7 && t1.height === 6);
		
		ok(t2.origin.x === 1 && t2.origin.y === 1);
		ok(t2.size.width === 5 && t2.height === 5);
		
		ok(t3.origin.x === 2 && t3.origin.y === 3);
		ok(t3.size.width === 6 && t3.height === 4);
		
		ok(t4.origin.x === 2 && t4.origin.y === 3);
		ok(t4.size.width === 4 && t4.height === 3);
	});
	
	test('coordinates', function(){
		expect(13);
		var p = PT(1, 2);
		var s = SZ(4, 6);
		var r = REC(p, s);
		
	    equal(r.left, 1);
		equal(r.right, 1+4);
		equal(r.top, 2);
		equal(r.bottom, 2+6);
		equal(r.center.x, 1+2);
		equal(r.center.y, 2+3);
		
		var r2 = r.moveBy(PT(-5,-5));
		deepEqual(r.origin, p); //original rect unchanged
		deepEqual(r.size, s);
		equal(r2.left, 1-5);
		equal(r2.top, 2-5);
		
		r.center = PT(10,10);
		equal(r.left, 10-2);
		equal(r.top, 10-3);
		deepEqual(r.size, s); //size unchanged
	});
	
	test('RectCollide', function() {
		expect(20);
   		// overlapping
	   var rect = REC(PT(0, 0), SZ(10, 10));
	   var rectTwo = REC(PT(5, 5), SZ(10, 10));
	   ok(rect.collideRect(rectTwo));
	   ok(rectTwo.collideRect(rect));

	   // touching
	   rectTwo = REC(PT(10, 10), SZ(10, 10));
	   ok(rect.collideRect(rectTwo));
	   ok(rectTwo.collideRect(rect));

	   // rects in different quadrants
	   rectTwo = REC(PT(-20, -20), SZ(10, 10));
	   ok(!rect.collideRect(rectTwo));
	   ok(!rectTwo.collideRect(rect));

	   rectTwo = REC(PT(-20, 0), SZ(10, 10));
	   ok(!rect.collideRect(rectTwo));
	   ok(!rectTwo.collideRect(rect));

	   rectTwo = REC(PT(0, -20), SZ(10, 10));
	   ok(!rect.collideRect(rectTwo));
	   ok(!rectTwo.collideRect(rect));

	   // collide point
	   ok(rect.collidePoint(PT(5, 5)));

	   // touching
	   ok(rect.collidePoint(PT(0, 0)));

	   // diff quadrants
	   ok(!rect.collidePoint(PT(-10, 0)));
	   ok(!rect.collidePoint(PT(0, -10)));
	   ok(!rect.collidePoint(PT(-10, -10)));

	   // collide lines
	   ok(rect.collideLine(PT(0,0), PT(5,5)));
	   ok(rect.collideLine(PT(5,5), PT(20,20)));

	   // touching
	   ok(rect.collideLine(PT(-10,-10), PT(0,0)));

	   // no collide
	   ok(!rect.collideLine(PT(20, 20), PT(50,50)));
	   ok(!rect.collideLine(PT(-10,-10), PT(-20,-20)));
	});

	test('RectClip', function() {
		expect(12);
	   var rec = REC(PT(0, 0), SZ(20, 20));
	   var recTwo = REC(PT(50, 0), SZ(20, 20));

	   // not overlaping
	   deepEqual(rec.clip(recTwo), REC(PT(0,0), SZ(0,0)));

	   // A inside B
	   recTwo = REC(PT(5, 5), SZ(5, 5));
	   deepEqual(rec.clip(recTwo), recTwo);

	   // B inside A
	   recTwo = REC(PT(-1, -1), SZ(21, 21));
	   deepEqual(rec.clip(recTwo), rec);

	   // A clip A
	   deepEqual(rec.clip(rec), rec);

	   // top left
	   recTwo = REC(PT(-1, -1), SZ(11, 11));
	   deepEqual(rec.clip(recTwo), REC(PT(0, 0), SZ(10, 10)));

	   // top left inverse
	   recTwo = REC(PT(5, 5), SZ(30, 30));
	   deepEqual(rec.clip(recTwo), REC(PT(5, 5), SZ(15, 15)));

	   // top right
	   recTwo = REC(PT(5, 5), SZ(11, 11));
	   deepEqual(rec.clip(recTwo), REC(PT(5, 5), SZ(11, 11)));

	   // top right inverse
	   recTwo = REC(PT(-5, 5), SZ(30, 30));
	   deepEqual(rec.clip(recTwo), REC(PT(0, 5), SZ(20, 15)));

	   // bottom left
	   recTwo = REC(PT(-1, 18), SZ(3, 3));
	   deepEqual(rec.clip(recTwo), REC(PT(0, 18), SZ(2, 2)));

	   // bottom left inverse
	   recTwo = REC(PT(18, -18), SZ(20, 20));
	   deepEqual(rec.clip(recTwo), REC(PT(18, 0), SZ(2, 2)));

	   // bottom right
	   recTwo = REC(PT(18, 18), SZ(3, 3));
	   deepEqual(rec.clip(recTwo), REC(PT(18, 18), SZ(2, 2)));

	   // bottom right inverse
	   recTwo = REC(PT(-18, -18), SZ(20, 20));
	   deepEqual(rec.clip(recTwo), REC(PT(0, 0), SZ(2, 2)));
	});
});