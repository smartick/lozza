//
// Copy lozza.js above here.
//
// 1. Set USEPAWNHASH to 0.
// 2. Copy EV assignments to evaluate().
//

//{{{  globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

var epds   = [];
var params = [];

var gK            = 3.464;
var gEpdFile      = 'data/quiet-labeled.epd';
var gProbIndex    = 5;

var gOutFile      = 'tuner.txt';
var gMaxPositions = 1000000000;

//}}}
//{{{  functions

//{{{  updateBlack

function updateBlack () {

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
}

//}}}
//{{{  findK

function findK () {

  var min  = INFINITY;
  var step = 1.0;
  var x    = 1.0;
  var err  = 0;
  var dp   = 4;

  while (dp) {
    gK = x;
    err = calcErr();
    if (err <  min) {
      min = err;
      x += step;
    }
    else {
      console.log(gK-step,err,step);
      dp--;
      step = -step / 10.0;
      x += step;
      min = INFINITY;
    }
  }
}

//}}}
//{{{  addp

function addp (a,i) {
  params.push({a: a, i: i, inc: 1});
}

//}}}
//{{{  myround

function myround(x) {
  return Math.sign(x) * Math.round(Math.abs(x));
}

//}}}
//{{{  wbmap

function wbmap (sq) {
  var m = (143-sq)/12|0;
  return 12*m + sq%12;
}

//}}}
//{{{  sigmoid

function sigmoid (x) {
  return 1.0 / (1.0 + Math.exp(-gK*x/400.0));
}

//}}}
//{{{  calcErr

function calcErr () {

  updateBlack();

  var err = 0;
  var num = epds.length;

  for (var i=0; i < num; i++) {

    var epd = epds[i];

    uci.spec.board    = epd.board;
    uci.spec.turn     = epd.turn;
    uci.spec.rights   = epd.rights;
    uci.spec.ep       = epd.ep;
    uci.spec.fmc      = 0;
    uci.spec.hmc      = 0;
    uci.spec.id       = '';
    uci.spec.moves    = [];

    lozza.position();

    var pr = epd.prob;
    var ev = board.evaluate(board.turn);

    if (board.turn == BLACK)
      ev = -ev;

    var sg = sigmoid(ev);

    if (isNaN(ev) || isNaN(pr) || isNaN(sg) || sg > 1.0 || pr > 1.0 || sg < 0.0 || pr < 0.0) {
      console.log('nan eek',pr,sg,ev);
      process.exit();
    }

    err += (pr-sg) * (pr-sg);
  }

  return err / num;
}

//}}}
//{{{  getprob

function getprob (r) {
  if (r == '[0.5]')
    return 0.5;
  else if (r == '[1.0]')
    return 1.0;
  else if (r == '[0.0]')
    return 0.0;
  else if (r == '"1/2-1/2";')
    return 0.5;
  else if (r == '"1-0";')
    return 1.0;
  else if (r == '"0-1";')
    return 0.0;
  else
    console.log('unknown result',r);
}

//}}}
//{{{  loga

function loga (p,s) {

  return 'var ' + s + ' = [' + p.toString() + '];\r\n';
}

//}}}
//{{{  logpst

function logpst (p,s) {

  var o = 'var ';

  o = o + s + ' = [';

  for (var i=0; i < 144; i++) {
    if ((i % 12) == 0)
      o = o + '\r\n  ';
    //o = o + p[i];
    o = o + p[i].toString().padStart(4,' ');
    if (i < 143)
      o = o + ', ';
  }

  o = o + '\r\n];\r\n';

  return o;
}

//}}}
//{{{  saveparams

function saveparams (err,epochs) {

  var d   = new Date();
  var out = '//{{{  tuned weights\r\n\r\n';

  out += '// data=' + gEpdFile;
  out += '\r\n';
  out += '// epochs=' + epochs;
  out += '\r\n';
  out += '// k='+gK;
  out += '\r\n';
  out += '// err='+err;
  out += '\r\n';
  out += '// last update '+d;
  out += '\r\n\r\n';

  out += loga(VALUE_VECTOR,   'VALUE_VECTOR  ');

  out += logpst(WPAWN_PSTS,     'WPAWN_PSTS    ');
  out += logpst(WPAWN_PSTE,     'WPAWN_PSTE    ');
  out += logpst(WKNIGHT_PSTS,   'WKNIGHT_PSTS  ');
  out += logpst(WKNIGHT_PSTE,   'WKNIGHT_PSTE  ');
  out += logpst(WBISHOP_PSTS,   'WBISHOP_PSTS  ');
  out += logpst(WBISHOP_PSTE,   'WBISHOP_PSTE  ');
  out += logpst(WROOK_PSTS,     'WROOK_PSTS    ');
  out += logpst(WROOK_PSTE,     'WROOK_PSTE    ');
  out += logpst(WQUEEN_PSTS,    'WQUEEN_PSTS   ');
  out += logpst(WQUEEN_PSTE,    'WQUEEN_PSTE   ');
  out += logpst(WKING_PSTS,     'WKING_PSTS    ');
  out += logpst(WKING_PSTE,     'WKING_PSTE    ');

  out += logpst(BPAWN_PSTS,     'BPAWN_PSTS    ');
  out += logpst(BPAWN_PSTE,     'BPAWN_PSTE    ');
  out += logpst(BKNIGHT_PSTS,   'BKNIGHT_PSTS  ');
  out += logpst(BKNIGHT_PSTE,   'BKNIGHT_PSTE  ');
  out += logpst(BBISHOP_PSTS,   'BBISHOP_PSTS  ');
  out += logpst(BBISHOP_PSTE,   'BBISHOP_PSTE  ');
  out += logpst(BROOK_PSTS,     'BROOK_PSTS    ');
  out += logpst(BROOK_PSTE,     'BROOK_PSTE    ');
  out += logpst(BQUEEN_PSTS,    'BQUEEN_PSTS   ');
  out += logpst(BQUEEN_PSTE,    'BQUEEN_PSTE   ');
  out += logpst(BKING_PSTS,     'BKING_PSTS    ');
  out += logpst(BKING_PSTE,     'BKING_PSTE    ');

  out += logpst(WOUTPOST,       'WOUTPOST      ');
  out += logpst(BOUTPOST,       'BOUTPOST      ');

  out += loga(EV,             'EV            ');

  out += loga(WSTORM,         'WSTORM        ');
  out += loga(WSHELTER,       'WSHELTER      ');
  out += loga(ATT_W,          'ATT_W         ');
  out += loga(PAWN_PASSED,    'PAWN_PASSED   ');

  out += loga(imbalN_S,       'imbalN_S      ');
  out += loga(imbalN_E,       'imbalN_E      ');
  out += loga(imbalB_S,       'imbalB_S      ');
  out += loga(imbalB_E,       'imbalB_E      ');
  out += loga(imbalR_S,       'imbalR_S      ');
  out += loga(imbalR_E,       'imbalR_E      ');
  out += loga(imbalQ_S,       'imbalQ_S      ');
  out += loga(imbalQ_E,       'imbalQ_E      ');

  out = out + '\r\n//}}}\r\n\r\n';

  fs.writeFileSync(gOutFile,out);
}

