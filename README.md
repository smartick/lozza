# Lozza

A UCI compliant Javascript chess engine rated about 2400 on CCRL. Lozza is a traditional mailbox engine with PVS search. It's easy to embed Lozza into your web project or use her offline in client user interfaces like Arena and Winboard. A sister project also allows Lozza to be played online. There is nothing new in Lozza - it was just a fun coding exercise. The PSTs are from Fruit 2.1 and the evaluation function is largely a subset of Fruit 2.1. The algorithms are from the Chess Programming Wiki. There is probably a lot of scope for improvement because Lozza is not tuned to any great degree.

## Why Javascript?

Mostly I was curious if a Javascript engine could compete with more traditional engines in the rating lists like CCRL, as at the time there were none listed. There were
Javascript engines with their own user interfaces on the internet, but none that complied with the UCI protocol. The Javascript development cycle is very quick because there is no build process; you can even make changes while it's playing to see what happens. Javascript also makes the engine platform-independent - running online in any browser and offline on any OS that supports node.js (pretty much everything). Not least, Javascript is a lot of fun!

## Example web use in a project

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

Try this example here https://op12no2.github.io/lozza-ui/ex.htm.

See the LozUCI class for a complete list of commands that Lozza can handle.
See also here - https://op12no2.github.io/lozza-ui/consolehelp.htm.

## Playing Lozza online

A sister project - https://github.com/op12no2/lozza-ui - has somenexample user interfaces for playing and analysing with Lozza, which you can try out here - https://op12no2.github.io/lozza-ui.

## Playing Lozza offline

Lozza can be used in chess UIs like WinBoard, Arena and CuteChess by using [node.js](https://nodejs.org) as the engine executable and lozza.js as a parameter
to it. Full paths for both are recommended. node.js and Lozza do not need to be in the same folder. If the UI does not support engine parameters, create a batch file and use that as the engine target.

## Online testing

Perft - https://op12no2.github.io/lozza-ui/perft.htm - various Perft tests - the final one takes 25 seconds on my machine doing about 5M nps.

EPD - https://op12no2.github.io/lozza-ui/bm.htm - various EPD tests including the famous Bratko-Kopec positions

## Notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

To enter a javascript chess engine like Lozza into Hans G. Muller's monthly chess tournaments use somehting like:-

winboard -zp -ics -icshost winboard.nl -icshelper timeseal -fcp "node.exe lozza.js" -fd . -autoKibitz -fUCI -keepAlive 4 -firstXBook

## Credits

Chess Programming Wiki - https://www.chessprogramming.org/Main_Page

Fruit 2.1 - https://www.chessprogramming.org/Fruit

Computer Chess Forums - http://www.talkchess.com/forum3/index.php

CCRL - https://ccrl.chessdom.com/ccrl/4040

