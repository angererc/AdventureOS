t = require './extras/TestHelpers'
require './build/AdventureOS'

test "Service protocol is executed", ->
	service = {
		hasBeenAddedToGameWithName: (game, name) ->
			service.game = game
			service.name = name
			
		willBeRemovedFromGame: ->
			service.wbrfg = yes
			
		hasBeenRemovedFromGame: ->
			service.hbrfg = yes
	}
	
	game = new aos.Game
	
	#register
	game.register 'AService', service
	
	t.eq service.game, game
	t.eq service.name, 'AService'
	
	#get
	t.eq game.AService, service
	
	#remove
	game.deregister 'AService'
	
	t.ok service.wbrfg
	t.ok service.hbrfg
	
test "Game object can deal with service object that doesn't implement any methods", ->
	service = {}
	
	game = new aos.Game
	
	#register
	game.register 'AService', service
	
	#get
	t.eq game.AService, service
	
	#remove
	game.deregister 'AService'
	