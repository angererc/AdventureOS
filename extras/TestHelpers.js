console.log('Loading test helpers')

var assert = require('assert');
var cs = require('coffee-script');

/*
We make the following assert functions available:
fail
ok
equal
notEqual
deepEqual
notDeepEqual
strictEqual
notStrictEqual
throws
doesNotThrow
ifError
eq (=== strictEqual)
arrayEqual

In addition, we make the CoffeeScript stuff (compiler etc)
available as
CoffeeScript.{coffee script function}

and the following helpers:
printSlots(obj, optional prefixString)
*/

// copy all the assert functions to the test helpers
(function() {
	var name;
	for (name in assert) {
		exports[name] = assert[name];
		//console.log("Added assert function " + name);
	}
})();

//convenience
//console.log("Added assert function eq (=== strictEqual)");
exports.eq = exports.strictEqual;

//console.log("Added assert function arrayEqual");
exports['arrayEqual'] = function(a, b, msg) {
	//a recursive egal operator, see http://wiki.ecmascript.org/doku.php?id=harmony:egal
	//egal for scalar values, otherwise must be array of scalars or other arrays
	var _arrayEqual = function(a, b) {
	    var el, idx, _len;
	    if (a === b) {
	      return a !== 0 || 1 / a === 1 / b;
	    } else if (a instanceof Array && b instanceof Array) {
	      if (!(a.length = b.length)) return false;
	      for (idx = 0, _len = a.length; idx < _len; idx++) {
	        el = a[idx];
	        if (!_arrayEqual(el, b[idx])) return false;
	      }
	      return true;
	    } else {
	      return a !== a && b !== b;
	    }
	  };
	exports.ok(_arrayEqual(a, b), msg);
};

//making coffee script compiler available to tests
exports.CoffeeScript = cs.CoffeeScript;

exports.printSlots = function(obj, prefix) {
	prefix = prefix || "";
	for (name in obj) {
		console.log(prefix + name);
	}
}