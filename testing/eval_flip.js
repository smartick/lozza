//
// validates eval by evaluation position and flipped position to check the are the same.
//

//{{{  lozza globals

fs    = lozza.uci.nodefs;
uci   = lozza.uci;
board = lozza.board;

//}}}

console.log('hello world! wait...');

//{{{  get the epds

var data  = fs.readFileSync('../tuning/epds.epd', 'utf8');
var lines = data.split('\n');
var epds  = [];

var num = lines.length;

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
//{{{  get the flipped epds

var data  = fs.readFileSync('../tuning/epds_flip.epd', 'utf8');
var lines = data.split('\n');
var epdsf  = [];

var num = lines.length;

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

  epdsf.push({eval:   0,
             board:  parts[0],
             turn:   parts[1],
             rights: parts[2],
             ep:     parts[3],
             fmvn:   parseInt(parts[4]),
             hmvc:   parseInt(parts[5]),
             prob:   parseFloat(parts[9])});
}

lines    = []; // release

console.log('flipped positions =',epdsf.length);

//}}}
//{{{  compare

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
  var e = board.evaluate(board.turn);

  var epdf = epdsf[i];
  uci.spec.board    = epdf.board;
  uci.spec.turn     = epdf.turn;
  uci.spec.rights   = epdf.rights;
  uci.spec.ep       = epdf.ep;
  uci.spec.fmc      = epdf.fmvn;
  uci.spec.hmc      = epdf.hmvc;
  uci.spec.id       = 'id' + i;
  uci.spec.moves    = [];
  lozza.position();
  var ef = board.evaluate(board.turn);

  if (e != ef) {
    console.log('eval mismatch');
    console.log(e, epd.board, epd.turn, epd.rights, epd.ep);
    console.log(ef,epdf.board,epdf.turn,epdf.rights,epdf.ep);
    process.exit();
  }
}

console.log('yay, no differences');

//}}}

process.exit();

