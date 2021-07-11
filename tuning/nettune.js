
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

console.log('hello world! wait...');

//{{{  constants

const WHITE = 0;
const BLACK = 1;

const KING   = 0;
const QUEEN  = 1;
const ROOK   = 2;
const BISHOP = 3;
const KNIGHT = 4;
const PAWN   = 5;

var chPce = [];
var chCol = [];
var chNum = [];
var chStm = [];

chPce['k'] = KING;
chCol['k'] = BLACK;
chPce['q'] = QUEEN;
chCol['q'] = BLACK;
chPce['r'] = ROOK;
chCol['r'] = BLACK;
chPce['b'] = BISHOP;
chCol['b'] = BLACK;
chPce['n'] = KNIGHT;
chCol['n'] = BLACK;
chPce['p'] = PAWN;
chCol['p'] = BLACK;
chPce['K'] = KING;
chCol['K'] = WHITE;
chPce['Q'] = QUEEN;
chCol['Q'] = WHITE;
chPce['R'] = ROOK;
chCol['R'] = WHITE;
chPce['B'] = BISHOP;
chCol['B'] = WHITE;
chPce['N'] = KNIGHT;
chCol['N'] = WHITE;
chPce['P'] = PAWN;
chCol['P'] = WHITE;

chNum['8'] = 8;
chNum['7'] = 7;
chNum['6'] = 6;
chNum['5'] = 5;
chNum['4'] = 4;
chNum['3'] = 3;
chNum['2'] = 2;
chNum['1'] = 1;

chStm['w'] = WHITE;
chStm['b'] = BLACK;

//}}}
//{{{  functions

var epds   = [];
var inputs = [];
var debug  = 1;

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
//{{{  decodeFEN

function decodeFEN(board, stmStr, arr) {

  //{{{  init arr
  
  for (var i=0; i<768; i++)
    arr[i] = 0;
  
  //}}}

  var stm = chStm[stmStr];
  var sq  = 0;

  for (var j=0; j < board.length; j++) {

    var ch  = board.charAt(j);
    var num = chNum[ch];
    var col = 0;

    if (typeof(num) == 'undefined') {
      if (ch != '/') {
        //{{{  decode ch
        
        pce = chPce[ch];
        col = chCol[ch];
        
        //}}}
        //{{{  check stuff
        
        if (debug) {
        
          if (sq < 0) {
            console.log('sq<0',sq);
            process.exit();
          }
          else if (sq > 63) {
            console.log('sq>63',sq);
            process.exit();
          }
          else if (pce < 0) {
            console.log('pce<0',pce);
            process.exit();
          }
          else if (pce > 5) {
            console.log('pce>5',pce);
            process.exit();
          }
          else if (typeof(pce) == 'undefined') {
            console.log('pceundef',pce);
            process.exit();
          }
          else if (col < 0) {
            console.log('col<0',col);
            process.exit();
          }
          else if (col > 1) {
            console.log('col>1',col);
            process.exit();
          }
          else if (typeof(col) == 'undefined') {
            console.log('colundef',col);
            process.exit();
          }
          else if (stm < 0) {
            console.log('stm<0',stm);
            process.exit();
          }
          else if (stm > 1) {
            console.log('stm>1',stm);
            process.exit();
          }
          else if (typeof(stm) == 'undefined') {
            console.log('stmundef',stm);
            process.exit();
          }
        }
        
        //}}}
        //{{{  map to model
        
        if (col == stm)
          var off = 0;
        else
          var off = 384;
        
        var x = off + pce * 64 + sq;
        
        if (debug) {
        
          if (isNaN(x)) {
            console.log('xnan',x);
            process.exit();
          }
          if (x >= 768) {
            console.log('x>768',x);
            process.exit();
          }
          if (x < 0) {
            console.log('x-ve',x);
            process.exit();
          }
        }
        
        
        //}}}
        arr[x] = 1;
        sq++;
      }
    }
    else {
      sq += num;
    }
  }
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
  //{{{  check decoding
  
  debug  = 1;
  var t1 = Date.now();
  
  for (var i=0; i < epds.length; i++) {
  
    if (i % 100000 == 0)
      process.stdout.write(i+'\r');
  
    var epd = epds[i];
  
    decodeFEN(epd.board, epd.stm, inputs);
  }
  
  var t2 = Date.now();
  
  decodeFEN('1P2kK2/Q7/8/8/8/8/8/7n', 'w', inputs);
  if (!inputs[321] || !inputs[388] || !inputs[5] || !inputs[72] || !inputs[703]) {
    console.log('decode pos');
    process.exit();
  }
  
  debug  = 0;
  
  console.log('decoding ok',(t2-t1),'ms');
  
  //}}}
}

//}}}

//}}}
//{{{  kick it off

var epdfile     = 'c:/projects/chessdata/E13.04-Filtered.fens';
var resultparam = 6;

//var epdfile     = 'c:/projects/chessdata/quiet-labeled.epd';
//var resultparam = 5;

var maxPositions = 1000000;
var thisPosition = 0;

const readline = require('readline');
const fs       = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream(epdfile),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {

  thisPosition += 1;

  if (thisPosition % 100000 == 0)
    process.stdout.write(thisPosition+'\r');

  if (thisPosition <= maxPositions) {

    line = line.replace(/(\r\n|\n|\r)/gm,'');

    const parts = line.split(' ');

    epds.push({board: parts[0].trim(),
               stm:   parts[1].trim(),
               prob:  getprob(parts[resultparam])});
  }
});

rl.on('close', function(){
  grunt();
});

//}}}

