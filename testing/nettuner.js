
var maxPositions   = 100000000;
var testFraction   = 0.2;
var netInputSize   = 768;
var netHiddenSize  = 16;
var numEpochs      = 20000;
var learningRate   = 0.1;
var batchSize      = 100;
//var useBias        = 0;

//{{{  constants

const WHITE = 0;
const BLACK = 1;

const KING   = 6;
const QUEEN  = 5;
const ROOK   = 4;
const BISHOP = 3;
const KNIGHT = 2;
const PAWN   = 1;

var chPce = [];
var chCol = [];
var chNum = [];
var chVal = [];

chVal['P'] = 1;
chVal['N'] = 3;
chVal['B'] = 3;
chVal['R'] = 5;
chVal['Q'] = 9;
chVal['K'] = 0;

chVal['p'] = -1;
chVal['n'] = -3;
chVal['b'] = -3;
chVal['r'] = -5;
chVal['q'] = -9;
chVal['k'] = 0;

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

//}}}
//{{{  functions

var epds    = [];
var outputs = [];
var debug   = 0;

//{{{  getprob

function getprob (r) {
  if (r == '[0.5]')
    return 0.5;
  else if (r == '[1.0]')
    return 1.0;
  else if (r == '[0.0]')
    return 0.0;
  else if (r == '"1/2-1/2";')
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
//
// Also accumulates the hidden.in nnue style and creates a list of input
// vector elements that are 1.0 for calculating and accumulating gradients
// without scanning the whole input vector.
//

function decodeFEN(board) {

  var mat = 0;

  //console.log(board);

  var x = 0;

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    hidden.in = 0.0;
  }

  for (var i=0; i<netInputSize; i++)
    neti[i] = 0.0;

  inNum = 0;

  var sq  = 0;

  for (var j=0; j < board.length; j++) {

    var ch = board.charAt(j);

    if (ch == '/')
      continue;

    var num = chNum[ch];
    var col = 0;
    var pce = 0;

    if (typeof(num) == 'undefined') {
      //{{{  decode ch
      
      pce = chPce[ch];
      col = chCol[ch];
      
      mat += chVal[ch];
      
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
        else if (pce < 1) {
          console.log('pce<0',pce);
          process.exit();
        }
        else if (pce > 6) {
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
      }
      
      //}}}
      //{{{  map to model
      
      if (col == WHITE)
        x = 0   + (pce-1) * 64 + sq;
      else
        x = 384 + (pce-1) * 64 + sq;
      
      if (debug) {
        if (isNaN(x)) {
          console.log('xnan',x);
          process.exit();
        }
        if (x >= 768) {
          console.log('x>768',x);
          process.exit();
        }
        if (x < 0) {
          console.log('x-ve',x);
          process.exit();
        }
      }
      
      //}}}
      neti[x] = 1.0;
      for (var h=0; h < netHiddenSize; h++) {
        var hidden = neth[h];
        hidden.in += hidden.weights[x];
      }
      inList[inNum] = x;
      inNum++;
      sq++;
    }
    else {
      sq += num;
    }
  }

  return mat;
}

//}}}
//{{{  network

var netOutputSize  = 1;    // output layer.

//{{{  build net

function netNode (weightsSize) {
  this.in          = 0;
  this.gin         = 0;
  this.out         = 0;
  this.gout        = 0;
  this.weights     = Array(weightsSize);
  this.gweights    = Array(weightsSize);
  this.gweightssum = Array(weightsSize);
  this.adagrad     = Array(weightsSize);
  //this.bias        = 0;
  //this.gbias       = 0;
  //this.gbiassum    = 0;
  //this.biasag      = 0;
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

var inList = Array(32);
var inNum  = 0;

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
//{{{  linear

function linear(x) {
  return x;
}

function dlinear(x) {
  return 1.0;
}

//}}}
//{{{  leelaEval

function leelaEval(s) {

  s = (s - 0.5) + 2;

  return 111.714640912 * Math.tan(1.5620688421 * s);

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
//{{{  netInitWeights()

function netInitWeights() {

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      hidden.weights[i] = 1 * (Math.random() * 2 - 1);
      hidden.adagrad[i] = 0;
    }
    //hidden.bias   = 0;
    //hidden.biasag = 0;
  }

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      output.weights[h] = 1 * (Math.random() * 2 - 1);
      output.adagrad[h] = 0;
    }
    //output.bias   = 0;
    //output.biasag = 0;
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
    //output.gbiassum = 0.0;
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      hidden.gweightssum[i] = 0.0;
    }
    //hidden.gbiassum = 0.0;
  }
}

//}}}
//{{{  netForward()             nnue
//
//  hidden.in is accumulated by decodeFen().
//

function netForward(mat) {

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    hidden.out = relu(hidden.in);
  }

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    output.in = 0;
    for (var h=0; h < netHiddenSize; h++) {
      output.in += output.weights[h] * neth[h].out;
    }
    output.out = sigmoid(output.in + mat);
  }
}

//}}}
//{{{  netCalcGradients()       nnue

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
    //output.gbias = output.gin * 1;
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
    for (var i=0; i < inNum; i++) {
      hidden.gweights[inList[i]] = hidden.gin * neti[inList[i]];
    }
    //hidden.gbias = hidden.gin * 1;
  }
}

//}}}
//{{{  netAccumulateGradients() nnue

