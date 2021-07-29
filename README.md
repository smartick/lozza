_To run Lozza in a chess UI like Arena, Winboard etc. or the command line, download the latest release (see right-hand section of this page). All platforms supported via Nodejs._

# Lozza

A UCI compliant Javascript chess engine. It's easy to embed Lozza into your web project or use her offline in client user interfaces like Arena and Winboard. A sister project also allows Lozza to be played online in your web browser via PC/laptop/tablet/phone etc. 

## Why Javascript?

Mostly I was curious if a Javascript engine could compete with more traditional engines in the engine rating lists like CCRL, as at the time there were none listed. There were Javascript engines with their own user interfaces on the internet (like Gary Linscott's Garbochess), but none that used the UCI (or Winboard) protocol - needed to be included in the testing platforms. The Javascript development cycle is very quick because there is no build process. Javascript effectively makes the engine platform-independent - running online in any browser/device and offline on any OS that supports Nodejs (pretty much everything). Not least, Javascript is a lot of fun! 

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

Lozza can be used on almost any platform via Nodejs. Download the latest Lozza release (lozza2.0.zip) and follow the instructions in readme.txt. Short version: Install Nodejs and edit the batch file one-liner included in the release to point at the node executable and lozza.js. Then point your chess UI at the batch file.

## Notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

## Acknowledgements

The Chess Programming Wiki edited by Gerd Isenberg has been, and still is, invaluable. Harm Geert Muller was very generous with his time on the computer chess discussion forums. Lozza was tested by Graham Banks and Gabor Szots et al. at CCRL - and included in their rating lists. Before using Nodejs, Lozza ran in Edmund Moshammer's jsUCI stdin/stdout V8 container. I use a PGN/EPD utility called pgn-extract written by David J. Barnes. Lozza soak testing is performed using the freely available and totally amazing Cutechess command-line and UI applications written by Ilari Pihlajisto and Arto Jonsson. Lozza was initially tuned using Peter Österlund's method ("Texel tuning") and quiet-labeled.epd published by Alexandru Moșoi, the Zurichess author. 
