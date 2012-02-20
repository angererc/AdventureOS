fs     = require 'fs'
{exec} = require 'child_process'

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
]

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