//
// Copy clean.js above here.
//

var epdin    = 'data/makedata-noisey.epd';
var epdout   = 'data/makedata-quiet-scored.epd';

var fs        = lozza.uci.nodefs;
var uci       = lozza.uci;
var board     = lozza.board;

fs.writeFileSync(epdout,'');

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdin),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {
  //{{{  process epds
  
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
    return;
  }
  
  //}}}
  
  var fen = parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + '-' + ' 0 1';
  
  onmessage({data: "ucinewgame"});
  onmessage({data: "position fen " + fen});
  
  console.log(line);
  
  onmessage({data: "go depth 1"});
  
  var out = parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + parts[3] + ' ' + lozza.stats.bestScore + '\r\n';
  
  fs.appendFileSync(epdout,out);
  
  //}}}
});

rl.on('close', function(){
  //{{{  done
  
  console.log('done');
  
  process.exit();
  
  //}}}
});

