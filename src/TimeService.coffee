module 'aos'

class aos.TimeService
	
	constructor: () ->
		@_state = 'stopped'
		@_receivers = []
		#50 frames per second default
		@_interval = 20
		this._reset()
		
	pushTickReceiver: (rec) ->
		throw 'IllegalStateException' unless @_state is 'stopped'
		@_receivers.push(rec)
		
	setInterval: (interval) ->
		throw 'IllegalStateException' unless @_state is 'stopped'
		@_interval = interval
	
	start: () ->
		throw 'IllegalStateException' unless @_state is 'stopped'
		this._run()
		@_state = 'running'
		
	pause: () ->
		throw 'IllegalStateException' unless @_state is 'running'
		this._halt()
		@_state = 'paused'
		
	resume: () ->
		throw 'IllegalStateException' unless @_state is 'paused'
		this._run()
		@_state = 'running'
		
	stop: () ->
		throw 'IllegalStateException' unless (@_state is 'running') or (@_state is 'stopped')
		this._halt()
		@_state = 'stopped'
		this._reset()
		
	state: () ->
		@_state
		
	#return the time info object {long absoluteTime, long passedTime}
	#the passedTime is the one that is passed to the receivers
	time: () ->
		@_time
		
	#time passed since the last start() or resume()
	runningTime: () ->
		(new Date()).getTime() - @_startTime
		
	_reset: () ->
		throw 'IllegalStateException' unless @_state is 'stopped'
		#the @_time object is reused in every tick and holds the time info
		@_time = {}
		@_startTime = null
		
	_run: () ->
		#make sure we can access receivers and time in the closure
		receivers = @_receivers
		time = @_time
		@_startTime = lastTick = (new Date()).getTime()
		@_runner = setInterval (() ->
			now = (new Date()).getTime()
			passedTime = now - lastTick
			
			time.absoluteTime = now
			time.passedTime = passedTime
			lastTick = now
			
			receiver(passedTime) for receiver in receivers
		), @_interval
		
	_halt: () ->
		clearInterval(@_runner)