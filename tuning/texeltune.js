
//{{{  usage
//
// https://www.chessprogramming.org/Texel%27s_Tuning_Method
//
// 1. include lozza.js code above.
// 2. disable history and tt jic although i think qs is safe.
// 3. run using: node texeltune.js
//    the counter shown is the param index being tested during this iter.
// 4. after at least 1 iter paste results from texeltune.txt into lozza.js
// 5. test results.
// 6. time passes.
// 7. go to 1. making sure starting error is less than previous
//    final error - if not and no changes to eval, something is broken!
//
// config.js can contain optional overrides as an object:-
//
// module.exports = {
//   numLines: 1000,      // test the first 1000 lines only
//   outFile: 'test.txt', // change results filename
//   iters: 10            // max iters of the main drag
// };
//

//}}}
//{{{  history

var TUNEBUILD = 2;

//
// 2 Add config.js capability.
// 1 Born.
//

console.log('build =',TUNEBUILD);

//}}}

//{{{  config

var config = require('./config.js');

if (config.outFile)
  var outFile = config.outFile;
else
  var outFile = 'texeltune.txt';

console.log('results file =',outFile);

if (config.iters)
  var maxIters = config.iters;
else
  var maxIters = 10000000;  // hell freeze over

//}}}
//{{{  lozza globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

//}}}
//{{{  functions

//{{{  sigmoid
//
// map qs to a (0-1) sigmoid anchored at 400. there is nothing magic about 400 it's just
// knowledge of being 400 ahead is a likely win. we could incorporate the full move counter
// and game length.
//

function sigmoid (qs) {
 var p = qs / 400.0;
 return 1.0 / (1.0 + Math.pow(10.0,-p));
}

//}}}
//{{{  _map
//
// get black pst index from white pst index.
//

function _map (sq) {
  var m = (143-sq)/12|0;
  return 12*m + sq%12;
}

//}}}
//{{{  calcErr
//
// get the mean square error for all positions.
// sequential calls to qs must not affect anything.
// we explicitly check that later on.
//

var tries = 0; // num calls to calcErr() in a iter

function calcErr () {

  tries++;

  process.stdout.write(tries+'\r');

  var err = 0;
  var num = epds.length;

  for (var i=0; i < num; i++) {

    var epd = epds[i];

    uci.spec.board    = epd.board;
    uci.spec.turn     = epd.turn;
    uci.spec.rights   = epd.rights;
    uci.spec.ep       = epd.ep;
    uci.spec.fmc      = epd.fmvn;
    uci.spec.hmc      = epd.hmvc;
    uci.spec.id       = 'id' + i;
    uci.spec.moves    = [];

    lozza.position();

    var p = epd.prob;
    var q = lozza.qSearch(lozza.rootNode,0,board.turn,-INFINITY,INFINITY);
    var s = sigmoid(q);

    if (isNaN(p) || isNaN(s) || s > 1.0 || p > 1.0 || s < 0.0 || p < 0.0) {
      console.log('eek',p,s);
      process.exit();
   }

    err += (p-s)*(p-s);
  }

  return err / num;
}

//}}}

//}}}

//{{{  get the epds
//
// http://rebel13.nl/download/data.html
// ccrl-40/2-elo-3400 - 1M positions from CCRL top engines.
// 2r5/2P2pk1/3b2pp/Q2pq3/4p3/p3P1Pb/2RN1P1P/4R1K1 w - - 8 41; d2b3 - pgn=0.5 len=173
// 0                                               1 2 3 4  5  6    7 8   9   10  11
//

var data  = fs.readFileSync('epds.epd', 'utf8');
var lines = data.split('\n');

if (config.numLines) {
  var numLines = config.numLines;
  console.log('testing with num positions =',numLines);
}
else
  var numLines = lines.length;

var epds = [];

for (var i=0; i < numLines; i++) {

  var line  = lines[i];

  // hack the epd string into a series of space separated elements indexed as above.

  line = line.replace(/(\r\n|\n|\r)/gm,'');
  line = line.replace(/;/g,'');
  line = line.replace(/=/g,' ');
  line = line.trim();

  if (!line)
    continue;

  var parts = line.split(' ');

  epds.push({eval:   0,
             board:  parts[0],
             turn:   parts[1],
             rights: parts[2],
             ep:     parts[3],
             fmvn:   parseInt(parts[4]),
             hmvc:   parseInt(parts[5]),
             prob:   parseFloat(parts[9])});
}

lines = []; // release

console.log('positions =',epds.length);

//}}}
//{{{  count win, lose, draw
//
// just for interest.
//

var wins = 0;
var loss = 0;
var draw = 0;

for (var i=0; i < numLines; i++) {

  var epd = epds[i];

  if (epd.prob == 1.0)
    wins++;

  else if (epd.prob == 0.0)
    loss++;

  else if (epd.prob == 0.5)
    draw++;
  else {
    console.log('not a prob',epd.prob);
    process.exit();
  }
}

console.log('wins =',wins);
console.log('losses =',loss);
console.log('draws =',draw);
console.log('error check =',numLines - wins - draw - loss,'(should be 0)');

