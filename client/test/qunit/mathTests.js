define(
	['aos/graphics/math'], function (math) {
	
	var degrees = math.degrees;
	var radians = math.radians;
	var normalizeDegrees = math.normalizeDegrees;
	var normalizeRadians = math.normalizeRadians;

	var EPS = 0.000001;

	test('Degrees', function(){
		expect(3);
	    ok(degrees(0)==0);
	    ok(degrees(Math.PI)==180);
	    ok(degrees(Math.PI*3)==180*3);
	});

	test('Radians', function(){
		expect(3);
	    ok(radians(0)==0);
	    QUnit.isClose(radians(90), Math.PI/2, EPS);
	    QUnit.isClose(radians(180*3), Math.PI*3, EPS);
	});

	test('normalizeDegrees', function(){
		expect(5);
	    ok(normalizeDegrees(0)==0);
	    ok(normalizeDegrees(187)==187);
	    ok(normalizeDegrees(400)==40);
	    ok(normalizeDegrees(-60)==300);
	    ok(normalizeDegrees(-400)==320);
	});

	test('normalizeRadians', function(){
		expect(4);
	    ok(normalizeRadians(0)==0);
	    ok(normalizeRadians(Math.PI)==Math.PI);
	    QUnit.isClose(normalizeRadians(Math.PI*3), Math.PI, EPS);
	    QUnit.isClose(normalizeRadians(-Math.PI*9), Math.PI, EPS);
	});

});