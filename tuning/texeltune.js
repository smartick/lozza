//
// copy lozza.js above here.
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
 return 1.0 / (1.0 + Math.pow(10.0,-pp));
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
  }
  
  for (var i=W_PAWN; i <= W_KING; i++) {
  
    reachBP_S[i+8] = reachWP_S[i];
    reachBN_S[i+8] = reachWN_S[i];
    reachBB_S[i+8] = reachWB_S[i];
    reachBR_S[i+8] = reachWR_S[i];
    reachBQ_S[i+8] = reachWQ_S[i];
    reachBK_S[i+8] = reachWK_S[i];
  
    reachBP_E[i+8] = reachWP_E[i];
    reachBN_E[i+8] = reachWN_E[i];
    reachBB_E[i+8] = reachWB_E[i];
    reachBR_E[i+8] = reachWR_E[i];
    reachBQ_E[i+8] = reachWQ_E[i];
    reachBK_E[i+8] = reachWK_E[i];
  
  }
  
  for (var i=B_PAWN; i <= B_KING; i++) {
  
    reachBP_S[i-8] = reachWP_S[i];
    reachBN_S[i-8] = reachWN_S[i];
    reachBB_S[i-8] = reachWB_S[i];
    reachBR_S[i-8] = reachWR_S[i];
    reachBQ_S[i-8] = reachWQ_S[i];
    reachBK_S[i-8] = reachWK_S[i];
  
    reachBP_E[i-8] = reachWP_E[i];
    reachBN_E[i-8] = reachWN_E[i];
    reachBB_E[i-8] = reachWB_E[i];
    reachBR_E[i-8] = reachWR_E[i];
    reachBQ_E[i-8] = reachWQ_E[i];
    reachBK_E[i-8] = reachWK_E[i];
  
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

  out += loga(VALUE_VECTOR_S, 'VALUE_VECTOR_S');
  out += loga(VALUE_VECTOR_E, 'VALUE_VECTOR_E');

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

  out += loga(mobil_S,        'mobil_S       ');
  out += loga(mobil_E,        'mobil_E       ');

  out += loga(imbalN_S,       'imbalN_S      ');
  out += loga(imbalN_E,       'imbalN_E      ');
  out += loga(imbalB_S,       'imbalB_S      ');
  out += loga(imbalB_E,       'imbalB_E      ');

  out += loga(reachWP_S,      'reachWP_S     ');
  out += loga(reachWP_E,      'reachWP_E     ');
  out += loga(reachWN_S,      'reachWN_S     ');
  out += loga(reachWN_E,      'reachWN_E     ');
  out += loga(reachWB_S,      'reachWB_S     ');
  out += loga(reachWB_E,      'reachWB_E     ');
  out += loga(reachWR_S,      'reachWR_S     ');
  out += loga(reachWR_E,      'reachWR_E     ');
  out += loga(reachWQ_S,      'reachWQ_S     ');
  out += loga(reachWQ_E,      'reachWQ_E     ');
  out += loga(reachWK_S,      'reachWK_S     ');
  out += loga(reachWK_E,      'reachWK_E     ');

  out += loga(reachBP_S,      'reachBP_S     ');
  out += loga(reachBP_E,      'reachBP_E     ');
  out += loga(reachBN_S,      'reachBN_S     ');
  out += loga(reachBN_E,      'reachBN_E     ');
  out += loga(reachBB_S,      'reachBB_S     ');
  out += loga(reachBB_E,      'reachBB_E     ');
  out += loga(reachBR_S,      'reachBR_S     ');
  out += loga(reachBR_E,      'reachBR_E     ');
  out += loga(reachBQ_S,      'reachBQ_S     ');
  out += loga(reachBQ_E,      'reachBQ_E     ');
  out += loga(reachBK_S,      'reachBK_S     ');
  out += loga(reachBK_E,      'reachBK_E     ');

  out += loga(cwtch_S,        'cwtch_S       ');
  out += loga(cwtch_E,        'cwtch_E       ');

  out += loga(xray_S,         'xray_S        ');
  out += loga(xray_E,         'xray_E        ');

  out += loga(misc_S,         'misc_S        ');
  out += loga(misc_E,         'misc_E        ');

  out = out + '\r\n//}}}\r\n\r\n';

  fs.writeFileSync('texeltune.txt',out);
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
  var step = 0.1;
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
    //console.log('adding',id,i,a[i]);
    params.push({id: id+i, a: a, i: i, inc: ginc, val: a[i], skip: 0});
  }
  
  lozza.newGameInit();
  
  //{{{  check eval/q
  
  var t1 = Date.now();
  
  bestErr = calcErr({id: 'timing'});
  
  var t2 = Date.now();
  var et = (t2-t1)/1000;
  console.log('try time =',et,'secs (one pass of all positions)');
  
  if (calcErr({id: 'verify eval'}) != bestErr) {
    console.log('eval/q is unstable');
    process.exit();
  }
  else
    console.log('eval/q is stable'); // probably
  
  //}}}
  
  console.log('starting error =',bestErr);
  console.log('**************');
  
  //{{{  create params
  
  params = [];
  
  for (var i=KNIGHT; i<=QUEEN; i++) {
    addp('pieces', VALUE_VECTOR_S, i);
  }
  
  for (var i=PAWN; i<=QUEEN; i++) {
    addp('piecee', VALUE_VECTOR_E, i);
  }
  
  for (var i=0; i < B88.length; i++) {
    var wi = B88[i];
    addp('kpsts', WKING_PSTS, wi);
    addp('kpste', WKING_PSTE, wi);
  }
  
  for (var i=8; i < 56; i++) {
    var wi = B88[i];
    addp('ppsts', WPAWN_PSTS, wi);
    addp('ppste', WPAWN_PSTE, wi);
  }
  
  for (var i=0; i < B88.length; i++) {
    var wi = B88[i];
    addp('npsts', WKNIGHT_PSTS, wi);
    addp('npste', WKNIGHT_PSTE, wi);
  }
  
  for (var i=0; i < B88.length; i++) {
    var wi = B88[i];
    addp('bpsts', WBISHOP_PSTS, wi);
    addp('bpste', WBISHOP_PSTE, wi);
  }
  
  for (var i=0; i < B88.length; i++) {
    var wi = B88[i];
    addp('rpsts', WROOK_PSTS, wi);
    addp('rpste', WROOK_PSTE, wi);
  }
  
  for (var i=0; i < B88.length; i++) {
    var wi = B88[i];
    addp('qpsts', WQUEEN_PSTS, wi);
    addp('qpste', WQUEEN_PSTE, wi);
  }
  
  for (var i=0; i <= 8; i++) {
    addp('imbalns', imbalN_S, i);
    addp('imbalne', imbalN_E, i);
    addp('imbalbs', imbalB_S, i);
    addp('imbalbe', imbalB_E, i);
  }
  
  for (var i=PAWN; i <= KING; i++) {
    addp('mobils', mobil_S, i);
    addp('mobile', mobil_E, i);
  }
  
  for (var i=W_PAWN; i <= W_KING; i++) {
    addp('reachps', reachWP_S, i);
    addp('reachpe', reachWP_E, i);
    addp('reachns', reachWN_S, i);
    addp('reachne', reachWN_E, i);
    addp('reachbs', reachWB_S, i);
    addp('reachbe', reachWB_E, i);
    addp('reachrs', reachWR_S, i);
    addp('reachre', reachWR_E, i);
    addp('reachqs', reachWQ_S, i);
    addp('reachqe', reachWQ_E, i);
    addp('reachks', reachWK_S, i);
    addp('reachke', reachWK_E, i);
  }
  for (var i=B_PAWN; i <= B_KING; i++) {
    addp('reachps', reachWP_S, i);
    addp('reachpe', reachWP_E, i);
    addp('reachns', reachWN_S, i);
    addp('reachne', reachWN_E, i);
    addp('reachbs', reachWB_S, i);
    addp('reachbe', reachWB_E, i);
    addp('reachrs', reachWR_S, i);
    addp('reachre', reachWR_E, i);
    addp('reachqs', reachWQ_S, i);
    addp('reachqe', reachWQ_E, i);
    addp('reachks', reachWK_S, i);
    addp('reachke', reachWK_E, i);
  }
  
  for (var i=PAWN; i <= KING; i++) {
    addp('cwtchs', cwtch_S, i);
    addp('cwtche', cwtch_E, i);
  }
  
  for (var i=BISHOP; i <= QUEEN; i++) {
    addp('xrays', xray_S, i);
    addp('xraye', xray_E, i);
  }
  
  for (var i=0; i < misc_S.length; i++) {
    addp('miscs', misc_S, i);
    addp('misce', misc_E, i);
  }
  
  console.log('number of params =', params.length);
  
  //}}}
  //{{{  tune params
  
  //saveparams();
  
  iter     = 1;          // num full iters (trying all params)
  thisErr  = 0;
  changes  = 0;          // num changes made in this iter
  tries    = 0;          // num calls to calcErr() made in this iter
  better   = true;
  
  while (better) {
  
    var t1  = Date.now();
  
    //{{{  try each param
    
    better = false;
    
    for (var i=0; i < params.length; i++) {
    
      var p = params[i];
    
      if (p.skip >= gskip)
        continue;
    
      //{{{  try p.inc
      
      p.a[p.i] = p.a[p.i] + p.inc;
      
      thisErr = calcErr(p);
      
      if (thisErr < bestErr) {
        bestErr = thisErr;
        better = 1;
        changes++;
        log(p,i);
        saveparams();
        continue
      }
      
      p.a[p.i] = p.a[p.i] - p.inc;
      
      //}}}
    
      p.inc = -p.inc;
    
      //{{{  try -p.inc
      
      p.a[p.i] = p.a[p.i] + p.inc;
      
      thisErr = calcErr(p);
      
      if (thisErr < bestErr) {
        changes++;
        bestErr = thisErr;
        better = 1;
        log(p,i);
        saveparams();
        continue
      }
      
      p.a[p.i] = p.a[p.i] - p.inc;
      
      //}}}
    
      p.skip++;
    }
    
    //}}}
  
    saveparams();
  
    var t2 = Date.now();
  
    console.log('iter =',iter,'tries =',tries,'changes =',changes,'min err =',bestErr,'iter time =',Math.round((t2-t1)/1000/60),'mins');
  
    tries   = 0;
    changes = 0;
    iter++;
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
var kkk         = 1.62;

//var resultparam = 6;
//var epdfile     = 'c:/projects/chessdata/E13.04-Filtered.fens';
//var kkk          = 1.34;

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

