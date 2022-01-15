//
// Turn off pawn hash.
//

var epdin  = 'data/lozza.epd';        // make with makeepd.bat.
var epdout = 'data/lozza-quiet.epd';  // for use in gdtuner.js etc.

//{{{  getprob()

function getprob (r) {
  if (r == '1/2-1/2')
    return '0.5';
  else if (r == '1-0')
    return '1.0';
  else if (r == '0-1')
    return '0.0';
  else {
    console.log('unknown result',r);
    process.exit();
  }
}

//}}}
//{{{  round1()

function round1(x) {
  return Math.round(x*10) / 10;
}

//}}}
//{{{  log()

function log () {

  var progress = totbytes / filesize * 100;
  var yield    = numquiet / numepds;
  var guess    = filesize / avebytes * yield;

  console.log('progress% =', round1(progress), 'epds =', round1(numepds/1000000), 'quiet =', round1(numquiet/1000000), 'yield =', round1(yield), 'guess =', round1(guess/1000000));
}

//}}}

var fs        = lozza.uci.nodefs;
var uci       = lozza.uci;
var board     = lozza.board;

var numepds   = 0;
var numquiet  = 0;
var totbytes  = 0;
var avebytes  = 0;
var out       = '';

var stats     = fs.statSync(epdin)
var filesize  = stats.size;

fs.writeFileSync(epdout,'');

console.log('file size',filesize,'bytes');

lozza.newGameInit();

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdin),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

//
// lozza.epd is made from a pgn file via ./makeepd.bat and has lines of this form:-
// rnbqkbnr/2p2ppp/1p1pp3/pP6/3P1P2/8/P1P1P1PP/RNBQKBNR w KQkq - c0 released-coalface soaktest ? 2021.11.04; c1 1-0;
// 0                                                    1 2    3 4  5                 6        7 8           9  10
//

rl.on('line', function (line) {

  var len = line.length;

  if (!len) {
    return;
  }

  line = line.replace(/(\r\n|\n|\r|;)/gm,'');

  if (!line.length) {
    return;
  }

  var parts = line.split(' ');

  if (!parts.length) {
    return;
  }

  if (parts.length != 11) {
    console.log('line',line);
    process.exit();
  }

  numepds++;
  totbytes  += len;
  avebytes  = totbytes / numepds;

  uci.spec.board    = parts[0];
  uci.spec.turn     = parts[1];
  uci.spec.rights   = parts[2];
  uci.spec.ep       = parts[3];
  uci.spec.fmc      = 0;
  uci.spec.hmc      = 0;
  uci.spec.id       = 'id';
  uci.spec.moves    = [];

  if (uci.spec.turn != 'w' && uci.spec.turn != 'b') {
    console.log('turn',uci.spec.turn);
    process.exit();
  }

  lozza.position();

  var inCheck  = board.isKingAttacked(board.turn);
  if (inCheck)
    return;

  var nextTurn = ~board.turn & COLOR_MASK;

  var inCheck  = board.isKingAttacked(nextTurn);
  if (inCheck)
    return;

  var e = board.evaluate(board.turn);
  if (board.turn == BLACK)
    e = -e;

  if (isNaN(e)) {
    console.log('nan e',e);
    process.exit();
  }

  if (Math.abs(e) > 1600)
    return;

  var q = lozza.qSearch(lozza.rootNode,0,board.turn,-INFINITY,INFINITY);
  if (board.turn == BLACK)
    q = -q;

  if (isNaN(q)) {
    console.log('nan q',q);
    process.exit();
  }

  if (q != e)
    return;

  numquiet++

  if (numquiet % 100000 == 0)
    log();

  //
  // The probability is deliberately positioned as element 6 (index 5) to match quiet-labeled.epd.
  // so that gdtuner.js works painlessly.
  //

  out += parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + parts[3] + ' ' + e + ' ' + getprob(parts[10]) + '\r\n';

  if (out.length > 1000000) {
    fs.appendFileSync(epdout,out);
    out = '';
  }
});

rl.on('close', function(){
  if (out)
    fs.appendFileSync(epdout,out);
  log();
  process.exit();
});