//}}}
//{{{  do the grunt
//
// this algorithm will probably very very slowly converge, but on the up-side
// it will not chase headless chickens as we experiment in concert and minimally.
//
// the results are output after each iteration so we can use results so far.
// also allows us to resume later after pasting the results back into the engine.
// it should produce improvement even after a single iteration on untuned data.
// it's a literal implementation of pseudo-code here:
// https://www.chessprogramming.org/Texel%27s_Tuning_Method
// there is lots of scope for optimisation.
//

lozza.newGameInit();

var wpsts = [WS_PST,WE_PST];
var bpsts = [BS_PST,BE_PST];

var t1 = Date.now();
var bestErr = calcErr();
var t2 = Date.now();
console.log('err calc time =',(t2-t1)/1000/60,'mins');

if (calcErr() != bestErr) {
  console.log('qs is unstable');
  process.exit();
}
else
  console.log('qs is stable'); // probably

console.log('starting error =',bestErr);
console.log('**************');

var iter    = 1;      // num full iters (trying all params)
var thisErr = 0;
var better  = true;
var changes = 0;      // num changes made in this iter

tries = 0;            // num calls to calcErr() made in this iter

while (better && iter < maxIters+1) {

  var t1 = Date.now();

  better = false;

  //{{{  pieces
  //
  // leave p=100 to ground everything.
  // k value is fine.
  //
  
  for (var p=KNIGHT; p<=QUEEN; p++) { // n,b,r,q
    VALUE_VECTOR[p] = VALUE_VECTOR[p] + 1;
    thisErr = calcErr();
    if (thisErr < bestErr) {
      changes++;
      bestErr = thisErr;
      better  = true;
    }
    else {
      VALUE_VECTOR[p] = VALUE_VECTOR[p] - 2;  // -1
      thisErr = calcErr();
      if (thisErr < bestErr) {
        changes++;
        bestErr = thisErr;
        better = true;
      }
      else {
        VALUE_VECTOR[p] = VALUE_VECTOR[p] + 1;  // back to 0 - leave this one where it is this time.
      }
    }
  }
  
  //}}}
  //{{{  psts
  //
  // i wonder what would happen with independent black and white PSTs?
  // some of the 64 per pst values could be grouped and done at the
  // same time i would think in cases of likely symmetry.
  //
  
  for (var se=0; se<=1; se++) {  // mid/end game
  
    var wpstse = wpsts[se];  // list of white mid/end game psts
    var bpstse = bpsts[se];
  
    for (var p=PAWN; p<=KING; p++) {  // p,n,b,r,q,k
  
      var wpst = wpstse[p];  // actual mid/end game pst
      var bpst = bpstse[p];
  
      if (p > PAWN) {
        var losq = 0;
        var hisq = 64;
      }
      else {
        var losq = 8;
        var hisq = 56;
      }
  
      for (var sq=losq; sq<hisq; sq++) {  // 64 pst values
  
        var wi = B88[sq];   // white pst index
        var bi = _map(wi);  // map to black index
  
        if (wpst[wi] != bpst[bi]) {
          console.log('psts outta sync',se,p,sq,wpst[wi],bpst[bi]);  // jic.
          process.exit();
        }
  
        wpst[wi] = wpst[wi] + 1;
        bpst[bi] = bpst[bi] + 1;
        thisErr = calcErr();
        if (thisErr < bestErr) {
          changes++;
          bestErr = thisErr;
          better  = true;
        }
        else {
          wpst[wi] = wpst[wi] - 2;
          bpst[bi] = bpst[bi] - 2;
          thisErr = calcErr();
          if (thisErr < bestErr) {
            changes++;
            bestErr = thisErr;
            better = true;
          }
          else {
            wpst[wi] = wpst[wi] + 1;
            bpst[bi] = bpst[bi] + 1;
          }
        }
      }
    }
  }
  
  //}}}

  //{{{  save to file
  //
  // do this after each full iteration so we can resume after a
  // power out or accidental close etc. include bestErr so we can
  // check it on restarting.
  //
  
  var d   = new Date();
  var out = '';
  
  out = out + 'var VALUE_VECTOR = [' + VALUE_VECTOR.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WPAWN_PSTS = [' + WPAWN_PSTS.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WKNIGHT_PSTS = [' + WKNIGHT_PSTS.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WBISHOP_PSTS = [' + WBISHOP_PSTS.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WROOK_PSTS = [' + WROOK_PSTS.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WQUEEN_PSTS = [' + WQUEEN_PSTS.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WKING_PSTS = [' + WKING_PSTS.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WPAWN_PSTE = [' + WPAWN_PSTE.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WKNIGHT_PSTE = [' + WKNIGHT_PSTE.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WBISHOP_PSTE = [' + WBISHOP_PSTE.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WROOK_PSTE = [' + WROOK_PSTE.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WQUEEN_PSTE = [' + WQUEEN_PSTE.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var WKING_PSTE = [' + WKING_PSTE.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + '// bestErr='+bestErr;
  out = out + '\r\n\r\n';
  out = out + '// last update '+d;
  out = out + '\r\n\r\n';
  
  fs.writeFileSync(outFile,out);
  
  //}}}

  var t2 = Date.now();

  console.log('iter =',iter,'tries =',tries,'changes =',changes,'min err =',bestErr,'iter time =',(t2-t1)/1000/60,'mins');

  tries   = 0;
  changes = 0;
  iter++;
}

console.log('**************');
console.log('final error =',bestErr);
console.log('results are in ',outFile);

//}}}

process.exit();

