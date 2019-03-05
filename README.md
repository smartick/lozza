# Lozza

A simple Javascript UCI chess engine rated about 2400 on CCRL.

## Example Web Use

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

See the LozUCI class for a complete list of commands that Lozza can handle.

## Offline Use

Lozza can be used in chess UIs like WinBoard and Arena by using [node](https://nodejs.org) as the engine executable and lozza.js as a parameter to it.
