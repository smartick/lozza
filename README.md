# Lozza

A UCI compliant Javascript chess engine. Lozza is a traditional mailbox engine with PVS search. It's easy to embed Lozza into your web project or use her offline in client user interfaces like Arena and Winboard. A sister project also allows Lozza to be played online in your web browser via PC/laptop/tablet/phone etc. 

## Why Javascript?

Mostly I was curious if a Javascript engine could compete with more traditional engines in the engine rating lists like CCRL, as at the time there were none listed. There were Javascript engines with their own user interfaces on the internet (like Gary Linscott's Garbochess), but none that used the UCI (or Winboard) protocol - needed to be included in the testing platforms. The Javascript development cycle is very quick because there is no build process. Javascript effectively makes the engine platform-independent - running online in any browser/device and offline on any OS that supports Nodejs (pretty much everything). Not least, Javascript is simply a lot of fun! 

One downside is a hit in performance compared to traditionally compiled languages like C etc; but the JIT compiler in Google's V8 Javascript engine (that sits in Nodejs and the Chrome browser) is quite extraordinary. Another is that there are no native 64 bit integer values (there are 53 usable bits in the native Javascript Number type). Recently-ish however the concept of a BigInt was introduced - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt - which may suffice depending on performance; I have not tried them. Lozza uses Typed-Arrays and 2 32bit values for it's hash - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays.  

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

1. Install Nodejs. For Windows go to https://nodejs.org. For Linux use "sudo apt install nodejs". Nodejs is available for most platforms including Apple. Use an internet search to find out how it install it.

2. Download the latest Lozza release and unzip. Rename the unzipped folder to your own preference and cut/paste it anywhere you like.

3. Add Lozza to your chess UI. This is a little bit different to other engines.  Edit the lozza.bat file contained in the release to point at the Nodejs executable with lozza.js as a parameter. Full paths are recommended.  For example:-

```
"c:\program files\nodejs\node.exe" c:\path\to\lozza.js 
```

Then use lozza.bat as the engine target; similarly for Linux/Mac etc.  

On Windows, modern versions of Nodejs require Windows version 8.1 or later. To run Lozza on Windows 7 please contact me for a hack.

## Notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

## Acknowledgements

Lozza is hand-coded from scratch. Her evaluation function was initially a subset of the features described in the Toga User Manual (Fruit). From v3 (not released yet) Lozza's evaluation is completely original. Her search algorithms etc. are all from the Chess Programming Wiki edited by Gerd Isenberg; which has been,and still is, invaluable. Harm Geert Muller was very generous with his time on the computer chess discussion forums. Lozza was tested by Graham Banks and Gabor Szots et al. at CCRL - and included in their rating lists. Before using Nodejs, Lozza ran in Edmund Moshammer's jsUCI stdin/stdout V8 container. I use a PGN/EPD utility called pgn-extract written by David J. Barnes. Lozza soak testing is performed using the freely available and totally amazing Cutechess command-line and UI applications written by Ilari Pihlajisto and Arto Jonsson. Lozza is tuned by Peter Österlund's method ("Texel tuning") using quiet-labeled.epd published by Alexandru Moșoi, the Zurichess author.  
