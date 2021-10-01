
var maxPositions   = 100000000;
var netInputSize   = 768;
var netHiddenSize  = 16;
var numEpochs      = 2000;
var learningRate   = 0.04;
var batchSize      = 100;
var scale          = 0;

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
var debug   = 0;

//{{{  decodeFEN
//
// Also accumulates the hidden.in nnue style and creates a list of input
// vector elements that are 1.0 for calculating and accumulating gradients
// without scanning the whole input vector.
//

function decodeFEN(board, stmStr) {

  var x = 0;

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    hidden.in = 0.0;
  }

  for (var i=0; i<netInputSize; i++)
    neti[i] = 0.0;

  inNum = 0;

  var stm = chStm[stmStr];
  var sq  = 0;

  for (var j=0; j < board.length; j++) {

    var ch  = board.charAt(j);
    var num = chNum[ch];
    var col = 0;
    var pce = 0;

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

function sigmoid2(x) {
  var a = 0.004025;
  return (1.0 / (1.0 + Math.pow(10,-a*x)));
}

function dsigmoid2(x) {
  var a = 0.00978599;
  var b = Math.exp(a * x);
  return (a * b) / ((b + 1) * (b + 1));
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
    }
  }

  for (var o=0; o < netOutputSize; o++) {
    var output = neto[o];
    for (var h=0; h < netHiddenSize; h++) {
      output.weights[h] = 1 * (Math.random() * 2 - 1);
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
//{{{  netForward()             nnue
//
//  hidden.in is accumulated by decodeFen().
//

function netForward() {

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
    output.out = linear(output.in);
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
    output.gin  = dlinear(output.in) * output.gout;
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
    for (var i=0; i < inNum; i++) {
      hidden.gweights[inList[i]] = hidden.gin * neti[inList[i]];
    }
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
  }

  for (var h=0; h < netHiddenSize; h++) {
    var hidden = neth[h];
    for (var i=0; i < inNum; i++) {
      hidden.gweightssum[inList[i]] += hidden.gweights[inList[i]];
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
  var out = '//{{{  network\r\n\r\n';

  out += '// last update '+d;
  out += '\r\n';

  out += '// hidden layer = ' + netHiddenSize;
  out += '\r\n';
  out += '\r\n';

  out += 'this.netScale = ' + scale + ';';
  out += '\r\n';

  //out += '\r\n';

  for (var h=0; h < netHiddenSize; h++) {
    out = out + 'this.h1['+h+'].weights = [' + neth[h].weights.toString();
    out = out + '];\r\n';
    //out = out + '\r\n';
  }

  for (var o=0; o < netOutputSize; o++) {
    out = out + 'this.o1.weights = [' + neto[o].weights.toString();
    out = out + '];\r\n';
    //out = out + '\r\n';
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
  //{{{  scale
  
  var min = 99999999;
  var max = -99999999;
  
  for (var i=0; i < epds.length; i++) {
  
    var epd = epds[i];
  
    if (epd.lozeval > max)
      max = epd.lozeval;
  
    if (epd.lozeval < min)
      min = epd.lozeval;
  }
  
  scale = Math.max(max,Math.abs(min));
  
  console.log('min',min,'max',max,'scale',scale)
  
  var min = 99999999;
  var max = -99999999;
  
  for (var i=0; i < epds.length; i++) {
    var epd     = epds[i];
    epd.lozeval = epd.lozeval / scale;
  }
  
  for (var i=0; i < epds.length; i++) {
  
    var epd = epds[i];
  
    if (epd.lozeval > max)
      max = epd.lozeval;
  
    if (epd.lozeval < min)
      min = epd.lozeval;
  }
  
  console.log('min',min,'max',max)
  
  //}}}
  //{{{  check decoding
  
  debug  = 1;
  var t1 = Date.now();
  
  for (var i=0; i < epds.length; i++) {
  
    var epd = epds[i];
  
    decodeFEN(epd.board, epd.stm);
  }
  
  var t2 = Date.now();
  
  debug = 0;
  
  console.log('decoding ok',(t2-t1),'ms',epds.length,'epds');
  
  //}}}
  //{{{  tune
  
  var numBatches = epds.length / batchSize | 0;
  
  var loss = 0;
  
  console.log('input layer size =',netInputSize);
  console.log('hidden layer size =',netHiddenSize);
  console.log('batch size =',batchSize);
  console.log('batches per epoch =',numBatches);
  console.log('learning rate =',learningRate);
  
  netInitWeights();
  
  for (var epoch=0; epoch < numEpochs; epoch++) {
    //{{{  get loss
    
    lastLoss = loss;
    
    for (var i=0; i < epds.length; i++) {
    
      var epd = epds[i];
    
      decodeFEN(epd.board, epd.stm);
    
      netForward();
    
      var targets = [epd.lozeval];
    
      loss += netLoss(targets);
    
      if (Math.random() < 0.0000001) {
        console.log();
        console.log(epd.board,epd.stm,'-','-',epd.lozeval*scale,neto[0].out*scale);
        console.log();
      }
    }
    
    loss = loss / epds.length;
    
    console.log ('epoch =',epoch,'loss =',loss);
    
    //}}}
    //{{{  batched epoch
    
    for (var batch=0; batch < numBatches; batch++) {
    
      netResetGradientSums();
    
      for (var i=batch*batchSize; i < (batch+1)*batchSize; i++) {
    
        var epd = epds[i];
    
        decodeFEN(epd.board, epd.stm);
    
        netForward()
    
        var targets = [epd.lozeval];
    
        netCalcGradients(targets);
        netAccumulateGradients();
      }
    
      netApplyGradients(batchSize,learningRate);
    }
    
    //}}}
    netSaveWeights();
  }
  
  console.log('done');
  //{{{  try net
  
  //console.log('output weights',neto[0].weights.toString());
  
  for (var i=0; i < 10; i++) {
  
    var epd = epds[i];
  
    decodeFEN(epd.board, epd.stm);
  
    netForward();
  
    console.log(epd.board,epd.stm,'-','-',epd.lozeval*scale,neto[0].out*scale);
  
    //for (var j=0; j < netHiddenSize; j++) {
      //console.log(neth[j].in,neth[j].out);
    //}
  }
  
  //}}}
  
  //}}}
}

//}}}

//}}}
//{{{  kick it off

var epdfile      = process.argv[2];
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

    const parts = line.split(' ');

    if (parts.length != 7) {
      console.log('file format', line);
      process.exit();
    }

    epds.push({board:   parts[0],
               stm:     parts[1],
               lozeval: parseInt(parts[5]),
               sfeval:  parseInt(parts[6]),
               prob:    parseFloat(parts[4])});
  }
});

rl.on('close', function(){
  grunt();
});

//}}}

