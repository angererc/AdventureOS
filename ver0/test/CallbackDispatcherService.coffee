t = require './extras/TestHelpers'
require './build/AdventureOS'

test 'CallbackDispatcherService ', ->
	tcd = new aos.CallbackDispatcherService()
	
	flags = [no, no, no, no]
	
	#immediate
	tcd.scheduleAfterRounds(0, -> flags[0] = yes)
	tcd.scheduleAfterTime(0, -> flags[1] = yes)
	
	#execute at the second call to dispatch ("2 ticks from now")
	tcd.scheduleAfterRounds(2, -> flags[2] = yes)
	t.eq no, flags[2]
	tcd.dispatch(1)
	t.eq no, flags[2]
	tcd.dispatch(2)
	
	#execute in 200 ms
	tcd.scheduleAfterTime(200, -> flags[3] = yes)
	tcd.dispatch(100)
	t.eq no, flags[3]
	tcd.dispatch(99)
	t.eq no, flags[3]
	tcd.dispatch(1)
	
	allTrue = []
	allTrue.push(yes) for f in flags
	t.arrayEqual flags, allTrue