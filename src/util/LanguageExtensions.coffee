# Code:
# namespace, extend, include are taken on 02/2012 from the CoffeeScript FAQ

namespace = (target, name, block) ->
  [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
  top    = target
  target = target[item] or= {} for item in name.split '.'
  block target, top


extend = (obj, mixin) ->
	for name, method of mixin
		obj[name] = method

include = (klass, mixin) ->
	extend klass.prototype, mixin