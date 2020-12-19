# Lozza

A simple Javascript UCI chess engine rated about 2400 on CCRL.  Lozza is a traditional engine with an evaluation function based on Fabien Letouzey's Fruit 2.1. It also uses David Bau's random number generator code https://github.com/davidbau/seedrandom and various tecnniques from conversations in talkchess http://www.talkchess.com/forum3/index.php.

## Example web use

```Javascript
var lozza = new Worker('lozza.js');

lozza.onmessage = function (e) {
  $('#dump').append(e.data);      //assuming jquery and a div called #dump
};

lozza.postMessage('uci');         // get build etc
lozza.postMessage('ucinewgame');  // reset TT
lozza.postMessage('position startpos');
lozza.postMessage('go depth 10'); // 10 ply search
```

Try this example [here](https://op12no2.github.io/lozza-ui/ex.htm)

See the LozUCI class for a complete list of commands that Lozza can handle.

## Example web user interfaces

A [sister project](https://github.com/op12no2/lozza-ui) has some more complete example user interfaces for playing and analysing with Lozza, which you can try out [here](https://op12no2.github.io/lozza-ui/).

## Offline use

Lozza can be used in chess UIs like WinBoard and Arena by using [node](https://nodejs.org) as the engine executable and lozza.js as a parameter to it.

## Notes

If you are looking for something stronger using bitboards, have a look at Tamás Kuzmics's [Tomitank](https://github.com/tomitank/tomitankChess) Javascript chess engine.

To enter a javascript chess engine into Hans G. Muller's monthly chess tournaments use somehting like:-

winboard -zp -ics -icshost winboard.nl -icshelper timeseal -fcp "node.exe lozza.js" -fd . -autoKibitz -fUCI -keepAlive 4 -firstXBook
