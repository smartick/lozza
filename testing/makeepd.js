//
// Read third part epd file and convert to std format used by tools in this folder (except epd_flip.js).
// Std format is:-
//
//   board turn rights ep prob lozeval sfeval
//
// prob is white/black relative (not stm relative).
// lozeval and sfeval will be 0. Use setlozeval.js and setsfeval.js to update.
//
// Use: node makeepds.js > file
//
// To get to the point of having loz and sf evals do:-
//
//   node makeepd.js > x
//   node setlozeval.js x > y
//   node setsfeval.js y > z
//   del x, y
//

var fs = require('fs');

//{{{  getprob()

function getprob (r) {
  if (r == '[0.5]')
    return 0.5;
  else if (r == '[1.0]')
    return 1.0;
  else if (r == '[0.0]')
    return 0.0;
  else if (r == '1/2-1/2')
    return 0.5;
  else if (r == '1-0')
    return 1.0;
  else if (r == '0-1')
    return 0.0;
  else {
    console.log('unknown prob',r);
    process.exit();
  }
}

//}}}

var format = process.argv[2];

if (format == 'zuri') {
  //{{{  quiet-labeled.epd
  //
  // quiet-labeled.epd
  // rnb1kbnr/pp1pppp1/7p/2q5/5P2/N1P1P3/P2P2PP/R1BQKBNR w KQkq - c9 "1/2-1/2"
  // 0                                                   1 2    3 4  5
  
  var data  = fs.readFileSync('c:/projects/chessdata/quiet-labeled.epd', 'utf8');
  var lines = data.split('\n');
  
  data = '';  //release.
  
  for (var i=0; i < lines.length; i++) {
  
    var line = lines[i];
  
    line = line.replace(/(\r\n|\n|\r|;|")/gm,'');
    line = line.trim();
  
    if (!line)
      continue;
  
    var parts = line.split(' ');
  
    console.log(parts[0],parts[1],parts[2],parts[3],getprob(parts[5]),0,0);
  }
  
  //}}}
}
else if (format == 'rebel') {
  //{{{  rebel
  //
  // rebel.epd
  // R7/p4p2/2p2k2/rPKb1P2/3N1P2/8/8/8 b - - 0 44; d5e4 - pgn=0.5 len=118
  // 0                                 1 2 3 4 5   6    7 8   9   10  11
  
  var data  = fs.readFileSync('c:/projects/chessdata/rebel.epd', 'utf8');
  var lines = data.split('\n');
  
  data = '';  //release.
  
  for (var i=0; i < lines.length; i++) {
  
    var line = lines[i];
  
    line = line.replace(/(\r\n|\n|\r|;|")/gm,'');
    line = line.replace(/=/gm,' ');
    line = line.trim();
  
    if (!line)
      continue;
  
    var parts = line.split(' ');
  
    var stm  = parts[1].trim();
    var prob = parts[9].trim();
  
    if (stm == 'b') {
      if (prob == '0.0') {
        prob = '1.0';
      }
      else if (prob == '1.0') {
        prob = '0.0';
      }
    }
  
    console.log(parts[0],parts[1],parts[2],parts[3],prob,0,0);
  }
  
  //}}}
}
else {
  console.log('wrong format');
  process.exit();
}

lines = []; // release

