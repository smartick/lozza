//
// https://github.com/op12no2/lozza
//
// A Javascript chess engine inspired by Fabien Letouzey's Fruit 2.1.
//
// Use lozza.js from the latest release on github for best performance.  // ##ifdef
// This file includes debug code that is stripped out on release.        // ##ifdef
//                                                                       // ##ifdef

var BUILD       = "2.2";
var BUILD       = "2.2dev";  // ##ifdef
var USEPAWNHASH = 1;
var USEPAWNHASH = 0;         // ##ifdef
var LICHESS     = 0;

//{{{  history
/*

2.2 23/02/22 Don't use TT in PV node.

##ifdef 2.1 14/02/22 Non-linear mobility.
##ifdef 2.1 11/02/22 Split up mobility into mobility, tightness and tension.
##ifdef 2.1 28/01/22 Add Lichess support.
##ifdef 2.1 21/01/22 Fixate on one square in Q search from depth -12.
##ifdef 2.1 12/01/22 Retune using gd tuner.
##ifdef 2.1 06/01/22 Add eval feature extraction code (for gd tuner) which is removed on release.
##ifdef 2.1 06/01/22 Extract imbalance as a separate eval term.
##ifdef 2.1 20/12/21 Handle old node versions WRT stdin.resume(). I think.
##ifdef 2.1 17/12/21 Optimise pruning to pre makeMove().
##ifdef
##ifdef 2.0a 27/09/21 Fix timeouts.
##ifdef 2.0a 27/09/21 Add USEPAWNHASH - useful when testing.
##ifdef 2.0a 27/09/21 Set mob offsets to 0 while buggy.
##ifdef
##ifdef 2.0 19/02/21 Add imbalance terms when no pawns.
##ifdef 2.0 17/02/21 Tune all eval params.
##ifdef 2.0 16/02/21 Swap mate and draw testing order in search.
##ifdef 2.0 12/02/21 Do LMR earlier.
##ifdef 2.0 11/02/21 Add draft bench command.
##ifdef 2.0 10/02/21 Use pre generated random numbers using https://github.com/davidbau/seedrandom.
##ifdef 2.0 10/02/21 Use depth^3 (>=beta), depth^2 (>=alpha) and -depth  (< alpha) for history.
##ifdef 2.0 09/02/21 Add -ve history scores for moves < alpha.
##ifdef 2.0 08/02/21 Don't do LMP in a pvNode. We need a move!
##ifdef 2.0 07/02/21 Don't _try and reduce when in check (optimisation).
##ifdef 2.0 06/02/21 Remove support for jsUCI.
##ifdef 2.0 23/01/21 Tune piece values and PSTs.
##ifdef 2.0 10/01/21 Rearrange eval params so they can be tuned.
##ifdef 2.0 03/01/21 Simplify phase and eval calc.
##ifdef
##ifdef 1.18 Don't pseudo-move king adjacent to king.
##ifdef 1.18 Fix black king endgame PST.
##ifdef 1.18 Fix tapered eval calc.
##ifdef 1.18 Fix alpha/beta mate predicates.
##ifdef 1.18 Fix trapped knights bug (thanks Tamas).
##ifdef 1.18 Fix hash table put bug.
##ifdef 1.18 Add depth element to LMR.
##ifdef 1.18 Increase pruning.
##ifdef 1.18 Remove alpha TT saves in move loop.
##ifdef 1.18 Better tempo.
##ifdef 1.18 Better king safety.
##ifdef 1.18 Better passed pawn eval.
##ifdef 1.18 Fix TC.
##ifdef
##ifdef 1.17 Min move time of 10ms.
##ifdef 1.17 Change futility to depth <= 4 (from 5).
##ifdef 1.17 Use TT at root.
##ifdef 1.17 Increase LMR a bit.
##ifdef 1.17 Add eval tempo back in.
##ifdef 1.17 Remove phase from extend expression.
##ifdef 1.17 R=3 always in NMP.
##ifdef
##ifdef 1.16 Rearrange eval to be based on parts of the Toga User Manual (i.e. Fruit 2.1).
##ifdef 1.16 Send node count back when PV is updated.
##ifdef 1.16 Include non capture promotions in QS.
##ifdef 1.16 Fix unstoppable passer WRT hash (using king squares and turn).
##ifdef 1.16 Fix unstoppable passer values.
##ifdef 1.16 Improve pawn eval.
##ifdef 1.16 Fix bug with futility/LMR.
##ifdef 1.16 Remove tempo from eval.
##ifdef 1.16 Only score knight outputs if isolated from enemy pawns.
##ifdef 1.16 Use fail soft in QS.
##ifdef 1.16 Don't return from QSearch root if in check.
##ifdef 1.16 Reduce futility severity.
##ifdef 1.16 Add king attacks and knight outposts to eval and tidy eval up a bit..
##ifdef 1.16 Don't prune killers!
##ifdef 1.16 Use bits for pawn eval.
##ifdef
##ifdef 1.15 Fix move rank overflow.
##ifdef 1.15 add SQ* constants.
##ifdef 1.15 change futility to 50.
##ifdef 1.15 increase history range.
##ifdef 1.15 Add R|Q on 7th bonus.
##ifdef 1.15 Change futility to 60.
##ifdef 1.15 Change queen to 1000.
##ifdef 1.15 Jiggle what is and isn't predicated on mate scores.
##ifdef 1.15 Add # to PV if mate score.
##ifdef 1.15 Fix queening SAN format.
##ifdef 1.15 Dump arbitrary passed bonuses.
##ifdef 1.15 Dump Connectivity PSTs. They were making passed pawns stop.
##ifdef 1.15 Use a passed pawn PST based on Fruit curve.
##ifdef 1.15 Change PVS condition to !bestMove from numLegalMoves == 1.
##ifdef 1.15 Use Fruit 2.1 piece PSTs.
##ifdef 1.15 Add && !betaMate to futility condition.
##ifdef 1.15 Don't do root Q futility.
##ifdef 1.15 Change double time from 5 to 3 moves after opening.
##ifdef 1.15 Fix +inc time control.
##ifdef 1.15 Add some typed arrays to help V8.
##ifdef 1.15 Tweaks to stop some V8 deoptimising.
##ifdef 1.15 Don't call eval if in check in alphabeta().
##ifdef 1.15 Speed up Q move gen.
##ifdef 1.15 Speed up move gen.
##ifdef 1.15 Speed up mobility;
##ifdef 1.15 Speed up isAttacked();
##ifdef
##ifdef 1.14 Add massive bonus for pawn-supported pawn on 7th rank.
##ifdef 1.14 Don't futility away pawn pushes to 6th rank.
##ifdef 1.14 Fix how PV is displayed WRT hash loops.
##ifdef 1.14 Send node info with PV for ChessGUI, fix hashUsed info.
##ifdef 1.14 Redo how host is detected.
##ifdef 1.14 Add time when fail low at root.
##ifdef 1.14 Add time for first 5 moves after opening.
##ifdef 1.14 Be less confident about time left as number of moves increases.
##ifdef 1.14 Fix time control for increments.
##ifdef 1.14 Reset the stats on the go command.
##ifdef 1.14 Get synchronous PV working with node.js on Windows.
##ifdef 1.14 Check for draws before anything else.
##ifdef 1.14 Don't assume hash move is legal.
##ifdef 1.14 Use |0 as needed and don't use Math.floor() or Math.round() in critical places.
##ifdef 1.14 Remove alphaMate.
##ifdef 1.14 Don't make beta pruning and null move dependent on betaMate.
##ifdef 1.13 Add support for node.js allowing Lozza to run on any platform that supports node.js.
##ifdef 1.13 Send stats back to host early to reset counters.
##ifdef 1.13 Use O not 0 for castling to avoid potential expression confusion.
##ifdef
##ifdef 1.12 Add untuned mobility to eval.
##ifdef 1.12 Tweak King safety.
##ifdef 1.12 Enable LMP now we're using history for move ordering.
##ifdef 1.12 Remove ugly castling running eval in makeMove.
##ifdef 1.12 Increase LMR because of history based move ordering.
##ifdef 1.12 Use history (and PSTs if no history) for move ordering.
##ifdef
##ifdef 1.11 No null move if lone king.
##ifdef 1.11 Change to always write TT, no exceptions.
##ifdef 1.11 Make a micro adjustment to the way Zobrist randoms are generated.
##ifdef 1.11 Implement UCI info hashfull.
##ifdef
##ifdef 1.10 Fix occasional null PVs.
##ifdef 1.10 Fix promotion not being allowed by the web UI.
##ifdef 1.10 Add board, stop, start, clear, id, ping & eval to UCI console.
##ifdef 1.10 Add verbose option to evaluate.
##ifdef
##ifdef 1.9 Add late move pruning.
##ifdef 1.9 Rearrange things a bit.
##ifdef
##ifdef 1.8 Untuned isolated pawns.
##ifdef 1.8 Add pawn hash.
##ifdef 1.8 Use ply (not whole moves) for UCI mate scores.
##ifdef 1.8 Fix bug with best move sometimes being the wrong one because of a timeout.
##ifdef
##ifdef 1.7 Fix LMR condition in root search.
##ifdef 1.7 Untuned beta pruning.
##ifdef 1.7 Untuned passed/doubled pawns.
##ifdef 1.7 Untuned king safety.
##ifdef
##ifdef 1.6 Use end game PSTs for move ordering.
##ifdef 1.6 Only do futility if depth <= 5.
##ifdef 1.6 Check for illegal position by detecting 0 moves at root.
##ifdef 1.6 Fix UCI "mate" score.
##ifdef 1.6 More traditional extension/reduction arrangement.
##ifdef
##ifdef 1.5 Tweak LMR constants.
##ifdef
##ifdef 1.4 Better castling rights update.
##ifdef 1.4 Change futility thresholds.
##ifdef
##ifdef 1.3 Never futility away all moves; do at least one.
##ifdef 1.3 Tweak time controls.
##ifdef
##ifdef 1.2 Point nodes at board so global lookup not needed.
##ifdef 1.2 Add piece lists.
##ifdef
##ifdef 1.1 50 move draw rule.
##ifdef 1.1 Add K+B|N v K+B|N as insufficient material in eval.
##ifdef
##ifdef 1.0 Only reset TT on UCINEWGAME command.  Seems to work OK at last.
##ifdef
##ifdef 0.9 Encode mate scores for UI.
##ifdef 0.9 Use separate PSTs for move ordering.
##ifdef
##ifdef 0.8 use simple arrays for piece counts and add colour counts.
##ifdef 0.8 Split runningEval into runningEvalS and runningEval E and combine in evaluate();
##ifdef 0.8 Inline various functions.
##ifdef
##ifdef 0.7 Fix repetition detection at last.
##ifdef
##ifdef 0.6 Base LMR on the move base.
##ifdef 0.6 Just use > alpha for LMR research.
##ifdef 0.6 Fix hash update bugs.
##ifdef 0.6 move mate distance and rep check tests to pre horizon.
##ifdef 0.6 Only extend at root and if depth below horizon.
##ifdef 0.6 Remove lone king.
##ifdef
##ifdef 0.5 Mate distance pruning.
##ifdef 0.5 No LMR if lone king.
##ifdef
##ifdef 0.4 No null move if a lone king on the board.
##ifdef 0.4 Add detection of insufficient material draws.
##ifdef 0.4 Add very primitive king safety to eval.
##ifdef 0.4 Change pCounts into wCount and bCount.
##ifdef 0.4 Set contempt to 0.
##ifdef 0.4 Fix fail soft QS bug on beta cut.
##ifdef
##ifdef 0.3 Facilitate N messages in one UCI message string.
##ifdef 0.3 Fix bug where search() and alphabeta() returned -INFINITY instead of oAlpha.
##ifdef 0.3 Adjust MATE score in TT etc.
##ifdef
##ifdef 0.2 Allow futility to filter all moves and return oAlpha in that case.
##ifdef 0.2 Fix infinite loops when showing PV.
##ifdef 0.2 Fix mate killer addition condition.
##ifdef 0.2 Generalise bishop counting using board.pCounts.
##ifdef 0.2 Don't allow a killer to be the (current) hash.
##ifdef 0.2 Don't research ALL node LMR fails unless R is set!
##ifdef 0.2 Arrange things so that QS doesn't use or affect node killers/hashes etc.  In tests it's less nodes.
##ifdef 0.2 Increase asp window and add time on ID research.
##ifdef 0.2 Add crude bishop pair bonus imp.  NB: updating a piece count array using a[i]++ and a[i]-- was too slow!!
##ifdef 0.2 Use tapered PSTs.
##ifdef
##ifdef 0.1 Fix bug in QS.  It *must not* fail soft.
##ifdef
*/

//}}}
//{{{  detect host

var HOST_WEB     = 0;
var HOST_NODEJS  = 1;
var HOST_CONSOLE = 2;
var HOSTS        = ['Web','Node','Console'];

var lozzaHost = HOST_WEB;
var UILAG     = 500;

if ((typeof process) != 'undefined') {
  lozzaHost = HOST_NODEJS;
  UILAG     = 10000;
}

else if ((typeof WorkerGlobalScope) == 'undefined') {
  lozzaHost = HOST_CONSOLE;
  UILAG     = 10000;
}

//}}}
//{{{  funcs

//{{{  myround

function myround(x) {
  return Math.sign(x) * Math.round(Math.abs(x));
}

//}}}
//{{{  wbmap
//
// Removed on release.
//

function wbmap (sq) {          // ##ifdef
  var m = (143-sq)/12|0;       // ##ifdef
  return 12*m + sq%12;         // ##ifdef
}                              // ##ifdef

//}}}

//}}}

//{{{  constants

//{{{  feature weight indexes

var iSPARE0               = 0;
var iSPARE1               = 1;
var iSPARE2               = 2;
var iSPARE3               = 3;
var iSPARE4               = 4;
var iSPARE5               = 5;
var iSPARE6               = 6;
var iSPARE7               = 7;
var iATT_N                = 8;
var iATT_B                = 9;
var iATT_R                = 10;
var iATT_Q                = 11;
var iSPARE12              = 12;
var iPAWN_DOUBLED_S       = 13;
var iPAWN_DOUBLED_E       = 14;
var iPAWN_ISOLATED_S      = 15;
var iPAWN_ISOLATED_E      = 16;
var iPAWN_BACKWARD_S      = 17;
var iPAWN_BACKWARD_E      = 18;
var iPAWN_PASSED_OFFSET_S = 19;
var iPAWN_PASSED_OFFSET_E = 20;
var iPAWN_PASSED_MULT_S   = 21;
var iPAWN_PASSED_MULT_E   = 22;
var iTWOBISHOPS_S         = 23;
var iROOK7TH_S            = 24;
var iROOK7TH_E            = 25;
var iROOKOPEN_S           = 26;
var iROOKOPEN_E           = 27;
var iQUEEN7TH_S           = 28;
var iQUEEN7TH_E           = 29;
var iTRAPPED_S            = 30;
var iKING_PENALTY         = 31;
var iPAWN_OFFSET_S        = 32;
var iPAWN_OFFSET_E        = 33;
var iPAWN_MULT_S          = 34;
var iPAWN_MULT_E          = 35;
var iPAWN_PASS_FREE       = 36;
var iPAWN_PASS_UNSTOP     = 37;
var iPAWN_PASS_KING1      = 38;
var iPAWN_PASS_KING2      = 39;
var iSPARE40              = 40;
var iSPARE41              = 41;
var iSPARE42              = 42;
var iSPARE43              = 43;
var iSPARE44              = 44;
var iSPARE45              = 45;
var iTWOBISHOPS_E         = 46;
var iTEMPO_S              = 47;
var iTEMPO_E              = 48;
var iTRAPPED_E            = 49;
var iTIGHT_NS             = 50;
var iTIGHT_NE             = 51;
var iTIGHT_BS             = 52;
var iTIGHT_BE             = 53;
var iTIGHT_RS             = 54;
var iTIGHT_RE             = 55;
var iTIGHT_QS             = 56;
var iTIGHT_QE             = 57;
var iTENSE_NS             = 58;
var iTENSE_NE             = 59;
var iTENSE_BS             = 60;
var iTENSE_BE             = 61;
var iTENSE_RS             = 62;
var iTENSE_RE             = 63;
var iTENSE_QS             = 64;
var iTENSE_QE             = 65;

//}}}

var MAX_PLY         = 100;                // limited by lozza.board.ttDepth bits.
var MAX_MOVES       = 250;
var INFINITY        = 30000;              // limited by lozza.board.ttScore bits.
var MATE            = 20000;
var MINMATE         = MATE - 2*MAX_PLY;
var CONTEMPT        = 0;
var NULL_Y          = 1;
var NULL_N          = 0;
var INCHECK_UNKNOWN = MATE + 1;
var TTSCORE_UNKNOWN = MATE + 2;
var ASP_MAX         = 75;
var ASP_DELTA       = 3;
var ASP_MIN         = 10;
var EMPTY           = 0;
var UCI_FMT         = 0;
var SAN_FMT         = 1;

var WHITE   = 0x0;                // toggle with: ~turn & COLOR_MASK
var BLACK   = 0x8;
var I_WHITE = 0;                  // 0/1 colour index, compute with: turn >>> 3
var I_BLACK = 1;
var M_WHITE = 1;
var M_BLACK = -1;                 // +1/-1 colour multiplier, compute with: (-turn >> 31) | 1

var PIECE_MASK = 0x7;
var COLOR_MASK = 0x8;

var VALUE_PAWN = 100;             // safe - tuning root

const TTSIZE = 1 << 24;
const TTMASK = TTSIZE - 1;

const PTTSIZE = 1 << 14;
const PTTMASK = PTTSIZE - 1;

var TT_EMPTY  = 0;
var TT_EXACT  = 1;
var TT_BETA   = 2;
var TT_ALPHA  = 3;

var PTT_EXACT = 1;
var PTT_WHOME = 2;
var PTT_BHOME = 4;
var PTT_WPASS = 8;
var PTT_BPASS = 16;

//                                 Killer?
// max            9007199254740992
//

var BASE_HASH       =  40000012000;  // no
var BASE_PROMOTES   =  40000011000;  // no
var BASE_GOODTAKES  =  40000010000;  // no
var BASE_EVENTAKES  =  40000009000;  // no
var BASE_EPTAKES    =  40000008000;  // no
var BASE_MATEKILLER =  40000007000;
var BASE_MYKILLERS  =  40000006000;
var BASE_GPKILLERS  =  40000005000;
var BASE_CASTLING   =  40000004000;  // yes
var BASE_BADTAKES   =  40000003000;  // yes
var BASE_HISSLIDE   =  20000002000;  // yes
var BASE_PSTSLIDE   =         1000;  // yes

var BASE_LMR        = BASE_BADTAKES;

var MOVE_TO_BITS      = 0;
var MOVE_FR_BITS      = 8;
var MOVE_TOOBJ_BITS   = 16;
var MOVE_FROBJ_BITS   = 20;
var MOVE_PROMAS_BITS  = 29;

var MOVE_TO_MASK       = 0x000000FF;
var MOVE_FR_MASK       = 0x0000FF00;
var MOVE_TOOBJ_MASK    = 0x000F0000;
var MOVE_FROBJ_MASK    = 0x00F00000;
var MOVE_PAWN_MASK     = 0x01000000;
var MOVE_EPTAKE_MASK   = 0x02000000;
var MOVE_EPMAKE_MASK   = 0x04000000;
var MOVE_CASTLE_MASK   = 0x08000000;
var MOVE_PROMOTE_MASK  = 0x10000000;
var MOVE_PROMAS_MASK   = 0x60000000;  // NBRQ.
var MOVE_SPARE2_MASK   = 0x80000000;

var MOVE_SPECIAL_MASK  = MOVE_CASTLE_MASK | MOVE_PROMOTE_MASK | MOVE_EPTAKE_MASK | MOVE_EPMAKE_MASK; // need extra work in make move.
var KEEPER_MASK        = MOVE_CASTLE_MASK | MOVE_PROMOTE_MASK | MOVE_EPTAKE_MASK | MOVE_TOOBJ_MASK;  // futility etc.

var NULL   = 0;
var PAWN   = 1;
var KNIGHT = 2;
var BISHOP = 3;
var ROOK   = 4;
var QUEEN  = 5;
var KING   = 6;
var EDGE   = 7;
var NO_Z   = 8;

var W_PAWN   = PAWN;
var W_KNIGHT = KNIGHT;
var W_BISHOP = BISHOP;
var W_ROOK   = ROOK;
var W_QUEEN  = QUEEN;
var W_KING   = KING;

var B_PAWN   = PAWN   | BLACK;
var B_KNIGHT = KNIGHT | BLACK;
var B_BISHOP = BISHOP | BLACK;
var B_ROOK   = ROOK   | BLACK;
var B_QUEEN  = QUEEN  | BLACK;
var B_KING   = KING   | BLACK;

//
// E == EMPTY, X = OFF BOARD, - == CANNOT HAPPEN
//
//               0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
//               E  W  W  W  W  W  W  X  -  B  B  B  B  B  B  -
//               E  P  N  B  R  Q  K  X  -  P  N  B  R  Q  K  -
//

var IS_O      = [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0];
var IS_E      = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var IS_OE     = [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0];
var IS_KN     = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
var IS_K      = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
var IS_N      = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
var IS_P      = [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];

var IS_NBRQKE = [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0]
var IS_RQKE   = [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0]
var IS_QKE    = [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0]

var IS_WNBRQ  = [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var IS_WRQ    = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var IS_WQ     = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

var IS_BNBRQ  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0]
var IS_BRQ    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0]
var IS_BQ     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]

var IS_W      = [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var IS_WE     = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var IS_WP     = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var IS_WN     = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var IS_WB     = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var IS_WBQ    = [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var IS_WRQ    = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var IS_B      = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0];
var IS_BE     = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0];
var IS_BP     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
var IS_BN     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
var IS_BB     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
var IS_BBQ    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0];
var IS_BRQ    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0];

var PPHASE = 0;
var NPHASE = 1;
var BPHASE = 1;
var RPHASE = 2;
var QPHASE = 4;
var VPHASE = [0,PPHASE,NPHASE,BPHASE,RPHASE,QPHASE,0];
var TPHASE = PPHASE*16 + NPHASE*4 + BPHASE*4 + RPHASE*4 + QPHASE*2;
var EPHASE = 16;  //  Don't do Q futility after this.

var W_PROMOTE_SQ = [0,26, 27, 28, 29, 30, 31, 32, 33];
var B_PROMOTE_SQ = [0,110,111,112,113,114,115,116,117];

var A1 = 110, B1 = 111, C1 = 112, D1 = 113, E1 = 114, F1 = 115, G1 = 116, H1 = 117;
var A8 = 26,  B8 = 27,  C8 = 28,  D8 = 29,  E8 = 30,  F8 = 31,  G8 = 32,  H8 = 33;

var SQA1 = 110, SQB1 = 111, SQC1 = 112, SQD1 = 113, SQE1 = 114, SQF1 = 115, SQG1 = 116, SQH1 = 117;
var SQA2 = 98,  SQB2 = 99,  SQC2 = 100, SQD2 = 101, SQE2 = 102, SQF2 = 103, SQG2 = 104, SQH2 = 105;
var SQA3 = 86,  SQB3 = 87,  SQC3 = 88,  SQD3 = 89,  SQE3 = 90,  SQF3 = 91,  SQG3 = 92,  SQH3 = 93;
var SQA4 = 74,  SQB4 = 75,  SQC4 = 76,  SQD4 = 77,  SQE4 = 78,  SQF4 = 79,  SQG4 = 80,  SQH4 = 81;
var SQA5 = 62,  SQB5 = 63,  SQC5 = 64,  SQD5 = 65,  SQE5 = 66,  SQF5 = 67,  SQG5 = 68,  SQH5 = 69;
var SQA6 = 50,  SQB6 = 51,  SQC6 = 52,  SQD6 = 53,  SQE6 = 54,  SQF6 = 55,  SQG6 = 56,  SQH6 = 57;
var SQA7 = 38,  SQB7 = 39,  SQC7 = 40,  SQD7 = 41,  SQE7 = 42,  SQF7 = 43,  SQG7 = 44,  SQH7 = 45;
var SQA8 = 26,  SQB8 = 27,  SQC8 = 28,  SQD8 = 29,  SQE8 = 30,  SQF8 = 31,  SQG8 = 32,  SQH8 = 33;

var MOVE_E1G1 = MOVE_CASTLE_MASK | (W_KING << MOVE_FROBJ_BITS) | (E1 << MOVE_FR_BITS) | G1;
var MOVE_E1C1 = MOVE_CASTLE_MASK | (W_KING << MOVE_FROBJ_BITS) | (E1 << MOVE_FR_BITS) | C1;
var MOVE_E8G8 = MOVE_CASTLE_MASK | (B_KING << MOVE_FROBJ_BITS) | (E8 << MOVE_FR_BITS) | G8;
var MOVE_E8C8 = MOVE_CASTLE_MASK | (B_KING << MOVE_FROBJ_BITS) | (E8 << MOVE_FR_BITS) | C8;

var QPRO = (QUEEN-2)  << MOVE_PROMAS_BITS | MOVE_PROMOTE_MASK;
var RPRO = (ROOK-2)   << MOVE_PROMAS_BITS | MOVE_PROMOTE_MASK;
var BPRO = (BISHOP-2) << MOVE_PROMAS_BITS | MOVE_PROMOTE_MASK;
var NPRO = (KNIGHT-2) << MOVE_PROMAS_BITS | MOVE_PROMOTE_MASK;

var WHITE_RIGHTS_KING  = 0x00000001;
var WHITE_RIGHTS_QUEEN = 0x00000002;
var BLACK_RIGHTS_KING  = 0x00000004;
var BLACK_RIGHTS_QUEEN = 0x00000008;
var WHITE_RIGHTS       = WHITE_RIGHTS_QUEEN | WHITE_RIGHTS_KING;
var BLACK_RIGHTS       = BLACK_RIGHTS_QUEEN | BLACK_RIGHTS_KING;

