
var maxPositions   = 1000000000;
var netHiddenSize  = 16;
var learningRate   = 0.001;
var batchSize      = 100;

//{{{  file formats
//
// quiet-labeled.epd
// rnb1kbnr/pp1pppp1/7p/2q5/5P2/N1P1P3/P2P2PP/R1BQKBNR w KQkq - c9 "1/2-1/2"
// 0                                                   1 2    3 4  5
//

//
// ethereal
// 1rbr1nk1/1pN2p1p/5np1/p2p4/P2Pp3/1P2P1P1/3N1PBP/R4RK1 w - - 1 21 [1.0] 58
// 0                                                     1 2 3 4 5  6
//

//}}}

console.log('hello world! wait...');

//{{{  constants

const WHITE = 0;
const BLACK = 1;

const KING   = 0;
const QUEEN  = 1;
const ROOK   = 2;
const BISHOP = 3;
const KNIGHT = 4;
const PAWN   = 5;

var chPce = [];
var chCol = [];
var chNum = [];
var chStm = [];

chPce['k'] = KING;
chCol['k'] = BLACK;
chPce['q'] = QUEEN;
chCol['q'] = BLACK;
chPce['r'] = ROOK;
chCol['r'] = BLACK;
chPce['b'] = BISHOP;
chCol['b'] = BLACK;
chPce['n'] = KNIGHT;
chCol['n'] = BLACK;
chPce['p'] = PAWN;
chCol['p'] = BLACK;
chPce['K'] = KING;
chCol['K'] = WHITE;
chPce['Q'] = QUEEN;
chCol['Q'] = WHITE;
chPce['R'] = ROOK;
chCol['R'] = WHITE;
chPce['B'] = BISHOP;
chCol['B'] = WHITE;
chPce['N'] = KNIGHT;
chCol['N'] = WHITE;
chPce['P'] = PAWN;
chCol['P'] = WHITE;

chNum['8'] = 8;
chNum['7'] = 7;
chNum['6'] = 6;
chNum['5'] = 5;
chNum['4'] = 4;
chNum['3'] = 3;
chNum['2'] = 2;
chNum['1'] = 1;

chStm['w'] = WHITE;
chStm['b'] = BLACK;

//}}}
//{{{  functions

var epds    = [];
var outputs = [];
var debug   = 1;

//{{{  getprob

function getprob (r) {
  if (r == '[0.5]')
    return 0.5;
  else if (r == '[1.0]')
    return 1.0;
  else if (r == '[0.0]')
    return 0.0;
  else if (r == '"12-12";')
    return 0.5;
  else if (r == '"1-0";')
    return 1.0;
  else if (r == '"0-1";')
    return 0.0;
  else
    console.log('unknown result',r);
}

//}}}
//{{{  decodeFEN

function decodeFEN(board, stmStr) {

  //{{{  init arr
  
  for (var i=0; i<netInputSize; i++)
    neti[i] = 0.0;
  
  //}}}

  var stm = chStm[stmStr];
  var sq  = 0;

  for (var j=0; j < board.length; j++) {

    var ch  = board.charAt(j);
    var num = chNum[ch];
    var col = 0;

    if (typeof(num) == 'undefined') {
      //{{{  decode ch
      
      pce = chPce[ch];
      col = chCol[ch];
      
      //}}}
      //{{{  check stuff
      
      if (debug) {
      
        if (sq < 0) {
          console.log('sq<0',sq);
          process.exit();
        }
        else if (sq > 63) {
          console.log('sq>63',sq);
          process.exit();
        }
        else if (pce < 0) {
          console.log('pce<0',pce);
          process.exit();
        }
        else if (pce > 5) {
          console.log('pce>5',pce);
          process.exit();
        }
        else if (typeof(pce) == 'undefined') {
          console.log('pceundef',pce);
          process.exit();
        }
        else if (col < 0) {
          console.log('col<0',col);
          process.exit();
        }
        else if (col > 1) {
          console.log('col>1',col);
          process.exit();
        }
        else if (typeof(col) == 'undefined') {
          console.log('colundef',col);
          process.exit();
        }
        else if (stm < 0) {
          console.log('stm<0',stm);
          process.exit();
        }
        else if (stm > 1) {
          console.log('stm>1',stm);
          process.exit();
        }
        else if (typeof(stm) == 'undefined') {
          console.log('stmundef',stm);
          process.exit();
        }
      }
      
      //}}}
      //{{{  map to model
      //
      // stm pieces are first.
      //
      
      var off = Math.abs(col - stm) * 384;
      
      var x = off + pce * 64 + sq;
      
      //if (debug) {
      //  if (isNaN(x)) {
      //    console.log('xnan',x);
      //    process.exit();
      //  }
      //  if (x >= 768) {
      //    console.log('x>768',x);
      //    process.exit();
      //  }
      //  if (x < 0) {
      //    console.log('x-ve',x);
      //    process.exit();
      //  }
      //}
      
      //}}}
      neti[x] = 1.0;
      sq++;
    }
    else {
      sq += num;
    }
  }
}

