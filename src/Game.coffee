module 'aos.game'

class aos.Game
	constructor: () ->

	register: (name, service) ->
		this[name] = service
		service.hasBeenAddedToGameWithName(this, name) if service.hasBeenAddedToGameWithName
		
	deregister: (name) ->
		service = this[name] or {}
		service.willBeRemovedFromGame() if service.willBeRemovedFromGame
		this[name] = null
		service.hasBeenRemovedFromGame() if service.hasBeenRemovedFromGame
	
	#to get a service, use the normal [] or . operators: game[aService] or game.aService
		