
//
// 2.1
// copy lozza.js above here.
//
// REMEMBER TO:-
//
//   1. TURN OFF PAWN TT
//   2. COPY EV ASSIGNS TO EVALUATE.
//

//{{{  lozza globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

//}}}
//{{{  functions

var bestErr = 0;
var thisErr = 0;
var tries   = 0;  // num calls to calcErr() in a iter
var changes = 0;
var better  = false;
var changes = 0;

//{{{  wbmap

function wbmap (sq) {
  var m = (143-sq)/12|0;
  return 12*m + sq%12;
}

//}}}
//{{{  sigmoid

var kkk = 1.603; //for quiet-labeled.epd

console.log('k =',kkk);

function sigmoid (qs) {
 var pp = (kkk*qs) / 400.0;
 return 1.0 / (1.0 + Math.pow(10.0,-pp));
}

//}}}
//{{{  calcErr

function calcErr () {

  for (var i=0; i < 144; i++) {
    BPAWN_PSTS[wbmap(i)]   = WPAWN_PSTS[i];
    BPAWN_PSTE[wbmap(i)]   = WPAWN_PSTE[i];
    BKNIGHT_PSTS[wbmap(i)] = WKNIGHT_PSTS[i];
    BKNIGHT_PSTE[wbmap(i)] = WKNIGHT_PSTE[i];
    BBISHOP_PSTS[wbmap(i)] = WBISHOP_PSTS[i];
    BBISHOP_PSTE[wbmap(i)] = WBISHOP_PSTE[i];
    BROOK_PSTS[wbmap(i)]   = WROOK_PSTS[i];
    BROOK_PSTE[wbmap(i)]   = WROOK_PSTE[i];
    BQUEEN_PSTS[wbmap(i)]  = WQUEEN_PSTS[i];
    BQUEEN_PSTE[wbmap(i)]  = WQUEEN_PSTE[i];
    BKING_PSTS[wbmap(i)]   = WKING_PSTS[i];
    BKING_PSTE[wbmap(i)]   = WKING_PSTE[i];
    BOUTPOST[wbmap(i)]     = WOUTPOST[i];
  }

  tries++;

  //process.stdout.write(tries+'\r');

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
    var e = board.evaluate(board.turn);

    if (board.turn == BLACK)
      e = -e;  // undo negamax.

    var s = sigmoid(e);

    if (isNaN(p) || isNaN(s) || s > 1.0 || p > 1.0 || s < 0.0 || p < 0.0) {
      console.log('eek',p,s);
      process.exit();
   }

    err += (p-s)*(p-s);
  }

  return err / num;
}

//}}}
//{{{  clearpst

function clearpst (pst) {
  for (var i=0; i<144; i++)
    pst[i]=0|0;
}

//}}}
//{{{  getprob

function getprob (r) {
  if (r == '"1/2-1/2";')
    return 0.5;
  else if (r == '"1-0";')
    return 1.0;
  else if (r == '"0-1";')
    return 0.0;
  else
    console.log('unknown result',r);
}

//}}}
//{{{  logpst

function logpst (p,s) {

  var o = 'var ';

  o = o + s + ' = [';

  for (var i=0; i < 144; i++) {
    if ((i % 12) == 0)
      o = o + '\r\n  ';
    o = o + p[i];
    if (i < 143)
      o = o + ', ';
  }

  o = o + '\r\n];\r\n\r\n';

  return o;
}

//}}}
//{{{  compare

function compare(a, b) {
  if (a.s < b.s) {
    return -1;
  }
  if (a.s > b.s) {
    return 1;
  }
  return 0;
}

//}}}
//{{{  saveparams