function netAccumulateGradients() {

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      output.gweightssum[h] += output.gweights[h];
    }
    //output.gbiassum += output.gbias;
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < inNum; i++) {
      hidden.gweightssum[inList[i]] += hidden.gweights[inList[i]];
    }
    //hidden.gbiassum += hidden.gbias;
  }
}

//}}}
//{{{  netApplyGradients()

function netApplyGradients() {

  var gr = 0;
  var lr = 0;

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      gr = output.gweightssum[h] / batchSize;
      output.adagrad[h] += gr * gr;
      lr = learningRate / Math.sqrt(output.adagrad[h] + 1e-8);
      output.weights[h] -= lr * gr;
    }
    //gr = output.gbiassum / batchSize;
    //output.biasag += gr * gr;
    //lr = learningRate / Math.sqrt(output.biasag + 1e-8);
    //output.bias -= lr * gr;
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < netInputSize; i++) {
      gr = hidden.gweightssum[i] / batchSize;
      hidden.adagrad[i] += gr * gr;
      lr = learningRate / Math.sqrt(hidden.adagrad[i] + 1e-8);
      hidden.weights[i] -= lr * gr;
    }
    //gr = hidden.gbiassum / batchSize;
    //hidden.biasag += gr * gr;
    //lr = learningRate / Math.sqrt(hidden.biasag + 1e-8);
    //hidden.bias -= lr * gr;
  }
}

//}}}
//{{{  netSaveWeights

function netSaveWeights () {

  var d   = new Date();
  var out = '//{{{  network\r\n\r\n';

  out += '// last update '+d;
  out += '\r\n';

  out += '// hidden layer = ' + netHiddenSize;
  out += '\r\n';
  out += '\r\n';

  for (var h=0; h < netHiddenSize; h++) {
    out = out + 'this.h1['+h+'].weights = [' + neth[h].weights.toString();
    out = out + '];\r\n';
    //out = out + 'this.h1.bias = ' + neth[h].bias + ';\r\n';
  }

  for (var o=0; o < netOutputSize; o++) {
    out = out + 'this.o1.weights = [' + neto[o].weights.toString();
    out = out + '];\r\n';
    //out = out + 'this.o1.bias = ' + neto[o].bias + ';\r\n';
  }

  out = out + '\r\n//}}}\r\n\r\n';

  fs.writeFileSync('nettune' + netHiddenSize + '.txt',out);
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
  
  for (var i=0; i < epds.length/100|0; i++) {
  
    var epd = epds[i];
  
    decodeFEN(epd.board);
  }
  
  var t2 = Date.now();
  
  debug = 0;
  
  console.log('decoding ok',(t2-t1),'ms',epds.length,'epds');
  
  //}}}
  //{{{  tune
  
  var testPositions = epds.length * testFraction | 0;
  var tunePositions = epds.length - testPositions;
  
  var numBatches = tunePositions / batchSize | 0;
  
  var loss     = 0;
  var bestLoss = 100;
  
  console.log('test positions =',testPositions);
  console.log('tune positions =',tunePositions);
  console.log('input layer size =',netInputSize);
  console.log('hidden layer size =',netHiddenSize);
  console.log('batch size =',batchSize);
  console.log('batches per epoch =',numBatches);
  console.log('learning rate =',learningRate);
  //console.log('use bias =',useBias);
  
  netInitWeights();
  
  for (var epoch=0; epoch < numEpochs; epoch++) {
    //{{{  get loss
    
    lastLoss = loss;
    
    for (var i=0; i < testPositions; i++) {
    
      var epd = epds[i];
    
      var mat = decodeFEN(epd.board);
    
      netForward(mat);
    
      var targets = [epd.prob];
    
      loss += netLoss(targets);
    }
    
    loss = loss / epds.length;
    
    var d = '+';
    
    if (loss < bestLoss) {
      d = '-';
      bestLoss = loss;
      netSaveWeights();
    }
    
    console.log ('epoch =',epoch,'loss =',loss,d);
    
    //}}}
    //{{{  batched epoch
    
    for (var batch=0; batch < numBatches; batch++) {
    
      if (batch % 10000 == 0)
        process.stdout.write('epoch ' + epoch + ', batch ' + batch + '\r');
    
      netResetGradientSums();
    
      for (var i = testPositions + batch*batchSize; i < testPositions + (batch+1)*batchSize; i++) {
    
        var epd = epds[i];
    
        var mat = decodeFEN(epd.board);
    
        netForward(mat)
    
        var targets = [epd.prob];
    
        netCalcGradients(targets);
        netAccumulateGradients();
      }
    
      netApplyGradients();
    }
    
    //}}}
  }
  
  console.log('done');
  
  //}}}
}

//}}}

//}}}
//{{{  kick it off

var epdfile      = 'c:/projects/chessdata/rebel.epd';
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

    line = line.replace(/(\r\n|\n|\r)/gm,'');
    line = line.replace(/=/gm,' ');

    const parts = line.split(' ');

    //{{{  get prob
    
    var stm  = parts[1];
    var prob = parseFloat(parts[9]);
    
    if (stm != 'w' && stm != 'b') {
      console.log('stm',stm,line);
      process.exit();
    }
    
    if (prob != 0.0 && prob != 0.5 && prob != 1.0) {
      console.log('prob',prob,line);
      process.exit();
    }
    
    if (stm == 'b') {
      if (prob == 0.0) {
        prob = 1.0;
      }
      else if (prob == 1.0) {
        prob = 0.0;
      }
    }
    
    //}}}

    epds.push({board:   parts[0],
               prob:    prob});
  }
});

rl.on('close', function(){
  grunt();
});

//}}}

