//
// 'texel' tune eval.
//

//{{{  lozza globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

//}}}
//{{{  functions

//{{{  sigmoid

function sigmoid (qs) {
 var p = qs / 400.0;
 return 1.0 / (1.0 + Math.pow(10.0,-p));
}

//}}}
//{{{  calcErr

var tries = 0; // num calls to calcErr() in a iter

function calcErr () {

  tries++;

  process.stdout.write(tries+'\r');

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
    var q = board.evaluate(board.turn);
    //var q = lozza.qSearch(lozza.rootNode,0,board.turn,-INFINITY,INFINITY);
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

console.log('hello world! wait...');

//{{{  get the epds
//
// http://rebel13.nl/download/data.html
// ccrl-40/2-elo-3400 - 1M positions from CCRL top engines.
// 2r5/2P2pk1/3b2pp/Q2pq3/4p3/p3P1Pb/2RN1P1P/4R1K1 w - - 8 41; d2b3 - pgn=0.5 len=173
// 0                                               1 2 3 4  5  6    7 8   9   10  11
//

var data  = fs.readFileSync('epds.epd', 'utf8');
var lines = data.split('\n');
var epds  = [];

for (var i=0; i < lines.length; i++) {

  if (i % 100000 == 0)
    process.stdout.write(i+'\r');

  var line = lines[i];

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

lines    = []; // release

console.log('positions =',epds.length);

//}}}
//{{{  remove positions where e != q
//
// because q is too slow.
//

lozza.newGameInit();

var epds2 = [];

for (var i=0; i < epds.length; i++) {

  if (i % 100000 == 0)
    process.stdout.write(i+'\r');

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

epds = []; // release

console.log('usable (e==q) =',epds2.length);

//}}}
//{{{  count win, lose, draw

var wins = 0;
var loss = 0;
var draw = 0;

for (var i=0; i < epds2.length; i++) {

  if (i % 100000 == 0)
    process.stdout.write(i+'\r');

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

console.log('wins =',wins);
console.log('losses =',loss);
console.log('draws =',draw);
console.log('error check =',epds2.length - wins - draw - loss,'(should be 0)');

//}}}
//{{{  do the grunt

lozza.newGameInit();

var wpsts = [WS_PST,WE_PST];
var bpsts = [BS_PST,BE_PST];

//{{{  check eval

var t1 = Date.now();

var bestErr = calcErr();

var t2 = Date.now();
var et = (t2-t1)/1000;
var tpi = 2*(2*64*6 + 46 + 4 - 32);
console.log('try time =',et,'secs (one pass of all positions)');
console.log('max tries per iter =',tpi);
console.log('max iter time =',et*tpi/60/60,'hours (one pass of all params for all positions)');

if (calcErr() != bestErr) {
  console.log('eval is unstable');
  process.exit();
}
else
  console.log('eval is stable'); // probably

//}}}

console.log('starting error =',bestErr);
console.log('**************');

var iter    = 1;      // num full iters (trying all params)
var thisErr = 0;
var better  = true;
var changes = 0;      // num changes made in this iter

tries = 0;            // num calls to calcErr() made in this iter

while (better) {

  var t1 = Date.now();

  better = false;

  //{{{  pieces
  
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
  //{{{  eval
  
  for (var p=0; p<EV.length; p++) {
    EV[p] = EV[p] + 1;
    thisErr = calcErr();
    if (thisErr < bestErr) {
      changes++;
      bestErr = thisErr;
      better  = true;
    }
    else {
      EV[p] = EV[p] - 2;  // -1
      thisErr = calcErr();
      if (thisErr < bestErr) {
        changes++;
        bestErr = thisErr;
        better = true;
      }
      else {
        EV[p] = EV[p] + 1;  // back to 0 - leave this one where it is this time.
      }
    }
  }
  
  //}}}
  //{{{  psts
  
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
        var bi = wbmap(wi);  // map to black index
  
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
  
  var d   = new Date();
  var out = '';
  
  out = out + 'var VALUE_VECTOR = [' + VALUE_VECTOR.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var EV = [' + EV.toString() + '];';
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
  
  fs.writeFileSync('texeltune.txt',out);
  
  //}}}

  var t2 = Date.now();

  console.log('iter =',iter,'tries =',tries,'changes =',changes,'min err =',bestErr,'iter time =',(t2-t1)/1000/60,'mins');

  tries   = 0;
  changes = 0;
  iter++;
}

console.log('**************');
console.log('final error =',bestErr);

//}}}

process.exit();

