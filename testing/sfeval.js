
const { execSync }  = require("child_process");

var done = 0;

//console.log('hello world! wait...');

var fs = require('fs');

process.stdin.setEncoding('utf8');

//{{{  get the epds
//
// quiet-labeled.epd
// rnb1kbnr/pp1pppp1/7p/2q5/5P2/N1P1P3/P2P2PP/R1BQKBNR w KQkq - c9 "1/2-1/2"
// 0                                                   1 2    3 4  5

var data  = fs.readFileSync('c:/projects/chessdata/quiet-labeled.epd', 'utf8');
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

  epds.push({board:  parts[0],
             turn:   parts[1],
             rights: parts[2],
             ep:     parts[3]});
}

lines = ''; // release

//}}}

var infile   = 'sfin'  + 0 + '.txt';
var outfile  = 'sfout' + 0 + '.txt';

for (var i=0; i < epds.length; i++) {

  var epd = epds[i];

  var fen = epd.board + ' ' + epd.turn + ' ' + epd.rights + ' ' + epd.ep;

  fs.writeFileSync(infile, 'position fen ' + fen + '\neval\n');

  execSync('c:\\projects\\chessdata\\engines\\stockfish\\sf.exe < ' + infile + ' > ' + outfile);

  var xdata  = fs.readFileSync(outfile, 'utf8');
  var xparts = xdata.split('Final evaluation');
  var xdata  = xparts[1].trim();
  var xparts = xdata.split(' ');
  var xeval  = xparts[0];

  var eval = 100 * parseFloat(xeval);
  if (!isNaN(eval))
    console.log(fen, (eval+0.5) | 0);
}

fs.unlinkSync(infile)
fs.unlinkSync(outfile)

//process.exit();

