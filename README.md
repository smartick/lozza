# Lozza

A Javascript chess engine inspired by Fabien Letouzey's Fruit 2.1. It's easy to embed Lozza into your web project or use it offline in client user interfaces like Arena and Winboard. A sister project also allows Lozza to be played online in your web browser via PC/laptop/tablet/phone etc. 

## Example use in a web  project

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

You just need the lozza.js file in the root of this repo.

## Playing Lozza online

Another repo has further example web-based user interfaces for playing and analysing with Lozza:-

https://github.com/op12no2/lozza-ui

You can try them here:-

https://op12no2.github.io/lozza-ui

## Playing Lozza offline in Arena, Winboard, Cutechess etc UIs

While primarily intended for use in a browser context, Lozza can be used offline on almost any platform via Nodejs. Download the latest Lozza release and follow the instructions in readme.txt.

https://github.com/op12no2/lozza/releases
  
You can also fire up Lozza using Nodejs from the command line and enter UCI commands manually.  Change directory to the lozza.js location then invoke with: node lozza.

## Notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

lozza.js in the repo root has debug code marked with ##ifdef, which can be removed on release of your project with:-

```
Windows: findstr -V ##ifdef lozza.js
Linux:   grep -v \#\#ifdef lozza.js
```

## Acknowledgements

http://wbec-ridderkerk.nl/html/UCIProtocol.html - UCI Syntax

https://www.chessprogramming.org/Fruit

https://www.chessprogramming.org/Main_Page

https://cutechess.com

https://nodejs.org/en

http://ccrl.chessdom.com/ccrl/4040

http://rebel13.nl

https://github.com/glinscott/nnue-pytorch/blob/master/docs/nnue.md

https://github.com/AndyGrant/Ethereal/blob/master/Tuning.pdf

https://github.com/asdfjkl/neural_network_chess