function saveparams () {

  var d   = new Date();
  var out = '';

  out = out + 'var VALUE_VECTOR = [' + VALUE_VECTOR.toString() + '];';
  out = out + '\r\n\r\n';

  out += logpst(WPAWN_PSTS,  'WPAWN_PSTS');
  out += logpst(WKNIGHT_PSTS,'WKNIGHT_PSTS');
  out += logpst(WBISHOP_PSTS,'WBISHOP_PSTS');
  out += logpst(WROOK_PSTS,  'WROOK_PSTS');
  out += logpst(WQUEEN_PSTS, 'WQUEEN_PSTS');
  out += logpst(WKING_PSTS,  'WKING_PSTS');

  out += logpst(WPAWN_PSTE,  'WPAWN_PSTE');
  out += logpst(WKNIGHT_PSTE,'WKNIGHT_PSTE');
  out += logpst(WBISHOP_PSTE,'WBISHOP_PSTE');
  out += logpst(WROOK_PSTE,  'WROOK_PSTE');
  out += logpst(WQUEEN_PSTE, 'WQUEEN_PSTE');
  out += logpst(WKING_PSTE,  'WKING_PSTE');

  out += logpst(BPAWN_PSTS,  'BPAWN_PSTS');
  out += logpst(BKNIGHT_PSTS,'BKNIGHT_PSTS');
  out += logpst(BBISHOP_PSTS,'BBISHOP_PSTS');
  out += logpst(BROOK_PSTS,  'BROOK_PSTS');
  out += logpst(BQUEEN_PSTS, 'BQUEEN_PSTS');
  out += logpst(BKING_PSTS,  'BKING_PSTS');

  out += logpst(BPAWN_PSTE,  'BPAWN_PSTE');
  out += logpst(BKNIGHT_PSTE,'BKNIGHT_PSTE');
  out += logpst(BBISHOP_PSTE,'BBISHOP_PSTE');
  out += logpst(BROOK_PSTE,  'BROOK_PSTE');
  out += logpst(BQUEEN_PSTE, 'BQUEEN_PSTE');
  out += logpst(BKING_PSTE,  'BKING_PSTE');

  out += logpst(WOUTPOST,'WOUTPOST');
  out += logpst(BOUTPOST,'BOUTPOST');

  out = out + 'var EV = [' + EV.toString() + '];';
  out = out + '\r\n\r\n';

  out = out + 'var WSHELTER = [' + WSHELTER.toString() + '];';
  out = out + '\r\n\r\n';

  out = out + 'var WSTORM = [' + WSTORM.toString() + '];';
  out = out + '\r\n\r\n';

  out = out + 'var imbalN_S = [' + imbalN_S.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var imbalN_E = [' + imbalN_E.toString() + '];';
  out = out + '\r\n\r\n';

  out = out + 'var imbalB_S = [' + imbalB_S.toString() + '];';
  out = out + '\r\n\r\n';
  out = out + 'var imbalB_E = [' + imbalB_E.toString() + '];';
  out = out + '\r\n\r\n';

  out = out + '// K='+kkk;
  out = out + '\r\n';
  out = out + '// bestErr='+bestErr;
  out = out + '\r\n';
  out = out + '// last update '+d;
  out = out + '\r\n\r\n';

  fs.writeFileSync('texeltune.txt',out);
}

//}}}

//}}}

console.log('hello world! wait...');

//{{{  check sigmoid

//for (var i=-600;i<=600;i+=100) {
  //console.log(i,sigmoid(i));
//}

//}}}
//{{{  get the epds
//
// quiet-labeled.epd
// rnb1kbnr/pp1pppp1/7p/2q5/5P2/N1P1P3/P2P2PP/R1BQKBNR w KQkq - c9 "1/2-1/2"
// 0                                                   1 2    3 4  5

var data  = fs.readFileSync('../testing/quiet-labeled.epd', 'utf8');
var lines = data.split('\n');
var epds  = [];

data = '';  //release.

for (var i=0; i < lines.length; i++) {

  if (i % 100000 == 0)
    process.stdout.write(i+'\r');

  var line = lines[i];

  line = line.replace(/(\r\n|\n|\r)/gm,'');
  line = line.trim();

  if (!line)
    continue;

  var parts = line.split(' ');

  epds.push({eval:   0,
             board:  parts[0],
             turn:   parts[1],
             rights: parts[2],
             ep:     parts[3],
             fmvn:   0,
             hmvc:   0,
             prob:   getprob(parts[5])});
}

lines = []; // release

console.log('positions =',epds.length);

//}}}
//{{{  count win, lose, draw
//
// Just to make sure the file has been parsed OK.
//

var wins = 0;
var loss = 0;
var draw = 0;

