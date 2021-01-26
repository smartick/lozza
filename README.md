# Lozza

A UCI compliant Javascript chess engine. Lozza is a traditional mailbox engine with PVS search. It's easy to embed Lozza into your web project or use her offline in client user interfaces like Arena and Winboard. A sister project also allows Lozza to be played online. There is nothing new in Lozza - it's just an ongoing and fun coding exercise. 

In 1.x versions the piece values and PSTs were from Fruit 2.1. In later versions they have been tuned using the Texel author's method into values unique to Lozza. Similarly the evaluation function initially used elements from Fruit 2.1, but is gradaully moving towards somehting more unique and to Lozza. The search algorithms etc are from the Chess Programming Wiki, which was invaluable - https://www.chessprogramming.org/Main_Page. 

## Goals

v2.00 and higher: to escape Lozza's Fruit roots and become totally unique and possible quirky; which may well mean not as strong as previous versions.

## Why Javascript?

Mostly I was curious if a Javascript engine could compete with more traditional engines in the engine rating lists like CCRL, as at the time there were none listed (yes). There were Javascript engines with their own user interfaces on the internet (like Gary Linscott's Garbochess), but none that complied with the UCI protocol. The Javascript development cycle is very quick because there is no build process; you can even make changes while it's playing to see what happens. Javascript also makes the engine platform-independent - running online in any browser and offline on any OS that supports node.js (pretty much everything). Not least, Javascript is a lot of fun! The only downside is a hit in performance compared with traditionally compiled languages like C etc.

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

A sister project - https://github.com/op12no2/lozza-ui - has some example user interfaces for playing and analysing with Lozza, which you can try out here - https://op12no2.github.io/lozza-ui.

## Playing Lozza offline in Arena, Winboard, Cutechess etc

Lozza can be used in chess UIs like WinBoard, Arena and CuteChess by using [node.js](https://nodejs.org) as the engine executable and lozza.js as a parameter
to it. Full paths for both are recommended. node.js and Lozza do not need to be in the same folder. If the UI does not support engine parameters, create a batch file (say lozza.bat) containing somehting like:-

```
"c:\program files\nodejs\node.exe" c:\path\to\lozza.js 
```

Then use lozza.bat as the engine target; similarly for Linux/Mac.  

Alternatively you can package node and Lozza into a Windows/Linux/Mac executable using node.js extensions; for example - https://dev.to/jochemstoel/bundle-your-node-app-to-a-single-executable-for-windows-linux-and-osx-2c89.

## Online testing

Perft - https://op12no2.github.io/lozza-ui/perft.htm - various Perft tests - the final one takes 25 seconds on my machine doing about 5M nps.

## Offline testing

The tuning and testing directories of the repo contain some node.js Javascript utilities. They should be pretty easy to adapt to other Javascript engines. Run using node.js, for example:-

```
node texeltune.js
```

## Notes

lozza.js is folded using {{{ and }}} (emacs convention) and most easily read using an editor with a folding capability.

To enter a javascript chess engine like Lozza into Hans G. Muller's monthly chess tournaments use somehting like:-

```
winboard -zp -ics -icshost winboard.nl -icshelper timeseal -fcp "node.exe lozza.js" -fd . -autoKibitz -fUCI -keepAlive 4 -firstXBook
```