var  MASK_RIGHTS =  [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, ~8, 15, 15, 15, ~12,15, 15, ~4, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, ~2, 15, 15, 15, ~3, 15, 15, ~1, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                     15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

var WP_OFFSET_ORTH  = -12;
var WP_OFFSET_DIAG1 = -13;
var WP_OFFSET_DIAG2 = -11;

var BP_OFFSET_ORTH  = 12;
var BP_OFFSET_DIAG1 = 13;
var BP_OFFSET_DIAG2 = 11;

var KNIGHT_OFFSETS  = [25,-25,23,-23,14,-14,10,-10];
var BISHOP_OFFSETS  = [11,-11,13,-13];
var ROOK_OFFSETS    =               [1,-1,12,-12];
var QUEEN_OFFSETS   = [11,-11,13,-13,1,-1,12,-12];
var KING_OFFSETS    = [11,-11,13,-13,1,-1,12,-12];

var OFFSETS = [0,0,KNIGHT_OFFSETS,BISHOP_OFFSETS,ROOK_OFFSETS,QUEEN_OFFSETS,KING_OFFSETS];
var LIMITS  = [0,1,1,             8,             8,           8,            1];

var RANK_VECTOR  = [0,1,2,2,4,5,6];  // for move sorting.

var  B88 =  [26, 27, 28, 29, 30, 31, 32, 33,
             38, 39, 40, 41, 42, 43, 44, 45,
             50, 51, 52, 53, 54, 55, 56, 57,
             62, 63, 64, 65, 66, 67, 68, 69,
             74, 75, 76, 77, 78, 79, 80, 81,
             86, 87, 88, 89, 90, 91, 92, 93,
             98, 99, 100,101,102,103,104,105,
             110,111,112,113,114,115,116,117];

var COORDS =   ['??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??',
                '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??',
                '??', '??', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', '??', '??',
                '??', '??', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', '??', '??',
                '??', '??', 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', '??', '??',
                '??', '??', 'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', '??', '??',
                '??', '??', 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', '??', '??',
                '??', '??', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', '??', '??',
                '??', '??', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', '??', '??',
                '??', '??', 'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', '??', '??',
                '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??',
                '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??'];

var NAMES    = ['-','P','N','B','R','Q','K','-'];
var PROMOTES = ['n','b','r','q'];                  // 0-3 encoded in move.

var  RANK =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0,
              0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0,
              0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0,
              0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0,
              0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0,
              0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
              0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0,
              0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var  FILE =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var  CORNERS=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var  WSQUARE=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var  BSQUARE=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
              0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var NULL_PST =        [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];


var MAP = [];

MAP['p'] = B_PAWN;
MAP['n'] = B_KNIGHT;
MAP['b'] = B_BISHOP;
MAP['r'] = B_ROOK;
MAP['q'] = B_QUEEN;
MAP['k'] = B_KING;
MAP['P'] = W_PAWN;
MAP['N'] = W_KNIGHT;
MAP['B'] = W_BISHOP;
MAP['R'] = W_ROOK;
MAP['Q'] = W_QUEEN;
MAP['K'] = W_KING;

var UMAP = [];

UMAP[B_PAWN]   = 'p';
UMAP[B_KNIGHT] = 'n';
UMAP[B_BISHOP] = 'b';
UMAP[B_ROOK]   = 'r';
UMAP[B_QUEEN]  = 'q';
UMAP[B_KING]   = 'k';
UMAP[W_PAWN]   = 'P';
UMAP[W_KNIGHT] = 'N';
UMAP[W_BISHOP] = 'B';
UMAP[W_ROOK]   = 'R';
UMAP[W_QUEEN]  = 'Q';
UMAP[W_KING]   = 'K';

var STARRAY = Array(144);
var WKZONES = Array(144);
var BKZONES = Array(144);
var DIST    = Array(144);

//}}}
//{{{  random numbers

var nextRandom = 0;

var randoms = [
756905668, -1084175557, 1878823061, -625318968, -621181864, -570058847, -133173404, -505062315, 521670451, 771225885,
1849313641, 1186661906, -799682966, -225168994, 1939521286, 1659516860, 1390348927, 2015136119, -998381781, 1293648901,
1928880860, 424858752, -1586845067, 2029930516, 2143349043, 725089750, -1358272902, 1638516675, -1689963160, 816003714,
1443211549, -761390243, -372483284, 1849475807, -549469512, -1499092593, -1626271955, 381449936, 1472823989, -103393358,
1231499563, -176858263, -406123480, -932284021, 1691312185, -440588990, 468255306, -1051789162, 1574032471, -624995753,
2030632239, 12933870, 864193266, 307820063, 1688254820, 1824441426, -1435979763, 2107489219, -1095825268, 1593917697,
-1630231776, 48932339, -1109314566, 2097540161, 780490436, -165819431, -918416079, -634721135, -129518473, 1103327088,
-2088846517, -1936284658, 1799783089, -987654177, -71212207, -1620871340, 1426769203, -199569623, 1433482329, -520847795,
-741846705, 1760540845, 291834684, -1070308343, -378916939, 1311641286, 586763452, 445005983, -567208549, -1371828879,
-69665658, -1692629780, 2030367353, -409959721, -652897851, 802441367, 1342228466, 292240617, -1044420383, 405198417,
113961528, 1073557049, -543704439, 1814102103, 1968731819, -17372755, 2117807781, -534131900, 370523349, -771595952,
-2064285760, 1382415537, -534960463, 1104973414, 1371539555, 1264456512, 1487152833, -1455201654, 2091998741, -119363633,
-1017344530, 1732951305, 252587560, 1240182429, 1984495873, -1909317807, 812367925, 2123075279, -1078828331, -656138431,
1659457768, -856546583, 2134809042, 395009456, 15438238, 488587339, -4196101, 1167207259, 183774893, 966140228,
-1707123088, 383778612, -1400094809, 1959931730, -1986744199, 1679663832, -1000587684, -249909268, 1938808625, 1526357844,
-1801708763, -1716290204, -865108123, 1544323846, 280168140, 2046082411, 1516199517, -365673549, 1973396222, 845849274,
516786069, 112309472, -1454966330, -1964099301, 1169813737, 1979212614, -2022578571, 2052328863, -1890575484, 1625256554,
1242601718, -1242499525, -2011848011, -1173838658, 2072885177, 395400810, 605109126, -2022743837, 1635692173, -1023372475,
-306871878, 2013488942, 2146189444, -80305195, 353483291, 971897898, -1958080929, 1294210040, -950976956, -194669749,
546121667, 480886466, -1889547106, 1436547759, 936329723, -1068922488, 780408538, 18189673, -1358545317, -1544367796,
1218678364, -868301110, 1879768657, 460749040, -1794453192, -1547256353, -584354225, -902691927, -1996011397, 433069421,
-1060648588, 497454408, -953425096, 1764269557, 2097353230, -268221657, -2123309067, 1095297278, -1563971, -420614236,
2033299527, 532600140, -257232296, -970924489, -721189830, -1924972946, -180877239, 1022254420, -1006351284, 1144736356,
-586294206, -1766679954, 1673785257, 264224160, 1939276819, 717772815, 1461891206, 514077258, -1289365307, 1802245083,
-1747274550, 480074525, -333149291, 818194191, 1431432741, -1004401642, -1313377973, -1834730853, 851593951, 1587274419,
-724556478, -1113383997, -445179291, 631145192, -2135938758, 1914305411, 1172896003, -924994044, -427054213, 1038225551,
1961585703, -722626474, -1430844438, -1065666345, 1369260393, 140782027, -1042965800, -1298196927, -1067087217, -2106231630,
1423894796, -290441837, -644067520, -1437065047, -1145144175, -337106721, -1801690281, -79488804, -1056006637, 1097642565,
-1049097169, 1520969753, -972228282, -337992858, -1692563813, -577136450, 1857556211, 1387599169, 946034272, -1485412380,
298000023, -1775660336, -622428665, 413995950, -1101308291, -1626343888, -1015170209, 1686710649, 1740927694, -875327099,
-2088575477, 1220475083, -1874271392, 56803762, -627646490, 1066743456, 1364778585, -1315695698, 1175386892, -687339236,
-1620751832, 397743063, 863689372, 758030653, 50792047, -663186943, 1243276702, 2108096499, -2009878900, 1758692940,
1202722178, 919372813, -1925904578, 1393074385, 1446937177, -17717131, 1222281557, -660421085, 1087334168, -1367625768,
-2062161328, -1303147639, 2142100194, -534421238, -1823566723, 546324117, 1526141087, 1600545883, -1567913840, -532494697,
1274508888, 823527502, 672420800, 280664373, -800052128, 1983746417, -1355951857, 1495695143, 1609457126, 788041141,
1572415560, 1880110073, -1530224109, 1850029911, -1945269681, 2040733729, 1922494178, -995038908, 1679657621, 2072541194,
-1598776693, -736851086, 1874303889, -2118400233, -668692305, -35361388, -258322845, 2127756429, -2100612725, 1287585313,
-1349606077, -328760327, 1018844196, 722792207, 892717065, -1922745953, 534746079, -979542090, -1200022621, -619409740,
948376781, -163069564, -1477928412, -1046256959, 531931234, -2084596348, -1227715156, -175916569, 624155627, 228408448,
-970566386, 673636659, -98156747, -195712515, 860271287, -236941488, 46353087, -231972762, 411650519, 1490511692,
-955433918, -2006618858, -895509238, -2002249182, 547340724, 82770194, -1887024400, 838019807, 646648105, -1776581570,
-79178078, -1317584958, 310648348, -216749838, 921731221, 1949719761, 1020870575, 253102998, 592348740, 1508326690,
886100840, -988970, -1372457698, 1904599527, -1010754752, 820265357, 297770342, -1511765966, 2113978939, -588346764,
1004132676, -501004812, -1126623778, -858213528, -83942698, -1851593060, 1442260053, -1767006165, -1782155828, -624910398,
1138703219, -721578872, 981612394, -637526652, 1157219637, -1953142554, 917498477, 600830756, 328618634, 1594562790,
1666665374, -120628581, 568646876, -403505002, -1444646146, -124685049, 1361001792, -836335533, -1067113378, 1670748206,
-211840504, -324770027, 1365448357, 1653872299, 346089333, -71299104, -1425512333, -693446698, 1550846453, 67371333,
190746067, -966405260, 1029661946, 1487867790, -1581438200, -1553417323, 146437714, -1543367487, -2120851147, -737315900,
-307852934, 1460339074, 1864749053, 761394783, -999943645, -180098315, 1813248512, -1361507414, -339394707, -1364917923,
-526658958, -1214093223, -1059219719, 2022063764, 1337854247, 206206094, 1333516956, -2041630037, 1386466709, -1955749321,
821312212, -1529717884, -1559025292, 1583162037, -447145142, 1919448246, -770073053, 445259992, 2140203743, -1688997354,
-392282446, 569518657, -231181482, 971454830, -786591871, -2128187319, -916074883, 2116662870, -2017357334, 2004255079,
556675813, 832218982, 1530531741, 199386015, 1986121103, -209154294, -811091256, -168595515, -643220116, -2041281055,
1905121682, 863173562, -2072073736, 1081784209, -136845123, -1783716676, 1446433582, -358434388, 685061964, 1758789024,
-1431815002, -323860084, 1388447141, -1788270873, 1419882800, -1758893042, -622342832, 836704090, -44041968, 888827764,
1287697653, 133443146, -320398411, 234740251, 263785082, 1970587716, -845314893, 1370580761, 1757451046, 2100896750,
-89284714, 161594702, -508892162, -2070324930, 1073190650, -278071215, 1579202543, 1835401495, 1303168679, -539831445,
-38563537, -987284314, -1054997876, 2000350924, -1223794475, -1562792325, 2001642723, 1705266671, 945310718, 436746991,
-960076339, -1322015419, 167964337, 424200940, -1614423864, -1243206260, -1655193454, -1246349624, 1427064518, -115092789,
1189942539, -422304216, 1185350311, -2105086942, -223538582, 1344686275, -351200531, -789104611, -1694221111, -599852253,
-1381785609, 159265460, -521226282, -1042751576, 989843282, 467201678, 205128516, -742527861, 741501598, -1944096152,
1580780607, -1397564834, 699640738, -816613361, -1918935761, -327119231, -1809683366, -1165950952, 868976629, 1620007250,
1778737349, 1417562819, 1447282050, 1900728438, 958011531, -1483506590, -268395792, 1368551733, -1830556651, 1234281355,
-1283501569, 1612232304, -150581548, -1326058980, 507333456, 1553263210, 924940995, -474970063, -1125241286, -1465557022,
1290587172, 2047628553, 1769607762, 1826029911, 239574509, -722171699, 269407619, -283169299, -1770606287, -1961000988,
284878797, -78903091, 536646389, 1206705189, 1258490015, -926566659, 1565704043, 2108431611, 253865505, -1357930446,
1010396518, -1029545000, -457148518, 235974771, 1092745423, 290079798, -2080231306, -618093506, -1559291661, 2071270321,
-183628504, -2105926703, -1846447577, -770015760, 865654889, -355770962, -602746297, -1987845764, -1189090732, -380423754,
566080434, -1907789050, -123345939, -1306937519, -42385437, -1817163611, 105535024, -1552096552, -1532148314, -454570999,
1331445243, 1634430068, -1424650866, 832040989, -1696921183, -991538301, 711890248, -1905216694, 68825873, -408396209,
-1151083132, 1097199630, -1355526575, -479103375, 787355538, -558654811, 2131960091, -1840774143, -523844881, -888813217,
-562937580, -2125444827, -1415744158, -1724590234, -265350748, 2042548986, -72888312, -1628326116, 1361152559, 1735191457,
-851866528, 1541706714, -1378546404, -1830824926, 863092785, 492649896, 1911625369, 875541249, 1593833053, -724693898,
-1338974590, 344506246, 1918442319, 270650972, -1216717018, 947992317, 399411904, 804593394, 1093901451, 145633571,
-1579317041, 2120300012, 1437240332, -1790567072, -1557903331, -162371716, 680532551, -1280909911, -1706907308, 690269787,
2145164637, 1647117787, -125117749, -693453048, -1948858090, 1419008780, 1513690506, 1317384910, -1395082508, -1445119314,
828391606, 1837180016, 941001037, 951380757, -560814390, 1243050200, 1699700165, 2051753539, 1178241917, -826986520,
513448328, 2065168887, -1779648515, -429791252, 1785727753, -37272118, -1532226512, -1742723468, 1072307045, -1035604503,
-1893960904, -1169015908, 735210842, 765788954, -141003523, -593307640, 2009194589, -395219444, -506798991, 14190731,
-1421775253, -202738536, 1141075901, 1578338583, 1229365426, 1436587816, -1617735324, -148962304, 1017068801, 2059797845,
-1968350113, -1596275477, -884114990, -146610990, 1845052933, 997288554, 1571755345, 334742063, -1747598252, -704382282,
254116846, -158835984, -243583714, -1543324725, 1737247005, 1934349703, -1044462053, 910371263, 1512728593, -2019100951,
474683685, -400947055, 1270665590, -1985016907, 1095764580, 868633549, 408993884, -1050035436, 1340294615, -761011494,
-557656563, 1691451668, 602606991, -1519473638, -198425538, -633529079, 705477778, 767120233, 715018572, 788662017,
-1171217890, -1762211852, -1331559686, 1256084652, 1071746050, 697366175, -1411125546, -1045090705, -549384944, 290164447,
-2030473768, -205390440, 950215084, 1790946161, -847801821, 1068962517, -222609375, -113966370, -1282285884, 1849185587,
1405302879, -1300973537, -504060757, 1417360433, -191429140, 1170038225, 754814130, 680368242, -508271268, -2017895263,
857846654, 1930568959, 1261445337, -85757395, -555716881, -1244161622, 993255993, 1470666446, 1995653254, 1848778813,
-1706802230, -1637478756, -210964765, -1866010534, 544929819, -1563663512, -1436625282, 1196303214, -1583067792, 290486843,
-1115456002, 1638503209, 1687340314, -2053183047, -1873755915, 780100206, -1015289378, 30024949, 69728795, -2069687047,
1435848728, 787754160, -728408519, -451076113, 1659602917, -1305071806, 914470093, 937399337, 1861809423, -1067449309,
1452468940, -2124550557, -75917900, 566213424, 427649056, -84659407, -1337101961, 1141594668, 655208359, 348320975,
-905314209, -325513097, -1976993658, 1447097260, -2001160380, 550429030, 483762225, 1283163745, -817832190, 662465957,
622542511, -643631113, 1309447724, -1809609203, -223541258, 1239516780, 2038745777, -1593182772, 1744120199, 2086253132,
-2144548936, -1185688527, 622944503, 952411006, -1457932780, 2055672639, -1232425915, -1931788629, -1068456881, -1874345111,
1827240226, -264342284, 439209453, 1427936683, -802755347, 7776699, 1247504537, -1212354224, -346828621, 762346373,
824466652, -418927097, 1066703529, 2132970806, -1724412360, 1977816914, -1586026947, 531983058, -1962730010, -196959496,
-992223810, 746112047, -955399402, -2023148259, 859750440, -735691976, 1572423665, 670399355, 255223096, 1421606604,
-1723824451, -640600976, -1390390518, -831976721, -962247488, 839592429, 506631314, 1418144035, -930254817, -2050051455,
685021823, 1099984855, 816012280, 439489006, -880226026, 416676075, -2025168093, -1944506089, -490000468, -22854590,
883642439, -1527699724, -1524126691, -173563997, 627085274, 2131530630, -212423861, 755295665, 1302081446, -2055840728,
2063789066, -638070567, 1128185141, -566608961, -1107908167, 537397848, 1012073370, 1412519866, -653233702, 1151099288,
-1205016763, -617062816, -150327200, -1773165388, 1014374739, 1898591500, -12599295, 207350703, -1329570337, -2016219596,
-1317712883, 1583979870, 1747865778, -1168915472, 1030354189, -1411887538, -925796305, 789540837, -1514500313, 1140091809,
-1630985765, 1777854409, -1739203565, 2138700015, 214441662, 1243180358, 1581885858, -377638115, 870577284, -2037895234,
-171870773, -447084866, -1687769036, 1514154095, 1479138217, -2104950080, -2003567681, -1230135561, 736376550, -964565851,
157750307, 1304392987, 1789809295, 2063014017, -571117472, 561345048, 665870672, 2109562103, -1743717759, -361397593,
1621357351, 383620136, 1368220618, -290034363, 886622853, 615109235, -1813892269, -1839422105, -1919340845, 827359235,
-753450756, 543977902, 1574608794, 696754664, -1508231077, -2071596525, 169937557, 1927893838, -1096604192, -2144111678,
1845860487, -1258994360, -1514365882, -1355567102, -1932047710, -1981639303, -2097118281, 292020444, 249864992, -1241411194,
-441574998, 795662681, -1032577167, 892154533, 1764327727, 1020089339, -235736662, 191815957, -1825814844, -764075082,
747035683, 1085305105, -706295755, -1063767662, 58406530, 695498794, -1332654809, -305330567, -797369870, 40474669,
-852916187, 1719837599, -1805086992, -820152663, -2126566773, 1236648839, 705749109, 1708682047, -1900302330, -41084014,
-1559223049, 1061300725, 1048160200, 1536921898, -1770973001, 692472958, -1077086517, 227107962, -841816921, -130247532,
-504501529, 1034299853, -1436091730, 784699634, 940719833, -1631955837, -1714714641, 424848728, -415820372, -744566796,
-753590630, -19596472, 1392066560, 2016101373, 631637556, -1284981227, -1933906004, 1466119086, -257513388, 872492827,
1383181635, -1580810149, 913543194, -1535213300, 769529626, -1502164692, 1225755647, 1854877864, -553698071, 1601527897,
-683060116, 813593436, -1424254504, 1670061115, -1599588889, 408177271, 1630170527, -1830287993, 891789550, -216160020,
-1737709873, 194220860, -988236453, 1996670217, -1554198187, -22613257, -952442521, -149358124, -1578238171, 586587971,
1680340951, -1960437524, -1494405384, -133308879, 1046480489, -913496705, 4198779, -1602801558, -409927709, -71151896,
293515552, 1139733681, -1549930592, -2020871463, 1470654517, -657942142, -1420479901, -1013786682, -1349493762, -752203359,
1926577370, -1321120908, 2095088026, -1733648217, 626746747, -833117119, 653055659, -1252834627, 1901283281, 592130177,
-1436143314, -1375013769, 1272581705, -902812105, 738650176, 935572304, 115522123, 1994693690, 672177609, -528389935,
-1749806396, -309392346, 1699675192, -1223889507, 39816454, -387558037, 650626262, -1845601508, 920349824, 1545942851,
240716715, -1441834534, -1776126869, -768707722, 118421076, 904148780, 1864149645, -1851606124, -812391389, -509273079,
-310516810, 725490786, -2019971678, 749827360, -1797886692, -1301662340, 232860709, -806532515, 1280339860, 495718612,
-1078156397, -264506052, -116379536, 607915817, 1420583149, -2014815128, -1673013594, -340867910, -1343267598, 1294095658,
-1708467733, -40516034, 1660151587, 1124455332, 584619702, -2138055493, -648000086, 1745200775, -622147536, -1580526918,
1704344939, 386121355, -1723510238, -87119066, -1488745083, 1208063473, -1636148616, -600119932, 1326899923, -455475838,
-790079721, -465776531, 1677616317, 1906188660, -1050408645, 372006027, 661292513, -189495921, -1791298059, -2095030288,
1931886234, -2019043588, -930135540, -806943095, -962425466, -1969000747, -84245920, -278533211, 1550315106, -51206964,
1960684447, -783757708, 329484527, -71762056, -1261547897, 142207092, 426181775, 1993596353, -1320644409, 1895741850,
-1928999227, 445994744, 2011242709, 841827631, 372014794, 949489896, -1826990653, 96978596, -1612842883, -1557406351,
-1692856196, 1098960909, -1969733354, 645589343, -546980010, -1843863895, -1577451271, -410732170, -957003870, 1275054411,
-439679059, -1351796067, 1068630472, 1799850054, -1502183064, 1189046499, 118357175, 1322284835, 189775171, -1687918971,
1975065374, -674179410, 551480912, -1803894741, 699198156, -1033923316, -941863183, -221689044, -388192822, 644080630,
-1352903023, -1239469879, 1541733319, 1455721575, 982854204, 1232290751, -1313520844, -1721397283, -2108408521, -2120923568,
538870332, 1667271383, 1227981066, -1488573834, -419594508, -1696327410, -442867040, -850169882, 495658030, 1501509342,
806464075, 599472492, -1300376179, 650864853, 1978428149, -1854604812, 1134897317, 715257345, -314549554, 1512037375,
-234114674, 446446261, -1055518707, -1733070763, 1205259804, -1833997665, -1543813904, 734023101, -1018786490, -1239333615,
-1493906795, 652664849, 383911689, 1168102118, 1074185881, -648714651, -1420323354, -2035067198, 2113155735, 930721292,
-1958536166, -1936090572, -1337021633, -908753881, -1467587344, 2017478690, 157607216, 856569316, -373372251, 600035010,
-953699905, 2015200293, 1882510180, -2143543857, 1742576179, -943900498, 890137608, -1862042984, 2137857644, 453762186,
1744206186, 544834182, -1576630346, 2122842295, -1628730837, -163170218, -1282316078, -920040383, -1851867040, 1702944321,
765248199, -947181295, 1742866016, 377061568, 454399783, 224737896, -1426525787, -1952910614, -1514474754, -1898080240,
436756014, -1437118886, -1120009458, 1276584103, -219973039, -135606357, 1052728123, 850732009, -1298949977, -266286042,
1766101379, 1752264422, -1929647067, 540497574, -1707420726, -1147631557, 253544893, -333343616, -1133633805, 596382341,
1203637139, 1223980636, 1782656614, -63405987, -332063905, -1000038702, 1559569994, 555093326, 1803162040, 1345540161,
-1624078682, 697865091, 27401625, 1942755674, 1479682554, -1070320944, 1671846137, -1221355132, 761805388, 1670473099,
-1943370653, -449731591, 383091959, -2055014600, -1923863729, 1623824043, -1693045799, -138460935, -1594461486, 1103100368,
-2116585725, 1408653078, 1239099371, -644093815, 1360856426, 252098404, 429838355, 1903230669, -552312735, 89919053,
-184120717, -1182598842, -1055950023, 1261668000, -205545107, 569464266, 1079168583, -880576311, -1894522418, -2056455304,
-2133356272, 241991858, 926920268, 1495976966, -641158556, -907788440, 1685448400, 918126658, -159042122, -572392168,
581286167, -656694172, -1004523611, 2065056585, -196798284, 357521757, -687615239, 545269095, 1254288480, -1283505223,
1552905903, 1288951927, -169939682, -195912563, -1849960222, -173122469, -1414515943, -690615733, 754958509, 1834109713,
619620541, -1152518611, -782575179, -1939871832, -1229610081, 340011020, -388062228, -43293286, 792906454, -621000970,
-485381791, -614913074, 769816552, -306229950, 872964621, -1830034749, 60982827, 1998164810, -596671347, 355701395,
-903833297, -1992277629, 1407589819, -1784229111, 1750229311, -334082357, -2083781793, 1488423319, -2099600275, -416079172,
-1035190216, -1257042769, -1485913123, 1760780468, 1113116460, 549145183, 15591049, -254082889, -1868058941, -669392492,
983714948, 631208865, -1783218586, -2135136623, -1974571057, -2042838223, -1543275668, 856466695, -1983932273, 438795841,
-43357262, 598129831, 1902488611, -1201762635, -1307554665, -1363624363, -856592465, 788700621, 600679934, -1961256486,
-1825820149, 1056826553, 318674485, -1364103893, -1440477215, 1554750381, 829883778, 39176420, 2059009022, 1856553046,
947864788, 258196882, -1758137617, 1217455843, -224047282, -1902028338, 827829642, 766801455, -87624624, -2073237494,
-1201984282, -942674421, -185504672, 1116575221, 640136231, -790890053, 1315103851, -774321806, -1289498960, -315852800,
1596879224, -589168831, 1953838047, 98773032, 253603075, 1192313950, -458045245, 178592171, 946082702, 809094082,
595497722, -1699207459, -931309180, -1487284615, -865449602, -609750685, 477399618, -1847251402, -493568070, 15073191,
1009981854, 1970290613, -36480888, -1845883799, -1531981828, -983728047, 2059320792, 798198227, 505052023, 541968548,
-1725433592, 1061655119, 269136430, -168697011, 602882194, -786293658, -149345906, 1886136393, -768418797, -2137759352,
1680323607, -1342037103, -1126255667, 94661103, -715621492, 415920606, 2011068761, -1818962579, 237526692, 552064663,
1484695906, 1042155297, -1176064582, -864860701, 1351815418, 1471123779, -1602093094, -1246017128, -985133624, -610738325,
616517741, 183866320, 20829529, 1083075109, -1171903423, 1966642413, 2009615829, 2059239995, 28769868, 1327814281,
-77978824, -1218571095, 552649087, 1631959154, 2031571590, 2009784724, 251687449, 1329050722, 202112024, 553544811,
1145902360, 2142594848, -444097200, -2136585242, -1401388582, 1287011331, -538170578, -661614600, -354985445, 1777864532,
-30725121, 240281249, -1300734666, -1934140165, 1880643313, -776103486, -1669383138, 1559942133, -1785251808, 1535003532,
-953759267, -122821212, 1421957135, 2049065608, 1440782813, -957700142, -752519109, -1337160249, -29412590, 1258032483,
-1893387858, -2026570558, -41650054, 1618333767, 211647068, 4153589, 932248335, -1881956500, 1747710542, -1988111358,
-1136916823, 1448767654, 709379061, -463093094, -529335352, -1665819958, -635194336, 234636615, 692974535, -1066124683,
-1508835643, 1115692813, -1293193947, 1493066310, -660956132, -2014720727, 168986133, 286359147, -1744694949, 1422866752,
-578126849, 524290544, -460568506, -1882822609, 1872014660, 1112797713, -1276112245, -1573979837, -1499123171, 1635353153,
836494454, 314532024, -1529326948, -226434181, -1040264379, 1256288900, -1176825047, 369829713, 425694130, 197848569,
1693147441, -294717947, -1514013953, 232872347, -116965875, -692288629, 267224441, -875990518, -1753366165, 1267582628,
2143518106, -1269000319, -1656236572, 383704212, -1381453565, -549968570, 1863114961, -977823690, -832508990, 1751969945,
-1659649676, 836194322, 2016890515, -998551605, 1156153330, 1260024224, 1894700170, -979079555, -1256119352, -6652756,
1867945198, 1115423526, 1294608322, -474866447, 947465840, 1634165844, 876649197, 8620942, 145429956, -296726840,
-1792065183, 1484282095, -1630916693, 353721663, 2046779276, 613623096, 262145920, 204327272, -1444630578, 855891258,
-2001212153, 285120011, 1376508568, 201746552, -1426772185, 428662866, 1100538776, 204722621, 1057804449, -145025309,
-1844138149, 1248551132, 1308052126, -1229746888, -517840619, -140828690, 707145163, 1470637682, 197822439, -1267172102,
2084582891, -2147051264, -1198037232, 608924850, 909707425, 1965631934, 765735438, 950793833, -1880692967, 217312035,
-1482014463, 1597626120, 767650900, -1408146589, -846279805, 27741007, -912197879, 1331292330, 910771576, 1223823356,
-147097195, -144144530, -2091188179, -44188438, -716983520, 1465965606, -813810351, -624099930, -840958343, -1823274575,
1361563121, -1676136732, 450800379, 189889896, -378254739, -720634074, -1171589822, 2141365551, 1825588270, 1859709418,
-1082394159, -325495365, -588536621, 26744702, 1506113773, 151533276, -1149287385, 208645632, 203162335, -2082568256,
771526653, 401529785, -1129074105, 1120201267, 1911311341, -1220139057, -678163576, -861516131, 1975798843, 43593879,
458188017, 469118597, 141834133, -1522049497, -1596241703, -63758, -456019016, 175637125, -1319494279, -1004029526,
-219777618, 1258396832, -1865279510, 1941129905, -264256778, 1206989852, -2097227305, -1589035994, -1401512885, -839107189,
-1403560389, -207984445, 1525388859, 2098539898, 927425827, 1306675022, -1543032677, 777872985, 372259576, 921025818,
-1108638441, 1421458983, -1796234875, -467981749, 1770584788, -1860496863, 1253141336, -669675973, -1164758908, -696975354,
-243659039, -1704585550, -1572618869, -537833095, 1940701588, 1122518051, -112682180, -2093773251, -85439931, -1541970960,
694878103, -582143188, -1161835228, 1116301936, -770991466, 931140938, 2144844556, 1037729425, 1907370663, 1602995917,
1694295103, -1532150777, 1154376109, -608877578, -1702504790, -436749512, -1020701474, 402434970, -1033016079, 1460628581,
893100433, -1253772839, -1488656088, -1827657570, -1568171500, -70667279, -372731959, -1025062908, 156891942, -1649691083,
-851218139, 1333653814, 1881821415, -1862898852, 2003149240, 1239040334, -1922563720, 1257217877, -617175809, 23717481,
2136887014, 861157547, -348338963, -1756374224, -793636261, 331961336, -631192522, -14028072, 582211745, 425063469,
1762282654, 2134444448, 777195151, -923164645, -1989851926, 552597520, -1886538486, 1774965929, -1236015988, -268638233,
748477544, 988231244, 101623597, -1995871351, 1088896672, 687872842, -1369985224, -487648607, -739880296, 2044232630,
275539342, -2098972901, 1026755543, 983465612, 95696503, 593366876, 2083016868, 548822124, -1158280399, -873625168,
-385217023, -1902884938, 1193340651, -578506767, 333461986, 1674022361, -385999018, -1946077006, -1491903352, 884334566,
114959749, -471527478, 71497131, -1636805771, 1195805912, -1506717479, -1167303502, 170254783, -180675816, -863309472,
1813567259, 1792915362, 1697831251, -1328048181, 705009165, 261948744, -1863722252, 410082499, 826194733, -1269861164,
1172918482, 2122912340, 16575785, 1506481522, -1744595993, 285799381, 220239384, 2046649893, 1052246273, 2101822424,
908634960, 1126975015, -1868431013, 948261996, -1162016541, -326721837, -2105332855, 2108683515, 918222113, 1555421861,
169984568, 300285367, -933095007, 27457055, 1210854316, -1192238399, -1708964428, -1062660794, 89476899, -1386896231,
-971835563, -204909769, 121091503, 92952708, -232577385, 1627237652, 1677701341, -117950267, -1534138399, -275713268,
-1819265338, -75748286, -117798928, 55360519, -1832849280, -1628638790, 1086230292, -1814728634, 553405965, 628934137,
84039101, -2024633679, 964275994, 874257385, 1707600916, -229030634, -121510101, -696418860, 1101967111, -1412003475,
908236529, -1262070143, -908599226, -1659442389, 728664773, -460398441, 246804042, 134139579, 1054510948, -590219839,
-292267877, -878931239, -750748959, -1726990074, -2011984894, 1042857629, -1945741374, 971084676, 599316208, 19394901,
-201473673, 1656494946, -1154020263, -2053500403, 470731263, 1555506449, -599862044, -4920557, -216796791, 1474830532,
628036869, 1955205885, -1441210871, 1232981692, -1915533499, 1290660758, -1631314014, -295207700, -585974732, -87489301,
-1342654279, -1159510595, -43651946, -2135361193, 1572601540, 2060360987, -1123039298, -1850183339, -1028603166, -611204342,
-1031476380, 1886785228, -590653065, 1238309357, 2128988382, 498023169, 1946762543, -1965299687, 676093630, 1796129473,
469129985, -1505684337, -502888097, 1553649684, 1786984305, -833144985, -1348110201, 238507895, 754731732, -836113481,
-853640911, 1777795934, -626086230, -1238731075, 2051366869, 1655285533, -1389793380, -2007526481, -1811979120, -1625750175,
762902416, -805972281, -294012625, -112310036, -1321925202, -1470241921, -347363164, -1297172058, -1514405349, 365208961,
-278548637, 545071312, 1306422883, -1909595831, 2093412390, -314096723, -1053283239, -1498660579, -1228059023, -1205038396,
-386331498, 728070226, -2015853350, -756834290, -146935354, -1646449067, -1699033363, -438896706, 557607390, 628724590,
-1990253367, -2082251685, 383592279, 1671011116, 100791387, -1233997479, 766208548, 436700266, 1015934949, 1748346979,
1457144437, -344419202, 645575902, -1018911917, 500060828, 1206330882, -440422559, -974501227, 1019096317, 339826008,
-1607393610, -409525747, 366842907, 421768483, 1327868825, 828346559, 443058876, 429398699, 1618530338, -1765216832,
-847130681, 959776951, -621525528, -1409495847, -1563128639, -700820077, -1708262830, -1173459945, 194835745, -1272388095,
935741751, -1074740736, -2052603343, 73071400, 907349765, -2109663730, -912076002, 1512623980, -2022789236, -13846788,
928752532, 846711194, -1391447614, -2041868372, 1367630637, -16315939, 1074426215, -1750304699, 1623305430, 1805863359,
974776362, -1393376627, -2047011003, 731141555, -254884608, -1891297786, 87645411, -1422663749, 514139053, 740567446,
-1874799155, -1048354414, 1578089728, 1011681499, -1587542113, -1300615911, -453852788, -1892008907, -1522732096, -1688743783,
-1200962599, -2038405581, 97295415, -394292042, 99125250, -700340677, 552952977, 684132890, -110182185, -1658334861,
820361681, 2065119524, -1903879946, -406635167, 317972416, -380328059, 190063896, -1156853024, -1737066600, -1759248724,
-62667795, -1620066741, -1206177904, -1683526079, -1497070391, -203333090, 358707889, -1449932723, 966579665, 1648260557,
-527048854, -1305512851, -1233056353, -1819270246, 1174319286, 660451985, 272188047, -1490341011, 1305571371, 1482388489,
-187627482, -852186361, -656683720, -44900377, 1723780418, -1498633773, 1248371743, 449720544, -1670319787, 854254569,
-906621094, 805241630, 1869578789, 1645716286, -1427029333, 799828928, -1341763526, -754038706, 1010156263, -1072175057,
-1367971579, -1058909978, -1233996230, -1418679062, -895530314, 1168000332, -1259536926, 341030796, -1119285903, -1737133270,
803312216, 1554823666, -1878431910, 293426122, -2108634725, 694430534, 1758220007, 295380188, -1374731652, -971105404,
-1119544630, -1260693951, -2009840134, -269345489, -1916194340, 38399185, -1638261750, 2058841468, 901573546, -323331934,
-397855966, 1677986885, -1678919765, -537431175, 1751569102, -994846590, 1926173316, 447477929, -1539383129, -1669741016,
1395219832, -1783986285, -405915122, -1577069106, 939994944, -2142913427, -1945204986, 1540947267, -397566091, -1225308885,
-305698005, 1075397942, 2052651088, 1709569740, 1189693784, -1723235212, 133252289, 729623940, 1007115122, -298035651,
1815067437, -1804222532, -243926295, 338795968, 744311719, 1932653961, -828258228, 1790144980, -1903053031, -504030497,
-1214470492, 1396884821, -1631615633, 231702773, -489048121, 882675039, 132335520, 1631689114, -1490478369, -353636556,
1094917830, 1960032933, -55047943, -1371563062, -356867246, 694993533, 974065188, 1576833693, -1019710674, 248047778,
1703263914, -1594454239, -1518638580, 51635288, 2000191554, -105411249, -1998526384, -144414268, -1332142480, -1553804974,
-686373756, 105111738, 336416539, 273886907, 920305309, 401606332, -1585574093, 1372252360, -1114995165, 1928159505,
706871815, -494956674, 378870962, 662466904, 1879352890, -1077249502, 1449165929, -1327812995, -902028630, -1700372086,
-1446455255, -1374681563, 762556957, 299749323, -2081194181, -769973473, 2025541925, -869102073, -1552429228, -1097637794,
-972647081, -416808260, -1130500273, -1400778685, -128961507, 42440232, -304885870, -828504832, 1253576521, 1624591336,
1339246171, 1035324013, 524225510, -1676839845, -840445411, 928370182, -2003066515, -50920556, 1347800801, 1355719283,
938504744, -1607814615, -213385116, 1304344068, 38094693, -528246828, 695080502, -916364290, -1302833801, 221866407,
-1976534405, 1111457132, 324080983, 841575277, 648767122, 1087846072, 115133662, 1590411909, -884692075, -1813235328,
525745492, -1592274536, -2070421045, -1434772798, 633774305, 1045793009, 387562621, 235018680, -1994036449, -918795425,
1065662030, -1804158032, -1086031584, 1104203037, -599662977, 2080481667, -641335204, -1673370975, 7032609, -1482115571,
1888957998, 323476861, -1460069192, -992457635, 754868878, 528238832, 1935751660, -340837738, -1333601486, -1663569957,
451216923, -594489282, 465015095, -1646763795, -855403614, -333258626, 1969985061, 1484054564, 1514297999, -151152077,
-821575498, 1296573734, 1771224004, -572678994, 1268843459, -419821262, 236186489, 576148592, 937541273, -1614218070,
-1204896725, -1843548814, 364010116, 284434126, 720353550, -39266702, 2087343843, 433786639, 1767871967, -2080363608,
1544344507, 61747624, -239219410, -1813658690, 1972593525, 1232860440, -325476702, 980828260, -1174479400, -1443601595,
1400060339, 78088046, 1181028438, 1726594339, 2029486759, -841900331, 717209909, 145964391, -1902624486, 549128169,
511177441, 1570891869, 2142137782, 1125650676, -56092796, -1646818530, 598831377, 1603420740, -1940548512, -2140007500,
-274491064, -567072242, 1988520067, 2072632052, -163862861, -2111751994, -1281121975, -1547006557, -2086149091, -2006246553,
-1972038366, 1433513231, -65506387, 866168323, -2025567374, -1366734027, -1086351909, 1078978809, -458451430, -1415098040,
1580563757, 1306607176, 585546404, 586355123, 953786739, -814082435, 898724944, -1669190163, -213833779, -381463104,
-1048395834, -1335392090, -892452908, 467724082, -7809946, -874666719, 2142797484, -1407983611, 857128347, 210976420,
-1272850049, 327762210, -635610343, 520143920, -621895160, 1301404211, -1939062628, -1936206253, 1099741845, -384574493,
-520326053, 1982903845, -1662863518, -293620849, -1696687083, 1408509142, 817827972, 1530661405, -674121074, 301015476,
-638394563, 2037965798, -1439694441, -2147087704, -1186128072, -1486789220, -2087070167, -1988198056, 1180931261, -1530212458,
1016813572, 845757938, 354000239, 1687458546, 1910359542, -1616309933, 1091720209, -367601010, -1386027859, 2107407269,
172543184, -1333623785, 478225282, -1635341661, 69601741, -123475095, -1781823180, 214516306, 1588224381, -1772572908,
-1260865284, 110937030, -1093814510, 621616037, 779077976, 1774926987, -1122691941, -597913219, -33237249, 576651403,
-499061130, -111677598, 330639499, 1344187625, -1091186031, 1828758627, -806106414, 1444165116, 571338308, 1270670166,
-758917034, 1173043469, -1693833906, -1154571895, 1672635812, -1482965594, 280850089, 1926388697, 1749651375, 2083325317,
-1632693376, -1997936462, 128381254, 483822901, -809873758, 1839266631, -1329472742, 175560978, -2909964, 494630611,
-1359197123, -422096596, -2128463317, 1514567929, 167151849, -593588202, 241809161, 247517691, 972546487, 1459142686,
-259879186, 1843153227, -1124776720, -1779893494, 1166329460, 1061696127, -86666588, 1092190273, -1823193088, -2096391209,
-122074414, -198342699, 1539067600, -135679839, 722378619, 2034510008, 1078421924, -1915350275, -1514070916, 940584095,
291761632, 1910696979, 2084833524, -460583552, 113286073, -1205718901, 1413159278, -1765987003, 726893889, 2047571102,
926805650, -851654176, 469267663, -411642095, 807968868, 1325989426, -1479732796, -2073387455, 286257252, 1944648496,
-1957276945, 30567723, 2121369825, -804272869, 1830339429, -1143834574, 976184195, 1466435060, -666960122, 153192304,
228864230, 768115015, -143206981, -824660092, 7361516, 769294963, -729468006, -144975135, -671212627, -1258148119,
-200637934, -1850241895, -1411991102, -1052981711, -1704815324, -1675834843, 491271251, 1023892751, 816648884, 261649870,
817279570, 389405080, 1280566126, -1853822114, -2064819160, 884528177, -681665243, 401387193, 1824714558, 1668288084,
514335349, -818964263, 1007800411, -853707858, -833728488, -128220944, 117120165, 365691770, 2045080241, -1504484988,
2143069499, -1128710956, -35249577, 626986898, 1192636591, 1360037506, -1617753107, -1230360033, 1563738302, -2129243598,
1893869359, -2121716070, 1861877939, 1904653630, -1460760862, 791580336, 509463999, 2135255391, -1570497178, -329483140,
1747928761, 1224635421, -218876432, -522944172, 1963132728, -839342475, 358231582, -292652908, 1918375485, 1010006162,
-27373003, -65836545, 495413491, 1495717985, -475303193, -210385374, 1055924768, -1792528531, 1941973374, -633025164,
-1830111355, -2079276147, 1398046251, 1122387836, -1335188155, -301942482, 1292883184, 1570038607, -2024477024, 2017375505,
-844077780, -975229796, 1199069017, 1776101750, 908234759, 1619865510, 1908414313, -143113865, -1207365152, -279709766,
955558635, -1126968166, -1812000669, -355602846, -1616604060, 1575500210, 970311045, 53558818, 1932810874, -2093693722,
-1303739024, 170061632, 1695693043, 1577788187, -1641794156, -310447142, -349066751, 483916147, 910353087, 1160629316,
303042122, -1630944175, -1906712699, 642292015, -1184656274, -466130676, 1796683388, -912903682, 1693733899, -701345035,
811880328, -637330488, 1490883856, -1114537434, 1421676627, -1912288505, 1670340938, 1701920693, -1183344677, -1814103533,
-521000209, 394047742, 102434253, 257153902, 1616963736, 972149554, 7871824, -1835730994, 1425097179, -975194760,
1713466296, -1765227268, 836678664, 1524562645, -1054727068, -78241197, -1451681664, 2014260331, -1229044621, 1587979457,
-908350277, 1814717921, -2119722719, 1534203555, 972903492, -944942067, -1963941137, -1949217475, 578769520, -726152671,
1735119310, 203832385, 1430543664, 2072198766, -393981698, 1703772603, -1353786672, -758407696, -1497683039, -1027043124,
1613212493, 1877277935, -438448209, 480280783, 694547208, 308648499, 980880807, -700878641, 989985393, 1320264448,
1051925280, 708738155, -215410757, -1287261808, -391487706, -1692124164, 1688933791, -671868403, -1980255300, -1613212310,
-1482743572, -1241346824, 864859454, 2074633450, -1584727784, 1051085458, 1071043967, 8806186, -491814800, 677922193,
-850520377, -358998214, -480900926, 1566428477, -1216335557, 2072861765, -869336245, 849265445, 1499408854, 51787007,
-1902773389, 371581610, -861650674, -1349730038, -1813435138, -2045929908, -716092796, 1539667696, -884654474, 849848132,
-2019941906, 13863468, 1751788015, -1822618327, -1951221380, 1758844346, 450640010, -571332854, 212252907, -943453928,
-882660145, -1316682640, 2112063118, -1828028968, 1950422896, -1665620542, 920553650, 1907979831, -2062653557, -2132999703,
323562939, 1700800714, -643498158, -16494702, 1389723159, -2085542649, 1328039450, -1113945247, 1641158651, -1375270419,
161477612, -1941049089, -2001570359, -111707397, -749876717, 916623307, -1234685986, -2119817223, -1335571110, -323789084,
379373212, 2113957370, 1970807363, -2118834705, 1046354916, 1719363922, -202591490, -1949953982, -899736001, -1162664141,
731742737, 484417284, -119973384, -1939544812, -1250524558, 492083623, -1196581898, 1464447455, 1250111830, 410079231,
-1352302164, 1560081083, 1514805586, -1771139183, -269649003, -838874114, 1275871829, 1182255515, 2026230061, -1387867697,
161562367, -623673581, -303661460, -1157180301, -135852900, 1822224383, -262676858, -1975155424, 355780355, 1042993783,
-625169965, -1285015630, 60288416, 1667442347, -254674501, 2103610059, 1621644079, -457564675, 125141584, 1874978057,
-730476794, 1050630304, 1588743550, -787040971, 2101876262, 445772471, 1928563321, 1541883271, 1079790277, -1564149786,
419102709, -128629551, -1110992886, -1046887427, 444746481, 1206220050, -1377731711, -709376480, 892160568, 105911767,
-1193353152, -482022984, -1398480631, 19864601, -141683096, -2027029695, -723213798, -70639729, 933047568, -522069638,
268719896, -1315309593, 1402782659, 1981922807, 1763251692, -1335777918, -1351626321, -2094731364, -712811628, 488705757,
537648033, 309514026, 184523545, 1566503732, 1739562286, 1353041458, -898444639, -1935364922, -267345867, 294768360,
734330043, -1468631864, 375817465, -1240489257, 666511668, -1045644822, 1475373264, -891041531, 806965790, 1034744988,
-1876295759, -126840235, 188619003, 1438723930, 1275158006, 923374059, 2091037864, -1592152816, -643515996, 1473525383,
-645002258, -614679400, 1574182825, 1915370162, 512076131, 39553557, -464369391, 1262816248, -1802982749, -694982896,
1589844135, 1417281396, -1969658387, -6448666, 486948046, 1577166647, 623218854, -1416840512, 367801006, 1043276419,
1163169834, 1417631975, 723302411, -1245916527, 835531351, -48389983, 2056774965, 923990555, 1861995100, -477374531,
1284442182, -1142440152, 1118031083, -405274494, -2111226486, -866644417, 2126304431, 624768469, 1202273883, 411873938,
-29073265, 1102064757, -1524045554, -1397401976, -1091450703, 159408647, 695277053, -1150302585, 1335051900, -1499189954,
-2059261481, -1196153753, 797350706, 1353895659, 1878495036, 1605605288, -53835295, -1085773899, 456407553, 1198543195,
-1837344312, -1331566286, -1308603515, 481719855, 1303924989, -1357004113, -936164109, 1021566277, 1766298953, 149713333,
1319250233, -799073685, 1193715851, 842225076, 2136654859, -1999388347, 1121918516, -281027877, 1499337743, -1975621958,
-1343567880, -1142454481, 109594508, 1954863100, 1231895164, -283261691, 1665484287, -1987241547, 480645963, -1822425835,
351967956, -1496604099, -1141509924, -468766416, 738018913, -579185619, 75650208, 212998816, 967348185, 1551556755,
-994948307, -240586101, 1528112991, -411570187, -641260001, 619104169, 2097132088, 947791773, -1466529942, 370470760,
-792904781, 507884653, 314509442, -931375641, 405526015, -1173979577, 1856909350, 244861158, 1476785930, -1814411216,
-1682116991, 838269997, -737600654, -565401879, -1254438879, 527580371, 486241932, -1282312917, -1156552027, -1712760963,
-956142302, 85692481, -1195603314, -1298930128, -835846079, 1842929364, -525782913, 824487448, -1491048060, 1365154866,
-856278810, -809544808, -1452553398, -1280423762, 697619427, -891359923, -679323174, 1023554649, 299528192, 1494081024,
-1501662786, -1773849227, 566308042, 166922601, -1317139506, -1620859053, -816991069, 2077482808, 1069391774, -1690936832,
1916908419, -684317037, 1299040861, 1313716711, -268579902, 401212790, -1244219526, 1650955167, -856721876, -97859822,
1837607537, -95527795, -1448574777, -1856451185, -1497854069, -1289435042, -1830020332, -1456825413, 1065743438, -1010659057,
-364664033, 1120012548, -849718363, 592060437, 394490830, 945555552, -1800071660, 1718439230, -1586585870, 517853782,
-528358102, 940696794, -886832924, 2051640049, -1363383749, 2112057074, 429768003, 1863223097, 508139834, 1341130230,
-1527772445, -1916012693, -1411976559, -1211019987, 1792904598, 1833407878, -1697645776, -1367585014, -1917993155, -2036611974,
-1854528472, 1095854171, 1778855926, -1186976651, 317272827, 1037269063, -865602022, -1316185645, -677338345, -2034250867,
186646291, 318129954, 1445062576, 1594757999, -176590326, 1522483082, -211203043, -595186211, -612354201, -1426515411,
-1960046465, 60577648, -1875224675, -1051579006, -1111303461, -1569642694, 1543726692, -1611878706, -562942226, -1137036474,
-1786812890, -270722288, -411510274, -175861553, -575561217, -1677756662, 2086340330, 1799028426, 567970094, -18849535,
1419093539, 592860959, -1083058039, 1062480396, -1211282674, -1124411220, 2066175401, 6857442, 633965619, 1817149115,
915398335, -715206869, 2061549818, 1006112510, 655908518, -336823094, -569086502, 852753382, -1988853041, 982835306,
789976532, 1982247371, -2013123254, 873379797, -489940579, 791649397, -1440335318, 571916564, -572036809, -730599313,
-782777795, 234130976, -2052119398, -92397587, -1815109881, -1663073207, 906292161, -1586083040, -1459544800, -1586944802,
-668869632, 1194970673, -1902906409, 1934548637, 87833931, 282023198, 1206121678, -1338945573, -102848084, -1327737679,
266084921, -989624940, 826693832, -766641929, 748159164, 1678685295, 1172622958, -594398972, 1170597657, -1911227501,
1091076517, 2055073136, -213239463, 541336040, 2014448535, 420699580, 1527764699, 249388991, -1206775541, 183866113,
104039121, 393439876, 333826897, 1850036610, 1557910232, 2015429258, 927226164, 114032092, 67958653, -210233687,
-96733346, 2039576990, -1495324960, -991604433, -1584483417, 629101245, -1366929672, -989800109, 2010533745, -913359862,
1048884388, -930695794, -648678524, -892012927, -1353009796, 1867524694, -1890871457, 891198381, -948639583, 1457219246,
423845186, 497540411, 2016937725, 81713693, -1082097039, -1265727445, 5286621, 709824219, -200293040, 1315007262,
1112754103, -993474049, -1848957542, -1861493364, 992363813, -817896075, 804724455, -118415936, 831706999, 755634922,
-440558690, -1554278747, 1148100765, -1467002328, -215817388, -247110970, 1786439326, -1214162757, -1780529317, 915733432,
767320224, -1062584900, 1152196541, -540692844, 1425991752, -654046023, -1394202504, 2057486842, 515047799, 695776253,
991917517, -244262842, 1109626115, 1699152518, -1800866120, -1326285259, 1181715940, 1846981219, -1630184475, -1781309488,
-1491478325, -731348457, -957984162, -1616704108, -1338940810, -995479634, -1262432615, -301126374, 1287185694, 500820569,
894592028, -1374236633, 1884581744, 1027783705, 512157108, -1187219510, -717768896, 1950843367, -2023560111, 55262615,
-582705577, 2021250818, -1996439851, 1670161425, -212061395, -2013455463, -694821812, -1991341522, -1612185128, 1275567029,
-920118623, 941181354, 1177719632, -728708138, 994628852, -1134381486, 1194735354, 2002319382, 1166779769, 2054648118,
1576484339, -2005582914, 1388030810, 1355295397, -944753018, -1479067723, -1952393660, 1735194684, 2101219916, -830146727,
1044545452, 820625114, -742855743, -1804013308, 538280349, 688496288, -1364870729, -1436927326, 1124924622, -700396528,
1759951892, 885066384, 498716396, 151223144, -830789653, -273400863, -41855409, -1178523990, 2120368630, -998842498,
611805057, 250404017, 290774585, -2127225744, -357456628, -1851396375, 350752003, 1608098972, -1211675071, -1734134648,
-96222386, -2075218639, 1826283157, -1767128559, -140923873, 293594078, -442371634, -1881599107, 288475167, 1774880966,
213836754, 1704291315, 1517443940, 1259363714, -649395378, -1349807536, 825047972, 226131273, -30745563, -686275290,
919616290, 419848143, -402495055, 1657358813, -995075240, 1755049991, 1996187118, 631213607, -762045526, 2049064753,
21224169, -301235373, -1278961472, 1908055519, 1245548109, 1198310940, 198880859, 179279201, -22461745, -2048222394,
1428751885, -1885097973, -1007932237, 369121314, 18998511, 2133117668, -380291527, 24045412, 589885265, -317304729,
-515514873, 740555298, -503141140, -1966816477, 198875618, -225146526, -870643357, 1142782304, -1903437487, -1571343605,
718187018, 1489059614, -1173510554, -2096762211, -905232164, -859448885, -2124640628, -652739989, -806684979, -599271586,
-1392970775, 1740509469, -411472967, 805503931, -968600124, -1903413476, -1008727317, -239454901, 1936576887, 1031874742,
631741480, -1769390596, 482920571, 1253697415, 1625886216, -950756266, -168612178, -1627865755, 1947937126, 1995508621,
1103095700, -723267245, 912914158, 1474753802, 1317865779, -537763750, -1541470003, -1680628135, -2052612924, 779273783,
1320979393, 1583110562, -183703443, -1462223253, 1187979149, -1802903750, -575965145, 1794040225, 1484367891, 43197959,
-885420722, -1839517031, -438203963, -1388842718, 2034013253, 1777034854, -781871454, 1394644542, -665636343, 154020775,
-2048855475, -1847588629, -430212688, 2098279851, 1861898030, 1628885888, -481770733, 1636830509, -651801674, 1350594549,
1992783733, -1162975665, -1632805473, -686102738, -1042410661, -1714227423, -1383542552, -1904672616, -1292751548, -912546058,
1450871061, -1212282330, 1082634058, 641921254, -896752297, -1721682114, 902322349, -1525968703, -855746310, -1388312279,
1949756330, -858221403, -24707868, 1006850229, -1619406715, -1414356237, -891319813, 1870823534, 116039236, 1150115900,
-828623177, 1721272573, -1757232834, 628597380, 973026146, 1643796225, -862649539, -1563642393, -1490659465, 1860708987,
-331096267, -221536073, -2081532850, 684230554, -287754536, 650039021, -1466181569, 1150312694, 1051780129, 490667805,
-1337634390, 1527924004, 776948342, -1876768865, -1694977033, -1485587553, -348117010, -1848264550, 1380136189, -1642139484,
-1252084935, 1901794439, -750063697, 261529453, 355221740, -816429380, -197551404, 436912792, 1882108864, -1538635007,
-1124497144, -152816435, -925945896, 517548398, 737348504, 192313973, 899634838, -1954970968, 682012153, 219781636,
-1639953753, -1688747073, -2077449593, 1916502362, -1201217890, -864412337, 1445237171, -837685422, 562078002, 768156810,
-417843160, -1658030431, 542707576, -1952138580, 452027934, 628744411, 1352929065, 851091086, 1076107414, -1981867193,
-1829700002, 1814771943, -265735756, -1762865357, -1127186659, -493130468, 671757867, 1818173266, -1164051120, 1127581531,
-1511330664, -793535415, -372200456, 1721279925, -2075489524, 1497455219, 680550938, 1079535151, -978409450, -1110325634,
-1938539868, 469619359, 946394327, 370174639, -1620319502, 1255748487, 747167804, 745037038, 1193478582, 1790773087,
978147041, -1750972725, -2099229739, 1469082142, 750321763, 815217538, -1248218704, 1579694305, -935691019, 1387007581,
-1397474205, -235013812, 1352305367, 262942436, 148119835, 644102139, -990212035, -1217173577, 206364802, 749235178
];

//}}}

//{{{  tuned feature weights

// data=data/quiet-labeled2.epd
// features=1033
// k=3.17
// loss=0.055145316463990304
// epochs=200
// last update Mon Feb 14 2022 09:58:58 GMT+0000 (Greenwich Mean Time)

const VALUE_VECTOR    = [0,100,389,386,597,1146,10000];
const WPAWN_PSTS      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,42,112,60,98,101,105,33,-23,0,0,0,0,-8,-4,11,5,53,75,38,-13,0,0,0,0,-27,-2,-14,10,7,5,3,-37,0,0,0,0,-43,-40,-14,-1,-5,4,-26,-44,0,0,0,0,-35,-38,-19,-16,-13,6,8,-20,0,0,0,0,-46,-27,-47,-31,-46,9,12,-37,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WPAWN_PSTE      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,13,29,20,39,5,37,48,0,0,0,0,14,13,8,-3,-14,-10,11,15,0,0,0,0,6,-7,-12,-27,-22,-16,-5,1,0,0,0,0,2,-2,-17,-22,-18,-21,-12,-7,0,0,0,0,-12,-10,-17,-14,-8,-16,-24,-20,0,0,0,0,-4,-14,4,-5,12,-9,-21,-20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WKNIGHT_PSTS    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-163,-85,-49,-48,30,-115,-45,-87,0,0,0,0,-82,-48,61,22,9,47,-2,-27,0,0,0,0,-46,30,13,40,68,102,45,48,0,0,0,0,0,25,3,32,34,64,28,34,0,0,0,0,1,19,19,14,35,30,31,2,0,0,0,0,-7,4,26,40,50,39,45,4,0,0,0,0,-13,-32,8,22,29,36,20,13,0,0,0,0,-107,1,-30,-11,23,3,1,-4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WKNIGHT_PSTE    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-62,-57,-20,-41,-40,-44,-78,-117,0,0,0,0,-42,-23,-41,-7,-21,-43,-42,-78,0,0,0,0,-41,-34,3,4,-23,-23,-40,-66,0,0,0,0,-32,-10,18,14,19,-6,-19,-40,0,0,0,0,-32,-25,8,17,7,7,-7,-36,0,0,0,0,-45,-15,-10,3,1,-16,-37,-36,0,0,0,0,-60,-34,-26,-23,-22,-35,-40,-67,0,0,0,0,-42,-76,-44,-32,-46,-42,-79,-96,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WBISHOP_PSTS    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-44,-15,-122,-73,-49,-69,-8,-15,0,0,0,0,-31,1,-36,-40,15,22,47,-73,0,0,0,0,-27,30,30,13,14,45,29,-7,0,0,0,0,1,0,7,44,19,18,-3,4,0,0,0,0,4,15,16,30,31,6,12,16,0,0,0,0,12,30,30,22,32,46,37,25,0,0,0,0,22,32,24,20,21,39,62,17,0,0,0,0,-14,23,23,18,24,19,-16,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WBISHOP_PSTE    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-31,-37,-21,-24,-17,-23,-38,-44,0,0,0,0,-20,-27,-15,-27,-26,-27,-36,-26,0,0,0,0,-14,-29,-27,-27,-26,-30,-25,-16,0,0,0,0,-27,-16,-15,-17,-11,-21,-24,-22,0,0,0,0,-31,-28,-15,-11,-24,-17,-32,-34,0,0,0,0,-34,-29,-21,-19,-15,-29,-30,-35,0,0,0,0,-39,-43,-37,-31,-25,-35,-44,-53,0,0,0,0,-42,-33,-40,-31,-33,-34,-28,-35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WROOK_PSTS      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,29,8,35,33,2,4,19,0,0,0,0,0,6,34,39,46,48,-13,18,0,0,0,0,-14,0,-1,5,-13,15,48,-6,0,0,0,0,-34,-28,-1,13,-1,19,-25,-34,0,0,0,0,-40,-34,-18,-11,0,-11,3,-33,0,0,0,0,-38,-20,-9,-14,6,3,-4,-31,0,0,0,0,-34,-10,-14,2,12,13,-7,-64,0,0,0,0,-4,-4,4,14,15,16,-28,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WROOK_PSTE      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,33,42,36,36,36,34,32,0,0,0,0,32,30,24,21,6,19,36,27,0,0,0,0,40,40,38,37,34,24,21,25,0,0,0,0,42,37,42,25,29,29,30,40,0,0,0,0,36,38,37,29,18,19,15,24,0,0,0,0,25,25,14,19,8,8,14,12,0,0,0,0,19,13,19,16,4,6,7,25,0,0,0,0,11,19,20,12,8,5,18,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WQUEEN_PSTS     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-17,-2,12,5,71,53,56,55,0,0,0,0,-12,-38,0,9,-25,46,43,58,0,0,0,0,-10,-16,13,-25,26,64,48,60,0,0,0,0,-34,-33,-29,-27,-4,-4,-3,-11,0,0,0,0,-6,-42,-11,-16,-3,-6,-8,-6,0,0,0,0,-22,12,-2,6,8,3,14,8,0,0,0,0,-24,5,21,19,30,32,16,28,0,0,0,0,8,2,9,24,3,-2,-9,-30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WQUEEN_PSTE     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-2,33,38,39,33,34,10,35,0,0,0,0,-10,17,27,35,65,37,26,22,0,0,0,0,-2,17,1,72,66,43,46,31,0,0,0,0,36,33,33,51,61,53,80,76,0,0,0,0,-7,48,20,53,28,39,53,44,0,0,0,0,15,-35,13,-7,1,23,24,30,0,0,0,0,-11,-29,-34,-23,-25,-23,-42,-29,0,0,0,0,-32,-38,-30,-42,0,-27,-18,-43,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WKING_PSTS      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-86,38,17,-17,-89,-65,12,-15,0,0,0,0,35,25,-9,1,-30,7,-6,-55,0,0,0,0,33,28,30,-49,-10,32,66,-10,0,0,0,0,-13,3,-3,-46,-48,-37,-10,-63,0,0,0,0,-31,29,-26,-69,-70,-45,-38,-74,0,0,0,0,14,29,4,-22,-29,-16,19,-16,0,0,0,0,28,60,27,-29,-7,11,58,39,0,0,0,0,-7,71,53,-35,43,-6,63,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WKING_PSTE      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-135,-65,-36,-53,-27,0,-32,-42,0,0,0,0,-30,-13,-3,0,9,25,3,-3,0,0,0,0,-13,3,1,8,8,44,34,1,0,0,0,0,-16,5,12,16,17,27,23,-2,0,0,0,0,-35,-24,7,16,20,14,0,-17,0,0,0,0,-38,-24,-7,3,6,0,-12,-24,0,0,0,0,-53,-42,-20,-11,-9,-16,-33,-45,0,0,0,0,-86,-71,-54,-36,-61,-34,-61,-80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BPAWN_PSTS      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,-46,-27,-47,-31,-46,9,12,-37,0,0,0,0,-35,-38,-19,-16,-13,6,8,-20,0,0,0,0,-43,-40,-14,-1,-5,4,-26,-44,0,0,0,0,-27,-2,-14,10,7,5,3,-37,0,0,0,0,-8,-4,11,5,53,75,38,-13,0,0,0,0,42,112,60,98,101,105,33,-23,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BPAWN_PSTE      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-4,-14,4,-5,12,-9,-21,-20,0,0,0,0,-12,-10,-17,-14,-8,-16,-24,-20,0,0,0,0,2,-2,-17,-22,-18,-21,-12,-7,0,0,0,0,6,-7,-12,-27,-22,-16,-5,1,0,0,0,0,14,13,8,-3,-14,-10,11,15,0,0,0,0,10,13,29,20,39,5,37,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BKNIGHT_PSTS    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-107,1,-30,-11,23,3,1,-4,0,0,0,0,-13,-32,8,22,29,36,20,13,0,0,0,0,-7,4,26,40,50,39,45,4,0,0,0,0,1,19,19,14,35,30,31,2,0,0,0,0,0,25,3,32,34,64,28,34,0,0,0,0,-46,30,13,40,68,102,45,48,0,0,0,0,-82,-48,61,22,9,47,-2,-27,0,0,0,0,-163,-85,-49,-48,30,-115,-45,-87,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BKNIGHT_PSTE    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-42,-76,-44,-32,-46,-42,-79,-96,0,0,0,0,-60,-34,-26,-23,-22,-35,-40,-67,0,0,0,0,-45,-15,-10,3,1,-16,-37,-36,0,0,0,0,-32,-25,8,17,7,7,-7,-36,0,0,0,0,-32,-10,18,14,19,-6,-19,-40,0,0,0,0,-41,-34,3,4,-23,-23,-40,-66,0,0,0,0,-42,-23,-41,-7,-21,-43,-42,-78,0,0,0,0,-62,-57,-20,-41,-40,-44,-78,-117,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BBISHOP_PSTS    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-14,23,23,18,24,19,-16,2,0,0,0,0,22,32,24,20,21,39,62,17,0,0,0,0,12,30,30,22,32,46,37,25,0,0,0,0,4,15,16,30,31,6,12,16,0,0,0,0,1,0,7,44,19,18,-3,4,0,0,0,0,-27,30,30,13,14,45,29,-7,0,0,0,0,-31,1,-36,-40,15,22,47,-73,0,0,0,0,-44,-15,-122,-73,-49,-69,-8,-15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BBISHOP_PSTE    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-42,-33,-40,-31,-33,-34,-28,-35,0,0,0,0,-39,-43,-37,-31,-25,-35,-44,-53,0,0,0,0,-34,-29,-21,-19,-15,-29,-30,-35,0,0,0,0,-31,-28,-15,-11,-24,-17,-32,-34,0,0,0,0,-27,-16,-15,-17,-11,-21,-24,-22,0,0,0,0,-14,-29,-27,-27,-26,-30,-25,-16,0,0,0,0,-20,-27,-15,-27,-26,-27,-36,-26,0,0,0,0,-31,-37,-21,-24,-17,-23,-38,-44,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BROOK_PSTS      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-4,-4,4,14,15,16,-28,-1,0,0,0,0,-34,-10,-14,2,12,13,-7,-64,0,0,0,0,-38,-20,-9,-14,6,3,-4,-31,0,0,0,0,-40,-34,-18,-11,0,-11,3,-33,0,0,0,0,-34,-28,-1,13,-1,19,-25,-34,0,0,0,0,-14,0,-1,5,-13,15,48,-6,0,0,0,0,0,6,34,39,46,48,-13,18,0,0,0,0,14,29,8,35,33,2,4,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BROOK_PSTE      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,19,20,12,8,5,18,-12,0,0,0,0,19,13,19,16,4,6,7,25,0,0,0,0,25,25,14,19,8,8,14,12,0,0,0,0,36,38,37,29,18,19,15,24,0,0,0,0,42,37,42,25,29,29,30,40,0,0,0,0,40,40,38,37,34,24,21,25,0,0,0,0,32,30,24,21,6,19,36,27,0,0,0,0,41,33,42,36,36,36,34,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BQUEEN_PSTS     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,2,9,24,3,-2,-9,-30,0,0,0,0,-24,5,21,19,30,32,16,28,0,0,0,0,-22,12,-2,6,8,3,14,8,0,0,0,0,-6,-42,-11,-16,-3,-6,-8,-6,0,0,0,0,-34,-33,-29,-27,-4,-4,-3,-11,0,0,0,0,-10,-16,13,-25,26,64,48,60,0,0,0,0,-12,-38,0,9,-25,46,43,58,0,0,0,0,-17,-2,12,5,71,53,56,55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BQUEEN_PSTE     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-32,-38,-30,-42,0,-27,-18,-43,0,0,0,0,-11,-29,-34,-23,-25,-23,-42,-29,0,0,0,0,15,-35,13,-7,1,23,24,30,0,0,0,0,-7,48,20,53,28,39,53,44,0,0,0,0,36,33,33,51,61,53,80,76,0,0,0,0,-2,17,1,72,66,43,46,31,0,0,0,0,-10,17,27,35,65,37,26,22,0,0,0,0,-2,33,38,39,33,34,10,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BKING_PSTS      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-7,71,53,-35,43,-6,63,31,0,0,0,0,28,60,27,-29,-7,11,58,39,0,0,0,0,14,29,4,-22,-29,-16,19,-16,0,0,0,0,-31,29,-26,-69,-70,-45,-38,-74,0,0,0,0,-13,3,-3,-46,-48,-37,-10,-63,0,0,0,0,33,28,30,-49,-10,32,66,-10,0,0,0,0,35,25,-9,1,-30,7,-6,-55,0,0,0,0,-86,38,17,-17,-89,-65,12,-15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BKING_PSTE      = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-86,-71,-54,-36,-61,-34,-61,-80,0,0,0,0,-53,-42,-20,-11,-9,-16,-33,-45,0,0,0,0,-38,-24,-7,3,6,0,-12,-24,0,0,0,0,-35,-24,7,16,20,14,0,-17,0,0,0,0,-16,5,12,16,17,27,23,-2,0,0,0,0,-13,3,1,8,8,44,34,1,0,0,0,0,-30,-13,-3,0,9,25,3,-3,0,0,0,0,-135,-65,-36,-53,-27,0,-32,-42,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const WOUTPOST        = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,24,16,32,30,31,0,0,0,0,0,0,14,25,33,20,50,59,0,0,0,0,0,0,20,27,28,22,31,25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const BOUTPOST        = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,27,28,22,31,25,0,0,0,0,0,0,14,25,33,20,50,59,0,0,0,0,0,0,19,24,16,32,30,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const EV              = [6,-2,8,3,5,3,2,8,29,10,43,52,21,12,4,15,15,12,7,-2,3,14,82,40,-1,25,22,-1,-13,25,40,7,-4,23,89,75,134,797,45,28,0,0,0,0,0,0,57,29,25,35,5,-1,11,10,5,7,-9,3,51,29,36,41,57,50,-4,23];
const WSTORM          = [0,0,14,27,5,5,-9,1,0,9];
const WSHELTER        = [0,0,1,5,12,14,43,18,0,32];
const IMBALN_S        = [-105,27,17,3,0,3,8,19,36];
const IMBALN_E        = [-106,-51,-32,-17,0,12,35,52,54];
const IMBALB_S        = [-61,-2,9,5,11,14,10,15,24];
const IMBALB_E        = [0,-31,-24,-14,-10,-2,13,23,38];
const IMBALR_S        = [55,12,-15,-21,-23,-19,-7,5,15];
const IMBALR_E        = [-31,-25,-3,10,22,36,42,51,71];
const IMBALQ_S        = [-7,-29,-16,3,12,12,14,7,-10];
const IMBALQ_E        = [-58,-38,-12,-3,3,22,37,43,18];
const MOBN_S          = [-1,9,16,19,28,31,34,39,48];
const MOBN_E          = [-1,-4,-6,-2,-9,-6,-10,-14,-22];
const MOBB_S          = [-7,10,23,32,35,43,50,56,63,72,70,85,95,103];
const MOBB_E          = [-16,-16,-2,6,21,22,27,29,33,27,28,23,34,31];
const MOBR_S          = [-1,8,13,18,20,26,31,34,42,46,50,54,68,70,65];
const MOBR_E          = [-18,-12,3,10,19,24,27,31,30,34,35,35,38,28,33];
const MOBQ_S          = [2,2,4,2,8,13,14,12,17,21,20,20,25,28,28,33,32,35,38,41,39,41,44,46,48,50,51,54];
const MOBQ_E          = [0,8,16,20,30,40,46,56,65,75,84,92,106,109,115,123,129,137,144,153,157,164,175,181,190,200,207,216];

//}}}
//{{{  init EV feature weights

// Update eval copy if tweaked.

var TIGHT_NS             = EV[iTIGHT_NS];
var TIGHT_NE             = EV[iTIGHT_NE];
var TIGHT_BS             = EV[iTIGHT_BS];
var TIGHT_BE             = EV[iTIGHT_BE];
var TIGHT_RS             = EV[iTIGHT_RS];
var TIGHT_RE             = EV[iTIGHT_RE];
var TIGHT_QS             = EV[iTIGHT_QS];
var TIGHT_QE             = EV[iTIGHT_QE];
var TENSE_NS             = EV[iTENSE_NS];
var TENSE_NE             = EV[iTENSE_NE];
var TENSE_BS             = EV[iTENSE_BS];
var TENSE_BE             = EV[iTENSE_BE];
var TENSE_RS             = EV[iTENSE_RS];
var TENSE_RE             = EV[iTENSE_RE];
var TENSE_QS             = EV[iTENSE_QS];
var TENSE_QE             = EV[iTENSE_QE];
var ATT_N                = EV[iATT_N];
var ATT_B                = EV[iATT_B];
var ATT_R                = EV[iATT_R];
var ATT_Q                = EV[iATT_Q];
var PAWN_DOUBLED_S       = EV[iPAWN_DOUBLED_S];
var PAWN_DOUBLED_E       = EV[iPAWN_DOUBLED_E];
var PAWN_ISOLATED_S      = EV[iPAWN_ISOLATED_S];
var PAWN_ISOLATED_E      = EV[iPAWN_ISOLATED_E];
var PAWN_BACKWARD_S      = EV[iPAWN_BACKWARD_S];
var PAWN_BACKWARD_E      = EV[iPAWN_BACKWARD_E];
var PAWN_PASSED_OFFSET_S = EV[iPAWN_PASSED_OFFSET_S];
var PAWN_PASSED_OFFSET_E = EV[iPAWN_PASSED_OFFSET_E];
var PAWN_PASSED_MULT_S   = EV[iPAWN_PASSED_MULT_S];
var PAWN_PASSED_MULT_E   = EV[iPAWN_PASSED_MULT_E];
var TWOBISHOPS_S         = EV[iTWOBISHOPS_S];
var ROOK7TH_S            = EV[iROOK7TH_S];
var ROOK7TH_E            = EV[iROOK7TH_E];
var ROOKOPEN_S           = EV[iROOKOPEN_S];
var ROOKOPEN_E           = EV[iROOKOPEN_E];
var QUEEN7TH_S           = EV[iQUEEN7TH_S];
var QUEEN7TH_E           = EV[iQUEEN7TH_E];
var TRAPPED_S            = EV[iTRAPPED_S];
var TRAPPED_E            = EV[iTRAPPED_E];
var KING_PENALTY         = EV[iKING_PENALTY];
var PAWN_OFFSET_S        = EV[iPAWN_OFFSET_S];
var PAWN_OFFSET_E        = EV[iPAWN_OFFSET_E];
var PAWN_MULT_S          = EV[iPAWN_MULT_S];
var PAWN_MULT_E          = EV[iPAWN_MULT_E];
var PAWN_PASS_FREE       = EV[iPAWN_PASS_FREE];
var PAWN_PASS_UNSTOP     = EV[iPAWN_PASS_UNSTOP];
var PAWN_PASS_KING1      = EV[iPAWN_PASS_KING1];
var PAWN_PASS_KING2      = EV[iPAWN_PASS_KING2];
var TWOBISHOPS_E         = EV[iTWOBISHOPS_E];
var TEMPO_S              = EV[iTEMPO_S];
var TEMPO_E              = EV[iTEMPO_E];

//}}}
//{{{  pst lists

var WE_PST = [NULL_PST, WPAWN_PSTE,  WKNIGHT_PSTE, WBISHOP_PSTE, WROOK_PSTE, WQUEEN_PSTE, WKING_PSTE]; // end eval.
var WS_PST = [NULL_PST, WPAWN_PSTS,  WKNIGHT_PSTS, WBISHOP_PSTS, WROOK_PSTS, WQUEEN_PSTS, WKING_PSTS]; // opening/middle eval.

var BS_PST = [NULL_PST, BPAWN_PSTS,  BKNIGHT_PSTS, BBISHOP_PSTS, BROOK_PSTS, BQUEEN_PSTS, BKING_PSTS];
var BE_PST = [NULL_PST, BPAWN_PSTE,  BKNIGHT_PSTE, BBISHOP_PSTE, BROOK_PSTE, BQUEEN_PSTE, BKING_PSTE];

var WM_PST = [NULL_PST, WPAWN_PSTE,  WKNIGHT_PSTE, WBISHOP_PSTE, WROOK_PSTE, WQUEEN_PSTE, WKING_PSTE]; // move ordering.
var BM_PST = [NULL_PST, BPAWN_PSTE,  BKNIGHT_PSTE, BBISHOP_PSTE, BROOK_PSTE, BQUEEN_PSTE, BKING_PSTE];

//}}}

//{{{  lozChess class

//{{{  lozChess
//
//   node[0]
//     .root            =  true;
//     .ply             =  0
//     .parentNode      => NULL
//     .grandParentNode => NULL
//     .childNode       => node[1];
//
//   node[1]
//     .root            =  false;
//     .ply             =  1
//     .parentNode      => node[0]
//     .grandParentNode => NULL
//     .childNode       => node[2];
//
//  ...
//
//   node[n]
//     .root            =  false;
//     .ply             =  n
//     .parentNode      => node[n-1]
//     .grandParentNode => node[n-2] | NULL
//     .childNode       => node[n+1] | NULL
//
//   etc
//
//  Search starts at node[0] with a depth spec.  In Lozza "depth" is the depth to
//  search and can jump around all over the place with extensions and reductions,
//  "ply" is the distance from the root.  Killers are stored in nodes because they
//  need to be ply based not depth based.  The .grandParentNode pointer can be used
//  to easily look up killers for the previous move of the same colour.
//

function lozChess () {

  this.nodes = Array(MAX_PLY);

  var parentNode = null;
  for (var i=0; i < this.nodes.length; i++) {
    this.nodes[i]      = new lozNode(parentNode);
    this.nodes[i].ply  = i;                     // distance to root node for mate etc.
    parentNode         = this.nodes[i];
    this.nodes[i].root = i == 0;
  }

  this.board = new lozBoard();
  this.stats = new lozStats();
  this.uci   = new lozUCI();

  this.rootNode = this.nodes[0];

  for (var i=0; i < this.nodes.length; i++)
    this.nodes[i].board = this.board;

  this.board.init();

  //{{{  init STARRAY (b init in here)
  //
  // STARRAY can be used when in check to filter moves that cannot possibly
  // be legal without overhead.  Happily EP captures fall out in the wash
  // since they are to a square that a knight would be checking the king on.
  //
  // e.g. with a king on A1, STARRAY[A1] =
  //
  // 1  0  0  0  0  0  0  2
  // 1  0  0  0  0  0  2  0
  // 1  0  0  0  0  2  0  0
  // 1  0  0  0  2  0  0  0
  // 1  0  0  2  0  0  0  0
  // 1 -1  2  0  0  0  0  0
  // 1  2 -1  0  0  0  0  0
  // 0  3  3  3  3  3  3  3
  //
  // Now condsider a rook on H1.  Slides to H2-H7 are not considered because they
  // do not hit a ray and thus cannot be used to block a check.  The rook slide
  // to H8 hits a ray, but corners are special cases - you can't slide to a corner
  // to block a check, so it's also ignored.  The slides to G1-B1 hit rays but the
  // from and to rays are the same, so again these slides cannot block a check.
  // Captures to any ray are always considered. -1 = knight attacks, so slides must
  // be to rays > 0 to be considered at all.  This vastly reduces the number of
  // moves to consider when in check and is available pretty much for free.  Captures
  // could be further pruned by considering the piece type encountered - i.e. can it
  // theoretically be giving check or not.
  //
  
  for (var i=0; i < this.board.b.length; i++)
    this.board.b[i] = EDGE;
  
  for (var i=0; i < B88.length; i++)
    this.board.b[B88[i]] = NULL;
  
  for (var i=0; i < 144; i++) {
    STARRAY[i] = Array(144);
    for (var j=0; j < 144; j++)
      STARRAY[i][j] = 0;
  }
  
  for (var i=0; i < B88.length; i++) {
    var sq = B88[i];
    for (var j=0; j < KING_OFFSETS.length; j++) {
      var offset = KING_OFFSETS[j];
      for (var k=1; k < 8; k++) {
        var dest = sq + k * offset;
        if (this.board.b[dest] == EDGE)
          break;
        STARRAY[sq][dest] = j+1;
      }
    }
    for (var j=0; j < KNIGHT_OFFSETS.length; j++) {
      var offset = KNIGHT_OFFSETS[j];
      var dest   = sq + offset;
      if (this.board.b[dest] == EDGE)
        continue;
      STARRAY[sq][dest] = -1;
    }
  }
  
  //}}}
  //{{{  init *KZONES
  
  for (var i=0; i < 144; i++) {
  
    WKZONES[i] = Array(144);
    for (var j=0; j < 144; j++)
      WKZONES[i][j] = 0;
  
    BKZONES[i] = Array(144);
    for (var j=0; j < 144; j++)
      BKZONES[i][j] = 0;
  }
  
  for (var i=0; i < B88.length; i++) {
  
    var sq  = B88[i];
    var wkz = WKZONES[sq];
    var bkz = BKZONES[sq];
  
  // W
  
    if (!this.board.b[sq+13]) wkz[sq+13]=1;
    if (!this.board.b[sq+12]) wkz[sq+12]=1;
    if (!this.board.b[sq+11]) wkz[sq+11]=1;
  
    if (!this.board.b[sq-1])  wkz[sq-1]=1;
    if (!this.board.b[sq+0])  wkz[sq+0]=1;
    if (!this.board.b[sq+1])  wkz[sq+1]=1;
  
    if (!this.board.b[sq-11]) wkz[sq-11]=1;
    if (!this.board.b[sq-12]) wkz[sq-12]=1;
    if (!this.board.b[sq-13]) wkz[sq-13]=1;
  
    if (!this.board.b[sq-23]) wkz[sq-23]=1;
    if (!this.board.b[sq-24]) wkz[sq-24]=1;
    if (!this.board.b[sq-25]) wkz[sq-25]=1;
  
  // B
  
    if (!this.board.b[sq-13]) bkz[sq-13]=1;
    if (!this.board.b[sq-12]) bkz[sq-12]=1;
    if (!this.board.b[sq-11]) bkz[sq-11]=1;
  
    if (!this.board.b[sq-1])  bkz[sq-1]=1;
    if (!this.board.b[sq+0])  bkz[sq+0]=1;
    if (!this.board.b[sq+1])  bkz[sq+1]=1;
  
    if (!this.board.b[sq+11]) bkz[sq+11]=1;
    if (!this.board.b[sq+12]) bkz[sq+12]=1;
    if (!this.board.b[sq+13]) bkz[sq+13]=1;
  
    if (!this.board.b[sq+23]) bkz[sq+23]=1;
    if (!this.board.b[sq+24]) bkz[sq+24]=1;
    if (!this.board.b[sq+25]) bkz[sq+25]=1;
  }
  
  //}}}
  //{{{  init DIST
  
  for (var i=0; i < 144; i++) {
    DIST[i]   = Array(144);
    var rankI = RANK[i];
    var fileI = FILE[i];
    for (var j=0; j < 144; j++) {
      var rankJ = RANK[j];
      var fileJ = FILE[j];
      DIST[i][j] = Math.max(Math.abs(rankI-rankJ),Math.abs(fileI-fileJ));
    }
  }
  
  //}}}

  return this;
}

//}}}
//{{{  .init

lozChess.prototype.init = function () {

  for (var i=0; i < this.nodes.length; i++)
    this.nodes[i].init();

  this.board.init();
  this.stats.init();
}

//}}}
//{{{  .newGameInit

lozChess.prototype.newGameInit = function () {

  this.board.ttInit();
  this.uci.numMoves = 0;
}

//}}}
//{{{  .position

lozChess.prototype.position = function () {

  this.init();
  return this.board.position();
}

//}}}
//{{{  .go

lozChess.prototype.go = function() {

  //this.stats.init();
  //this.stats.update();

  var board = this.board;
  var spec  = this.uci.spec;

  //{{{  sort out spec
  
  //this.uci.send('info hashfull',myround(1000*board.hashUsed/TTSIZE));
  
  var totTime = 0;
  var movTime = 0;
  var incTime = 0;
  
  if (spec.depth <= 0)
    spec.depth = MAX_PLY;
  
  if (spec.moveTime > 0)
    this.stats.moveTime = spec.moveTime;
  
  if (spec.maxNodes > 0)
    this.stats.maxNodes = spec.maxNodes;
  
  if (spec.moveTime == 0) {
  
    if (spec.movesToGo > 0)
      var movesToGo = spec.movesToGo + 2;
    else
      var movesToGo = 30;
  
    if (board.turn == WHITE) {
      totTime = spec.wTime;
      incTime = spec.wInc;
    }
    else {
      totTime = spec.bTime;
      incTime = spec.bInc;
    }
  
    //totTime = myround(totTime * (movesToGo - 1) / movesToGo);
    movTime = myround(totTime / movesToGo) + incTime;
  
    //if (this.uci.numMoves <= 3) {
      //movTime *= 2;
    //}
  
    movTime = movTime * 0.95;
  
    if (movTime > 0)
      this.stats.moveTime = movTime | 0;
  
    if (this.stats.moveTime < 1 && (spec.wTime || spec.bTime))
      this.stats.moveTime = 1;
  }
  
  //}}}

  var alpha       = -INFINITY;
  var beta        = INFINITY;
  var asp         = ASP_MAX;
  var ply         = 1;
  var maxPly      = spec.depth;
  var bestMoveStr = '';
  var score       = 0;

  while (ply <= maxPly) {

    this.stats.ply = ply;

    score = this.search(this.rootNode, ply, board.turn, alpha, beta);

    if (this.stats.timeOut) {
      break;
    }

    if (score <= alpha || score >= beta) {
      //{{{  research
      
      if (score >= beta) {
        ;
      }
      else {
        if (totTime > 30000) {
          movTime              = movTime / 2 | 0;
          this.stats.moveTime += movTime;
        }
      }
      
      alpha = -INFINITY;
      beta  = INFINITY;
      asp   = ASP_MAX * 10;
      
      continue;
      
      //}}}
    }

    if (Math.abs(score) >= MINMATE && Math.abs(score) <= MATE) {
      break;
    }

    alpha = score - asp;
    beta  = score + asp;

    asp -= ASP_DELTA;       //  shrink the window.
    if (asp < ASP_MIN)
      asp = ASP_MIN;

    ply += 1;
  }

  this.stats.update();
  this.stats.stop();

  bestMoveStr = board.formatMove(this.stats.bestMove,UCI_FMT);

  if (lozzaHost == HOST_WEB)
    board.makeMove(this.rootNode,this.stats.bestMove);

  if (LICHESS)
    console.log('bestmove',bestMoveStr);
  else
    this.uci.send('bestmove',bestMoveStr);
}

//}}}
//{{{  .search

lozChess.prototype.search = function (node, depth, turn, alpha, beta) {

  //{{{  housekeeping
  
  if (!node.childNode) {
    console.log('s depth');  // ##ifdef
    this.stats.timeOut = 1;
    return;
  }
  
  //}}}

  this.stats.nodes++;

  var board          = this.board;
  var nextTurn       = ~turn & COLOR_MASK;
  var oAlpha         = alpha;
  var numLegalMoves  = 0;
  var numSlides      = 0;
  var move           = 0;
  var bestMove       = 0;
  var score          = 0;
  var bestScore      = -INFINITY;
  var inCheck        = board.isKingAttacked(nextTurn);
  var R              = 0;
  var E              = 0;
  var givesCheck     = INCHECK_UNKNOWN;
  var keeper         = false;
  var doLMR          = depth >= 3;

  node.cache();

  board.ttGet(node, depth, alpha, beta);  // load hash move.

  if (inCheck)
    board.genEvasions(node, turn);
  else
    board.genMoves(node, turn);

  if (this.stats.timeOut)
    return;

  while (move = node.getNextMove()) {

    board.makeMove(node,move);

    //{{{  legal?
    
    if (board.isKingAttacked(nextTurn)) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    numLegalMoves++;
    if (node.base < BASE_LMR)
      numSlides++;

    //{{{  send current move to UCI
    
    if (!LICHESS && this.stats.splits > 3)
      this.uci.send('info currmove ' + board.formatMove(move,SAN_FMT) + ' currmovenumber ' + numLegalMoves);
    
    //}}}

    //{{{  extend/reduce
    
    givesCheck = INCHECK_UNKNOWN;
    E          = 0;
    R          = 0;
    
    if (inCheck) {
      E = 1;
    }
    
    else if (doLMR) {
    
      givesCheck = board.isKingAttacked(turn);
      keeper     = node.base >= BASE_LMR || (move & KEEPER_MASK) || givesCheck || board.alphaMate(alpha);
    
      if (!keeper && numSlides > 4) {
        R = 1 + depth/5 + numSlides/20 | 0;
      }
    }
    
    //}}}

    if (numLegalMoves == 1) {
      score = -this.alphabeta(node.childNode, depth+E-1, nextTurn, -beta, -alpha, NULL_Y, givesCheck);
    }
    else {
      score = -this.alphabeta(node.childNode, depth+E-R-1, nextTurn, -alpha-1, -alpha, NULL_Y, givesCheck);
      if (!this.stats.timeOut && score > alpha) {
        score = -this.alphabeta(node.childNode, depth+E-1, nextTurn, -beta, -alpha, NULL_Y, givesCheck);
      }
    }

    //{{{  unmake move
    
    board.unmakeMove(node,move);
    
    node.uncache();
    
    //}}}

    if (this.stats.timeOut) {
      return;
    }

    if (score > bestScore) {
      if (score > alpha) {
        if (score >= beta) {
          node.addKiller(score, move);
          board.ttPut(TT_BETA, depth, score, move, node.ply, alpha, beta);
          board.addHistory(depth*depth*depth, move);
          return score;
        }
        alpha = score;
        board.addHistory(depth*depth, move);
        //{{{  update best move & send score to UI
        
        this.stats.bestMove = move;
        
        var absScore = Math.abs(score);
        var units    = 'cp';
        var uciScore = score;
        var mv       = board.formatMove(move,board.mvFmt);
        var pvStr    = board.getPVStr(node,move,depth);
        
        if (absScore >= MINMATE && absScore <= MATE) {
          if (lozzaHost != HOST_NODEJS)
            pvStr += '#';
          var units    = 'mate';
          var uciScore = (MATE - absScore) / 2 | 0;
          if (score < 0)
            uciScore = -uciScore;
        }
        
        if (!LICHESS) {
          this.uci.send('info',this.stats.nodeStr(),'depth',this.stats.ply,'seldepth',this.stats.selDepth,'score',units,uciScore,'pv',pvStr);
          //this.stats.update();
        
          if (this.stats.splits > 5)
            this.uci.send('info hashfull',myround(1000*board.hashUsed/TTSIZE));
        }
        
        //}}}
      }
      bestScore = score;
      bestMove  = move;
    }
    else
      board.addHistory(-depth, move);
  }

  if (numLegalMoves == 0) {  // ##ifdef
    console.log('INVALID');  // ##ifdef
  }                          // ##ifdef

  if (numLegalMoves == 1)
    this.stats.timeOut = 1;  // only one legal move so don't waste any more time.

  if (bestScore > oAlpha) {
    board.ttPut(TT_EXACT, depth, bestScore, bestMove, node.ply, alpha, beta);
    return bestScore;
  }
  else {
    board.ttPut(TT_ALPHA, depth, oAlpha,    bestMove, node.ply, alpha, beta);
    return oAlpha;
  }
}

//}}}
//{{{  .alphabeta

lozChess.prototype.alphabeta = function (node, depth, turn, alpha, beta, nullOK, inCheck) {

  //{{{  housekeeping
  
  if (!node.childNode) {
    console.log('AB DEPTH');  // ##ifdef
    this.stats.timeOut = 1;
    return;
  }
  
  this.stats.lazyUpdate();
  if (this.stats.timeOut)
    return;
  
  if (node.ply > this.stats.selDepth)
    this.stats.selDepth = node.ply;
  
  //}}}

  var board    = this.board;
  var nextTurn = ~turn & COLOR_MASK;
  var score    = 0;
  var pvNode   = beta != (alpha + 1);

  //{{{  mate distance pruning
  
  var matingValue = MATE - node.ply;
  
  if (matingValue < beta) {
     beta = matingValue;
     if (alpha >= matingValue)
       return matingValue;
  }
  
  var matingValue = -MATE + node.ply;
  
  if (matingValue > alpha) {
     alpha = matingValue;
     if (beta <= matingValue)
       return matingValue;
  }
  
  //}}}
  //{{{  check for draws
  
  if (board.repHi - board.repLo > 100)
    return CONTEMPT;
  
  for (var i=board.repHi-5; i >= board.repLo; i -= 2) {
  
    if (board.repLoHash[i] == board.loHash && board.repHiHash[i] == board.hiHash)
      return CONTEMPT;
  }
  
  //}}}
  //{{{  horizon
  
  if (depth <= 0) {
  
    score = board.ttGet(node, 0, alpha, beta);
  
    if (score != TTSCORE_UNKNOWN)
      return score;
  
    score = this.qSearch(node, -1, turn, alpha, beta, 0);
  
    return score;
  }
  
  //}}}
  //{{{  try tt
  
  score = board.ttGet(node, depth, alpha, beta);  // sets/clears node.hashMove.
  
  if (!pvNode && score != TTSCORE_UNKNOWN) {
    return score;
  }
  
  //}}}

  if (inCheck == INCHECK_UNKNOWN)
    inCheck  = board.isKingAttacked(nextTurn);

  var R         = 0;
  var E         = 0;
  var lonePawns = (turn == WHITE && board.wCount == board.wCounts[PAWN]+1) || (turn == BLACK && board.bCount == board.bCounts[PAWN]+1);
  var standPat  = board.evaluate(turn);
  var doBeta    = !pvNode && !inCheck && !lonePawns && nullOK == NULL_Y && !board.betaMate(beta);

  //{{{  prune?
  
  if (doBeta && depth <= 2 && (standPat - depth * 200) >= beta) {
    return beta;
  }
  
  //}}}

  node.cache();

  //{{{  try null move
  //
  //  Use childNode to make sure killers are aligned.
  //
  
  R = 3;
  
  if (doBeta && depth > 2 && standPat > beta) {
  
    board.loHash ^= board.loEP[board.ep];
    board.hiHash ^= board.hiEP[board.ep];
  
    board.ep = 0; // what else?
  
    board.loHash ^= board.loEP[board.ep];
    board.hiHash ^= board.hiEP[board.ep];
  
    board.loHash ^= board.loTurn;
    board.hiHash ^= board.hiTurn;
  
    score = -this.alphabeta(node.childNode, depth-R-1, nextTurn, -beta, -beta+1, NULL_N, INCHECK_UNKNOWN);
  
    node.uncache();
  
    if (this.stats.timeOut)
      return;
  
    if (score >= beta) {
      if (board.betaMate(score))
        score = beta;
      return score;
    }
  
    if (this.stats.timeOut)
      return;
  }
  
  R = 0;
  
  //}}}

  this.stats.nodes++;

  var bestScore      = -INFINITY;
  var move           = 0;
  var bestMove       = 0;
  var oAlpha         = alpha;
  var numLegalMoves  = 0;
  var numSlides      = 0;
  var givesCheck     = INCHECK_UNKNOWN;
  var keeper         = false;
  var doFutility     = !inCheck && depth <= 4 && (standPat + depth * 120) < alpha && !lonePawns;
  var doLMR          = !inCheck && depth >= 3;
  var doLMP          = !pvNode && !inCheck && depth <= 2 && !lonePawns;
  var doIID          = !node.hashMove && pvNode && depth > 3;

  //{{{  IID
  //
  //  If there is no hash move after IID it means that the search returned
  //  a mate or draw score and we could return immediately I think, because
  //  the subsequent search is presumably going to find the same.  However
  //  it's a small optimisation and I'm not totally convinced.  Needs to be
  //  tested.
  //
  //  Use this node so the killers align.  Should be safe.
  //
  
  if (doIID) {
  
    this.alphabeta(node, depth-2, turn, alpha, beta, NULL_N, inCheck);
    board.ttGet(node, 0, alpha, beta);
  }
  
  if (this.stats.timeOut)
    return;
  
  //}}}

  if (inCheck)
    board.genEvasions(node, turn);
  else
    board.genMoves(node, turn);

  if (this.stats.timeOut)
    return;

  while (move = node.getNextMove()) {

    if (node.base < BASE_LMR) {
      numSlides++;
    }

    //{{{  extend/reduce/prune
    
    givesCheck = INCHECK_UNKNOWN;
    E          = 0;
    R          = 0;
    
    if (inCheck && (pvNode || depth < 5)) {
      E = 1;
    }
    
    else if (numLegalMoves > 0 && (doLMP || doLMR || doFutility)) {
    
      keeper = node.base >= BASE_LMR || (move & KEEPER_MASK) || board.alphaMate(alpha);
    
      if (!keeper) {
    
        board.makePseudoMove(move);
        givesCheck = board.isKingAttacked(turn);
        board.unmakePseudoMove(move);
    
        if (doLMP && !givesCheck && numSlides > depth*5) {
          continue;
        }
    
        if (doFutility && !givesCheck) {
          continue;
        }
    
        if (doLMR && !givesCheck && node.sortedIndex > 4) {
          R = 1 + depth/5 + numSlides/20 | 0;
        }
      }
    }
    
    //}}}

    board.makeMove(node,move);

    //{{{  legal?
    
    if (board.isKingAttacked(nextTurn)) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    numLegalMoves++;

    if (pvNode) {
      if (numLegalMoves == 1)
        score = -this.alphabeta(node.childNode, depth+E-1, nextTurn, -beta, -alpha, NULL_Y, givesCheck);
      else {
        score = -this.alphabeta(node.childNode, depth+E-R-1, nextTurn, -alpha-1, -alpha, NULL_Y, givesCheck);
        if (!this.stats.timeOut && score > alpha) {
          score = -this.alphabeta(node.childNode, depth+E-1, nextTurn, -beta, -alpha, NULL_Y, givesCheck);
        }
      }
    }
    else {
      score = -this.alphabeta(node.childNode, depth+E-R-1, nextTurn, -beta, -alpha, NULL_Y, givesCheck);  // ZW by implication.
      if (R && !this.stats.timeOut && score > alpha)
        score = -this.alphabeta(node.childNode, depth+E-1, nextTurn, -beta, -alpha, NULL_Y, givesCheck);
    }

    //{{{  unmake move
    
    board.unmakeMove(node,move);
    
    node.uncache();
    
    //}}}

    if (this.stats.timeOut)
      return;

    if (score > bestScore) {
      if (score > alpha) {
        if (score >= beta) {
          node.addKiller(score, move);
          board.ttPut(TT_BETA, depth, score, move, node.ply, alpha, beta);
          board.addHistory(depth*depth*depth, move);
          return score;
        }
        board.addHistory(depth*depth, move);
        alpha     = score;
      }
      bestScore = score;
      bestMove  = move;
    }
    else
      board.addHistory(-depth, move);
  }

  //{{{  no moves?
  
  if (numLegalMoves == 0) {
  
    if (inCheck) {
      board.ttPut(TT_EXACT, depth, -MATE + node.ply, 0, node.ply, alpha, beta);
      return -MATE + node.ply;
    }
  
    else {
      board.ttPut(TT_EXACT, depth, CONTEMPT, 0, node.ply, alpha, beta);
      return CONTEMPT;
    }
  }
  
  //}}}

  if (bestScore > oAlpha) {
    board.ttPut(TT_EXACT, depth, bestScore, bestMove, node.ply, alpha, beta);
    return bestScore;
  }
  else {
    board.ttPut(TT_ALPHA, depth, oAlpha,    bestMove, node.ply, alpha, beta);
    return oAlpha;
  }
}

//}}}
//{{{  .quiescence

lozChess.prototype.qSearch = function (node, depth, turn, alpha, beta, sq) {

  //{{{  housekeeping
  
  //this.stats.checkTime();
  //if (this.stats.timeOut)
    //return;
  
  if (node.ply > this.stats.selDepth)
    this.stats.selDepth = node.ply;
  
  if (!node.childNode) {
    console.log('Q DEPTH');  // ##ifdef
    return this.board.evaluate(turn);
  }
  
  //}}}

  var board         = this.board;
  var numLegalMoves = 0;
  var move          = 0;
  var standPat      = 0;
  var phase         = 0;
  var nextTurn      = ~turn & COLOR_MASK;
  var to            = 0;

  if (depth > -2)
    var inCheck = board.isKingAttacked(nextTurn);
  else
    var inCheck = false;

  if (!inCheck) {
    standPat = board.evaluate(turn);
    if (standPat >= beta)
      return standPat;
    if (standPat >= alpha)
      alpha = standPat;
    phase = board.cleanPhase(board.phase);
  }

  this.stats.nodes++;

  node.cache();

  if (inCheck) {
    board.genEvasions(node, turn);
  }
  else {
    if (sq && depth < -12)
      board.genQMovesTo(node, turn, sq);
    else
      board.genQMoves(node, turn);
  }

  while (move = node.getNextMove()) {

    //{{{  prune?
    
    if (!inCheck && phase <= EPHASE && !(move & MOVE_PROMOTE_MASK) && standPat + 200 + VALUE_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK] < alpha) {
    
      continue;
    }
    
    //}}}

    board.makeMove(node,move);

    //{{{  legal?
    
    if (board.isKingAttacked(nextTurn)) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    numLegalMoves++;

    var score = -this.qSearch(node.childNode, depth-1, nextTurn, -beta, -alpha, (move & MOVE_TO_MASK) >>> MOVE_TO_BITS);

    //{{{  unmake move
    
    board.unmakeMove(node,move);
    
    node.uncache();
    
    //}}}

    if (score > alpha) {
      if (score >= beta) {
        return score;
      }
      alpha = score;
    }
  }

  //{{{  no moves?
  //
  // Some legal moves will be missed because of futility but only
  // if not in check and numLegalMoves is only needed if in check.
  //
  
  if (inCheck && numLegalMoves == 0) {
  
     return -MATE + node.ply;
  }
  
  //}}}

  return alpha;
}

