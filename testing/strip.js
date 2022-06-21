//
// strip all but board, turn, rights, ep from a .epd file and split into
// multiple files of <max> positions. For example if x.epd contained 2M
// positions and max was 1M, node strip x would create 2 files: x_min
var fs = require('fs');

var max    = 2000000;
var out    = '';
var count  = 0;
var fileno = 0;

var epdin = process.argv[2];
if (!epdin) {
  console.log('use: node strip <infile> (assumes .epd)');
  process.exit();
}

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdin+'.epd'),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {
  //{{{  get epds
  
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
  
  count++;
  
  var fen = parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + parts[3];
  
  out = out + fen + ' 100\r\n';
  
  if (count >= max) {
    fs.writeFileSync(epdin + '_min_' + fileno + '.epd', out);
    fileno++;
    count = 0;
    out = '';
    console.log(fileno);
  }
  
  //}}}
});

rl.on('close', function(){
  //{{{  done
  
  fs.writeFileSync(epdin + '_min_' + fileno + '.epd', out);
  
  console.log('done');
  
  process.exit();
  
  //}}}
});


