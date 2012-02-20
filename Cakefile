fs     = require 'fs'
{exec} = require 'child_process'
path   = require 'path'
cs     = require './extras/coffee-script'

# -----------------------------------------------------------------
# Sadly, ordering of the files matters; 
# (otherwise, the namespace() function may be included in the end
# which makes the earlier code fail, for example)
# so we have to list the files in the right order explicitly
# we may be able to come up with a scheme where we add the ordered
# files first and then add a wildcard for all the others.
# but for now, you have to add them explicitly, I'm sorry
# -----------------------------------------------------------------
appName = 'AdventureOS'

appFiles  = [
  # omit src/ and .coffee to make the below lines a little shorter
  'util/LanguageExtensions'
  'Game'
  'TimeService'
]

# ---------------------------------------------
# Helpers
# ---------------------------------------------

#ANSI Terminal colors
bold = '\033[0;1m'
red = '\033[0;31m'
green = '\033[0;32m'
reset = '\033[0m'

#log a message with a color
log = (color, message, explanation) ->
	console.log color + message + reset + ' ' + (explanation or '')
	
# ---------------------------------------------
# Normal build
# ---------------------------------------------
task 'build', 'Build single application file from source files', ->
  appContents = new Array remaining = appFiles.length
  for file, index in appFiles then do (file, index) ->
    fs.readFile "src/#{file}.coffee", 'utf8', (err, fileContents) ->
      throw err if err
      appContents[index] = fileContents
      process() if --remaining is 0
  process = ->
    fs.writeFile "build/#{appName}.coffee", appContents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      exec "coffee --compile build/#{appName}.coffee", (err, stdout, stderr) ->
        throw err if err
        console.log stdout + stderr
        fs.unlink "build/#{appName}.coffee", (err) ->
          throw err if err
          console.log 'Done.'

# ---------------------------------------------
# Testing framework
# Not sure where I got that from, but
# I (Christoph) didn't come up with all of that myself...
# I only tweaked it.
# ---------------------------------------------		
task 'test', 'run test suite', (options) ->
	#we require the build task
	invoke 'build'
	
	#make require available to test scripts
	global.require = require
	
	startTime = Date.now()
	passedTests = 0
	currentFile = null
	failures = []
		
	#we create the test function here and not in TestHelpers.js 
	#because we want access to the currentFile
	#(also, otherwise we would have to do t = require 'TestHelpers' and then t.test = ...)
	global.test = (description, fn) ->
		try
			fn.test = {description, currentFile}
			fn.call(fn)
			passedTests += 1
		catch e
			e.description = description if description?
			e.source = fn.toString() if fn.toString?
			failures.push filename: currentFile, error: e
	
	#when done, collect and print errors
	process.on 'exit', ->
		time = ((Date.now() - startTime) / 1000).toFixed(2)
		okTestsMessage = "passed #{passedTests} tests in #{time} seconds"
		return log(green, okTestsMessage) unless failures.length
		
		#failures happened, print them
		log red, "failed #{failures.length} and #{okTestsMessage}"
		for fail in failures
			{error, filename} = fail
			jsFilename = filename.replace(/\.coffee$/, '.js')
			match = error.stack?.match(new RegExp(fail.file+":(\\d+):(\\d+)"))
			match = error.stack?.match(/on line (\d+):/) unless match
			[match, line, col] = match if match
			console.log ''
			log red, "  #{error.description}" if error.description
			log red, "  #{error.stack}"
			log red, "  #{jsFilename}: line #{line ? 'unknown'}, column #{col ? 'unknown'}"
			console.log "  #{error.source}" if error.source
		return
	
	#find all .coffee files in the test directory and run them
	files = fs.readdirSync 'test'
	for file in files when file.match /\.coffee$/i

		currentFile = filename = path.join 'test', file
		log bold, "\n-------------------"
		log bold, "Executing #{currentFile}"
		code = fs.readFileSync filename
		try
			cs.CoffeeScript.run code.toString(), {filename}
		catch error
			failures.push {filename, error}
		
	return !failures.length