//}}}
//{{{  .perft

lozChess.prototype.perft = function () {

  var spec = this.uci.spec;

  this.stats.ply = spec.depth;

  var moves = this.perftSearch(this.rootNode, spec.depth, this.board.turn, spec.inner);

  this.stats.update();

  var error = moves - spec.moves;

  if (error == 0)
    var err = '';
  else
    var err = 'ERROR ' + error;

  this.uci.send('info string',spec.id,spec.depth,moves,spec.moves,err,this.board.fen());
}

//}}}
//{{{  .perftSearch

lozChess.prototype.perftSearch = function (node, depth, turn, inner) {

  if (depth == 0)
    return 1;

  var board         = this.board;
  var numNodes      = 0;
  var totalNodes    = 0;
  var move          = 0;
  var nextTurn      = ~turn & COLOR_MASK;
  var numLegalMoves = 0;
  var inCheck       = board.isKingAttacked(nextTurn);

  node.cache();

  this.stats.nodes++;

  if (inCheck)
    board.genEvasions(node, turn);
  else
    board.genMoves(node, turn);

  while (move = node.getNextMove()) {

    board.makeMove(node,move);

    //{{{  legal?
    
    if (board.isKingAttacked(nextTurn)) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    numLegalMoves++;

    var numNodes = this.perftSearch(node.childNode, depth-1, nextTurn);

    totalNodes += numNodes;

    //{{{  unmake move
    
    board.unmakeMove(node,move);
    
    node.uncache();
    
    //}}}

    if (node.root) {
      var fmove = board.formatMove(move,SAN_FMT);
      this.uci.send('info currmove ' + fmove + ' currmovenumber ' + numLegalMoves);
      if (inner)
        this.uci.send('info string',fmove,numNodes);
    }
  }

  if (depth > 2)
    this.stats.lazyUpdate();

  return totalNodes;
}

