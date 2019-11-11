class Animal
  constructor: (@name) ->
    @log = []

  move: (meters) ->
    @log.push @name + " moved #{meters}m."

class Snake extends Animal
  move: ->
    @log.push "Slithering..."
    super 5

class Horse extends Animal
  move: ->
    @log.push "Galloping..."
    super 45

sam = new Snake "Sammy the Python"
tom = new Horse "Tommy the Palomino"

sam.move()
tom.move()
