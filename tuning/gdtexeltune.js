//
// copy lozza.js above here.
//
// Turn off pawn TT.
// Copy EV assignments to evaluate.
//

console.log('hello world! wait...');

//{{{  lozza globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

//}}}
//{{{  functions

var ginc    = 1;
var gskip   = 10;
var bestErr = 0;
var thisErr = 0;
var tries   = 0;  // num calls to calcErr() in a iter
var changes = 0;
var better  = false;
var changes = 0;
var epds    = [];

console.log('ginc =', ginc);
console.log('gskip =',gskip);

//{{{  wbmap

function wbmap (sq) {
  var m = (143-sq)/12|0;
  return 12*m + sq%12;
}

//}}}
//{{{  sigmoid

function sigmoid (qs) {
 var pp = (kkk*qs) / 400.0;
 return 1.0 / (1.0 + Math.exp(-pp));
}

//}}}
//{{{  calcErr

function calcErr (param) {

  //{{{  update black arrays
  
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
  
  //}}}

  tries++;

  process.stdout.write(tries+' '+param.id+'\r');

  var err   = 0;
  var num   = epds.length;

  for (var i=0; i < num; i++) {

    var epd = epds[i];

    uci.spec.board    = epd.board;
    uci.spec.turn     = epd.turn;
    uci.spec.rights   = epd.rights;
    uci.spec.ep       = epd.ep;
    uci.spec.fmc      = 0;
    uci.spec.hmc      = 0;
    uci.spec.id       = 'id' + i;
    uci.spec.moves    = [];

    lozza.position();

    var p = epd.prob;

    //var e = board.evaluate(board.turn);
    var e = lozza.qSearch(lozza.rootNode,0,board.turn,-INFINITY,INFINITY);

    if (board.turn == BLACK)
      e = -e;  // undo negamax.

    var s = sigmoid(e);

    if (isNaN(e) || isNaN(p) || isNaN(s) || s > 1.0 || p > 1.0 || s < 0.0 || p < 0.0) {
      console.log('nan eek',p,s,e);
      process.exit();
    }

    err += ((p-s)*(p-s));
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

  return 'const ' + s + ' = [' + p.toString() + '];\r\n';
}

//}}}
//{{{  saveparams

function saveparams () {

  var d   = new Date();
  var out = '//{{{  tuned params\r\n\r\n';

  out += '// data=' + epdfile;
  out += '\r\n';
  out += '// k='+kkk;
  out += '\r\n';
  out += '// err='+bestErr;
  out += '\r\n';
  out += '// last update '+d;
  out += '\r\n\r\n';

  out += loga(VALUE_VECTOR,   'VALUE_VECTOR  ');

  out += loga(WPAWN_PSTS,     'WPAWN_PSTS    ');
  out += loga(WPAWN_PSTE,     'WPAWN_PSTE    ');
  out += loga(WKNIGHT_PSTS,   'WKNIGHT_PSTS  ');
  out += loga(WKNIGHT_PSTE,   'WKNIGHT_PSTE  ');
  out += loga(WBISHOP_PSTS,   'WBISHOP_PSTS  ');
  out += loga(WBISHOP_PSTE,   'WBISHOP_PSTE  ');
  out += loga(WROOK_PSTS,     'WROOK_PSTS    ');
  out += loga(WROOK_PSTE,     'WROOK_PSTE    ');
  out += loga(WQUEEN_PSTS,    'WQUEEN_PSTS   ');
  out += loga(WQUEEN_PSTE,    'WQUEEN_PSTE   ');
  out += loga(WKING_PSTS,     'WKING_PSTS    ');
  out += loga(WKING_PSTE,     'WKING_PSTE    ');

  out += loga(BPAWN_PSTS,     'BPAWN_PSTS    ');
  out += loga(BPAWN_PSTE,     'BPAWN_PSTE    ');
  out += loga(BKNIGHT_PSTS,   'BKNIGHT_PSTS  ');
  out += loga(BKNIGHT_PSTE,   'BKNIGHT_PSTE  ');
  out += loga(BBISHOP_PSTS,   'BBISHOP_PSTS  ');
  out += loga(BBISHOP_PSTE,   'BBISHOP_PSTE  ');
  out += loga(BROOK_PSTS,     'BROOK_PSTS    ');
  out += loga(BROOK_PSTE,     'BROOK_PSTE    ');
  out += loga(BQUEEN_PSTS,    'BQUEEN_PSTS   ');
  out += loga(BQUEEN_PSTE,    'BQUEEN_PSTE   ');
  out += loga(BKING_PSTS,     'BKING_PSTS    ');
  out += loga(BKING_PSTE,     'BKING_PSTE    ');

  out += loga(WOUTPOST,       'WOUTPOST      ');
  out += loga(BOUTPOST,       'BOUTPOST      ');

  out += loga(EV,             'EV            ');

  out += loga(ATTACKS,        'ATTACKS       ');
  out += loga(WSTORM,         'WSTORM        ');
  out += loga(WSHELTER,       'WSHELTER      ');

  out += loga(MOBILITY_S,     'MOBILITY_S    ');
  out += loga(MOBILITY_E,     'MOBILITY_E    ');

  out += loga(IMBALN_S,       'IMBALN_S      ');
  out += loga(IMBALN_E,       'IMBALN_E      ');
  out += loga(IMBALB_S,       'IMBALB_S      ');
  out += loga(IMBALB_E,       'IMBALB_E      ');
  out += loga(IMBALR_S,       'IMBALR_S      ');
  out += loga(IMBALR_E,       'IMBALR_E      ');
  out += loga(IMBALQ_S,       'IMBALQ_S      ');
  out += loga(IMBALQ_E,       'IMBALQ_E      ');

  out = out + '\r\n//}}}\r\n\r\n';

  fs.writeFileSync('gdtexeltune.txt',out);
}

//}}}
//{{{  grunt

function grunt () {

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
  //{{{  find k
  /*
  var min  = INFINITY;
  var step = 1.0;
  var x    = 1.0;
  
  while (1) {
    kkk = x;
    var err = calcErr({id: 'calc k'});
    if (err <  min) {
      console.log('k',kkk,'err',err,'step',step);
      min = err;
      x += step;
    }
    else {
      x -= step;
      step = step / 10;
      x += step;
      console.log('new step',step);
    }
  }
  
  process.exit();
  */
  //}}}
  //{{{  do the grunt
  
  var params = [];
  
  function log(p,i) {
    console.log(p.id.padStart(15,' '),p.val.toString().padStart(5,' '),p.a[p.i].toString().padStart(5,' '),(i+1).toString().padStart(6,' '),'    ',bestErr,p.inc);
  }
  
  function addp (id,a,i) {
    params.push({id: id+i, a: a, i: i, sumgrads: 0});
  }
  
  lozza.newGameInit();
  
  console.log('starting error =',bestErr);
  console.log('**************');
  
  //{{{  create params
  
  params = [];
  
  for (var i=KNIGHT; i<=QUEEN; i++) {
    addp('piece', VALUE_VECTOR, i);
  }
  
  //}}}
  //{{{  tune params
  
  //saveparams();
  
  thisErr  = 0;
  
  while (1) {
  for (var j=0; j < epds.length; j++) {
  
    var epd = epds[j];
  
    uci.spec.board    = epd.board;
    uci.spec.turn     = epd.turn;
    uci.spec.rights   = epd.rights;
    uci.spec.ep       = epd.ep;
    uci.spec.fmc      = 0;
    uci.spec.hmc      = 0;
    uci.spec.id       = 'id' + j;
    uci.spec.moves    = [];
  
    lozza.position();
  
    var pr = epd.prob;
    var ev = board.evaluate(board.turn);
    var sg = sigmoid(ev);
  
    //console.log(pr,ev,sg);
  
    for (var i=0; i < params.length; i++) {
      var p = params[i];
      if (board.wCounts[p.i] != board.bCounts[p.i]) {
        p.a[p.i] -= (sg-pr) * 0.01;
      }
    }
  }
  console.log(VALUE_VECTOR[2],VALUE_VECTOR[3],VALUE_VECTOR[4],VALUE_VECTOR[5]);
  }
  //}}}
  
  console.log('**************');
  console.log('final error =',bestErr);
  
  process.exit();
  
  //}}}
}

//}}}

//}}}
//{{{  check sigmoid

//for (var i=-600;i<=600;i+=100) {
  //console.log(i,sigmoid(i));
//}

//}}}
//{{{  file formats
//
// quiet-labeled.epd
// rnb1kbnr/pp1pppp1/7p/2q5/5P2/N1P1P3/P2P2PP/R1BQKBNR w KQkq - c9 "1/2-1/2"
// 0                                                   1 2    3 4  5
//

//
// ethereal
// 1rbr1nk1/1pN2p1p/5np1/p2p4/P2Pp3/1P2P1P1/3N1PBP/R4RK1 w - - 1 21 [1.0] 58
// 0                                                     1 2 3 4 5  6
//

//}}}
//{{{  kick it off

var resultparam = 5;
var epdfile     = 'c:/projects/chessdata/quiet-labeled.epd';
var kkk         = 4;

//var resultparam = 6;
//var epdfile     = 'c:/projects/chessdata/E13.04-Filtered.fens';
//var kkk         = 4;

console.log('epds =',epdfile);
console.log('k =',kkk);

var maxPositions = 1000000;
var thisPosition = 0;

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdfile),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {

  thisPosition += 1;

  if (thisPosition <= maxPositions) {

    line = line.replace(/(\r\n|\n|\r)/gm,'');

    var parts = line.split(' ');

    epds.push({board:  parts[0],
               turn:   parts[1],
               rights: parts[2],
               ep:     parts[3],
               prob:   getprob(parts[resultparam])});
  }
});

rl.on('close', function(){
  grunt();
});

//}}}

