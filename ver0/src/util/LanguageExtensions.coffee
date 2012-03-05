# Code:
# extend, include are taken on 02/2012 from the CoffeeScript FAQ

#a super simple module system. This function simply makes sure that for a module path like
# foo.bar.blubb there exist javascript objects global:{foo:{bar:{blubb:{}}}} or creates them otherwise
module = (dottedNames) ->
	names = dottedNames.split '.' if typeof dottedNames is 'string'
	parent = global
	
	createModule = (name) ->
		parent = parent[name] ?= {module: if parent.module then "#{parent.module}.#{name}" else name}
		
	createModule name for name in names

extend = (obj, mixin) ->
	for name, method of mixin
		obj[name] = method

include = (klass, mixin) ->
	extend klass.prototype, mixin
