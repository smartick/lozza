# Lozza

A Javascript chess engine inspired by Fabien Letouzey's Fruit 2.1. 

It's easy to use Lozza in your web projects by firing up Lozza in a web worker and communicating with the UCI protocol.

## Basic use

All you need is lozza.js from the root of the repo.

```Javascript
var lozza = new Worker('lozza.js');

lozza.onmessage = function (e) {
  $('#dump').append(e.data);             //assuming jquery and a div called #dump
                                         //parse messages from here as required
};

lozza.postMessage('uci');                // get build etc
lozza.postMessage('ucinewgame');         // reset TT
lozza.postMessage('position startpos');
lozza.postMessage('go depth 10');        // 10 ply search
```

Try this example here:-

https://op12no2.github.io/lozza-ui/ex.htm.

## More examples

A sister repo has more examples for playing and analysing etc. with Lozza.

https://github.com/op12no2/lozza-ui

You can try them here:-

https://op12no2.github.io/lozza-ui

## Play Lozza on Lichess

https://lichess.org/@/lozzaBot

## Play Lozza offline in chess user interfaces

Lozza has been packaged into Windows, Linux and Mac executables for offline use in chess user interfaces.

https://github.com/op12no2/lozza/releases
  
## Developer notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

lozza.js has tuning and debug code marked with ##ifdef, which will _signigicantly affect performance_. It can be removed like this:-

```
Windows: findstr -V ##ifdef lozza.js > mylozza.js
Linux:   grep -v \#\#ifdef lozza.js > mylozza.js
```
You should also change TTSIZE from a power of 22 to 24 if using long time controls (minutes).

## Acknowledgements

https://www.chessprogramming.org/Fruit - Fruit

https://www.chessprogramming.org/Main_Page - Chess programming wiki

http://ccrl.chessdom.com/ccrl/4040 - CCRL rating list

https://github.com/AndyGrant/Ethereal/blob/master/Tuning.pdf - A nice overview of gradient descent.

http://wbec-ridderkerk.nl/html/UCIProtocol.html - UCI protocol.

https://www.npmjs.com/package/pkg - tool used to package Lozza into executables.

https://github.com/davidbau/seedrandom - random number generator.



