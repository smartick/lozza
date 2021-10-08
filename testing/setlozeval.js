//
// Copy lozza.js above here.
//
// Updates lozeval in the given std epd file.
//
// Use: node setlozeval epdfile
//

var fs       = lozza.uci.nodefs;
var uci      = lozza.uci;
var board    = lozza.board;
var epdfile  = process.argv[2];

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdfile),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {

  line = line.replace(/(\r\n|\n|\r)/gm,'');

  var parts = line.split(' ');

  if (parts.length != 7) {
    console.log('file format',line);
    process.exit();
  }

  uci.spec.board    = parts[0];
  uci.spec.turn     = parts[1];
  uci.spec.rights   = parts[2];
  uci.spec.ep       = parts[3];
  uci.spec.fmc      = 0;
  uci.spec.hmc      = 0;
  uci.spec.id       = 'id';
  uci.spec.moves    = [];

  lozza.position();

  var e = board.evaluate(board.turn);

  if (board.turn == BLACK)
    e = -e;  // undo negamax.

  if (isNaN(e)) {
    console.log('nan e',e);
    process.exit();
  }

  console.log(parts[0],parts[1],parts[2],parts[3],parts[4],e,parts[6]);
});

rl.on('close', function(){
  process.exit();
});

