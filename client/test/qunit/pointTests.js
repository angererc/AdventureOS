define(
	['aos/graphics/point'], function (Point) {
		
	var pt = function(x, y) {
		return Point.create(x, y);
	};
	
	var EPS = 0.000001;
	
	var vectorsClose = function(actual, expected, maxDifference, message) {
		var isClose = function(a, b, e) {
			return a === b || Math.abs(a - b) <= e;
		}
		
		var passes = 
		 		isClose(actual.x, expected.x, maxDifference.x)
				&& isClose(actual.y, expected.y, maxDifference.y);
		
		ok(passes, message);
   }

	
	test("isPoint", function () {
		expect(1)
		ok(pt(1, 2).isPoint);
	});
	
	test('Distance', function() {
		expect(3);
   		QUnit.isClose(pt(0, 0).distance(pt(5, 5)), 7.0710678118654755, EPS);
		QUnit.isClose(pt(0, 0).distance(pt(-3, -5)), 5.830951894845301, EPS);
		QUnit.isClose(pt(-55, 11).distance(pt(-3, -5)), 54.405882034941776, EPS);
	});

	test('Length', function() {
   		equal(5, pt(0, 5).length());
   		QUnit.isClose(pt(5, 8).length(), 9.433981132056603, EPS);
	});
	
	test('Unit', function() {
		expect(2);
   		var u = pt(1,1).unit();
   		var du = u.unit();
   		ok(u.x - du.x < EPS);
   		ok(u.y - du.y < EPS);
	});
	
	test('Rotate', function(){
		expect(6);
   		//rotate 90 degrees
		vectorsClose(pt(0,-1).rotate(Math.PI/2), pt(1,0), pt(EPS, EPS));
		//rotate 180 degrees
		vectorsClose(pt(0.0,-1.0).rotate(Math.PI), pt(0,1), pt(EPS, EPS));
    
		//rotate 540 degrees
		vectorsClose(pt(0.0,-1.0).rotate(3*Math.PI), pt(0, 1), pt(EPS, EPS));
    
		//rotate -90 degrees
		vectorsClose(pt(0, -1).rotate(-Math.PI/2), pt(-1, 0), pt(EPS, EPS));
    
		//rotate zero length vector
		vectorsClose(pt(0, 0).rotate(3), pt(0, 0), pt(EPS, EPS));
    
		//rotate  a vector 0 radians
		vectorsClose(pt(0, -1).rotate(0), pt(0, -1), pt(EPS, EPS));
		
	});
	
	test('Dot', function(){
		expect(1);
	   ok(pt(1,4).dot(pt(2, 3))==1*2+4*3);
	});

	test('Angle', function(){
		expect(4);
		//90 degree angle
		QUnit.isClose(pt(0, -1).angle(pt(1, 0)), Math.PI/2, EPS);

		//90 degree angle, other direction
		QUnit.isClose(pt(0, -1).angle(pt(-1, 0)), Math.PI/2, EPS);

		//180 degree angle
		QUnit.isClose(pt(1, 0).angle(pt(-1, 0)), Math.PI, EPS);

		//0 degrees
		QUnit.isClose(pt(0, -1).angle(pt(0, -1)), 0, EPS);
		
	});
});