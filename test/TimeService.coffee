t = require './extras/TestHelpers'
require './build/AdventureOS'

test 'Time service starts up successfully', ->
	ts = new aos.TimeService()
	
	ts.start()
	ts.pause()
	ts.resume()
	ts.stop()
	
test 'Time service is running', ->
	ts = new aos.TimeService()

	counter = 0
	ts.pushTickReceiver(
		(time) -> 
			counter += 1
			console.log("#{counter} #{if counter == 1 then 'tick' else 'ticks'} received") if counter%10 == 0
			ts.stop() if counter >= 50
	)
	#hurry up a bit
	ts.setInterval 2
	ts.start()