//}}}
//{{{  network

var netInputSize   = 768; // input layer.
var netOutputSize  = 1;   // output layer.

//{{{  build net

function netNode (weightsSize) {
  this.in          = 0;
  this.gin         = 0;
  this.out         = 0;
  this.gout        = 0;
  this.weights     = Array(weightsSize);
  this.gweights    = Array(weightsSize);
  this.gweightssum = Array(weightsSize);
}

var neti = Array(netInputSize);

var neth = Array(netHiddenSize);
for (var h=0; h < netHiddenSize; h++) {
  neth[h] = new netNode(netInputSize);
}

var neto = Array(netOutputSize);
for (var o=0; o < netOutputSize; o++) {
  neto[o] = new netNode(netHiddenSize);
}

//}}}

//{{{  sigmoid

function sigmoid(x) {
  return (1.0 / (1.0 + Math.exp(-x)));
}

function dsigmoid(x) {
  return sigmoid(x) * (1.0 - sigmoid(x));
}

//}}}
//{{{  relu

function relu(x) {
  return Math.max(0.0,x);
}

function drelu(x) {
  return 1.0;
}

//}}}
//{{{  netLoss

function netLoss(target) {

  var x = 0.0;

  for (var o=0; o < netOutputSize; o++) {
    x += (target[o] - neto[o].out) * (target[o] - neto[o].out);
  }

  return x;
}

//}}}
//{{{  netForward()

function netForward() {

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    hidden.in = 0;
    for (var i=0; i < netInputSize; i++) {
      hidden.in += hidden.weights[i] * neti[i];
    }
    hidden.out = relu(hidden.in);
  }

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    output.in = 0;
    for (var h=0; h < netHiddenSize; h++) {
      output.in += output.weights[h] * neth[h].out;
    }
    output.out = sigmoid(output.in);
  }
}

//}}}
//{{{  netInitWeights()

function netInitWeights() {

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      hidden.weights[i] = Math.random() * 2 - 1;
    }
  }

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      output.weights[h] = Math.random() * 2 - 1;
    }
  }
}

//}}}
//{{{  netCalcGradients()

function netCalcGradients(targets) {

  if (targets.length != netOutputSize) {
    console.log('netCallGradients','output vector length must be',netOutputSize,'your length is',targets.length);
    process.exit;
  }

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    output.gout = 2 * (output.out - targets[o]);
    output.gin  = dsigmoid(output.in) * output.gout;
  }

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      var hidden = neth[h];
      output.gweights[h] = output.gin * hidden.out;
    }
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    hidden.gout = 0;
    for (var o=0; o < netOutputSize; o++) {
      var output = neto[o];
      hidden.gout += output.gin * output.weights[h];
    }
    hidden.gin = drelu(hidden.in) * hidden.gout;
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      hidden.gweights[i] = hidden.gin * neti[i];
    }
  }
}

//}}}
//{{{  netResetGradientSums()

function netResetGradientSums() {

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      output.gweightssum[h] = 0.0;
    }
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      hidden.gweightssum[i] = 0.0;
    }
  }
}

//}}}
//{{{  netAccumulateGradients()

function netAccumulateGradients() {

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      output.gweightssum[h] += output.gweights[h];
    }
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      hidden.gweightssum[i] += hidden.gweights[i];
    }
  }
}

//}}}
//{{{  netApplyGradients()

function netApplyGradients(b,alpha) {

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      output.weights[h] = output.weights[h] - alpha * (output.gweightssum[h] / b);
    }
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      hidden.weights[i] = hidden.weights[i] - alpha * (hidden.gweightssum[i] / b);
    }
  }
}

//}}}
//{{{  netSaveWeights

function netSaveWeights () {

  var d   = new Date();
  var out = '//{{{  net weights\r\n\r\n';

  out += '// data=quiet_labelled.epd';
  out += '\r\n';
  out += '// last update '+d;
  out += '\r\n\r\n';

  for (var h=0; h < netHiddenSize; h++) {
    out = out + 'neth['+h+'] = [' + neth[h].weights.toString();
    out = out + '];\r\n';
    out = out + '\r\n';
  }

  for (var o=0; o < netOutputSize; o++) {
    out = out + 'neto['+o+'] = [' + neto[o].weights.toString();
    out = out + '];\r\n';
    out = out + '\r\n';
  }

  out = out + '\r\n//}}}\r\n\r\n';

  fs.writeFileSync('nettune.txt',out);
}