//}}}
//{{{  grunt

function grunt () {

  lozza.newGameInit();

  //findK();
  //process.exit();

  //{{{  create params
  
  addp(VALUE_VECTOR, KNIGHT);
  addp(VALUE_VECTOR, BISHOP);
  addp(VALUE_VECTOR, ROOK);
  addp(VALUE_VECTOR, QUEEN);
  
  for (var i=8; i < 56; i++) {
    var sq = B88[i];
    addp(WPAWN_PSTS, sq);
    addp(WPAWN_PSTE, sq);
  }
  
  for (var i=0; i < 64; i++) {
    var sq = B88[i];
    addp(WKNIGHT_PSTS, sq);
    addp(WKNIGHT_PSTE, sq);
    addp(WBISHOP_PSTS, sq);
    addp(WBISHOP_PSTE, sq);
    addp(WROOK_PSTS,   sq);
    addp(WROOK_PSTE,   sq);
    addp(WQUEEN_PSTS,  sq);
    addp(WQUEEN_PSTE,  sq);
    addp(WKING_PSTS,   sq);
    addp(WKING_PSTE,   sq);
  }
  
  var ko =[51,52,53,54,55,56,63,64,65,66,67,68,75,76,77,78,79,80]; //knight outpost squares
  for (var i=0; i < ko.length; i++) {
    var sq = ko[i];
    addp(WOUTPOST, sq);
  }
  
  for (var i=0; i <= 8; i++) {
    addp(imbalN_S, i);
    addp(imbalN_E, i);
    addp(imbalB_S, i);
    addp(imbalB_E, i);
    addp(imbalR_S, i);
    addp(imbalR_E, i);
    addp(imbalR_S, i);
    addp(imbalR_E, i);
  }
  
  for (var i=0; i < WSHELTER.length; i++) {
    addp(WSHELTER, i);
    addp(WSTORM,   i);
  }
  
  for (var i=0; i < EV.length; i++)
    addp(EV, i);
  
  //}}}
  //{{{  tune params
  
  var numParams  = params.length;
  var epoch      = 0;
  var err        = 0;
  var bestErr    = calcErr();
  var changes    = 1;
  
  console.log('num params =',numParams);
  console.log('initial err =',bestErr);
  
  while (changes > 0) {
  
    changes = 0;
  
    for (var i=0; i < numParams; i++) {
  
      process.stdout.write(i+','+bestErr+','+changes+'        \r');
  
      var p = params[i];
  
      p.a[p.i] += p.inc;
      err = calcErr();
      if (err < bestErr) {
        saveparams(err,epoch);
        changes++;
        bestErr = err;
        continue;
      }
      else {
        p.a[p.i] -= p.inc;
      }
  
      p.inc = -p.inc;
  
      p.a[p.i] += p.inc;
      err = calcErr();
      if (err < bestErr) {
        saveparams(err,epoch);
        changes++;
        bestErr = err;
        continue;
      }
      else {
        p.a[p.i] -= p.inc;
      }
    }
  
    epoch++;
  
    console.log(epoch,bestErr,changes,'         ');
  }
  
  //}}}

  console.log('done');

  process.exit();
}

//}}}

//}}}

//{{{  check sigmoid

//for (var i=-600;i<=600;i+=100) {
  //console.log(i,sigmoid(i));
//}

//}}}
//{{{  kick it off

var thisPosition = 0;

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(gEpdFile),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {

  thisPosition += 1;

  if (thisPosition <= gMaxPositions) {

    line = line.replace(/(\r\n|\n|\r)/gm,'');

    line = line.trim();
    if (!line)
      return;

    var parts = line.split(' ');

    epds.push({board:   parts[0],
               turn:    parts[1],
               rights:  parts[2],
               ep:      parts[3],
               prob:    getprob(parts[gProbIndex])});
  }
});

rl.on('close', function(){
  console.log('source =',gEpdFile);
  console.log('K =',gK);
  console.log('positions =',epds.length);
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
  grunt();
});

//}}}

