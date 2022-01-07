# Lozza

A Javascript chess engine inspired by Fabien Letouzey's Fruit 2.1. It's easy to embed Lozza into your web project or use it offline in client user interfaces like Arena and Winboard. A sister project also allows Lozza to be played online in your web browser via PC/laptop/tablet/phone etc. 

## Example use in a web  project

```Javascript
var lozza = new Worker('lozza.js');

lozza.onmessage = function (e) {
  $('#dump').append(e.data);      //assuming jquery and a div called #dump
                                  //parse messages from here as required
};

lozza.postMessage('uci');                // get build etc
lozza.postMessage('ucinewgame');         // reset TT
lozza.postMessage('position startpos');
lozza.postMessage('go depth 10');        // 10 ply search
```

Try this example here:-

  https://op12no2.github.io/lozza-ui/ex.htm.

You do not have to use a web worker or the UCI interface, but you will not be able to update a web page until Lozza returns - see for example gdtuner.js in the testing folder above, which just includes lozza.js and uses it's function interface directly. While that is a Nodejs example, the same can be done in web pages. As an alternative to using the function interface directly, which requires some dev knowledge, you can issue UCI commands like this:-

```Javascript
onmessage({data: 'uci\n'}); 
onmessage({data: 'ucinewgame\n'}); 
onmessage({data: 'position startpos\n'}); 
onmessage({data: 'go depth 10\n'}); 
```

All output will go to the console by default. Tweak the ```lozUCI.send``` function to do something else. The best move is sent from the ```lozChess.go``` function, which you could also tweak. Ideally though, use a web worker.  

## Playing Lozza online

This repo has some example web-based user interfaces for playing and analysing with Lozza:-

  https://github.com/op12no2/lozza-ui

You can try them here:-

  https://op12no2.github.io/lozza-ui

They use web workers.

## Playing Lozza offline in Arena, Winboard, Cutechess etc UIs

Lozza can be used on almost any platform via Nodejs. Download the latest Lozza release and follow the instructions in readme.txt.

  https://github.com/op12no2/lozza/releases

## Notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

## Acknowledgements

https://www.chessprogramming.org/Fruit

https://www.chessprogramming.org/Main_Page

https://cutechess.com

https://nodejs.org/en

http://ccrl.chessdom.com/ccrl/4040

http://rebel13.nl

https://github.com/glinscott/nnue-pytorch/blob/master/docs/nnue.md

https://github.com/AndyGrant/Ethereal/blob/master/Tuning.pdf

https://github.com/asdfjkl/neural_network_chess