//}}}

//}}}
//{{{  grunt

function grunt () {

  console.log('positions =',epds.length);

  //{{{  count win, lose, draw
  //
  // Just to make sure the file has been parsed OK.
  //
  
  var wins = 0;
  var loss = 0;
  var draw = 0;
  
  for (var i=0; i < epds.length; i++) {
  
    if (i % 100000 == 0)
      process.stdout.write(i+'\r');
  
    var epd = epds[i];
  
    if (epd.prob == 1.0)
      wins++;
  
    else if (epd.prob == 0.0)
      loss++;
  
    else if (epd.prob == 0.5)
      draw++;
    else {
      console.log('not a prob',epd.prob);
      process.exit();
    }
  }
  
  console.log('wins =',wins,'losses =',loss,'draws =',draw);
  console.log('error check =',epds.length - wins - draw - loss,'(should be 0)');
  
  //}}}
  //{{{  check decoding
  
  debug  = 1;
  var t1 = Date.now();
  
  for (var i=0; i < epds.length; i++) {
  
    if (i % 100000 == 0)
      process.stdout.write(i+'\r');
  
    var epd = epds[i];
  
    decodeFEN(epd.board, epd.stm);
  }
  
  var t2 = Date.now();
  
  decodeFEN('1P2kK2Q7888887n', 'w');
  if (!neti[321] || !neti[388] || !neti[5] || !neti[72] || !neti[703]) {
    console.log('decode pos');
    process.exit();
  }
  
  debug = 0;
  
  console.log('decoding ok',(t2-t1),'ms',epds.length,'epds');
  
  //}}}
  //{{{  time forward()
  
  var t1 = Date.now();
  
  var epd = epds[0];
  decodeFEN(epd.board, epd.stm);
  
  for (var i=0; i < epds.length; i++) {
    netForward()
  }
  
  var t2 = Date.now();
  
  console.log('netforward() timing',(t2-t1),'ms',epds.length,'epds');
  
  //}}}
  //{{{  tune
  
  var numBatches    = epds.length / batchSize | 0;
  var testPositions = epds.length * 0.2 | 0;
  var numEpochs     = 100000;
  
  console.log('hidden layer size =',netHiddenSize);
  console.log('batch size =',batchSize);
  console.log('batches per epoch =',numBatches);
  console.log('test positions =',testPositions);
  console.log('learning rate =',learningRate);
  
  netInitWeights();
  
  for (var epoch=0; epoch < numEpochs; epoch++) {
    //{{{  test
    
    var loss = 0;
    
    var t1 = Date.now();
    
    for (var i=0; i < testPositions; i++) {
    
      if (i % 10000 == 0)
        process.stdout.write(i+'\r');
    
      var epd = epds[i];
    
      decodeFEN(epd.board, epd.stm);
    
      netForward()
    
      var targets = [epd.prob];
    
      loss += netLoss(targets);
    }
    
    var t2 = Date.now();
    
    console.log ('epoch =',epoch,'loss =',loss/testPositions,t2-t1,'ms',testPositions,'epds');
    
    //}}}
    //{{{  batched epoch
    
    for (var batch=0; batch < numBatches; batch++) {
    
      if (batch % 100 == 0)
        process.stdout.write('epoch = ' + epoch + ' batch = ' + batch+'\r');
    
      netResetGradientSums();
    
      for (var i=0; i < batchSize; i++) {
    
        var epd = epds[(Math.random()*epds.length)|0];
    
        decodeFEN(epd.board, epd.stm);
    
        netForward()
    
        var targets = [epd.prob];
    
        netCalcGradients(targets);
        netAccumulateGradients();
      }
    
      netApplyGradients(batchSize,learningRate);
    }
    
    //}}}
    netSaveWeights();
  }
  
  console.log('done');
  
  //}}}
}

//}}}

//}}}
//{{{  kick it off

//var epdfile     = 'c:/projects/chessdata/E13.04-Filtered.fens';
//var resultparam = 6;

var epdfile     = 'c:/projects/chessdata/quiet-labeled.epd';
var resultparam = 5;

var thisPosition = 0;

const readline = require('readline');
const fs       = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream(epdfile),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {

  thisPosition += 1;

  if (thisPosition % 100000 == 0)
    process.stdout.write(thisPosition+'\r');

  if (thisPosition <= maxPositions) {

    line = line.replace(/(\/|\r\n|\n|\r)/gm,'');  // (inc removing / from fens)

    //console.log(line);

    const parts = line.split(' ');

    epds.push({board: parts[0].trim(),
               stm:   parts[1].trim(),
               prob:  getprob(parts[resultparam])});
  }
});

rl.on('close', function(){
  grunt();
});

//}}}

