//
// Updates sfeval in the given std epd file.
//
// Use: node setsfeval epdfile
//

//{{{  globals

const { spawn } = require("child_process");

var fs      = require('fs');
var next    = -1;
var epdfile = process.argv[2];
var child   = 0;

//}}}
//{{{  functions

function getEval(s) {

  var r = s.match(/Final evaluation(.*)\(white/);

  if (r.length != 2) {
    console.log('cannot get eval from',s);
    process.exit();
  }

  var e1 = r[1].trim();
  var e2 = parseFloat(e1);
  var e3 = Math.round(e2 * 100) | 0;

  return e3;
}

function kick () {

  next++;
  if (next >= epds.length)
    process.exit();

  var epd = epds[next];
  var fen = epd.board + ' ' + epd.turn + ' ' + epd.rights + ' ' + epd.ep;

  child.stdin.write('position fen ' + fen + '\r\n');
  child.stdin.write('eval\r\n');
}

//}}}

process.stdin.setEncoding('utf8');

//{{{  get the epds

var data  = fs.readFileSync(epdfile, 'utf8');
var lines = data.split('\n');
var epds  = [];

data = '';  //release.

for (var i=0; i < lines.length; i++) {

  var line = lines[i];

  line = line.replace(/(\r\n|\n|\r)/gm,'');
  line = line.trim();

  if (!line)
    continue;

  var parts = line.split(' ');

  if (parts.length != 7) {
    console.log('file format',line);
    process.exit();
  }

  epds.push({board:   parts[0],
             turn:    parts[1],
             rights:  parts[2],
             ep:      parts[3],
             prob:    parts[4],
             lozeval: parts[5]});
}

lines = ''; // release

//}}}

child = spawn('c:\\projects\\chessdata\\engines\\stockfish\\sf.exe');

child.stdout.on('data', function (data) {
  var sfdata = data.toString();
  if (!sfdata.includes("Final evaluation ")) {
    if (sfdata.includes("in check")) {
      kick();
    }
  }
  else {
    var epd  = epds[next];
    var fen  = epd.board + ' ' + epd.turn + ' ' + epd.rights + ' ' + epd.ep;
    var eval = getEval(sfdata);
    console.log(fen, epd.prob, epd.lozeval, eval);
    kick();
  }
});

kick();
