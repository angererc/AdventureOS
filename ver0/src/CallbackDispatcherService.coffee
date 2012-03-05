module 'aos'

#a utility class that can be used in conjunction with a time service
#this class can be registered  (directly or indirectly) as a tick receiver
#and then allows you to schedule callbacks either by number of rounds
#or by elapsed time
class aos.CallbackDispatcherService
	
	constructor: () ->
		@_byRound = []
		@_byTime = []
	
	#manages an array (the future rounds) of arrays (multiple callbacks per round) of callbacks
	#executes callback at the #inRound tick ("call in inRound ticks from now")
	scheduleAfterRounds: (inRounds = 0, callback) ->
		if inRounds == 0
			callback()
		else
			(@_byRound[inRounds-1] ?= []).push callback

	#manages an array of {remaining, callback} objects
	scheduleAfterTime: (afterTime = 0, callback) ->
		if afterTime == 0
			callback()
		else
			@_byTime.push {remaining:afterTime, callback:callback}
			
	#a tick; can be used as the tick receiver in the time service or inside somebody else's tick receiver
	dispatch: (passedTime) ->
		#chop off the first array in the byRound list
		expired = (@_byRound.splice 0, 1)[0] ? []
		
		#collect expired byTime callbacks and add them to expired
		byTime = @_byTime
		@_byTime = []
		for cb in byTime
			cb.remaining -= passedTime
			if cb.remaining > 0
				@_byTime.push cb
			else
				expired.push cb.callback
			
		#call the expired callbacks	
		callback(passedTime) for callback in expired
