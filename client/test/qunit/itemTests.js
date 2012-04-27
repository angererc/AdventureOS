define(
	['aos/items/item'], function (Item) {
	
	test('Item basic role', function(){
		var item = Item.__INTERNAL__createItem('foo');
		
		item.set('position', {x:0, y:0});
		
		deepEqual(item.get('position'), {x:0, y:0});
	});
	
	test('Item dependent roles', function(){
		var item = Item.__INTERNAL__createItem('foo');
		
		item.set('position', {x:0, y:0});
		item.set('color', 'red');
		
		item.set('graphics', function(pos, col) { return {position:pos, color:col}}, ['position', 'color']);
		
		deepEqual(item.get('graphics'), {position:{x:0, y:0}, color:'red'});
		ok(item.topologicalRoleOrdering[2] == 'graphics');
	});
	
});