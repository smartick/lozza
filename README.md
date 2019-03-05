# lozza

A simple Javascript UCI chess engine rated about 2400 on CCRL.

## Web Use

```Javascript
var lozza = new Worker('lozza.js');

lozza.onmessage = function (e) {
  $('#dump').append(e.data);
};

lozza.postMessage('uci');         // get build etc
lozza.postMessage('ucinewgame');  // reset TT
lozza.postMessage('position startpos');
lozza.postMessage('go depth 10'); // 10 ply search
```

## Offline Use

Lozza can be used in chess UIs like WinBoard and Arena by using node as the executable and lozza.js as a parameter to it.
