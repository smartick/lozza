//
// Copy lozza.js above here.
//

//{{{  globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

var epds   = [];
var params = [];

var gK            = 3.83;
var gLearningRate = 0.1;
var gEpdFile      = 'c:/projects/chessdata/quiet-labeled.epd';
var gOutFile      = 'gdtuner.txt';
var gMaxPositions = 1000000000;
var gErrStep      = 10;

//}}}
//{{{  functions

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
//{{{  is

function is (obj,sq) {
  return (board.b[sq] == obj) | 0;
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

function addp (a,i,coeff) {
  params.push({a: a, i: i, coeff: coeff, gr: 0, ag: 0});
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

    var sf = epd.sfeval;
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

  var a = Array(p.length);

  for (var i=0; i < p.length; i++)
    a[i] = myround(p[i]) | 0;

  return 'const ' + s + ' = [' + a.toString() + '];\r\n';
}

//}}}
//{{{  logpst

function logpst (p,s) {

  var a = Array(p.length);

  for (var i=0; i < p.length; i++)
    a[i] = myround(p[i]) | 0;

  var o = 'const ';

  o = o + s + ' = [';

  for (var i=0; i < 144; i++) {
    if ((i % 12) == 0)
      o = o + '\r\n  ';
    o = o + a[i].toString().padStart(4,' ');
    if (i < 143)
      o = o + ', ';
  }

  o = o + '\r\n];\r\n';

  return o;
}

//}}}
//{{{  saveparams

function saveparams (err, epochs) {

  var d   = new Date();
  var out = '//{{{  tuned running eval\r\n\r\n';

  out += '// data=' + gEpdFile;
  out += '\r\n';
  out += '// k='+gK;
  out += '\r\n';
  out += '// err='+err;
  out += '\r\n';
  out += '// epochs='+epochs;
  out += '\r\n';
  out += '// last update '+d;
  out += '\r\n\r\n';

  out += loga(VALUE_VECTOR,     'VALUE_VECTOR   ');

  out += logpst(WPAWN_PSTS,     'WPAWN_PSTS     ');
  out += logpst(WPAWN_PSTE,     'WPAWN_PSTE     ');
  out += logpst(WKNIGHT_PSTS,   'WKNIGHT_PSTS   ');
  out += logpst(WKNIGHT_PSTE,   'WKNIGHT_PSTE   ');
  out += logpst(WBISHOP_PSTS,   'WBISHOP_PSTS   ');
  out += logpst(WBISHOP_PSTE,   'WBISHOP_PSTE   ');
  out += logpst(WROOK_PSTS,     'WROOK_PSTS     ');
  out += logpst(WROOK_PSTE,     'WROOK_PSTE     ');
  out += logpst(WQUEEN_PSTS,    'WQUEEN_PSTS    ');
  out += logpst(WQUEEN_PSTE,    'WQUEEN_PSTE    ');
  out += logpst(WKING_PSTS,     'WKING_PSTS     ');
  out += logpst(WKING_PSTE,     'WKING_PSTE     ');

  out += logpst(BPAWN_PSTS,     'BPAWN_PSTS     ');
  out += logpst(BPAWN_PSTE,     'BPAWN_PSTE     ');
  out += logpst(BKNIGHT_PSTS,   'BKNIGHT_PSTS   ');
  out += logpst(BKNIGHT_PSTE,   'BKNIGHT_PSTE   ');
  out += logpst(BBISHOP_PSTS,   'BBISHOP_PSTS   ');
  out += logpst(BBISHOP_PSTE,   'BBISHOP_PSTE   ');
  out += logpst(BROOK_PSTS,     'BROOK_PSTS     ');
  out += logpst(BROOK_PSTE,     'BROOK_PSTE     ');
  out += logpst(BQUEEN_PSTS,    'BQUEEN_PSTS    ');
  out += logpst(BQUEEN_PSTE,    'BQUEEN_PSTE    ');
  out += logpst(BKING_PSTS,     'BKING_PSTS     ');
  out += logpst(BKING_PSTE,     'BKING_PSTE     ');

  out = out + '\r\n//}}}\r\n\r\n';

  fs.writeFileSync(gOutFile,out);
}

//}}}
//{{{  grunt

function grunt () {

  lozza.newGameInit();

  findK();

  //{{{  create params
  
  addp(VALUE_VECTOR, KNIGHT, function (piece,mg,eg) {return (board.wCounts[KNIGHT] - board.bCounts[KNIGHT]);});
  addp(VALUE_VECTOR, BISHOP, function (piece,mg,eg) {return (board.wCounts[BISHOP] - board.bCounts[BISHOP]);});
  addp(VALUE_VECTOR, ROOK,   function (piece,mg,eg) {return (board.wCounts[ROOK]   - board.bCounts[ROOK]);});
  addp(VALUE_VECTOR, QUEEN,  function (piece,mg,eg) {return (board.wCounts[QUEEN]  - board.bCounts[QUEEN]);});
  
  for (var i=8; i < 56; i++) {
    var sq = B88[i];
    addp(WPAWN_PSTS, sq, function (sq,mg,eg) {return (is(W_PAWN,sq) - is(B_PAWN,wbmap(sq))) * mg;});
    addp(WPAWN_PSTE, sq, function (sq,mg,eg) {return (is(W_PAWN,sq) - is(B_PAWN,wbmap(sq))) * eg;});
  }
  
  for (var i=0; i < 64; i++) {
    var sq = B88[i];
    addp(WKNIGHT_PSTS, sq, function (sq,mg,eg) {return (is(W_KNIGHT,sq) - is(B_KNIGHT,wbmap(sq))) * mg;});
    addp(WKNIGHT_PSTE, sq, function (sq,mg,eg) {return (is(W_KNIGHT,sq) - is(B_KNIGHT,wbmap(sq))) * eg;});
    addp(WBISHOP_PSTS, sq, function (sq,mg,eg) {return (is(W_BISHOP,sq) - is(B_BISHOP,wbmap(sq))) * mg;});
    addp(WBISHOP_PSTE, sq, function (sq,mg,eg) {return (is(W_BISHOP,sq) - is(B_BISHOP,wbmap(sq))) * eg;});
    addp(WROOK_PSTS,   sq, function (sq,mg,eg) {return (is(W_ROOK,sq)   - is(B_ROOK,  wbmap(sq))) * mg;});
    addp(WROOK_PSTE,   sq, function (sq,mg,eg) {return (is(W_ROOK,sq)   - is(B_ROOK,  wbmap(sq))) * eg;});
    addp(WQUEEN_PSTS,  sq, function (sq,mg,eg) {return (is(W_QUEEN,sq)  - is(B_QUEEN, wbmap(sq))) * mg;});
    addp(WQUEEN_PSTE,  sq, function (sq,mg,eg) {return (is(W_QUEEN,sq)  - is(B_QUEEN, wbmap(sq))) * eg;});
    addp(WKING_PSTS,   sq, function (sq,mg,eg) {return (is(W_KING,sq)   - is(B_KING,  wbmap(sq))) * mg;});
    addp(WKING_PSTE,   sq, function (sq,mg,eg) {return (is(W_KING,sq)   - is(B_KING,  wbmap(sq))) * eg;});
  }
  
  //}}}
  //{{{  tune params
  
  var epoch      = 0;
  var numParams  = params.length;
  var batchSize  = 10000;
  var numBatches = epds.length / batchSize | 0;
  var err        = 0;
  var lastErr    = 0;
  
  console.log('num params =', numParams);
  console.log('batch size =', batchSize);
  console.log('num batches =', numBatches);
  console.log('K =',gK);
  console.log('learning rate =',gLearningRate);
  
  var K2 = gK / 200.0;
  
  while (1) {
  
    if (epoch % gErrStep == 0) {
      err = calcErr();
      console.log(epoch,err,err-lastErr);
      lastErr = err;
      saveparams(err,epoch);
    }
    else {
      process.stdout.write(epoch+'\r');
    }
  
    epoch++;
  
    for (var batch=0; batch < numBatches; batch++) {
      //{{{  reset gradient sums
      
      for (var i=0; i < numParams; i++)
        params[i].gr = 0;
      
      //}}}
      //{{{  accumulate gradients
      
      for (var i=batch*batchSize; i < (batch+1)*batchSize; i++) {
      
        var epd = epds[i];
      
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
        if (board.turn == BLACK)
          ev = -ev;  // undo negamax.
      
        var sg    = sigmoid(ev);
        var phase = board.cleanPhase(board.phase);
        var mg    = (TPHASE - phase) / TPHASE;
        var eg    = phase / TPHASE;
      
        for (var j=0; j < numParams; j++) {
          var p = params[j];
          p.gr += p.coeff(p.i,mg,eg) * (sg * (1 - sg)) * (sg - pr);  // chain rule
        }
      }
      
      //}}}
      //{{{  apply mean gradient
      
      for (var i=0; i < numParams; i++) {
        var p    = params[i];
        var gr   = K2 * p.gr / batchSize;
        p.ag     += gr * gr;
        p.a[p.i] -= (gLearningRate / Math.sqrt(p.ag + 1e-8)) * gr;
      }
      
      //}}}
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
      
      //}}}
    }
  }
  
  //}}}

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
               prob:    getprob(parts[5])});
  }
});

rl.on('close', function(){
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

