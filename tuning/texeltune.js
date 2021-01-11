//
// https://www.chessprogramming.org/Texel%27s_Tuning_Method
//

epds     = [];
fs       = lozza.uci.nodefs;
uci      = lozza.uci;
board    = lozza.board;

//{{{  sigmoid
//
// map eval to a (0-1) sigmoid anchored at 400. there is nothing magic about 400 it's just
// knowledge of being 400 ahead is  a likely win.
//

function sigmoid (s) {
 var p = s / 400.0;
 return 1.0 / (1.0 + Math.pow(10.0,-p));
}

//for (var e=-900;e<=900;e+=100)
  //console.log('sigmoid',e,sigmoid(e,1.0));
//process.exit();

//}}}
//{{{  _map

function _map (sq) {
  var m = (143-sq)/12|0;
  return 12*m + sq%12;
}

//}}}
//{{{  calcErr
//
// get the mean square error for all positions.
// sequential calls to eval must not affect anything.
// we explicitly check that later on.
//

var counter = 0;

function calcErr (log) {

  counter++;

  process.stdout.write(counter+'\r');

  var err = 0;
  var num = epds2.length;

  for (var i=0; i < num; i++) {

    var epd = epds2[i];

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
    var s = sigmoid(board.evaluate(board.turn));

    if (isNaN(p) || isNaN(s) || s > 1.0 || p > 1.0 || s < 0.0 || p < 0.0)
      console.log('eek',p,s);

    err += (p-s)*(p-s);
  }

  //console.log(log,err / num);

  return err / num;
}

//}}}

var data = fs.readFileSync('epds.epd', 'utf8');

//{{{  get the epds
//
// http://rebel13.nl/download/data.html
// ccrl-40/2-elo-3400 1M positions from CCRL top engines.
// 2r5/2P2pk1/3b2pp/Q2pq3/4p3/p3P1Pb/2RN1P1P/4R1K1 w - - 8 41; d2b3 - pgn=0.5 len=173
// 0                                               1 2 3 4  5  6    7 8   9   10  11
//

var lines = data.split('\n');

for (var i=0; i < lines.length; i++) {
//for (var i=0; i < 1000; i++) {

  var line  = lines[i];

  line = line.replace(/(\r\n|\n|\r)/gm,'');
  line = line.replace(/;/g,'');
  line = line.replace(/=/g,' ');
  line = line.trim();

  if (!line)
    continue;

  var parts = line.split(' ');

  var sfeval = parseInt(parts[10]);

  epds.push({eval:   0,
             board:  parts[0],
             turn:   parts[1],
             rights: parts[2],
             ep:     parts[3],
             fmvn:   parseInt(parts[4]),
             hmvc:   parseInt(parts[5]),
             prob:   parseFloat(parts[9])});
}

lines = [];

console.log(epds.length,'candidates');

//}}}

lozza.newGameInit();

//{{{  remove positions where e != q
//
// Remove positions where q != e so that we can use e in the testing.
//

var epds2 = [];

for (var i=0; i < epds.length; i++) {

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

  var e = board.evaluate(board.turn);
  var q = lozza.qSearch(lozza.rootNode,0,board.turn,-INFINITY,INFINITY);

  if (isNaN(e) || isNaN(q)) {
    console.log('NaN');
    process.exit();
  }

  if (e == q) {
    epd.eval = e;
    epds2.push(epd);
  }
}

epds = [];

console.log(epds2.length,'usable (e=q)');

//}}}
//{{{  count win, lose, draw
//
// just for interest.
//

var wins = 0;
var loss = 0;
var draw = 0;

for (var i=0; i < epds2.length; i++) {

  var epd = epds2[i];

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

console.log(wins,'wins');
console.log(loss,'losses');
console.log(draw,'draws');
console.log(epds2.length - wins - draw - loss,'error check (should be 0)');

//}}}

lozza.newGameInit();

var wpsts = [WS_PST,WE_PST];
var bpsts = [BS_PST,BE_PST];

//{{{  tune
//
// algorithm that will converge, probably, but not quickly.
// output the results after each iteration so we can use results so far.
// also allowing us to resume later.
//

var t1 = Date.now();
var bestErr = calcErr('starting error');
var t2 = Date.now();
console.log('full param test',(t2-t1)/1000/60,'mins');

if (calcErr('test stable') != bestErr) {
  console.log('unstable');
  process.exit();
}
else
  console.log('eval is stable');

console.log(bestErr,'starting error');

var iters   = 1;
var thisErr = 0;
var better  = true;
var changes = 0;

counter = 0;

while (better) {

  var t1 = Date.now();

  better = false;

  //{{{  pieces
  
  for (var p = 2; p<=5; p++) {
    VALUE_VECTOR[p] = VALUE_VECTOR[p] + 1;
    thisErr = calcErr('pieceup');
    if (thisErr < bestErr) {
      changes++;
      bestErr = thisErr;
      better  = true;
    }
    else {
      VALUE_VECTOR[p] = VALUE_VECTOR[p] - 2;
      thisErr = calcErr('piecedn');
      if (thisErr < bestErr) {
        changes++;
        bestErr = thisErr;
        better = true;
      }
      else {
        VALUE_VECTOR[p] = VALUE_VECTOR[p] + 1;
      }
    }
  }
  
  //}}}
  //{{{  psts
  
  for (var se = 0; se<=1; se++) {
  
    var wpstse = wpsts[se];
    var bpstse = bpsts[se];
  
    for (var p = 1; p<=6; p++) {
  
      var wpst = wpstse[p];
      var bpst = bpstse[p];
  
      for (var sq = 0; sq<64; sq++) {
  
        var wi = B88[sq];
        var bi = _map(wi);
  
        if (wpst[wi] != bpst[bi]) {
          console.log('psts outta sync',se,p,sq,wpst[wi],bpst[bi]);
          process.exit();
        }
  
        wpst[wi] = wpst[wi] + 1;
        bpst[bi] = bpst[bi] + 1;
        thisErr = calcErr('pstup');
        if (thisErr < bestErr) {
          changes++;
          bestErr = thisErr;
          better  = true;
        }
        else {
          wpst[wi] = wpst[wi] - 2;
          bpst[bi] = bpst[bi] - 2;
          thisErr = calcErr('pstdn');
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
  // power our or accidental close etc.
  //
  
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
  
  fs.writeFileSync('texeltune.txt',out);
  
  //}}}

  var t2 = Date.now();

  console.log('tries',counter,'changes',changes,'min err',bestErr,'iter time',(t2-t1)/1000/60,'mins');

  counter = 0;
  changes = 0;
}

bestErr = calcErr('root end');
console.log(bestErr,'final error');

//}}}

process.exit();