//}}}

//}}}
//{{{  lozBoard class

//{{{  lozBoard

function lozBoard () {

  this.features          = {};                      // ##ifdef
  this.features.wShelter = Array(WSHELTER.length);  // ##ifdef
  this.features.wStorm   = Array(WSTORM.length);    // ##ifdef
  this.features.wOutpost = Array(144);              // ##ifdef
  this.features.mobN     = Array(MOBN_S.length);    // ##ifdef
  this.features.mobB     = Array(MOBB_S.length);    // ##ifdef
  this.features.mobR     = Array(MOBR_S.length);    // ##ifdef
  this.features.mobQ     = Array(MOBQ_S.length);    // ##ifdef

  this.lozza        = null;
  this.verbose      = false;
  this.mvFmt        = 0;
  this.hashUsed     = 0;

  this.b = new Uint16Array(144);    // pieces.
  this.z = new Uint16Array(144);    // indexes to w|bList.

  this.wList = new Uint16Array(16); // list of squares with white pieces.
  this.bList = new Uint16Array(16); // list of squares with black pieces.

  this.firstBP = 0;
  this.firstWP = 0;

  this.runningEvalS = 0;  // these are all cached across make/unmakeMove.
  this.runningEvalE = 0;
  this.rights       = 0;
  this.ep           = 0;
  this.repLo        = 0;
  this.repHi        = 0;
  this.loHash       = 0;
  this.hiHash       = 0;
  this.ploHash      = 0;
  this.phiHash      = 0;

  // use separate typed arrays to save space.  optimiser probably has a go anyway but better
  // to be explicit at the expense of some conversion.  total width is 16 bytes.

  this.ttLo      = new Int32Array(TTSIZE);
  this.ttHi      = new Int32Array(TTSIZE);
  this.ttType    = new Uint8Array(TTSIZE);
  this.ttDepth   = new Int8Array(TTSIZE);   // allow -ve depths but currently not used for q.
  this.ttMove    = new Uint32Array(TTSIZE); // see constants for structure.
  this.ttScore   = new Int16Array(TTSIZE);

  this.pttLo     = new Int32Array(PTTSIZE);
  this.pttHi     = new Int32Array(PTTSIZE);
  this.pttFlags  = new Uint8Array(PTTSIZE);
  this.pttScoreS = new Int16Array(PTTSIZE);
  this.pttScoreE = new Int16Array(PTTSIZE);
  this.pttwLeast = new Uint32Array(PTTSIZE);
  this.pttbLeast = new Uint32Array(PTTSIZE);
  this.pttwMost  = new Uint32Array(PTTSIZE);
  this.pttbMost  = new Uint32Array(PTTSIZE);

  this.ttType.fill(TT_EMPTY);
  this.pttFlags.fill(TT_EMPTY);

  this.turn = 0;

  //{{{  Zobrist turn
  
  this.loTurn = this.rand32();
  this.hiTurn = this.rand32();
  
  //}}}
  //{{{  Zobrist pieces
  
  this.loPieces = Array(2);
  for (var i=0; i < 2; i++) {
    this.loPieces[i] = Array(6);
    for (var j=0; j < 6; j++) {
      this.loPieces[i][j] = new Array(144);
      for (var k=0; k < 144; k++)
        this.loPieces[i][j][k] = this.rand32();
    }
  }
  
  this.hiPieces = Array(2);
  for (var i=0; i < 2; i++) {
    this.hiPieces[i] = Array(6);
    for (var j=0; j < 6; j++) {
      this.hiPieces[i][j] = new Array(144);
      for (var k=0; k < 144; k++)
        this.hiPieces[i][j][k] = this.rand32();
    }
  }
  
  //}}}
  //{{{  Zobrist rights
  
  this.loRights = new Array(16);
  this.hiRights = new Array(16);
  
  for (var i=0; i < 16; i++) {
    this.loRights[i] = this.rand32();
    this.hiRights[i] = this.rand32();
  }
  
  //}}}
  //{{{  Zobrist EP
  
  this.loEP = new Array(144);
  this.hiEP = new Array(144);
  
  for (var i=0; i < 144; i++) {
    this.loEP[i] = this.rand32();
    this.hiEP[i] = this.rand32();
  }
  
  //}}}

  this.repLoHash = new Array(1000);
  for (var i=0; i < 1000; i++)
    this.repLoHash[i] = 0;

  this.repHiHash = new Array(1000);
  for (var i=0; i < 1000; i++)
    this.repHiHash[i] = 0;

  this.phase = TPHASE;

  this.wCounts = new Uint16Array(7);
  this.bCounts = new Uint16Array(7);

  this.wCount  = 0;
  this.bCount  = 0;

  this.wHistory = Array(7)
  for (var i=0; i < 7; i++) {
    this.wHistory[i] = Array(144);
    for (var j=0; j < 144; j++)
      this.wHistory[i][j] = 0;
  }

  this.bHistory = Array(7)
  for (var i=0; i < 7; i++) {
    this.bHistory[i] = Array(144);
    for (var j=0; j < 144; j++)
      this.bHistory[i][j] = 0;
  }
}

//}}}
//{{{  .init

lozBoard.prototype.init = function () {

  for (var i=0; i < this.b.length; i++)
    this.b[i] = EDGE;

  for (var i=0; i < B88.length; i++)
    this.b[B88[i]] = NULL;

  for (var i=0; i < this.z.length; i++)
    this.z[i] = NO_Z;

  this.loHash = 0;
  this.hiHash = 0;

  this.ploHash = 0;
  this.phiHash = 0;

  this.repLo = 0;
  this.repHi = 0;

  this.phase = TPHASE;

  for (var i=0; i < this.wCounts.length; i++)
    this.wCounts[i] = 0;

  for (var i=0; i < this.bCounts.length; i++)
    this.bCounts[i] = 0;

  this.wCount = 0;
  this.bCount = 0;

  for (var i=0; i < this.wList.length; i++)
    this.wList[i] = EMPTY;

  for (var i=0; i < this.bList.length; i++)
    this.bList[i] = EMPTY;

  this.firstBP = 0;
  this.firstWP = 0;

  if (lozzaHost == HOST_WEB)
    this.mvFmt = SAN_FMT;
  else
    this.mvFmt = UCI_FMT;
}

//}}}
//{{{  .position

lozBoard.prototype.position = function () {

  var spec = lozza.uci.spec;

  //{{{  board turn
  
  if (spec.turn == 'w')
    this.turn = WHITE;
  
  else {
    this.turn = BLACK;
    this.loHash ^= this.loTurn;
    this.hiHash ^= this.hiTurn;
  }
  
  //}}}
  //{{{  board rights
  
  this.rights = 0;
  
  for (var i=0; i < spec.rights.length; i++) {
  
    var ch = spec.rights.charAt(i);
  
    if (ch == 'K') this.rights |= WHITE_RIGHTS_KING;
    if (ch == 'Q') this.rights |= WHITE_RIGHTS_QUEEN;
    if (ch == 'k') this.rights |= BLACK_RIGHTS_KING;
    if (ch == 'q') this.rights |= BLACK_RIGHTS_QUEEN;
  }
  
  this.loHash ^= this.loRights[this.rights];
  this.hiHash ^= this.hiRights[this.rights];
  
  //}}}
  //{{{  board board
  
  this.phase = TPHASE;
  
  var sq = 0;
  var nw = 0;
  var nb = 0;
  
  for (var j=0; j < spec.board.length; j++) {
  
    var ch  = spec.board.charAt(j);
    var chn = parseInt(ch);
  
    while (this.b[sq] == EDGE)
      sq++;
  
    if (isNaN(chn)) {
  
      if (ch != '/') {
  
        var obj   = MAP[ch];
        var piece = obj & PIECE_MASK;
        var col   = obj & COLOR_MASK;
  
        if (col == WHITE) {
          this.wList[nw] = sq;
          this.b[sq]     = obj;
          this.z[sq]     = nw;
          nw++;
          this.wCounts[piece]++;
          this.wCount++;
        }
  
        else {
          this.bList[nb] = sq;
          this.b[sq]     = obj;
          this.z[sq]     = nb;
          nb++;
          this.bCounts[piece]++;
          this.bCount++;
        }
  
        this.loHash ^= this.loPieces[col>>>3][piece-1][sq];
        this.hiHash ^= this.hiPieces[col>>>3][piece-1][sq];
  
        if (piece == PAWN) {
          this.ploHash ^= this.loPieces[col>>>3][0][sq];
          this.phiHash ^= this.hiPieces[col>>>3][0][sq];
        }
  
        this.phase -= VPHASE[piece];
  
        sq++;
      }
    }
  
    else {
  
      for (var k=0; k < chn; k++) {
        this.b[sq] = NULL;
        sq++;
      }
    }
  }
  
  //}}}
  //{{{  board ep
  
  if (spec.ep.length == 2)
    this.ep = COORDS.indexOf(spec.ep)
  else
    this.ep = 0;
  
  this.loHash ^= this.loEP[this.ep];
  this.hiHash ^= this.hiEP[this.ep];
  
  //}}}

  //{{{  init running evals
  
  this.runningEvalS = 0;
  this.runningEvalE = 0;
  
  var next  = 0;
  var count = 0;
  
  while (count < this.wCount) {
  
    sq = this.wList[next];
  
    if (!sq) {
      next++;
      continue;
    }
  
    var piece = this.b[sq] & PIECE_MASK;
  
    this.runningEvalS += VALUE_VECTOR[piece];
    this.runningEvalS += WS_PST[piece][sq];
    this.runningEvalE += VALUE_VECTOR[piece];
    this.runningEvalE += WE_PST[piece][sq];
  
    count++;
    next++
  }
  
  var next  = 0;
  var count = 0;
  
  while (count < this.bCount) {
  
    sq = this.bList[next];
  
    if (!sq) {
      next++;
      continue;
    }
  
    var piece = this.b[sq] & PIECE_MASK;
  
    this.runningEvalS -= VALUE_VECTOR[piece];
    this.runningEvalS -= BS_PST[piece][sq];
    this.runningEvalE -= VALUE_VECTOR[piece];
    this.runningEvalE -= BE_PST[piece][sq];
  
    count++;
    next++
  }
  
  
  //}}}

  this.compact();

  for (var i=0; i < spec.moves.length; i++) {
    if (!this.playMove(spec.moves[i]))
      return 0;
  }

  this.compact();

  for (var i=0; i < 7; i++) {
    for (var j=0; j < 144; j++)
      this.wHistory[i][j] = 0;
  }

  for (var i=0; i < 7; i++) {
    for (var j=0; j < 144; j++)
      this.bHistory[i][j] = 0;
  }

  return 1;
}

//}}}
//{{{  .compact

lozBoard.prototype.compact = function () {

  //{{{  compact white list
  
  var v = [];
  
  for (var i=0; i<16; i++) {
    if (this.wList[i])
      v.push(this.wList[i]);
  }
  
  v.sort(function(a,b) {
    return lozza.board.b[b] - lozza.board.b[a];
  });
  
  for (var i=0; i<16; i++) {
    if (i < v.length) {
      this.wList[i] = v[i];
      this.z[v[i]]  = i;
    }
    else
      this.wList[i] = EMPTY;
  }
  
  this.firstWP = 0;
  for (var i=0; i<16; i++) {
    if (this.b[this.wList[i]] == W_PAWN) {
      this.firstWP = i;
      break;
    }
  }
  
  if (this.b[this.wList[0]] != W_KING)  // ##ifdef
    console.log('WHITE INDEX ERR');     // ##ifdef
  
  //}}}
  //{{{  compact black list
  
  var v = [];
  
  for (var i=0; i<16; i++) {
    if (this.bList[i])
      v.push(this.bList[i]);
  }
  
  v.sort(function(a,b) {
    return lozza.board.b[b] - lozza.board.b[a];
  });
  
  for (var i=0; i<16; i++) {
    if (i < v.length) {
      this.bList[i] = v[i];
      this.z[v[i]]  = i;
    }
    else
      this.bList[i] = EMPTY;
  }
  
  this.firstBP = 0;
  for (var i=0; i<16; i++) {
    if (this.b[this.bList[i]] == B_PAWN) {
      this.firstBP = i;
      break;
    }
  }
  
  if (this.b[this.bList[0]] != B_KING)  // ##ifdef
    console.log('BLACK INDEX ERR');     // ##ifdef
  
  //}}}
}

//}}}
//{{{  .genMoves

