//
// redirect into a file for different versions to check eval is not broken.
//

//{{{  lozza globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

//}}}

console.log('hello world! wait...');

//{{{  get the epds
//
// http://rebel13.nl/download/data.html
// ccrl-40/2-elo-3400 - 1M positions from CCRL top engines.
// 2r5/2P2pk1/3b2pp/Q2pq3/4p3/p3P1Pb/2RN1P1P/4R1K1 w - - 8 41; d2b3 - pgn=0.5 len=173
// 0                                               1 2 3 4  5  6    7 8   9   10  11
//

var data  = fs.readFileSync('../tuning/epds.epd', 'utf8');
var lines = data.split('\n');
var epds  = [];

var num = lines.length;

//num = 10000;

for (var i=0; i < num; i++) {

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
//{{{  evaluate

lozza.newGameInit();

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

  //var e = board.evaluate(board.turn);
  var q = lozza.qSearch(lozza.rootNode,0,board.turn,-INFINITY,INFINITY);

  console.log(uci.spec.board,q);
}

//}}}

process.exit();

