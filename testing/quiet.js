//
// Copy lozza.js above here.
// 'lozza/trunk/testing/data/lozza-test.epd'
//

//var epdin    = 'data/lozza-test.epd';            // one quiet position.
//var wdl      = 10;
//var epdout   = 'data/lozza-test-quiet.epd';

//var epdin    = 'data/lozza.epd';                 // make with makeepd.bat.
//var wdl      = 10;
//var epdout   = 'data/lozza-quiet.epd';

var epdin    = 'data/quiet-labeled.epd';           //zurichess
var wdl      = 5;
var epdout   = 'data/quiet-labeled2.epd';

//var epdin    = 'data/eth.epd';                   //ethereal
//var wdl      = 6;
//var epdout   = 'data/eth2.epd';

//{{{  getprob

function getprob (r) {

  if (r == '[0.5]')
    return 0.5;
  else if (r == '[1.0]')
    return 1.0;
  else if (r == '[0.0]')
    return 0.0;

  else if (r == '"1/2-1/2"')
    return 0.5;
  else if (r == '"1-0"')
    return 1.0;
  else if (r == '"0-1"')
    return 0.0;

  else if (r == '0.5')
    return 0.5;
  else if (r == '1.0')
    return 1.0;
  else if (r == '0.0')
    return 0.0;

  else
    console.log('unknown result',r);
}

//}}}

var fs        = lozza.uci.nodefs;
var uci       = lozza.uci;
var board     = lozza.board;

var numepds   = 0;
var numquiet  = 0;
var out       = '';

fs.writeFileSync(epdout,'');

lozza.newGameInit();

const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(epdin),
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false
});

rl.on('line', function (line) {
  //{{{  get epds
  
  //{{{  valid line?
  
  if (!line.length) {
    return;
  }
  
  line = line.replace(/(\r\n|\n|\r|;)/gm,'');
  
  if (!line.length) {
    return;
  }
  
  var parts = line.split(' ');
  
  if (!parts.length) {
    return;
  }
  
  //if (parts.length != 11) {
    //console.log('line',line);
    //process.exit();
  //}
  
  //}}}
  
  numepds++;
  
  if (numepds % 100000 == 0)
    console.log('epds =', numepds, 'quiet =', numquiet, 'yield =', numquiet/numepds);
  
  if (1) {
    //{{{  position
    
    uci.spec.board    = parts[0];
    uci.spec.turn     = parts[1];
    uci.spec.rights   = parts[2];
    uci.spec.ep       = parts[3];
    uci.spec.fmc      = 0;
    uci.spec.hmc      = 0;
    uci.spec.id       = 'id';
    uci.spec.moves    = [];
    
    if (uci.spec.turn != 'w' && uci.spec.turn != 'b') {
      console.log('turn',uci.spec.turn);
      process.exit();
    }
    
    lozza.position();
    
    var nextTurn = ~board.turn & COLOR_MASK;
    
    //}}}
    //{{{  filter?
    
    if (1) {
      //{{{  in check?
      
      var inCheck  = board.isKingAttacked(nextTurn);
      
      if (inCheck) {
        //console.log(numepds,'FILTER INCHECK',parts[6],line);
        return;
      }
      
      //}}}
    }
    
    if (1) {
      //{{{  gives check?
      
      var inCheck  = board.isKingAttacked(board.turn);
      
      if (inCheck) {
        //console.log(numepds,'FILTER GIVESCHECK',parts[6],line);
        return;
      }
      
      //}}}
    }
    
    if (0) {
      //{{{  capture? yeild ~= 0.3
      
      var node = lozza.rootNode;
      var move = 0;
      
      node.cache();
      
      board.genMoves(node, board.turn);
      
      while (move = node.getNextMove()) {
      
        board.makeMove(node,move);
      
        if (board.isKingAttacked(nextTurn)) {
          board.unmakeMove(node,move);
          node.uncache();
          continue;                                // illegal.
        }
      
        board.unmakeMove(node,move);
        node.uncache();
        break;                                     // found first move.
      }
      
      if (!move) {
        //console.log(numepds,'FILTER NOMOVES',parts[6],line);
        return;                                    // no moves.
      }
      
      if ((move & MOVE_TOOBJ_MASK)) {
        //console.log(numepds,'FILTER CAPTURE',parts[6],board.formatMove(move,SAN_FMT),line);
        return;                                    // it's a capture.
      }
      
      if ((move & MOVE_EPTAKE_MASK)) {
        //console.log(numepds,'FILTER EP CAPTURE',parts[6],board.formatMove(move,SAN_FMT),line);
        return;                                    // it's a ep capture.
      }
      
      //}}}
    }
    
    if (1) {
      //{{{  e == q? yeild ~= 0.7
      
      var e = board.evaluate(board.turn);
      var q = lozza.qSearch(lozza.rootNode,0,board.turn,-INFINITY,INFINITY);
      
      if (isNaN(e)) {
        console.log('nan e',e);
        process.exit();
      }
      if (isNaN(q)) {
        console.log('nan q',q);
        process.exit();
      }
      
      if (Math.abs(q-e) != 0) {
        //console.log(numepds,'FILTER EVAL',parts[6],board.formatMove(move,SAN_FMT),line,e,q);
        return;
      }
      
      //}}}
    }
    
    //console.log(numepds,'KEEP',parts[6],board.formatMove(move,SAN_FMT));
    
    //}}}
  }
  
  numquiet++
  
  out += parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + parts[3] + ' ' + getprob(parts[wdl]) + '\r\n';
  
  if (out.length > 1000000) {
    fs.appendFileSync(epdout,out);
    out = '';
  }
  
  //}}}
});

rl.on('close', function(){
  //{{{  done
  
  if (out)
    fs.appendFileSync(epdout,out);
  
  console.log('epds =', numepds, 'quiet =', numquiet, 'yield =', numquiet/numepds);
  
  console.log('done');
  
  process.exit();
  
  //}}}
});

