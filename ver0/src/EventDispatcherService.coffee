module 'aos'

class aos.EventDispatcherService

	constructor: () ->
		#hash of event names
		@_listeners = {}
		#counter to generate uids for objects, since JavaScript doesn't have hash codes built in
		#(javascript converts an objects to string when it is used as a hash key, usually resulting in
		# '[object object]'
		@_sourceUID = 0
		
	#register event handler; if source == null then it's a "catch all" for that event
	register: (event, source, callback) ->
		(this._getListenersListForEvent event, source, true).push callback
		callback
		
	post: (eventName, source = null, data = null) ->
		event = 
			name: eventName
			source: source
			data: data
			
		#first, post event along event chain
		current = source
		while current?
			callback(event) for callback in (this._getListenersListForEvent eventName, current, false)
			current = current.__eventDispatcherServiceEventChain?(event)
			
		#then post to catch all listeners
		callback(event) for callback in this._getListenersListForEvent eventName, null, false
	
	remove: (event, source, callback) ->
		listenersList = this._getListenersListForEvent event, source, false
		index = listenersList.indexOf(callback)
		listenersList.splice(index, 1) unless index < 0

	createEventDispatchChainLink: (from, targetGetter) ->
		from.__eventDispatcherServiceEventChain = targetGetter
		
	_getListenersListForEvent: (eventName, source, create = false) ->
		listeners = if create then @_listeners[eventName] ?= {} else @_listeners[eventName] ? {}
		#get or create the object's UID
		slotName = if source?
			if create
				source['__eventDispatcherServiceUID'] ?= "__eventDispatcherServiceUID.#{@_sourceUID += 1}"
			else
				source['__eventDispatcherServiceUID'] ? "__eventDispatcherServiceUID.NoUID"
		else
			'__all__'
			
		result = if create then listeners[slotName] ?= [] else listeners[slotName] ? []
		return result
		