
const { spawn }  = require("child_process");

var fs      = require('fs');
var next    = 0;
var epdfile = 'sf14quiet-labeled.epd';

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
             ep:     parts[3],
             prob:   parts[5]});
}

lines = ''; // release

//}}}

if (fs.existsSync(epdfile))
  fs.unlinkSync(epdfile)

var child = spawn('c:\\projects\\chessdata\\engines\\stockfish\\sf.exe');

child.stdout.on('data', function (data) {
  var xdata  = data.toString();
  var xparts = xdata.split('Classical evaluation');
  if (xparts.length != 2) {
    //console.log(next,xdata);
    if (xdata.includes("in check")) {
      next++;
      if (next >= epds.length)
        process.exit();
      //{{{  kick
      
      var epd = epds[next];
      var fen = epd.board + ' ' + epd.turn + ' ' + epd.rights + ' ' + epd.ep;
      
      child.stdin.write('position fen ' + fen + '\r\n');
      child.stdin.write('eval\r\n');
      
      //}}}
    }
  }
  else {
    //{{{  decode eval
    
    var epd = epds[next];
    
    xdata  = xparts[1].trim();
    xdata  = xdata.replace(/(\r\n|\n|\r)/gm,'');
    xdata  = xdata.trim();
    xdata  = xdata.replace(/\s+/g, ' ');
    xparts = xdata.split(' ');
    
    var xeval1  = xparts[0];
    var xeval2  = xparts[4];
    var xeval3  = xparts[8];
    
    var eval1 = Math.round(100 * parseFloat(xeval1));
    var eval2 = Math.round(100 * parseFloat(xeval2));
    var eval3 = Math.round(100 * parseFloat(xeval3));
    
    var fen = epd.board + ' ' + epd.turn + ' ' + epd.rights + ' ' + epd.ep;
    
    var seval1 = '' + eval1;
    var seval2 = '' + eval2;
    var seval3 = '' + eval3;
    
    fs.appendFileSync(epdfile, fen + ' c9 ' + epd.prob + ' sf14hce ' + seval1 + '; sf14nnue ' + seval2 + '; sf14hybrid ' + seval3 + ';\r\n');
    
    next++;
    if (next >= epds.length)
      process.exit();
    
    //{{{  kick
    
    var epd = epds[next];
    var fen = epd.board + ' ' + epd.turn + ' ' + epd.rights + ' ' + epd.ep;
    
    child.stdin.write('position fen ' + fen + '\r\n');
    child.stdin.write('eval\r\n');
    
    //}}}
    
    //}}}
  }
});

//{{{  kick

var epd = epds[next];
var fen = epd.board + ' ' + epd.turn + ' ' + epd.rights + ' ' + epd.ep;

child.stdin.write('position fen ' + fen + '\r\n');
child.stdin.write('eval\r\n');

//}}}