for (var i=0; i < epds.length; i++) {

  if (i % 100000 == 0)
    process.stdout.write(i+'\r');

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

console.log('wins =',wins,'losses =',loss,'draws =',draw);
console.log('error check =',epds.length - wins - draw - loss,'(should be 0)');

//}}}
//{{{  find k
/*
var min = 100.0;

for (var x=1.59;x<1.62;x+=0.001) {
  kkk = x;
  var err = calcErr();
  if (err <  min) {
    console.log(kkk,err);
    min = err;
  }
  else
    console.log('found min');
}

process.exit();
*/
//}}}
//{{{  do the grunt

var SKIP = 99999999;

var his = [];

his[-1]   = '-';
his[0]    = '0';
his[1]    = '+';
his[SKIP] = '.';

lozza.newGameInit();

//{{{  check eval

var t1 = Date.now();

bestErr = calcErr();

var t2 = Date.now();
var et = (t2-t1)/1000;
console.log('try time =',et,'secs (one pass of all positions)');

if (calcErr() != bestErr) {
  console.log('eval is unstable');
  process.exit();
}
else
  console.log('eval is stable'); // probably

console.log('eval vector size =',EV.length);

//}}}

console.log('starting error =',bestErr);
console.log('**************');

//{{{  create params

var params = [];

function addp (id,a,i) {
  params.push({his: '', id: id+i, s: 0, a: a, i: i, inc: 0, oldinc: 0});
}

for (var i=KNIGHT; i<=QUEEN; i++) {
  addp('piece',VALUE_VECTOR,i);
}

for (var i=0; i < B88.length; i++) {
  addp('ppsts',WPAWN_PSTS,  B88[i]);
  addp('ppste',WPAWN_PSTE,  B88[i]);
  addp('npsts',WKNIGHT_PSTS,B88[i]);
  addp('npste',WKNIGHT_PSTE,B88[i]);
  addp('bpsts',WBISHOP_PSTS,B88[i]);
  addp('bpste',WBISHOP_PSTE,B88[i]);
  addp('rpsts',WROOK_PSTS,  B88[i]);
  addp('rpste',WROOK_PSTE,  B88[i]);
  addp('qpsts',WQUEEN_PSTS, B88[i]);
  addp('qpste',WQUEEN_PSTE, B88[i]);
  addp('kpsts',WKING_PSTS,  B88[i]);
  addp('kpste',WKING_PSTE,  B88[i]);
}

var nosq =[51,52,53,54,55,56,63,64,65,66,67,68,75,76,77,78,79,80]; //knight outpost squares

for (var i=0; i < nosq.length; i++) {
  addp('outpost',WOUTPOST,nosq[i]);
}

for (var i=0; i < imbalN_S.length; i++) {
  addp('imbalns',imbalN_S,i);
  addp('imbalne',imbalN_E,i);
  addp('imbalbs',imbalB_S,i);
  addp('imbalbe',imbalB_E,i);
}

for (var i=0; i < EV.length; i++) {
  addp('ev',EV,i);
}

for (var i=3; i <= 9; i++) {
  addp('shelter',WSHELTER,i);
  addp('storm',  WSTORM,i);
}

console.log('number of params =', params.length);

//}}}
//{{{  tune params

saveparams();

iter     = 1;          // num full iters (trying all params)
thisErr  = 0;
better   = true;
changes  = 0;          // num changes made in this iter
tries    = 0;          // num calls to calcErr() made in this iter

while (better) {

  var t1 = Date.now();

  better = false;

  //{{{  try each param
  
  for (var i=0; i < params.length; i++)
    params[i].s = Math.random() * params.length;
  
  params.sort(compare);
  
  for (var i=0; i < params.length; i++) {
  
    var p = params[i];
  
    if (p.inc == SKIP) {
      //{{{  0 SKIP
      
      p.his += his[p.inc];
      p.inc = 0;
      console.log(0,p.his,p.id);
      
      //}}}
    }
  
    if (p.inc) {
      //{{{  1 +/-
      
      p.a[p.i] = p.a[p.i] + p.inc;
      
      thisErr = calcErr();
      
      if (thisErr < bestErr) {
        changes++;
        bestErr = thisErr;
        better = true;
        p.his += his[p.inc];
        console.log(1,p.his,p.id);
        continue
      }
      
      p.a[p.i] = p.a[p.i] - p.inc;
      
      //}}}
      //{{{  2 0
      
      p.oldinc = p.inc;
      p.inc = 0;
      p.his += his[p.inc];
      console.log(2,p.his,p.id);
      continue
      
      //}}}
    }
  
    // p.inc is 0 - p/oldinc may or may not have 1/-1 in it
  
    //{{{  3 +/-
    
    p.inc = p.oldinc | 1;
    
    p.a[p.i] = p.a[p.i] + p.inc;
    
    thisErr = calcErr();
    
    if (thisErr < bestErr) {
      changes++;
      bestErr = thisErr;
      better = true;
      p.his += his[p.inc];
      console.log(3,p.his,p.id);
      continue
    }
    
    p.a[p.i] = p.a[p.i] - p.inc;
    
    //}}}
    //{{{  4 +/-
    
    p.inc = -p.inc;
    
    p.a[p.i] = p.a[p.i] + p.inc;
    
    thisErr = calcErr();
    
    if (thisErr < bestErr) {
      changes++;
      bestErr = thisErr;
      better = true;
      p.his += his[p.inc];
      console.log(4,p.his,p.id);
      continue
    }
    
    p.a[p.i] = p.a[p.i] - p.inc;
    
    //}}}
    //{{{  5 (still) 0
    
    p.inc = 0;
    p.his += his[p.inc];
    console.log(5,p.his,p.id);
    
    p.inc = SKIP;
    
    //}}}
  }
  
  //}}}

  saveparams();

  var t2 = Date.now();

  console.log('iter =',iter,'tries =',tries,'changes =',changes,'min err =',bestErr,'iter time =',(t2-t1)/1000/60,'mins');

  tries   = 0;
  changes = 0;
  iter++;
}

//}}}

console.log('**************');
console.log('final error =',bestErr);

//}}}

process.exit();

