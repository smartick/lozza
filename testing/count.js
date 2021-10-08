//
// Count lines in a file.
//
// Use: node count file
//

var fs       = require('fs');
var epdfile  = process.argv[2];
var numLines = 0;

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdfile),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {
  numLines++;
});

rl.on('close', function(){
  console.log(numLines);
  process.exit();
});

