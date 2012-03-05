t = require './extras/TestHelpers'
require './build/AdventureOS'

test 'Simple event dispatcher service instantiation ', ->
	event = new aos.EventDispatcherService()
	
	flags = [no, no, no]
	
	top = {name:'top'}
	bottom = {name:'bottom'}
	
	#catch all
	event.register 'fooEvent', null, -> 
		flags[0] = yes
		
	#observe top
	event.register 'fooEvent', top, -> 
		flags[1] = yes
	
	#observe bottom
	event.register 'fooEvent', bottom, -> 
		flags[2] = yes
		
	#create dispatch chain
	event.createEventDispatchChainLink(bottom, -> top)
	
	#post from bottom
	event.post 'fooEvent', bottom
	
	allTrue = []
	allTrue.push(yes) for f in flags
	t.arrayEqual flags, allTrue