lozBoard.prototype.genMoves = function(node, turn) {

  node.numMoves    = 0;
  node.sortedIndex = 0;

  var b = this.b;

  //{{{  colour based stuff
  
  if (turn == WHITE) {
  
    var pOffsetOrth  = WP_OFFSET_ORTH;
    var pOffsetDiag1 = WP_OFFSET_DIAG1;
    var pOffsetDiag2 = WP_OFFSET_DIAG2;
    var pHomeRank    = 2;
    var pPromoteRank = 7;
    var rights       = this.rights & WHITE_RIGHTS;
    var pList        = this.wList;
    var theirKingSq  = this.bList[0];
    var pCount       = this.wCount;
    var CAPTURE      = IS_B;
  
    if (rights) {
  
      if ((rights & WHITE_RIGHTS_KING)  && b[F1] == NULL && b[G1] == NULL                  && !this.isAttacked(F1,BLACK) && !this.isAttacked(E1,BLACK))
        node.addCastle(MOVE_E1G1);
  
      if ((rights & WHITE_RIGHTS_QUEEN) && b[B1] == NULL && b[C1] == NULL && b[D1] == NULL && !this.isAttacked(D1,BLACK) && !this.isAttacked(E1,BLACK))
        node.addCastle(MOVE_E1C1);
    }
  }
  
  else {
  
    var pOffsetOrth  = BP_OFFSET_ORTH;
    var pOffsetDiag1 = BP_OFFSET_DIAG1;
    var pOffsetDiag2 = BP_OFFSET_DIAG2;
    var pHomeRank    = 7;
    var pPromoteRank = 2;
    var rights       = this.rights & BLACK_RIGHTS;
    var pList        = this.bList;
    var theirKingSq  = this.wList[0];
    var pCount       = this.bCount;
    var CAPTURE      = IS_W;
  
    if (rights) {
  
      if ((rights & BLACK_RIGHTS_KING)  && b[F8] == NULL && b[G8] == NULL &&                  !this.isAttacked(F8,WHITE) && !this.isAttacked(E8,WHITE))
        node.addCastle(MOVE_E8G8);
  
      if ((rights & BLACK_RIGHTS_QUEEN) && b[B8] == NULL && b[C8] == NULL && b[D8] == NULL && !this.isAttacked(D8,WHITE) && !this.isAttacked(E8,WHITE))
        node.addCastle(MOVE_E8C8);
    }
  }
  
  //}}}

  var next    = 0;
  var count   = 0;
  var to      = 0;
  var toObj   = 0;
  var fr      = 0;
  var frObj   = 0;
  var frPiece = 0;
  var frMove  = 0;
  var frRank  = 0;

  while (count < pCount) {

    fr = pList[next];
    if (!fr) {
      next++;
      continue;
    }

    frObj   = b[fr];
    frPiece = frObj & PIECE_MASK;
    frMove  = (frObj << MOVE_FROBJ_BITS) | (fr << MOVE_FR_BITS);
    frRank  = RANK[fr];

    if (frPiece == PAWN) {
      //{{{  P
      
      frMove |= MOVE_PAWN_MASK;
      
      to     = fr + pOffsetOrth;
      toObj  = b[to];
      
      if (!toObj) {
      
        if (frRank == pPromoteRank)
          node.addPromotion(frMove | to);
      
        else {
          node.addSlide(frMove | to);
      
          if (frRank == pHomeRank) {
      
            to += pOffsetOrth;
            if (!b[to])
              node.addSlide(frMove | to | MOVE_EPMAKE_MASK);
          }
        }
      }
      
      to    = fr + pOffsetDiag1;
      toObj = b[to];
      
      if (CAPTURE[toObj]) {
      
        if (frRank == pPromoteRank)
          node.addPromotion(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (!toObj && to == this.ep)
        node.addEPTake(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
      to    = fr + pOffsetDiag2;
      toObj = b[to];
      
      if (CAPTURE[toObj]) {
      
        if (frRank == pPromoteRank)
          node.addPromotion(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (!toObj && to == this.ep)
        node.addEPTake(frMove | to);
      
      //}}}
    }

    else if (IS_N[frObj]) {
      //{{{  N
      
      var offsets = OFFSETS[frPiece];
      var dir     = 0;
      
      while (dir < 8) {
      
        to    = fr + offsets[dir++];
        toObj = b[to];
      
        if (!toObj)
          node.addSlide(frMove | to);
        else if (CAPTURE[toObj])
          node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      //}}}
    }

    else if (IS_K[frObj]) {
      //{{{  K
      
      var offsets = OFFSETS[frPiece];
      var dir     = 0;
      
      while (dir < 8) {
      
        to    = fr + offsets[dir++];
        toObj = b[to];
      
        if (DIST[to][theirKingSq] > 1) {
          if (!toObj)
            node.addSlide(frMove | to);
          else if (CAPTURE[toObj])
            node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        }
      }
      
      //}}}
    }

    else {
      //{{{  BRQ
      
      var offsets = OFFSETS[frPiece];
      var len     = offsets.length;
      var dir     = 0;
      
      while (dir < len) {
      
        var offset = offsets[dir++];
      
        to     = fr + offset;
        toObj  = b[to];
      
        while (!toObj) {
      
          node.addSlide(frMove | to);
      
          to    += offset;
          toObj = b[to];
        }
      
        if (CAPTURE[toObj])
          node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      //}}}
    }

    next++;
    count++
  }
}

//}}}
//{{{  .genEvasions

lozBoard.prototype.genEvasions = function(node, turn) {

  node.numMoves    = 0;
  node.sortedIndex = 0;

  var b = this.b;

  //{{{  colour based stuff
  
  if (turn == WHITE) {
  
    var pOffsetOrth  = WP_OFFSET_ORTH;
    var pOffsetDiag1 = WP_OFFSET_DIAG1;
    var pOffsetDiag2 = WP_OFFSET_DIAG2;
    var pHomeRank    = 2;
    var pPromoteRank = 8;
    var pList        = this.wList;
    var pCount       = this.wCount;
    var ray          = STARRAY[this.wList[0]];
    var myKing       = W_KING;
    var theirKingSq  = this.bList[0];
  }
  
  else {
  
    var pOffsetOrth  = BP_OFFSET_ORTH;
    var pOffsetDiag1 = BP_OFFSET_DIAG1;
    var pOffsetDiag2 = BP_OFFSET_DIAG2;
    var pHomeRank    = 7;
    var pPromoteRank = 1;
    var pList        = this.bList;
    var pCount       = this.bCount;
    var ray          = STARRAY[this.bList[0]];
    var myKing       = B_KING;
    var theirKingSq  = this.wList[0];
  }
  
  //}}}

  var next  = 0;
  var count = 0;

  while (count < pCount) {

    var fr = pList[next];
    if (!fr) {
      next++;
      continue;
    }

    var frObj   = this.b[fr];
    var frPiece = frObj & PIECE_MASK;
    var frMove  = (frObj << MOVE_FROBJ_BITS) | (fr << MOVE_FR_BITS);
    var rayFrom = ray[fr];

    if (frPiece == PAWN) {
      //{{{  pawn
      
      frMove |= MOVE_PAWN_MASK;
      
      var to        = fr + pOffsetOrth;
      var toObj     = b[to];
      var rayTo     = ray[to];
      var keepSlide = rayTo > 0 && (rayTo != rayFrom) && !CORNERS[to];
      
      if (toObj == NULL) {
      
        if (RANK[to] == pPromoteRank && keepSlide)
          node.addPromotion(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
        else {
          if (keepSlide)
            node.addSlide(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
          if (RANK[fr] == pHomeRank) {
      
            to       += pOffsetOrth;
            toObj     = b[to];
            rayTo     = ray[to];
            keepSlide = rayTo > 0 && (rayTo != rayFrom) && !CORNERS[to];
      
            if (toObj == NULL && keepSlide)
              node.addSlide(frMove | (toObj << MOVE_TOOBJ_BITS) | to | MOVE_EPMAKE_MASK);
          }
        }
      }
      
      var to    = fr + pOffsetDiag1;
      var toObj = b[to];
      var rayTo = ray[to];
      
      if (toObj != NULL && toObj != EDGE && (toObj & COLOR_MASK) != turn && rayTo) {
      
        if (RANK[to] == pPromoteRank)
          node.addPromotion(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (toObj == NULL && to == this.ep && rayTo)
        node.addEPTake(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
      var to    = fr + pOffsetDiag2;
      var toObj = b[to];
      var rayTo = ray[to];
      
      if (toObj != NULL && toObj != EDGE && (toObj & COLOR_MASK) != turn && rayTo) {
      
        if (RANK[to] == pPromoteRank)
          node.addPromotion(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (toObj == NULL && to == this.ep && rayTo)
        node.addEPTake(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
      //}}}
    }

    else {
      //{{{  not a pawn
      
      var offsets = OFFSETS[frPiece];
      var limit   = LIMITS[frPiece];
      
      for (var dir=0; dir < offsets.length; dir++) {
      
        var offset = offsets[dir];
      
        for (var slide=1; slide<=limit; slide++) {
      
          var to    = fr + offset * slide;
          var toObj = b[to];
          var rayTo = ray[to];
      
          if (toObj == NULL) {
            if ((frObj == myKing && DIST[to][theirKingSq] > 1) || ((rayTo > 0 && (rayTo != rayFrom) && !CORNERS[to])))
              node.addSlide(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
            continue;
          }
      
          if (toObj == EDGE)
            break;
      
          if ((toObj & COLOR_MASK) != turn) {
            if (rayTo)
              node.addCapture(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          }
      
          break;
        }
      }
      
      //}}}
    }

    next++;
    count++
  }
}

//}}}
//{{{  .genQMoves

lozBoard.prototype.genQMoves = function(node, turn) {

  node.numMoves    = 0;
  node.sortedIndex = 0;

  var b = this.b;

  //{{{  colour based stuff
  
  if (turn == WHITE) {
  
    var pOffsetOrth  = WP_OFFSET_ORTH;
    var pOffsetDiag1 = WP_OFFSET_DIAG1;
    var pOffsetDiag2 = WP_OFFSET_DIAG2;
    var pPromoteRank = 7;
    var pList        = this.wList;
    var theirKingSq  = this.bList[0];
    var pCount       = this.wCount;
    var CAPTURE      = IS_B;
  }
  
  else {
  
    var pOffsetOrth  = BP_OFFSET_ORTH;
    var pOffsetDiag1 = BP_OFFSET_DIAG1;
    var pOffsetDiag2 = BP_OFFSET_DIAG2;
    var pPromoteRank = 2;
    var pList        = this.bList;
    var theirKingSq  = this.wList[0];
    var pCount       = this.bCount;
    var CAPTURE      = IS_W;
  }
  
  //}}}

  var next    = 0;
  var count   = 0;
  var to      = 0;
  var toObj   = 0;
  var fr      = 0;
  var frObj   = 0;
  var frPiece = 0;
  var frMove  = 0;
  var frRank  = 0;

  while (count < pCount) {

    fr = pList[next];
    if (!fr) {
      next++;
      continue;
    }

    frObj   = b[fr];
    frPiece = frObj & PIECE_MASK;
    frMove  = (frObj << MOVE_FROBJ_BITS) | (fr << MOVE_FR_BITS);
    frRank  = RANK[fr];

    if (frPiece == PAWN) {
      //{{{  P
      
      frMove |= MOVE_PAWN_MASK;
      
      to     = fr + pOffsetOrth;
      toObj  = b[to];
      
      if (!toObj) {
      
        if (frRank == pPromoteRank)
          node.addQPromotion(MOVE_PROMOTE_MASK | frMove | to);
      }
      
      to    = fr + pOffsetDiag1;
      toObj = b[to];
      
      if (CAPTURE[toObj]) {
      
        if (frRank == pPromoteRank)
          node.addQPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (!toObj && to == this.ep)
        node.addQMove(MOVE_EPTAKE_MASK | frMove | to);
      
      to    = fr + pOffsetDiag2;
      toObj = b[to];
      
      if (CAPTURE[toObj]) {
      
        if (frRank == pPromoteRank)
          node.addQPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (!toObj && to == this.ep)
        node.addQMove(MOVE_EPTAKE_MASK | frMove | to);
      
      //}}}
    }

    else if (IS_N[frObj]) {
      //{{{  N
      
      var offsets = OFFSETS[frPiece];
      var dir     = 0;
      
      while (dir < 8) {
      
        to    = fr + offsets[dir++];
        toObj = b[to];
      
        if (CAPTURE[toObj])
          node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      //}}}
    }

    else if (IS_K[frObj]) {
      //{{{  K
      
      var offsets = OFFSETS[frPiece];
      var dir     = 0;
      
      while (dir < 8) {
      
        to    = fr + offsets[dir++];
        toObj = b[to];
      
        if (CAPTURE[toObj] && DIST[to][theirKingSq] > 1)
          node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      //}}}
    }

    else {
      //{{{  BRQ
      
      var offsets = OFFSETS[frPiece];
      var len     = offsets.length;
      var dir     = 0;
      
      while (dir < len) {
      
        var offset = offsets[dir++];
      
        to = fr + offset;
      
        while (!b[to])
          to += offset;
      
        toObj = b[to];
      
        if (CAPTURE[toObj])
          node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      //}}}
    }

    next++;
    count++
  }
}

//}}}
//{{{  .genQMovesTo

lozBoard.prototype.genQMovesTo = function(node, turn, sq) {

  node.numMoves    = 0;
  node.sortedIndex = 0;

  var b = this.b;

  //{{{  colour based stuff
  
  if (turn == WHITE) {
  
    var pOffsetOrth  = WP_OFFSET_ORTH;
    var pOffsetDiag1 = WP_OFFSET_DIAG1;
    var pOffsetDiag2 = WP_OFFSET_DIAG2;
    var pPromoteRank = 7;
    var pList        = this.wList;
    var theirKingSq  = this.bList[0];
    var pCount       = this.wCount;
    var CAPTURE      = IS_B;
  }
  
  else {
  
    var pOffsetOrth  = BP_OFFSET_ORTH;
    var pOffsetDiag1 = BP_OFFSET_DIAG1;
    var pOffsetDiag2 = BP_OFFSET_DIAG2;
    var pPromoteRank = 2;
    var pList        = this.bList;
    var theirKingSq  = this.wList[0];
    var pCount       = this.bCount;
    var CAPTURE      = IS_W;
  }
  
  //}}}

  var next    = 0;
  var count   = 0;
  var to      = 0;
  var toObj   = 0;
  var fr      = 0;
  var frObj   = 0;
  var frPiece = 0;
  var frMove  = 0;
  var frRank  = 0;

  while (count < pCount) {

    fr = pList[next];
    if (!fr) {
      next++;
      continue;
    }

    frObj   = b[fr];
    frPiece = frObj & PIECE_MASK;
    frMove  = (frObj << MOVE_FROBJ_BITS) | (fr << MOVE_FR_BITS);
    frRank  = RANK[fr];

    if (frPiece == PAWN) {
      //{{{  P
      
      frMove |= MOVE_PAWN_MASK;
      
      to = fr + pOffsetDiag1;
      if (to == sq) {
        toObj = b[to];
        if (CAPTURE[toObj]) {
          if (frRank == pPromoteRank)
            node.addQPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          else
            node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        }
        else if (!toObj && to == this.ep)
          node.addQMove(MOVE_EPTAKE_MASK | frMove | to);
      }
      
      to = fr + pOffsetDiag2;
      if (to == sq) {
        toObj = b[to];
        if (CAPTURE[toObj]) {
          if (frRank == pPromoteRank)
            node.addQPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          else
            node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        }
        else if (!toObj && to == this.ep)
          node.addQMove(MOVE_EPTAKE_MASK | frMove | to);
      }
      
      //}}}
    }

    else if (IS_N[frObj]) {
      //{{{  N
      
      var offsets = OFFSETS[frPiece];
      var dir     = 0;
      
      while (dir < 8) {
      
        to = fr + offsets[dir++];
        if (to == sq) {
          toObj = b[to];
          if (CAPTURE[toObj])
            node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          break;
        }
      }
      
      //}}}
    }

    else if (IS_K[frObj]) {
      //{{{  K
      
      var offsets = OFFSETS[frPiece];
      var dir     = 0;
      
      while (dir < 8) {
      
        to = fr + offsets[dir++];
        if (to == sq) {
          toObj = b[to];
          if (CAPTURE[toObj] && DIST[to][theirKingSq] > 1)
            node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          break;
        }
      }
      
      //}}}
    }

    else {
      //{{{  BRQ
      
      var offsets = OFFSETS[frPiece];
      var len     = offsets.length;
      var dir     = 0;
      
      while (dir < len) {
      
        var offset = offsets[dir++];
      
        to = fr + offset;
      
        while (!b[to])
          to += offset;
      
        if (to == sq) {
          toObj = b[to];
          if (CAPTURE[toObj])
            node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          break;
        }
      }
      
      //}}}
    }

    next++;
    count++
  }
}

//}}}
//{{{  .makeMove

lozBoard.prototype.makeMove = function (node,move) {

  var b = this.b;
  var z = this.z;

  var fr      = (move & MOVE_FR_MASK   ) >>> MOVE_FR_BITS;
  var to      = (move & MOVE_TO_MASK   ) >>> MOVE_TO_BITS;
  var toObj   = (move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS;
  var frObj   = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;
  var frPiece = frObj & PIECE_MASK;
  var frCol   = frObj & COLOR_MASK;
  var frColI  = frCol >>> 3;

  //{{{  slide piece
  
  b[fr] = NULL;
  b[to] = frObj;
  
  node.frZ = z[fr];
  node.toZ = z[to];
  
  z[fr] = NO_Z;
  z[to] = node.frZ;
  
  this.loHash ^= this.loPieces[frColI][frPiece-1][fr];
  this.hiHash ^= this.hiPieces[frColI][frPiece-1][fr];
  
  this.loHash ^= this.loPieces[frColI][frPiece-1][to];
  this.hiHash ^= this.hiPieces[frColI][frPiece-1][to];
  
  if (frPiece == PAWN) {
    this.ploHash ^= this.loPieces[frColI][PAWN-1][fr];
    this.phiHash ^= this.hiPieces[frColI][PAWN-1][fr];
    this.ploHash ^= this.loPieces[frColI][PAWN-1][to];
    this.phiHash ^= this.hiPieces[frColI][PAWN-1][to];
  }
  
  if (frCol == WHITE) {
  
    this.wList[node.frZ] = to;
  
    this.runningEvalS -= WS_PST[frPiece][fr];
    this.runningEvalS += WS_PST[frPiece][to];
    this.runningEvalE -= WE_PST[frPiece][fr];
    this.runningEvalE += WE_PST[frPiece][to];
  }
  
  else {
  
    this.bList[node.frZ] = to;
  
    this.runningEvalS += BS_PST[frPiece][fr];
    this.runningEvalS -= BS_PST[frPiece][to];
    this.runningEvalE += BE_PST[frPiece][fr];
    this.runningEvalE -= BE_PST[frPiece][to];
  }
  
  //}}}
  //{{{  clear rights?
  
  if (this.rights) {
  
    this.loHash ^= this.loRights[this.rights];
    this.hiHash ^= this.hiRights[this.rights];
  
    this.rights &= MASK_RIGHTS[fr] & MASK_RIGHTS[to];
  
    this.loHash ^= this.loRights[this.rights];
    this.hiHash ^= this.hiRights[this.rights];
  }
  
  //}}}
  //{{{  capture?
  
  if (toObj) {
  
    var toPiece = toObj & PIECE_MASK;
    var toCol   = toObj & COLOR_MASK;
    var toColI  = toCol >>> 3;
  
    this.loHash ^= this.loPieces[toColI][toPiece-1][to];
    this.hiHash ^= this.hiPieces[toColI][toPiece-1][to];
  
    if (toPiece == PAWN) {
      this.ploHash ^= this.loPieces[toColI][PAWN-1][to];
      this.phiHash ^= this.hiPieces[toColI][PAWN-1][to];
    }
  
    this.phase += VPHASE[toPiece];
  
    if (toCol == WHITE) {
  
      this.wList[node.toZ] = EMPTY;
  
      this.runningEvalS -= VALUE_VECTOR[toPiece];
      this.runningEvalS -= WS_PST[toPiece][to];
      this.runningEvalE -= VALUE_VECTOR[toPiece];
      this.runningEvalE -= WE_PST[toPiece][to];
  
      this.wCounts[toPiece]--;
      this.wCount--;
    }
  
    else {
  
      this.bList[node.toZ] = EMPTY;
  
      this.runningEvalS += VALUE_VECTOR[toPiece];
      this.runningEvalS += BS_PST[toPiece][to];
      this.runningEvalE += VALUE_VECTOR[toPiece];
      this.runningEvalE += BE_PST[toPiece][to];
  
      this.bCounts[toPiece]--;
      this.bCount--;
    }
  }
  
  //}}}
  //{{{  reset EP
  
  this.loHash ^= this.loEP[this.ep];
  this.hiHash ^= this.hiEP[this.ep];
  
  this.ep = 0;
  
  this.loHash ^= this.loEP[this.ep];
  this.hiHash ^= this.hiEP[this.ep];
  
  //}}}

  if (move & MOVE_SPECIAL_MASK) {
    //{{{  ikky stuff
    
    if (frCol == WHITE) {
    
      var ep = to + 12;
    
      if (move & MOVE_EPMAKE_MASK) {
    
        this.loHash ^= this.loEP[this.ep];
        this.hiHash ^= this.hiEP[this.ep];
    
        this.ep = ep;
    
        this.loHash ^= this.loEP[this.ep];
        this.hiHash ^= this.hiEP[this.ep];
      }
    
      else if (move & MOVE_EPTAKE_MASK) {
    
        b[ep]    = NULL;
        node.epZ = z[ep];
        z[ep]    = NO_Z;
    
        this.bList[node.epZ] = EMPTY;
    
        this.loHash ^= this.loPieces[I_BLACK][PAWN-1][ep];
        this.hiHash ^= this.hiPieces[I_BLACK][PAWN-1][ep];
    
        this.ploHash ^= this.loPieces[I_BLACK][PAWN-1][ep];
        this.phiHash ^= this.hiPieces[I_BLACK][PAWN-1][ep];
    
        this.runningEvalS += VALUE_PAWN;
        this.runningEvalS += BS_PST[PAWN][ep];  // sic.
        this.runningEvalE += VALUE_PAWN;
        this.runningEvalE += BE_PST[PAWN][ep];  // sic.
    
        this.bCounts[PAWN]--;
        this.bCount--;
      }
    
      else if (move & MOVE_PROMOTE_MASK) {
    
        var pro = ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS) + 2;  //NBRQ
        b[to]   = WHITE | pro;
    
        this.loHash ^= this.loPieces[I_WHITE][PAWN-1][to];
        this.hiHash ^= this.hiPieces[I_WHITE][PAWN-1][to];
        this.loHash ^= this.loPieces[I_WHITE][pro-1][to];
        this.hiHash ^= this.hiPieces[I_WHITE][pro-1][to];
    
        this.ploHash ^= this.loPieces[0][PAWN-1][to];
        this.phiHash ^= this.hiPieces[0][PAWN-1][to];
    
        this.runningEvalS -= VALUE_PAWN;
        this.runningEvalS -= WS_PST[PAWN][to];
        this.runningEvalE -= VALUE_PAWN;
        this.runningEvalE -= WE_PST[PAWN][to];
    
        this.wCounts[PAWN]--;
    
        this.runningEvalS += VALUE_VECTOR[pro];
        this.runningEvalS += WS_PST[pro][to];
        this.runningEvalE += VALUE_VECTOR[pro];
        this.runningEvalE += WE_PST[pro][to];
    
        this.wCounts[pro]++;
    
        this.phase -= VPHASE[pro];
      }
    
      else if (move == MOVE_E1G1) {
    
        b[H1] = NULL;
        b[F1] = W_ROOK;
        z[F1] = z[H1];
        z[H1] = NO_Z;
    
        this.wList[z[F1]] = F1;
    
        this.loHash ^= this.loPieces[I_WHITE][ROOK-1][H1];
        this.hiHash ^= this.hiPieces[I_WHITE][ROOK-1][H1];
        this.loHash ^= this.loPieces[I_WHITE][ROOK-1][F1];
        this.hiHash ^= this.hiPieces[I_WHITE][ROOK-1][F1];
    
        this.runningEvalS -= WS_PST[ROOK][H1];
        this.runningEvalS += WS_PST[ROOK][F1];
        this.runningEvalE -= WE_PST[ROOK][H1];
        this.runningEvalE += WE_PST[ROOK][F1];
      }
    
      else if (move == MOVE_E1C1) {
    
        b[A1] = NULL;
        b[D1] = W_ROOK;
        z[D1] = z[A1];
        z[A1] = NO_Z;
    
        this.wList[z[D1]] = D1;
    
        this.loHash ^= this.loPieces[I_WHITE][ROOK-1][A1];
        this.hiHash ^= this.hiPieces[I_WHITE][ROOK-1][A1];
        this.loHash ^= this.loPieces[I_WHITE][ROOK-1][D1];
        this.hiHash ^= this.hiPieces[I_WHITE][ROOK-1][D1];
    
        this.runningEvalS -= WS_PST[ROOK][A1];
        this.runningEvalS += WS_PST[ROOK][D1];
        this.runningEvalE -= WE_PST[ROOK][A1];
        this.runningEvalE += WE_PST[ROOK][D1];
      }
    }
    
    else {
    
      var ep = to - 12;
    
      if (move & MOVE_EPMAKE_MASK) {
    
        this.loHash ^= this.loEP[this.ep];
        this.hiHash ^= this.hiEP[this.ep];
    
        this.ep = ep;
    
        this.loHash ^= this.loEP[this.ep];
        this.hiHash ^= this.hiEP[this.ep];
      }
    
      else if (move & MOVE_EPTAKE_MASK) {
    
        b[ep]    = NULL;
        node.epZ = z[ep];
        z[ep]    = NO_Z;
    
        this.wList[node.epZ] = EMPTY;
    
        this.loHash ^= this.loPieces[I_WHITE][PAWN-1][ep];
        this.hiHash ^= this.hiPieces[I_WHITE][PAWN-1][ep];
    
        this.ploHash ^= this.loPieces[I_WHITE][PAWN-1][ep];
        this.phiHash ^= this.hiPieces[I_WHITE][PAWN-1][ep];
    
        this.runningEvalS -= VALUE_PAWN;
        this.runningEvalS -= WS_PST[PAWN][ep];  // sic.
        this.runningEvalE -= VALUE_PAWN;
        this.runningEvalE -= WE_PST[PAWN][ep];  // sic.
    
        this.wCounts[PAWN]--;
        this.wCount--;
      }
    
      else if (move & MOVE_PROMOTE_MASK) {
    
        var pro = ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS) + 2;  //NBRQ
        b[to]   = BLACK | pro;
    
        this.loHash ^= this.loPieces[I_BLACK][PAWN-1][to];
        this.hiHash ^= this.hiPieces[I_BLACK][PAWN-1][to];
        this.loHash ^= this.loPieces[I_BLACK][pro-1][to];
        this.hiHash ^= this.hiPieces[I_BLACK][pro-1][to];
    
        this.ploHash ^= this.loPieces[I_BLACK][PAWN-1][to];
        this.phiHash ^= this.hiPieces[I_BLACK][PAWN-1][to];
    
        this.runningEvalS += VALUE_PAWN;
        this.runningEvalS += BS_PST[PAWN][to];
        this.runningEvalE += VALUE_PAWN;
        this.runningEvalE += BE_PST[PAWN][to];
    
        this.bCounts[PAWN]--;
    
        this.runningEvalS -= VALUE_VECTOR[pro];
        this.runningEvalS -= BS_PST[pro][to];
        this.runningEvalE -= VALUE_VECTOR[pro];
        this.runningEvalE -= BE_PST[pro][to];
    
        this.bCounts[pro]++;
    
        this.phase -= VPHASE[pro];
      }
    
      else if (move == MOVE_E8G8) {
    
        b[H8] = NULL;
        b[F8] = B_ROOK;
        z[F8] = z[H8];
        z[H8] = NO_Z;
    
        this.bList[z[F8]] = F8;
    
        this.loHash ^= this.loPieces[I_BLACK][ROOK-1][H8];
        this.hiHash ^= this.hiPieces[I_BLACK][ROOK-1][H8];
        this.loHash ^= this.loPieces[I_BLACK][ROOK-1][F8];
        this.hiHash ^= this.hiPieces[I_BLACK][ROOK-1][F8];
    
        this.runningEvalS += BS_PST[ROOK][H8];
        this.runningEvalS -= BS_PST[ROOK][F8];
        this.runningEvalE += BE_PST[ROOK][H8];
        this.runningEvalE -= BE_PST[ROOK][F8];
      }
    
      else if (move == MOVE_E8C8) {
    
        b[A8] = NULL;
        b[D8] = B_ROOK;
        z[D8] = z[A8];
        z[A8] = NO_Z;
    
        this.bList[z[D8]] = D8;
    
        this.loHash ^= this.loPieces[I_BLACK][ROOK-1][A8];
        this.hiHash ^= this.hiPieces[I_BLACK][ROOK-1][A8];
        this.loHash ^= this.loPieces[I_BLACK][ROOK-1][D8];
        this.hiHash ^= this.hiPieces[I_BLACK][ROOK-1][D8];
    
        this.runningEvalS += BS_PST[ROOK][A8];
        this.runningEvalS -= BS_PST[ROOK][D8];
        this.runningEvalE += BE_PST[ROOK][A8];
        this.runningEvalE -= BE_PST[ROOK][D8];
      }
    }
    
    //}}}
  }

  //{{{  flip turn in hash
  
  this.loHash ^= this.loTurn;
  this.hiHash ^= this.hiTurn;
  
  //}}}
  //{{{  push rep hash
  //
  //  Repetitions are cancelled by pawn moves, castling, captures, EP
  //  and promotions; i.e. moves that are not reversible.  The nearest
  //  repetition is 5 indexes back from the current one and then that
  //  and every other one entry is a possible rep.  Can also check for
  //  50 move rule by testing hi-lo > 100 - it's not perfect because of
  //  the pawn move reset but it's a type 2 error, so safe.
  //
  
  this.repLoHash[this.repHi] = this.loHash;
  this.repHiHash[this.repHi] = this.hiHash;
  
  this.repHi++;
  
  if ((move & (MOVE_SPECIAL_MASK | MOVE_TOOBJ_MASK)) || frPiece == PAWN)
    this.repLo = this.repHi;
  
  //}}}
}

//}}}
//{{{  .unmakeMove

lozBoard.prototype.unmakeMove = function (node,move) {

  var b = this.b;
  var z = this.z;

  var fr    = (move & MOVE_FR_MASK   ) >>> MOVE_FR_BITS;
  var to    = (move & MOVE_TO_MASK   ) >>> MOVE_TO_BITS;
  var toObj = (move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS;
  var frObj = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;
  var frCol = frObj & COLOR_MASK;

  b[fr] = frObj;
  b[to] = toObj;

  z[fr] = node.frZ;
  z[to] = node.toZ;

  if (frCol == WHITE)
    this.wList[node.frZ] = fr;
  else
    this.bList[node.frZ] = fr;

  //{{{  capture?
  
  if (toObj) {
  
    var toPiece = toObj & PIECE_MASK;
    var toCol   = toObj & COLOR_MASK;
  
    this.phase -= VPHASE[toPiece];
  
    if (toCol == WHITE) {
  
      this.wList[node.toZ] = to;
  
      this.wCounts[toPiece]++;
      this.wCount++;
    }
  
    else {
  
      this.bList[node.toZ] = to;
  
      this.bCounts[toPiece]++;
      this.bCount++;
    }
  }
  
  //}}}

  if (move & MOVE_SPECIAL_MASK) {
    //{{{  ikky stuff
    
    if ((frObj & COLOR_MASK) == WHITE) {
    
      var ep = to + 12;
    
      if (move & MOVE_EPTAKE_MASK) {
    
        b[ep] = B_PAWN;
        z[ep] = node.epZ;
    
        this.bList[node.epZ] = ep;
    
        this.bCounts[PAWN]++;
        this.bCount++;
      }
    
      else if (move & MOVE_PROMOTE_MASK) {
    
        var pro = ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS) + 2;  //NBRQ
    
        this.wCounts[PAWN]++;
        this.wCounts[pro]--;
    
        this.phase += VPHASE[pro];
      }
    
      else if (move == MOVE_E1G1) {
    
        b[H1] = W_ROOK;
        b[F1] = NULL;
        z[H1] = z[F1];
        z[F1] = NO_Z;
    
        this.wList[z[H1]] = H1;
      }
    
      else if (move == MOVE_E1C1) {
    
        b[A1] = W_ROOK;
        b[D1] = NULL;
        z[A1] = z[D1];
        z[D1] = NO_Z;
    
        this.wList[z[A1]] = A1;
      }
    }
    
    else {
    
      var ep = to - 12;
    
      if (move & MOVE_EPTAKE_MASK) {
    
        b[ep] = W_PAWN;
        z[ep] = node.epZ;
    
        this.wList[node.epZ] = ep;
    
        this.wCounts[PAWN]++;
        this.wCount++;
      }
    
      else if (move & MOVE_PROMOTE_MASK) {
    
        var pro = ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS) + 2;  //NBRQ
    
        this.bCounts[PAWN]++;
        this.bCounts[pro]--;
    
        this.phase += VPHASE[pro];
      }
    
      else if (move == MOVE_E8G8) {
    
        b[H8] = B_ROOK;
        b[F8] = NULL;
        z[H8] = z[F8];
        z[F8] = NO_Z;
    
        this.bList[z[H8]] = H8;
      }
    
      else if (move == MOVE_E8C8) {
    
        b[A8] = B_ROOK;
        b[D8] = NULL;
        z[A8] = z[D8];
        z[D8] = NO_Z;
    
        this.bList[z[A8]] = A8;
      }
    }
    
    //}}}
  }
}

//}}}
//{{{  .makePseudoMove

lozBoard.prototype.makePseudoMove = function (move) {

  var b = this.b;

  var fr      = (move & MOVE_FR_MASK   ) >>> MOVE_FR_BITS;
  var to      = (move & MOVE_TO_MASK   ) >>> MOVE_TO_BITS;
  var frObj   = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;

  b[fr] = NULL;
  b[to] = frObj;
}

//}}}
//{{{  .unmakePseudoMove

lozBoard.prototype.unmakePseudoMove = function (move) {

  var b = this.b;

  var fr    = (move & MOVE_FR_MASK   ) >>> MOVE_FR_BITS;
  var to    = (move & MOVE_TO_MASK   ) >>> MOVE_TO_BITS;
  var frObj = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;

  b[fr] = frObj;
  b[to] = NULL;
}

//}}}
//{{{  .isKingAttacked

lozBoard.prototype.isKingAttacked = function(byCol) {

  return this.isAttacked((byCol == WHITE) ? this.bList[0] : this.wList[0], byCol);
}

//}}}
//{{{  .isAttacked

lozBoard.prototype.isAttacked = function(to, byCol) {

  var b  = this.b;
  var fr = 0;

  //{{{  colour stuff
  
  if (byCol == WHITE) {
  
    if (b[to+13] == W_PAWN || b[to+11] == W_PAWN)
      return 1;
  
    var RQ = IS_WRQ;
    var BQ = IS_WBQ;
  }
  
  else {
  
    if (b[to-13] == B_PAWN || b[to-11] == B_PAWN)
      return 1;
  
    var RQ = IS_BRQ;
    var BQ = IS_BBQ;
  }
  
  var knight = KNIGHT | byCol;
  var king   = KING   | byCol;
  
  //}}}

  //{{{  knights
  
  if (b[to + -10] == knight) return 1;
  if (b[to + -23] == knight) return 1;
  if (b[to + -14] == knight) return 1;
  if (b[to + -25] == knight) return 1;
  if (b[to +  10] == knight) return 1;
  if (b[to +  23] == knight) return 1;
  if (b[to +  14] == knight) return 1;
  if (b[to +  25] == knight) return 1;
  
  //}}}
  //{{{  queen, bishop, rook
  
  fr = to + 1;  while (!b[fr]) fr += 1;  if (RQ[b[fr]]) return 1;
  fr = to - 1;  while (!b[fr]) fr -= 1;  if (RQ[b[fr]]) return 1;
  fr = to + 12; while (!b[fr]) fr += 12; if (RQ[b[fr]]) return 1;
  fr = to - 12; while (!b[fr]) fr -= 12; if (RQ[b[fr]]) return 1;
  fr = to + 11; while (!b[fr]) fr += 11; if (BQ[b[fr]]) return 1;
  fr = to - 11; while (!b[fr]) fr -= 11; if (BQ[b[fr]]) return 1;
  fr = to + 13; while (!b[fr]) fr += 13; if (BQ[b[fr]]) return 1;
  fr = to - 13; while (!b[fr]) fr -= 13; if (BQ[b[fr]]) return 1;
  
  //}}}
  //{{{  kings
  
  if (b[to + -11] == king) return 1;
  if (b[to + -13] == king) return 1;
  if (b[to + -12] == king) return 1;
  if (b[to + -1 ] == king) return 1;
  if (b[to +  11] == king) return 1;
  if (b[to +  13] == king) return 1;
  if (b[to +  12] == king) return 1;
  if (b[to +  1 ] == king) return 1;
  
  //}}}

  return 0;
}


//}}}
//{{{  .formatMove

lozBoard.prototype.formatMove = function (move, fmt) {

  if (move == 0)
    return 'NULL';

  var fr    = (move & MOVE_FR_MASK   ) >>> MOVE_FR_BITS;
  var to    = (move & MOVE_TO_MASK   ) >>> MOVE_TO_BITS;
  var toObj = (move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS;
  var frObj = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;

  var frCoord = COORDS[fr];
  var toCoord = COORDS[to];

  var frPiece = frObj & PIECE_MASK;
  var frCol   = frObj & COLOR_MASK;
  var frName  = NAMES[frPiece];

  var toPiece = toObj & PIECE_MASK;
  var toCol   = toObj & COLOR_MASK;
  var toName  = NAMES[toPiece];

  if (move & MOVE_PROMOTE_MASK)
    var pro = PROMOTES[(move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS];
  else
    var pro = '';

  if (fmt == UCI_FMT)
    return frCoord + toCoord + pro;

  if (pro)
    pro = '=' + pro.toUpperCase();

  if (toObj != NULL) {
    if (frPiece == PAWN)
      return frCoord + 'x' + toCoord + pro;
    else
      return frName + 'x' + toCoord;
  }

  if (frPiece == PAWN)
    return toCoord + pro;

  if (move == MOVE_E1G1 || move == MOVE_E8G8)
    return 'O-O';

  if (move == MOVE_E1C1 || move == MOVE_E8C8)
    return 'O-O-O';

  return frName + toCoord;

}

//}}}
//{{{  .isEmptyAndSafeForW

lozBoard.prototype.isEmptyAndSafeForW = function(sq) {

  return (this.b[sq] == EMPTY && this.b[sq - 11] != B_PAWN && this.b[sq - 13] != B_PAWN) | 0;
}


//}}}
//{{{  .isSafeForW

lozBoard.prototype.isSafeForW = function(sq) {

  return (this.b[sq - 11] != B_PAWN && this.b[sq - 13] != B_PAWN) | 0;
}

//}}}
//{{{  .isEmptyAndSafeForB

lozBoard.prototype.isEmptyAndSafeForB = function(sq) {

  return (this.b[sq] == EMPTY && this.b[sq + 11] != W_PAWN && this.b[sq + 13] != W_PAWN) | 0;
}


//}}}
//{{{  .isSafeForB

lozBoard.prototype.isSafeForB = function(sq) {

  return (this.b[sq + 11] != W_PAWN && this.b[sq + 13] != W_PAWN) | 0;
}

//}}}
//{{{  .evaluate

var PAWN_PASSED = [0,0,0,0,0.1,0.3,0.7,1.2,0];
var ATT_W       = [0,0.01,0.42,0.78,1.11,1.52,1,1,1,1,1,1,1,1,1,1,1];

var TIGHT_WN = IS_WNBRQ;
var TIGHT_WB = IS_WNBRQ;
var TIGHT_WR = IS_WRQ;
var TIGHT_WQ = IS_WQ;

var TIGHT_BN = IS_BNBRQ;
var TIGHT_BB = IS_BNBRQ;
var TIGHT_BR = IS_BRQ;
var TIGHT_BQ = IS_BQ;

var TENSE_WN = IS_BNBRQ;
var TENSE_WB = IS_BNBRQ;
var TENSE_WR = IS_BRQ;
var TENSE_WQ = IS_BQ;

var TENSE_BN = IS_WNBRQ;
var TENSE_BB = IS_WNBRQ;
var TENSE_BR = IS_WRQ;
var TENSE_BQ = IS_WQ;

lozBoard.prototype.evaluate = function (turn) {

  //{{{  init feature coefficients
  //
  // Removed on release.
  //
  
  var f = this.features;       // ##ifdef
                               // ##ifdef
  f.wOutpost.fill(0);          // ##ifdef
  f.wShelter.fill(0);          // ##ifdef
  f.wStorm.fill(0);            // ##ifdef
  f.mobN.fill(0);              // ##ifdef
  f.mobB.fill(0);              // ##ifdef
  f.mobR.fill(0);              // ##ifdef
  f.mobQ.fill(0);              // ##ifdef
  f.kingPenalty        = 0;    // ##ifdef
  f.pawnDoubledS       = 0;    // ##ifdef
  f.pawnDoubledE       = 0;    // ##ifdef
  f.pawnBackwardS      = 0;    // ##ifdef
  f.pawnBackwardE      = 0;    // ##ifdef
  f.pawnIsolatedS      = 0;    // ##ifdef
  f.pawnIsolatedE      = 0;    // ##ifdef
  f.pawnPassedOffsetS  = 0;    // ##ifdef
  f.pawnPassedOffsetE  = 0;    // ##ifdef
  f.pawnPassedMultS    = 0;    // ##ifdef
  f.pawnPassedMultE    = 0;    // ##ifdef
  f.pawnPassedOffset2S = 0;    // ##ifdef
  f.pawnPassedOffset2E = 0;    // ##ifdef
  f.pawnPassedMult2S   = 0;    // ##ifdef
  f.pawnPassedMult2E   = 0;    // ##ifdef
  f.pawnPassedKing1E   = 0;    // ##ifdef
  f.pawnPassedKing2E   = 0;    // ##ifdef
  f.pawnPassedFreeE    = 0;    // ##ifdef
  f.pawnPassedUnstopE  = 0;    // ##ifdef
  f.tightNS            = 0;    // ##ifdef
  f.tightNE            = 0;    // ##ifdef
  f.tightBS            = 0;    // ##ifdef
  f.tightBE            = 0;    // ##ifdef
  f.tightRS            = 0;    // ##ifdef
  f.tightRE            = 0;    // ##ifdef
  f.tightQS            = 0;    // ##ifdef
  f.tightQE            = 0;    // ##ifdef
  f.tenseNS            = 0;    // ##ifdef
  f.tenseNE            = 0;    // ##ifdef
  f.tenseBS            = 0;    // ##ifdef
  f.tenseBE            = 0;    // ##ifdef
  f.tenseRS            = 0;    // ##ifdef
  f.tenseRE            = 0;    // ##ifdef
  f.tenseQS            = 0;    // ##ifdef
  f.tenseQE            = 0;    // ##ifdef
  f.bishopPairS        = 0;    // ##ifdef
  f.bishopPairE        = 0;    // ##ifdef
  f.rook7thS           = 0;    // ##ifdef
  f.rook7thE           = 0;    // ##ifdef
  f.rookOpenS          = 0;    // ##ifdef
  f.rookOpenE          = 0;    // ##ifdef
  f.queen7thS          = 0;    // ##ifdef
  f.queen7thE          = 0;    // ##ifdef
  f.tempoS             = 0;    // ##ifdef
  f.tempoE             = 0;    // ##ifdef
  f.attWN              = 0;    // ##ifdef
  f.attWB              = 0;    // ##ifdef
  f.attWR              = 0;    // ##ifdef
  f.attWQ              = 0;    // ##ifdef
  f.attBN              = 0;    // ##ifdef
  f.attBB              = 0;    // ##ifdef
  f.attBR              = 0;    // ##ifdef
  f.attBQ              = 0;    // ##ifdef
  f.attN               = 0;    // ##ifdef
  f.attB               = 0;    // ##ifdef
  f.attR               = 0;    // ##ifdef
  f.attQ               = 0;    // ##ifdef
  f.trappedS           = 0;    // ##ifdef
  f.trappedE           = 0;    // ##ifdef
  
  //}}}
  //{{{  init EV feature weights
  //
  // Removed on release.
  //
  
  TIGHT_NS             = EV[iTIGHT_NS];               // ##ifdef
  TIGHT_NE             = EV[iTIGHT_NE];               // ##ifdef
  TIGHT_BS             = EV[iTIGHT_BS];               // ##ifdef
  TIGHT_BE             = EV[iTIGHT_BE];               // ##ifdef
  TIGHT_RS             = EV[iTIGHT_RS];               // ##ifdef
  TIGHT_RE             = EV[iTIGHT_RE];               // ##ifdef
  TIGHT_QS             = EV[iTIGHT_QS];               // ##ifdef
  TIGHT_QE             = EV[iTIGHT_QE];               // ##ifdef
  TENSE_NS             = EV[iTENSE_NS];               // ##ifdef
  TENSE_NE             = EV[iTENSE_NE];               // ##ifdef
  TENSE_BS             = EV[iTENSE_BS];               // ##ifdef
  TENSE_BE             = EV[iTENSE_BE];               // ##ifdef
  TENSE_RS             = EV[iTENSE_RS];               // ##ifdef
  TENSE_RE             = EV[iTENSE_RE];               // ##ifdef
  TENSE_QS             = EV[iTENSE_QS];               // ##ifdef
  TENSE_QE             = EV[iTENSE_QE];               // ##ifdef
  ATT_N                = EV[iATT_N];                  // ##ifdef
  ATT_B                = EV[iATT_B];                  // ##ifdef
  ATT_R                = EV[iATT_R];                  // ##ifdef
  ATT_Q                = EV[iATT_Q];                  // ##ifdef
  PAWN_DOUBLED_S       = EV[iPAWN_DOUBLED_S];         // ##ifdef
  PAWN_DOUBLED_E       = EV[iPAWN_DOUBLED_E];         // ##ifdef
  PAWN_ISOLATED_S      = EV[iPAWN_ISOLATED_S]         // ##ifdef
  PAWN_ISOLATED_E      = EV[iPAWN_ISOLATED_E];        // ##ifdef
  PAWN_BACKWARD_S      = EV[iPAWN_BACKWARD_S];        // ##ifdef
  PAWN_BACKWARD_E      = EV[iPAWN_BACKWARD_E];        // ##ifdef
  PAWN_PASSED_OFFSET_S = EV[iPAWN_PASSED_OFFSET_S];   // ##ifdef
  PAWN_PASSED_OFFSET_E = EV[iPAWN_PASSED_OFFSET_E];   // ##ifdef
  PAWN_PASSED_MULT_S   = EV[iPAWN_PASSED_MULT_S];     // ##ifdef
  PAWN_PASSED_MULT_E   = EV[iPAWN_PASSED_MULT_E];     // ##ifdef
  TWOBISHOPS_S         = EV[iTWOBISHOPS_S];           // ##ifdef
  ROOK7TH_S            = EV[iROOK7TH_S];              // ##ifdef
  ROOK7TH_E            = EV[iROOK7TH_E];              // ##ifdef
  ROOKOPEN_S           = EV[iROOKOPEN_S];             // ##ifdef
  ROOKOPEN_E           = EV[iROOKOPEN_E];             // ##ifdef
  QUEEN7TH_S           = EV[iQUEEN7TH_S];             // ##ifdef
  QUEEN7TH_E           = EV[iQUEEN7TH_E];             // ##ifdef
  TRAPPED_S            = EV[iTRAPPED_S];              // ##ifdef
  TRAPPED_E            = EV[iTRAPPED_E];              // ##ifdef
  KING_PENALTY         = EV[iKING_PENALTY];           // ##ifdef
  PAWN_OFFSET_S        = EV[iPAWN_OFFSET_S];          // ##ifdef
  PAWN_OFFSET_E        = EV[iPAWN_OFFSET_E];          // ##ifdef
  PAWN_MULT_S          = EV[iPAWN_MULT_S];            // ##ifdef
  PAWN_MULT_E          = EV[iPAWN_MULT_E];            // ##ifdef
  PAWN_PASS_FREE       = EV[iPAWN_PASS_FREE];         // ##ifdef
  PAWN_PASS_UNSTOP     = EV[iPAWN_PASS_UNSTOP];       // ##ifdef
  PAWN_PASS_KING1      = EV[iPAWN_PASS_KING1];        // ##ifdef
  PAWN_PASS_KING2      = EV[iPAWN_PASS_KING2];        // ##ifdef
  TWOBISHOPS_E         = EV[iTWOBISHOPS_E];           // ##ifdef
  TEMPO_S              = EV[iTEMPO_S];                // ##ifdef
  TEMPO_E              = EV[iTEMPO_E];                // ##ifdef
  
  //}}}

  //this.hashCheck(turn);

  //{{{  init
  
  var uci = this.lozza.uci;
  var b   = this.b;
  
  var phase = this.cleanPhase(this.phase);
  
  var numPieces = this.wCount + this.bCount;
  
  var wNumQueens  = this.wCounts[QUEEN];
  var wNumRooks   = this.wCounts[ROOK];
  var wNumBishops = this.wCounts[BISHOP];
  var wNumKnights = this.wCounts[KNIGHT];
  var wNumPawns   = this.wCounts[PAWN];
  
  var bNumQueens  = this.bCounts[QUEEN];
  var bNumRooks   = this.bCounts[ROOK];
  var bNumBishops = this.bCounts[BISHOP];
  var bNumKnights = this.bCounts[KNIGHT];
  var bNumPawns   = this.bCounts[PAWN];
  
  var wKingSq   = this.wList[0];
  var wKingRank = RANK[wKingSq];
  var wKingFile = FILE[wKingSq];
  
  var bKingSq   = this.bList[0];
  var bKingRank = RANK[bKingSq];
  var bKingFile = FILE[bKingSq];
  
  var wKingBits = (wKingFile-1) << 2;
  var wKingMask = 0xF << wKingBits;
  
  var bKingBits = (bKingFile-1) << 2;
  var bKingMask = 0xF << bKingBits;
  
  var bonus   = 0;  // generic.
  var penalty = 0;  // generic.
  
  var WKZ = WKZONES[wKingSq];
  var BKZ = BKZONES[bKingSq];
  
  var wCanBeAttacked = bNumQueens && (bNumRooks || bNumBishops || bNumKnights);
  var bCanBeAttacked = wNumQueens && (wNumRooks || wNumBishops || wNumKnights);
  
  //}}}
  //{{{  draw?
  
  //todo - lots more here and drawish.
  
  if (numPieces == 2)                                                                  // K v K.
    return CONTEMPT;
  
  if (numPieces == 3 && (wNumKnights || wNumBishops || bNumKnights || bNumBishops))    // K v K+N|B.
    return CONTEMPT;
  
  if (numPieces == 4 && (wNumKnights || wNumBishops) && (bNumKnights || bNumBishops))  // K+N|B v K+N|B.
    return CONTEMPT;
  
  if (numPieces == 4 && (wNumKnights == 2 || bNumKnights == 2))                        // K v K+NN.
    return CONTEMPT;
  
  if (numPieces == 5 && wNumKnights == 2 && (bNumKnights || bNumBishops))              //
    return CONTEMPT;                                                                   //
                                                                                       // K+N|B v K+NN
  if (numPieces == 5 && bNumKnights == 2 && (wNumKnights || wNumBishops))              //
    return CONTEMPT;                                                                   //
  
  if (numPieces == 5 && wNumBishops == 2 && bNumBishops)                               //
    return CONTEMPT;                                                                   //
                                                                                       // K+B v K+BB
  if (numPieces == 5 && bNumBishops == 2 && wNumBishops)                               //
    return CONTEMPT;                                                                   //
  
  if (numPieces == 4 && wNumRooks && bNumRooks)                                        // K+R v K+R.
    return CONTEMPT;
  
  if (numPieces == 4 && wNumQueens && bNumQueens)                                      // K+Q v K+Q.
    return CONTEMPT;
  
  //}}}

  //{{{  P
  
  //{{{  vars valid if hash used or not
  
  var pawnsS = 0;            // pawn eval.
  var pawnsE = 0;
  
  var wPassed = 0;
  var bPassed = 0;
  
  var wHome   = 0;           // non zero if >= 1 W pawn on home rank.
  var bHome   = 0;           // non zero if >= 1 B pawn on home rank.
  
  var wLeast  = 0x99999999;  // rank of least advanced pawns per file.
  var bLeast  = 0x00000000;  // rank of least advanced pawns per file.
  
  var wMost   = 0x00000000;  // rank of most advanced pawns per file.
  var bMost   = 0x99999999;  // rank of most advanced pawns per file.
  
  var wLeastL = 0;           // wLeast << 4.
  var bLeastL = 0;
  
  var wMostL  = 0;
  var bMostL  = 0;
  
  var wLeastR = 0;           // wLeast >>> 4.
  var bLeastR = 0;
  
  var wMostR  = 0;
  var bMostR  = 0;
  
  //}}}
  
  var idx   = this.ploHash & PTTMASK;
  var flags = this.pttFlags[idx];
  
  if (USEPAWNHASH && (flags & PTT_EXACT) && this.pttLo[idx] == this.ploHash && this.pttHi[idx] == this.phiHash) {
    //{{{  get tt
    
    pawnsS = this.pttScoreS[idx];
    pawnsE = this.pttScoreE[idx];
    
    wLeast = this.pttwLeast[idx];
    bLeast = this.pttbLeast[idx];
    
    wMost  = this.pttwMost[idx];
    bMost  = this.pttbMost[idx];
    
    wHome  = flags & PTT_WHOME;
    bHome  = flags & PTT_BHOME;
    
    wPassed  = flags & PTT_WPASS;
    bPassed  = flags & PTT_BPASS;
    
    wLeastR = (wLeast >>> 4) | 0x90000000;
    wLeastL = (wLeast <<  4) | 0x00000009;
    
    wMostR = (wMost >>> 4);
    wMostL = (wMost <<  4);
    
    bLeastR = bLeast >>> 4;
    bLeastL = bLeast <<  4;
    
    bMostR = (bMost >>> 4) | 0x90000000;
    bMostL = (bMost <<  4) | 0x00000009;
    
    //}}}
  }
  
  else {
    //{{{  phase 1
    
    //{{{  white
    
    var next  = this.firstWP;
    var count = 0;
    
    while (count < wNumPawns) {
    
      var sq = this.wList[next];
    
      if (!sq || b[sq] != W_PAWN) {
        next++;
        continue;
      }
    
      var rank   = RANK[sq];
      var file   = FILE[sq];
      var bits   = (file-1) << 2;
      var mask   = 0xF << bits;
      var lRank  = (wLeast & mask) >>> bits;
      var mRank  = (wMost  & mask) >>> bits;
    
      if (lRank != 9) {
        pawnsS -= PAWN_DOUBLED_S;
        pawnsE -= PAWN_DOUBLED_E;
        f.pawnDoubledS -= 1;  // ##ifdef
        f.pawnDoubledE -= 1;  // ##ifdef
      }
    
      if (rank < lRank)
        wLeast = (wLeast & ~mask) | (rank << bits);
    
      if (rank > mRank)
        wMost  = (wMost  & ~mask) | (rank << bits);
    
      if (rank == 2)
        wHome = PTT_WHOME;
    
      count++;
      next++
    }
    
    wLeastR = (wLeast >>> 4) | 0x90000000;
    wLeastL = (wLeast <<  4) | 0x00000009;
    
    wMostR  = (wMost >>> 4);
    wMostL  = (wMost <<  4);
    
    //}}}
    //{{{  black
    
    var next  = this.firstBP;
    var count = 0;
    
    while (count < bNumPawns) {
    
      var sq = this.bList[next];
    
      if (!sq || b[sq] != B_PAWN) {
        next++;
        continue;
      }
    
      var rank   = RANK[sq];
      var file   = FILE[sq];
      var bits   = (file-1) << 2;
      var mask   = 0xF << bits;
      var lRank  = (bLeast & mask) >>> bits;
      var mRank  = (bMost  & mask) >>> bits;
    
      if (lRank != 0) {
        pawnsS += PAWN_DOUBLED_S;
        pawnsE += PAWN_DOUBLED_E;
        f.pawnDoubledS += 1;  // ##ifdef
        f.pawnDoubledE += 1;  // ##ifdef
      }
    
      if (rank > lRank)
        bLeast = (bLeast & ~mask) | (rank << bits);
    
      if (rank < mRank)
        bMost  = (bMost & ~mask)  | (rank << bits);
    
      if (rank == 7)
        bHome = PTT_BHOME;
    
      count++;
      next++
    }
    
    bLeastR = bLeast >>> 4;
    bLeastL = bLeast <<  4;
    
    bMostR  = (bMost >>> 4) | 0x90000000;
    bMostL  = (bMost <<  4) | 0x00000009;
    
    //}}}
    
    var xxS = f.pawnDoubledS * PAWN_DOUBLED_S;                                    // ##ifdef
    var xxE = f.pawnDoubledE * PAWN_DOUBLED_E;                                    // ##ifdef
                                                                                  // ##ifdef
    if (Math.abs(pawnsS - xxS) > 0.0001)                                          // ##ifdef
      console.log('feature pawns phase 1 s', pawnsS, xxS, this.fen(this.turn));   // ##ifdef
                                                                                  // ##ifdef
    if (Math.abs(pawnsE - xxE) > 0.0001)                                          // ##ifdef
      console.log('feature pawns phase 1 e', pawnsE, xxE, this.fen(this.turn));   // ##ifdef
    
    //}}}
    //{{{  phase 2
    
    //{{{  white
    
    var next  = this.firstWP;
    var count = 0;
    
    while (count < wNumPawns) {
    
      var sq = this.wList[next];
    
      if (!sq || b[sq] != W_PAWN) {
        next++;
        continue;
      }
    
      var file  = FILE[sq];
      var bits  = (file-1) << 2;
      var rank  = RANK[sq];
      var open  = 0;
    
      if ((wMost >>> bits & 0xF) == rank && (bLeast >>> bits & 0xF) < rank) {
        open = 1;
      }
    
      if ((wLeastL >>> bits & 0xF) == 9 && (wLeastR >>> bits & 0xF) == 9) {
        pawnsS -= PAWN_ISOLATED_S + PAWN_ISOLATED_S * open;
        pawnsE -= PAWN_ISOLATED_E;
        f.pawnIsolatedS -= 1 + 1 * open;  // ##ifdef
        f.pawnIsolatedE -= 1;             // ##ifdef
      }
    
      else if ((wLeastL >>> bits & 0xF) > rank && (wLeastR >>> bits & 0xF) > rank) {
        var backward = true;
        if ((IS_WP[b[sq-11]] || IS_WP[b[sq-13]]) && !IS_P[b[sq-12]] && !IS_BP[b[sq-11]] && !IS_BP[b[sq-13]] && !IS_BP[b[sq-23]] && !IS_BP[b[sq-25]])
          backward = false;
        else if (rank == 2 && (IS_WP[b[sq-23]] || IS_WP[b[sq-25]]) && !IS_P[b[sq-12]] && !IS_P[b[sq-24]] && !IS_BP[b[sq-11]] && !IS_BP[b[sq-13]] && !IS_BP[b[sq-23]] && !IS_BP[b[sq-25]] && !IS_BP[b[sq-37]] && !IS_BP[b[sq-35]])
          backward = false;
        if (backward) {
          pawnsS -= PAWN_BACKWARD_S + PAWN_BACKWARD_S * open;
          pawnsE -= PAWN_BACKWARD_E;
          f.pawnBackwardS -= 1 + 1 * open;  // ##ifdef
          f.pawnBackwardE -= 1;             // ##ifdef
        }
      }
    
      if (open) {
        if ((bLeastL >>> bits & 0xF) <= rank && (bLeastR >>> bits & 0xF) <= rank) {
          wPassed = PTT_WPASS;
        }
        else {
          var defenders = 0;
          var sq2       = sq;
          while (b[sq2] != EDGE) {
            defenders += IS_WP[b[sq2+1]];
            defenders += IS_WP[b[sq2-1]];
            sq2 += 12;
          }
          var attackers = 0;
          var sq2       = sq-12;
          while (b[sq2] != EDGE) {
            attackers += IS_BP[b[sq2+1]];
            attackers += IS_BP[b[sq2-1]];
            sq2 -= 12;
          }
          if (defenders >= attackers) {
            defenders = IS_WP[b[sq+11]] + IS_WP[b[sq+13]];
            attackers = IS_BP[b[sq-11]] + IS_BP[b[sq-13]];
            if (defenders >= attackers) {
              pawnsS += PAWN_PASSED_OFFSET_S + PAWN_PASSED_MULT_S * PAWN_PASSED[rank];
              pawnsE += PAWN_PASSED_OFFSET_E + PAWN_PASSED_MULT_E * PAWN_PASSED[rank];
              f.pawnPassedOffsetS += 1;                      // ##ifdef
              f.pawnPassedOffsetE += 1;                      // ##ifdef
              f.pawnPassedMultS   += 1 * PAWN_PASSED[rank];  // ##ifdef
              f.pawnPassedMultE   += 1 * PAWN_PASSED[rank];  // ##ifdef
            }
          }
        }
      }
    
      count++;
      next++
    }
    
    //}}}
    //{{{  black
    
    var next  = this.firstBP;
    var count = 0;
    
    while (count < bNumPawns) {
    
      var sq = this.bList[next];
    
      if (!sq || b[sq] != B_PAWN) {
        next++;
        continue;
      }
    
      var file  = FILE[sq];
      var bits  = (file-1) << 2;
      var rank  = RANK[sq];
      var open  = 0;
    
      if ((bMost >>> bits & 0xF) == rank && (wLeast >>> bits & 0xF) > rank) {
        open = 1;
      }
    
      if ((bLeastL >>> bits & 0xF) == 0x0 && (bLeastR >>> bits & 0xF) == 0x0) {
        pawnsS += PAWN_ISOLATED_S + PAWN_ISOLATED_S * open;
        pawnsE += PAWN_ISOLATED_E;
        f.pawnIsolatedS += 1 + 1 * open;  // ##ifdef
        f.pawnIsolatedE += 1;             // ##ifdef
      }
    
      else if ((bLeastL >>> bits & 0xF) < rank && (bLeastR >>> bits & 0xF) < rank) {
        var backward = true;
        if ((IS_BP[b[sq+11]] || IS_BP[b[sq+13]]) && !IS_P[b[sq+12]] && !IS_WP[b[sq+11]] && !IS_WP[b[sq+13]] && !IS_WP[b[sq+23]] && !IS_WP[b[sq+25]])
          backward = false;
        else if (rank == 7 && (IS_BP[b[sq+23]] || IS_BP[b[sq+25]]) && !IS_P[b[sq+12]] && !IS_P[b[sq+24]] && !IS_WP[b[sq+11]] && !IS_WP[b[sq+13]] && !IS_WP[b[sq+23]] && !IS_WP[b[sq+25]] && !IS_WP[b[sq+37]] && !IS_WP[b[sq+35]])
          backward = false;
        if (backward) {
          pawnsS += PAWN_BACKWARD_S + PAWN_BACKWARD_S * open;
          pawnsE += PAWN_BACKWARD_E;
          f.pawnBackwardS += 1 + 1 * open;  // ##ifdef
          f.pawnBackwardE += 1;             // ##ifdef
        }
      }
    
      if (open) {
        if ((wLeastL >>> bits & 0xF) >= rank && (wLeastR >>> bits & 0xF) >= rank) {
          bPassed = PTT_BPASS;
        }
        else {
          var defenders = 0;
          var sq2       = sq;
          while (b[sq2] != EDGE) {
            defenders += IS_BP[b[sq2+1]];
            defenders += IS_BP[b[sq2-1]];
            sq2 -= 12;
          }
          var attackers = 0;
          var sq2       = sq+12;
          while (b[sq2] != EDGE) {
            attackers += IS_WP[b[sq2+1]];
            attackers += IS_WP[b[sq2-1]];
            sq2 += 12;
          }
          if (defenders >= attackers) {
            defenders = IS_BP[b[sq-11]] + IS_BP[b[sq-13]];
            attackers = IS_WP[b[sq+11]] + IS_WP[b[sq+13]];
            if (defenders >= attackers) {
              pawnsS -= PAWN_PASSED_OFFSET_S + PAWN_PASSED_MULT_S * PAWN_PASSED[9-rank];
              pawnsE -= PAWN_PASSED_OFFSET_E + PAWN_PASSED_MULT_E * PAWN_PASSED[9-rank];
              f.pawnPassedOffsetS -= 1;                        // ##ifdef
              f.pawnPassedOffsetE -= 1;                        // ##ifdef
              f.pawnPassedMultS   -= 1 * PAWN_PASSED[9-rank];  // ##ifdef
              f.pawnPassedMultE   -= 1 * PAWN_PASSED[9-rank];  // ##ifdef
            }
          }
        }
      }
    
      count++;
      next++
    }
    
    //}}}
    
    xxS += f.pawnBackwardS     * PAWN_BACKWARD_S;                                             // ##ifdef
    xxE += f.pawnBackwardE     * PAWN_BACKWARD_E;                                             // ##ifdef
    xxS += f.pawnIsolatedS     * PAWN_ISOLATED_S;                                             // ##ifdef
    xxE += f.pawnIsolatedE     * PAWN_ISOLATED_E;                                             // ##ifdef
    xxS += f.pawnPassedOffsetS * PAWN_PASSED_OFFSET_S;                                        // ##ifdef
    xxE += f.pawnPassedOffsetE * PAWN_PASSED_OFFSET_E;                                        // ##ifdef
    xxS += f.pawnPassedMultS   * PAWN_PASSED_MULT_S;                                          // ##ifdef
    xxE += f.pawnPassedMultE   * PAWN_PASSED_MULT_E;                                          // ##ifdef
                                                                                              // ##ifdef
    if (Math.abs(pawnsS - xxS) > 0.0001 || Math.abs(pawnsE - xxE) > 0.0001) {                 // ##ifdef
      console.log('feature pawns phase 2', pawnsS, pawnsE, xxS, xxE, this.fen(this.turn));    // ##ifdef
      console.log('doubled',f.pawnDoubledS,f.pawnDoubledE);                                   // ##ifdef
      console.log('backward',f.pawnBackwardS,f.pawnBackwardE);                                // ##ifdef
      console.log('isolated',f.pawnIsolatedS,f.pawnIsolatedE);                                // ##ifdef
      console.log('offset',f.pawnPassedOffsetS,f.pawnPassedOffsetE);                          // ##ifdef
      console.log('mult',f.pawnPassedMultS,f.pawnPassedMultE);                                // ##ifdef
    }                                                                                         // ##ifdef
    
    //}}}
    //{{{  put tt
    
    this.pttFlags[idx]  = PTT_EXACT | wHome | bHome | wPassed | bPassed;
    
    this.pttLo[idx]     = this.ploHash;
    this.pttHi[idx]     = this.phiHash;
    
    this.pttScoreS[idx] = pawnsS;
    this.pttScoreE[idx] = pawnsE;
    
    this.pttwLeast[idx] = wLeast;
    this.pttbLeast[idx] = bLeast;
    
    this.pttwMost[idx]  = wMost;
    this.pttbMost[idx]  = bMost;
    
    //}}}
  }
  
  //{{{  phase 3
  //
  // Only pawns are included in the hash, so evaluation taht includes other
  // pieces must be onde here.
  //
  
  //{{{  white
  
  if (wPassed) {
  
    var next  = this.firstWP;
    var count = 0;
  
    while (count < wNumPawns) {
  
      var sq = this.wList[next];
  
      if (!sq || b[sq] != W_PAWN) {
        next++;
        continue;
      }
  
      var file  = FILE[sq];
      var bits  = (file-1) << 2;
      var rank  = RANK[sq];
      var sq2   = sq-12;
  
      if ((wMost >>> bits & 0xF) == rank && (bLeast >>> bits & 0xF) < rank) {  // open.
        if ((bLeastL >>> bits & 0xF) <= rank && (bLeastR >>> bits & 0xF) <= rank) {  // passed.
  
          pawnsS += PAWN_OFFSET_S + PAWN_MULT_S * PAWN_PASSED[rank];
          pawnsE += PAWN_OFFSET_E + PAWN_MULT_E * PAWN_PASSED[rank];
          f.pawnPassedOffset2S += 1                      // ##ifdef
          f.pawnPassedOffset2E += 1                      // ##ifdef
          f.pawnPassedMult2S   += 1 * PAWN_PASSED[rank]  // ##ifdef
          f.pawnPassedMult2E   += 1 * PAWN_PASSED[rank]  // ##ifdef
          //{{{  king dist
          
          var passKings = PAWN_PASS_KING1 * DIST[bKingSq][sq2] - PAWN_PASS_KING2 * DIST[wKingSq][sq2];
          
          pawnsE += passKings * PAWN_PASSED[rank];
          
          f.pawnPassedKing1E += 1 * DIST[bKingSq][sq2] * PAWN_PASSED[rank];  // ##ifdef
          f.pawnPassedKing2E -= 1 * DIST[wKingSq][sq2] * PAWN_PASSED[rank];  // ##ifdef
          
          //}}}
          //{{{  attacked?
          
          var passFree = 0;
          
          if (!b[sq2]) {
            passFree = PAWN_PASS_FREE * (!this.isAttacked(sq2,BLACK)|0);
            pawnsE += passFree * PAWN_PASSED[rank];
            f.pawnPassedFreeE += 1 * (!this.isAttacked(sq2,BLACK)|0) * PAWN_PASSED[rank];  // ##ifdef
          }
          
          //}}}
          //{{{  unstoppable
          
          var passUnstop    = 0;
          var oppoOnlyPawns = bNumPawns + 1 == this.bCount;
          
          if (oppoOnlyPawns) {
          
            var promSq = W_PROMOTE_SQ[file];
          
            if (DIST[wKingSq][sq] <= 1 && DIST[wKingSq][promSq] <= 1) {
              passUnstop = PAWN_PASS_UNSTOP;
              pawnsE += passUnstop * PAWN_PASSED[rank];
              f.pawnPassedUnstopE += 1 * PAWN_PASSED[rank]  // ##ifdef
            }
          
            else if (DIST[sq][promSq] < DIST[bKingSq][promSq] + ((turn==WHITE)|0) - 1) {  // oppo cannot get there
          
              var blocked = 0;
              while(!b[sq2])
                sq2 -= 12;
              if (b[sq2] == EDGE) {
                passUnstop = PAWN_PASS_UNSTOP;
                pawnsE += passUnstop * PAWN_PASSED[rank];
                f.pawnPassedUnstopE += 1 * PAWN_PASSED[rank]  // ##ifdef
              }
            }
          }
          
          //}}}
        }
      }
  
      count++;
      next++
    }
  }
  
  //}}}
  //{{{  black
  
  if (bPassed) {
  
    var next  = this.firstBP;
    var count = 0;
  
    while (count < bNumPawns) {
  
      var sq = this.bList[next];
  
      if (!sq || b[sq] != B_PAWN) {
        next++;
        continue;
      }
  
      var file  = FILE[sq];
      var bits  = (file-1) << 2;
      var rank  = RANK[sq];
      var sq2   = sq+12;
  
      if ((bMost >>> bits & 0xF) == rank && (wLeast >>> bits & 0xF) > rank) {  // open.
        if ((wLeastL >>> bits & 0xF) >= rank && (wLeastR >>> bits & 0xF) >= rank) {  // passed.
  
          pawnsS -= PAWN_OFFSET_S + PAWN_MULT_S * PAWN_PASSED[9-rank];
          pawnsE -= PAWN_OFFSET_E + PAWN_MULT_E * PAWN_PASSED[9-rank];
          f.pawnPassedOffset2S -= 1                        // ##ifdef
          f.pawnPassedOffset2E -= 1                        // ##ifdef
          f.pawnPassedMult2S   -= 1 * PAWN_PASSED[9-rank]  // ##ifdef
          f.pawnPassedMult2E   -= 1 * PAWN_PASSED[9-rank]  // ##ifdef
  
          //{{{  king dist
          
          var passKings = PAWN_PASS_KING1 * DIST[wKingSq][sq2] - PAWN_PASS_KING2 * DIST[bKingSq][sq2];
          
          pawnsE -= passKings * PAWN_PASSED[9-rank];
          
          f.pawnPassedKing1E -= 1 * DIST[wKingSq][sq2] * PAWN_PASSED[9-rank];  // ##ifdef
          f.pawnPassedKing2E += 1 * DIST[bKingSq][sq2] * PAWN_PASSED[9-rank];  // ##ifdef
          
          //}}}
          //{{{  attacked?
          
          var passFree = 0;
          
          if (!b[sq2]) {
            passFree = PAWN_PASS_FREE * (!this.isAttacked(sq2,WHITE)|0);
            pawnsE -= passFree * PAWN_PASSED[9-rank];
            f.pawnPassedFreeE -= 1 * (!this.isAttacked(sq2,WHITE)|0) * PAWN_PASSED[9-rank];  // ##ifdef
          }
          
          //}}}
          //{{{  unstoppable
          
          var passUnstop    = 0;
          var oppoOnlyPawns = wNumPawns + 1 == this.wCount;
          
          if (oppoOnlyPawns) {
          
            var promSq = B_PROMOTE_SQ[file];
          
            if (DIST[bKingSq][sq] <= 1 && DIST[bKingSq][promSq] <= 1) {
              passUnstop = PAWN_PASS_UNSTOP;
              pawnsE -= passUnstop * PAWN_PASSED[9-rank];
              f.pawnPassedUnstopE -= 1 * PAWN_PASSED[9-rank]  // ##ifdef
            }
          
            else if (DIST[sq][promSq] < DIST[wKingSq][promSq] + ((turn==BLACK)|0) - 1) {  // oppo cannot get there
          
              var blocked = 0;
              while(!b[sq2])
                sq2 += 12;
              if (b[sq2] == EDGE) {
                passUnstop = PAWN_PASS_UNSTOP;
                pawnsE -= passUnstop * PAWN_PASSED[9-rank];
                f.pawnPassedUnstopE -= 1 * PAWN_PASSED[9-rank]  // ##ifdef
              }
            }
          }
          
          //}}}
        }
      }
  
      count++;
      next++
    }
  }
  
  //}}}
  
  xxS += f.pawnPassedOffset2S * PAWN_OFFSET_S;                                              // ##ifdef
  xxE += f.pawnPassedOffset2E * PAWN_OFFSET_E;                                              // ##ifdef
  xxS += f.pawnPassedMult2S   * PAWN_MULT_S;                                                // ##ifdef
  xxE += f.pawnPassedMult2E   * PAWN_MULT_E;                                                // ##ifdef
  xxE += f.pawnPassedKing1E   * PAWN_PASS_KING1;                                            // ##ifdef
  xxE += f.pawnPassedKing2E   * PAWN_PASS_KING2;                                            // ##ifdef
  xxE += f.pawnPassedFreeE    * PAWN_PASS_FREE;                                             // ##ifdef
  xxE += f.pawnPassedUnstopE  * PAWN_PASS_UNSTOP;                                           // ##ifdef
                                                                                            // ##ifdef
  if (Math.abs(pawnsS - xxS) > 0.0001 || Math.abs(pawnsE - xxE) > 0.0001) {                 // ##ifdef
    console.log('feature pawns phase 3', pawnsS, pawnsE, xxS, xxE, this.fen(this.turn));    // ##ifdef
    console.log('offset 2',f.pawnPassedOffset2S,f.pawnPassedOffset2E);                      // ##ifdef
    console.log('mult 2',f.pawnPassedMult2S,f.pawnPassedMult2E);                            // ##ifdef
    console.log('kings',f.pawnPassedKing1E,f.pawnPassedKing2E);                             // ##ifdef
    console.log('free',f.pawnPassedFreeE);                                                  // ##ifdef
    console.log('unstop',f.pawnPassedUnstopE);                                              // ##ifdef
  }                                                                                         // ##ifdef
  
  //}}}
  
  pawnsS = myround(myround(pawnsS * 1000) / 1000)
  pawnsE = myround(myround(pawnsE * 1000) / 1000)
  
  //}}}
  //{{{  K
  
  var penalty = 0;
  
  var kingS = 0;
  var kingE = 0;
  
  if (wCanBeAttacked) {
    //{{{  shelter
    
    penalty = 0;
    
    penalty += WSHELTER[(wLeast & wKingMask) >>> wKingBits] * 2;
    f.wShelter[(wLeast & wKingMask) >>> wKingBits] -= 1 * 2;            // ##ifdef
    
    if (wKingFile != 8) {
      penalty += WSHELTER[(wLeastR & wKingMask) >>> wKingBits];
      f.wShelter[(wLeastR & wKingMask) >>> wKingBits] -= 1;             // ##ifdef
    }
    
    if (wKingFile != 1) {
      penalty += WSHELTER[(wLeastL & wKingMask) >>> wKingBits];
      f.wShelter[(wLeastL & wKingMask) >>> wKingBits] -= 1;             // ##ifdef
    }
    
    if (penalty == 0) {
      f.wShelter[(wLeast & wKingMask) >>> wKingBits] += 1 * 2;          // ##ifdef
      if (wKingFile != 8)                                               // ##ifdef
        f.wShelter[(wLeastR & wKingMask) >>> wKingBits] += 1;           // ##ifdef
      if (wKingFile != 1)                                               // ##ifdef
        f.wShelter[(wLeastL & wKingMask) >>> wKingBits] += 1;           // ##ifdef
      penalty = KING_PENALTY;
      f.kingPenalty -= 1;                                               // ##ifdef
    }
    
    kingS -= penalty;
    
    //}}}
    //{{{  storm
    
    penalty = 0;
    
    penalty += WSTORM[(bMost & wKingMask) >>> wKingBits];
    f.wStorm[(bMost & wKingMask) >>> wKingBits] -= 1;     // ##ifdef
    
    if (wKingFile != 8) {
      penalty += WSTORM[(bMostR & wKingMask) >>> wKingBits];
      f.wStorm[(bMostR & wKingMask) >>> wKingBits] -= 1;  // ##ifdef
    }
    
    if (wKingFile != 1) {
      penalty += WSTORM[(bMostL & wKingMask) >>> wKingBits];
      f.wStorm[(bMostL & wKingMask) >>> wKingBits] -= 1;  // ##ifdef
    }
    
    kingS -= penalty;
    
    //}}}
  }
  
  if (bCanBeAttacked) {
    //{{{  shelter
    
    penalty = 0;
    
    penalty += WSHELTER[9 - ((bLeast & bKingMask) >>> bKingBits)] * 2;
    f.wShelter[9 - ((bLeast & bKingMask) >>> bKingBits)] += 1 * 2;              // ##ifdef
    
    if (bKingFile != 8) {
      penalty += WSHELTER[9 - ((bLeastR & bKingMask) >>> bKingBits)];
      f.wShelter[9 - ((bLeastR & bKingMask) >>> bKingBits)] += 1;               // ##ifdef
    }
    
    if (bKingFile != 1) {
      penalty += WSHELTER[9 - ((bLeastL & bKingMask) >>> bKingBits)];
      f.wShelter[9 - ((bLeastL & bKingMask) >>> bKingBits)] += 1;               // ##ifdef
    }
    
    if (penalty == 0) {
      f.wShelter[9 - ((bLeast & bKingMask) >>> bKingBits)]  -= 1 * 2;           // ##ifdef
      if (bKingFile != 8)                                                       // ##ifdef
        f.wShelter[9 - ((bLeastR & bKingMask) >>> bKingBits)] -= 1;             // ##ifdef
      if (bKingFile != 1)                                                       // ##ifdef
        f.wShelter[9 - ((bLeastL & bKingMask) >>> bKingBits)] -= 1;             // ##ifdef
      penalty = KING_PENALTY;
      f.kingPenalty += 1;                                                       // ##ifdef
    }
    
    kingS += penalty;
    
    //}}}
    //{{{  storm
    
    penalty = 0;
    
    penalty += WSTORM[9 - ((wMost & bKingMask) >>> bKingBits)];
    f.wStorm[9 - ((wMost & bKingMask) >>> bKingBits)] += 1;           // ##ifdef
    
    if (bKingFile != 8) {
      penalty += WSTORM[9 - ((wMostR & bKingMask) >>> bKingBits)];
      f.wStorm[9 - ((wMostR & bKingMask) >>> bKingBits)] += 1;        // ##ifdef
    }
    
    if (bKingFile != 1) {
      penalty += WSTORM[9 - ((wMostL & bKingMask) >>> bKingBits)];
      f.wStorm[9 - ((wMostL & bKingMask) >>> bKingBits)] += 1;        // ##ifdef
    }
    
    kingS += penalty;
    
    //}}}
  }
  
  var xx = 0;                                          // ##ifdef
                                                       // ##ifdef
  for (var zz=0; zz < f.wShelter.length; zz++) {       // ##ifdef
    xx += f.wShelter[zz] * WSHELTER[zz];               // ##ifdef
    xx += f.wStorm[zz]   * WSTORM[zz];                 // ##ifdef
  }                                                    // ##ifdef
                                                       // ##ifdef
  xx += f.kingPenalty * KING_PENALTY;                  // ##ifdef
                                                       // ##ifdef
  if (Math.abs(kingS-xx) > 0.0001)                     // ##ifdef
    console.log('feature kingS',kingS,xx,this.fen());  // ##ifdef
  
  //}}}
  //{{{  NBRQ
  
  var imbalS = 0;
  var imbalE = 0;
  
  var mobS = 0;
  var mobE = 0;
  
  var tenseS = 0;
  var tenseE = 0;
  
  var tightS = 0;
  var tightE = 0;
  
  var attS = 0;
  var attE = 0;
  
  var knightsS = 0;
  var knightsE = 0;
  
  var bishopsS = 0;
  var bishopsE = 0;
  
  var rooksS = 0;
  var rooksE = 0;
  
  var queensS = 0;
  var queensE = 0;
  
  //{{{  white
  
  var mob     = 0;
  var tight   = 0;
  var tense   = 0;
  var to      = 0;
  var fr      = 0;
  var frObj   = 0;
  var frRank  = 0;
  var frFile  = 0;
  var frBits  = 0;
  var frMask  = 0;
  var rDist   = 0;
  var fDist   = 0;
  var wBishop = 0;
  var bBishop = 0;
  var attackN = 0;
  var attackV = 0;
  var att     = 0;
  var o       = 0;
  
  var pList  = this.wList;
  var pCount = this.wCount - 1 - wNumPawns;
  
  var next  = 1;  // ignore king.
  var count = 0;
  
  while (count < pCount) {
  
    fr = pList[next++];
    if (!fr)
      continue;
  
    frObj  = b[fr];
    if (frObj == W_PAWN)
      continue;
  
    frRank = RANK[fr];
    frFile = FILE[fr];
    frBits = (frFile-1) << 2;
    frMask = 0xF << frBits;
  
    if (frObj == W_KNIGHT) {
      //{{{  N
      
      mob   = 0;
      tight = 0;
      tense = 0;
      att   = 0;
      
      to = fr+10; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      to = fr-10; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      to = fr+14; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      to = fr-14; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      to = fr+23; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      to = fr-23; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      to = fr+25; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      to = fr-25; o=b[to]; mob += IS_E[o]; att |= BKZ[to]; tight += TIGHT_WN[o]; tense += TENSE_WN[o];
      
      mobS += MOBN_S[mob];
      mobE += MOBN_E[mob];
      
      f.mobN[mob] += 1;    // ##ifdef
      
      tightS += tight * TIGHT_NS;
      tightE += tight * TIGHT_NE;
      
      tenseS += tense * TENSE_NS;
      tenseE += tense * TENSE_NE;
      
      f.tightNS += tight;  // ##ifdef
      f.tightNE += tight;  // ##ifdef
      f.tenseNS += tense;  // ##ifdef
      f.tenseNE += tense;  // ##ifdef
      
      if (bCanBeAttacked && att) {
        attackN++;
        attackV += ATT_N;
        f.attWN += 1;   // ##ifdef
      }
      
      //{{{  outpost
      
      var outpost = WOUTPOST[fr];
      
      if (outpost) {
      
        if (((bLeastR & frMask) >>> frBits) <= frRank && ((bLeastL & frMask) >>> frBits) <= frRank) {
          knightsS += outpost;
          knightsS += outpost * IS_WP[b[fr+11]];
          knightsS += outpost * IS_WP[b[fr+13]];
          f.wOutpost[fr] += 1;                                         // ##ifdef
          f.wOutpost[fr] += 1 * IS_WP[b[fr+11]];                       // ##ifdef
          f.wOutpost[fr] += 1 * IS_WP[b[fr+13]];                       // ##ifdef
        }
      }
      
      //}}}
      
      imbalS += IMBALN_S[wNumPawns];
      imbalE += IMBALN_E[wNumPawns];
      
      //}}}
    }
  
    else if (frObj == W_BISHOP) {
      //{{{  B
      
      mob   = 0;
      tense = 0;
      tight = 0;
      att   = 0;
      
      to = fr + 11; while (!b[to]) {att |= BKZ[to]; to += 11; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WB[o]; tense += TENSE_WB[o];
      to = fr - 11; while (!b[to]) {att |= BKZ[to]; to -= 11; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WB[o]; tense += TENSE_WB[o];
      to = fr + 13; while (!b[to]) {att |= BKZ[to]; to += 13; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WB[o]; tense += TENSE_WB[o];
      to = fr - 13; while (!b[to]) {att |= BKZ[to]; to -= 13; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WB[o]; tense += TENSE_WB[o];
      
      mobS += MOBB_S[mob];
      mobE += MOBB_E[mob];
      
      f.mobB[mob] += 1;    // ##ifdef
      
      tightS += tight * TIGHT_BS;
      tightE += tight * TIGHT_BE;
      
      tenseS += tense * TENSE_BS;
      tenseE += tense * TENSE_BE;
      
      f.tightBS += tight;  // ##ifdef
      f.tightBE += tight;  // ##ifdef
      f.tenseBS += tense;  // ##ifdef
      f.tenseBE += tense;  // ##ifdef
      
      if (bCanBeAttacked && att) {
        attackN++;
        attackV += ATT_B;
        f.attWB += 1;   // ##ifdef
      }
      
      wBishop += WSQUARE[fr];
      bBishop += BSQUARE[fr];
      
      imbalS += IMBALB_S[wNumPawns];
      imbalE += IMBALB_E[wNumPawns];
      
      //}}}
    }
  
    else if (frObj == W_ROOK) {
      //{{{  R
      
      mob   = 0;
      tense = 0;
      tight = 0;
      att   = 0;
      
      to = fr + 1;  while (!b[to]) {att |= BKZ[to]; to += 1;  mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WR[o]; tense += TENSE_WR[o];
      to = fr - 1;  while (!b[to]) {att |= BKZ[to]; to -= 1;  mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WR[o]; tense += TENSE_WR[o];
      to = fr + 12; while (!b[to]) {att |= BKZ[to]; to += 12; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WR[o]; tense += TENSE_WR[o];
      to = fr - 12; while (!b[to]) {att |= BKZ[to]; to -= 12; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WR[o]; tense += TENSE_WR[o];
      
      mobS += MOBR_S[mob];
      mobE += MOBR_E[mob];
      
      f.mobR[mob] += 1;    // ##ifdef
      
      f.tightRS += tight;  // ##ifdef
      f.tightRE += tight;  // ##ifdef
      f.tenseRS += tense;  // ##ifdef
      f.tenseRE += tense;  // ##ifdef
      
      tightS += tight * TIGHT_RS;
      tightE += tight * TIGHT_RE;
      
      tenseS += tense * TENSE_RS;
      tenseE += tense * TENSE_RE;
      
      if (bCanBeAttacked && att) {
        attackN++;
        attackV += ATT_R;
        f.attWR += 1;   // ##ifdef
      }
      
      if (frRank == 7 && (bKingRank == 8 || bHome)) {
        f.rook7thS += 1               // ##ifdef
        f.rook7thE += 1               // ##ifdef
        rooksS += ROOK7TH_S;
        rooksE += ROOK7TH_E;
      }
      
      f.rookOpenS -= 1;                             // ##ifdef
      f.rookOpenE -= 1;                             // ##ifdef
      rooksS -= ROOKOPEN_S;
      rooksE -= ROOKOPEN_E;
      
      if (!(wMost & frMask)) {     // no w pawn.
      
        rooksS += ROOKOPEN_S;
        rooksE += ROOKOPEN_E;
        f.rookOpenS += 1;                           // ##ifdef
        f.rookOpenE += 1;                           // ##ifdef
      
        if (!(bLeast & frMask)) {  // no b pawn.
          rooksS += ROOKOPEN_S;
          rooksE += ROOKOPEN_E;
          f.rookOpenS += 1;                         // ##ifdef
          f.rookOpenE += 1;                         // ##ifdef
        }
      
        if (frFile == bKingFile) {
          rooksS += ROOKOPEN_S;
          f.rookOpenS += 1;                         // ##ifdef
        }
      
        if (Math.abs(frFile - bKingFile) <= 1) {
          rooksS += ROOKOPEN_S;
          f.rookOpenS += 1;                         // ##ifdef
        }
      }
      
      imbalS += IMBALR_S[wNumPawns];
      imbalE += IMBALR_E[wNumPawns];
      
      //}}}
    }
  
    else if (frObj == W_QUEEN) {
      //{{{  Q
      
      mob   = 0;
      tense = 0;
      tight = 0;
      att   = 0;
      
      to = fr + 11; while (!b[to]) {att |= BKZ[to]; to += 11; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      to = fr - 11; while (!b[to]) {att |= BKZ[to]; to -= 11; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      to = fr + 13; while (!b[to]) {att |= BKZ[to]; to += 13; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      to = fr - 13; while (!b[to]) {att |= BKZ[to]; to -= 13; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      
      to = fr + 1;  while (!b[to]) {att |= BKZ[to]; to += 1;  mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      to = fr - 1;  while (!b[to]) {att |= BKZ[to]; to -= 1;  mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      to = fr + 12; while (!b[to]) {att |= BKZ[to]; to += 12; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      to = fr - 12; while (!b[to]) {att |= BKZ[to]; to -= 12; mob++;} att |= BKZ[to]; o=b[to]; tight += TIGHT_WQ[o]; tense += TENSE_WQ[o];
      
      mobS += MOBQ_S[mob];
      mobE += MOBQ_E[mob];
      
      f.mobQ[mob] += 1;    // ##ifdef
      
      tightS += tight * TIGHT_QS;
      tightE += tight * TIGHT_QE;
      
      tenseS += tense * TENSE_QS;
      tenseE += tense * TENSE_QE;
      
      f.tightQS += tight;  // ##ifdef
      f.tightQE += tight;  // ##ifdef
      f.tenseQS += tense;  // ##ifdef
      f.tenseQE += tense;  // ##ifdef
      
      if (bCanBeAttacked && att) {
        attackN++;
        attackV += ATT_Q;
        f.attWQ += 1;   // ##ifdef
      }
      
      if (frRank == 7 && (bKingRank == 8 || bHome)) {
        f.queen7thS += 1               // ##ifdef
        f.queen7thE += 1               // ##ifdef
        queensS += QUEEN7TH_S;
        queensE += QUEEN7TH_E;
      }
      
      imbalS += IMBALQ_S[wNumPawns];
      imbalE += IMBALQ_E[wNumPawns];
      
      //}}}
    }
  
    count++;
  }
  
  attS += attackV * ATT_W[attackN];
  attE += 0;
  f.attWN = f.attWN * ATT_W[attackN];                               // ##ifdef
  f.attWB = f.attWB * ATT_W[attackN];                               // ##ifdef
  f.attWR = f.attWR * ATT_W[attackN];                               // ##ifdef
  f.attWQ = f.attWQ * ATT_W[attackN];                               // ##ifdef
  var xx = 0;                                                       // ##ifdef
  xx += f.attWN * ATT_N;                                            // ##ifdef
  xx += f.attWB * ATT_B;                                            // ##ifdef
  xx += f.attWR * ATT_R;                                            // ##ifdef
  xx += f.attWQ * ATT_Q;                                            // ##ifdef
  if (Math.abs(attS - xx) > 0.000001)                               // ##ifdef
    console.log('W attack',attS,xx,attackN,this.fen(this.turn));    // ##ifdef
  
  if (wBishop && bBishop) {
    f.bishopPairS += 1;        // ##ifdef
    f.bishopPairE += 1;        // ##ifdef
    bishopsS += TWOBISHOPS_S;
    bishopsE += TWOBISHOPS_E;
  }
  
  //}}}
  //{{{  black
  
  var mob     = 0;
  var tight   = 0;
  var tense   = 0;
  var to      = 0;
  var fr      = 0;
  var frObj   = 0;
  var frRank  = 0;
  var frFile  = 0;
  var frBits  = 0;
  var frMask  = 0;
  var rDist   = 0;
  var fDist   = 0;
  var wBishop = 0;
  var bBishop = 0;
  var attackN = 0;
  var attackV = 0;
  var att     = 0;
  var o       = 0;
  
  var pList  = this.bList;
  var pCount = this.bCount - 1 - bNumPawns;
  
  var next  = 1;  // ignore king.
  var count = 0;
  
  while (count < pCount) {
  
    fr = pList[next++];
    if (!fr)
      continue;
  
    frObj = b[fr];
  
    if (frObj == B_PAWN)
      continue;
  
    frRank  = RANK[fr];
    frFile  = FILE[fr];
    frBits  = (frFile-1) << 2;
    frMask  = 0xF << frBits;
  
    if (frObj == B_KNIGHT) {
      //{{{  N
      
      mob   = 0;
      tense = 0;
      tight = 0;
      att   = 0;
      
      to = fr+10; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      to = fr-10; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      to = fr+14; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      to = fr-14; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      to = fr+23; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      to = fr-23; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      to = fr+25; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      to = fr-25; o=b[to]; mob += IS_E[o]; att |= WKZ[to]; tight += TIGHT_BN[o]; tense += TENSE_BN[o];
      
      mobS -= MOBN_S[mob];
      mobE -= MOBN_E[mob];
      
      f.mobN[mob] -= 1;    // ##ifdef
      
      tightS -= tight * TIGHT_NS;
      tightE -= tight * TIGHT_NE;
      
      tenseS -= tense * TENSE_NS;
      tenseE -= tense * TENSE_NE;
      
      f.tightNS -= tight;  // ##ifdef
      f.tightNE -= tight;  // ##ifdef
      f.tenseNS -= tense;  // ##ifdef
      f.tenseNE -= tense;  // ##ifdef
      
      if (wCanBeAttacked && att) {
        attackN++;
        attackV += ATT_N;
        f.attBN += 1;   // ##ifdef
      }
      
      //{{{  outpost
      
      var outpost = BOUTPOST[fr];
      
      if (outpost) {
      
        if (((wLeastR & frMask) >>> frBits) >= frRank && ((wLeastL & frMask) >>> frBits) >= frRank) {
          knightsS -= outpost;
          knightsS -= outpost * IS_BP[b[fr-11]];
          knightsS -= outpost * IS_BP[b[fr-13]];
          f.wOutpost[wbmap(fr)] -= 1;                                  // ##ifdef
          f.wOutpost[wbmap(fr)] -= 1 * IS_BP[b[fr-11]];                // ##ifdef
          f.wOutpost[wbmap(fr)] -= 1 * IS_BP[b[fr-13]];                // ##ifdef
        }
      }
      
      //}}}
      
      imbalS -= IMBALN_S[bNumPawns];
      imbalE -= IMBALN_E[bNumPawns];
      
      //}}}
    }
  
    else if (frObj == B_BISHOP) {
      //{{{  B
      
      mob   = 0;
      tense = 0;
      tight = 0;
      att   = 0;
      
      to = fr + 11; while (!b[to]) {att |= WKZ[to]; to += 11; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BB[o]; tense += TENSE_BB[o];
      to = fr - 11; while (!b[to]) {att |= WKZ[to]; to -= 11; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BB[o]; tense += TENSE_BB[o];
      to = fr + 13; while (!b[to]) {att |= WKZ[to]; to += 13; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BB[o]; tense += TENSE_BB[o];
      to = fr - 13; while (!b[to]) {att |= WKZ[to]; to -= 13; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BB[o]; tense += TENSE_BB[o];
      
      mobS -= MOBB_S[mob];
      mobE -= MOBB_E[mob];
      
      f.mobB[mob] -= 1;    // ##ifdef
      
      tightS -= tight * TIGHT_BS;
      tightE -= tight * TIGHT_BE;
      
      tenseS -= tense * TENSE_BS;
      tenseE -= tense * TENSE_BE;
      
      f.tightBS -= tight;  // ##ifdef
      f.tightBE -= tight;  // ##ifdef
      f.tenseBS -= tense;  // ##ifdef
      f.tenseBE -= tense;  // ##ifdef
      
      if (wCanBeAttacked && att) {
        attackN++;
        attackV += ATT_B;
        f.attBB += 1;   // ##ifdef
      }
      
      wBishop += WSQUARE[fr];
      bBishop += BSQUARE[fr];
      
      imbalS -= IMBALB_S[bNumPawns];
      imbalE -= IMBALB_E[bNumPawns];
      
      //}}}
    }
  
    else if (frObj == B_ROOK) {
      //{{{  R
      
      mob   = 0;
      tense = 0;
      tight = 0;
      att   = 0;
      
      to = fr + 1;  while (!b[to]) {att |= WKZ[to]; to += 1;  mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BR[o]; tense += TENSE_BR[o];
      to = fr - 1;  while (!b[to]) {att |= WKZ[to]; to -= 1;  mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BR[o]; tense += TENSE_BR[o];
      to = fr + 12; while (!b[to]) {att |= WKZ[to]; to += 12; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BR[o]; tense += TENSE_BR[o];
      to = fr - 12; while (!b[to]) {att |= WKZ[to]; to -= 12; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BR[o]; tense += TENSE_BR[o];
      
      mobS -= MOBR_S[mob];
      mobE -= MOBR_E[mob];
      
      f.mobR[mob] -= 1;    // ##ifdef
      
      tightS -= tight * TIGHT_RS;
      tightE -= tight * TIGHT_RE;
      
      tenseS -= tense * TENSE_RS;
      tenseE -= tense * TENSE_RE;
      
      f.tightRS -= tight;  // ##ifdef
      f.tightRE -= tight;  // ##ifdef
      f.tenseRS -= tense;  // ##ifdef
      f.tenseRE -= tense;  // ##ifdef
      
      if (wCanBeAttacked && att) {
        attackN++;
        attackV += ATT_R;
        f.attBR += 1;   // ##ifdef
      }
      
      if (frRank == 2 && (wKingRank == 1 || wHome)) {
        f.rook7thS -= 1               // ##ifdef
        f.rook7thE -= 1               // ##ifdef
        rooksS -= ROOK7TH_S;
        rooksE -= ROOK7TH_E;
      }
      
      rooksS += ROOKOPEN_S;
      rooksE += ROOKOPEN_E;
      f.rookOpenS += 1;                               // ##ifdef
      f.rookOpenE += 1;                               // ##ifdef
      
      if (!(bLeast & frMask)) {   // no b pawn.
      
        rooksS -= ROOKOPEN_S;
        rooksE -= ROOKOPEN_E;
        f.rookOpenS -= 1;                             // ##ifdef
        f.rookOpenE -= 1;                             // ##ifdef
      
        if (!(wMost & frMask)) {  // no w pawn.
          rooksS -= ROOKOPEN_S;
          rooksE -= ROOKOPEN_E;
          f.rookOpenS -= 1;                           // ##ifdef
          f.rookOpenE -= 1;                           // ##ifdef
        }
      
        if (frFile == wKingFile) {
          rooksS -= ROOKOPEN_S;
          f.rookOpenS -= 1;                           // ##ifdef
        }
      
        if (Math.abs(frFile - wKingFile) <= 1) {
          rooksS -= ROOKOPEN_S;
          f.rookOpenS -= 1;                           // ##ifdef
        }
      }
      
      imbalS -= IMBALR_S[bNumPawns];
      imbalE -= IMBALR_E[bNumPawns];
      
      //}}}
    }
  
    else if (frObj == B_QUEEN) {
      //{{{  Q
      
      mob   = 0;
      tense = 0;
      tight = 0;
      att   = 0;
      
      to = fr + 11; while (!b[to]) {att |= WKZ[to]; to += 11; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      to = fr - 11; while (!b[to]) {att |= WKZ[to]; to -= 11; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      to = fr + 13; while (!b[to]) {att |= WKZ[to]; to += 13; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      to = fr - 13; while (!b[to]) {att |= WKZ[to]; to -= 13; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      
      to = fr + 1;  while (!b[to]) {att |= WKZ[to]; to += 1;  mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      to = fr - 1;  while (!b[to]) {att |= WKZ[to]; to -= 1;  mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      to = fr + 12; while (!b[to]) {att |= WKZ[to]; to += 12; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      to = fr - 12; while (!b[to]) {att |= WKZ[to]; to -= 12; mob++;} att |= WKZ[to]; o=b[to]; tight += TIGHT_BQ[o]; tense += TENSE_BQ[o];
      
      mobS -= MOBQ_S[mob];
      mobE -= MOBQ_E[mob];
      
      f.mobQ[mob] -= 1;    // ##ifdef
      
      tightS -= tight * TIGHT_QS;
      tightE -= tight * TIGHT_QE;
      
      tenseS -= tense * TENSE_QS;
      tenseE -= tense * TENSE_QE;
      
      f.tightQS -= tight;  // ##ifdef
      f.tightQE -= tight;  // ##ifdef
      f.tenseQS -= tense;  // ##ifdef
      f.tenseQE -= tense;  // ##ifdef
      
      if (wCanBeAttacked && att) {
        attackN++;
        attackV += ATT_Q;
        f.attBQ += 1;   // ##ifdef
      }
      
      if (frRank == 2 && (wKingRank == 1 || wHome)) {
        f.queen7thS -= 1               // ##ifdef
        f.queen7thE -= 1               // ##ifdef
        queensS -= QUEEN7TH_S;
        queensE -= QUEEN7TH_E;
      }
      
      imbalS -= IMBALQ_S[bNumPawns];
      imbalE -= IMBALQ_E[bNumPawns];
      
      //}}}
    }
  
    count++;
  }
  
  attS -= attackV * ATT_W[attackN];
  attE -= 0;
  f.attBN = f.attBN * ATT_W[attackN];    // ##ifdef
  f.attBB = f.attBB * ATT_W[attackN];    // ##ifdef
  f.attBR = f.attBR * ATT_W[attackN];    // ##ifdef
  f.attBQ = f.attBQ * ATT_W[attackN];    // ##ifdef
  
  if (wBishop && bBishop) {
    f.bishopPairS -= 1;         // ##ifdef
    f.bishopPairE -= 1;         // ##ifdef
    bishopsS -= TWOBISHOPS_S;
    bishopsE -= TWOBISHOPS_E;
  }
  
  //}}}
  
  var xx = 0;                                                       // ##ifdef
  xx += f.attWN * ATT_N;                                            // ##ifdef
  xx += f.attWB * ATT_B;                                            // ##ifdef
  xx += f.attWR * ATT_R;                                            // ##ifdef
  xx += f.attWQ * ATT_Q;                                            // ##ifdef
  xx -= f.attBN * ATT_N;                                            // ##ifdef
  xx -= f.attBB * ATT_B;                                            // ##ifdef
  xx -= f.attBR * ATT_R;                                            // ##ifdef
  xx -= f.attBQ * ATT_Q;                                            // ##ifdef
  if (Math.abs(attS - xx) > 0.000001)                               // ##ifdef
     console.log('attack',attS,xx,this.fen(this.turn));             // ##ifdef
  f.attN = f.attWN - f.attBN                                        // ##ifdef
  f.attB = f.attWB - f.attBB                                        // ##ifdef
  f.attR = f.attWR - f.attBR                                        // ##ifdef
  f.attQ = f.attWQ - f.attBQ                                        // ##ifdef
  var xxS = 0;                                                      // ##ifdef
  for (var zz=0; zz<144; zz++)                                      // ##ifdef
    xxS += f.wOutpost[zz] * WOUTPOST[zz];                           // ##ifdef
  if (Math.abs(knightsS - xxS) > 0.000001)                          // ##ifdef
    console.log('outpost',knightsS,xxS,this.fen(this.turn));        // ##ifdef
                                                                    // ##ifdef
  var xxS = 0;                                                      // ##ifdef
  var xxE = 0;                                                      // ##ifdef
  for (var zz=0; zz<f.mobN.length; zz++) {                          // ##ifdef
    xxS += f.mobN[zz] * MOBN_S[zz];                                 // ##ifdef
    xxE += f.mobN[zz] * MOBN_E[zz];                                 // ##ifdef
  }                                                                 // ##ifdef
  for (var zz=0; zz<f.mobB.length; zz++) {                          // ##ifdef
    xxS += f.mobB[zz] * MOBB_S[zz];                                 // ##ifdef
    xxE += f.mobB[zz] * MOBB_E[zz];                                 // ##ifdef
  }                                                                 // ##ifdef
  for (var zz=0; zz<f.mobR.length; zz++) {                          // ##ifdef
    xxS += f.mobR[zz] * MOBR_S[zz];                                 // ##ifdef
    xxE += f.mobR[zz] * MOBR_E[zz];                                 // ##ifdef
  }                                                                 // ##ifdef
  for (var zz=0; zz<f.mobQ.length; zz++) {                          // ##ifdef
    xxS += f.mobQ[zz] * MOBQ_S[zz];                                 // ##ifdef
    xxE += f.mobQ[zz] * MOBQ_E[zz];                                 // ##ifdef
  }                                                                 // ##ifdef
  if (Math.abs(mobS - xxS) > 0.000001)                              // ##ifdef
    console.log('mobility s',mobS,xxS,this.fen(this.turn));         // ##ifdef
  if (Math.abs(mobE - xxE) > 0.000001)                              // ##ifdef
    console.log('mobility e',mobE,xxE,this.fen(this.turn));         // ##ifdef
                                                                    // ##ifdef
  var xxS = 0;                                                      // ##ifdef
  var xxE = 0;                                                      // ##ifdef
  xxS += f.tightNS * TIGHT_NS;                                      // ##ifdef
  xxE += f.tightNE * TIGHT_NE;                                      // ##ifdef
  xxS += f.tightBS * TIGHT_BS;                                      // ##ifdef
  xxE += f.tightBE * TIGHT_BE;                                      // ##ifdef
  xxS += f.tightRS * TIGHT_RS;                                      // ##ifdef
  xxE += f.tightRE * TIGHT_RE;                                      // ##ifdef
  xxS += f.tightQS * TIGHT_QS;                                      // ##ifdef
  xxE += f.tightQE * TIGHT_QE;                                      // ##ifdef
  if (Math.abs(tightS - xxS) > 0.000001)                            // ##ifdef
    console.log('tight s',tightS,xxS,this.fen(this.turn));          // ##ifdef
  if (Math.abs(tightE - xxE) > 0.000001)                            // ##ifdef
    console.log('tight e',tightE,xxE,this.fen(this.turn));          // ##ifdef
                                                                    // ##ifdef
  var xxS = 0;                                                      // ##ifdef
  var xxE = 0;                                                      // ##ifdef
  xxS += f.tenseNS * TENSE_NS;                                      // ##ifdef
  xxE += f.tenseNE * TENSE_NE;                                      // ##ifdef
  xxS += f.tenseBS * TENSE_BS;                                      // ##ifdef
  xxE += f.tenseBE * TENSE_BE;                                      // ##ifdef
  xxS += f.tenseRS * TENSE_RS;                                      // ##ifdef
  xxE += f.tenseRE * TENSE_RE;                                      // ##ifdef
  xxS += f.tenseQS * TENSE_QS;                                      // ##ifdef
  xxE += f.tenseQE * TENSE_QE;                                      // ##ifdef
  if (Math.abs(tenseS - xxS) > 0.000001)                            // ##ifdef
    console.log('tense s',tenseS,xxS,this.fen(this.turn));          // ##ifdef
  if (Math.abs(tenseE - xxE) > 0.000001)                            // ##ifdef
    console.log('tense e',tenseE,xxE,this.fen(this.turn));          // ##ifdef
  
  attS = myround(myround(attS * 1000) / 1000);
  
  //}}}

  //{{{  trapped
  
  var trappedS = 0;
  var trappedE = 0;
  
  //{{{  trapped bishops
  
  var trap = 0;
  
  if (wNumBishops) {
  
    trap = 0;
  
    trap += IS_WB[b[SQA7]] & IS_BP[b[SQB6]];
    trap += IS_WB[b[SQH7]] & IS_BP[b[SQG6]];
  
    trap += IS_WB[b[SQB8]] & IS_BP[b[SQC7]];
    trap += IS_WB[b[SQG7]] & IS_BP[b[SQF7]];
  
    trap += IS_WB[b[SQA6]] & IS_BP[b[SQB5]];
    trap += IS_WB[b[SQH6]] & IS_BP[b[SQG5]];
  
    trap += IS_WB[b[SQC1]] & IS_WP[b[SQD2]] & IS_O[b[SQD3]];
    trap += IS_WB[b[SQF1]] & IS_WP[b[SQE2]] & IS_O[b[SQE3]];
  
    trappedS -= trap * TRAPPED_S;
    trappedE -= trap * TRAPPED_E;
    f.trappedS -= trap;  // ##ifdef
    f.trappedE -= trap;  // ##ifdef
  }
  
  if (bNumBishops) {
  
    trap = 0;
  
    trap += IS_BB[b[SQA2]] & IS_WP[b[SQB3]];
    trap += IS_BB[b[SQH2]] & IS_WP[b[SQG3]];
  
    trap += IS_BB[b[SQB1]] & IS_WP[b[SQC2]];
    trap += IS_BB[b[SQG2]] & IS_WP[b[SQF2]];
  
    trap += IS_BB[b[SQA3]] & IS_WP[b[SQB4]];
    trap += IS_BB[b[SQH3]] & IS_WP[b[SQG4]];
  
    trap += IS_BB[b[SQC8]] & IS_BP[b[SQD7]] * IS_O[b[SQD6]];
    trap += IS_BB[b[SQF8]] & IS_BP[b[SQE7]] * IS_O[b[SQE6]];
  
    trappedS += trap * TRAPPED_S;
    trappedE += trap * TRAPPED_E;
    f.trappedS += trap;  // ##ifdef
    f.trappedE += trap;  // ##ifdef
  }
  
  //}}}
  //{{{  trapped knights
  
  if (wNumKnights) {
  
    trap = 0;
  
    trap += IS_WN[b[SQA8]] & (IS_BP[b[SQA7]] | IS_BP[b[SQC7]]);
    trap += IS_WN[b[SQH8]] & (IS_BP[b[SQH7]] | IS_BP[b[SQF7]]);
  
    trap += IS_WN[b[SQA7]] & IS_BP[b[SQA6]] & IS_BP[b[SQB7]];
    trap += IS_WN[b[SQH7]] & IS_BP[b[SQH6]] & IS_BP[b[SQG7]];
  
    trap += IS_WN[b[SQA7]] & IS_BP[b[SQB7]] & IS_BP[b[SQC6]];
    trap += IS_WN[b[SQH7]] & IS_BP[b[SQG7]] & IS_BP[b[SQF6]];
  
    trappedS -= trap * TRAPPED_S;
    trappedE -= trap * TRAPPED_E;
    f.trappedS -= trap; // ##ifdef
    f.trappedE -= trap; // ##ifdef
  }
  
  if (bNumKnights) {
  
    trap = 0;
  
    trap += IS_BN[b[SQA1]] & (IS_WP[b[SQA2]] | IS_WP[b[SQC2]]);
    trap += IS_BN[b[SQH1]] & (IS_WP[b[SQH2]] | IS_WP[b[SQF2]]);
  
    trap += IS_BN[b[SQA2]] & IS_WP[b[SQA3]] & IS_WP[b[SQB2]];
    trap += IS_BN[b[SQH2]] & IS_WP[b[SQH3]] & IS_WP[b[SQG2]];
  
    trap += IS_BN[b[SQA2]] & IS_WP[b[SQB2]] & IS_WP[b[SQC3]];
    trap += IS_BN[b[SQH2]] & IS_WP[b[SQG2]] & IS_WP[b[SQF3]];
  
    trappedS += trap * TRAPPED_S;
    trappedE += trap * TRAPPED_E;
    f.trappedS += trap; // ##ifdef
    f.trappedE += trap; // ##ifdef
  }
  
  //}}}
  
  //}}}
  //{{{  tempo
  
  if (turn == WHITE) {
    var tempoS = TEMPO_S;
    var tempoE = TEMPO_E;
    f.tempoS = 1;                // ##ifdef
    f.tempoE = 1;                // ##ifdef
  }
  
  else {
    var tempoS = -TEMPO_S;
    var tempoE = -TEMPO_E;
    f.tempoS = -1;               // ##ifdef
    f.tempoE = -1;               // ##ifdef
  }
  
  //}}}

  //{{{  combine
  
  var evalS = this.runningEvalS;
  var evalE = this.runningEvalE;
  
  evalS += mobS;
  evalE += mobE;
  
  evalS += tightS;
  evalE += tightE;
  
  evalS += tenseS;
  evalE += tenseE;
  
  evalS += imbalS;
  evalE += imbalE;
  
  evalS += trappedS;
  evalE += trappedE;
  
  evalS += tempoS;
  evalE += tempoE;
  
  evalS += attS;
  evalE += attE;
  
  evalS += pawnsS;
  evalE += pawnsE;
  
  evalS += knightsS;
  evalE += knightsE;
  
  evalS += bishopsS;
  evalE += bishopsE;
  
  evalS += rooksS;
  evalE += rooksE;
  
  evalS += queensS;
  evalE += queensE;
  
  evalS += kingS;
  evalE += kingE;
  
  var e = (evalS * (TPHASE - phase) + evalE * phase) / TPHASE;
  
  e = myround(e) | 0;
  
  //}}}
  //{{{  verbose
  
  if (this.verbose) {
    uci.send('info string','phased eval = ',e);
    uci.send('info string','phase =       ',phase);
    uci.send('info string','evaluation =  ',evalS,evalE);
    uci.send('info string','material =    ',this.runningEvalS,this.runningEvalE);
    uci.send('info string','trapped =     ',trappedS,trappedE);
    uci.send('info string','mobility =    ',mobS,mobE);
    uci.send('info string','tightness =   ',tightS,tightE);
    uci.send('info string','tension =     ',tenseS,tenseE);
    uci.send('info string','attacks =     ',attS,attE);
    uci.send('info string','imbalance =   ',imbalS,imbalE);
    uci.send('info string','king safety = ',kingS,kingE);
    uci.send('info string','queens =      ',queensS,queensE);
    uci.send('info string','rooks =       ',rooksS,rooksE);
    uci.send('info string','bishop pair = ',bishopsS,bishopsE);
    uci.send('info string','knights =     ',knightsS,knightsE);
    uci.send('info string','pawns =       ',pawnsS,pawnsE);
    uci.send('info string','tempo =       ',tempoS,tempoE);
  }
  
  //}}}

  if (turn == WHITE)
    return e;
  else
    return -e;
}

//}}}
//{{{  .rand32

lozBoard.prototype.rand32 = function () {

  var r = randoms[nextRandom];

  nextRandom++;

  if (nextRandom == 4000) {
    lozza.uci.send('info','run out of randoms');
  }

  return r;
}

//}}}
//{{{  .ttPut

lozBoard.prototype.ttPut = function (type,depth,score,move,ply,alpha,beta) {

  var idx = this.loHash & TTMASK;

  //if (this.ttType[idx] == TT_EXACT && this.loHash == this.ttLo[idx] && this.hiHash == this.ttHi[idx] && this.ttDepth[idx] > depth && this.ttScore[idx] > alpha && this.ttScore[idx] < beta) {
    //return;
  //}

  if (this.ttType[idx] == TT_EMPTY)
    this.hashUsed++;

  if (score <= -MINMATE && score >= -MATE)
    score -= ply;

  else if (score >= MINMATE && score <= MATE)
    score += ply;

  this.ttLo[idx]    = this.loHash;
  this.ttHi[idx]    = this.hiHash;
  this.ttType[idx]  = type;
  this.ttDepth[idx] = depth;
  this.ttScore[idx] = score;
  this.ttMove[idx]  = move;
}

//}}}
//{{{  .ttGet

lozBoard.prototype.ttGet = function (node, depth, alpha, beta) {

  var idx   = this.loHash & TTMASK;
  var type  = this.ttType[idx];

  node.hashMove = 0;

  if (type == TT_EMPTY) {
    return TTSCORE_UNKNOWN;
  }

  var lo = this.ttLo[idx];
  var hi = this.ttHi[idx];

  if (lo != this.loHash || hi != this.hiHash) {
    return TTSCORE_UNKNOWN;
  }

  //
  // Set the hash move before the depth check
  // so that iterative deepening works.
  //

  node.hashMove = this.ttMove[idx];

  if (this.ttDepth[idx] < depth) {
    return TTSCORE_UNKNOWN;
  }

  var score = this.ttScore[idx];

  if (score <= -MINMATE && score >= -MATE)
    score += node.ply;

  else if (score >= MINMATE && score <= MATE)
    score -= node.ply;

  if (type == TT_EXACT) {
    return score;
   }

  if (type == TT_ALPHA && score <= alpha) {
    return score;
  }

  if (type == TT_BETA && score >= beta) {
    return score;
  }

  return TTSCORE_UNKNOWN;
}

//}}}
//{{{  .ttGetMove

lozBoard.prototype.ttGetMove = function (node) {

  var idx = this.loHash & TTMASK;

  if (this.ttType[idx] != TT_EMPTY && this.ttLo[idx] == this.loHash && this.ttHi[idx] == this.hiHash)
    return this.ttMove[idx];

  return 0;
}

//}}}
//{{{  .ttInit

lozBoard.prototype.ttInit = function () {

  this.loHash = 0;
  this.hiHash = 0;

  this.ploHash = 0;
  this.phiHash = 0;

  this.ttType.fill(TT_EMPTY);
  this.pttFlags.fill(TT_EMPTY);

  this.hashUsed = 0;
}

//}}}
//{{{  .hashCheck

lozBoard.prototype.hashCheck = function (turn) {

  var loHash = 0;
  var hiHash = 0;

  var ploHash = 0;
  var phiHash = 0;

  if (turn) {
    loHash ^= this.loTurn;
    hiHash ^= this.hiTurn;
  }

  loHash ^= this.loRights[this.rights];
  hiHash ^= this.hiRights[this.rights];

  loHash ^= this.loEP[this.ep];
  hiHash ^= this.hiEP[this.ep];

  for (var sq=0; sq<144; sq++) {

    var obj = this.b[sq];

    if (obj == NULL || obj == EDGE)
      continue;

    var piece = obj & PIECE_MASK;
    var col   = obj & COLOR_MASK;

    loHash ^= this.loPieces[col>>>3][piece-1][sq];
    hiHash ^= this.hiPieces[col>>>3][piece-1][sq];

    if (piece == PAWN) {
      ploHash ^= this.loPieces[col>>>3][0][sq];
      phiHash ^= this.hiPieces[col>>>3][0][sq];
    }
  }

  if (this.loHash != loHash)
    console.log('*************** LO',this.loHash,loHash);

  if (this.hiHash != hiHash)
    console.log('*************** HI',this.hiHash,hiHash);

  if (this.ploHash != ploHash)
    console.log('************* PLO',this.ploHash,ploHash);

  if (this.phiHash != phiHash)
    console.log('************* PHI',this.phiHash,phiHash);
}

//}}}
//{{{  .fen

lozBoard.prototype.fen = function (turn) {

  var fen = '';
  var n   = 0;

  for (var i=0; i < 8; i++) {
    for (var j=0; j < 8; j++) {
      var sq  = B88[i*8 + j]
      var obj = this.b[sq];
      if (obj == NULL)
        n++;
      else {
        if (n) {
          fen += '' + n;
          n = 0;
        }
        fen += UMAP[obj];
      }
    }
    if (n) {
      fen += '' + n;
      n = 0;
    }
    if (i < 7)
      fen += '/';
  }

  if (turn == WHITE)
    fen += ' w';
  else
    fen += ' b';

  if (this.rights) {
    fen += ' ';
    if (this.rights & WHITE_RIGHTS_KING)
      fen += 'K';
    if (this.rights & WHITE_RIGHTS_QUEEN)
      fen += 'Q';
    if (this.rights & BLACK_RIGHTS_KING)
      fen += 'k';
    if (this.rights & BLACK_RIGHTS_QUEEN)
      fen += 'Q';
  }
  else
    fen += ' -';

  if (this.ep)
    fen += ' ' + COORDS[this.ep];
  else
    fen += ' -';

  fen += ' 0 1';

  return fen;
}

//}}}
//{{{  .playMove

lozBoard.prototype.playMove = function (moveStr) {

  var move     = 0;
  var node     = lozza.rootNode;
  var nextTurn = ~this.turn & COLOR_MASK;

  node.cache();

  this.genMoves(node, this.turn);

  while (move = node.getNextMove()) {

    this.makeMove(node,move);

    var attacker = this.isKingAttacked(nextTurn);

    if (attacker) {

      this.unmakeMove(node,move);
      node.uncache();

      continue;
    }

    var fMove = this.formatMove(move,UCI_FMT);

    if (moveStr == fMove || moveStr+'q' == fMove) {
      this.turn = ~this.turn & COLOR_MASK;
      return true;
    }

    this.unmakeMove(node,move);
    node.uncache();
  }

  return false;
}

//}}}
//{{{  .getPVStr

lozBoard.prototype.getPVStr = function(node,move,depth) {

  if (!node || !depth)
    return '';

  if (!move)
    move = this.ttGetMove(node);

  if (!move)
    return '';

  node.cache();
  this.makeMove(node,move);

  var mv = this.formatMove(move, this.mvFmt);
  var pv = ' ' + this.getPVStr(node.childNode,0,depth-1);

  this.unmakeMove(node,move);
  node.uncache();

  return mv + pv;
}

//}}}
//{{{  .addHistory

lozBoard.prototype.addHistory = function (x, move) {

  var to      = (move & MOVE_TO_MASK)    >>> MOVE_TO_BITS;
  var frObj   = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;
  var frPiece = frObj & PIECE_MASK;

  if ((frObj & COLOR_MASK) == WHITE) {
    this.wHistory[frPiece][to] += x;
  }
  else {
    this.bHistory[frPiece][to] += x;
  }
}

//}}}
//{{{  .betaMate

lozBoard.prototype.betaMate = function (score) {

  return (score >= MINMATE && score <= MATE);
}

//}}}
//{{{  .alphaMate

lozBoard.prototype.alphaMate = function (score) {

  return (score <= -MINMATE && score >= -MATE)
}

//}}}
//{{{  .cleanPhase

lozBoard.prototype.cleanPhase = function (p) {

  if (p <= 0)            // because of say 3 queens early on.
    return 0;

  else if (p >= TPHASE)  // jic.
    return TPHASE;

  return p;
}

//}}}

//}}}
//{{{  lozNode class

//{{{  lozNode

function lozNode (parentNode) {

  this.ply        = 0;          //  distance from root.
  this.root       = false;      //  only true for the root node node[0].
  this.childNode  = null;       //  pointer to next node (towards leaf) in tree.
  this.parentNode = parentNode; //  pointer previous node (towards root) in tree.

  if (parentNode) {
    this.grandparentNode = parentNode.parentNode;
    parentNode.childNode = this;
  }
  else
    this.grandparentNode = null;

  this.moves = new Uint32Array(MAX_MOVES);
  this.ranks = Array(MAX_MOVES);

  for (var i=0; i < MAX_MOVES; i++) {
    this.moves[i] = 0;
    this.ranks[i] = 0;
  }

  this.killer1     = 0;
  this.killer2     = 0;
  this.mateKiller  = 0;
  this.numMoves    = 0;         //  number of pseudo-legal moves for this node.
  this.sortedIndex = 0;         //  index to next selection-sorted pseudo-legal move.
  this.hashMove    = 0;         //  loaded when we look up the tt.
  this.base        = 0;         //  move type base (e.g. good capture) - can be used for LMR.

  this.C_runningEvalS = 0;      // cached before move generation and restored after each unmakeMove.
  this.C_runningEvalE = 0;
  this.C_rights       = 0;
  this.C_ep           = 0;
  this.C_repLo        = 0;
  this.C_repHi        = 0;
  this.C_loHash       = 0;
  this.C_hiHash       = 0;
  this.C_ploHash      = 0;
  this.C_phiHash      = 0;

  this.toZ = 0;                 // move to square index (captures) to piece list - cached during make|unmakeMove.
  this.frZ = 0;                 // move from square index to piece list          - ditto.
  this.epZ = 0;                 // captured ep pawn index to piece list          - ditto.
}

//}}}
//{{{  .init
//
//  By storing the killers in the node, we are implicitly using depth from root, rather than
//  depth, which can jump around all over the place and is inappropriate to use for killers.
//

lozNode.prototype.init = function() {

  this.killer1      = 0;
  this.killer2      = 0;
  this.mateKiller   = 0;
  this.numMoves     = 0;
  this.sortedIndex  = 0;
  this.hashMove     = 0;
  this.base         = 0;

  this.toZ = 0;
  this.frZ = 0;
  this.epZ = 0;
}

//}}}
//{{{  .cache
//
// We cache the board before move generation (those elements not done in unmakeMove)
// and restore after each unmakeMove.
//

lozNode.prototype.cache = function() {

  var board = this.board;

  this.C_runningEvalS = board.runningEvalS;
  this.C_runningEvalE = board.runningEvalE
  this.C_rights       = board.rights;
  this.C_ep           = board.ep;
  this.C_repLo        = board.repLo;
  this.C_repHi        = board.repHi;
  this.C_loHash       = board.loHash;
  this.C_hiHash       = board.hiHash;
  this.C_ploHash      = board.ploHash;
  this.C_phiHash      = board.phiHash;
}

//}}}
//{{{  .uncache

lozNode.prototype.uncache = function() {

  var board = this.board;

  board.runningEvalS   = this.C_runningEvalS;
  board.runningEvalE   = this.C_runningEvalE;
  board.rights         = this.C_rights;
  board.ep             = this.C_ep;
  board.repLo          = this.C_repLo;
  board.repHi          = this.C_repHi;
  board.loHash         = this.C_loHash;
  board.hiHash         = this.C_hiHash;
  board.ploHash        = this.C_ploHash;
  board.phiHash        = this.C_phiHash;
}

//}}}
//{{{  .getNextMove

lozNode.prototype.getNextMove = function () {

  if (this.sortedIndex == this.numMoves)
    return 0;

  var maxR = -INFINITY;
  var maxI = 0;

  for (var i=this.sortedIndex; i < this.numMoves; i++) {
    if (this.ranks[i] > maxR) {
      maxR = this.ranks[i];
      maxI = i;
    }
  }

  var maxM = this.moves[maxI]

  this.moves[maxI] = this.moves[this.sortedIndex];
  this.ranks[maxI] = this.ranks[this.sortedIndex];

  this.base = maxR;

  this.sortedIndex++;

  return maxM;
}

//}}}
//{{{  .addSlide

lozNode.prototype.addSlide = function (move) {

  var n = this.numMoves++;

  this.moves[n] = move;

  if (move == this.hashMove)
    this.ranks[n] = BASE_HASH;

  else if (move == this.mateKiller)
    this.ranks[n] = BASE_MATEKILLER;

  else if (move == this.killer1)
    this.ranks[n] = BASE_MYKILLERS + 1;

  else if (move == this.killer2)
    this.ranks[n] = BASE_MYKILLERS;

  else if (this.grandparentNode && move == this.grandparentNode.killer1)
    this.ranks[n] = BASE_GPKILLERS + 1;

  else if (this.grandparentNode && move == this.grandparentNode.killer2)
    this.ranks[n] = BASE_GPKILLERS;

  else
    this.ranks[n] = this.slideBase(move);
}

//}}}
//{{{  .slideBase

lozNode.prototype.slideBase = function (move) {

    var to      = (move & MOVE_TO_MASK)    >>> MOVE_TO_BITS;
    var fr      = (move & MOVE_FR_MASK)    >>> MOVE_FR_BITS;
    var frObj   = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;
    var frPiece = frObj & PIECE_MASK;
    var frCol   = frObj & COLOR_MASK;

    if (frCol == WHITE) {
      var pst = WM_PST[frPiece];
      var his = this.board.wHistory[frPiece][to];
    }
    else {
      var pst = BM_PST[frPiece];
      var his = this.board.bHistory[frPiece][to];
    }

    if (!his)
      return BASE_PSTSLIDE + pst[to] - pst[fr];

    else
      return BASE_HISSLIDE + his;
}

//}}}
//{{{  .addCastle

lozNode.prototype.addCastle = function (move) {

  var n = this.numMoves++;

  this.moves[n] = move;

  if (move == this.hashMove)
    this.ranks[n] = BASE_HASH;

  else if (move == this.mateKiller)
    this.ranks[n] = BASE_MATEKILLER;

  else if (move == this.killer1)
    this.ranks[n] = BASE_MYKILLERS + 1;

  else if (move == this.killer2)
    this.ranks[n] = BASE_MYKILLERS;

  else if (this.grandparentNode && move == this.grandparentNode.killer1)
    this.ranks[n] = BASE_GPKILLERS + 1;

  else if (this.grandparentNode && move == this.grandparentNode.killer2)
    this.ranks[n] = BASE_GPKILLERS;

  else
    this.ranks[n] = BASE_CASTLING;
}

//}}}
//{{{  .addCapture

lozNode.prototype.addCapture = function (move) {

  var n = this.numMoves++;

  this.moves[n] = move;

  if (move == this.hashMove)
    this.ranks[n] = BASE_HASH;

  else {

    var victim = RANK_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK];
    var attack = RANK_VECTOR[((move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS) & PIECE_MASK];

    if (victim > attack)
      this.ranks[n] = BASE_GOODTAKES + victim * 64 - attack;

    else if (victim == attack)
      this.ranks[n] = BASE_EVENTAKES + victim * 64 - attack;

    else {

      if (move == this.mateKiller)
        this.ranks[n] = BASE_MATEKILLER;

      else if (move == this.killer1)
        this.ranks[n] = BASE_MYKILLERS + 1;

      else if (move == this.killer2)
        this.ranks[n] = BASE_MYKILLERS;

      else if (this.grandparentNode && move == this.grandparentNode.killer1)
        this.ranks[n] = BASE_GPKILLERS + 1;

      else if (this.grandparentNode && move == this.grandparentNode.killer2)
        this.ranks[n] = BASE_GPKILLERS;

      else
        this.ranks[n] = BASE_BADTAKES  + victim * 64 - attack;
    }
  }
}

//}}}
//{{{  .addPromotion

lozNode.prototype.addPromotion = function (move) {

  var n = 0;

  n             = this.numMoves++;
  this.moves[n] = move | QPRO;
  if ((move | QPRO) == this.hashMove)
    this.ranks[n] = BASE_HASH;
  else
    this.ranks[n] = BASE_PROMOTES + QUEEN;

  n             = this.numMoves++;
  this.moves[n] = move | RPRO;
  if ((move | RPRO) == this.hashMove)
    this.ranks[n] = BASE_HASH;
  else
    this.ranks[n] = BASE_PROMOTES + ROOK;

  n             = this.numMoves++;
  this.moves[n] = move | BPRO;
  if ((move | BPRO) == this.hashMove)
    this.ranks[n] = BASE_HASH;
  else
    this.ranks[n] = BASE_PROMOTES + BISHOP;

  n             = this.numMoves++;
  this.moves[n] = move | NPRO;
  if ((move | NPRO) == this.hashMove)
    this.ranks[n] = BASE_HASH;
  else
    this.ranks[n] = BASE_PROMOTES + KNIGHT;
}

//}}}
//{{{  .addEPTake

lozNode.prototype.addEPTake = function (move) {

  var n = this.numMoves++;

  this.moves[n] = move | MOVE_EPTAKE_MASK;

  if ((move | MOVE_EPTAKE_MASK) == this.hashMove)
    this.ranks[n] = BASE_HASH;
  else
    this.ranks[n] = BASE_EPTAKES;
}

//}}}
//{{{  .addQMove

lozNode.prototype.addQMove = function (move) {

  var n = this.numMoves++;

  this.moves[n] = move;

  if (move & MOVE_PROMOTE_MASK)
    this.ranks[n] = BASE_PROMOTES + ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS); // QRBN.

  else if (move & MOVE_EPTAKE_MASK)
    this.ranks[n] = BASE_EPTAKES;

  else {
    var victim = RANK_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK];
    var attack = RANK_VECTOR[((move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS) & PIECE_MASK];

    if (victim > attack)
      this.ranks[n] = BASE_GOODTAKES + victim * 64 - attack;

    else if (victim == attack)
      this.ranks[n] = BASE_EVENTAKES + victim * 64 - attack;

    else
      this.ranks[n] = BASE_BADTAKES + victim * 64 - attack;
  }
}

//}}}
//{{{  .addQPromotion

lozNode.prototype.addQPromotion = function (move) {

  this.addQMove (move | (QUEEN-2)  << MOVE_PROMAS_BITS);
  this.addQMove (move | (ROOK-2)   << MOVE_PROMAS_BITS);
  this.addQMove (move | (BISHOP-2) << MOVE_PROMAS_BITS);
  this.addQMove (move | (KNIGHT-2) << MOVE_PROMAS_BITS);
}

//}}}
//{{{  .addKiller

lozNode.prototype.addKiller = function (score, move) {

  if (move == this.hashMove)
    return;

  if (move & (MOVE_EPTAKE_MASK | MOVE_PROMOTE_MASK))
    return;  // before killers in move ordering.

  if (move & MOVE_TOOBJ_MASK) {

    var victim = RANK_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK];
    var attack = RANK_VECTOR[((move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS) & PIECE_MASK];

    if (victim >= attack)
      return; // before killers in move ordering.
  }

  if (score >= MINMATE && score <= MATE) {
    this.mateKiller = move;
    if (this.killer1 == move)
      this.killer1 = 0;
    if (this.killer2 == move)
      this.killer2 = 0;
    return;
  }

  if (this.killer1 == move || this.killer2 == move) {
    return;
  }

  if (this.killer1 == 0) {
    this.killer1 = move;
    return;
  }

  if (this.killer2 == 0) {
    this.killer2 = move;
    return;
  }

  var tmp      = this.killer1;
  this.killer1 = move;
  this.killer2 = tmp;
}

//}}}

//}}}
//{{{  lozStats class

//{{{  lozStats

function lozStats () {
}

//}}}
//{{{  .init

lozStats.prototype.init = function () {

  this.startTime = Date.now();
  this.splitTime = 0;
  this.nodes     = 0;  // per analysis
  this.ply       = 0;  // current ID root ply
  this.splits    = 0;
  this.moveTime  = 0;
  this.maxNodes  = 0;
  this.timeOut   = 0;
  this.selDepth  = 0;
  this.bestMove  = 0;
}

//}}}
//{{{  .lazyUpdate

lozStats.prototype.lazyUpdate = function () {

  this.checkTime();

  if (Date.now() - this.splitTime > UILAG) {
    this.splits++;
    this.update();
    this.splitTime = Date.now();
  }
}

//}}}
//{{{  .checkTime

lozStats.prototype.checkTime = function () {

  if (this.moveTime > 0 && ((Date.now() - this.startTime) > this.moveTime))
    this.timeOut = 1;

  if (this.maxNodes > 0 && this.nodes >= this.maxNodes)
    this.timeOut = 1;
}

//}}}
//{{{  .nodeStr

lozStats.prototype.nodeStr = function () {

  var tim = Date.now() - this.startTime;
  var nps = (this.nodes * 1000) / tim | 0;

  return 'nodes ' + this.nodes + ' time ' + tim + ' nps ' + nps;
}

//}}}
//{{{  .update

lozStats.prototype.update = function () {

  var tim = Date.now() - this.startTime;
  var nps = (this.nodes * 1000) / tim | 0;

  if (!LICHESS)
    lozza.uci.send('info',this.nodeStr());
}

//}}}
//{{{  .stop

lozStats.prototype.stop = function () {

  this.stopTime  = Date.now();
  this.time      = this.stopTime - this.startTime;
  this.timeSec   = myround(this.time / 100) / 10;
  this.nodesMega = myround(this.nodes / 100000) / 10;
}

//}}}

//}}}
//{{{  lozUCI class

//{{{  lozUCI

function lozUCI () {

  this.message   = '';
  this.tokens    = [];
  this.command   = '';
  this.spec      = {};
  this.debugging = false;
  this.nodefs    = 0;
  this.numMoves  = 0;

  this.options = {};
}

//}}}
//{{{  .post

lozUCI.prototype.post = function (s) {

  if (lozzaHost == HOST_NODEJS)
    this.nodefs.writeSync(1, s + '\n');

  else if (lozzaHost == HOST_WEB)
    postMessage(s);

  else
    console.log(s);
}

//}}}
//{{{  .send

lozUCI.prototype.send = function () {

  var s = '';

  for (var i = 0; i < arguments.length; i++)
    s += arguments[i] + ' ';

  this.post(s);
}

//}}}
//{{{  .debug

lozUCI.prototype.debug = function () {

  if (!this.debugging)
    return;

  var s = '';

  for (var i = 0; i < arguments.length; i++)
    s += arguments[i] + ' ';

  s = s.trim();

  if (s)
    this.post('info string debug ' + this.spec.id + ' ' + s);
  else
    this.post('info string debug ');
}

//}}}
//{{{  .getInt

lozUCI.prototype.getInt = function (key, def) {

  for (var i=0; i < this.tokens.length; i++)
    if (this.tokens[i] == key)
      if (i < this.tokens.length - 1)
        return parseInt(this.tokens[i+1]);

  return def;
}

//}}}
//{{{  .getStr

lozUCI.prototype.getStr = function (key, def) {

  for (var i=0; i < this.tokens.length; i++)
    if (this.tokens[i] == key)
      if (i < this.tokens.length - 1)
        return this.tokens[i+1];

  return def;
}

//}}}
//{{{  .getArr

lozUCI.prototype.getArr = function (key, to) {

  var lo = 0;
  var hi = 0;

  for (var i=0; i < this.tokens.length; i++) {
    if (this.tokens[i] == key) {
      lo = i + 1;  //assumes at least one item
      hi = lo;
      for (var j=lo; j < this.tokens.length; j++) {
        if (this.tokens[j] == to)
          break;
        hi = j;
      }
    }
  }

  return {lo:lo, hi:hi};
}

//}}}
//{{{  .onmessage

onmessage = function(e) {

  var uci = lozza.uci;

  uci.messageList = e.data.split('\n');

  for (var messageNum=0; messageNum < uci.messageList.length; messageNum++ ) {

    uci.message = uci.messageList[messageNum].replace(/(\r\n|\n|\r)/gm,"");
    uci.message = uci.message.trim();
    uci.message = uci.message.replace(/\s+/g,' ');

    uci.tokens  = uci.message.split(' ');
    uci.command = uci.tokens[0];

    if (!uci.command)
      continue;

    //{{{  shorthand
    
    if (uci.command == 'u')
      uci.command = 'ucinewgame';
    
    if (uci.command == 'q')
      uci.command = 'quit';
    
    if (uci.command == 'b')
      uci.command = 'board';
    
    if (uci.command == 'q')
      uci.command = 'quit';
    
    if (uci.command == 'p') {
      uci.command = 'position';
      if (uci.tokens[1] == 's') {
        uci.tokens[1] = 'startpos';
      }
    }
    
    if (uci.command == 'g') {
      uci.command = 'go';
      if (uci.tokens[1] == 'd') {
        uci.tokens[1] = 'depth';
      }
    }
    
    //}}}

    switch (uci.command) {

    case 'position':
      //{{{  position
      
      uci.spec.board    = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
      uci.spec.turn     = 'w';
      uci.spec.rights   = 'KQkq';
      uci.spec.ep       = '-';
      uci.spec.hmc      = 0;
      uci.spec.fmc      = 1;
      uci.spec.id       = '';
      
      var arr = uci.getArr('fen','moves');
      
      if (arr.lo > 0) { // handle partial FENs
        if (arr.lo <= arr.hi) uci.spec.board  =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) uci.spec.turn   =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) uci.spec.rights =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) uci.spec.ep     =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) uci.spec.hmc    = parseInt(uci.tokens[arr.lo]); arr.lo++;
        if (arr.lo <= arr.hi) uci.spec.fmc    = parseInt(uci.tokens[arr.lo]); arr.lo++;
      }
      
      uci.spec.moves = [];
      
      var arr = uci.getArr('moves','fen');
      
      if (arr.lo > 0) {
        for (var i=arr.lo; i <= arr.hi; i++)
          uci.spec.moves.push(uci.tokens[i]);
      }
      
      lozza.position();
      
      break;
      
      //}}}

    case 'go':
      //{{{  go
      
      if (!uci.spec.board) {
        uci.send('info string send a position command first and a ucinewgame before that if you need to reset the hash');
        return;
      }
      
      lozza.stats.init();
      
      uci.spec.depth     = uci.getInt('depth',0);
      uci.spec.moveTime  = uci.getInt('movetime',0);
      uci.spec.maxNodes  = uci.getInt('nodes',0);
      uci.spec.wTime     = uci.getInt('wtime',0);
      uci.spec.bTime     = uci.getInt('btime',0);
      uci.spec.wInc      = uci.getInt('winc',0);
      uci.spec.bInc      = uci.getInt('binc',0);
      uci.spec.movesToGo = uci.getInt('movestogo',0);
      
      uci.numMoves++;
      
      lozza.go();
      
      break;
      
      //}}}

    case 'ucinewgame':
      //{{{  ucinewgame
      
      lozza.newGameInit();
      
      break;
      
      //}}}

    case 'quit':
      //{{{  quit
      
      if (lozzaHost == HOST_NODEJS)
        process.exit();
      else
        close();
      
      break;
      
      //}}}

    case 'stop':
      //{{{  stop
      //
      // This will have no effect. To stop an analysis or long move
      // the worker must be killed. It's just the way Javascript works.
      //
      
      lozza.stats.timeOut = 1;
      
      break;
      
      //}}}

    case 'debug':
      //{{{  debug
      
      if (uci.getStr('debug','off') == 'on')
        uci.debugging = true;
      else
        uci.debugging = false;
      
      break;
      
      //}}}

    case 'uci':
      //{{{  uci
      
      if (LICHESS) {
        console.log('id name Lozza',BUILD);
        console.log('id author Colin Jenkins');
        console.log('uciok');
      }
      else {
        uci.send('id name Lozza',BUILD);
        uci.send('id author Colin Jenkins');
        uci.send('uciok');
      }
      
      break;
      
      //}}}

    case 'isready':
      //{{{  isready
      
      if (LICHESS)
        console.log('readyok');
      else
        uci.send('readyok');
      
      break;
      
      //}}}

    case 'setoption':
      //{{{  setoption
      
      var key = uci.getStr('name');
      var val = uci.getStr('value');
      
      uci.options[key] = val;
      
      break;
      
      //}}}

    case 'ping':
      //{{{  ping
      
      uci.send('info string Lozza build',BUILD,HOSTS[lozzaHost],'is alive');
      
      break;
      
      //}}}

    case 'id':
      //{{{  id
      
      uci.spec.id = uci.tokens[1];
      
      break;
      
      //}}}

    case 'perft':
      //{{{  perft
      
      uci.spec.depth = uci.getInt('depth',0);
      uci.spec.moves = uci.getInt('moves',0);
      uci.spec.inner = uci.getInt('inner',0);
      
      lozza.perft();
      
      break;
      
      //}}}

    case 'eval':
      //{{{  eval
      
      lozza.board.verbose = true;
      lozza.board.evaluate(lozza.board.turn);
      //lozza.board.evaluate(lozza.board.turn);  //  uses pawn hash.
      lozza.board.verbose = false;
      
      break;
      
      //}}}

    case 'board':
      //{{{  board
      
      uci.send('board',lozza.board.fen());
      
      break;
      
      //}}}

    default:
      //{{{  ?
      
      if (!LICHESS)
        uci.send('info string','unknown command',uci.command);
      
      break;
      
      //}}}
    }
  }
}

//}}}

//}}}

var lozza         = new lozChess()
lozza.board.lozza = lozza;

//{{{  node interface

if (lozzaHost == HOST_NODEJS) {

  var USERESUME = parseFloat(process.version.substring(1)) > 9;

  lozza.uci.nodefs = require('fs');

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (USERESUME)
      process.stdin.resume();
    if (chunk !== null) {
      onmessage({data: chunk});
    }
  });

  process.stdin.on('end', function() {
    process.exit();
  });
}

//}}}
//{{{  sanity checks
//
// Removed on release.
//

for (var i=0; i < WS_PST.length; i++) {                           // ##ifdef
  var wpst = WS_PST[i];                                           // ##ifdef
  var bpst = BS_PST[i];                                           // ##ifdef
  if (wpst.length != 144)                                         // ##ifdef
    console.log('ws pst len err',i);                              // ##ifdef
  if (bpst.length != 144)                                         // ##ifdef
    console.log('bs pst len err',i);                              // ##ifdef
  for (var j=0; j < wpst.length; j++) {                           // ##ifdef
    if (wpst[j] != bpst[wbmap(j)])                                // ##ifdef
      console.log('s pst err',i,j,wpst[j],bpst[wbmap(j)]);        // ##ifdef
  }                                                               // ##ifdef
}                                                                 // ##ifdef
                                                                  // ##ifdef
for (var i=0; i < WE_PST.length; i++) {                           // ##ifdef
  var wpst = WE_PST[i];                                           // ##ifdef
  var bpst = BE_PST[i];                                           // ##ifdef
  if (wpst.length != 144)                                         // ##ifdef
    console.log('we pst len err',i);                              // ##ifdef
  if (bpst.length != 144)                                         // ##ifdef
    console.log('be pst len err',i);                              // ##ifdef
  for (var j=0; j < wpst.length; j++) {                           // ##ifdef
    if (wpst[j] != bpst[wbmap(j)])                                // ##ifdef
      console.log('e pst err',i,j,wpst[j],bpst[wbmap(j)]);        // ##ifdef
  }                                                               // ##ifdef
}                                                                 // ##ifdef
                                                                  // ##ifdef
if (WOUTPOST.length != 144)                                       // ##ifdef
  console.log('w outpost len err',i);                             // ##ifdef
if (BOUTPOST.length != 144)                                       // ##ifdef
  console.log('b outpost len err',i);                             // ##ifdef
for (var j=0; j < WOUTPOST.length; j++) {                         // ##ifdef
  if (WOUTPOST[j] != BOUTPOST[wbmap(j)])                          // ##ifdef
    console.log('outpost err',j,WOUTPOST[j],BOUTPOST[wbmap(j)]);  // ##ifdef
}                                                                 // ##ifdef
                                                                  // ##ifdef
for (var i=0; i < 144; i++) {                                     // ##ifdef
  for (var j=0; j < 144; j++) {                                   // ##ifdef
    if (WKZONES[i][j] != BKZONES[wbmap(i)][wbmap(j)])             // ##ifdef
      console.log('kzones err',i,j,WKZONES[i][j],BKZONES[i][j]);  // ##ifdef
  }                                                               // ##ifdef
}                                                                 // ##ifdef
                                                                  // ##ifdef
if (EV.length != 66)                                              // ##ifdef
  console.log('ev len',EV.length,66);                             // ##ifdef
                                                                  // ##ifdef
onmessage({data: 'u\np s\nb'});                                   // ##ifdef

//}}}

