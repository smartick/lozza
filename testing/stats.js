//
// Copy lozza.js above here.
//

lozza.newGameInit();

var epdin = process.argv[2];
if (!epdin) {
  console.log('use: node stats <file>');
  process.exit();
}

var fs        = lozza.uci.nodefs;
var uci       = lozza.uci;
var board     = lozza.board;

var numepds  = 0;
var avescore = 0;
var aveW     = 0;
var aveB     = 0;
var turnW    = 0;
var turnB    = 0;
var avephase = 0;

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdin),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {
  //{{{  get epds
  
  //{{{  valid line?
  
  if (!line.length) {
    return;
  }
  
  line = line.replace(/(\r\n|\n|\r|;)/gm,'');
  
  if (!line.length) {
    return;
  }
  
  var parts = line.split(' ');
  
  if (parts.length < 4) {
    console.log('format error',line);
    process.exit();
  }
  
  //}}}
  
  numepds++;
  
  if (numepds % 10000 == 0)
    process.stdout.write(numepds+'\r');
  
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
  
  avescore += board.evaluate(board.turn);
  
  aveW += board.wCount;
  aveB += board.bCount;
  
  if (board.turn == WHITE)
    turnW++;
  else
    turnB++;
  
  avephase += board.cleanPhase(board.phase);
  
  //}}}
});

rl.on('close', function(){
  //{{{  done
  
  console.log('file =', epdin);
  console.log('numepds =', numepds);
  console.log('w turn =', turnW);
  console.log('b turn =', turnB);
  console.log('mean w count', aveW/numepds);
  console.log('mean b count', aveB/numepds);
  console.log('mean phase =', avephase/numepds);
  console.log('mean score =', avescore/numepds);
  
  process.exit();
  
  //}}}
});

