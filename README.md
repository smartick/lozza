_To run Lozza in a chess UI like Arena, Winboard etc. or the command line, download the latest release (see right-hand section of this page). Most platforms supported via Nodejs._

# Lozza

A UCI compliant Javascript chess engine. It's easy to embed Lozza into your web project or use her offline in client user interfaces like Arena and Winboard. A sister project also allows Lozza to be played online in your web browser via PC/laptop/tablet/phone etc. 

## Example use in a web  project

```Javascript
var lozza = new Worker('lozza.js');

lozza.onmessage = function (e) {
  $('#dump').append(e.data);      //assuming jquery and a div called #dump
                                  //parse messages from here as required
};

lozza.postMessage('uci');         // get build etc
lozza.postMessage('ucinewgame');  // reset TT
lozza.postMessage('position startpos');
lozza.postMessage('go depth 10'); // 10 ply search
```

Try this example here https://op12no2.github.io/lozza-ui/ex.htm.

You do not have to use a web worker or the UCI interface, but you will not be able to update a web page until Lozza returns - see for example texeltune.js in the tuning folder above, which just includes lozza.js and uses it's function interface directly. While that is a Nodejs example, the same can be done in web pages.

## Playing Lozza online

A sister project - https://github.com/op12no2/lozza-ui - has some example user interfaces for playing and analysing with Lozza, which you can try out here - https://op12no2.github.io/lozza-ui.

## Playing Lozza offline in Arena, Winboard, Cutechess etc UIs

Lozza can be used on almost any platform via Nodejs. Download the latest Lozza release and follow the instructions in readme.txt. Short version: Install Nodejs and edit the batch file one-liner included in the release to point at the node executable and lozza.js. Then point your chess UI at the batch file.

## Evaluation

From version 3, Lozza's evaluation function is somewhat unique in that it only uses generic metrics like mobility, imbalance, reach, cwtch and xray. It is tempting to go ad-hoc with bishop-pair bonuses and passed pawns etc. in the name of ELO, but I am trying to design a scheme such that these are side-effects of the generic metrics. As of yet Lozza has no networks, but I have been playing around with them a bit as a learning exercise, including training; see the tuning folder for examples. See also https://github.com/op12no2/toynet. 

## Notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

## Acknowledgements

https://www.chessprogramming.org/Main_Page

https://cutechess.com/

https://nodejs.org/en/

http://ccrl.chessdom.com/ccrl/4040/


