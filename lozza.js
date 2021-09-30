//
// https://github.com/op12no2/lozza
//
// A hand-coded Javascript chess engine inspired by Fabien Letouzey's Fruit 2.1.
//

var BUILD = "2.1";

//{{{  history
/*

2.1 30/09/21 Add network.
2.1 27/09/21 Set mob offsets to 0 while buggy.

2.0 19/02/21 Add imbalance terms when no pawns.
2.0 17/02/21 Tune all eval params.
2.0 16/02/21 Swap mate and draw testing order in search.
2.0 12/02/21 Do LMR earlier.
2.0 11/02/21 Add draft bench command.
2.0 10/02/21 Use pre generated random numbers using https://github.com/davidbau/seedrandom.
2.0 10/02/21 Use depth^3 (>=beta), depth^2 (>=alpha) and -depth  (< alpha) for history.
2.0 09/02/21 Add -ve history scores for moves < alpha.
2.0 08/02/21 Don't do LMP in a pvNode. We need a move!
2.0 07/02/21 Don't _try and reduce when in check (optimisation).
2.0 06/02/21 Remove support for jsUCI.
2.0 23/01/21 Tune piece values and PSTs.
2.0 10/01/21 Rearrange eval params so they can be tuned.
2.0 03/01/21 Simplify phase and eval calc.

1.18 Don't pseudo-move king adjacent to king.
1.18 Fix black king endgame PST.
1.18 Fix tapered eval calc.
1.18 Fix alpha/beta mate predicates.
1.18 Fix trapped knights bug (thanks Tamas).
1.18 Fix hash table put bug.
1.18 Add depth element to LMR.
1.18 Increase pruning.
1.18 Remove alpha TT saves in move loop.
1.18 Better tempo.
1.18 Better king safety.
1.18 Better passed pawn eval.
1.18 Fix TC.

1.17 Min move time of 10ms.
1.17 Change futility to depth <= 4 (from 5).
1.17 Use TT at root.
1.17 Increase LMR a bit.
1.17 Add eval tempo back in.
1.17 Remove phase from extend expression.
1.17 R=3 always in NMP.

1.16 Rearrange eval to be based on parts of the Toga User Manual (i.e. Fruit 2.1).
1.16 Send node count back when PV is updated.
1.16 Include non capture promotions in QS.
1.16 Fix unstoppable passer WRT hash (using king squares and turn).
1.16 Fix unstoppable passer values.
1.16 Improve pawn eval.
1.16 Fix bug with futility/LMR else/if.
1.16 Remove tempo from eval.
1.16 Only score knight outputs if isolated from enemy pawns.
1.16 Use fail soft in QS.
1.16 Don't return from QSearch root if in check.
1.16 Reduce futility severity.
1.16 Add king attacks and knight outposts to eval and tidy eval up a bit..
1.16 Don't prune killers!
1.16 Use bits for pawn eval.

1.15 Fix move rank overflow.
1.15 add SQ* constants.
1.15 change futility to 50.
1.15 increase history range.
1.15 Add R|Q on 7th bonus.
1.15 Change futility to 60.
1.15 Change queen to 1000.
1.15 Jiggle what is and isn't predicated on mate scores.
1.15 Add # to PV if mate score.
1.15 Fix queening SAN format.
1.15 Dump arbitrary passed bonuses.
1.15 Dump Connectivity PSTs. They were making passed pawns stop.
1.15 Use a passed pawn PST based on Fruit curve.
1.15 Change PVS condition to !bestMove from numLegalMoves == 1.
1.15 Use Fruit 2.1 piece PSTs.
1.15 Add && !betaMate to futility condition.
1.15 Don't do root Q futility.
1.15 Change double time from 5 to 3 moves after opening.
1.15 Fix +inc time control.
1.15 Add some typed arrays to help V8.
1.15 Tweaks to stop some V8 deoptimising.
1.15 Don't call eval if in check in alphabeta().
1.15 Speed up Q move gen.
1.15 Speed up move gen.
1.15 Speed up mobility;
1.15 Speed up isAttacked();

1.14 Add massive bonus for pawn-supported pawn on 7th rank.
1.14 Don't futility away pawn pushes to 6th rank.
1.14 Fix how PV is displayed WRT hash loops.
1.14 Send node info with PV for ChessGUI, fix hashUsed info.
1.14 Redo how host is detected.
1.14 Add time when fail low at root.
1.14 Add time for first 5 moves after opening.
1.14 Be less confident about time left as number of moves increases.
1.14 Fix time control for increments.
1.14 Reset the stats on the go command.
1.14 Get synchronous PV working with node.js on Windows.
1.14 Check for draws before anything else.
1.14 Don't assume hash move is legal.
1.14 Use |0 as needed and don't use Math.floor() or Math.round() in critical places.
1.14 Remove alphaMate stuff.
1.14 Don't make beta pruning and null move dependent on betaMate.
1.13 Add support for node.js allowing Lozza to run on any platform that supports node.js.
1.13 Send stats back to host early to reset counters.
1.13 Use O not 0 for castling to avoid potential expression confusion.

1.12 Add untuned mobility to eval.
1.12 Tweak King safety.
1.12 Enable LMP now we're using history for move ordering.
1.12 Remove ugly castling running eval in makeMove.
1.12 Increase LMR because of history based move ordering.
1.12 Use history (and PSTs if no history) for move ordering.

1.11 No null move if lone king.
1.11 Change to always write TT, no exceptions.
1.11 Make a micro adjustment to the way Zobrist randoms are generated.
1.11 Implement UCI info hashfull.

1.10 Fix occasional null PVs.
1.10 Fix promotion not being allowed by the web UI.
1.10 Add board, stop, start, clear, id, ping & eval to UCI console.
1.10 Add verbose option to evaluate.

1.9 Add late move pruning.
1.9 Rearrange things a bit.

1.8 Untuned isolated pawns.
1.8 Add pawn hash.
1.8 Use ply (not whole moves) for UCI mate scores.
1.8 Fix bug with best move sometimes being the wrong one because of a timeout.

1.7 Fix LMR condition in root search.
1.7 Untuned beta pruning.
1.7 Untuned passed/doubled pawns.
1.7 Untuned king safety.

1.6 Use end game PSTs for move ordering.
1.6 Only do futility if depth <= 5.
1.6 Check for illegal position by detecting 0 moves at root.
1.6 Fix UCI "mate" score.
1.6 More traditional extension/reduction arrangement.

1.5 Tweak LMR constants.

1.4 Better castling rights update.
1.4 Change futility thresholds.

1.3 Never futility away all moves; do at least one.
1.3 Tweak time controls.

1.2 Point nodes at board so global lookup not needed.
1.2 Add piece lists.

1.1 50 move draw rule.
1.1 Add K+B|N v K+B|N as insufficient material in eval.

1.0 Only reset TT on UCINEWGAME command.  Seems to work OK at last.

0.9 Encode mate scores for UI.
0.9 Use separate PSTs for move ordering.

0.8 use simple arrays for piece counts and add colour counts.
0.8 Split runningEval into runningEvalS and runningEval E and combine in evaluate();
0.8 Inline various functions.

0.7 Fix repetition detection at last.

0.6 Base LMR on the move base.
0.6 Just use > alpha for LMR research.
0.6 Fix hash update bugs.
0.6 move mate distance and rep check tests to pre horizon.
0.6 Only extend at root and if depth below horizon.
0.6 Remove lone king stuff.

0.5 Mate distance pruning.
0.5 No LMR if lone king.

0.4 No null move if a lone king on the board.
0.4 Add detection of insufficient material draws.
0.4 Add very primitive king safety to eval.
0.4 Change pCounts into wCount and bCount.
0.4 Set contempt to 0.
0.4 Fix fail soft QS bug on beta cut.

0.3 Facilitate N messages in one UCI message string.
0.3 Fix bug where search() and alphabeta() returned -INFINITY instead of oAlpha.
0.3 Adjust MATE score in TT etc.

0.2 Allow futility to filter all moves and return oAlpha in that case.
0.2 Fix infinite loops when showing PV.
0.2 Fix mate killer addition condition.
0.2 Generalise bishop counting using board.pCounts.
0.2 Don't allow a killer to be the (current) hash.
0.2 Don't research ALL node LMR fails unless R is set!
0.2 Arrange things so that QS doesn't use or affect node killers/hashes etc.  In tests it's less nodes.
0.2 Increase asp window and add time on ID research.
0.2 Add crude bishop pair bonus imp.  NB: updating a piece count array using a[i]++ and a[i]-- was too slow!!
0.2 Use tapered PSTs.

0.1 Fix bug in QS.  It *must not* fail soft.

*/

//}}}
//{{{  detect host

var HOST_WEB     = 0;
var HOST_NODEJS  = 1;
var HOST_CONSOLE = 2;
var HOSTS        = ['Web','Node','Console'];

var lozzaHost = HOST_WEB;

if ((typeof process) != 'undefined')

  lozzaHost = HOST_NODEJS;

else if ((typeof WorkerGlobalScope) == 'undefined')

  lozzaHost = HOST_CONSOLE;

//}}}
//{{{  funcs

//{{{  myround

function myround(x) {
  return Math.sign(x) * Math.round(Math.abs(x));
}

//}}}

//}}}

//{{{  constants

//{{{  ev indexes

var iMOB_NS               = 0;
var iMOB_NE               = 1;
var iMOB_BS               = 2;
var iMOB_BE               = 3;
var iMOB_RS               = 4;
var iMOB_RE               = 5;
var iMOB_QS               = 6;
var iMOB_QE               = 7;
var iATT_N                = 8;
var iATT_B                = 9;
var iATT_R                = 10;
var iATT_Q                = 11;
var iATT_M                = 12;
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
var iTRAPPED              = 30;
var iKING_PENALTY         = 31;
var iPAWN_OFFSET_S        = 32;
var iPAWN_OFFSET_E        = 33;
var iPAWN_MULT_S          = 34;
var iPAWN_MULT_E          = 35;
var iPAWN_PASS_FREE       = 36;
var iPAWN_PASS_UNSTOP     = 37;
var iPAWN_PASS_KING1      = 38;
var iPAWN_PASS_KING2      = 39;
var iMOBOFF_NS            = 40;
var iMOBOFF_NE            = 41;
var iMOBOFF_BS            = 42;
var iMOBOFF_BE            = 43;
var iMOBOFF_RS            = 44;
var iMOBOFF_RE            = 45;
var iTWOBISHOPS_E         = 46;
var iTEMPO_S              = 47;
var iTEMPO_E              = 48;
var iSHELTERM             = 49;

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

var NETH1SIZE = 16;
var NETINSIZE = 768;
var NETINOFF  = 384;

const TTSIZE = 1 << 22;
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

var NETMAP =          [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                       0,   0,   0,   1,   2,   3,   4,   5,   6,   7,   0,   0,
                       0,   0,   8,   9,   10,  11,  12,  13,  14,  15,  0,   0,
                       0,   0,   16,  17,  18,  19,  20,  21,  22,  23,  0,   0,
                       0,   0,   24,  25,  26,  27,  28,  29,  30,  31,  0,   0,
                       0,   0,   32,  33,  34,  35,  36,  37,  38,  39,  0,   0,
                       0,   0,   40,  41,  42,  43,  44,  45,  46,  47,  0,   0,
                       0,   0,   48,  49,  50,  51,  52,  53,  54,  55,  0,   0,
                       0,   0,   56,  57,  58,  59,  60,  61,  62,  63,  0,   0,
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

//{{{  tuned params

var VALUE_VECTOR = [0,100,348,353,540,1054,10000];

var WPAWN_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,33,91,54,81,84,73,28,-28,0,0,0,0,-8,1,15,8,47,63,30,-15,0,0,0,0,-20,4,-11,10,7,3,4,-35,0,0,0,0,-32,-27,-5,4,1,4,-22,-38,0,0,0,0,-26,-24,-9,-10,-5,5,9,-19,0,0,0,0,-36,-18,-34,-24,-40,9,10,-32,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WKNIGHT_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-158,-80,-45,-45,28,-109,-42,-86,0,0,0,0,-71,-40,60,28,9,52,0,-22,0,0,0,0,-41,48,28,55,86,98,56,48,0,0,0,0,1,24,8,35,29,71,26,35,0,0,0,0,-1,18,17,12,29,24,27,5,0,0,0,0,-16,2,16,33,48,24,35,-7,0,0,0,0,-12,-31,3,13,19,28,17,6,0,0,0,0,-104,-5,-28,-12,20,4,-3,-5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WBISHOP_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-48,-11,-111,-65,-45,-66,-5,-16,0,0,0,0,-29,11,-28,-33,17,15,71,-69,0,0,0,0,-26,32,32,17,16,49,33,-3,0,0,0,0,1,6,10,44,25,20,6,1,0,0,0,0,6,13,11,30,30,2,11,18,0,0,0,0,8,27,24,19,27,40,29,21,0,0,0,0,17,28,21,9,16,30,54,9,0,0,0,0,-13,21,13,10,18,12,-15,-3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WROOK_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,27,12,28,30,7,7,21,0,0,0,0,-5,5,25,33,38,36,-13,8,0,0,0,0,-6,2,6,10,-3,17,40,-1,0,0,0,0,-29,-22,3,14,5,20,-20,-30,0,0,0,0,-36,-27,-12,-5,4,-10,3,-30,0,0,0,0,-40,-16,-5,-8,9,0,-3,-29,0,0,0,0,-33,-11,-8,3,9,10,-5,-59,0,0,0,0,-7,-5,6,15,15,12,-29,-8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WQUEEN_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-25,-2,12,5,60,46,50,47,0,0,0,0,-16,-40,-2,11,-24,34,34,47,0,0,0,0,-8,-14,7,-21,21,56,42,50,0,0,0,0,-31,-29,-26,-25,-6,-3,-1,-8,0,0,0,0,-5,-36,-9,-15,-4,-5,-5,-2,0,0,0,0,-19,10,-3,4,9,3,13,7,0,0,0,0,-20,5,18,14,22,27,10,25,0,0,0,0,11,1,8,20,1,0,-12,-33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WKING_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-85,37,15,-17,-88,-64,12,-15,0,0,0,0,32,21,-11,-7,-32,4,-6,-50,0,0,0,0,31,23,22,-50,-14,25,57,-8,0,0,0,0,-10,5,-9,-46,-43,-33,-5,-53,0,0,0,0,-27,28,-25,-58,-56,-35,-22,-54,0,0,0,0,17,27,2,-22,-24,-9,24,-6,0,0,0,0,30,61,24,-29,-8,18,52,42,0,0,0,0,-1,60,42,-29,40,-9,53,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WPAWN_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,9,16,10,30,5,32,40,0,0,0,0,13,10,4,-10,-19,-11,9,13,0,0,0,0,6,-6,-11,-25,-20,-14,-4,3,0,0,0,0,3,-3,-16,-20,-16,-17,-10,-5,0,0,0,0,-9,-10,-16,-12,-8,-12,-20,-15,0,0,0,0,-3,-11,3,-5,14,-5,-16,-16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WKNIGHT_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-61,-57,-25,-44,-44,-46,-80,-113,0,0,0,0,-42,-24,-37,-12,-21,-41,-44,-71,0,0,0,0,-40,-36,-5,-9,-31,-25,-40,-63,0,0,0,0,-32,-15,9,3,11,-12,-16,-37,0,0,0,0,-30,-29,2,10,3,3,-9,-34,0,0,0,0,-37,-15,-12,-4,-8,-14,-34,-36,0,0,0,0,-57,-34,-23,-18,-19,-33,-42,-64,0,0,0,0,-37,-61,-40,-29,-44,-40,-62,-94,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WBISHOP_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-32,-40,-21,-26,-19,-23,-41,-45,0,0,0,0,-22,-30,-18,-27,-27,-24,-38,-27,0,0,0,0,-14,-30,-27,-29,-27,-31,-26,-16,0,0,0,0,-29,-18,-17,-20,-16,-23,-25,-23,0,0,0,0,-32,-26,-15,-14,-26,-18,-33,-36,0,0,0,0,-33,-28,-20,-24,-19,-30,-30,-35,0,0,0,0,-39,-38,-34,-25,-23,-34,-41,-52,0,0,0,0,-43,-33,-38,-29,-33,-32,-30,-35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WROOK_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35,28,34,30,33,30,30,28,0,0,0,0,26,21,18,13,3,16,29,24,0,0,0,0,34,34,29,30,25,21,19,21,0,0,0,0,37,31,35,20,22,25,24,35,0,0,0,0,33,33,31,24,14,18,12,20,0,0,0,0,26,22,12,15,6,9,10,11,0,0,0,0,20,14,15,15,6,6,4,23,0,0,0,0,14,19,16,11,8,11,17,-7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WQUEEN_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-9,27,32,34,32,30,10,28,0,0,0,0,-17,13,21,31,59,30,20,16,0,0,0,0,-10,15,11,69,62,40,39,22,0,0,0,0,26,33,34,58,63,50,66,51,0,0,0,0,-10,42,25,57,35,39,42,30,0,0,0,0,11,-29,18,5,5,23,22,22,0,0,0,0,-17,-25,-24,-13,-12,-23,-40,-32,0,0,0,0,-37,-35,-24,-34,5,-32,-21,-47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WKING_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-135,-64,-32,-52,-27,0,-31,-39,0,0,0,0,-27,-15,-4,0,8,21,0,-4,0,0,0,0,-14,0,-2,7,6,37,28,-2,0,0,0,0,-19,3,9,13,14,23,16,-6,0,0,0,0,-34,-23,6,12,15,10,-5,-19,0,0,0,0,-37,-23,-7,1,4,-1,-14,-26,0,0,0,0,-49,-40,-18,-10,-7,-17,-30,-44,0,0,0,0,-81,-63,-46,-31,-57,-31,-54,-75,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BPAWN_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,-36,-18,-34,-24,-40,9,10,-32,0,0,0,0,-26,-24,-9,-10,-5,5,9,-19,0,0,0,0,-32,-27,-5,4,1,4,-22,-38,0,0,0,0,-20,4,-11,10,7,3,4,-35,0,0,0,0,-8,1,15,8,47,63,30,-15,0,0,0,0,33,91,54,81,84,73,28,-28,0,0,0,0,-15,-5,0,5,5,0,-5,-15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BKNIGHT_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-104,-5,-28,-12,20,4,-3,-5,0,0,0,0,-12,-31,3,13,19,28,17,6,0,0,0,0,-16,2,16,33,48,24,35,-7,0,0,0,0,-1,18,17,12,29,24,27,5,0,0,0,0,1,24,8,35,29,71,26,35,0,0,0,0,-41,48,28,55,86,98,56,48,0,0,0,0,-71,-40,60,28,9,52,0,-22,0,0,0,0,-158,-80,-45,-45,28,-109,-42,-86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BBISHOP_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-13,21,13,10,18,12,-15,-3,0,0,0,0,17,28,21,9,16,30,54,9,0,0,0,0,8,27,24,19,27,40,29,21,0,0,0,0,6,13,11,30,30,2,11,18,0,0,0,0,1,6,10,44,25,20,6,1,0,0,0,0,-26,32,32,17,16,49,33,-3,0,0,0,0,-29,11,-28,-33,17,15,71,-69,0,0,0,0,-48,-11,-111,-65,-45,-66,-5,-16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BROOK_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-7,-5,6,15,15,12,-29,-8,0,0,0,0,-33,-11,-8,3,9,10,-5,-59,0,0,0,0,-40,-16,-5,-8,9,0,-3,-29,0,0,0,0,-36,-27,-12,-5,4,-10,3,-30,0,0,0,0,-29,-22,3,14,5,20,-20,-30,0,0,0,0,-6,2,6,10,-3,17,40,-1,0,0,0,0,-5,5,25,33,38,36,-13,8,0,0,0,0,17,27,12,28,30,7,7,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BQUEEN_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,1,8,20,1,0,-12,-33,0,0,0,0,-20,5,18,14,22,27,10,25,0,0,0,0,-19,10,-3,4,9,3,13,7,0,0,0,0,-5,-36,-9,-15,-4,-5,-5,-2,0,0,0,0,-31,-29,-26,-25,-6,-3,-1,-8,0,0,0,0,-8,-14,7,-21,21,56,42,50,0,0,0,0,-16,-40,-2,11,-24,34,34,47,0,0,0,0,-25,-2,12,5,60,46,50,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BKING_PSTS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,60,42,-29,40,-9,53,29,0,0,0,0,30,61,24,-29,-8,18,52,42,0,0,0,0,17,27,2,-22,-24,-9,24,-6,0,0,0,0,-27,28,-25,-58,-56,-35,-22,-54,0,0,0,0,-10,5,-9,-46,-43,-33,-5,-53,0,0,0,0,31,23,22,-50,-14,25,57,-8,0,0,0,0,32,21,-11,-7,-32,4,-6,-50,0,0,0,0,-85,37,15,-17,-88,-64,12,-15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BPAWN_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-3,-11,3,-5,14,-5,-16,-16,0,0,0,0,-9,-10,-16,-12,-8,-12,-20,-15,0,0,0,0,3,-3,-16,-20,-16,-17,-10,-5,0,0,0,0,6,-6,-11,-25,-20,-14,-4,3,0,0,0,0,13,10,4,-10,-19,-11,9,13,0,0,0,0,6,9,16,10,30,5,32,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BKNIGHT_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-37,-61,-40,-29,-44,-40,-62,-94,0,0,0,0,-57,-34,-23,-18,-19,-33,-42,-64,0,0,0,0,-37,-15,-12,-4,-8,-14,-34,-36,0,0,0,0,-30,-29,2,10,3,3,-9,-34,0,0,0,0,-32,-15,9,3,11,-12,-16,-37,0,0,0,0,-40,-36,-5,-9,-31,-25,-40,-63,0,0,0,0,-42,-24,-37,-12,-21,-41,-44,-71,0,0,0,0,-61,-57,-25,-44,-44,-46,-80,-113,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BBISHOP_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-43,-33,-38,-29,-33,-32,-30,-35,0,0,0,0,-39,-38,-34,-25,-23,-34,-41,-52,0,0,0,0,-33,-28,-20,-24,-19,-30,-30,-35,0,0,0,0,-32,-26,-15,-14,-26,-18,-33,-36,0,0,0,0,-29,-18,-17,-20,-16,-23,-25,-23,0,0,0,0,-14,-30,-27,-29,-27,-31,-26,-16,0,0,0,0,-22,-30,-18,-27,-27,-24,-38,-27,0,0,0,0,-32,-40,-21,-26,-19,-23,-41,-45,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BROOK_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,19,16,11,8,11,17,-7,0,0,0,0,20,14,15,15,6,6,4,23,0,0,0,0,26,22,12,15,6,9,10,11,0,0,0,0,33,33,31,24,14,18,12,20,0,0,0,0,37,31,35,20,22,25,24,35,0,0,0,0,34,34,29,30,25,21,19,21,0,0,0,0,26,21,18,13,3,16,29,24,0,0,0,0,35,28,34,30,33,30,30,28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BQUEEN_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-37,-35,-24,-34,5,-32,-21,-47,0,0,0,0,-17,-25,-24,-13,-12,-23,-40,-32,0,0,0,0,11,-29,18,5,5,23,22,22,0,0,0,0,-10,42,25,57,35,39,42,30,0,0,0,0,26,33,34,58,63,50,66,51,0,0,0,0,-10,15,11,69,62,40,39,22,0,0,0,0,-17,13,21,31,59,30,20,16,0,0,0,0,-9,27,32,34,32,30,10,28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BKING_PSTE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-81,-63,-46,-31,-57,-31,-54,-75,0,0,0,0,-49,-40,-18,-10,-7,-17,-30,-44,0,0,0,0,-37,-23,-7,1,4,-1,-14,-26,0,0,0,0,-34,-23,6,12,15,10,-5,-19,0,0,0,0,-19,3,9,13,14,23,16,-6,0,0,0,0,-14,0,-2,7,6,37,28,-2,0,0,0,0,-27,-15,-4,0,8,21,0,-4,0,0,0,0,-135,-64,-32,-52,-27,0,-31,-39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var WOUTPOST = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,17,14,23,23,23,0,0,0,0,0,0,12,19,28,17,36,46,0,0,0,0,0,0,18,21,21,18,26,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var BOUTPOST = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,21,21,18,26,22,0,0,0,0,0,0,12,19,28,17,36,46,0,0,0,0,0,0,17,17,14,23,23,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var EV = [5,-1,7,2,4,2,2,4,1,1,4,3,21,5,10,13,13,9,9,-3,-1,49,99,23,7,26,18,-1,-3,20,42,7,3,14,56,102,91,793,40,26,0,0,0,0,0,0,61,21,21,2];

var imbalN_S = [-91,1,1,-2,2,-1,0,8,22];

var imbalN_E = [-89,-26,-16,-10,-3,2,15,23,23];

var imbalB_S = [-30,-2,3,2,1,4,4,9,12];

var imbalB_E = [20,-14,-11,-8,-10,-6,-3,-2,14];

var imbalR_S = [32,5,-2,-6,-7,-8,-4,-4,-3];

var imbalR_E = [2,-5,1,3,2,5,8,15,23];

var imbalQ_S = [2,-7,-4,2,2,2,-1,-3,-17];

var imbalQ_E = [-16,-13,-1,-3,-7,-5,0,-4,-7];

var WSHELTER = [0,0,0,7,12,13,36,9,0,28];

var WSTORM = [0,0,0,35,7,4,-8,-1,0,5];

var ATT_W = [0,0.01,0.41999999999999993,0.78,1.11,1.5200000000000005,0.97,0.99];

var PAWN_PASSED = [0,0,0,0,0.1,0.30000000000000004,0.6999999999999998,1.2000000000000126,0];

// bestErr=0.05580612020741582

// last update Tue Feb 16 2021 05:37:57 GMT+0000 (Greenwich Mean Time)

//}}}
//{{{  ev assignments

var MOB_NS               = EV[iMOB_NS];
var MOB_NE               = EV[iMOB_NE];
var MOB_BS               = EV[iMOB_BS];
var MOB_BE               = EV[iMOB_BE];
var MOB_RS               = EV[iMOB_RS];
var MOB_RE               = EV[iMOB_RE];
var MOB_QS               = EV[iMOB_QS];
var MOB_QE               = EV[iMOB_QE];
var ATT_N                = EV[iATT_N];
var ATT_B                = EV[iATT_B];
var ATT_R                = EV[iATT_R];
var ATT_Q                = EV[iATT_Q];
var ATT_M                = EV[iATT_M];
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
var TRAPPED              = EV[iTRAPPED];
var KING_PENALTY         = EV[iKING_PENALTY];
var PAWN_OFFSET_S        = EV[iPAWN_OFFSET_S];
var PAWN_OFFSET_E        = EV[iPAWN_OFFSET_E];
var PAWN_MULT_S          = EV[iPAWN_MULT_S];
var PAWN_MULT_E          = EV[iPAWN_MULT_E];
var PAWN_PASS_FREE       = EV[iPAWN_PASS_FREE];
var PAWN_PASS_UNSTOP     = EV[iPAWN_PASS_UNSTOP];
var PAWN_PASS_KING1      = EV[iPAWN_PASS_KING1];
var PAWN_PASS_KING2      = EV[iPAWN_PASS_KING2];
var MOBOFF_NS            = EV[iMOBOFF_NS];
var MOBOFF_NE            = EV[iMOBOFF_NE];
var MOBOFF_BS            = EV[iMOBOFF_BS];
var MOBOFF_BE            = EV[iMOBOFF_BE];
var MOBOFF_RS            = EV[iMOBOFF_RS];
var MOBOFF_RE            = EV[iMOBOFF_RE];
var TWOBISHOPS_E         = EV[iTWOBISHOPS_E];
var TEMPO_S              = EV[iTEMPO_S];
var TEMPO_E              = EV[iTEMPO_E];
var SHELTERM             = EV[iSHELTERM];

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
        //this.uci.debug('BETA', ply, score, '>=', beta);
      }
      else {
        //this.uci.debug('ALPHA', ply, score, '<=', alpha);
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

  this.uci.send('bestmove',bestMoveStr);
}

//}}}
//{{{  .search

lozChess.prototype.search = function (node, depth, turn, alpha, beta) {

  //{{{  housekeeping
  
  if (!node.childNode) {
    this.uci.debug('S DEPTH');
    this.stats.timeOut = 1;
    return;
  }
  
  //}}}

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
    
    if (this.stats.splits > 3)
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
        
        this.uci.send('info',this.stats.nodeStr(),'depth',this.stats.ply,'seldepth',this.stats.selDepth,'score',units,uciScore,'pv',pvStr);
        this.stats.update();
        
        if (this.stats.splits > 5)
          this.uci.send('info hashfull',myround(1000*board.hashUsed/TTSIZE));
        
        //}}}
      }
      bestScore = score;
      bestMove  = move;
    }
    else
      board.addHistory(-depth, move);
  }

  if (numLegalMoves == 0)
    this.uci.debug('INVALID');

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
    this.uci.debug('AB DEPTH');
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
  
    score = this.qSearch(node, -1, turn, alpha, beta);
  
    return score;
  }
  
  //}}}
  //{{{  try tt
  
  score = board.ttGet(node, depth, alpha, beta);  // sets/clears node.hashMove.
  
  if (score != TTSCORE_UNKNOWN) {
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

    board.makeMove(node,move);

    //{{{  legal?
    
    if (board.isKingAttacked(nextTurn)) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    numLegalMoves++;
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
    
    else if (!inCheck && (doLMP || doLMR || doFutility)) {
    
      givesCheck = board.isKingAttacked(turn);
      keeper     = node.base >= BASE_LMR || (move & KEEPER_MASK) || givesCheck || board.alphaMate(alpha);
    
      if (doLMP && !keeper && numSlides > depth*5) {
    
        board.unmakeMove(node,move);
        node.uncache();
        continue;
      }
    
      if (doFutility && !keeper && numLegalMoves > 1) {
    
        board.unmakeMove(node,move);
        node.uncache();
        continue;
      }
    
      if (doLMR && !keeper && numLegalMoves > 4) {
        R = 1 + depth/5 + numSlides/20 | 0;
      }
    }
    
    //}}}

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

lozChess.prototype.qSearch = function (node, depth, turn, alpha, beta) {

  //{{{  housekeeping
  
  this.stats.checkTime();
  if (this.stats.timeOut)
    return;
  
  //}}}

  var board         = this.board;
  var standPat      = board.evaluate(turn);
  var phase         = board.cleanPhase(board.phase);
  var numLegalMoves = 0;
  var nextTurn      = ~turn & COLOR_MASK;
  var move          = 0;

  //{{{  housekeeping
  
  if (!node.childNode) {
    this.uci.debug('Q DEPTH');
    return standPat;
  }
  
  if (node.ply > this.stats.selDepth)
    this.stats.selDepth = node.ply;
  
  //}}}

  if (depth > -2)
    var inCheck = board.isKingAttacked(nextTurn);
  else
    var inCheck = 0;

  if (!inCheck && standPat >= beta) {
    return standPat;
  }

  if (!inCheck && standPat > alpha)
    alpha = standPat;

  node.cache();

  if (inCheck)
    board.genEvasions(node, turn);
  else
    board.genQMoves(node, turn);

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

    //{{{  futile?
    
    if (!inCheck && phase <= EPHASE && !(move & MOVE_PROMOTE_MASK) && standPat + 200 + VALUE_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK] < alpha) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    var score = -this.qSearch(node.childNode, depth-1, nextTurn, -beta, -alpha);

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
//{{{  lozNetNode class

function lozNetNode () {

  this.sum     = 0;
  this.weights = [];
}

//}}}
//{{{  lozBoard class

//{{{  lozBoard

function lozBoard () {

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

  this.h1 = Array(NETH1SIZE);
  for (var i=0; i < NETH1SIZE; i++)
    this.h1[i] = new lozNetNode;

  this.o1 = new lozNetNode;

  //{{{  network
  
  // data=quiet_labelled.epd
  // last update Thu Sep 30 2021 22:02:29 GMT+0100 (British Summer Time)
  
  this.h1[0].weights = [0.3168321892790926,-0.4229335807586527,0.10421166943712823,-0.8953373935711566,-0.10604668933199424,0.39303941771402773,-0.6621496871926018,-0.7816866612982101,-2.882854337156976,-2.046533261345998,-1.411869388841834,-0.765513531840119,-0.6712788078617742,-0.5293373009867685,-2.140148746520517,-2.1451875712351205,-1.9162724817541141,-2.80091498524064,-1.7881134005428039,-1.7003252919388665,-1.627300815441771,-1.3876683019556153,-2.323078642331249,-1.447821786809113,-1.2966672738627236,-1.6045318276751577,-0.35829941351779765,-1.9088637201641647,-0.8685119522031362,-0.4456263691191352,-0.39357036924366084,-0.8711025141898054,-0.3938798485189661,-0.7544238602949854,-0.7705744509317543,-1.2303775972911717,-1.4036019565089453,-0.999778242516607,-1.8274624701761841,-0.6766971382975969,-1.259885128296552,-1.0156643288317413,-1.2776177156170994,0.17739691050743137,-0.29156777765244135,-1.4197251159518784,-0.8686610800674117,-0.3784344369063472,-1.6932858998656044,-1.7271073207666858,-1.5230629688679564,-1.2181664565463282,-1.0204356813068312,-1.58263326976254,-1.7292581778651028,-1.5828430660796478,-0.7281691561040824,-0.10696935233489979,0.5114852357582871,-0.3144521965047704,-0.1705987485410625,-0.8722893766203796,0.2987401152936844,0.6842022854485239,-2.2467260632431563,-0.6885034442161064,-2.042694439960784,-1.3749251962296642,-0.918257326913439,-0.2921416037934733,-1.3129587259252566,0.2972507582829613,-1.6025942179800263,-1.3348293608564854,-1.526504587539326,-1.7182242626962168,-1.5261384552633575,-1.1010205021976822,-1.430883595710219,-1.0549729144834952,-1.2541581085245137,-1.6610005763100735,-1.4088548585649132,-3.106178121698909,-1.722928133530903,-1.3798976530395424,-1.1685069952622515,-0.859344869121243,-0.8495932630969085,-1.3650003952246565,-2.924369296530056,-2.387016182614627,-2.646177723228116,-1.8126991222790831,-1.1055620923463576,-1.905806878940168,-1.182238900564373,-1.534759327768024,-1.688452611423204,-1.8392499175471353,-2.5646110520179297,-2.2424612842852483,-2.554838485635365,-1.7829713643257306,-1.6831085956096317,-2.2378537807153345,-2.4188667064780285,-2.4428912423540843,-1.809868826600579,-3.1522080899341938,-1.7055433695858995,-1.0199993804996514,-1.6331036158788819,-0.7192020281166693,-1.0458272923115433,-0.9312531817460644,-0.9164380055367665,-2.1807144204863396,-1.3902416495404157,-1.7461479906850321,-0.3284474799409521,-0.5967697433823017,-0.806921586021666,-1.750169507369973,-0.9543871451423321,-1.7164589549704592,-0.5595789690295481,-1.1676652298652619,-0.9132274146231364,-1.1772101157008974,-1.0607752329264029,-0.6175381712073386,-1.7577704428530714,-1.5890201457000868,-1.8347487270794927,-1.2407466645737977,-2.199362245673343,-2.0481353252639978,-2.530457544715582,-1.6475666127468231,-1.4686897285558584,-0.7569110854881285,-1.8176267501221361,-1.8280715165257122,-1.1829510037985578,-1.5049696868945377,-1.60158872684127,-2.2020244739782857,-2.357805188837267,-2.203359649802844,-1.298489429856012,-1.6966228012473408,-1.1203691214247615,-0.825725241891983,-1.2071789200548417,-2.138747028389918,-2.263576263064301,-2.7038770662512572,-1.180291579458265,-2.7001863057255786,-1.7954947493022784,-1.7270737319944944,-1.7588553750608014,-2.520246619124306,-2.795524952329714,-1.0255841744937468,-2.211372145647967,-0.6314169254249524,-0.8401814450389247,-1.3339874383736,-2.5685904128443933,-2.415442250388207,-1.9099016889934295,-1.7327338513600095,-1.720998023524771,-2.161707600872939,-0.5685817887160716,-0.9016180308169222,-1.0709224541248896,-1.2205770361524964,-2.2230911058774283,-1.6855608462987406,-2.5739349115994696,0.06690124852097626,-1.5781917255074205,-2.2683815876218527,-1.3653633608266664,-1.1676757085366092,-2.1128816050126447,-1.8753662392332935,-1.4061232401712505,-1.741869537263455,-2.883125994319043,-2.149445471380215,-3.767948024566922,-2.3369098312965657,-3.1152598956977404,-2.1868050742767395,-1.4697487082591165,-3.160353774606476,-2.7649437970887436,-3.4902188909375,-2.5635259278547093,-3.912623767675303,-3.5191900459325356,-2.9107347793176372,-2.9109309601009237,-1.961809680453334,-2.4911237953788636,-2.9282267163049283,-2.771744438861611,-3.193436661020044,-3.5871362779215854,-3.0408438162055975,-2.15015518707467,-3.38547649200583,-2.3342132705238385,-3.006820021670705,-2.073423118068412,-3.327661247311218,-3.4790877961064726,-2.4971296672993306,-3.431675092444469,-2.615872684370069,-2.9705772103152435,-1.9520895151412492,-2.9283333843793082,-2.4031175210102944,-1.6672400299718164,-2.1339875932101786,-1.6826932872988003,-1.6456519099785751,-1.5596359251715235,-3.520516765252276,-3.0360724570640123,-2.5968862212404438,-1.6891289310250492,-1.6808476307386295,-1.3620780521496032,-2.8580900656010964,-2.410820791667475,-2.3502141314559695,-3.342071284342683,-3.1561727231109193,-3.193207813125629,-2.18507752500961,-1.8179707496666317,-2.3862054183469703,-3.0354883701513096,-1.8565651241426044,-1.9677307076048711,-2.937549342102249,-2.5071587844051955,-3.242186075288116,-2.48043713556894,-3.2601389059830677,-4.362099708494482,-3.7651920758087267,-2.9623699543078863,-4.474218825988604,-3.5922401398190624,-3.218783384325512,-2.5475418285733182,-3.418236362592368,-2.1304141809546957,-3.787492002673319,-3.660079693413671,-3.386257945646272,-2.478520374953321,-2.32981246861093,-3.006383832999173,-2.795729851968949,-3.0370872201706027,-2.9245096084940503,-3.060663081237635,-3.2818674836992954,-4.129632990351436,-2.6119597941297092,-3.4140337801984297,-2.5311716968423292,-2.6987666505774492,-2.810434204392142,-3.761851789894033,-2.8349853053928906,-3.234812834838118,-3.3753306280541153,-3.3079517112168046,-4.555759603942402,-3.5708705617612075,-3.0767373422439066,-2.9638655270243435,-4.439454186405779,-3.7625284980273643,-3.98112768785679,-3.517208590593852,-1.5081859517312213,-2.7013820789850467,-2.7972195939311937,-2.9626968991834417,-4.05975506623972,-3.4459058745548177,-3.8266832397273856,-3.7971553526372177,-2.0370243756198665,-2.7342324101769613,-2.7934642481052676,-4.98295641714042,-4.524132988447131,-4.472094445948813,-2.175467386772364,-1.6115456933711385,-1.7227600267306282,-2.2963706658748935,-2.8861019379125517,-2.362866100542536,-4.09147545830938,-2.5650887735070276,-1.0110246027152756,-2.194889277105619,-1.7238320938422917,0.0014480632804795403,-0.02767879189031405,0.5476668698665309,0.41002771128861626,-0.7171537313250759,0.31470424629200605,0.5959677542493959,0.3029055772299391,-0.43337536025691925,0.3013294302994807,-1.141336566132163,-0.8620385454538257,-0.3391398139437188,-1.0758469146671044,-0.32483012341160805,-0.45913332925416783,-0.017438080545394988,0.791523770302509,-0.9419445724648364,0.2891042722079067,-0.9065461724153038,0.28658406106554324,-0.05937023755612668,0.5768472765533044,0.8180050363320698,-0.19016168081597548,-0.06285152856939412,0.752710174264531,0.38893424458251347,-0.8619575439512591,-0.771252589903262,0.28800362223811776,-0.44419665626258265,0.18706598915892048,1.023586191572088,0.1154582297045552,0.21366994494655878,-0.05779903183778923,0.6489700311231364,0.11694806397189744,-0.4675319986149745,-0.8545061702477101,-0.005585587982271581,0.10062041283891775,-0.4174083605649074,-0.762513097694328,0.6782564476677208,-0.5632721638930922,0.036876719775574995,-0.9074619795884031,0.06278681461888681,0.07710185460711765,-0.21547573076535145,-0.5214808882039744,0.5678825726063339,-0.6020560008304922,0.004834760166731255,-0.569254979311774,0.1068421655777243,0.48422754715172217,0.16932339276668487,0.7824772262469335,-0.32968933306934434,0.5887661142436048,0.00588476569057983,-0.36619708697234143,-0.9673643505168514,0.7318028292158667,0.17000491569349396,-0.1597041749337813,0.9595577759859837,0.07582404549169874,0.7539913065380255,0.6181914842742299,0.6681003114607865,-0.6587625174614707,1.0136217523008997,0.4110635570704346,-0.11822595175842675,0.7300582246700023,0.48216559030354106,0.048330289801980605,1.1548558480394553,0.7759822902388487,-0.3366536916033272,1.3362459516813554,0.9028515798650536,0.9925568308774667,0.11332922936922928,1.6682638471593885,-0.5539734999299547,-0.33003004915314876,1.354582030227008,-0.7071753712647026,-0.04019467600758225,0.8228223180866665,-0.036621049660479625,1.8957938781312271,1.3658982646870432,0.6314158026130918,1.3256015754871437,1.6128539006204898,1.258268748499852,0.3839970219448588,0.9046848421447744,1.9595455774902606,1.2510867355718749,2.06079531300371,1.401247583175603,1.7548440666191352,0.14099591754161903,0.5562564116341697,2.426026637258476,1.5831487713467933,1.1141184541858167,1.6970923753669522,1.7589962743165581,0.6240642668747852,1.3855287651796175,2.2668560583549895,0.9924555085886646,-0.4396605161196332,-0.23372796676785157,-0.8807770806064439,0.08277223241726261,-0.8444522412526898,0.9075475757506766,0.21059143283723092,0.04386745016427942,1.8995043480006684,0.1302860363561216,0.6309711799395716,-0.00201144776925622,1.1423524839499895,1.302043474938891,-0.2914867053230096,1.1878397068665063,2.0469733707829114,0.046001355866646616,1.1296614611453717,1.3794215958091307,0.8005415833517051,0.9213493915437562,0.7490118438774934,-0.4532767872396753,2.2006711220647106,1.527592167860329,0.5210105937053915,1.9617602897882895,2.0601901840046555,1.752214844250245,0.631930463165075,0.3556397068800506,1.8932098892318585,2.389597618764037,2.7664081988547142,2.94550263277732,1.4220403091640388,2.404915529467373,0.21714049748791447,1.901500002935989,2.406575488503633,1.9532574432478693,2.5726420759681448,2.334101614445921,2.7114536401682066,2.387077306001841,0.869333410672161,0.9741384954158794,1.7696089721708763,2.002918195582121,1.9065824957847157,2.0378320082158994,2.2018851860033646,0.9345270292998445,1.5726071588883623,0.46377312844860197,1.1888121903800042,2.283677572442893,2.3539147784715615,1.9350815274653506,1.3216643429005328,1.5552411875349792,-0.3491330174429421,1.730432367369123,0.8170984938197368,2.0990233055161647,1.074047821556894,1.2957921354987842,1.0158419488767445,1.1232083840683724,0.9821575370161639,0.9574859108465448,1.279686074238456,0.4952264661830373,2.358617209320212,1.8700279559076243,0.8233067192797977,0.6101129396764263,0.5093922852744669,1.4983130780644875,1.9957247190308929,0.9713651982212956,2.8512674851740316,1.613314685320156,2.302806490242282,1.7717292162987823,1.6239663824986328,2.6721209819245924,1.6535643252275123,1.0307461203382158,3.3477409921905186,2.686348817894051,1.9787784597133211,2.098493556916483,0.5185205173870584,1.980134441420423,1.6054130799207809,1.9547564812780742,1.565231654855354,2.147231999220023,1.7938115359012272,2.248536938372316,1.7763246549701774,1.4246072126145286,2.077604750199131,2.3194697328676073,0.6053435344641555,1.179470559341451,1.7572717295046045,2.3236056538225385,0.6143305749637251,1.8058049368731333,2.8479806959902834,1.088274886526429,1.9781937453723664,2.10241303877324,1.202324308937941,1.3866962076523537,1.6714539858640591,0.7832148342880877,1.8683816062129686,1.0194255404076031,1.7477098062515892,1.6694802545529317,1.3760019116495679,1.9157929910388802,1.894688817839064,0.7287759646062328,1.9874220407398455,1.556066701845479,0.7668024885368432,1.6286280528402002,1.528853621102727,0.9969115287236135,0.43850851805755603,3.5887574338959896,2.60886626612967,1.9032972346428658,3.5668334907632406,2.515062624343901,1.9908989977601157,1.905368768647728,1.7095651086519665,2.5752024142631873,3.402128230685747,2.259378521573686,2.3556287050068323,2.873377149221058,1.3933303296070771,3.068511337600718,1.2141696231051162,2.264541595649467,2.3445414724883262,1.3286184444969527,3.1076269232227602,1.9682326958525187,1.450802880241505,2.9728512010059336,1.3366834246254216,3.466436071019661,3.6391136737174277,2.7675578502423606,2.1317979111754415,2.876709308437546,2.301427815541792,2.1108815693832574,3.4834005800419257,3.1191690097715923,2.7706540713377557,3.4202186290018863,2.8986099231655342,2.708807474098175,1.6767390143189531,1.9883710364570502,3.267454420686039,2.4452210101915206,3.582806258366687,3.4151125815311985,3.3115980216358465,4.004394657044681,2.451814085917602,2.82448146835867,1.7228709162541263,2.7544019865243707,3.4212814659856927,2.8105241057025774,3.407235181830503,2.3080979059395337,3.0897635853515357,3.530151500843429,2.0204838510969427,3.729071757781305,1.5852323088624298,2.266209109354599,2.6450466586508665,3.33708098726433,2.019455319192408,2.162196708718556,1.9711839286158386,2.123037879129546,1.8991084067937927,3.6533429855613377,4.077422145491085,2.861376987191828,2.749880719149307,2.3158729574433,1.4369686733238713,2.5589817878621415,3.152525984989821,3.233776280045153,2.7429037596207824,4.1009897083028815,3.340761628768684,1.8050305287975328,2.1742191620205698,2.806557189712433,3.466211279810873,3.164539472937713,3.4217364820704326,2.2609107199382072,3.129153151681823,2.955286563509164,2.5723838369659875,3.749703935389867,4.029756402881888,4.358015278018091,4.089668926928167,3.3657027949112592,2.8664336303490505,3.1913955896501145,2.7134699521047074,3.3693026821352303,3.402189796410485,3.0069622760590753,3.2198770344341012,2.5901141001576424,2.4738222915055412,2.727308025908096,2.6259705076851314,2.2405338986465018,2.8225763670447237,4.022801891192611,3.3573035680319987,3.771516047013374,4.038521870402599,2.2029528095246524,3.069847769175915,2.3862722780871435,3.975080566567433,3.6442120890610346,2.618196213809834,2.468675805935909,2.815467002964437,3.0503973441302907,3.4746632034635176,3.88603644702431,2.3532142878598346,2.9280011520498315,2.5418263851250207,2.631649297616793,2.520276228042935,3.386940688285611,2.7272280095331105,-1.592960936631626,0.1176428536425426,-1.1406981236653257,-0.24916508906763885,-0.8530393658453922,-0.2716230264589106,0.13963108281148415,-0.5010595835266037,-1.1800050338014094,-0.4329971848491104,-0.6512048917400622,0.5217463916185064,0.230620198651671,-0.7739449709853631,-0.37962748096546,0.0719683357004249,-0.521085317918186,-0.38273150432916514,-0.39780787288574715,-0.49813133733073595,-0.6623701529222652,0.0929614820000379,0.4727369728112803,0.6960869100894045,0.27526812739232714,-1.1346155256817152,-0.5403171444461982,-0.4132752069130223,0.39179931714611654,0.2020905883972844,-0.3809937739658002,-0.19850213336413736,-0.6118109734551991,0.9833924499452252,0.6647486743575121,0.3892603301787899,0.2264608667531709,0.03719584904541865,0.509786364299237,0.4143068976792912,-0.6485479983023735,-0.7695519390903659,1.347372840039052,0.21543731005829087,-0.5042897041083106,-0.41469996090794936,0.2991416505838743,0.39659822267075256,0.5506167439441951,0.6746654015853364,-0.3292773631609628,-0.7312089691416895,0.03567018102736252,-1.0508797979006719,-0.3522406630174732,-0.19993638901162808,-0.8349416137552306,-0.4008515170441565,0.19076585113743563,-0.5327242977633182,0.45275566216312024,-0.12360052042768453,-0.7265016543103912,0.0005331280070041323];
  
  this.h1[1].weights = [0.5735305973740923,0.45436311131910445,0.11605119482230686,-0.45836390401337823,-0.7637844479659552,0.4662899680236765,-0.4434325968071664,0.9708654888375796,2.359873415131394,2.1495700737979164,1.710666039921035,1.060889547564965,1.3584152058097674,0.330939378472372,1.672296784455226,1.9458179968066194,0.6136147016657609,1.6919614141767039,0.4338006907034878,-0.04544778620643377,0.45985247094405446,1.4299742006127891,2.061369567432782,0.7043169317262395,0.29273775890024384,1.1973139638417827,1.3296195713831926,0.6380530969030415,0.36615240305217234,0.3130356098100195,0.24479637056595002,1.038109031078567,0.5047002292974809,1.337881283922007,0.19889245269418446,-0.06954704156595584,0.5588572610687021,1.1419827264768956,1.179951140640468,-0.3316708721264363,0.8386996325680787,0.9812209200732506,-0.12224521219907064,-0.13537653855562318,-0.16317048717193816,0.13510962250239472,0.5681795529571877,0.08593115222581586,0.2602355069280978,0.4336866238482411,-0.45865381873268013,1.0327616401905564,1.1421578892360256,0.6256990946753573,0.5604555086656121,-0.25013982508504584,-0.16485473022551922,-0.18084808478942582,-0.12834085740374457,-0.22452321272544573,-0.03876364990139036,0.1473499635150266,0.9642853911221758,-0.9877089484248671,1.3747111600422381,1.9691790886303457,0.5586523672327487,1.0955630622890211,2.6399375698903267,1.982989839880636,1.0102546855369896,0.48894078200216196,1.3762596251323738,2.244144631361841,1.8761021573677292,2.3069658806818016,1.9951995390836272,1.4426086858935459,1.5365324546533567,1.6574162696534138,1.0449422405171658,1.662240060921546,2.692234362350263,2.8517702915319467,2.516520637315068,1.813512168615828,1.494953206991072,2.149983848998278,1.6776165770869973,2.721778687832986,1.844015074581032,3.427729678565005,1.3668458411079318,2.271676936008925,1.4111235589146938,1.402248582226863,0.7809108341907446,2.8100302802728248,2.7220584026325576,2.6590208800806523,2.8568013805959684,2.693131026722942,2.130388795058444,1.2555992669941485,0.7438160958303385,1.7050515795632197,2.6237720348321867,1.4898744842172085,2.1816485364626077,1.6315070112090215,1.4277106049551025,1.8859165638701545,1.9536115929839528,2.1985449082209563,1.1187805609079553,1.6038677992057506,2.270476091457005,0.9922874059363342,1.0874727722746538,2.624771568609749,1.1019766905643316,1.7688612763229183,1.8146382973201536,1.4061934653615598,2.1792716473953546,0.4453533223660027,2.140624490609608,0.303259274520835,1.7281767296698773,2.258129403671591,1.273824995939589,2.543877231026383,2.2087534098394523,1.9383749240111403,1.1424010554286563,1.4922534966496956,0.9485130146861954,2.438552370300412,2.703272637300111,1.923467165478578,1.7372753465569941,1.3359788185069368,2.7549779019724188,0.5699974357612828,1.715867773022368,1.7419401159676062,2.6555949378327717,2.079390141473207,3.0784769392260016,2.5931346626760114,2.028383326756591,2.1600090932880383,2.313803745475312,1.2132770267642106,2.886270600243872,2.833614693281171,2.2399307314197676,2.5355498434411685,2.646003611207682,2.5293829490416804,3.129671035137827,2.52230417066717,2.268436421936468,1.7389100215666267,2.3578452556259815,2.809360970938858,1.843324732524608,2.164972347928983,2.137819790658898,1.1446233208303058,2.2275176879008085,2.8581821333470017,2.599893758256513,2.47943510649207,2.4407251905199585,2.7039985189698026,2.160547818561799,2.0022846875115756,2.4943722781621296,2.251508619615097,2.48611936647828,1.3413242281066284,1.8085803387681632,0.9254814445922409,0.8217954913190164,0.984275981160526,2.0799845656256704,1.4208698611507227,2.37769613997792,2.289376388908763,0.842201655669842,0.8497011587315055,3.146338093388836,3.173759928873525,4.261568770667064,2.517148916747258,2.7580127771342666,2.7952311583529723,3.6384666483393304,3.3676188358024364,3.6838709414328132,3.2820774307761833,2.30144726818971,3.463027208733844,2.7991320147943286,3.666102193887433,1.981536748042634,3.9307447621394016,2.548369869446598,2.658662335409187,4.0287159818044955,3.9001914163675035,3.601510618092873,2.687037085460287,3.06950156108392,3.2848920542524276,3.853089038329026,3.5457629337675205,3.2109667093273537,4.092948362242323,2.720848893009763,3.8696179501686925,3.4876277253625143,2.46978277926636,2.7162552571353777,2.2895051996905718,3.0672001655738055,2.164178241444407,2.868893698917418,3.630509018353253,3.6103614379968243,2.93444786531218,2.9919168819542286,3.0723706668019153,3.4798228859909663,2.0286204265729917,3.41499216084041,2.6566617085526736,1.8028687234587193,2.4789616807198636,2.5139504278738958,4.246703912283452,3.242681735360794,3.8574130110194935,3.8569805024773753,3.789557185018492,3.4273486177478047,2.14857377321921,2.0405969292166293,3.650730030209108,4.049488318831509,2.911459410575231,3.2140629353280916,3.7666988654779,3.420841289748543,2.43705029375489,3.4438555038808913,3.2932671635724744,4.056185385392041,3.458157605371288,3.38476599276553,3.9949798234571143,3.4881570624992912,3.8178416327684577,3.257255418377956,2.9815578056936536,3.791670133606552,5.13569371460345,4.3469170725371775,4.546358551647605,4.665462359772244,2.4613721353249893,4.028517006466997,3.679833611245337,4.995452215583319,4.8581135932738695,4.838896363581468,4.260376822922331,3.5159248191700856,4.003741232690777,3.977130394098289,3.9230208308202474,3.859266208664633,5.316617830846326,4.515704259009036,5.481766344805479,4.243667850036671,4.192447801013986,4.322261993567234,3.083993278144831,4.8982838206753,5.394202743864338,3.1054331190862308,4.204258346006141,4.617753470189618,3.394713545075798,3.5496998578530943,4.3696792080329026,4.669889495417397,3.539794225422183,3.95285556566479,3.588858369725871,3.0251970207380663,2.7302230451264484,4.094604377802903,4.406237538594654,5.302474842470621,5.1573521404847495,3.5564881514041646,4.888356001176654,2.598058736430762,2.6109166442341487,2.4664836856250405,3.849793281065641,4.229623187738406,5.666215804295315,2.582642218716399,3.052762329553894,2.182661081295911,1.2949147822900793,-0.14399449076513934,0.983343145717931,-0.11234331409245532,0.18292606551330057,0.48981595586102755,0.3443282161275506,1.0634349621707702,-0.46015756282709214,0.2677140373580016,-0.2716832762648721,-0.31729501872177257,-0.5069044292350849,0.24772515409698978,0.9442940625251204,0.3185826532590567,0.3731710979172543,-0.5948205971044155,-0.5933458740793258,-0.09721254737726222,0.08719921445831053,-0.8238796218251978,0.02129937144988762,0.9106506601744763,0.14286909394746666,-0.22354870213263314,0.062204146064948465,0.7460699937294512,-0.16423480312672803,-0.5874658058884938,-0.14440721981917287,-0.484586041246625,-0.704003844786304,0.752047485196007,0.3079724062527873,0.5490340172823982,0.06704917117152334,0.8085297321296736,-0.543886222084375,-0.46108292018500774,-0.26602705868884036,-0.8869322088639667,0.681219902766473,-0.6075329717701986,-0.3762738587951249,0.4263259227033682,-1.0216648165472442,0.3182523813090735,0.18251691763197186,-0.9029731807846086,-0.6975252160387899,-0.10595351711414512,-0.2977590320803106,-0.19914556407271822,-0.07064826632648827,0.9495673413343444,-0.4268563335337685,0.08157979608056525,-0.9449649263623329,-0.7849942688659177,-1.2404616358030198,1.3618873008491494,-0.08488921120001826,-0.8011870687536635,0.22462813748050117,-0.8760320947406361,0.3759925533290116,0.12112121329871739,-0.39798678207905436,-0.6711800316387837,0.15731762650388692,-0.7362533510092506,-0.8177624617697266,-1.9874117711163648,-1.400314446614781,-1.0182502078030913,-1.0615977505880498,-0.22230864949134072,-1.674117617355502,-1.6663946465619166,-0.3260701011244377,-1.0873652402124996,-1.758807114708336,-0.44614213729381297,-1.6564070071172325,0.012829942452935488,-1.0783368799427597,-1.363439282482203,-0.8810302599325973,-0.8493063223211728,-0.7664078268896884,-1.296941714772126,-1.0749447598202626,-1.1308318671281394,-1.4793536369070457,-0.7492630313931269,-1.5919481653501784,-1.808198473300451,-2.0149129961028236,-0.6355484440020035,-1.11941355423182,-0.18520211360147298,-0.939853472968866,-0.7563788660173943,-1.2109003441689319,-0.7443743352888341,-1.7067086340161917,-1.6012253272606078,-2.158886871729254,-0.6021041065252806,-1.558857132921418,-1.8037818227327793,-1.0536674207077772,-1.8506878404103473,-1.2521179804904896,-2.128154478099986,-2.9709843725985516,-1.9435916412659942,-2.410994766719685,-2.107635782378889,-1.7102147430464076,-0.525343229029072,0.7156039125515892,0.14357601592798108,0.7393325784725797,-0.9252580950714688,-0.7076995499914198,-0.9573506921928572,-0.8227738824758459,0.16610875365056824,-1.6162786914842238,-0.4258262638294581,-1.1626353880362694,-1.766652724755176,-1.9270895685756566,-0.8733232454736151,-0.09822152213339004,-1.6548680982251711,-1.8107183984829147,-1.6554680029098638,-2.550086624775867,-1.9057081976358323,-0.7256739147377226,-2.1846237586269237,-1.424109303722692,-1.057934314748004,-1.1812075136231595,-1.884577873569412,-1.2115451888903759,-1.3918248635980366,-1.1938758370880214,-2.7262842481173166,-0.9582855895826803,-1.598426437356079,-1.2108635166239006,-2.517528063700176,-1.6592156559526616,-3.625334189557044,-2.8586056250425633,-1.4577697500016313,-0.8595638152124349,-1.6719633857885798,-1.65696552612493,-2.574337649160026,-3.3598059433354064,-1.8374660400638003,-1.5698959538615826,-2.3482438067114995,-2.4597785450934384,-2.3400027409986768,-1.4703126595451932,-2.7072782851726274,-2.260112496442495,-2.053065401200106,-1.6863180163275069,-2.185603951724069,-0.7071834558828861,-0.6099495534622554,-1.7558541652631487,-3.0070974013070253,-2.9780613535206735,-2.2800489489899594,-2.204548075600803,-1.3532303978664852,-1.2377814601176553,-0.7401447709734073,-1.1592064344714297,-2.455438987219211,-0.9612643087607046,-1.6678610364125641,-1.7549152290211905,-1.8684306902234042,-0.18849003392430427,-1.5894973803146462,-1.1677996448713723,-2.2646374421182633,-1.7586626031228143,-1.2049487482889465,-1.591111281596583,-0.6064966135169688,-0.6920512461585484,-1.896955110177818,-2.138790983687689,-1.2853033980795512,-1.831019305939823,-1.4372916572736056,-2.389791732556751,-2.659376916925897,-1.9782964454919163,-1.3589136808959739,-1.329578204875778,-2.3356747348545093,-2.9758427064822772,-1.8801963111532913,-3.2476456638573254,-2.6555760155683377,-2.53452249191664,-1.9365697110024778,-2.1092522820052686,-1.8753077102475892,-2.498544346257369,-3.2682851666986963,-3.1064515436299787,-1.7351140363775552,-2.9754465278935336,-2.779288273760095,-2.3931277788404506,-1.821422463411543,-2.652078795455407,-1.8452285910479338,-2.2260244685931037,-3.255415111168374,-2.257637225350279,-2.514978896398807,-3.4648324050752977,-2.5660472954665803,-2.5806262984037653,-1.2641772048652262,-2.9936477749167976,-1.429389480892286,-1.8744691393041852,-1.0665674555726177,-2.1881868753095923,-2.7851359535742355,-1.0321497266840325,-1.6814087025998654,-2.9466913957404186,-2.6486680830154294,-1.58034368893675,-1.668663200120173,-1.1260821473554603,-2.574581958267246,-2.8213647253781167,-2.7842186051102082,-0.5710150688296368,-1.2693410673733145,-0.72142358676547,-4.319700490224097,-2.606375835955489,-3.3954411968541884,-4.06255242409153,-3.8423110476715614,-2.0712138569107896,-3.304081720151774,-3.340894467985139,-1.7906705532379357,-3.685754930849998,-3.585722954637098,-3.1171271102350193,-3.5557158726429314,-2.5034546976880225,-2.3197305272275064,-2.3174691001607277,-3.4235657102162813,-3.7922583661255147,-3.6057152678482143,-3.585957999487108,-3.04300750873878,-1.9293050587773712,-3.6573119950169812,-2.2112756626257504,-2.61014041498144,-2.536945175646249,-3.150707279480551,-2.430073952727493,-3.840878634258068,-3.5611975096764357,-3.1937920327531795,-2.2949891751643383,-3.9648916223228783,-2.7529352461754013,-2.994590020036357,-3.6968174984464937,-2.9613050874369025,-2.919828383439966,-3.38320478639008,-2.570342843338787,-3.7205094149185443,-3.5785595053620787,-2.5781861191565056,-2.310481266298404,-4.223789897683565,-4.0621290925457325,-2.211243366628867,-2.8928555631461705,-2.7427645752253835,-3.4666047224915273,-2.790443937020939,-2.933862097237708,-3.798799239330355,-3.6073829195399476,-2.895677621238576,-2.59632144826393,-3.2273745347284604,-3.9321301996884275,-3.43292621047137,-3.5394289237503034,-3.277449138022157,-3.5073417291936075,-3.8888871612278044,-3.866490918785122,-4.028611567386885,-3.4616219671123676,-4.074033292604183,-4.679334121239151,-3.3862588616232636,-2.030469306301915,-2.563969334257449,-3.0649059558450373,-2.8314152865166067,-3.2765396075880666,-4.083491004290201,-3.53170990905431,-3.7792202878473984,-3.72737835245834,-4.109827760414487,-2.640623459779629,-2.6633557916826134,-3.982843352439628,-3.574978145190273,-5.11705871855486,-3.0105362178439083,-3.4640162715496583,-3.3745555837690437,-3.237167081827692,-3.6581743097384765,-3.6349879455294265,-3.6757293608874435,-3.573396779739216,-4.461649775583079,-4.4978756748777275,-3.7674064852126983,-3.4215031520640586,-3.552006071481402,-4.133085302058741,-3.441952027181279,-4.929754447627663,-4.3207152682713525,-4.4494331357858155,-4.683195158418543,-4.1397751633469175,-4.268951200646696,-3.677290773139683,-3.8472785224948063,-4.108453061375604,-3.36237457716835,-3.2833058624231075,-4.190881871612857,-3.062137695728865,-3.332365967910064,-4.619939663968279,-3.302040277091854,-3.95443517752404,-4.599542914435954,-4.346614357008607,-3.810852632340351,-3.6253217771878865,-4.108433960924508,-3.9328455495395804,-5.1901421888544315,-3.666651645797076,-3.8824645928026666,-4.324651556711758,-3.73592840943565,-4.743689432274252,1.2543059312278801,-0.3800120792836431,-0.029916232598251546,-0.014925424344081865,0.7486260874365414,0.10465508145822214,-1.211864645389397,-0.8116147680094883,-0.7847451612363774,-0.4040015800544506,0.4234865513357398,-0.39931723980317696,-0.020769780282322983,-0.10624545168261358,-0.8718914824056607,0.766701248560422,-0.45779792846058914,0.208120637136691,0.9048159264053116,0.5479889048406977,-0.6905249475663965,-0.5131847846738705,0.4583502441984282,-0.378520684379062,0.3836304611349963,1.0608725686134048,-0.7398691310315268,-1.1209779014418555,-1.227052487043834,0.43915297854119095,0.4636605761424521,-0.862581977999784,0.3799234223155807,-0.8092884104165508,0.6588391313741805,0.5250480973394623,0.48638428860452104,-0.42962904629205306,0.7472574247063996,1.0598744481563973,-0.5114464613240292,0.8094229629301796,0.2656827549618068,0.3124672219778119,-0.5470336832071182,-0.20368763252053648,-1.0081422487411047,-0.12922753441224072,-0.10257585306938151,-0.6256754255153102,0.6870325548753948,-0.800573201890938,-0.7404279338552124,-0.22574803769756202,0.021218889984435066,-0.5364943007071608,0.5464683688102336,-0.09513396585327369,0.0828113355356231,0.6034626957640764,-0.3897049974205677,-0.06963719164906491,0.25448865210720756,-0.11751783107261499];
  
  this.h1[2].weights = [0.14727061517538864,-0.8571252810707439,0.60140163862709,-0.03987177802595854,0.6099189445895972,-0.8883157421392909,0.06155664448691489,-0.18912317010030488,-2.434431314737417,-4.146395645937982,-1.8791807099045734,-2.4335353722341626,-2.732067313673648,-2.6918847313942984,-2.034450841534376,-2.1677049021859216,-1.7135935497880113,-1.441291135290618,-2.2760743818180242,-1.4025114561422092,-0.917195970552731,-1.451262095884748,-1.4676121900879497,-2.0362793337938996,-2.5541858399878437,-0.8950283899416883,-1.5723386411175904,-2.217695398930307,-1.3522236092822186,-1.152694811367516,-0.8772940912799875,-0.7891872850319783,-0.71733244646025,-0.8976036292180251,-1.7051147229222459,-1.3009397253039199,-1.3943711711754982,-1.1241999996651857,-1.416082524715815,-0.6540864140287794,-1.890191152735245,-1.77613101730992,-0.3686537568424504,-0.6623573339243811,-0.39124716846541446,-0.22402337419636623,-1.1460874317892618,-2.143782869074767,-2.245467607969952,-1.4878854394508447,-0.563503586247164,-0.3751492102126128,-1.0440135484180326,-1.9971690473036392,-2.0615518579494903,-1.1784548019143655,-0.8133460614003889,-0.6240359144502818,0.45597639461148454,0.41920095674454805,-0.5945643819273854,-0.2864656773439753,-0.08899519204081674,-0.21092407888956322,-2.6033088573169496,-2.9733517588442906,-3.648256392828882,-2.657168817196252,-2.1800053878461205,-1.5840634286215192,-1.0637769749656938,-2.0134834112019844,-2.9515615817033636,-3.9022440403666074,-4.117107995818802,-2.503240285140979,-2.633402099755291,-3.0905948718210032,-2.7601024055156738,-3.182707138709483,-1.9321516600461053,-4.588258273098924,-3.982092081450106,-3.006197843542398,-4.680020203503588,-3.879423873716966,-2.6150326024451833,-3.700727382255623,-2.3239793178457298,-4.4026978206473215,-4.026754191535222,-3.8126060794322925,-3.8430935907442665,-4.287907843863157,-3.490676849951062,-3.6736427680711663,-2.7068878339689313,-2.904468162508083,-3.089306953780541,-4.34535609678462,-4.4422882327056215,-3.3193553498002037,-4.3870288754624935,-3.153137515188296,-2.6310178356107916,-4.2391570681288275,-2.983467138109358,-2.915371571905335,-3.623491988939645,-4.437306744429596,-2.625469874455666,-3.1348523944671918,-2.6075657062073767,-2.9241161761914682,-3.046249723308942,-2.571293040890423,-2.8485308892361845,-3.4042527536879494,-3.4085489282223196,-3.3736508749865948,-0.9626506331126657,-3.5446573657203024,-2.4246035658243645,-2.240231977203245,-1.9222035458055537,-3.0322929564354255,-1.8988277504509234,-1.5868453098732163,-2.6417693788348275,-2.243503762325011,-3.159596846888499,-3.294409824028548,-3.5028551526544636,-3.246087585588534,-2.846551142821812,-3.167941703173185,-3.701114148038953,-4.0838591625691985,-2.780193108220933,-2.8183943674032754,-4.5438464243262455,-4.054634641179359,-3.09023743589577,-3.371894758306091,-4.125594347932115,-2.9875586572284547,-3.0717189416345403,-4.321386487557255,-3.0792788666525297,-4.376598063949053,-2.807947211350596,-3.496815308798478,-3.351701634960919,-3.8151420465817787,-3.9344439958249917,-3.862665675940053,-4.525457661497483,-3.6193128230243614,-2.2557419254746227,-3.108040136737814,-3.9610395662259488,-3.7300530330572244,-4.086775922851422,-3.0840242718916557,-3.6617979191560823,-3.3846535982145025,-3.6692992802817996,-3.5406275570192896,-2.6704061484647292,-3.421808845377058,-3.543171058604278,-5.040624663962824,-4.4676609155338305,-3.8346224679684835,-3.178255897660314,-2.855743851173371,-2.4903802725803525,-3.482047496319626,-3.135794415057874,-4.093744760151062,-4.722867499704231,-3.3130302623993164,-4.834376078756412,-2.8385490689436725,-3.253118299703028,-3.9499018629704032,-3.975988838669642,-3.43677566007082,-3.899865666703574,-3.8704498281951256,-2.675244592244412,-1.857578531897657,-4.502919603049139,-4.621175266834782,-5.067479051256067,-5.780650415052364,-4.966131007807022,-5.07985849913564,-4.293654766345437,-5.632054232807214,-5.162873923379668,-5.884479430901618,-6.0558346379212455,-6.420609975316724,-5.508693517976681,-5.914561418086431,-4.553350327251052,-5.898416255541863,-5.997881858732101,-6.672464099763757,-5.158668176320146,-5.777124339032923,-4.12060383012789,-5.9276410579570875,-4.711023876012867,-5.556377877305672,-5.5951474938259285,-4.899599119420878,-5.454071737462524,-5.694334848817259,-4.70092369260319,-5.784079920592725,-5.291553166149938,-5.8680689681254785,-5.734905183561016,-4.60801166699034,-5.223754269215883,-5.980803941157374,-5.957626150370266,-4.673413280392861,-5.9037107537249245,-5.2806216841879845,-5.282481523684054,-4.885613067571591,-5.086293129667321,-4.4933354880292935,-5.176414773211133,-4.338997888165226,-5.189805591239655,-5.203774986661968,-4.748565431211618,-4.852406616165075,-5.106970677671811,-5.332730596763086,-4.547546801463192,-4.597924446565227,-4.5971150973633,-4.479471494459665,-6.0886471461978395,-5.297367953410816,-4.739377261932599,-5.185871741061295,-5.618585750795881,-4.843072021440845,-4.003309129160085,-3.838364817132468,-6.755033250110774,-7.321610432330195,-6.082219046806274,-6.939182639672058,-6.785665965179167,-5.979068793563538,-7.10750417431525,-7.204796485105794,-7.02257080926746,-6.467401590990165,-6.81858454216286,-8.192251332131763,-7.475676684388412,-5.825488354714784,-6.48597347016821,-6.900668604746772,-6.607252980610805,-7.461651156054586,-6.831355622963463,-7.0099067665454875,-6.786052464630503,-7.17719428936675,-6.584044322214981,-7.916755826317761,-5.9397704142817895,-7.124081183738062,-6.071448576113381,-8.230952625769334,-7.616721159385746,-7.623545201165637,-6.054450270697458,-7.337312839915395,-7.521856886328514,-5.94364054429373,-6.675121560372509,-6.569853316365225,-7.069365708276922,-6.661030576006989,-6.882213187131596,-6.469678245526256,-6.2750549774550395,-7.181689920294118,-6.517879636895028,-7.726535305138375,-7.912519875852448,-7.15608937629317,-6.819235123526376,-6.714423034963814,-6.119089304732208,-6.658216967305527,-8.307538566822164,-7.137203466352111,-7.872666494926209,-5.597759402362862,-5.963138017598753,-4.175056478701352,-5.981980717592031,-6.704679198501821,-7.13826934609617,-7.169014747001965,-6.566569503166562,-6.211809168028335,-3.8643262086991035,-2.767395003843021,-0.3607295961143742,0.7969928313625625,-0.07440558968713785,0.5976594501072704,-0.45793549264182504,0.29525645375457255,-0.6918925550666031,-1.3320087904115694,0.14650134210577903,-0.69738126144909,-0.8311438721338583,0.1468830123066687,0.5978453810315646,0.3297207214592347,0.48332376002054783,-0.9546920751793508,0.04828729749946219,-0.7703067286460201,-0.17348263549089102,-0.8788866422136433,-0.5959676223982991,-1.125227730674259,0.0074679745813167955,-1.1945643013714222,0.6038502388863535,0.284207594330445,-0.5585217425024068,-0.8711455668876494,0.1973577823649339,-0.4646633150567687,-1.1658316232942791,-0.2968386750841136,-0.643567470143104,0.45060900829146955,-0.9109450377940549,-0.40654666213906204,-0.13560173347870125,-1.4633278527942228,0.49254806840866916,0.4662394504247071,-0.5507252564457796,-0.3273913191494781,-0.42354758092907197,-1.0246851117267235,0.054755252319769104,-0.014772738078960889,0.2811379487073092,0.6657036756768163,-0.49735787289862815,-0.8176317586601227,-0.40225944463746727,-0.08792795948976649,0.23289588472412673,0.715338606512955,0.7144182154952698,0.19413400961842597,0.899200488631096,0.3340596805947816,0.19633574949451443,1.0656454978577619,0.5200066023553533,0.5337364909224224,-0.44894393458754517,0.5663775615443477,-0.30758573151637236,-0.4446301980265823,-0.9332787774146474,-0.13075610914057467,-0.3339836126796465,-0.6298146048747371,0.5389963974005547,-0.4992414307515678,1.9831140711858743,0.33091677174922624,0.05577248497303248,0.6516196471558617,1.3810217407736236,1.3122432185994486,1.106098042457506,1.5700102456260185,0.9801483365922099,1.7013516746134971,0.8099419869770754,1.0969581276080884,0.7168456392553081,1.191445612373242,0.9984348547606022,0.8648849989737696,0.5679257064939744,2.093367420615053,0.799182839126139,1.1982348995738439,0.576849653593018,-0.02659450341506354,0.3134947472258659,0.3171697206172384,1.9211832097936108,0.9900594499860552,0.33281876290101453,0.34265571195409184,0.9315064831905215,1.4878910857389973,1.4896648224376239,1.9834076446165487,2.4014827612774683,1.4038212849594465,1.628398681727216,2.0812628763554373,2.1082301750269874,1.426268718673659,2.302392740987233,1.6977414754380398,3.592885465077153,3.373897368630891,3.5361972033703983,2.287678491351298,2.631426624962277,2.276553300949673,1.8729159851744472,2.726569315815331,-0.8845450479739525,-0.9426657608699114,-0.4695936940047649,0.15919347184059562,-0.12491329803530116,0.5260649092553895,0.10476404264225714,0.4992363321077691,0.6740280717403038,2.4555363605030096,2.2128166842797365,2.9875290824392113,3.397382185488697,3.5234842904780996,3.6881378221570085,1.3523607747588482,3.011871284555024,2.6766163441927002,2.529770681910294,2.8566505428764493,2.2438788153007203,3.4474771131556623,3.337389971775309,3.2645844875964447,1.4377267449270026,3.5199734672534384,2.347294527179951,3.058469900949949,3.4875532224388737,3.0219118030072742,2.877786838617158,2.2646336234648494,3.6929232729084545,3.1181039509813306,3.643278200320219,3.8512224576241794,3.921547328279171,3.7048045299980616,2.6696404253453316,2.4870478789708095,2.72478838096979,2.6015747531675304,2.197196371275554,3.418568404360586,4.305332845589149,3.7088716212708945,3.0625334303963547,3.5938793554698916,2.520775731598299,3.9089654282341573,2.7160354559328024,3.82963935408348,3.1226676384776177,3.9023009607863632,2.992090867430485,3.0566371926542395,2.723595815616108,2.30210733307353,3.972642205124111,4.132717000892702,3.746026298570835,3.3557560928297,2.6032891343344478,2.303866585163541,2.840533757301273,2.6309492730684307,2.3987519196488973,2.9348829054636405,2.5672887308783334,1.4544490719542353,1.4197119094763773,1.3754145410978362,2.3870973905900423,2.196225681711524,3.640712322921564,3.435376418140197,3.5465861520372908,1.8868783945669225,2.5563410312062094,2.9993813178159683,3.2218533330693213,3.238800586956885,3.1357801239657506,2.895650748157358,4.250607198564692,2.5956182981892955,3.953244423905994,2.7952583031294167,3.172860477809937,2.982251666832848,3.106161838351184,3.4145995188218987,2.6738970694710726,2.891698591315689,3.3603328896717546,2.973865035559026,3.1435987455873478,3.316470882445661,4.658000268907332,3.351366525005118,3.6285522648954567,3.1860315230880567,3.3091698928604525,2.831759873593634,3.8947077127389185,3.438631347915524,4.265609589530078,4.066493100983558,3.9168035553275824,4.0479498319476015,3.395474997508321,3.3712458987563267,3.95397363754046,3.455678598216822,4.2664796089641115,4.066380837435545,3.67818894685517,3.175406588839992,3.9195721060826,3.3424920889789274,2.191642670016188,3.6814048972111757,3.1005439873335785,4.26339383846849,3.350645433485413,4.135742907832926,4.450076175457716,2.556552334361135,3.5421853079177534,3.5772010498435773,3.7356075700210245,3.06729692716224,2.4194076981766104,3.2632210943538813,2.9933867745884304,3.648052818035263,5.57808449512193,5.748068137139292,4.779063580144106,5.00865581245667,4.5955114937001795,5.148815515210179,3.894414928745994,3.722411433253434,3.9664254158455585,5.983843394336485,5.428976279702672,5.266591990094545,5.14196792853777,4.622472206347897,5.23739441273306,4.968798636293984,4.1990823703337075,3.8268929178910303,5.282441376969715,5.2741293214315235,5.247935121033708,4.883561189351492,4.777389222067619,4.5010783872465145,4.8514875665870365,5.476051937865366,5.1477772545291876,5.277217437725433,5.061395915509305,4.715057668262332,5.096853973138409,4.250201143632236,5.269336861486628,5.213917768336335,5.737368792612557,6.1398494115914115,4.6131355393271845,4.600654555470652,5.252785276815894,4.365363443670721,4.349048668951662,4.882687553984148,4.625928314985045,5.411571366912166,4.961253209150669,6.097876108010457,5.539842600102878,5.530083709583497,5.241715073776294,4.877445218178787,5.4133336012080475,5.226570575601271,5.215300078478022,5.26776506736025,5.087849480713727,4.276963096332576,5.427399275356817,5.091887401173225,6.09148760814753,4.938164142849267,4.771881301478965,5.65248781726496,5.646066115103925,5.545179741961568,5.923183218558725,6.306992717913436,5.661755320286069,6.663023107766971,6.2118598590016765,5.912116489929128,3.9455074220047326,3.822613347952912,5.9855134160927435,7.255764591799461,7.563313176808619,7.470369773654579,6.603958833054622,6.256516468807743,6.0624019910382145,6.034311374453367,6.499622372402991,6.171384134166839,7.35934227997951,6.688489326366187,7.422876041330459,6.4843592084799795,7.127168174619439,7.115756890220551,5.486379936602015,6.409706334767444,6.798462329108173,7.92243396940722,6.1124935241440745,6.591301851016334,7.086915503790983,5.882495110777511,7.211666523019647,5.930444742467301,6.811625184542307,7.2442984822546395,6.226158730414877,7.7005032671653995,6.473674619158277,6.795844315183352,5.716307969002176,6.633866492273114,6.6460304602076175,6.526005697791095,6.273376442456469,7.292443301346081,7.471621097552437,7.060406948869016,6.060461697482573,7.204149584464201,6.498401953109928,5.811042199083023,6.3571544267316105,5.968532878308321,7.612766729488145,6.979873062387564,6.706065127765368,7.699716021840292,7.952339800730442,7.304689867939364,6.989563425689612,7.48983259031598,7.268544499365904,6.662557761802849,-0.5933872354641793,-0.1997770455805872,-0.2774422546668343,-0.40643897970867915,-0.824765230173656,-1.2157940297225487,0.5570208536972115,-0.19542879486243542,-1.1826793047130661,0.09045685545597912,0.31131406345359897,-0.9250480046367177,0.13792900598984217,-0.9113441769846076,-0.17525224348685806,-0.6438840696111983,0.4508839456098014,-0.8075911351367057,-0.22092322998610747,-0.01016615801107933,-0.4757428155551151,0.2611559583566852,0.32158464489616545,-0.03339002370668576,0.23207555597825721,-0.6993676427288773,-0.3295916371345726,0.5141845876266815,-0.25553013767398836,0.2547653861915813,-0.03255532837130991,-0.8150656473743317,0.06066274352316754,0.08067301150144332,-0.06813897278730179,0.8403891328574148,-0.4263787711987816,0.5695158165082485,0.4225171278427609,-0.8033350808842894,0.2068530320357515,-0.14830613531111486,0.503530208528616,0.2537147703953876,0.5872008567590805,-0.39534965609896616,0.8299393377099885,-0.8865014178697062,-0.40129947896892704,-0.1218983537102724,-0.6406787399221103,0.033695378506739905,0.28846176617081987,0.6830731559150544,0.7274407607835655,-0.6663008367742902,0.378858350902068,-0.028029979847266618,0.6505378107678373,0.09941394059830877,-0.6039295099311685,0.023719065540009618,-0.10928485845123308,-0.7003228122279984];
  
  this.h1[3].weights = [0.8066774844561562,-0.6603174512427863,-0.20729192225346393,0.7488306926835948,-0.02529364225605102,-0.19886475282949778,-0.4168199739174612,0.12455025675956799,0.17819957289235774,0.9979075801590498,0.7636697035150335,0.6255990575558387,-0.3142984365853749,0.8949780615404522,-0.6809060310597923,0.5064185444329122,0.2076103869320752,-0.2393764693302362,-0.41443555300124746,0.6452981610525005,0.7834731521769311,0.48033488356042225,1.261996033229362,-0.5624729658761227,1.020660330700372,-0.08748657557343843,0.9813572637268796,0.5644314207553244,-0.3617822239875566,0.31736110350131813,0.5220283678674602,0.7142292377135013,-0.46113615369005195,-0.4468008285958052,-0.01720372360292723,-0.2601201304845738,0.5523328421558737,-0.1226014971800126,-0.24315301310162218,-0.006527526299903502,-0.5552839305194827,0.9319292435756082,0.40088845404754003,0.06273462686663205,-0.07433550244634382,0.5435370283673568,0.17740091629549098,-0.38043641043051474,-0.11270330415443547,0.5105329648285392,-0.25730083856376856,-0.7474416097295233,0.795159988447461,0.5164982977792674,-1.316372909521156,-0.675427863079289,0.9648653892910244,-0.4156483344724582,-0.6214562643109045,0.04127407068285471,-0.011999656173517614,-0.528983168811374,-0.49400806150167353,-0.7482167811092584,0.5046477277435674,-0.4593496031252161,-0.7309806966638925,0.8065605898749998,0.04546416361883308,-0.07836377427461874,-0.9142013597051556,-0.6495298412248541,-0.18615963415980788,-0.18783721597963454,0.11269800756175115,0.3588882210438369,0.8846255947391054,0.5980829200459027,-0.2619630996033178,-0.07089579100357274,-0.21998136316940844,1.1548305612956022,-0.4966741533882267,1.3179445712592244,-0.49367693026090387,1.1523276808587153,0.5918084489627721,-0.24421478175398428,-0.585205746650154,-0.1274038081978444,0.9260476243047591,-0.34470362173914587,0.8630389842030541,0.13310691563201663,0.4251136654755578,-0.3881928149629913,-0.5022680051541408,0.595504126487379,0.6032277532196246,0.3723529135813677,1.354599787727577,0.5662399815538433,1.2261579809412073,0.7690807795573503,0.8508195153183945,0.5839119225739241,0.08786622347124064,1.1498033482356933,0.018555901349090145,1.036799102798112,0.34094688088234426,0.046836360888773826,0.1621622915443206,1.1149109052672443,-0.32090315432743893,1.2712292525945346,1.0066199109023275,0.0723819079677507,0.44405781097859115,0.567769989647488,0.6376715774985913,0.40780400024256924,-0.9119111803118878,-0.32025756249804943,-0.59099103391121,-0.5799779978488377,-0.20771592161598196,0.06785863162937075,-0.48176771103383303,1.244287999569528,0.960923997153236,0.6811741841314569,0.07495473927194267,-0.36284667682559746,-0.707437553324702,-0.5095708825457804,0.9757549495780298,0.6415987523159244,-0.15138844415406602,1.2516890405775505,0.7158831200775663,0.5790285015325041,-0.21862414209235548,0.6513706283013755,1.1329084063465447,0.8955801444889309,0.6099526737093018,-0.06766086573093769,1.045651748384483,1.2946603705616975,0.02220925161750657,1.0571130940411613,1.0259950873786148,-0.12775295834684652,-0.4308949533153452,1.1814127683345348,1.6357068328425837,-0.5083924215442663,1.063387040631707,0.8490391329266913,1.1209149632555409,-0.650590144701746,0.2416973468555571,1.24400378668814,0.13912952447150564,-0.3201579646484269,0.6180615373808751,0.39492339472989235,-0.6342761701907886,-0.05020803563083139,0.7996660394811614,0.9173284920103474,0.8624673543181509,-0.06544192480226996,-0.5413257543467308,-0.30442184240514164,-0.6230059564382128,-0.6390751014905526,0.6141867163888051,1.13263283791186,1.036000000894537,-0.021963538136985334,0.79385503445,0.2458813744912781,0.783093377162281,1.042435216326568,-0.6543588332969402,-0.556192987034361,-0.07032261240510866,-0.5063893730251797,1.1097761171965541,-0.4809667304204368,1.235901132747364,1.4566001623203808,0.31537299011761144,0.045910459729784386,0.5040647785837143,-0.3797402073451368,0.5771516527664869,0.4387579547347144,1.5661863434339824,0.9348420694889784,1.2003458385655839,0.7848783111794897,1.500456799115213,0.5087566740051016,0.48822495655896203,0.22251935961352115,0.10488532440413603,0.4209940818738439,0.27305729439744036,0.7362505386961589,0.2829752822314318,1.4257523769649536,1.1384618367259078,0.838512342883964,-0.19754000814574463,0.05820271938763543,0.8826087908180006,1.5830931582339622,1.5202090619527695,-0.15887284191233508,0.46332495939215396,1.3891418110573517,0.6693146074695889,0.7386395219248576,0.7799943031141375,0.01103534963128602,1.0920621017103294,-0.15227334008453372,0.5067471802667088,0.9417860505213034,1.3084675899840605,0.7548283723344859,1.266504643548094,0.7013422264454451,-0.2952039342283312,-0.051960902588604085,1.3760909529822247,-0.21072773993590563,0.7221642065232863,1.6839438610249906,0.056360258859148506,1.2571492388215164,0.7254591088112128,1.224745519465704,1.3498845199917884,0.31323533799143316,-0.4361023212257437,0.19607058366355787,0.9354166276152733,0.8104001657785719,0.1528318825255615,0.13915570519096632,1.061011894903496,1.4229050594216435,1.386275429434325,-0.06855078059272819,1.444187556188129,1.6931353227830097,0.4765628002314666,0.6692356661997027,1.5440321028046664,0.9210863768057355,0.7033536224393057,0.2538638794882301,0.2851773171048203,0.17579055982144617,-0.09080331308253273,0.5084236746647164,1.0215610886435653,1.2805622118309512,-0.38182581310304947,-0.1069760734156906,1.0535396218626027,0.9649459913235823,-0.2425619775417314,-0.08067361308719799,-0.46981820224856297,0.9934817478962044,-0.27152753620477305,-0.030344781740189276,0.8454715668026626,0.07899469852112821,1.0509911300682953,-0.051887113652596156,0.41829079296254784,1.6755670991298155,-0.03390471103198258,0.738300536050443,1.7739066890880333,1.0632747044819386,0.4808964809319954,0.4783911035505505,0.7949525158741839,-0.11672961685085138,0.015559312937360478,0.39804437252785824,0.29535424727844717,1.4089969946376784,0.4853719692106668,0.3004252943421427,0.1543230490201961,0.24201908385457047,0.30761599513527643,0.8158001958590836,1.3365471337948842,0.31831394272083274,0.4643248900462152,1.5445363751286232,0.9170433249292281,-0.3039994438413445,0.4213408197096236,-0.4818285197115849,1.4368052290227045,0.8462945090529348,0.7908670483461704,1.1935780081674874,0.9599392466913815,-0.7827880433599564,-0.508951796064424,0.9860158414515061,-0.04972226888765226,0.2641719461383475,-0.9672018118266076,-0.4701946960489764,-0.19011405207516857,0.13630276782400436,0.39381205395939717,0.8096926178344565,1.0104689427143154,0.44012664863010603,0.90698518819399,0.5234285492114352,-0.6050581011238897,-0.5747117009910436,0.23320166734963316,-0.32831027374489996,-0.7462754279493781,0.7687011784767721,0.03727032003002203,0.26556843133714136,-0.7810283172570396,0.6567039988349992,0.2619570791135865,0.33358324305696424,0.4996144178066049,0.5174985955902018,0.685765116154594,0.1614212988844203,0.40798146245613365,-0.6295825524910567,0.4743173829728851,-0.5292083014222037,0.29623177590144195,-0.6773037907529673,0.7763394650978335,0.0663876512195605,0.424813727284016,-1.2377077109335908,0.03423812747309498,-0.1571770893437359,-0.5631684316004882,-0.360413809197676,-0.4429343870326907,-0.7825174471507345,0.03901098793383628,0.008440461509489613,0.10874672442530045,0.4501691701657046,-0.3562880700751608,-0.7147749680481256,-0.08546067737680801,-1.1127053653526549,0.24363737996125454,-0.7328073475310356,0.4307384986129651,-0.2648065935450541,-0.8502011741688085,-0.4076037963215887,-0.7573591704887035,0.318365494709029,-0.6143960153821448,0.6074801633107443,-0.010823687121678471,-0.5298031287448253,-0.18358417395830307,0.8846475235884896,0.6548224188628269,0.6822662257817376,-0.17059387390054592,0.5133906572994449,-0.3237485228237964,-1.1651209219229197,0.17682739563164432,0.3734353749549423,0.3583977888719793,-0.6722788693510809,-0.5664548957860857,-0.1345310512926332,-1.2725575924122359,-0.31688440887065045,-0.23852833774440463,0.15849504277427293,-1.1877836416149128,-0.06521900563058618,-0.16273730995221816,-1.2630609738983807,-0.8450216500474936,-0.0021597070190185323,0.7125937139348237,-1.7557942218942972,-1.0205899126032298,0.08129727839026844,-1.338624599054377,-0.8882812672677046,-0.40983664363001326,-0.9473305058857827,0.0072511281607674114,0.19531249763023772,-0.16080714010893243,-1.2852566357647868,-1.1590996810883867,-0.8335191033991318,0.36971759593414877,-0.12047966324077249,-0.031179310995855816,-1.3479161590250424,-1.1495951445032122,-1.0108967487454348,-0.18042704171872184,-0.1166711927745288,-0.030791027121570204,-0.22571009609897494,-1.162136597803012,-0.2187362925005528,-0.7880017012546114,-0.21784279211546456,-0.5985609595488778,-0.5198505094564027,-0.2538285928761437,-0.7773113764125386,-0.9592124761724685,-0.0470980701458501,-0.48432868834953124,-0.35956706665232474,-0.6925870882061083,0.3299479154938232,-0.2517219688975788,-0.7779145427237165,-0.7200611569658645,-0.9677542566411795,-0.4989588681476049,-0.8526315808632224,0.7050458602964982,0.7794259944798213,0.2972466372092397,0.5952733868035993,0.08113782084738481,0.04674071449545155,-0.6530701124568342,-0.6692921515700433,-1.1744715279763156,-0.664084091468971,-0.14979231098901927,-1.2202950850119387,-1.7270427030838642,-0.5481200403007741,-0.26137658250834517,-1.6162126484444546,-0.17548668883036248,-0.10182797943201964,0.3750755558501941,0.3213445331358866,-0.14365612944892536,-1.2019781465008286,-1.4041001811154914,-1.0749886629921743,-0.1200902784958238,-0.6530893737798912,-0.030348911557201045,-0.5675600307144478,-0.5019956666581707,-0.06437167388288761,-1.6752226430102275,-1.4294716936343281,-0.6755271209408014,0.7052816517240461,-1.0434118447562173,-0.818390042702772,-1.3806167131235465,-1.340173964532929,-0.4626776923930395,-0.5623549919732254,-0.7135391291856521,0.25536122523264776,0.26759287770646906,0.12109581588948419,0.17419359186035988,-0.5801431147875805,-0.30013282437585037,0.43264902718344433,0.6147912118617972,-0.4921223489732284,0.46851918795424496,-0.10448291108598799,0.10759958161299313,0.12889785081596666,-0.05475809389129907,-0.7898029285158885,0.20238458547679575,0.7899608242185239,0.49450734728993845,0.20876147516472043,-0.5436724551687622,0.6427819120815057,-0.6466043201217588,0.25238286105635643,-0.9586177051386128,0.2880109806197192,0.15191177042260845,0.24409839203060116,-0.21915579474427405,-1.2084026382046893,-0.22685601108489514,0.037239669864478124,-0.8990722191180958,0.5353822270986387,-1.341002603059606,-0.23940315925707714,-0.0671154996190398,-0.5943474251078918,-0.7946388809326165,-0.7367319515595158,0.212300421919684,0.4148537100788775,-0.9329018940835635,-1.4182110973585993,-0.5415839581250818,-0.4089629385191932,-0.4943748001107551,-1.3140392956947666,0.28492520847626257,0.3706788577188055,-0.06061690552558152,0.27751903009655465,-1.0865774155196428,-0.3690881443026474,-0.40285637825289694,-0.8752109113355532,0.3282477859754081,-1.3661308254253322,0.1180532696605684,-0.4206176082174679,-0.6856971118737932,0.14527637408400879,-1.1004405384894962,-1.3500619044403135,-0.10708848815760502,-0.5604398862400426,-0.1294416828283031,-1.434645933983292,0.07116335883986762,-0.4375368221298877,0.0660229236946242,-1.092198602065859,0.47559623287853275,0.3352527908760579,-0.40712118528623037,-0.037927039696898236,-0.903315181837256,-0.5425261660727396,0.23134008823408242,-0.6557646296011093,-0.936161248715557,-0.759266389632558,-0.9349339575242742,-1.1774832048262462,-0.1799900310108145,-0.9568807447475074,-0.9339971672188695,0.17353660432213264,0.2690996621927831,0.21979393592618987,-0.8225754132870041,-1.2569879077770232,0.11815796543711662,-1.0229752399192507,-1.4477172876675426,-0.7947939863921266,-0.3920858085332274,0.46935824469727094,-0.4523237630907763,0.08710438470418175,0.009732710108770809,-0.49079223853355347,0.24884727540548474,-0.7696117178432503,0.1473723788421639,-0.27580490555968223,-1.4413958427570357,-1.0841017472230758,-0.4452019874870326,-1.3384145071125109,-1.299353460254773,-0.26122598251744733,-0.494590171103776,-0.23886687045472763,-1.1867494832228944,-0.5865523109923558,-0.02372942050039941,-1.4028379771186887,-0.8950922706862992,-1.5689027711856314,-0.3960019391073836,-0.4438067983831113,-0.6579283990799951,-0.9999599215755848,0.07702364305941117,-0.760763589078187,-1.2477138114796877,-1.2676233831959778,-1.1889885580938755,-0.1442091891347426,-1.1791488185301289,-1.566212963990084,-1.1451872666175837,-0.3199039049242502,-1.2688021687691862,-0.47077249312912506,0.14693627615240684,-0.868304606500464,-0.48395845691102235,-1.2081580563462124,-0.780936536469093,-0.17008776218612784,-0.3465842955534936,-0.143568632114556,-0.24735910442628498,-0.46763222239736124,0.04073160243783234,-0.5739324217876874,0.3193416340281407,-2.0981378399283614,-0.28696821978475157,-0.4189876174331225,0.18880497498050897,-0.4805203520482894,-0.33870743507572765,-0.6888765772051693,-1.7253518817202613,-0.0035768574720627076,0.01881584866983732,-0.873549003910207,-1.2376245756174358,-0.15877140868403805,0.29872067512869127,-0.09339866488213727,0.09085852237526895,-1.2018690916679708,-0.08734661637568723,0.1346831541722123,0.19511585049103666,-0.10395950550223895,-1.4424149549526444,0.12866369682940312,0.17088234229794289,-0.4760397065441733,0.08694864604429742,-1.1476755759327164,-1.0645258661921937,-0.9719051593302699,-0.8143917500726975,-0.8136854819385435,-0.7494774299954509,-0.552500605238697,-1.0241903934872323,-0.0795314493499596,-1.2472305766016707,-0.8345319293307708,0.07059501821056535,0.031426423209047136,-0.34483713395155186,-1.6287080482320266,0.07992569767072381,-0.45643192095020696,-0.2877355555196992,-0.38885147405885545,-0.20955562239432873,-0.8925427664322785,-0.18536252346559706,-0.48944448103506133,-1.0814978381928209,-1.1280222907582824,-0.4444744995174863,-1.131069955321942,-0.7264598951853375,-0.5567575298777236,0.0503965942486379,-1.6582787524153872,-0.09142076137882396,-0.09279163267840494,-1.1017044521656028,-0.4747872497553458,-0.3871156811574634,-0.16564326765472667,0.463656559887102,0.03547763985262356,-0.02577934610343547,1.0356747346528559,-0.4808924995652634,-0.230502293535824,0.4538567354609562,0.46671509046959986,0.12514570135194095,-0.11653450228615775,-0.4441040121669476,-0.8312438247077949,-1.1764261160063534,0.5038956606213151,-0.6787519392220367,-0.048841733584659146,-0.35400202940658665,-1.12352189610752,-0.15459596913543502,0.36155729292177113,-0.6052108869824355,-0.7719536882767806,-0.8613173051034804,-0.7286113819833648,0.6189558019867991,-0.499324101890505,-0.6975227214672097,-0.7937261289647474,-0.7727282850144992,0.6155791825189137,-0.8089956187547315,-0.700559874071675,-0.030042562484516845,-0.09461800090746916,-0.964613888940666,-0.1472895713910905,0.6341111599236912,0.1460161953238167,-0.30934899754619666,-0.8696799344154639,-0.30050342637023075,-0.36122332239434357,-0.2446454108495446,0.6583684467250658,0.0430947385312781,-0.07915706201606591,-0.1533675244097116,-0.6105404434111642,0.8849933746298679,0.4861183969451441,-0.5266945622313377,-0.18396090730090026,0.03593197980530356,-0.448765353339123,-0.22249039826221917,-0.7580463893269381,0.05489114345616217,0.23104866325985823,0.6182509060648298,-0.03103305808847004,-0.4248729676428998,-0.7050918531319702];
  
  this.h1[4].weights = [0.020561449932430254,0.4269991194827578,0.024651459541765508,0.32219853693812484,-0.3913890346997033,0.7398496218090425,0.3414300017980354,-0.718292637675972,1.1317469208506483,-0.5035994481640043,0.572322195000032,-0.2619002745117642,1.0547785278441586,-0.23129012449443942,0.7438201693000933,0.4604975095801387,0.05180031642573958,-0.20212821473991793,-0.7654353457358702,0.2358702272297405,-0.297870465141448,-0.22406036749009842,-0.5045558920260159,-0.6368661033141388,0.7009523892229257,0.5619455167507192,0.9705196928473616,-0.7110058728850253,0.27989704274611954,0.7727813163684082,0.7655229923793847,0.1767527312939743,-0.47655881588561827,-0.39675873619873026,0.3597605916898016,-0.06878256786373833,0.7932227588543765,0.23660842754335434,-0.2474935954866968,0.07608309029833413,-0.005507996393081255,0.054622288023585534,-0.9786584865871175,0.6039122558964559,0.6135690703774846,0.29804694270580573,-0.3666987473138358,0.1513494477948963,-0.7347129215831099,-1.1385203024962092,-0.39280858817118786,-0.6201846281976483,0.12627236456822138,-0.345542852436348,0.002373178191930273,-0.33532753348061234,-0.6162009431339075,0.5496524858206717,-0.8675441969557389,-0.1470239800347768,0.45663208482727313,-0.3986989002014769,-0.883014924370825,-0.5870870437201012,0.8400555666101283,0.5835946039360802,-0.8283805592096166,0.6465622829030764,1.222139889951538,0.5288665368450824,-0.27187434286116346,0.9632271409948966,0.3068789847456631,0.3958104650782106,1.2706721821012912,0.24611752349995317,-0.33931736676869206,0.1635762603697152,0.24746849710117413,-0.15028573172155718,-0.48698387770172785,0.33946067260423546,1.0901645043591943,0.5216578546871878,0.6574387664513256,1.3322159339986557,-0.2058632486364819,-0.6425801285308184,-0.11686493025271083,0.5009056715830196,1.2419137351607261,0.04325309295613596,-0.2913617927328545,0.1768547780674178,-0.263924357707817,0.016847160583994825,0.10997208578886505,1.1993043984756189,0.5512230048303949,0.4520648707359089,0.5590574274096195,1.0250171898106435,0.7692730570436525,0.21596991250845468,0.05436786386368121,0.30821037506281856,0.1562119094796708,-0.5342278993519559,-0.06273819476970356,1.1321743308814491,0.996817132282081,-0.056327576859685896,0.785372453229464,0.5472571343100517,-0.2814662368203204,0.3354489997286225,0.01824545529436836,0.17967493537940926,0.9413922725895197,-0.07781831553405151,-0.6292082230115751,0.546744209515647,1.0118174363409886,-0.4704410943372577,-0.6105594175481913,-0.04797642353290479,0.562926121244992,-0.9538412423428067,0.43605492626993586,0.7178115682970967,-0.1329479269283679,-0.7669132047982486,0.43712620201273233,-0.38147185079117274,0.8711949255298056,0.40115079041122714,-0.25809790149488765,0.04243458764622913,0.7621380613458957,1.0632640391032664,1.209502775700436,-0.7155382445005815,-0.14170976221239234,-0.14392086062596068,0.6664467284714052,-0.22312677489791352,-0.37349969235866426,0.48465300585147597,-0.4556152335669683,0.09268130017222097,1.0406127855631302,-0.004172856946954343,1.2558487365161342,0.26735908999047686,0.6642975987698234,0.9612969000712113,0.6429668308702582,1.2639890248239423,-0.07846726023414521,-0.19006031484518535,0.3171164592226914,-0.4626914486434198,0.30702688892535035,0.5662146862113989,0.7747593090672328,0.9585050652564153,0.9506003108654563,-0.3162409794137223,0.42548129389895795,0.5412726864517842,1.130821922237596,1.2611502474267158,-0.6276648112277002,0.23348595924660434,-0.6619046368493466,-0.4550217568986516,0.586472006833251,1.0369461623888176,1.1812203373664456,-0.2723790158174595,0.6363364426221876,1.0461368243005775,0.9416987672399958,0.518950090582415,0.2286037684943236,0.872885995375964,-0.5038561225030939,0.8231762280733752,-0.06374854026939232,-0.07207708013908827,0.6710498863484935,-0.4935120719882379,1.032252385324817,-0.16396552362149228,1.008847554207648,0.9838976499264455,1.0496206649235085,0.8426812726012565,-0.07196127323623701,0.3158507204550046,-0.06079858504826132,0.17583144037885876,-0.27127585007322125,0.24100720645936477,-0.3237140302529467,0.27445081587105724,0.18526718890036922,0.29612943447655266,1.2227312094992657,0.466605007356853,0.9102576327628449,0.8651019297819734,0.7637453070560618,-0.35216421412971427,0.6785236011843815,0.061418501185572086,0.6796752164121178,0.8722576568684902,1.1673432687228489,0.32222437932299264,0.7929876654736968,-0.33251202100968363,0.4315521457407917,-0.4005340401089152,0.39371635952406486,0.004267910029894382,0.5940356197223475,1.4187971196817293,0.5484957479436331,0.002686989166994936,0.2718761031521715,-0.008583119210801913,-0.31418297824563846,1.2953122465469191,0.5187184653759355,0.35165074892745757,-0.14916084344697167,0.5325158393033697,-0.46622215755521673,-0.14638460052716085,0.24599355164079376,0.055274552242539014,-0.010077049622886294,-0.17490983952391206,1.5441682377516859,0.8310865957022029,-0.2072994118798763,1.0038273121755676,0.1919475980415715,1.082431418580339,0.6571569845947222,-0.5736685079973393,0.5472233736539275,0.868428181115686,0.6871050734609992,0.15088911518272066,0.6917438371331432,1.3292088718567232,0.7743856202403252,0.980844511804311,0.20252608097366412,-0.2283263957877792,0.7086108729036404,0.6688890840233342,0.26913162773984406,1.5232173487242846,-0.18238963966393726,0.5596502171464486,0.08792673226564475,-0.2891453615960664,0.5181254637532197,-0.33153795299967037,1.0803319795801771,1.376490062655605,1.3230704834527363,1.6359420401758245,0.0170407789409294,0.16227661949670577,1.3816897918734599,0.7142268402046456,-0.13807423711165615,1.2834582777535504,0.25209885340018434,0.13670865014024614,0.9471038643601749,-0.04350001907338614,-0.09762512248019148,0.295630544881148,-0.17444870274877833,0.9667959709925181,0.5156215151401502,1.0248648223409171,1.2739022423351558,1.2155289322366587,-0.1741308979575951,-0.36928381079791184,-0.5811292617596016,1.111728475633502,-0.3731294090081163,-0.3043829240399176,0.20637780455418478,0.6333898577866401,1.0216449074341503,-0.5528363069423033,-0.481079121892778,-0.4680279733575973,0.9106221179495037,0.8628671644261806,0.42217764371088834,1.0160297714699822,-0.4499915480193115,1.2031247765137634,0.7362208039555602,-0.6427595296586753,0.9974734303564134,0.9402831766001635,1.4162660213512783,0.8436452712771909,-0.6818656620405069,1.0933755401197496,-0.9082230148984535,0.8370608893036948,-0.5542594983125706,-0.9029837717395169,-0.8593020747476162,-0.673050610832682,-0.6236605822224163,0.6927580650210574,-0.6182095215621659,-0.5651384353752857,0.40267453889893606,-0.6666906800804776,-0.9517915496339987,-0.8373713379447558,0.6566710248482802,-0.6065994487183421,0.6383599679435038,-0.6357460893984875,-0.8847964036858303,-0.03267954118695834,0.2714190418645481,-0.5856226594243904,-0.2895155518397812,0.17607101715164955,0.3173380808976932,0.5554368889535933,-0.9088971556602545,0.46032526987609473,-0.6494417395837115,0.15972803860513765,0.6928284203478726,-0.07508386118668883,0.828911667514767,-0.5679888734606106,0.5948375044450266,-0.04630321491125542,-0.1364746081413945,0.5948659881257377,0.6253524084546895,-0.31461326309325927,0.5961184921292648,-0.16429962265565004,0.480975456740927,-0.029028636157303223,0.44111706396050987,-0.19517342852579286,-0.6152896549304995,-0.11833532428534953,-0.8814923254457205,-0.7785322551337538,0.3124053687393219,-0.9712818845457543,-0.9505704018563627,0.2126734202405113,0.12508881969430702,-0.36482048628831054,0.26635974709662374,-0.392421487740906,-0.587527065487934,0.14894620878006104,-0.15309095391413832,-0.1723056097134231,-0.08507310116284501,-0.9974123614195526,-0.1871495827855707,-0.5488897685997558,0.683047897039454,0.8736753473314236,-0.6813607062660298,0.8711364647486155,0.6205513553216515,-0.6972227038999672,-0.044554970259921264,-0.15066992050886951,-0.6299883458331397,-0.7471084727415297,0.17333273879692554,0.32614189517086034,-0.6124152898937137,-0.12375273392336364,-0.046077520530835685,-0.7621416737540064,0.01651808304544567,-0.2189866313719651,-0.9651893726367603,-0.2795558104042594,-0.2615020081580773,-0.8038891516265542,-1.1899015972980642,-0.555228233119514,-1.2972806554164276,-0.27344868556474844,0.27605494903859135,-1.065806028461452,-1.1113360106279062,-0.6070424370891647,0.2697451230072386,-0.5352897000679671,-1.3049034331783518,-0.19915617565967753,0.3180135964122875,0.37442444342838654,0.18747635996572432,-1.4668980355502739,0.24083608502611487,0.032780143482018055,0.3584781826634337,0.20405155151923385,0.2921893770706263,-0.9630304250489977,-0.9757160242616302,-0.9588610909242292,-0.08078527753348046,-0.804979079618252,-0.07326716790939639,-0.5573588427823039,0.695669523853517,0.3792849978682832,-1.2526813320285548,0.4762520057463818,-0.5112493546640122,0.02406676017934739,-0.8567977698409845,-0.4649689595853377,0.31683158747299034,0.41035684239225656,-0.01246586216087131,0.7792392162352724,-0.5216244146730629,0.7405858045843021,0.26376684264964434,-0.27298968108536414,-0.7679577532169484,-0.8752661312778315,-0.5941909567872864,-0.7277075737239561,0.14945851862276674,-0.7702215040883501,0.3375133733115026,0.5876809830420425,0.31202310813079925,-0.6001968590252937,-0.042474681484954944,-0.672775297772569,-0.03810498271019006,0.5411778386642163,-0.3211422039309655,-1.1742977696420227,0.3774289616809952,-1.1300438438321934,-0.1984736203887704,0.6903256556867005,0.03026157038893602,-0.4524217803724318,0.25407277806992246,-0.7521409748068072,0.17115103856053204,-0.35798890132715333,-0.37649443048796066,0.2228473215212703,-0.742380758436073,0.22303140636117083,-0.013947625253900633,-0.282201300494929,-0.7479165634833767,0.18291036059114402,-0.06613829486701547,-0.7415145670207857,0.14527490886039382,-1.1329545199808497,-1.2546800567567302,0.5849381162371776,-0.8536947452177247,0.4224176667894442,-0.7369284916795839,0.40562415197716384,-0.15772086473577313,-0.38762343655475195,-0.7507336505700799,-1.2363297866478615,-1.1560471711653098,0.17366731260236665,-0.8546071132591142,-0.8757942087015068,-0.454891168385252,-0.5737456516679286,-1.1871447957723582,-0.7750670185744243,-0.431088295021482,0.8049993654191969,-0.5690462731271967,0.32005134048601896,-0.7177368330448188,-0.05555752554546955,-0.42406768372155357,0.304556709345622,-0.6217693976642089,-1.0199296115682945,0.1167766127793117,-0.5069043683254394,0.5986217963522714,-1.106113344565509,0.06212064473281313,-0.9081801605766116,0.5920330740742996,0.7540455316275896,-1.2715743356058227,-1.1084865962654435,0.2894104498010906,0.21041882898227798,-0.6123400343566165,-0.6143292769730594,-0.16874655181115006,-0.9242461065589112,0.6473923884249456,0.5544766885717574,0.276238946700513,0.34846703397969336,0.1988595782768952,-1.2350766890675835,0.038691286484394564,-0.5497095608540792,0.23267194026294347,0.10961683371596664,-0.5091104868151459,-0.6850317956372878,0.3699063279701099,-0.5528637572562026,0.27137288354273953,0.13748293805352382,-0.39719464897167167,-0.09113275100419631,0.5182957821239836,-0.9780656212663915,-1.1285231433924632,-0.5821632204140894,-0.9161518182102362,-1.2975681314276042,0.26804731525168934,-0.8360119210911507,-0.8829059185618182,-1.2413498972791255,-0.7858094182776768,0.37222856140669164,0.2010681118976258,-0.027726454911022158,-0.7615617025883871,0.0928845504838047,0.23580615163324464,0.19382254568988758,0.4337318697370003,-0.8282678789233279,-0.07519692259149345,-0.5716360987427616,-1.0973718964173125,-1.1651902324812,-0.10336026828136487,0.3476751125327148,0.04929950750035487,-0.5502408671502201,-0.8964183458672457,-0.6859575873275389,-0.7644007134616915,0.0927438572834694,0.1156557593028111,-0.04071527497261773,0.022999953505907358,-0.33544269289049383,0.29460445511529776,0.2750714370451839,0.20116978672469985,-0.7942147483200155,-0.21277596839523902,0.016656816096998515,-1.0317347180414442,-1.2555036845701695,-0.3044565297807638,-0.6477527489694404,0.18705419180862196,-0.2699019850123786,-0.7692873131146881,0.25067573526451203,-0.2653439831989757,-0.7986275417366192,-0.8803092799959238,-0.9045057132266424,0.2771355959193801,-0.07069813577519468,0.19007535454635105,-1.024208866334329,-1.2253929417375773,-0.0883643622424665,-1.189229641500231,-0.6434300793960612,-0.8579178075315628,-1.3510528226186362,-1.2778136171719015,-0.735787615864042,-0.8149376738567087,-1.236845561284829,-0.04827374282599089,-0.7188405056566388,0.35628572367684025,-1.148435700377778,-0.9622478505588993,-1.3963395318721574,-0.9112087124761398,-0.6742788613798392,-0.37845680999753617,-0.750238296535677,-1.5063447254326756,0.2502246815412531,-0.33567670310905484,0.0679873674311055,-1.289727556343156,-1.3366264655237363,-0.9830919085707036,0.23207365977202069,-0.71011391240288,-0.39302455753812976,0.39807038954116014,0.40299148884750396,-0.4918108532595436,-1.4142728606898953,-0.3033137993975529,-0.23235412980601114,0.6584576210199413,0.47438483495548256,-1.1902867137600686,-1.2769132839645163,-1.0492137678948723,-1.6136547764762157,-1.2074004907135094,-0.3110932230304261,-0.023143390333431216,-0.8965145202199396,-0.0045152868856103735,-0.17142196333444285,-1.1765531540621108,-0.3219520256405172,-0.23071497323542045,-0.21334813323701554,-0.21363582581117838,0.47191673494732,-0.37666582188079356,-1.3832470716906784,-0.745128102901524,-1.3961405071884032,0.12002017729460682,-1.4165897179885605,-1.3118587659390695,0.0301231465205895,-1.1663834668698616,-1.5720039135445278,-1.5197021421149537,0.3151399427945928,-1.5958177918265584,-0.3372178426749242,-0.9119328588769761,-1.082461886579733,0.15910979372745168,-0.10065701668820579,-0.450570119245608,-0.5928273090194895,-0.3556201720006079,-1.2861409289841284,-0.9946989833749408,-1.169721523986915,-1.3221050240299475,-0.7106857409170192,0.38027762472030074,-0.06745381734294904,0.11494979112916205,-1.1628637841295655,0.01535902193221512,-1.3094266948160083,-0.8726890469408198,-0.449155046304955,-0.701267272213863,0.2916907763707295,-0.4338187541945945,-0.958521418391859,-1.2749299137181407,-1.2015858826597525,0.9852872083544809,0.4608053937546352,-0.8976706450570938,-0.030153903861374728,0.28386244197092697,-0.5908973222978123,-0.5641064941113427,-0.16595966867786355,0.7410597050697012,0.48551231928476235,-0.8193307367601963,0.8780129404862361,0.7097078422028552,0.6517337338029042,0.08530392064338457,0.3983718735748416,-0.2997598775340519,-0.6349117797430339,0.476635340917441,0.5867493281296301,-0.45546173211504026,-0.5803253887862778,-0.4622761534370662,-0.05148676608362373,-0.09934765788335187,0.2301810395211818,-0.9304777383751357,-0.6933149855227894,0.4626155192293342,0.7372752160161471,0.3843188736845316,0.15906368872952625,0.8860512097114638,-0.656129075190283,-0.4019173995225099,-0.19791869851230998,-1.1371739401974215,-0.10782224345578081,-0.08833836230413886,0.07959630443605645,-0.8619518465618229,0.15933577661390294,-0.14619830846770288,0.037133314896218905,0.5546887324831714,-0.7945638839395412,-0.4817203330585876,-0.9613247675497387,0.2395558934291686,-0.06134461341366334,-0.2774872594058961,-0.7911809065808554,-0.27805621823195215,-0.62686974143874,0.6759754021758742,0.6551827384928929,-0.9099588080659334,0.9647546801107757,0.21613007077195984,0.9519480842765612,-0.9178899031294783,-0.6708419004672597,0.9303401253064368,0.7189580891691477];
  
  this.h1[5].weights = [0.17018692321546292,-0.8487609987815747,0.12326646719910928,-0.3050137121099503,-0.1724444042219857,-0.9756989013247335,-0.8167892717670413,0.08451476576132055,-0.436433472242507,0.07760389501943027,-0.010163970115616651,0.6246406570005888,0.07655561711880945,-0.8398691429635509,0.7378929846738705,0.6903813804797516,0.2041345612850001,1.2735662279225826,-0.10708734018220727,-0.5947909582714457,-0.23216141589529693,0.865534327617056,-0.185320339623217,0.35720523843549684,0.7272006913657435,-0.36804935206691175,0.09969246136065069,-0.629657107110026,0.4121059467911287,0.7281168012920608,-0.030742970774045537,-0.46448938686776003,-0.5878309780512387,-0.1220786081877845,0.19727518615600909,0.14095719992058403,-0.35118750427527023,-1.2307082862253438,-0.1448488694742295,-0.7829994264788316,0.7431582904345717,-1.039270286544072,0.30122016158479054,-0.5356691495269047,-0.4405676001950901,-0.3944242339163812,-0.4954789718811358,-1.209865289323598,-1.2127555840853983,-0.8120139238418054,-0.3080909718290144,0.04749207858434014,0.03426493214411318,0.03034328509679602,0.2565436857693959,-0.4613351490871803,0.46507959839338264,0.0033240567940930887,0.45348632510508313,0.42897285200779134,-0.0758618166094509,-0.4262639192640636,0.6129104954079811,-0.41781835488164853,0.8321214819957904,0.46901241319207565,0.9558850487375185,0.9609999176568939,0.8607471615876171,0.35162724646972393,-0.8041035461681796,0.039235495597884404,-0.4721231675729421,-0.5693956921077067,0.3398822368823664,-0.18449561432536657,-0.9459270471403008,0.9720077485270602,0.6996598967073829,-0.6001097800245495,-0.9725689677539738,0.032783788308607245,-0.8174023510782468,1.1558198908653299,0.565111163079388,0.9947968279236713,-0.07575710565299708,-0.001104745326365569,-0.7860320349686096,-0.14351671256883605,0.23700041332887212,0.9425742282920835,-0.01373136147174302,-0.011070200473174644,-0.8227488787962486,0.5298313913076469,-0.8037550341591586,-0.8092587244331463,-0.41237002615018153,0.22702309921126013,0.6663983422148037,-0.5412581694243858,0.42371072785828606,-1.0527424017422746,-0.9291585815471349,-0.22016502388651463,-0.3519726086349767,0.13248618571462795,-0.38740496032305494,0.9971953602565289,0.5549129193666827,0.008361175514503237,-0.13041139735436832,-0.3106130753000194,-0.058134417851828324,0.06060109226063784,-0.9218342994277842,-0.8021088941607073,0.5569474126212999,0.104121943743067,0.5433080281047918,0.22899037553494844,0.2633663303968599,0.5584212005026298,0.6306533256880752,-0.7401545859299324,0.7335846142698034,0.6286602238195123,-0.6467831351975013,0.543351785031123,0.21833756002659338,0.7037809622981899,0.867102076527245,-0.9589440666035862,0.7898580145682765,-0.7490840901141791,0.4898545003308502,0.4134296956026149,-0.7013819942266641,0.5771405095105098,0.39519731852621454,0.07439703842560413,0.8371968141315379,-0.8234656053531848,1.0218987832119992,-0.5248491358339568,0.21836267275891938,0.9150860894631051,0.4938170418205848,-0.44740273562343996,0.25943061969290004,-0.7796406471968703,0.5680830008320792,-0.5905127873231414,0.723881136801421,0.4322301162129814,0.8123967833579091,0.8998493216723974,-0.756348297009427,-0.3575751405787578,-0.8633139033690945,-0.9218693550816904,-0.5962309637489204,0.19505514147661004,0.7741591930152979,-0.724856551569949,-0.05583198997320762,-0.4750136757885175,0.659915513274968,0.7277321836363115,-0.1566206294471623,0.6794014509706365,0.27419352332531993,0.04669202272655951,0.5890983471421297,0.9060300181397267,0.10576191915288867,-0.11453274472220693,-0.2621341358911853,-0.7632570645196951,0.5735243109500837,-0.061767874817153186,-0.3547996986648499,-0.49028665125756243,0.14465417540384143,0.3917403053650281,1.2767696449087758,-0.6163020967901716,-0.061107291425699976,-0.8229947099519221,0.8911754181563554,-0.5010916453861199,1.1099207139963576,-0.3376858958571154,-0.41082877521507544,-0.2953506491800259,-0.034536868347934464,0.3854775218826148,-0.4292824652538035,0.7172826028862624,-0.2739670207407552,0.6697069038125858,-0.2705612775527975,0.28008305028708136,0.6442577207373449,-0.4129966714911918,0.6614703220742418,-0.7349222361839475,0.42212104408830653,0.5845603872813514,0.4863699662433634,-0.5738442240797486,1.0842080291702403,-0.4265821691986561,1.0181515098139293,-0.44347961532282376,-0.18163254947995072,0.36841316798856544,0.4833051704384527,-0.26097312126668565,0.9752164049833513,0.053126998592462095,-0.39738889226259816,0.0354399952808557,0.7954418484165267,0.26510579733699435,-0.6591028082144235,-0.2217403564776066,0.29014862689838655,0.8241632853282658,0.7114857431437701,-0.05337565093871947,0.19655462281059785,0.49586280381614045,0.4349087825241382,0.7792095379057374,0.9138683195530463,-0.08022932955498716,-0.8069375840091499,-0.9321569871665166,-0.08324252702500502,-0.5732078650582852,-0.7739503514308105,-0.32418111228809243,-0.16129164763098008,-0.8006685426749289,0.3474076785932643,-0.48780772016794666,-0.7651453182712183,-0.9720008728717553,0.18102113455625485,0.6890754533776583,0.9905941140911853,-0.8636153814924834,-0.5347004037862623,0.37981855605817066,-0.5193892362304149,0.034269365784749616,-0.3629280075820656,-0.5885766624906018,-0.31130999361134304,0.48126986810968303,-0.7990233683894387,0.6766766262383426,0.3471979255427813,0.27434632598950204,0.5838052033992496,-0.14277916152401007,1.0685594369949156,0.5922686039469682,-0.5071193108770572,0.8797137548734996,-0.6495458037685261,0.20629886428268687,1.048175641319267,0.043370577643377976,0.8808988687130486,-0.8066016465663158,0.9231391584716373,0.2583107919939324,0.3365629487297311,-0.2727487061893447,-0.5040644004314586,0.5804525458217509,1.0691993159362723,0.09441216442715564,-0.8601214043302776,-0.36055751024927,0.4060427884713189,0.5813474774817656,0.20366427181125119,-0.44832647915362633,-0.14997088676579792,-0.4598076419802799,0.3595532083586075,-0.6376321206988331,0.9594917154698375,0.9702561127115843,0.06979310307933793,-0.5641201844253871,0.006651278151100314,0.38766175562488775,-1.0080975427299768,0.09444032472152816,0.3341887764982274,0.2462613030399285,0.07270724764259452,0.34260325613018616,0.7995753063945386,0.05503958477143888,-0.48144208186040316,-0.5089503418942641,-0.7271825067816732,-0.6041896864604009,0.2831326597462179,0.9134521974077655,-0.21309797817509857,-0.4340807906219503,0.20711540273494483,0.1151451618500749,0.04053161974530092,0.6842823128128598,-0.7381328010868567,-0.9762789605217199,0.9361771540247508,0.060299314924744614,0.23281238488200873,0.5806413998407126,0.8217842008768451,-0.7911750144812432,1.004375633399367,-0.886497331476226,0.6284065323960705,0.8688232079914545,-0.6501878917807964,0.1546879732615823,-0.3848251880032082,0.47804045692063196,-0.6636951355069924,0.41810942783099114,-0.28431769619968345,-0.45627316353391406,-0.17605248138130056,0.8477448377793756,-0.19523077430757382,0.2378816501206159,-0.45021760404100414,0.38842465721487784,0.7524424022731273,-0.05676277503810538,-0.803839141376264,-0.8438608525280985,0.5981113238017921,-0.5585819103902241,-0.48433148277719185,0.0704467868276003,-0.7759855930228821,0.8666319001231213,0.2516944133407271,0.502576333359025,0.7217359536641874,-0.3066942901762161,0.3665193531151927,0.16815465114202904,-0.6347007681217404,-0.174722078532289,-0.9750480478395454,-0.0372053519696389,-0.2807351127432497,0.9068196663635616,-0.3863521759342596,0.0023551375123602647,0.2708813887169071,-0.3317900790828686,-0.8568479455445454,0.016724348016387346,-0.11175171009323123,0.6520573911019506,0.27343509727583004,0.11923325366382173,-0.3802602719327224,-0.29822159271684606,-0.5494557964893664,-0.5433252276598589,-0.4716005929710225,-0.6446198657656548,-0.08876917279646745,0.4014248650051071,0.8970239656740695,0.08461661207858784,-0.5967475663896482,0.9272926598520597,0.1364784492260902,-1.1702365421654448,0.4628155687581934,0.6750219416799791,-0.2103686350916227,-0.533709167448681,0.22208501133258782,0.014932479271126458,0.16462440189246147,0.3237040450578548,-0.38095579552513426,-0.8764719281023211,-1.0780596747170232,-1.0075302490391707,-1.070890825310706,-0.28910778279246796,-0.2001327632046964,0.5227097516596048,-0.45320951425323897,-0.930750469576728,0.7120575603755641,0.116548440339985,-0.6012799950211596,0.021641040408209054,0.28704266212990764,-0.5305996078802819,-0.3465297634757589,-0.15610639199782106,-0.6857681349110402,-0.9964689047350955,-0.142088277318084,-0.2958764623203525,-0.35372416711124743,-0.44493406914004524,-0.3481579650796058,0.44103154699906444,-0.04299766336774003,-0.5439233261347254,0.7023818018732054,-1.1648858559630262,-0.876568510721703,0.04619257047012977,-1.0920621511068802,0.7134402486969441,-0.3294622000560806,-0.3978377260374176,-0.1727588238968876,-0.21919922279362855,0.3299149621949291,0.49903592670832486,-0.6359238072735534,0.0715203512144198,0.8450744856042598,0.6418532646675805,-0.9062537644180306,-0.35582958567967227,0.6041029137902677,0.8383859007813452,0.014614099242039573,-0.2707345783494315,0.24323200316440824,0.8554788043965937,0.7979110075328825,0.5634831950293061,0.5267994808204877,0.7811771070910146,-0.45710804109593994,0.7047013817595178,0.10240363368626472,-0.9252807292202045,0.18299128131728878,0.5448193121272544,0.41076082667478253,-0.3658946326874346,-0.9498722676081977,0.9864872319572578,0.2347838986526143,-1.2654262088542432,0.11873442742211873,0.15314093663163447,0.28955742189604966,0.789802854331882,-0.9440249030593557,0.16129625260150662,0.7559566619550243,0.6848513134111196,0.3308535570357012,-0.7524595185017282,-0.46680300854760454,0.5715572062845297,-0.9004410402360598,0.5535013530400075,0.4036381209294832,-0.9846196514506957,0.16137277640088288,-0.163086782909573,-0.23874786538881432,-0.3555148362989058,-0.5655069716556,-0.8293960258224723,-0.809412481085984,0.5861181244023231,-0.6967940130747082,0.4663123337558643,-0.3742532187238841,0.7358361707263278,-0.22336502660157237,0.1163270846858505,-0.5395190456575463,0.854611479708888,-0.27336940330063103,-0.8666175199765073,-0.6280012784042682,0.6129719966888899,0.5690191427278274,-0.0735620504326381,-0.27788435782870696,0.9581892422843501,-0.5823646662636015,-0.9284745725780261,0.10258985482189335,0.4294671263476608,-0.05867094040441396,0.7286927933573275,0.5617285239705204,-0.7186929999459803,0.23373183320792318,0.39045626532955163,0.21183843777476077,-0.5537160167663169,0.5979905884184663,0.2766004505831946,-0.42363268728173065,0.5345642738468028,0.6922041005493428,0.5746168802195936,0.39821306842038284,0.5603516270006584,-0.3926242343496127,-0.17169928814863594,0.8451760233750727,-1.2543220753210789,0.585466515359442,0.7894195981344687,-0.6261242359037372,-0.296951459952376,-0.9997320394520381,-0.31612389900066135,0.025307329211228167,-0.6521654186301631,0.7777176443727291,-0.6994778920115525,0.6560170551935486,0.3344243340982443,0.5024905136076465,0.28150898780981537,-0.32779635906050797,-0.4212771498218477,-0.22135211274532862,0.5303030698645783,-1.0117260679970355,0.5993351695672943,0.34321507428859077,-0.6623617150247276,-0.2725892099507743,-1.0520925196823696,-0.17778974345819462,0.5778728472578764,-0.48602466748383216,-0.9199367790293018,-0.7075627741479859,0.5595984337622282,-0.8957332249742691,-0.7003731596727796,0.00392139771987647,0.5832745481597471,-0.3182813213052608,-0.020452613736219243,-0.057605760431207124,0.7914360086838071,-0.14985866061594041,0.9345848929705461,-0.3191080091384355,0.9527231831970757,-1.0124772408973426,0.8476218044286206,0.31292249536852773,-1.502331080122058,-0.13409448687427156,0.5048934272690776,0.7740286986097751,-0.6881323979462312,0.1603219077231361,0.40997911444280805,0.5987831606885866,0.6362961138112505,-0.9102730895740261,0.09175836618910621,0.32223054627791176,0.6583353724960935,-0.4406682610791681,-0.5486732477828499,0.8614313875276932,-0.7518492479697634,0.2589547261592784,0.6984592855435584,-0.9193189126374287,-0.574001186232374,-0.19414358739206064,-1.2121776500110488,-0.7334676720041586,-0.7321804055391755,-0.02988604165378713,-0.24716257970284072,-0.8879429618238486,-0.8967366565687813,0.6151705870688353,0.6255205988018654,-0.9995628388884508,-0.654861062078697,-0.5381640732723538,-1.13013823176671,0.21579617826502964,-0.10808768746604476,0.6529049783868744,0.43550728098007513,-0.581825404690781,-0.5991324429039384,-0.8087307047818999,-0.7618704375939565,0.7732978998341576,0.6241339954184856,-1.0063666446310433,-0.8600150725715767,-0.23163788933334928,-0.02343398766691613,0.805490324274472,0.04893987009044608,-0.24091817197426435,-0.4245345299339707,0.5205779528203343,-0.6879673232124421,-0.06777065818508937,0.28913239646100136,0.7536276927716437,0.3296269599802113,-0.8737420185520386,-1.1047404898336823,-0.3551175611559425,0.44523746622060734,-0.5205945173428788,0.4606070008632388,0.7024837978584397,-0.20358981714848226,-0.0021012231172135042,0.056836584040988285,0.9782623387700911,-0.21820198854164435,0.2527690691355377,-0.313010189704127,-0.32429441928469954,0.2874360782659556,0.5501118556845775,-0.1547119194810358,0.9170033121951648,0.8405700380063281,-0.6565988264860192,-0.891534553957723,0.2797095072004683,0.503741261407472,0.2710355428864664,-0.8803436575354121,0.23204426288698476,-0.08167463206572603,-1.0743650184951126,-0.10162003128227716,0.18643406346661018,-0.7636987197864699,-0.6896802025093303,-0.19329999867788844,0.026966478668032784,0.5885445706454508,-0.059482273683173596,-0.9590446473776044,0.5737906032387671,-0.7669766363083782,0.745379288793643,-0.6013754818463052,-0.8187580256889215,-0.7761006502829589,-0.21607606163316828,-0.2541406762422075,0.1470538687513956,0.42901624839703234,0.8186682985324757,-0.64148437169001,-0.9087134079043709,0.5626782412729853,-0.3937990910322845,0.03676202543134952,-0.6874680031292072,-0.970079208394047,0.02850276141388591,0.9470992167346063,-0.981239972414128,-0.5114079066966475,-1.1944843332669857,0.8845518463997196,0.5643410131600906,-0.8444807438458615,0.7778565194415127,-0.5722218953817312,0.7153738419115863,-0.4700143838398467,-0.5749144382593072,0.7411572722454904,-0.6595016921176406,-0.5642553740539208,-1.1864148601251558,-0.9808023793492342,0.1268800828654847,-0.027587576043978684,0.3065747685958457,0.015060221449453967,0.060506945162969034,0.33483611767971716,-0.4525347225738277,-0.46634584562805426,-0.44153306540304366,-0.09863087007789752,0.3980898055235439,-0.2724658961015705,-0.6623938550331805,-1.1589349823936168,-0.6058381588481442,-0.12021776323281906,-0.5750014603555766,-0.0037266186065503747,0.5377921616542335,0.08269148142021802,-0.7117585398598049,-0.048683250850460186,0.6264558673852202,-0.35949241388650427,-0.6865961858259482,-0.6871586266739478,-0.10215067322704512,0.18979866690781647,-0.35272680025265607,-0.20228641882004694,0.010779058393262694,0.49474140818190543,-0.6444303195773976,-0.7620729813541899,0.37329281784148977,-0.9280421207902516,-0.7978564366217886,0.7591440059747816,-0.2670623175754913,0.24542732778678725,-0.19535318149968578,0.8371797428766015,0.10250497832900504,-0.5280132651974185,-0.23327932762840944,-0.11189990248399018,0.18700306722554177,0.8600937441737038,0.09116745614019164,0.2874902221028364,-0.2107076288726999,-0.19960686777079,-0.7578217708730633,0.5275729153621345,0.8174459499356813,0.28061324910155044];
  
  this.h1[6].weights = [0.4005246148194632,-0.09120145109167899,0.8886585744624362,-0.6998747256336468,-0.03204019721531548,-0.6723338472793023,0.08823653437708856,0.626396524334961,-1.3339290493018383,-2.054330667227033,-1.1434750609451199,-1.480538082602986,-2.5898962475295284,-1.470788460170579,-1.3709915446289649,-1.3971758307913276,-1.7502759756812962,-1.578583859193405,-0.45596391002051384,-1.6064530062239257,-1.2773698724369091,-0.501161420609891,-2.1705465082835063,-1.6049066509837924,-1.5255483258914277,-1.4119949599034203,-0.9998709032807708,-0.31643777039557536,-0.6441563518952157,-0.9643662682311935,-0.9374992235104705,-1.3323357089570558,-0.8695407142604807,-1.3392358415717593,-0.02450489219332958,-1.1882283056892764,-0.9599552438171284,-2.0590524384791937,-1.518911123101933,-0.4626003253450456,-1.0488054069224306,-0.17772441016158116,-0.43840050821717136,-1.4883984540043451,-1.1819972364330713,-0.4642586852767491,-0.675983121940124,-1.708968742296237,-0.8902912044516424,-1.6230557972743154,-1.566042630349747,-0.34305854820631465,-0.14314776849048624,-1.0046571210528545,-1.7797412196471574,-0.916829246128607,-0.3587222776080643,-0.1374366989839575,0.9309260354696347,0.7697759827447692,-0.5909485500475316,-0.48610339399239466,0.21670602088008772,-0.937141460884813,-1.9440349290216652,-1.162657912975532,-2.932778666784826,-2.8988063688687062,-1.433435661572389,-1.3643432603659034,-1.855472217373656,-0.5892456575180436,-1.4485162729007148,-1.7759389908843888,-3.132416258821358,-1.8241954873717585,-2.8236560612222172,-2.0647840058200573,-2.410758479838763,-1.8505033495552186,-1.6051463171566773,-2.595431510538131,-1.5708267599912085,-2.0410405909067864,-2.579024362823346,-2.7434546698563107,-2.0926293353902405,-1.7401089166506318,-2.2442001653682255,-1.921267768703186,-2.79924427383309,-3.3353508437339547,-3.350865906142641,-3.337492963390217,-2.0151854173845334,-2.695556481616385,-1.952076077764806,-2.988646108974439,-1.9990573069251871,-2.197867520928895,-2.32170971640482,-3.591408137120351,-2.079295583678615,-2.185684812298209,-1.6746509984230291,-1.6013463383129454,-2.3654577685766904,-1.8130784519636252,-2.4139362116171283,-2.6369173289878587,-2.469488837542284,-1.2227785039551977,-1.3079737364838033,-1.6473033865232023,-3.0669192229749065,-2.258660430387007,-2.2942090094776595,-3.043591315096957,-2.104723294820102,-2.6689933660999223,-0.29851334494893444,-1.4843464197087277,-0.9831492328078805,-2.9359469991964815,-2.3693635382683613,-2.2385301404421303,-1.4269317624400755,-0.9310685975222168,-2.0292086129348483,-2.308561940460767,-1.4786897662743197,-2.083833850099613,-2.7328133893545288,-1.8187635096654222,-1.6701711151975978,-3.3048992627262708,-2.5057595921869833,-3.329840017514472,-1.8375062179091406,-1.9028204713945267,-2.2179214883880443,-2.008825985245921,-2.6228110390040573,-1.5259206213771448,-2.412690126341325,-2.7114759448343655,-2.9288526959394905,-2.0862373886956407,-3.559597378924231,-3.389042404878912,-3.5000821385010714,-2.090115568769686,-1.5925422138190846,-2.5354636404315123,-2.3760946685075846,-2.6453492176974085,-2.9280464678282554,-1.7348609463681346,-2.3894280791573603,-2.895003162082604,-3.0177763407001725,-2.4278364246655717,-3.555064807806525,-2.6507103429523236,-2.891118764576763,-1.9524629760022876,-2.899559488600024,-3.361862618548314,-2.4330352763588503,-2.7700390273137225,-3.5671631427039068,-3.545742378564428,-2.0691449912978874,-3.1544742372317898,-1.7303590600064378,-1.7035405740372689,-1.5942369024180658,-2.509769337017685,-2.6846263285377208,-2.849026812451767,-3.8067966038304695,-2.3024032259720735,-3.7026388750522337,-2.6299131253763592,-2.343094821739786,-2.605679662704982,-2.218762575054128,-2.7709905402686927,-3.020028626885651,-2.13568731511033,-2.46605271190093,-1.4125993324350823,-4.154938920870619,-4.635970974926112,-4.875593897819995,-4.454138665085346,-4.960646204365521,-3.103474574391797,-3.175113508287454,-3.159004167732261,-4.550459394768968,-4.7592156767571785,-3.0608495728394884,-4.374282502074368,-3.4099309123690684,-3.917255443132906,-4.563076907846535,-3.556207184472305,-4.415148170018206,-4.2729377663145005,-4.364445733050984,-3.358907736250335,-3.6486778719136614,-3.162473497726008,-4.14786131422909,-2.6621677068030785,-4.151025079912247,-4.529135614309377,-3.692957745059646,-3.860204372183454,-2.904277817827856,-3.874362893683724,-4.33620840501924,-4.264398158664699,-2.688024955147701,-4.3159596377527905,-3.870494030973854,-4.046692433424337,-3.4385434270832183,-4.030242514642999,-3.865142517441999,-3.275921494515469,-2.4190129860229295,-4.072670250427751,-4.394017992865873,-2.864828695558759,-3.879643909119175,-4.009281049997287,-3.9169916807532834,-3.396026449897562,-3.7362790316565535,-4.109911277271792,-2.911713032076887,-3.8546887309371205,-3.6111945730271646,-4.933339778154431,-3.1914795275428247,-3.2327778421787703,-3.8092919828829426,-3.1635723220724006,-3.8138560170545075,-4.608070289842265,-3.5977573162768315,-4.137490692868429,-2.420928240384564,-2.823378105916423,-4.34310263613914,-5.02861884621795,-5.683504040341803,-5.494307724833314,-5.389303398722652,-5.326344309677028,-5.610642834807074,-6.0554659918040645,-4.162477824993806,-3.9577331615783304,-4.19731927950873,-5.050491157559273,-5.0242582244420015,-4.468376506408792,-4.636567852193999,-4.35983356935203,-4.773294077454333,-3.947905859895329,-4.231413624599961,-5.262622449223618,-5.811169418169355,-4.739779403368175,-5.439117163555714,-4.947406881322699,-4.585429435527436,-4.780576312337931,-4.872925377564932,-4.867124594189505,-4.778461136466577,-5.109753839346828,-4.9816160961719,-4.90127212969028,-4.011145585852166,-4.737846186930833,-4.5423308583594295,-4.325501149658285,-5.547394857154794,-4.636451118722684,-5.134137532095924,-4.707793576564423,-4.483322777857043,-4.7310856212532855,-4.697077886704024,-5.749895918783587,-5.203080212363593,-5.05295682466301,-5.552829607588938,-4.60784929206125,-4.576381281955977,-4.9331774297877375,-4.976676373392237,-4.52265560253665,-4.850233197864409,-5.291962067537136,-3.8883520203132718,-3.56871617058661,-5.0774270481168555,-4.076888595654251,-5.879896798895039,-4.9658512600389475,-4.65987996605982,-3.7486798861721278,-2.3142766100801784,-3.6562271682075855,-0.015588652745543155,-0.3781050414348976,0.7803770304020757,0.10909462940386026,1.1723928118554339,-0.746711202892045,0.38814831931727334,0.08309206707303508,0.009109672438868514,-0.008528470705666178,-0.9024981959504177,-0.8173308291479365,0.19422234007543543,-0.02133988873842433,-0.03549443322166834,0.2897864751533197,0.16547928490129626,0.4511439875460244,0.5745485718449743,-0.13323558651017595,-0.5076713709499739,-1.0653711139179456,-1.058435565784908,0.5679135139415039,-0.2931719268054545,-0.9811103683237018,-1.0906041353926315,-1.0362515828395558,0.10779026186933874,-0.6999073459372006,-0.6941355068771491,-0.23947946053852537,0.47732636809902435,-0.9082789104359152,-0.7850035952752007,0.3437055917404156,-0.23798357891323496,0.13833280694400668,-0.060743092582712314,0.49270813728862867,0.07099840014136001,0.062119450032359004,-0.7566877405110438,0.48776722220246704,-0.6983744302901104,0.5249678594915446,0.023035770907061583,-0.6375778324577355,-0.28999577190732534,0.5197671802333503,0.3026195558798462,-0.7085541107233824,-0.07064269226383821,0.05121609572989773,-0.8722400295082237,0.343663621493978,0.43987388322506543,-0.29921629448578935,0.36941966545371524,0.018385466578971058,0.057562566017220776,0.4767359588422846,0.3501973178536703,-0.4823532650339506,0.9090257622034845,0.6392901936854298,-0.17643206111085208,0.7271116726889879,-0.722796776330406,-0.9614601186322722,-0.23770516549379872,-0.5776037392894087,0.5783584906564673,0.8004532812442626,-0.3082980753959739,0.7204373849648391,0.34066977089036754,1.2101589727807933,0.30404676361316296,0.6612759457234573,0.2540566123359639,0.709390016059131,1.284545217136418,1.3617485063954469,0.8178764512338988,0.2307520040638984,-0.2999078787489981,0.4267676299957849,0.30453559960662174,0.7602949271633311,-0.11128695631638331,1.7159973111561084,1.4001093017636075,0.6092747781070189,0.7475957155639453,0.5701248548315133,1.2018680868391844,1.4562237506634386,0.9954082664553843,0.05808968800917192,1.2381966551451455,0.5146774780653088,1.1164145740607183,0.9402684994132113,1.8696113262477343,1.965013865691521,1.4368298708657474,1.1558164920948457,1.6588009060674582,1.4441546502349536,0.8859002127984096,2.0228175806937867,2.4856172201970232,2.464151018701897,1.708787548514435,2.5693443429585856,2.1357810117701685,2.3792340383726036,1.3779775535068108,2.257161958974498,0.19661684098977705,-0.637981453284008,-0.1568355890314277,-0.846623102102392,0.04852318622273488,-0.2687607332530013,-0.9947326527770586,-0.7596415840613386,0.5092921994561745,2.3757878048922176,1.9911034463729436,1.2354415514323247,2.437437541636833,1.5963766782605953,1.8167120877988734,0.5186634019833011,1.4226504573882504,0.7996586415368618,1.329873624178099,2.8411193447820997,2.344349516504593,1.4440423392437305,2.170331497594715,2.189096964736953,2.040389812404783,2.3750044036961406,1.9323592753514973,1.1520690720161142,2.321637305237939,1.571145845909913,1.9612388436145496,2.7529538427816718,1.9088550693004878,2.3668182059892757,1.9843617758084695,2.5207413311503526,2.143329806970801,1.2311913067002018,2.418399724209559,2.6471476546359396,0.9579689380638678,3.357163341944106,2.410697859511137,3.126090186983925,2.142662316845855,2.8810986667331084,1.7792238206694908,1.7967900616818264,2.6507132708425454,2.0477909097668157,3.362317564266062,2.4342492741802415,2.9309015135895127,1.4623621142345387,2.5361288439766043,1.9047832117690493,1.9813350781671197,2.1258013963771267,1.8204869715671441,2.5660032771447234,1.4701609269618554,1.7599745365972712,2.777054149618901,1.2853866795564775,2.6696326017186927,0.5952744708013159,2.4941777920852903,0.9243013678834715,1.4181587736206211,2.341420567575622,0.8601655904645727,1.838823460251504,1.4719488606646198,2.3477766956860924,1.5721822943115722,2.6409601095373225,2.5122808295734234,2.0664162011903233,1.6318472402889226,1.9795966118443662,1.6716892172262474,1.3254044290114868,2.626620372312558,3.053267548844562,2.2671730373976016,2.9210608500609148,3.1210339537765415,1.617942950096814,1.5609813829496555,2.5452616885418218,2.9619724430309007,2.408617475502984,3.22584343255824,3.263983868915733,2.5437058703315305,2.5866028937771235,2.77369487746171,2.524293066249683,2.7866652760088426,1.9449989187637855,2.5124792672640806,3.2467519093413366,1.8894368767693588,2.4006727713970357,1.5405845360327772,1.7928572634783047,1.7885424326930106,3.1849118915213945,2.196506125162754,3.48437699139328,1.6783389118200407,3.269422746671736,2.5029412481389195,3.11909424105956,2.95633731142166,3.4438656381978596,2.6064027634652267,2.817916900525529,2.497884130090718,2.497477916511526,2.547689468866649,2.6951923153539084,2.6891684587328917,1.9913438819556641,3.024073268355531,1.9452828705743883,2.021903379807482,2.3366889003975495,1.5024367068925104,1.1469903438090183,1.6545339101719096,2.173205940795299,2.266452339483251,1.7438824711270948,1.22901136383301,1.4670288768515625,3.7497530499806606,3.5864208751393725,4.0268025946017945,2.659432243783909,3.9122974771944143,3.936062604724021,2.3602878185418845,3.661191205350425,4.043022293306187,4.155179506879285,3.959064051667692,3.2310192813902634,3.4430418391686977,3.707991427928391,3.878147800279165,2.441322503018251,3.460824334387164,3.7608816737267157,3.958606060457849,4.144461292868163,4.50938359387324,2.9081055235572433,3.0159845947313983,2.7188071006889634,4.0654949296005345,3.1064350274106194,4.337672467378255,3.1057631093225635,3.8786840854396396,3.3137713879088233,2.660972075040907,4.64774048457419,4.195254726788989,3.129917169506248,3.404150617333064,4.1490547641786,3.4051305361399447,4.359895236036431,3.2187712843230325,4.35007155311249,2.6623829976017324,4.954021555251235,3.7913903965281928,3.7680345184644195,3.386459405335917,3.7265291163754903,2.5703784540438974,3.8864412679215863,4.136275011217808,3.887708198357812,4.006155377798239,2.826862604188329,3.171164381203447,3.704162558586462,3.3766963606303033,4.188783719708343,3.009948971659712,3.714305243548718,4.606355696044624,3.792755048590659,4.411568774044147,3.197049160445749,4.035542991090469,3.803831980080684,4.6450419444833715,3.2707548467130128,4.480323944751938,5.390504416497206,4.230502533035619,3.5800162573113727,2.803097072435445,2.6899859423108823,4.078872420209787,5.5664090219830875,4.143195689234666,5.107636808871953,4.486172287303782,4.734622227271834,3.882477433352758,3.055397156077449,3.35854227153782,4.855318983523507,4.694421791686179,5.465390860902304,5.278045568497926,5.513160619070376,5.774701100432719,4.320754572002791,4.946622409008301,4.591170994979286,4.114896951551791,4.853791632988452,5.772517023097332,4.603183696142153,5.256484211485447,4.5124386230277835,3.5729786656880584,3.9813045812381813,5.019999097314498,5.032757803015208,5.887983663333453,5.965795705152373,4.52350460349354,5.41102220000658,5.478121881952885,5.254359266742891,4.413273215325966,5.416011821336154,5.128094931231439,5.1140685192970485,3.9063147674038743,5.5659339769789105,5.387154041019671,4.410898372163115,4.194211925884634,4.865409126125828,3.780439127146202,4.86596500906576,5.18972361014694,3.7815045677537125,5.565399319112584,5.145787845133263,4.517035280833277,5.617751263697693,4.730188421172372,3.9599761912808504,4.920937198167385,5.503137347922599,0.09744633314627314,-0.07431725451642619,0.265091557637323,-1.0490993244060713,0.05864548499377928,-0.8895757555297189,-0.8138633518391323,0.5789669274892366,0.5217604202448639,0.2968719827807054,-0.9058653139076158,-1.303452573776375,-0.9502481841877195,-0.8916433588795949,0.4139116326658706,0.02930759744999511,0.6064631220289626,0.9803098524631375,-0.3481072277641475,0.06707907265830312,0.5163010888451312,-0.33782202606404094,0.047498728035268306,0.63814345021164,0.6637838991951084,0.4613438798323788,-0.38883784827628814,0.33124502395753597,0.13456613827208588,-1.08050062454485,0.6009389496307087,0.048252334024823026,-0.576842437919,-0.5574694809226624,0.4780844423561615,-0.11494029419488787,0.4366893306592869,0.7110672433955125,-0.5561136531246269,-1.16033841444738,0.5800901299467697,0.575650013328281,-0.5004865694967048,0.6748566860187543,-0.7238096688869963,-0.2468319256114334,1.1619710010900033,-0.46784043310319434,-0.7166532003468808,0.030107833909989258,0.7217600142637497,0.7267968341615464,0.5979684833029555,-0.06839766288679906,-0.593019766791634,0.2623088291676801,0.14334068230211955,-0.19448844750364744,1.0209569178336542,-0.29979385630208455,-0.33281039280388275,-0.6029014551811256,0.15204918591223326,-0.4036092424966833];
  
  this.h1[7].weights = [0.9567923954118509,-0.03458791901261504,0.8068183424734618,0.6371036296318309,0.2696143577774728,0.08837126964368602,0.3784462453258919,-0.5521752811724037,0.807983103542746,2.199056709535771,1.1127834675632209,1.45722422330002,1.4134377143221177,0.6209035839565124,0.9509050635011608,1.4128872097454894,1.42702507505072,0.6843162131777433,0.38018264968494364,-0.5944922306850504,0.7831565027182151,1.0288002418987567,1.6148273271839795,1.0953288686525753,1.0176541315642331,0.3242702086862334,-0.1321750234383385,1.325548378151585,0.8649224068270166,-0.023935003918086322,-0.06502765797026085,-0.7912046837334674,0.43553937265569026,0.3962911133215283,1.3648640267331806,-0.20856137131097155,0.5844363733927225,-0.22688059396959256,-0.5358486036780925,-0.8851820672578553,-0.6624212634828003,0.7174812984250579,-0.010862462716980648,0.9334703956966202,-0.8053443707600533,-0.7959943211076366,0.4392409597038237,0.009163461052733815,0.14007077434427412,0.2865361270451417,0.16511914363081862,-0.038530708491984374,-0.32817058349160455,0.32470242507404334,0.16632598901833678,0.11339216854506112,0.2787298421039077,-0.5777058825183916,0.012853641083585554,-0.5677181473080983,0.12398224434147886,-0.007890039623637879,-0.36491832098567745,-0.6173307604168596,1.0763472659567248,0.11380648945789372,1.2324374983717306,0.778678425143012,1.2866183410096113,1.6772089614101537,0.2867469233671775,0.9481924382141685,0.43915275103164786,1.710535189420559,0.366872700406373,0.6187161321093809,0.48229285562700985,1.172180042407519,0.5752071148903198,0.2690996804729773,1.5774002961018896,0.8699025905449187,1.902158414773937,1.5359287739223024,2.3326187894971375,1.8157157198692746,2.085187009138559,0.460352704818744,0.6386265941305859,0.6126417355330416,1.8085666006675745,1.5459060606231194,0.557550282283882,1.0681816750322548,1.598511688127113,1.3187168947007684,0.3875285546834961,1.2004753101508034,0.8604480458468967,1.4892716050768053,2.3463732933286066,2.1738181566887538,2.151557687983393,0.3040422944506857,1.1706903788375755,0.8912203312555177,2.5785743087151753,2.078954665413499,1.4688946015230977,2.457635200571247,1.5362635609392719,1.5363615601266938,-0.2925485119205621,1.0061419773019926,1.381688055819237,0.9987226777025318,0.834941857805039,1.2475937189140776,1.2027768698009382,1.005839589805265,0.2738813371110081,-0.0200092808368738,0.8076329987743461,0.11506800450165514,-0.05704553478187792,0.9109414377811235,1.3045809735895875,0.927828269640153,1.9613849296640231,1.0150785897633907,0.13692767219623517,1.3422985134526915,1.6187269373113997,0.10349152977327779,1.3417995230527315,1.337926853114742,2.135690392285982,0.8241033251250554,2.0473166908688287,1.9437774352038386,1.915356377572976,2.032070454764173,1.0144416620270387,0.4694779639711863,0.5890197989696192,1.3773302360511017,2.1637521436929497,1.1556468897917098,1.2284664119961388,1.428739133325841,0.946309675001552,1.0444889702123026,1.1713025534806758,1.4657381365506317,0.8067290665820622,1.168021179999819,1.200271502972812,2.1556626979952607,2.014584792570534,0.532987900993388,0.5255691570661294,1.5579445097001492,2.4328641750306823,0.42679610281814523,1.4569427354200144,1.6984613795538435,1.2417074683015767,0.9723511746827269,0.0823220734497627,1.8772374939136813,2.288353879819291,2.0545373613247255,1.2470833111374895,1.1606247764116078,1.3926494692130362,2.326248711958357,1.7961116691096775,1.9389538650324198,1.165357528016653,1.4724245627114119,1.9054325580980975,1.7761379079050506,1.7817729809812752,0.2796814297017275,1.6526425393096493,1.139506273878003,1.0889148581088235,0.5017002699251359,0.44515634056117487,0.9985073471658337,0.989007015827141,1.4123186742158327,1.6116260518441876,1.4867612093220754,2.0333582463270625,1.8873626296378665,1.633425301881238,2.1428618101211585,2.817914156557712,1.3705275835258173,1.4124438941816524,2.8284504425650496,2.405784244694377,2.036282418360277,2.8952237737377273,3.1743335868475526,2.090356955114978,2.7827467270282065,2.9238723018269046,3.1595605769187487,2.206050731700614,2.8352539706622175,2.0248148537513826,1.6775335815500616,1.0833664488880497,2.0844351914520325,2.5271495391640393,1.8259801506125095,2.1400747343633766,1.9138579985073316,2.0573103391157455,2.7286165854690645,1.378597263632118,1.7695014963160678,2.6381468655996225,1.33392945148513,1.9566633975906431,1.4224519423782895,2.0395996956926847,2.847616212144832,1.2105439210102982,1.584860616277708,1.7269059454574684,1.3943304127041851,2.082247520522671,2.5486040876687035,2.8553614376487166,1.575037256573404,1.3805262724741605,1.7625071687617075,2.119893604249035,2.339292923705067,2.5777636739140415,3.03994180635308,1.6686306052328612,2.5829569468542264,2.9462985772434616,0.7269289459822534,1.8358992593021,2.1713431891195447,2.2870896396773817,2.286476034353766,2.234596379065698,1.9080198965409894,1.8306234635790624,0.8910026757378899,2.2824804564071144,3.4769589791024487,1.8495851766680766,1.9931078304488725,2.4012542703017523,2.736837527264374,2.711515254452702,3.4714836034881693,2.2840070204890512,2.922370903786036,1.9525930409876917,3.4659947451337536,2.7984020387353428,1.3786985223494406,1.7136398785313371,2.9062712928615904,2.73138765665102,2.9479555096567065,1.9377804250665975,2.656488961784226,2.6751841069969244,3.062076212362615,2.3412102398126384,3.224715167709393,2.2043538913973273,2.2686043865981977,3.1323018084061127,3.7416636567955894,2.962655629594168,2.863183614541924,1.7157829768353103,2.365990378150858,3.3067846816118784,3.209268341582535,2.2992957251492046,3.6826369945059207,1.7068033972294272,2.3218613061081923,3.1981392166969216,2.7574911627760654,2.1238423816596805,3.725420169418775,2.6113388443271783,3.018827639193033,1.8605907459302753,2.8290874535823765,2.0744819486979855,1.960913284137363,3.0295713422618107,2.8159906073172727,2.420220830516281,3.6839425429984014,3.1353556498034236,1.8723722687885194,2.721555997074463,0.5569347487108153,1.3710529943424221,2.780617098254181,2.221541886811145,3.9409135997109472,1.8136691227219168,1.0640552437718533,0.8255625609357023,1.6189171429468276,-0.8927712466883454,-0.7304125689094844,-0.939632270298854,0.3767035693678121,-0.507130586950624,0.7241527358835861,-0.25100190309324744,-0.24701489395658763,-0.13234678608925013,-0.6730564486651496,0.3642776016107267,0.4769209104480686,-0.5617624253758345,0.3461609899288158,0.8718149336549239,0.49638995964948995,1.206014279821826,0.006458113075983551,1.1306195728791366,-0.42737136507772144,-0.2661745124639423,0.9722902769554245,0.32352052188431524,0.6991775596834335,-0.9157008789764022,0.7974685597465523,-0.34519837455088864,-0.14672663026427743,-0.3593026458934321,-0.6932057820746407,-0.5424052019207292,0.4214368886251211,0.09029658567237347,-0.13224303624383288,0.4046335897359054,-0.22074218928495376,0.7438305941310939,0.03606539178661397,-0.4958622325728419,-0.2648257298304778,-0.5385616685880835,0.23252749785663632,0.7413523065452102,0.19578131947312297,-0.502626769270976,0.01895565790158649,0.7477209509251019,-0.40849911661748367,-0.7292436777500084,0.140246563781089,0.21892224037938707,0.5286232602743013,0.07625970317559014,-0.40111024844240956,-0.28960741291228354,0.18026040517649608,-1.0634950183461658,-0.6916146315361908,0.6746436270717319,-0.06701481944315374,-0.9994732441182176,-0.14003404638127953,-0.9779965034275012,-0.3845459986262713,-0.04998829240797553,-0.352855424667875,-0.1384915662578572,-0.8749842228687519,-0.42372769906760377,0.38950965562459405,0.2503209934320858,0.08561983252150984,-0.98772332010493,-1.511474841911873,-1.5358702573615948,-0.29467358933027454,-1.4219780630944479,-2.1115526347850544,-0.15387849005715695,-1.2440930609140313,-0.3964120588766473,-0.5735861415645495,-0.7764065070892483,0.13489303262675842,-1.1717863571496625,-1.0159986623810284,-1.0867659690387133,-1.2098686849729505,-0.2833547219328117,-0.1936066665844123,-1.492828669535224,-0.25818113704158957,-1.052538595674166,-0.0809696827304378,-0.13575546038490144,-0.3781182207100306,-0.999861125062912,-1.6276161901603245,-1.0794640401634328,-0.3565226049067149,-0.14864210518685309,-1.5927632438522852,-0.9086754968977636,-1.1569687119636791,-1.7854509750910827,-1.1363144297705132,-1.8557864543974611,-1.1966174095263296,-0.254997763578317,-0.38329016276668026,-1.654729465911311,-0.9121371195616024,-1.6926403616177301,-1.0158201953611097,-1.5958422909254921,-0.6990198522270525,-1.6079314561319564,-0.27050338701609494,-1.6783370139084828,-0.6542470972129308,0.23549064012659215,-0.24222587515786032,-0.78137567161437,0.6680006222028538,0.7101302338960762,0.9081618742571465,0.10539785367501198,0.40808816020966754,-0.16925256839602315,-0.49262558472473655,-1.482275877155984,-1.102963444976292,-0.5233070352641687,-0.912620561821984,-0.24512297526749513,-0.9987248869191402,-0.689474494628856,-1.6815151484310937,0.06511561436984531,-0.9390139886698791,-0.6753699223532079,-2.0154035774377124,-0.2425507520986143,-0.7305650478592225,-1.1037301676879905,-1.596967083857079,-1.6253602708711916,-1.5061663819697686,-0.6816116046171214,-1.432367572912455,-1.7500540836983098,-1.8732748986901575,-0.5563693548029958,-0.46574005949658925,-2.43087139110336,-1.233478910961464,-1.0153135631979844,-0.7221438103014716,-2.0897910512482034,-0.4541449123382912,-0.9533695656305791,-1.661908894284716,-0.802449961347093,-0.8366244641679768,-0.6156258373888096,-2.1935031362902677,-0.5353733914935076,-0.9595128054399301,-0.5894848513008956,-1.4794907311834071,-2.1346202051702337,-1.9250503823359626,-1.6706067787843295,-1.238304455919993,-0.7118397860389037,-0.9377099217715222,-0.07920328751886907,-1.043862404301185,-2.264529065245022,-2.0598238339834447,-1.3132709044848412,-0.7426467140445844,-0.23739641020696509,-0.8740063394266339,-1.4866801240856031,0.12139670540543021,-0.41272212187746793,-0.5843921470342806,-0.5682736054703478,-1.125548786649282,0.13994985503589424,0.36460832093550166,-0.9352982011770654,-1.9400566494829778,-1.661807693908328,-0.9434522535630475,-1.6282632987359424,-1.2344689763690493,0.1804911474428271,-0.9678997322924776,-1.6006580753816932,-2.0376998223030025,-1.4890326074565576,-0.3744531432436928,-2.477081289879026,-1.8313644155171722,-2.238651512644122,-0.28176527931239737,-0.9382277214560573,-0.5879328314512218,-2.559500021149749,-1.9313921980757767,-1.2402260410622745,-1.140124820311627,-1.1287885813084209,-1.9726136200854607,-1.4959134244941876,-0.6695933588926947,-1.9146820394194972,-1.3322898755796009,-1.4969371753660592,-0.7744698789044749,-1.1686202805516703,-2.3581236299623307,-0.8039889763201414,-2.1584493088625103,-0.7007326763033587,-1.1431234669679131,-1.6153907993551206,-1.3561383290163083,-2.341309394049134,-2.2310750915445277,-1.3564421851813249,-1.805644817367291,-1.8272513196974383,-1.2739255226537103,-1.7941836846663162,-0.590869616107855,-1.4147266762184556,-0.809590286568456,-0.21761143583477732,-1.490649464384755,-1.8138141546839905,-1.9944803016461863,-0.5824551709267264,-1.6477808902364595,-1.6598706287331528,0.03049922129521322,-1.725265581355378,-1.7397947780715421,-0.24126952416252698,-0.39720446567672374,-2.123112738227157,-1.1776480849555073,-0.6041707257373798,-1.0598399356003205,-2.2465120501415705,-1.9419584248854709,-1.4798770014545901,-1.935996888921572,-1.6947389072301935,-1.8029668417909028,-2.1496067886401007,-2.788746155963658,-1.5913829090713778,-2.5568807988846305,-2.545899469899076,-1.822114331857411,-2.6461006747821534,-1.3083241233520086,-1.181741040205647,-2.4170833129195644,-2.7568064962135854,-2.612514004678483,-1.94974110842089,-2.6959806746918233,-2.3894227268216905,-1.4841798895765865,-1.1486220977338562,-1.395345077548337,-1.9458770486732275,-1.5220366848740559,-2.426199600854567,-2.192117117989933,-2.425062130728984,-1.4292295671522015,-1.6312601939018252,-1.968644464721868,-1.8819634368893376,-1.7340506194844847,-1.001170536494754,-1.8606615336947832,-2.1235148941839,-1.9768779422820058,-2.5488763167485033,-1.8847938175656904,-2.4153503149116924,-2.2639302734312787,-2.11042677414755,-2.1734656641355854,-1.999887440851348,-2.5671225124150348,-2.6383919731272,-2.3512675612794434,-2.8517035717733097,-2.3260613501966976,-2.3596875710893266,-3.2313507334019835,-1.5806808966632564,-1.5932128249214672,-2.0101614420673606,-2.966362728899438,-1.3621740213395663,-1.9107968817335375,-2.609590370234712,-3.166170272208637,-3.023212557043516,-2.342313174197233,-2.5369135332833714,-2.165087954384654,-2.5047996037211835,-2.746094319661772,-1.5040965867253575,-2.2621333724773107,-1.7450691306917057,-2.229801724783796,-0.7178682413219085,-1.192458279587059,-2.3495231743674045,-2.733953895153855,-3.6017325406373186,-2.9644865435979,-2.359015952654458,-1.5280540187556837,-3.2934406705785597,-1.3729148631593728,-2.7048805506494262,-2.8274445551792056,-2.9409045627897012,-3.5435207390155306,-3.38430599376197,-2.2822057356244048,-2.0016985497324202,-2.6196001710585075,-2.4207213485673265,-1.9044850884599434,-3.7401488012237185,-2.0317078050573865,-2.2982010208443144,-2.279773586640519,-1.7262993423458115,-2.124360145153566,-1.3770333090811033,-1.7023008274541023,-3.42379090196328,-2.347934336504782,-2.9079502596224702,-2.273049612335887,-3.3783309127246377,-1.9626790629917348,-1.657495160224244,-1.811633259911769,-2.3410801040695124,-2.581238563021717,-1.9950857481338435,-2.8664604660919473,-1.3791410556555175,-2.0824585739459796,-1.8769994669111156,-3.324883982461123,-2.2731919102609677,-3.2256650332030823,-2.436974542570964,-2.127904923550443,-1.3938428979637454,-1.3772088416598596,-3.2772462324760814,-1.7445548035242806,-3.7160387840140663,-2.3082118385245365,-2.6625212896418464,-2.032832473372497,-2.6554741241909694,-3.4442621200223282,1.1256358481119246,-0.5418117394581836,0.3257532303649553,0.7306673030304324,0.0015467093793171875,1.051590264050752,0.07937599774708899,-0.3573690139850367,0.4834168098537198,-0.8513797646690369,0.6089112280191334,-0.13453041286984938,-0.810512976270461,-0.8735399596014084,0.31883486443292597,-0.14547743685068412,0.9245045030039941,0.3023547935591453,-0.12527958436617054,-0.6179304931603554,0.3100771130978975,0.2654476656280911,-0.47598627379965436,-0.8840361506360812,0.09337997995831619,-0.7252990459072268,-0.05235146959616626,0.42082436562175424,-0.8874968314668524,-0.5679701404862985,0.20054706026239677,-0.6327075567052316,-0.14640106615153256,-0.6715435363548524,0.6023289622447117,-0.4716160573021762,0.5496488465580429,0.17176476988667705,1.0165956158071596,0.839821326250328,0.03687834523945359,0.7843571273565634,0.05495553368520579,0.5826018991512479,-0.9521708043152909,0.6373488191082932,0.20855551606874959,0.29224599702026105,-0.8939189049510775,1.0826306271198032,-0.35690211083854795,-0.6580426195553236,0.4537930511159733,0.9551223812223368,0.6491437673898216,-0.25670402431847045,0.0793867503709571,-0.10039628305743999,-0.00019311148652109147,0.31726611116298464,-0.10433642353937946,0.44118492074523663,-0.6316628462501751,0.3531257960084814];
  
  this.h1[8].weights = [-0.7646461567872813,0.28539991663624464,-0.2878525541160628,-0.35225065305227554,-0.7282900409419679,-0.16657588396794942,-0.5487138166450527,-0.6756116199112854,1.0402298203478284,-0.030113919665549806,1.4783428997739145,0.8783745640383217,-0.002086749811936111,1.5238643812966985,1.179329180336742,0.3221480655055197,1.1476216088250144,0.6810138005342591,0.05037640386553817,0.5903616527853504,-0.3386465771255852,0.14355228816329985,0.2105502538227902,1.2230394979554875,0.3137618373205202,0.28871037694754165,0.2742715680549581,1.2002633950741424,0.5029739290601688,0.3570501257496323,0.7072733082822162,0.4121383630545262,0.23365504291154202,0.5958045855559717,-0.05684229150332899,0.4090613412360757,0.0405465220627485,-0.7443155162568051,0.6735076841691122,-0.6568814325746353,0.08477998031577635,0.8283478610436416,0.5360330653058376,1.2080519940107182,1.133477357027676,-0.34482769275639524,1.0270615347153396,-0.1425280546582197,-0.5842560310695882,-0.3031303294847429,-0.1361641680990635,0.016264240105895573,0.7358755810301038,-0.5564716934712728,-0.9708782872922813,0.5448718483062367,-0.3149555111176059,0.4524202930996797,0.27278192031943505,0.8891386788351752,0.4420718957559471,-0.8475653279152455,-0.45291997765219794,0.9049629329882256,0.08567653252477735,-0.2967743791972974,1.0175618512150777,0.19140992893608597,0.16153275086665997,0.2508114241878229,0.6567271570800666,1.0800095854609264,-0.010691352540418324,1.5582727126006926,1.1386833970564283,0.9248900079085302,0.05114149640069078,0.12906789404634955,0.12293634482175425,1.1635907844067748,0.04138083005739632,1.1350565466718487,0.6160986790685873,0.836406011257887,1.3854245233308646,1.0251075831170178,1.470793557092026,1.0631425724116708,-0.28399235129261063,0.3519412184097428,1.1377748828274172,0.845434587592599,0.5071763532035497,0.7778465201315907,0.9290130861811722,1.4547006834309824,1.2660265466003757,0.21610207510779628,2.0601289299251504,1.0092953167642755,1.412041693850514,0.6682922902810507,0.0689326108505081,1.1346874007431025,0.14153324601690553,1.2832003864042503,1.7006198273353648,1.1436967150357478,-0.14367751121170869,1.3011015118919245,-0.16034818209583995,0.8343418909721887,-0.34716310118266885,1.6595800030555832,1.4106694664814878,0.2950252536715897,0.23788324634385855,-0.00959887025269059,1.4422269841829058,0.0743256033205451,-0.7604742932524391,1.1097587070109798,-0.17384434762744788,0.40046874920195236,0.29851688384532743,1.4429156237266902,0.45051625021355224,-0.8448059989875972,0.6088401929381858,0.20102481883706713,0.6677763132444852,1.5845248618089458,0.6850009360201574,1.0092348777665228,-0.45003063047052266,0.44713563391480093,0.7463679915258128,1.4807167127942114,0.2151650892286359,1.3461083260109348,1.2598974978528363,0.9051859816045008,1.1018199617018654,-0.08908717365407387,1.8323580325040785,0.5606825281236338,1.0956827980069748,1.3969391932552366,0.9050941935364093,0.05215640938096442,1.7099109412684923,0.7096848277595306,1.1510243826216255,0.837273754761144,-0.08614989060844905,1.3601862606203274,1.4047248061107473,1.4684623008631958,0.6752111564599365,1.75529113822254,-0.04107268049439366,0.7837171169687206,1.1506897793673982,0.9049546721461217,1.3632096836620267,1.3186903186814218,-0.24986448031452319,1.2561853409000105,0.7759378427337582,0.9692524239998279,0.4944510539960095,0.23607395461044828,0.871526949430515,1.6891646762387011,0.2532360948396978,1.1729719196911836,0.17145013889922264,1.360201542128828,-0.11738111620243803,0.2879119814100364,-0.2468484375957536,1.649501861795759,0.3606345953082026,1.0937197378498287,0.48808823372149696,1.4801529144669106,0.3899391742449552,1.3876677949331286,-0.10003925393887068,0.18339556766469864,0.9175922667235623,0.19036829650517625,0.6203344262508103,1.629395761583059,1.9002823810820328,0.3993059318132556,2.4931949010490744,0.3623871093820557,1.7340484693544849,0.9673576984504729,1.8223732564942725,0.7942313683331058,2.192475240476539,2.2002223333048807,0.7187400459742112,1.8306625875683118,2.0626671752073515,2.142787363801364,1.181784350231623,2.421567037740839,2.3573866410754345,1.0422827803694152,1.868417351300734,1.7527409513900167,1.5847252485407008,0.45214934980222565,2.101844793737972,2.319829735660277,1.6159883156964865,1.2995418296441201,2.1188687677897304,1.2616299535838917,0.46026804184035525,0.854051068982541,0.8363215910542332,0.5835086156168805,0.5877297568266675,1.0100458891304722,0.7214528004217597,0.8501415813692065,0.9461530944968514,1.535892804743361,2.1117443942022938,1.6473614016084464,0.6677180746426061,1.5288490204569425,1.9246697521265677,1.6955521173922299,1.7329299899081214,1.4371818223093136,1.601457048127861,1.3078147753690375,2.1422808496485697,0.8713551722646066,0.4829686235179633,2.228522831099585,1.450965566018444,0.6956355817054293,1.8667018704422846,0.9226319541804981,1.9381016192828773,0.7395216893569047,1.2094657341419128,1.7343972100532121,0.5351688102527631,0.8536401889202714,2.063463410946228,1.4687472999023057,1.6311104418934816,1.6103159600855756,1.5359083411862207,0.515828139662916,1.3683353741422446,1.3525756906277069,0.8646974106722243,1.2157351673491241,0.8135378838973236,2.0183280728424005,0.8938790144331826,2.030256437628068,1.5505726007173055,1.6267525828238945,1.1072444753337216,1.792407564750987,0.7873842770695997,1.087849334707458,1.469066143992728,1.6379207079551714,2.1239937540865257,1.7949965517558568,1.3414361697139476,1.546177967398665,1.7821775909484163,2.3611296680250073,2.4799726950050025,1.1243024204476757,1.9152710218169693,1.4142535780624723,1.3960123854289894,0.8833738230567315,2.384809320559768,1.418795738330887,1.6613155083004976,1.2482575003353895,1.6803958813775233,1.3782290321468178,0.6050229163018896,1.5447796162749705,2.291655374986978,0.9331298439209343,2.0271344028539486,0.9892888981788377,0.7851650372447876,1.986709702779923,1.5892476473750783,1.3511392482015858,2.6820937008073162,1.1692913668638525,2.8166899431268435,1.4954217691023939,1.045115235550468,0.9816282842724251,0.5681060490088071,0.6841770948478638,1.9781419832033713,2.5976638159027257,1.069127331769166,0.4781233728687703,-0.18405826281473728,0.685076535634217,-0.06173762267255356,-0.6884716139472462,-0.9300045527001234,0.24514897006802755,-0.7925742031960359,-0.3090491901349785,-0.5041755329024209,0.2063485585638188,-0.8836721800574956,0.5092871640972477,0.34543045375331366,0.84489705168764,0.5955342325213129,0.34730084218670965,-0.3691931147254645,-0.23913978998074858,0.7706275906818364,0.6863002224848039,0.18216117654699782,-0.9557485589318885,0.858765837336027,0.01685871650495906,1.0682262817769033,-0.8428458428686055,-0.3543806892124034,-0.9146375757630122,-0.7132990227409336,-0.7398406805599307,1.07984848336604,-1.0071561375369913,-0.5727223814549289,-0.057400987184814956,0.30200036475398173,0.35146467918242696,0.6098296640536782,0.7076693253677244,0.3860818067887689,0.14931755640796185,0.38314623554426624,0.663132506935846,-0.0741286466278588,-0.20679454295680283,0.7544455948625531,-0.11730298216667728,-0.4222036813111808,0.2782607929725887,0.26528536731396984,0.4725210398858467,-0.8124882402755788,-0.5691746196752697,0.28956124587043175,0.43404312567172243,-0.03793320716862837,0.3581895824264548,-0.6530064144056293,0.167897540671772,0.13360379374083894,-0.7694545644080164,-0.2892580161383697,-0.3754840245218265,-1.232207450553635,0.08257000097075687,-1.2700559313915738,-0.5227457028254905,0.5750700325315505,-0.376352118572862,-0.49942927960858885,-0.9771940585549719,-0.19068523735591292,-0.339214040051977,-0.20949141106221614,0.44935429864439547,-0.4460146188130864,-0.6880616025610103,-0.7309088103960962,0.8736338114216134,-0.2669258383721565,-0.5290313522746587,-0.9964231697099055,-0.41585900076328886,-1.067683180254114,-0.6920499133524314,-0.45638925938486335,-0.5981722388615051,-0.1083956102761126,-0.8658061038516224,-0.6444670536792173,-0.4239369831941194,-1.056780848976525,-1.0459474184766127,-0.667650692406255,-1.7153885687878716,-0.5416744369041503,-1.1834406194757474,-0.5834298447803087,-0.42057562902853246,-1.1583026667914318,-1.65636726977133,-0.5036239618814272,-0.80395520007509,-0.7272647075450885,-1.6496623060814255,-0.04604654242632525,-1.2538270564784704,0.04515194655333099,-0.1798264472955156,-1.0354993888100177,-1.5750018747443568,-0.6521930028039717,-1.4381933596468095,-1.511124035365469,-0.7669008153787744,-0.43694060973317356,-0.8128540417081902,-0.06043435433716847,-1.4866117831636867,-0.6586383160968496,-1.4180554883206986,-0.17669985042925487,-0.8139239770158199,0.09313129179355562,-0.18438666129251624,-0.04333982431086847,0.6687797974419882,0.6952682650576145,0.5428285078359982,0.8040785746777384,0.5994274459570232,-0.8922770806226867,0.017261627557210432,-0.9979170878598754,0.21294539506026394,0.3339010426612938,-0.6226675996368336,-0.6520258557286738,0.6814298244773436,-0.7310179287200822,-1.3639477165900349,-1.257871757709759,-1.4673991242953113,-1.0136465790723954,-1.2890983907523739,-0.947994260336215,-1.5116719822190892,0.043470448563234156,-1.0879977577558222,-2.3914504983145957,-0.6987005949522099,-1.1612964024956285,-1.0794847868964417,-1.4766544376435369,-1.0554676969409444,-1.1277717639301605,0.12274181865635514,-1.4449608728685577,-1.5119755652486226,-1.5104746471928763,0.1759819583206389,-0.23772655484597918,-0.8593607973881795,-0.2246225923735401,-0.6803146536468199,-0.5424751646542535,-2.1670194137985535,-1.8779748757672237,-1.8315889028291277,-0.906784430519225,-0.9239405094720907,0.12733780338371695,-1.218496695369081,-1.1120857100929482,-1.9096912366095757,-0.3947005569030735,-1.2645904105726626,-0.9669772924814949,-0.891271024192144,-0.8203296195624142,-0.9693706677554652,-0.7310340612125695,-0.11971939041859404,-0.4637369631019904,-0.9626070330755904,0.024002081968677914,0.8149637186426885,-0.4295890107186631,-0.02317768602750498,-0.40244000147296577,0.12410536701254202,0.1457537721739603,0.4433047140122677,-0.24401679986167765,-1.1855866627284464,-0.15818899457794594,0.03594393547416387,-1.1883054405782256,-0.6809772338008169,-0.6676317285656302,-0.30459625188381634,0.15809843709834134,-0.8826344730924215,-1.478675930266773,-0.7026266825778699,-0.9997291695455875,-0.7997393474978802,-0.6476901304441152,-0.15235996536743857,-1.669326429377449,-1.442249030449218,-1.4205413790002577,-0.1542821644403114,-0.9120519915092523,-1.7037288772206731,-1.4371994660685952,-1.4732543102565676,-1.0374763444251582,-1.4823604447083856,-1.2385886675685842,-0.8142992108661349,-1.715190815443845,-0.6439410996821014,-1.1929593785811377,-1.330128727712899,-1.7064254632710842,-0.9231183203382105,-0.3393222706043957,-0.18056946161816553,-0.5798204725896432,-1.5987681449839202,-0.7805669855712009,-1.852525962644188,-1.8984393982867231,-0.06015612297672983,-0.0035763113713820787,-1.7993608344257703,-1.8295691218586203,-0.6829970834307986,-0.8059620253496415,-0.7948436847283138,0.0707665520920655,-0.37092513028951835,0.23235541907458218,-0.8520969368400311,-0.11177888818969134,-1.4838619078939987,-0.4069356332540445,-0.719266291782548,-1.4440650680898046,-1.2133273284409973,-0.02065190910227909,-0.7879769323206453,-1.5354292894155106,0.15620922933886508,-1.6095557903796078,-0.9883539584201984,-1.440543925213942,-0.7783958734671692,-0.8401967068965243,-1.5449258233622183,-2.149250501214552,-1.2315547786032814,-1.4623692710707732,-1.616613702406207,-0.713441957935429,-0.8526114218045248,-1.2329912159080116,-1.2647785479661946,-1.9812676491259038,-0.8373084816187484,-0.9137137855589146,-1.1284591653371274,-1.4246064151120665,-0.7942451414078866,-1.310280852229277,-2.0126075909850747,-1.5921054765738545,-1.4700955320674385,-0.7338336448277727,-1.9185445693619767,-1.24244792663333,-1.7505389077747866,-1.5052038227883444,-2.5255067435372798,-0.5718012654338955,-2.2988764761712233,-1.6743570195412782,-0.6890656528939485,-1.4117416501884852,-0.6077886824298624,-1.2220207849015172,-1.1952362169130246,-1.0969409634570715,-2.196255733266382,-2.1083457137811235,-1.622705347075921,-0.5803179774711581,-1.2795681752279446,-0.5887046414313006,-1.9135489327534012,-2.53545682013294,-0.6685415824166538,-0.7432306073201794,-1.6576185303032693,-0.7862131652773446,-1.9653250305405825,-2.1673056170750957,-0.7320230401006247,-0.7975693416679359,-1.5814996692642902,-1.3676227619105727,-1.8532888772977456,-0.9942084563280366,-0.45910914574890777,-1.1506252231082867,-1.0616909637201009,-1.0134276458923102,-0.8678724028534723,-1.5424386285517129,-2.4787157967564966,-1.3280350834985972,-0.4583629412542937,-2.1332968235169503,-0.9575528998946591,-0.4459083225222514,-3.478854770417594,-1.5925133175539878,-1.4812162553222228,-0.14273364406581956,-0.94146772203237,-1.2144278181651056,-1.8842603275229741,-1.721492433589885,-1.1502493427081173,-2.8573678749301794,-1.180391578570413,-1.4886073462634897,-1.2750656415385975,-1.860896226506296,-0.8923640633161574,-1.2327169018215485,-0.8243143931933259,-1.3785041231799091,-1.7405682997880454,-2.1387781254200333,-0.23502626670169705,-1.947551007741525,-1.727343098058857,-0.7369835919918318,-1.7993694676602963,-2.5249392075570958,-1.2455490318875209,-2.1672796065071656,-1.4523112423662676,-0.5491864802653107,-2.0319705271865725,-1.2804568951760729,-1.5238571071259521,-0.7754804522101872,-0.941114539487181,-1.6463750569047908,-0.9126184752238725,-2.4738959756510317,-0.8611298000419391,-0.9898001985622991,-1.139112418225915,-1.6230655079689287,-2.1253517209803965,-0.841856108859177,-0.6210003965529121,-1.5748619033507671,-1.4370154669173778,-1.5171977776002217,-1.8462838039513898,-0.626479242366118,-0.5909434665019843,-1.2510263065856644,-1.0893338755463298,-2.3447244460845447,-2.099203713899682,-2.15890747579726,-1.4880754126036067,-2.5663209761651595,-2.0191895539984603,-1.7219838448746985,-2.091259734697211,-0.013423325986856464,0.4316408091462764,1.012663723342026,1.390566058911695,0.6093263063101636,-0.0082149188724427,0.6439797563414926,0.6063047810313037,-0.7392107891602937,-0.4387842025094619,0.680543692192583,-0.3192536872195047,0.7716760333232782,0.6063831875970568,-0.42829644899250247,-0.02583591148592126,0.7607542811450136,0.8126570024634268,-0.34433075406781233,-0.7860108158361668,-0.8048077950280449,-0.007354432102746112,-0.17453327877122468,-0.2971459335690706,0.3997478859594104,1.1002067651603917,0.5850054987882312,-0.17628356208527304,0.02969815983310844,0.6080713467612394,-0.36833033348872574,0.617321218405003,-0.24958630752729655,-0.4775089449269905,0.5269115418414603,0.5554142738595301,0.5182767422426027,0.5382492427954509,-0.6405140060521182,-0.5734741577021292,0.5435174753610666,-0.9954201192871446,0.3156510254855944,0.10847937905597971,-0.7471301012530479,-0.1251090920415833,-0.3912776903438758,-0.7163332685465371,0.27027712626951705,0.9585940461235967,-0.09722169087489457,0.5754874324805392,-0.11647342924520662,0.5967005856784635,0.1901008334713142,0.8019916011883554,0.7565952583410247,-0.22340411273338448,-0.3536619401751983,-0.47034541625302867,-0.6041183105896839,-0.038363177697824824,0.03853326692848534,0.49183989278953205];
  
  this.h1[9].weights = [-0.876429477465229,0.604215155625127,-0.017653048758139,0.2331757966441521,0.9001369656289038,-0.7337116478208876,0.09177144860334696,0.20025829974046472,-1.0896509070694813,-0.6805334263840404,-1.0517828876398168,-1.1633845168517583,-1.3838518510130042,-0.7348459814625828,0.23369942628167592,0.11666650391455245,0.3230893431570715,-0.5753886399198116,-1.2988994546745012,0.3258229917000727,-0.5443626275984095,-1.2368274363990788,0.37836125499215373,-0.5639456670749292,-0.7127129510557833,-0.2567939131717844,-1.076971511848433,-1.3191885102342737,-0.953731127170588,0.36404082008303346,-0.8437320034093003,-1.1413731908009122,-1.6619444697753751,-0.5666024226531612,0.4101269239673495,-0.5628197946307671,-0.5739895660093022,-0.6027097074385607,-0.6230661008714656,-0.6143464355698569,-0.2386105415119777,-0.47949642331833386,0.05403978212003246,0.6081863945653193,-1.1335770019382878,-1.4812820504790216,-0.2878148014134406,-0.03810038627150382,-0.9800529788090807,-0.8289975691624696,0.504675022456618,-0.578665621664688,0.45581954252489804,-1.1023455343783528,-1.268191173930415,0.37248401957257954,0.06865550679706,-0.28701113557659985,0.6055031102578972,-0.41182020535355335,0.6420715645926456,0.7146926541949918,-0.7613982931982464,0.38129745912631163,-0.26126900827252847,-0.44586991633651907,-1.0342020239445557,-1.2126086538737877,-0.8536745477134604,0.3472435032654764,-0.6346649900955715,-0.265553053967903,0.05899870976215987,-1.2116938557336525,0.30640800847708977,-1.4634283382103757,0.5202384993452764,0.17375060636303577,0.0993962462992585,0.15559272364666335,0.07683448752203352,-0.21868903200943623,0.41495850431911135,-0.936715660260147,-1.2768441450808783,-1.1927493965174365,-1.403453348428081,-0.46748090930769104,-0.4633710199213544,-0.1368022017933214,0.19638271104716445,-0.3557279954711832,-0.6822711722744833,-0.2577081037833775,-0.08656116145342163,0.6638801538650575,-0.6694790304108023,0.42611824127440234,-0.24001144771894944,-0.9376397549391919,-0.2106904897527244,-0.6162310471581252,-0.7065162969990303,0.35124550823987516,0.2774840699605852,-0.414141618794657,-0.5235411800453823,-1.5933459463202062,-1.3424105962066166,-1.1890656266485407,-0.3411063360986093,0.4824759424024737,-0.9773698881306507,-0.3874435995630285,-1.2784713053119554,-1.910931467883974,-0.9699678761096657,-0.33388244982451204,-1.123122830489217,0.5591701436834049,-0.25967395272774935,-0.4425935667758139,0.5791912390019772,-0.380411164666897,-0.10159028769028476,0.4723173890934579,0.653562315330536,-1.07326936473742,-0.5283116133783892,-1.0082489551189548,-1.2895884177172983,-0.15361332917252518,-1.115365815460243,-1.3150901455381798,-1.1280552085833424,0.25568504082198057,-0.13577524385565706,0.07391372021807383,-1.031522723098818,-0.3251913039403215,-0.9390197060204497,-0.23836964450622364,-0.6131830206851757,-0.48706409645653564,0.31929600123919333,-0.019446930034240546,-1.5602608469188837,-0.8981909851901643,-0.24323179699599726,-0.9747135049926546,0.27619325578772785,0.5571629034997052,-0.5953870591605998,0.054312426568121894,0.06594907581657158,0.04851918828673698,-0.3696090227826651,-1.2093523861975801,-0.9679890758981937,-0.5595223753912966,-0.6859678357312546,-1.18713587855592,-0.4810232167931158,-0.4828458747457375,0.21812694585263395,-1.0497747053311406,0.44470146845713315,-0.2582425058183262,-0.9869110659597611,-0.31290517603023693,-1.1345819379882685,-1.41684937085145,-0.9064682300644538,-0.7448654050463447,-0.5067529649222329,-1.1143762369531753,0.2353836441576322,-0.5176334194383941,0.0011152037542397767,-0.9824251702263894,-1.0631758861360743,-0.481392567054425,0.09960338622708387,-0.4114745609754474,-0.31447073802106046,-0.03617370083733243,-0.3293152377611488,-1.454700313572822,0.4690382021484385,-0.12635008213762677,-1.027967687877331,-0.5616509776269206,-0.863988449814078,-0.9193874083449729,-0.14203577231436423,-0.49302633993344563,-1.2021911738114466,0.15062977479849732,0.09637172550620939,-0.5709050383664147,-0.7576282626837054,-1.164210761178542,-0.15739687192800456,-1.608146231320334,-1.6856086481983084,-1.567215600710837,-0.6146359670382174,-0.6088570956131123,-0.7239395284885983,-0.3655171760973804,-1.73131744294126,-0.14227640182720494,0.11605520518142559,-0.16255447816056037,-0.6396607532220344,-1.3155776060122173,-1.3674850864742323,-1.4437964497053917,-0.02723939946368004,-0.01360664607081646,-1.0429559673604565,-1.2364035471278865,-0.26395544615707595,-0.5961411560534003,-1.250236834889777,-0.6806560689680672,-1.062349472756456,-1.2563577142623477,-1.2531478853126956,-0.6458916870725666,-0.1423635931374578,0.09193704290279549,-0.8149235742913703,-0.44303934215837654,-1.0130350797839265,-0.595919383270218,-1.214238583662896,-1.360681071462859,-1.006077314268991,-0.5685798690577099,-0.1845389157007461,-1.7359537986552451,-0.3218778530809838,-0.31150998352022025,-1.436567539233247,-1.2393582062463708,-1.689627884209422,-0.808757245006695,0.05367111888088655,-1.6459022069772624,-0.428023122157537,-1.4307700028355121,-0.557430698262206,-1.5086533331494818,-1.223501769298917,-1.6282876686994447,-0.28896562209271537,-0.17652603563272173,-1.7022862302687578,-1.609848002830034,-0.44319851908885677,-0.17213246834233073,-0.9653494814292005,-0.30639995642067835,-1.630131138963586,-1.802466653590847,-1.1662224279951783,-1.0643689980522335,-0.40836108690751344,-1.3396611189270327,-0.08235819000529084,-1.6615194633660109,-1.2551959708149123,-0.774136193650976,-0.8744536170064884,-0.33187444773574754,-0.10168820816738193,-0.13114132737003162,-1.3696930102363178,-1.9062119691256465,-0.18180662362455494,-1.3275629943621403,-1.055013733776136,-1.9519657620696367,-1.6218140954919542,-1.6610908474495445,-0.34663580776385594,-0.6772846870775061,-0.845423426409239,-0.788651631043449,-0.7268129183979946,-1.2921972059709508,-0.43977258849875894,-0.3026215533211836,-1.5483924808718104,-1.4964479767827727,-0.9606029843654255,-1.7757010537343516,-0.29397246822827805,-1.1146452621545,-1.0638680639574352,-1.714753041472239,-1.319185673277303,-0.0629351942677695,-1.735712761729346,-1.3537516259341156,-1.3450890829436517,-1.563668456029655,-1.0072612298701773,-0.36153417150164785,-0.8221865303551668,-0.6584724278546626,-1.666245796081436,-1.1410315453809583,-0.7292444607362861,-1.6710067187334812,-0.17984605574085255,-0.083861595010224,0.03741825868784003,-0.08223407287169504,-0.6823161059202189,-0.5858371286258491,-0.5887313618355006,0.35453602710028975,0.18950155243022007,0.5103470119239405,0.7790358189816834,-0.3192502689315129,0.5485818439916744,0.24668943023342593,0.58312888230079,-0.6310507333028761,0.8893422485412387,-0.5147961834060466,-0.12095888679500093,-0.259750733303209,-0.11898616691849621,-0.5547946500745354,-0.4628027321879098,-0.06815968743993257,-0.285377985088522,-0.15190858871506763,0.33921708764938024,0.34067044222201276,0.46116617591401704,0.5603946375000133,-0.8843014735248445,-0.7065786009602762,0.3345507528341983,0.28255621614402066,0.6196989970916778,0.7508343708379969,-0.3167655821436688,-0.5151750086558027,-0.25303072248384345,-0.48247326922576,-0.6088421137380424,-0.7685113844735472,-0.40571880504314006,0.4164529525271709,0.5327302571487015,-0.21021077570845448,-1.1410968261684808,-0.651477830880275,-0.040129414555622724,0.47205212471289354,0.555486658781884,0.9924799354405215,0.34865911491741625,0.13075121226208555,0.3266177441660193,-0.7946396622620956,-0.6792465817474349,-0.28805423916759376,-0.35619879107466434,0.23688537158348566,-0.64685255796493,0.3882948228723441,0.7654518899238597,0.13556024367408626,0.13707302280807843,-0.18933642063609382,-0.20624353118058156,0.11502377463808272,-0.6832108809521893,-0.7326182006017223,-0.5821329953261407,-0.3299209452231042,0.6571149124280828,-0.7791353188350452,0.17583832037290037,-0.4000540319253889,0.45583173672266414,1.2450611433323129,0.19984353053396403,-0.19425144553450896,0.04433911365690851,0.26009212649823227,-0.6704237041197564,0.7399523309579468,0.03802350392996086,-0.26455934663536346,0.6592141153865229,-0.2294106366358995,-1.1861156268046156,-0.5748260764506355,-0.837388389890952,0.6502990906251606,0.08610094726206924,-0.8802824797704335,-0.5674768671668647,0.43357978476400844,-0.419238765220429,-0.49948163427078646,-0.6526473879742053,-0.750520873871715,0.07113605411124453,0.024732186541167708,0.1664923277942154,1.089501686662,0.7703230703378889,0.937057388956483,0.3402822700429274,-0.07456584578785247,1.4039254385901396,-0.47935503001089863,1.1161416525565637,-0.31421882907506243,0.08878974507462038,-0.5411793618339972,0.762362459288892,0.8122750877172558,-0.1675599501282864,1.1238217839627025,-0.19161342666231024,0.2670602371374479,1.28142327607017,-0.007207132626631881,-0.4307424034385943,0.41363765520746315,0.6541051182509943,-0.8007298362481095,-0.15258153690853593,-0.46466584365241914,0.023441713295455635,-0.6038274865702076,-0.8557554150351172,0.7808563142910612,-0.45072312698204364,0.33637382170683316,-0.42245125248511967,-0.2769520155187174,-0.28073591609032045,-0.7369863259747235,0.21779276238382544,-0.38791647003126367,0.35976100404239975,-0.21205789881512072,-0.3561981306616611,0.6715643137384045,0.9122758475726148,-0.5860576610139947,-0.4761291741185667,-0.11283710784809137,-0.34879527958263223,1.4071924817926194,0.9987172019536056,0.1355387569151416,0.41859379909688493,1.4880855726156716,0.13562125328834393,-0.616850075624103,0.49419821685565796,-0.30634327146429907,0.5989569700943723,0.8882924244887858,0.11569657853490843,0.6559464533340653,-0.16667985711121094,-0.4785834231102261,-0.5196489911519069,0.7416980137218366,0.09161839153287654,0.8055862744125801,0.7619153756623249,-0.16355547793821545,0.764751537447972,0.2120569213010713,0.02767275274494555,-0.1496486642821855,-0.47987927136289454,0.658539232347286,1.5481667740790692,-0.017604862210348633,-0.20609090792623397,0.3496134719390998,0.253369528337882,1.0370860783373883,1.124276044715229,0.32094636039519314,0.8555933545525247,-0.5052970206772058,0.60151441168325,0.6076490140164277,0.3452259446963836,-0.7500751207351222,-0.19541749271606712,1.0221478135159006,1.0367564812200813,1.0392970834554585,0.37538671292849807,0.11109255582057656,0.8547428789319134,0.14534060952761887,1.1109891388991198,-0.5469817310604502,0.7080191205399838,-0.550095938791929,1.0978637174670425,1.22945854177635,-0.04391090662480642,0.8059510240722071,-0.023225276831339434,0.2300419537319344,1.1124967081848742,-0.007180841203700766,0.7421665950740153,-0.3204923158809569,0.6623704860030273,0.3785387604441039,0.8781656491605712,0.5785746934713282,-0.26899310586898895,0.805180361947822,0.8164362844197449,0.13350357813579677,0.276144722352355,1.0498033320940423,-0.2998068615262347,1.5910152531260144,-0.4695063435270087,1.3565635010297528,0.42609826750009033,-0.08330285096887255,1.0238050244954715,0.27992261836207516,0.9249895491602238,1.0208059197655854,1.2121378038036523,1.5236592274148875,-0.18337450134468297,0.43661669314223006,0.8311331536182446,0.5803111939840682,0.3691779594612806,-0.32429297398790696,1.0700328577866354,1.2026970153672882,1.0271021815934542,0.4516577090400911,-0.6781161469831435,0.7047020869517183,0.07205853623287009,-0.003891639521629059,0.8080623271687208,-0.46956130885704067,0.8402559178280867,0.29723009026546826,1.405373016508566,0.12470294619454983,0.14164861524490596,-0.5043479791188393,1.3020839874512813,0.4273705520667858,1.1564738642050925,0.24843539354980818,0.13542253010118357,0.588305508873804,0.787621313820073,1.668184615389251,-0.4150929093753232,0.11890460624255353,0.8828560338495356,0.21486984473744344,1.1128661032324048,0.5065831371874966,0.2801361132067148,1.0113424151939774,0.9465023316283876,-0.022577681033662655,0.08059325344873192,0.5766609316069524,-0.055230150584578405,0.9366926656145264,1.0166578368185708,0.6590435650996261,1.3431772990275492,0.0701210263372945,0.7145286597403211,-0.08282616338703672,0.6392120035353842,0.39546802618566435,1.0057975405001565,0.03154359721008779,0.9461140372414496,1.116415026948374,1.5456801702034442,0.2967519898557934,0.8474854772492405,1.5329555591239898,0.6232476131558524,1.63383465578217,1.0565765661516595,1.6559448282645033,1.4864020237156075,0.9649601468577849,1.2354393061041786,0.24558873089481398,1.5194940905942647,0.40476230087255,1.1395525676823886,1.3828518829451895,0.45574038750478885,1.6363150498473582,0.43018147187452627,1.5901536281857056,1.075384894295812,0.6411404460110225,-0.18610785323903342,-0.0768096338514418,0.5505612720720647,1.5719504020237782,1.2994707633527627,0.39431764908039374,0.9783488660999353,0.22795252732860255,0.9070638255571173,0.2627918374309831,1.0574908188253658,0.5516333573050212,0.628564885630026,1.2585433593037225,0.09663775234185704,0.9667609659387618,0.9919852985991572,0.2728680159186156,0.15732073206626954,0.11574093553746125,-0.27896223472537474,1.7742026472204075,0.7603166018953457,1.4456596570032452,1.7519212193957026,0.47764446661435495,1.2926721874397715,1.2593717956749741,0.045400283386763975,0.03976065328514324,1.695495816547015,1.36542089531922,1.4906780927619105,0.3292599981064855,0.5445458112666692,0.33995490701259534,0.020073629387487187,0.8689675964989226,0.4049337604827578,1.2357799178184052,0.9560868939548091,0.45875813792420733,1.1486861983314822,0.698486672557938,1.7551984695253042,1.4485423713323597,1.9360560007669958,1.6177984866352155,1.1320736629894261,0.07518901826374517,1.2119839580268337,0.3131189388360186,1.3556295290636662,-0.030891410968906973,0.2341967064676356,1.6879907964338268,0.5995214147372588,1.1749045023935738,0.9767748645351071,0.2751356135320466,-0.11627420861250097,1.5104138992220797,1.4795224485423975,0.6758070569384964,1.8617764430920913,0.9729780094286623,-0.07719305034666304,1.0597826560664345,1.56528741455932,1.9252249073485639,0.2616158110562562,1.9142063018845776,1.3333958994348603,0.8547638375180282,1.0080507445766163,1.1198389725296913,0.16183657153516245,0.8515447442864077,0.08333393493144188,0.5051048624274688,-1.0553441325200787,-0.21518593589910429,-0.7016443534874919,-0.12373997003288259,-0.10188622678447715,0.6154686241313918,-0.6869459779502801,-0.2881245433170525,-0.08692342687953264,-0.17026067662930414,-1.05541149524148,0.15762767671362723,-0.9832551982562894,1.0057380393019837,0.3440444010236991,-0.10034531146694652,-0.2939702722677969,-0.07392608431757428,-0.7140589158286338,-0.8409940882079658,-0.2697217247579646,0.6360638589914998,-0.15548627713548185,-0.1957226064323576,-0.3703118423563208,-0.42130011824618235,-0.9175722056502829,-0.7456760795943483,-0.32141213583281236,0.6215796046120449,-0.4406431254307471,0.8071191439235375,1.0243565929966345,0.34296687623942307,-0.7938652683736174,-0.42651270963632315,0.9529135117860853,0.2936718261025439,-0.6485895267611836,0.8311051678675552,0.15230270043573021,0.08628654266725215,0.96851197773321,-0.9064178802962829,0.12124180289472121,-0.15688280153573592,0.7790491915733191,0.8065628981572883,-0.9784518942460824,0.6451764108609371,-0.8889507029238395,-0.8999996398660489,0.4502042382507669,-0.9204596949032542,-0.46450499090122394,-0.7629143590437317,-0.13746612726530305,-0.7135230502969997,0.32377187382805994,0.39281070049867917];
  
  this.h1[10].weights = [0.6512333988236958,-0.8593734652769744,-0.9996760475281086,-0.5075375614556776,0.5593495300100191,0.48008066964015006,0.1549875524254949,0.055374541972887936,-2.7008973123899733,-3.101551992844002,-2.381242132979511,-0.9576729345479353,-1.8820785128606732,-2.2929581011379705,-1.9473640341874934,-1.3112955855772173,-0.800265893170077,-0.8134631622868063,-2.113881189826632,-1.5739864456994657,-0.9191169136125906,-0.7077065691092924,-0.9754168405543441,-0.38289221857827344,-1.2760148605744326,-0.6674685614064142,-1.1034111794904002,-1.4083549980032446,-0.29536016993819597,-0.9698427063483527,-0.7175398962836446,-1.3374648844837722,-0.8741952054146322,-1.036414246636452,-1.0073437297617234,-0.15289085418600634,-1.6573852933242463,-1.20065989602305,-0.6892991990690392,-0.9910260570176269,-1.052568677519915,-1.6270713790263067,-1.6276858481632837,0.05641638066396683,-0.6493121976124637,-0.7670311696050183,-1.1716930237266996,-0.7364095382512975,-0.41171205711477044,-1.404865210579248,-1.3244629978721627,-0.6779874664619364,-0.3593011867123917,-1.288983771852062,-1.2972256782431784,-2.872691172567241,0.2821769994490655,0.22885347379413945,-0.5079255032719252,0.7531417047793707,-0.4290715236602578,-0.24297147096958494,-0.049588843869415644,-0.162866485863995,-1.7246550378608225,-1.6418690131926854,-2.3425986689482237,-1.9180723441295229,-1.213421703519068,-1.7575033685613208,-1.5853358018580226,-1.7335282943676822,-1.961615901973584,-2.879864467591832,-1.656750212018137,-2.3237730402893195,-1.9151364923698366,-2.4957671054643935,-1.5179326457368443,-2.2305594090224785,-2.749682237985841,-3.0071216770901934,-1.6098378481596456,-1.5060307276197646,-3.4655922941606123,-3.3287348468273086,-1.9496869097218281,-1.232457781780274,-2.4438906302100865,-2.6205915120886343,-3.0297392740902467,-3.72391597322589,-2.067391054305134,-2.2600113377966315,-3.004996526965654,-1.4206656144612466,-1.4453065307526396,-1.9510717036776937,-2.5933998153169444,-3.5251658414169453,-2.619503501230596,-2.1600452096580343,-1.8157716947024751,-2.121176594863858,-1.4960438041600361,-2.7892983941104563,-2.040389201922784,-3.135082172193851,-2.005184031117111,-2.3312353397748407,-2.992056789395428,-0.8285021886977634,-1.3072920728251585,-1.3859331985888492,-2.438713146376613,-2.316230542677175,-1.6672720369800385,-2.2000648270248595,-1.2935134018673657,-2.164824788256833,-0.5650677164994743,-2.7089857686896384,-1.8781876812832268,-2.564254589126148,-1.2917868303488849,-1.873212583062878,-2.481030569034275,0.32507829474205213,-1.8708480488930381,-1.26937390509727,-1.8326039646604169,-2.6483477476439825,-1.4559983883022816,-1.29905262454294,-1.3858388919451985,-1.5165080037217737,-2.9123407858770767,-1.8390824375457424,-2.4379177310983184,-2.6468538421899783,-3.2869752505462593,-1.5585643307154702,-2.7997904405764076,-1.3574308174442404,-2.504613091088505,-2.226931340649472,-3.0061549213836467,-2.8285222963736723,-2.0122021683906683,-3.0385046372073554,-3.0535379364716,-1.3110907814321309,-2.738987985252654,-1.7229340676710483,-1.575508808302965,-3.389393579421532,-3.4892531160758478,-1.3746605619027388,-2.341091866614933,-2.52241634778991,-1.780041959348322,-1.7353649903966748,-2.7610807173884178,-3.2294939428258997,-3.199989630300891,-1.8580775377399859,-1.391959675433998,-1.6070647410508327,-1.9593431668817551,-2.715971120294213,-2.8523824507079856,-2.00284327162825,-2.0378428953991015,-2.5796255061383886,-2.637311770713591,-2.137988630352813,-1.966114576453599,-3.3584923866909624,-2.5016133812685957,-1.6672655233735496,-1.8916264095600417,-3.2745853758697487,-2.1786557874584256,-1.7369687918467231,-2.068564976282221,-1.5084101142037822,-2.732573330455609,-1.028475119801654,-2.837817404377312,-1.9615806648871401,-1.9376630488898576,-2.294844700207517,-3.8030737375868955,-2.9537288539913042,-4.648299362851191,-4.279299342506962,-3.2788589103229837,-2.856894105575399,-2.5268841568895537,-3.1235722422357157,-2.7141578564344506,-3.671866725113814,-3.387749952359865,-4.323129473865716,-2.76843866933825,-4.159470998080371,-3.942636470915903,-2.786877698748214,-3.0787995743855463,-2.9806998723954017,-3.7348866667326392,-3.2852567560349333,-4.193657262045117,-3.2361123753092254,-4.273678833396583,-3.541034982922371,-3.8592513264857806,-3.6816507544651333,-4.4096947447631,-2.413688008535954,-4.178258408446293,-2.2146666654965443,-2.878896469453153,-2.4617423002337953,-2.4588331016988954,-3.0731116890047057,-2.384098157909686,-2.5013206514152624,-3.2208345864379444,-3.577026702076518,-3.6696148414471774,-2.9264885388113386,-3.485290371595112,-2.3651764013660563,-3.220733094498639,-2.9561415268281084,-3.29724948568853,-3.680581849870606,-2.015296011307796,-3.618197424872366,-2.3515744301577506,-3.3846635340123847,-4.079486568744701,-3.564687416142972,-2.679768801001345,-3.3823762275599187,-3.0192784724597512,-2.291138418750133,-4.305441754209238,-2.6084314422017636,-3.650079901157276,-4.012730781142198,-4.261053698667371,-4.472111431024899,-2.6340970347540322,-3.3757683566419683,-5.018837657172486,-3.643816796123523,-3.89966930320079,-4.912324598540515,-4.616542407001506,-3.757765473245412,-4.599972758512044,-4.492789536476744,-3.279436920166645,-4.984943373246049,-4.318464996150495,-4.730673978330409,-4.132053323285584,-4.637507785457738,-5.544704999307046,-3.237078587962295,-3.330306906309544,-3.989177572666185,-4.900876996406108,-5.08500698767519,-4.976751234329467,-5.539016018293872,-3.9908069608404433,-5.280482457314365,-4.659472109276314,-4.641663144828979,-4.6266049768405,-5.2092461656843785,-5.323753002815436,-4.354677132496205,-4.136606985754715,-5.494376352917413,-4.487195986694215,-4.092236603890261,-4.788586855431229,-4.668548327346689,-3.796052088301639,-3.9349136098711717,-4.297723096828039,-3.675977379718989,-3.4661324306640546,-4.91087986241733,-4.86752164864071,-4.88337360252356,-4.798273940226722,-4.662402996442658,-4.8978129836626065,-4.109916081269023,-3.260962158442683,-4.133868278969091,-4.459165872576009,-5.3291061731352976,-4.702638915835478,-3.758996757706447,-4.116252816574989,-2.5040204966018096,-4.278032366195261,-4.258135188495971,-4.751080236078671,-5.837062044235912,-3.681054189138334,-4.100207160074893,-2.2831587238109172,-2.179649356083687,0.9209992356680698,0.20723294253184238,-0.22707282187437616,0.703938722781958,-0.6083623463375881,-0.027448143803686542,0.6277417793561365,-0.4825403104018248,-0.2806743105806964,-0.3703812711580973,0.009329007928779004,0.11463465013795547,0.37233688986482427,0.4742634774099185,0.5127987853972895,0.6467183966915184,-0.5399521085750266,-0.24006451185909106,-0.9682409177482235,0.7412556531947936,0.03631391446849181,-1.1294597780653794,0.19132525555161664,-0.20528845858150116,0.09608622547653846,-0.15962243566664877,0.3095512373362175,-0.40756903241464676,-0.06010111002907807,-0.24267259971028035,0.13880447513893007,-0.5595943155334262,0.5825507865387336,0.5359225184023463,-0.7067309686704251,-0.6768726260089348,-0.4450009579062883,0.20004862117097164,-0.009306354646620527,-0.7952543852993184,-0.6284013835992688,-0.7779613054648346,0.6633508495617287,-0.2123920104684648,0.23663230868665655,-0.26236492932369754,0.637830463228599,0.9270409416977493,0.3740667486802506,0.003229732589081979,-0.5582581926121485,0.16971031749308155,0.7139622574537632,-0.4066054120952515,-0.2767620574257728,-0.3642784973885818,-0.21063905354134504,0.8390444775450414,-0.6560200864648829,0.5285428412977721,-0.38899507010223233,-0.4777993802976106,-0.5547481427286818,-0.5744401321950069,0.17948216946400608,0.023908417977341223,-0.16482675162538518,-0.08347282118783372,-0.48708811582354317,-0.08405822348746872,-0.335219053969515,-0.3357802730200681,1.3328805221160622,1.2799868362355151,0.5301287790592432,0.08615763913220295,0.25183179497819946,0.6953792967214606,1.0616489268027907,0.26984440774866547,0.07217612716342989,0.205596774247278,0.36354842925674463,1.5816726148671638,-0.13140793714372334,0.8239616946056992,0.30710240784194476,0.4608112960605697,0.5413672295498999,0.7858929819244985,0.7034101635344224,1.3089051111312533,0.8811307438605506,0.7467798826374645,0.053459279158160934,-0.061382981820724825,-0.3223351652626997,0.9797741690946161,0.8915198895755292,1.7612043081689723,1.6887347518819693,1.0277521771087033,0.5815962082986417,0.6373957539543589,0.2560247782691964,0.8170686015835644,1.151956743777112,0.7482266399268946,0.25587637436782573,2.1019461801342163,1.6554599922614874,1.1511524638788606,1.9822098487035225,1.9435310830851913,1.999599322001634,2.1453021261355896,1.156738414143723,2.3793567568941603,1.9419610130134406,1.776204145041831,-0.929571684183244,-0.5400706766880421,0.20207873918326325,-0.4240927894560982,-0.03681572234535313,-0.1730939493032322,0.28891723455543916,0.3605829207399669,1.6433439543424566,0.6515978659236283,1.7880346676820251,1.7293000074258826,1.1919897287062504,2.294698384324471,0.6900122008011949,1.4634213832426795,1.4142402487167276,0.9958342164694202,1.730611896221793,1.5229405637688551,1.9129014857009308,1.9435616358642536,2.272856039178578,2.2258371843200573,1.654314988592512,2.5910593266030495,2.3531503704858068,0.9061096333005928,1.8574708730145046,3.537037911201606,2.1384338724654586,1.7116307968931583,2.499564148673338,1.0264427902154596,2.1751036849232728,2.3698715180503163,3.135102382420576,2.813687769444619,1.4762113914336512,2.1166241538431696,2.44244885931971,1.6618646985533214,2.7506866273548223,3.0488795973580136,1.5145563425645256,1.883346654531484,2.964859993306847,2.007837455493664,1.246126774411921,1.7990300971261004,2.8896253493317694,2.543291018361597,2.6935995597955658,2.5660163120338133,1.8580513878733562,1.6183789678558214,1.7211676125189508,1.3468571720617895,2.9835834801301435,3.1143333934981876,1.5183236622101317,1.683844222809152,1.1903042773021255,0.8772222637860754,1.995558886026722,1.3869404744342235,1.9399425539416075,2.252275079019656,2.5735904026168295,1.883958987705342,1.0814021661320437,1.276272441413263,0.7026677898831745,2.191503281045468,2.382167993902426,1.8254673769413046,1.8465066217503185,0.690049230972089,2.1448383065097034,2.47792515738676,1.873657562568378,1.522036104306262,2.600372264338884,1.5945724505687686,3.2476797934662187,2.964384750030114,1.430595364799279,2.02270550160365,2.0040178005742644,3.2465843021553202,2.1937518395258486,3.256451473244361,1.8402545326206996,2.8233048250521047,1.5625536128118085,1.3157095415757039,0.8058416823117234,2.3009787770824954,2.6118556117242906,2.009057136712289,2.774510711327939,2.5830353267537696,1.3568679737751175,2.220468648353298,1.3357186566098405,1.1319392533469055,1.631074042895172,1.0999584782526224,2.608618677273172,2.225605422017713,2.9034413573731768,2.9994050742453733,2.4927024942610854,1.7935811131671793,3.147598763300446,2.6927934483563205,2.5906410677680505,2.133538630822956,1.871388974401322,2.792708332048224,1.583001455850333,2.202081532443981,1.9601756118399594,1.5723822767026756,1.295256705833498,1.383398327183296,2.0934467218199266,1.0209575730335498,1.7604588300236632,2.5317986137508037,1.323249911797414,2.139791399593805,1.6764085602492775,2.1448663768089853,1.39936985185314,1.705649916811098,3.5719792456949806,2.4093421551067613,3.3951130626860557,2.797556203755515,3.908053136305594,3.0291083122441798,2.265965398405019,3.6473070612295424,3.507590915127453,2.1917883782409318,2.8584347575904765,3.059385056900111,2.2313070143006963,3.7776649894853014,2.035717837391561,1.9090673261537046,2.5941533700621813,3.164708958016794,2.916137072868913,3.7501916091041494,3.9661626588794894,3.258979697267929,3.6128833833313947,3.4758249697378947,2.420500226325376,3.497956185655123,3.225787396010283,4.119355137799523,2.4202100838729255,3.406982478086552,2.3993981065892007,3.4135287773978553,2.9577467982541803,2.96795522982843,2.675721226451407,3.2557799072875913,3.0833821016722958,2.816072920859878,2.5078545255822586,3.669741907743334,3.8800573057250247,3.072188269222913,3.3820431815015213,3.44355355851783,2.725116364205475,2.4074590784408216,3.40047734650364,3.6129862034813285,3.332133546572319,4.091742446058712,2.527377944590953,3.5683693512548627,3.5605461388877706,2.3596868546098966,3.810394208854578,4.071637852856793,2.561225239878565,2.768602003983719,2.9065684452941163,3.8264853283149813,3.1108390727177504,2.565125782490724,3.6311261003334003,4.206728276899349,3.879243944339348,3.6901170843576185,3.3002273368080366,5.207732330909424,4.5406317026967775,3.9384782845217434,2.463668569511383,1.6981375081510275,3.5842882864497234,3.773836567625567,4.854258396138191,4.712096000973604,5.199245259069095,3.0340947959414275,4.83417898272135,2.931933631166567,3.6367599801821706,4.9755217835595635,5.296549195366223,5.21682743879886,3.9871151507421065,4.165150075722423,4.628994780770109,3.4750589694486793,4.44622532943441,4.488443840047157,4.4040420513600305,4.0221717463346645,3.4930079920163397,5.732772393946417,3.8082655744479417,3.607176453844967,3.8315739289400117,3.5806887104135416,4.774643758940254,5.058445879185385,3.7702972647470774,5.2279319685966525,5.248448550426224,4.130943497184482,3.720336495391538,4.146810195789267,5.575250228980263,5.379649466672157,5.409033225369017,4.508200034025537,3.710086567316849,4.454361708391914,4.07407666284724,3.968071702488246,3.8935820915229256,4.921094453665878,4.470408244528221,4.496158748515166,3.5748988057991453,3.297001148810546,4.173321041662584,4.494696907759781,3.8966010718503634,4.440114878757186,3.782139274889671,3.706032957440632,4.1762618664486935,5.325112445156891,-1.0603658508602196,0.20704705774766474,-0.6601701829443326,-0.7181504291611208,-0.30838922474365127,-0.17072893391012867,0.47242191745321543,-0.1564623968960777,0.49815358160602996,0.09413500708206368,-0.5515065465653064,0.17153864068528185,-0.4532370187600887,-1.0934704922557075,0.007993797217114485,0.371027309434683,-1.1225304534284697,0.188311177417159,0.7913322381620244,-0.42144367143471867,0.0320488747915358,0.1317565914591647,0.4572901215276286,-0.07449292003707579,-1.2161373363205965,0.5306111253376637,1.0296507146809006,0.733507211357681,0.25521847553605015,-0.5621155272699156,-0.019998311983779077,-0.4656769646391834,-1.0244788238807108,0.12061909892241938,0.877941925289169,-0.48763456979397063,0.897694744623881,0.5513197302899772,-0.6548747532677276,0.09238244885154223,-0.8360526531930437,0.41010579305417644,0.5936063651338027,-0.5298729135326531,-0.6568380255622371,0.02336438895912152,0.2930395772060528,0.20181969679655778,-0.192775511884533,0.706946830134407,0.008698824888314307,-0.8429155460857295,-0.9090408609776626,0.0327341211328482,0.8964568682510615,-1.0018473856821548,0.20170164299833243,-0.2554379989879063,-0.5743333544244476,0.44299390100219677,0.4167864523484154,-0.90326329137975,-0.7430396172924831,0.9953943573402161];
  
  this.h1[11].weights = [0.973141926659217,0.4653648620263562,0.24486919519047934,-0.9897591718134202,0.9943395567771374,-0.4611855195882022,0.6672614653137519,-0.11007192687821199,0.508371650226419,-0.354646769491254,-0.3821403779527886,0.13884847979719767,0.34987409382657747,0.08724352274433717,-0.40147715656752264,-0.32032591789594983,-0.05107030966019412,-0.8338155342335692,-0.7055679919981932,0.8798745783940889,0.21887161454337153,0.7863336543670745,-0.1793081983644215,-0.8571941649974113,-1.0369795201480134,0.7978373173902241,0.3602078639693717,0.14940423858541502,0.21582519809110304,-0.31530434208634145,0.5378136447190727,0.780193682984144,-0.6664067433214576,0.12226832004860291,0.8381684697267029,-0.9955312742390428,-0.18669510936962466,-0.7759673097038852,-0.5175483747583587,0.5985935658347444,-0.7308678159403352,-0.4115760004208593,0.3937416075321143,0.17701890175753426,-0.44362789216436105,0.38618753582695087,-0.9255220664860071,0.1577543223064772,0.51446027015621,-0.13548620389399418,0.4591922334570316,1.0215727669675312,-0.5599120910261531,-1.1670622624450933,-0.18945846654098625,-1.112952407772308,0.27421328968126746,-0.2777455418300101,-0.23653254022592574,0.6925372829956804,-0.6970547140991892,-0.31275065841213356,-0.26540394200801076,-0.2964827232202474,0.09573809058224851,0.6083140508360695,0.41651409533308353,0.4089572675427855,0.06279194235788987,1.0638707102370442,0.36851360650734066,-0.10875202992858009,0.918126219286513,-0.7348687075408675,-0.8027649285934069,-0.3877801026863174,0.9138212668725239,0.806618442828619,0.8027809323819142,0.6126934185264189,-0.12626168833846588,-0.5116702882869582,0.39946766722262306,0.6218526611935914,0.5898606228429865,-0.1568725213279846,0.4642005264461819,0.18483513855346304,-0.8838284342979356,0.4764832583582539,0.23666160837278302,0.8259705498028022,0.14388469533991494,0.9266912398112471,0.623675104336934,0.5334093080112408,-0.2639939681630214,-0.7587102201386622,0.715139757531911,0.8152784204763076,0.707109312813349,-0.5597341766287585,0.9296927340292972,0.11700563344303767,0.17739451767496608,-0.1843178587638084,-0.8196430678545693,-0.484529687122179,-0.5380073503336333,0.5460069327173726,0.5649399864090496,-0.7374265157863127,0.9022141228899472,-0.2895534098044018,1.1463644522701737,-0.43435059188000563,-0.14151255873211274,0.5645683616256202,0.5934659300276736,0.006055652283843897,0.3807110496847514,1.2168997867147302,-0.2984279383376228,0.8877157331016047,-0.5014328900803874,0.14850934724173306,0.697855270496026,0.49331184681353996,0.9809022033742435,-0.7938261107518222,0.3071015487229076,0.9237142446974936,0.009664298276173221,0.15654139160615113,0.11946113293761274,-0.6336560660547066,-0.0010139741242642035,-0.231670551067898,-0.6609837268564136,0.36394146020212137,0.21234673423953201,0.5682534449272358,0.30133001763369177,0.29256255744321963,-0.497607400862596,-0.2722589387011259,0.20018215924313623,0.6302332048872222,0.1803733694830324,0.495685005100395,0.4834191656160603,0.2135334333258386,-0.42204224461302153,-0.5126638435967428,-0.4765367694520724,0.31862203382792104,-0.6974339415913913,-0.7820169073870581,-0.7255015275156586,0.7250828791317029,-0.774858563324798,0.6521962627784558,0.784042261978437,-0.31897323271622363,0.824208704371546,-0.18125337047485124,0.11536708148772815,-0.5070756654456806,-0.6640761001881181,-0.583334739207733,0.5775812020007158,0.6695581183369015,-0.6421124172522821,0.4578765308538385,0.8121671506712403,-0.6563882705180911,0.2877617887496538,1.2167192661509545,-0.8029851403543075,0.9606024695031237,0.5417981716457743,-0.161837986107951,0.3068144440325003,-0.6512858904552385,-0.2343325250691626,-0.5210361021618696,-0.5496136193849652,-0.6070976769811728,0.10934709592280956,-0.18729551852748372,-0.3277714549749571,0.4820808485666811,0.42239277419518967,-0.5911475086931047,0.626819488646503,-0.2673501736640981,-0.14118602310834058,0.26934567325889275,0.16317730795172178,0.2846750517841537,0.2874712865734595,0.3399728700558774,-0.13016225192558178,0.5876714193558177,0.6387302797939404,1.0833921497006787,-0.75038423756778,-0.5182550291816574,0.9824644810812587,-0.1503484433654234,-0.5413102718734887,1.1094608617775432,0.13065168314487738,0.6780170305026998,-0.47990390945752864,0.46312829995556215,-0.4707855900574524,0.2859546224745117,-0.09950134447797707,0.8953940355839329,-0.23807573651677127,-0.5294350502445349,0.2173279546661825,-0.07759941762581922,-0.5061610672745044,-0.18269263964611143,-0.33533452337572606,-0.5606284598335156,-0.5818228002656963,0.862201866545669,-0.6980217134923699,0.4523387149419842,1.1281871720745702,-0.17935332027774203,1.2048174556474431,-0.3537857968399407,0.18494739834497836,0.26878566524611336,-0.808821046744719,-0.48874824826383184,0.8049806868389897,0.5352172085129856,0.08536162332584507,-0.72553374740932,-0.14413147184957698,-0.6432925050049143,-0.19533079792335512,-0.25394671915575184,-0.18979936724143015,-0.6783545210461356,0.9359627217471429,0.15308360886729314,-0.762073311129501,0.2913268761871496,0.9915474496572769,0.49056690260033914,1.1861849309839638,0.15592324524129303,-0.08353008415052551,0.0617068996685605,0.7652975273421566,-0.49921745583214416,0.22667457688911263,0.6712270005982524,0.45675189265723815,0.4092600712025849,0.8312533254087408,1.2179577947411764,-0.3489002615066978,0.5440738855245846,-0.5574830059054685,1.221149347062515,1.101498644281762,0.3035953417756038,0.4747261390441381,-0.3391465995042789,0.508278828182927,0.3212482744221416,0.08833374458701164,-0.1433014908626326,-0.12126060148460319,-0.5173723018415491,0.6822641926669379,0.9326302789130423,-0.03496595701125681,-0.5162249578317141,-0.7134255184328174,-0.48440426761952504,-0.4078985808652543,0.7583820125699293,0.33047144708090576,1.1642396638585188,0.01135366565467798,-0.5163837789309609,0.12043958515772674,1.2870321849303095,-0.2540276700929295,-0.42423267323723174,-0.6406303658529314,-0.07545568588384582,0.7995514072710684,-0.09512326132475378,-0.8054604770998398,-0.38214478119212264,0.0019590501408561843,0.8532874926873807,-0.5175030625922084,0.19966396235039893,-0.12940980640946045,0.5830682606879412,-0.625414894363885,-0.014125048480068642,-0.5403784018227269,0.9269100213884662,-0.6319463203778711,0.37078841154637354,-0.1375197646634455,0.4374472024188278,-0.4859441674622978,-0.4900937278634038,0.5526790059957136,0.14019325214824072,0.9473660477987138,0.513956118600647,-0.8426815826081354,-0.5282828268977485,-0.8496175658862081,-0.6795709829649714,0.9152253898595365,-0.6834368114065872,-0.6540756355143946,0.36763060081369425,0.9408348132596,0.7551045110988562,-0.6423368567748386,-0.7756383561757304,0.3763840839285879,0.46437624545054423,-0.706756489825504,0.025434378442679713,0.9060012751559028,0.8102154694030692,0.22202095497733093,0.3837198645152498,-0.409429267098251,-0.1348335221769269,-0.33016485269210855,0.525262357683683,0.8712470031640689,0.25180276781664623,-0.3156448508888557,-0.36988235310490336,0.12947884205723453,0.018882590840933224,0.5689256242020369,0.5094630856745799,0.7177704714039399,0.3377603092826754,0.10138238445081296,0.8658602158088525,-0.5110459760755494,0.18297454684164605,-0.6774717903413351,-0.3280154200101685,-0.9292224834123892,0.21670194055115755,0.6636370870255835,0.18857663954780576,0.5781183306784875,-0.2750068563740905,0.5838490474548871,-0.6454537799589521,-0.09536515351648982,-0.10602544320740911,0.32309962833725087,0.45484775269406086,-0.3365451565098368,0.5656036042075693,-0.5806284631677892,0.0676721964611528,-0.3088235239499594,-0.09653600363338029,-0.06318219633580689,0.32367126830651716,-0.9059958041305851,-0.514549371060625,0.9300782132477221,-0.22845538339448357,-0.5182770114464654,0.17949814495301775,0.7010668394360899,-0.3205101250318192,0.29114090116599006,-0.06947322886948015,-0.13672688946242154,-0.6204191645600362,0.29188017769694574,-0.6593846485247824,-0.37648721912889593,-0.3191615348768587,-0.7456996148825317,0.5991440163384465,-0.11975630526059969,-0.4441487111295831,0.40680364753725023,-0.5135699108352152,-0.9649179560486916,-1.2708064377476689,0.35870529136080936,-0.27178003449733945,-0.10569180237822086,-0.027853935134644393,-0.4410714991569828,-1.0201520046693187,-1.0034205217010732,-0.299865849156588,-0.9858698110838499,-1.123034841885197,0.014714537447370233,0.13602966528081353,-0.6185233146082053,-0.19543004937169708,-0.5683343714665189,0.19945336246951673,0.07962919409521511,0.03844942523803819,0.37176293311917247,0.7791133167875501,0.5810515856955474,-1.081312197328378,0.3673885483716032,0.7595929971170323,0.788684709949138,0.3067401694213048,-0.3218422346006252,-0.5711900655669213,0.7033319816229964,0.7792882818499997,-0.9387406644271132,0.5952171385314763,-0.15884835465689617,-0.845035155159874,0.07469533564508701,-0.6480644425972342,-0.566281896987137,-0.8073031882434378,0.5968517989819793,0.7086508408922545,0.14733026617686706,-0.001719690379894826,-0.4112504100407065,-0.5592974471622169,-1.1172548848189836,0.030127890418673843,-0.7090221366520086,-0.8766722363611117,-0.21752793939945655,-0.6272520514743171,0.11608912633649845,0.800914990785522,0.102823333389053,0.4225752568833656,-0.7556908626231368,0.603592859804724,-0.21943771566686932,0.2540037939722151,-0.3245147652675974,0.1957428505290212,0.7573071603757868,0.24263045003985254,-0.012084554440223062,-0.9398267479032273,-0.29795499249456375,0.831264827462819,-0.894988904270732,-0.37037136855313724,0.09529001649601761,-0.865066288192161,0.4469645583374168,0.817260267754145,-0.8834789483625527,0.06291735023274886,-0.0289529928324904,-0.4776996879516546,0.4347685930456649,-0.6885446323278324,-1.3360967850568357,-0.8348817583669212,-0.2719105740199016,0.7507809807082589,-0.022517615051243736,0.5700014992979816,-0.7386820984660866,-0.15101287968501265,-0.5785866047547985,-0.5673375934972915,-0.9228164833090933,-0.8031940803590375,-0.10624119699823475,0.25571686095185847,-1.0790310382598256,-0.3817470946788264,0.45275296138758103,0.7801960776650724,-0.3535071037597906,-0.835504800784827,0.07153848368427866,-0.22121218934768833,-0.7850969872050608,-0.3825831885830782,0.5377655157576852,-0.8077375235424149,-0.2664654529006066,0.7376111902784818,0.46996611537623684,0.19548210304393754,-0.8680385684404744,-0.5713831180460162,-0.2667030696616223,0.2870868007507822,0.36080431357246606,0.6891760204483871,0.6689676746183167,-0.7363771541387234,0.33703818918482914,-0.18039496345918815,-1.0333748252888557,-0.0737621827342012,-0.9024140475366769,0.3986985979959069,0.7849901854400076,0.416502586705139,-1.2685060640054746,-1.0874299299888455,-0.7724055989890244,-0.7668316826819614,0.1258556589380985,0.617269342516805,0.5093723554356364,0.5890900597722747,0.4498417740606296,0.09281668506111553,-1.0283197043264007,0.0522732901392705,-0.5632062126371193,-0.6075708800073713,-1.009044453864416,-0.30415887963547356,0.46598282593294016,-0.9140125221463624,-0.33681501095281885,0.3842266310135264,-0.7948963778089659,-0.6419022583551893,-0.5953017418594174,-0.7529144665566874,0.1791295955067763,-0.19340331496171714,0.18394378181402238,0.054056211804200865,0.4473598562571783,0.299533183772677,-0.786706035045121,-0.09620993124756412,0.13600435139718256,-0.2698288110944113,0.6052332800512713,0.6448881391959169,-0.3840948988665999,0.7280586279748362,0.7957978667923983,0.08251681237619797,0.2611779594800457,-0.24333543963711704,0.3654858539613854,-0.16515267146628543,-1.2706285044974504,-0.21779162715980138,0.41097083642174,-0.14994684106797215,0.39017606434138086,-1.0713048909172278,-1.1845567027580097,-0.9543335505840324,0.7201131769914378,0.28574240738970896,0.47586914731016844,-0.7584945083097208,0.2320548192282495,0.282334777859862,-0.20645378818369486,-0.8944662348454958,0.08461803008248793,-0.32419901044423055,0.6878164034473303,-0.47707694315163984,-1.1802022670273642,-0.9615532778306353,-0.28908286020889706,-0.5332801743053024,-0.6206340427879828,0.32823231084273313,-0.990946006428304,-0.5049664940168334,0.7091664103351399,-0.9287431057962778,-0.5218371819067755,0.16030278621942642,0.11647175143808543,0.8526085071093201,0.6643270098878357,0.21725552780910407,-0.7502029918642188,-0.09568075878571324,-1.0815778494003685,-0.0374869422903211,-1.2259255349665035,-0.12893862256708,0.6822882335973213,-0.6370472562369025,-0.9170908085348979,0.2272255817702909,0.06568725961245281,0.3356086813067182,-0.5960594659439259,-0.6364644517565291,0.33472338737223584,-0.2680525749094555,-0.8861329016799308,-0.956117857807616,-1.0583764025548477,0.11351024475688945,-0.096662052818213,-0.3149025659846671,-0.4378395778494406,0.5716372923103604,-1.1298903052913145,-1.089608906837723,-1.1326353768800148,0.6661124827384713,0.008593005661452156,-1.2212538138330131,-0.227620935167829,-0.8635625934233732,0.29253560433626663,-0.3278411275450374,0.7626327066556121,0.23291613067874609,-0.20407679070111515,-0.267359765166524,0.6058964234659353,0.06226049183474807,0.1937443478371565,0.09951547072254664,-1.236250714114883,0.40164933950419723,-0.3910325056437046,0.3539723473661521,0.13486959610064797,-0.9775349640599438,-0.8231418488969791,-0.33816617720757497,-0.746315917565219,-0.8626715425223499,-0.43801990610268837,0.18450047239978382,0.7142679851650903,-0.20778282973675286,-1.0227570803128128,0.7348028108034215,-0.4794707174564189,-0.026034880779696106,-0.9890128325983336,-0.8972024800101174,-0.034468468913842414,-0.15942654784896448,-0.7292859581275518,-1.2108219669388165,-0.264380794771241,0.28951150140297716,-0.37067159864937865,0.5713632667499569,-1.2293018267200977,0.603250817878432,0.5222974737547301,0.5408876295205826,-0.39264602572209545,-0.2986663307870685,-0.2779598900914371,-0.8339939275151695,-0.18609494845450092,-1.1642963269170377,0.5901916316775129,-0.25384342992464715,-1.133812888280532,-0.7870391634931873,-0.09986745682396214,0.3132926774486924,-0.5165253398244374,-0.956000299287413,0.5259894436412028,-0.6037485108697476,-0.6173944327737141,0.6302610243855263,-0.8236804630811887,-0.863207333084018,-0.019008575873575132,-0.9120041914021209,-0.9885775516110468,-0.21390893013834228,0.3590851501543442,-0.03968708956817141,-0.2230232071024977,0.23186558583004044,0.5907092060459544,0.623811995242575,0.6038187972185685,-0.07062251149081829,-0.9505134357824698,-0.12390717018519583,-0.40765059277167287,0.6554169429312903,-0.4757114740109576,0.2068551722567332,0.6961842014960836,-0.6325202396730696,-0.4400845325735847,-0.2681822345091764,0.060386548174402664,-0.8700034329341652,0.3274276233962271,0.5692677878436119,-0.7879899652273447,-0.40003637682816534,-0.8125857960533069,0.2628188730415335,0.36321587114644244,-0.7542244046329328,0.9337353734131668,0.9150074702095611,0.4968207329921803,0.16940006624692938,0.9667089657861162,0.48964893009219856,-0.19221730508962212,0.7406430657514949,0.6850456205609836,-0.44733009104106247,0.15114957111539987,0.7539082993561589,0.8853807618610838,0.633871203641592,0.3918969038184618,0.775729578611019,-0.825434557199906,-0.16788547387805253,-0.4819292741508199,-0.8782803184408022,-0.2924977458261083,0.2346749028002968,-0.46803533563648453,-0.3869650366575899,0.5968783448977145,0.6471854836151618,0.17312916299604023,0.651772429777195,0.4655619426170255,-0.2361551298980907];
  
  this.h1[12].weights = [-0.7488608402086099,0.1613387664547563,0.6042267026677277,-0.5987574060774641,0.08622371128049267,-0.10425620250524581,-0.67070273725838,-0.5780850811836356,3.446062325713152,3.8090820532787912,2.419847316183782,2.4788308231701306,3.4579379304683755,1.270752573009445,2.472717532175884,2.7326395972312056,1.7687359197831645,2.7951259466432514,1.9646838550435213,1.7042328641511002,1.7275343229416198,1.5838810224530506,2.9043386874649344,2.1318123259231982,1.6964888680110501,1.7511548179256076,1.9817180879533973,1.5473632078301074,1.2500200693972745,1.638278346712993,0.5820198958901777,0.09377287894998913,2.0654095195130533,1.377194945522762,0.19590493190380637,1.0006211266635976,-0.05933156567446983,1.2666104596280474,1.2830921311794539,1.19420725819407,1.4503462829267046,1.4247786442963508,1.4525959372660102,1.1704449489896405,0.6674977669026154,0.655717033134857,1.520993423455844,0.6497661542929245,1.2283199008644534,0.7139617125578512,0.4134533372480535,-0.027581814562093784,1.1458466996035028,0.7058834406206954,1.3560124994124323,0.18994058069599812,-0.03826313035157902,-0.6568162076815427,0.9834789457592161,-0.7591105021026903,-0.1377225989390598,0.8186856734133396,0.4860976270196482,0.9463154522898845,1.9395559551456707,1.8031362080897855,1.144634708643028,2.170118039525512,1.5463177806795734,2.5629374644539293,0.5697875175863554,2.0719014189936025,2.1463190900916675,1.5453880226864762,3.327710497089867,2.7957769414107356,2.0487809209094827,2.281772628848258,2.135915707118652,0.9412021884090043,2.616949676147563,3.659129234395706,3.6890148363830058,2.8999734264383408,3.9627728960464297,3.5251361875628944,3.1352152751377513,1.4782774228749143,1.7456095897358355,3.9000156195838755,2.634912736868427,4.449575930320019,3.5624237656984903,4.107522598204057,2.762942590506061,2.2394899243154325,1.8651972066601408,2.3617787939354646,3.5726405449922924,4.243174480157694,4.179316359375209,2.3089197456803827,3.2596195559643975,1.6882878841304516,0.7694122706578282,1.6280292443048412,3.1878832160491557,3.664693869240032,1.6126004413244401,3.6188181915162905,3.3865496140825804,1.1828372108846357,0.8709693049106708,2.8704279774609085,2.719914640346182,2.513193247077286,2.84456460701681,2.850008751699908,1.265932574411048,1.7780551000911553,0.9238658270175991,0.8942176512374368,1.4384133413776687,2.1911234817549925,1.7146914588531006,0.71968354311922,1.5283454736140634,0.2878819943837479,2.0212289649167032,2.017800307798197,2.3597525633231564,2.087698420026335,1.6628723853967788,2.243959293682334,1.5657790351150591,2.0525076520803447,1.9746455616865215,4.007797370796661,2.485553150077271,2.6438561974919845,2.4091209341165096,3.164714371013413,3.056054678452111,2.279662183298987,2.7472683935377367,3.1080001999353555,2.7024571395428487,3.4044637794805195,3.813303835182088,2.9529933990579846,2.077679872537645,2.8067498878631416,3.3434774180621565,3.341839112144648,3.217302573768331,3.827829526850012,4.037677774386341,3.165773281755264,2.3557998904970447,3.7425729726056542,2.4411688858867113,3.13961782377509,3.7148455969123337,3.4000990597263323,3.784331308447558,3.2856513060790706,1.923880435076388,2.988549382514294,3.0404247918484497,3.1808228884509924,3.2212911027003575,4.252058387214506,3.481980284689752,3.3738582558174146,2.691192214936615,3.3881540720014343,1.5536185021572106,2.969113091914573,1.7925815113637755,2.879190557666785,2.858742079645051,3.342747100253723,3.37749059062069,0.715624735955784,2.0029175494821163,1.7161419260541662,2.5821161097775427,1.472181294019125,2.4915254340745148,3.1292880086839134,0.9005514034925767,1.0023969865513362,3.9033556210307814,4.9674569851777886,4.101805794027344,5.856106202912578,5.585451970123901,3.5991242385817235,3.3086464442428065,4.5150744709971455,4.744542719969459,4.746521105383268,5.434964499289246,5.171101101056906,4.540233551042205,5.571300610003175,4.2658458090338405,4.079965503886113,5.213779833118577,5.193439471465874,5.384303415754058,4.666198584244463,5.042712704250197,5.551320134946199,3.8988930693378645,3.864906912117522,4.146741364928306,3.9528470881841082,4.90542215663713,5.263877587435208,4.537156157732158,4.743623368017356,4.080622125898157,4.202379760689211,4.670637397593356,4.239416370513083,4.8196202048290155,4.505557582905936,4.792867406944958,5.198345205914384,4.9354535445233285,4.694335124402577,3.7653553602011534,3.5281092248903296,4.826877215470501,3.988140060444988,4.304720694007916,3.3258196924922743,4.170999859847649,4.632070411483092,2.8049551083533175,5.118935148411488,4.7416706300294456,5.061484766591433,4.735075607506139,5.000806107917297,3.6249598576083506,3.0954894554215766,5.558712501371601,4.16338280394223,5.4327985397732,4.787426361445502,4.024475883690354,5.8021128335275325,3.8672516038393576,3.6456416104581697,7.192720440401595,5.245880474891348,5.8336167128536225,6.08305205925521,5.22294012161051,5.334574806683655,4.8438547626212936,6.449023862583483,5.519070848789449,5.792325966692873,4.5273764091803494,4.936319903605343,4.754334781394672,4.2298302415521665,5.366489187773365,3.9709509848555546,5.313504431403422,5.0113561814761125,5.792985050832168,5.33435219369233,5.125968521547176,5.856088681556234,4.826237529028673,4.997913171023704,4.6225827095241465,5.116980946063866,4.9650697833118915,5.84732388369807,5.642023222043285,6.13719575408339,5.117995263693375,5.740654888322623,4.858469545709107,5.652887837658685,4.531008288375629,5.526672880762891,5.0189508780559935,5.5461476640138265,4.84231972319444,5.316817462754381,4.756277318532577,6.107728734919048,5.500670687647197,6.293992901011497,5.362880527072267,5.439520671807184,4.07589222386242,3.908948074311679,3.89065076591306,5.569027525934701,7.990369126283651,5.469977673899377,5.858444708620073,4.621136893802431,3.834845745920799,3.41987068906553,4.7390861059726435,4.741494314207406,4.76993531359481,8.305200248224667,4.858151447085455,2.8896255326422344,2.4867436505393647,2.747398590857898,0.417723653993259,0.2192269585773256,0.570456096968712,1.0447648758366916,-1.068612359321192,0.4512545545821608,-0.2562808741868699,-0.06469225302449307,-0.8223031988086538,0.2684159666345651,0.21370043581935974,0.34883301992950383,0.1764392053847487,0.9371306889359998,1.0686133274338607,1.1518423968965017,0.09143059368277465,0.765408243268542,0.8385665023838808,0.9748553727641444,0.22557610182362547,0.9073112389574479,0.8901497568050005,0.7526557966348953,-1.0824709162701318,0.18965195982119418,0.9056965627607548,0.757539065078909,0.3329731746729316,-1.0376360537129876,0.8120473059149715,0.5898340883561471,-0.36429917983985155,-0.11655581623283252,0.5713520917025441,0.3870824608938531,0.9719250612119325,0.6540838316857154,0.15112178303460944,-0.3453900676803061,-1.30146854544394,-0.21199661695502123,0.4821454591804067,0.43727670624799964,0.49347353894581075,-0.11206534996846855,0.3841163908785586,-1.120959547030352,-0.9991927977859308,-1.2089445710842859,-1.1230616722016575,-0.4206810455126717,-0.2863786042693988,-0.3370826544834551,0.15195393350818295,-1.20236538969105,-0.4932931373387673,-0.7396103851003782,0.3222479363956894,-1.120795193995591,-0.5572960459130389,-0.3670188808793908,-1.1042080863604609,-1.388474857257183,-0.3248216149144585,0.9020380105371846,0.7898223996214955,0.2286354407514728,0.5588960049892773,0.10214992598447115,0.14069338943500087,-0.9750978683625315,-1.7109746819325296,-1.1636545895696455,-0.7820187545294629,0.3343998652537301,-1.1509353814958387,-1.825476465656083,-2.3759866586164105,-2.018900359877669,-1.464102286653796,-1.901106419143603,-1.4533470715888261,-1.9928881191835013,-1.9457838970513557,-1.807288107508572,-1.4917698114870366,-1.9654607575275163,-1.5857693815088856,-0.9575229276815633,-1.593226188664827,-1.6833944474157145,-1.895335672532988,-1.7293433358300174,-2.1902480271227653,-1.0766022876314334,-1.51189363802107,-1.8713861904501,-2.4226776471702416,-1.7631436612103208,-1.601564050483024,-1.958522905563484,-0.712295616759547,-0.9054105986110845,-2.242435783237978,-2.6817884524261615,-2.9083852733819278,-2.786501438882357,-2.016846109945919,-1.751144605747605,-2.6786763179830015,-2.94110743704509,-3.5934194705552858,-2.559688348678511,-2.4080429895386826,-3.291686330193679,-2.130891147654323,-3.1376488996309755,-3.1698219510671506,-4.233257241287664,-0.8285512641893247,-0.7032532506004388,-0.9756061554997695,-0.9495994741189486,0.42578165598686635,-0.6693535795156684,0.02773645461292107,-0.8845232360985658,0.059022830380255464,-1.476994115845753,-0.59553325423279,-1.1380177309786177,-1.2839844573450583,-1.182313633308224,-0.9566415252100522,-0.3115033475480116,-2.6927380277732595,-0.8380919332952793,-1.4808071017412274,-1.9397975081552992,-2.9236508465464577,-1.588167717480634,-1.7423673060349305,-1.8620247558044516,-1.449692127476231,-1.7677314472079164,-4.253128933071469,-2.997888592204071,-1.4431064015729125,-4.153995820068418,-1.3395838385336465,-1.470199716321934,-2.8677718751702588,-2.570597142934628,-2.3928633245300253,-4.3381723755502115,-4.672570101745278,-2.093448011262215,-2.737554340578942,-2.7039977082645312,-2.0424161660962974,-2.3117067527248087,-3.6590070499335843,-4.591573177233756,-3.7015281387241386,-3.1041866722321867,-2.572607329528524,-1.4012108920624409,-1.6372415780579552,-2.0850870394355763,-2.3731226862385144,-3.272255737963323,-3.8184789670357517,-2.023620349919336,-1.803090281239028,-1.1969070687570542,-1.276722749504795,-2.6429388163863954,-2.1427915722727247,-1.849475293189117,-2.7462789934203666,-1.9097708732008751,-2.8480713981558354,-1.2083381445074375,-2.0469201015370175,-0.8455765821428552,-1.593494029959467,-2.4257508197039512,-2.691659593329225,-1.084434613177638,-1.4577729650881157,-1.4814075457772267,-1.5150148905959624,-1.7722461036550918,-1.8624084546942579,-2.1302156810274306,-2.3034640014948202,-2.295412352139053,-2.157210666800532,-0.9946905010445611,-2.5741792360574975,-3.826588128284419,-3.6242631425852423,-2.252361603877146,-3.8148452600970537,-2.0584500037587223,-2.673303748513346,-1.0835382226337278,-2.6117237030134044,-2.6503992459662506,-2.7161040855867196,-3.1336769770893946,-3.9136221252784846,-3.6209833588143097,-3.2980602120839184,-3.3991160180253495,-1.0901377953429967,-3.730327888937963,-3.1152692228242915,-3.847205329249857,-2.762992330583622,-4.325807176703722,-2.4551528426002727,-3.109490289649405,-2.66022818520112,-3.716401296064049,-3.2510071665720766,-2.4057252950193337,-3.599560804368244,-2.9391724535773256,-2.378459857873786,-3.656862558136595,-2.078180406333302,-2.6490564091363344,-3.102268426976985,-3.2196007653322294,-2.9429895661727477,-3.8939069162265865,-1.9009462933796988,-2.5559660805142825,-2.335763927504294,-2.8575700998717926,-2.2607010629483097,-2.6164727654168756,-2.4537352774759755,-2.020522252413493,-3.1344344451254975,-2.0645625871025732,-2.8959913098442778,-2.6867886411958906,-3.4867411351972732,-2.3796064677599853,-1.9895862181954445,-2.959268282851585,-1.2519606993308796,-2.942554549081926,-5.769732583254354,-4.315154505472875,-6.1012135692284115,-5.058162315653836,-5.316955912031129,-5.122148527589458,-3.3703265965415836,-3.616871171135812,-3.644209827269353,-3.560964572112161,-5.7927739433334375,-6.000347615409671,-3.686815638246257,-3.9502044809694596,-3.9184903802630497,-3.049090539893532,-5.185754264293379,-3.7976189433509306,-4.150635231219175,-4.549403593072143,-4.745666426403163,-4.088242076797514,-2.816904568558011,-3.0989166246415105,-5.290112389396798,-4.213197692676977,-3.513145507271946,-4.383600680086771,-5.135715062202151,-4.625840241687232,-4.492924754066357,-4.4798791217898355,-5.159548065883718,-4.890566007693211,-5.10597896137892,-5.461209398460715,-4.691022659519247,-3.7059351599171424,-3.4186019529098655,-3.890163960323269,-5.042961108991077,-5.834806277789704,-4.415139694048525,-4.906633047337185,-4.527807365193724,-4.265988115011794,-4.7771304177989355,-3.619975801179114,-5.733497067425411,-5.600973441399479,-5.3267780127022215,-5.88332432291328,-5.4020104770780994,-4.564728706248443,-4.1570487291793725,-5.147384537150172,-4.923528055179236,-4.871542752982262,-4.0180629058891615,-5.807873126144438,-4.707195451987774,-3.8202062308406,-4.542982567204271,-3.8978587626278145,-5.40505687959695,-4.17792187135265,-3.603807287663505,-6.591675687735323,-4.888237165672317,-2.482689793737151,-1.9883111777734654,-2.592080924352443,-4.049507196865214,-4.364841303351128,-6.578813260021426,-6.079519446117709,-6.313923201965528,-4.389489163350389,-4.174552145962971,-2.816129956695425,-5.294480874240146,-5.3534933874697685,-6.153130085736874,-5.0270549672998746,-5.382370978557105,-4.92644588985952,-4.591681851425684,-4.856686453876387,-4.976102213523263,-5.659535002722838,-4.931373282607873,-5.592849546418043,-6.208497078556967,-5.4530818097016,-6.115252632036669,-4.89865809178704,-4.9306660602425625,-4.4840657216253685,-5.662588226570731,-5.6149931832023645,-5.486683157410338,-5.278931844464642,-5.954095734747238,-4.925090363533515,-4.441812769439446,-3.9155555134394033,-5.6616022761325695,-4.865315019763561,-5.304955230062326,-5.599745172881286,-4.1311993377842064,-5.616620779448059,-4.54764837718051,-4.63832700059228,-4.8257236346994254,-5.649262547508491,-5.137644928149358,-5.872675237277034,-5.399966394195611,-5.267130141502969,-5.294073306174734,-6.291101069343243,-6.292783158824534,-6.712295761110802,-6.652255940936808,-6.07991977054806,-4.799100301468008,-6.639266477620393,0.9371600551762047,0.5402951552590833,0.09951468229226565,0.7945111997241479,0.41155356095942763,0.5003932918470072,-0.6871200577804317,1.3539339616020998,-0.4680077745351784,-0.46022513382112185,-1.2836978718604433,1.2332667300826876,0.9390143490844131,-0.9352558484325226,-0.41494539557624804,0.24295124472336727,0.4676465889343643,0.37403271756975387,-0.4281358546742325,-0.5757594138333002,-0.18987499227484655,-0.017548260266933943,-0.07380980362365523,0.8199937302822884,1.2927288925245644,0.43522108005827526,-0.91998780281049,-0.4363166859686845,-1.220838992461802,-0.003696904566034663,-0.143359200598945,-0.06281805289480023,1.072336519828015,0.47990932611814036,-0.9280841781573611,-1.228822143120817,-1.4874919261361146,0.044396510396983585,-0.2424602531877404,-0.3601933296748645,0.2956963906134515,-0.7131106190116567,-0.27047783747083165,-0.5644117537199409,-0.8757425983472458,0.10468628303550921,-0.982843109752986,-0.227161162185361,-1.1598428858833043,-0.3914010790921931,-0.1938983901005585,-0.10329571501743276,1.068435453961481,-0.030576362546711873,-0.5693333276532219,-0.015478106534372245,0.32358565753656576,-0.6548521653600861,0.16020285140649407,-1.1085355434972033,0.19286158903960252,-0.9358187997769568,-0.04776799903793957,0.029261344434904878];
  
  this.h1[13].weights = [-0.04238166471794447,-0.7661678864154764,0.13706921689392626,-0.8875423651187044,0.40111855857658796,0.6700173401683176,-0.2631270356757298,-0.8121510561547844,4.00787326885795,2.9095324645448315,3.462193978385662,3.0778475745117233,2.8474340314622935,2.8286110172842154,2.7396782470040346,3.566144009590924,2.6611721605854077,2.8557314713061244,2.4816219737087324,2.146768571221284,2.412189922542571,2.5880047609311507,2.081814243627972,2.3537316946727325,1.2854457168745574,1.8914312626911487,1.2775758630147747,1.4981426318607505,1.6799966350350342,1.6139471337029314,1.9439250284804044,1.6739914609423685,1.1650714025983573,1.2400838186411365,1.2429289151995466,1.3837461685964232,1.107263529914007,0.38500233126315325,0.8909281202715524,1.2570684439464705,0.832149155007209,1.5268997515680083,1.5285181373283647,0.8368371895322033,1.5112772121887015,1.7422182037219809,1.333854049687488,0.3530400173369283,0.8523240169701306,0.7658488211588546,0.4756327292172405,0.10689761475264582,1.5431755599904142,0.9845812137657343,0.731422412442309,0.68244783189516,-0.6241873771252178,-0.7389185338464186,-0.6896492924710738,-0.8792281060887741,0.07522645725827237,0.5694762004447185,-0.4211311234471773,-0.2644353240238737,2.610111457318593,2.4687166244669045,2.3670115242818413,3.2176230305324975,3.7037679539728785,2.1242969347117606,2.173560854010411,2.052261611320158,2.618611071160715,3.520070457131965,4.046301703396615,4.549385618764384,4.070570642269206,3.730348278618919,3.449347275952782,2.7707311974819344,3.1172876255027044,3.8929275852596663,4.7082863842064375,5.097022615254585,4.142554215040911,3.9024953675944656,4.056820088182244,3.008656698802836,4.080669409328615,4.221310503733599,4.176017955133557,4.555551960561515,4.972451373887161,3.9757626859177337,4.568317656594394,3.7240570707518037,3.937271452517947,3.7606458439417154,4.641658446891362,3.943873356509677,4.229980918103081,4.067160943528967,3.6958827942808696,3.7053779043239,3.533917803607209,2.983461111259561,4.833112416099876,4.473126575580298,4.168807763449899,4.362003400250494,3.853199083104924,3.215020200492158,2.488770512439677,3.192998149066066,3.035090504921825,3.9472751220143283,3.7852052620963064,2.9924749304315457,3.181102834350345,3.73640415675398,1.9726153846054562,3.3173368593289108,3.1352802305509715,2.496220025328798,3.156417788810984,2.5522600904543853,3.397425338578682,1.805079301171908,4.2057311730979094,4.237932770514974,3.798340745162955,4.095134370066395,3.2579949109094035,3.576351653942026,2.778170000827974,3.433920453423601,3.667536708702255,4.030345667078033,4.804131370449256,4.102960217969949,4.270144125497001,4.338941092451819,4.62082114439622,2.8190755771634843,3.773102090301982,4.248697232816488,4.783750056921285,4.390590179373016,3.9987021620623984,4.092061851179823,4.341587906315158,4.332837772249301,4.645672969736873,4.269454922932113,4.6547016466194435,4.396486811687501,4.337263447473605,5.0927170607823085,4.7073266024528655,4.05850556315437,3.6784920425203667,4.711384224787549,3.9875195460233983,4.857156024985203,4.565133389112762,4.8094384446042335,4.47986855687371,3.7498359813355817,4.404210118355238,4.316823534042112,3.957231541601002,4.205631927818731,4.602677796373098,4.190080664775479,4.514319044527392,4.495960254807106,3.8993265251404514,4.238353338824431,4.597901200383433,3.921200259745092,3.9624928662693315,4.220274163555718,3.790964229442988,4.000401958374984,2.650630817911645,3.1382925084847493,3.3742538785476714,4.120197320158633,3.122506835553564,3.4144469115428935,3.700140752375073,4.053361746320101,6.983419360397488,6.943281233841095,5.920418850455376,5.73122423072493,6.186858947210494,6.684020641987801,6.655420621544295,6.35455534152284,6.9532187209053165,6.456201718195932,6.938824858018732,5.9525692512446495,6.733215820085941,6.163855152063757,6.3865702588793525,6.305317132327614,6.005965089915307,6.238977797590187,6.181045171442709,6.689826204896651,7.03591170975207,6.126401606080472,6.314788397260073,6.354496512978365,6.098737122993442,6.054700659118705,6.42777685803916,6.26563351262935,6.709367512878174,6.229021736331492,5.634184511332731,6.181993929656016,6.681998726205846,6.274717976857709,6.775533687940576,5.938042596585974,5.872031349775494,5.727988835896618,5.381472694453856,5.941128211488745,6.324178820430815,6.139506388255194,5.58568109469291,6.7110792503367955,5.67597270803331,6.043719914738706,6.3007845779688525,5.064404121532307,5.67915125880711,5.834866824459005,5.932005815180964,5.70389260531565,6.21810019983895,6.069992054931747,6.171837081461021,5.027409110907094,4.932580109452373,6.3627759769689805,6.474026827032202,5.937457906617922,6.317961801633038,6.31563625926842,6.479372753755703,6.375019600418928,8.79795580616598,8.993154490415446,8.919623575395136,8.420292677101237,8.993590258786847,8.375289512823366,7.985476127306946,8.838639025849696,7.953047469873825,8.720320432675619,8.651636846475528,8.244676553127047,8.116635643150701,9.05858651648908,9.317508708212186,8.471378509938267,8.050284447741657,8.018516719172107,9.029981622357708,8.641891654299139,9.33556569639086,8.766528720306452,8.940139457361393,8.747800957076699,8.04953481483059,7.750111217844621,9.02148355608714,8.617902539911102,8.973162384494856,8.793742155521654,8.720273621952197,8.507164649147892,8.17607796442618,8.556326689215352,8.8519348404814,9.426157986083853,9.137754767527142,8.544230677077326,9.06481631707338,8.633059483298405,8.30229069046873,8.923803508052986,8.974867692368665,8.002298233488148,7.874471678151998,9.113860671151931,8.027709465159012,7.629596577144991,7.336447664966994,7.92484271290992,8.776585437482655,8.509138645288155,8.519730055503526,9.185354373395914,7.515024506701866,7.2371619002705625,7.880860297063127,7.394748594978917,7.461430578585642,9.202912715950154,7.297905387085669,7.079570937179288,6.3674974516214995,5.7757839315302375,-1.0541694881868264,-0.6283151198853804,-0.15040772563858107,-0.10548765366807472,0.29730327552393404,0.07025416293689775,0.12333490084629116,0.017988448518599508,-0.09845327803796791,0.35535190308784514,-0.02684516774188514,0.5121717634942602,0.7849631461832625,0.7021992128932244,0.4025638591832236,-0.30451167743221214,-0.16716214153816947,0.549931845081407,0.22116424083051173,0.10863096042292197,0.12303872323120818,0.01452908082155713,0.6201726782442532,0.030090985436303053,0.37899417419794107,0.5389719323933412,-0.13220163805530796,-0.16937445427267162,0.9337840988211832,0.1798373405060794,0.1807884829472188,-0.4581469832223869,-0.5423754483538147,0.30431382907635607,-0.11964517588339063,0.5410912427633212,-0.02836632216402469,-0.2711685776570635,0.4974897223614774,0.09989135406330586,-0.6069376062519156,-0.624289779303418,-0.16001764542348348,-0.24251819332797936,0.4113325627665673,0.415289875448748,0.2763309004100412,0.14174271005880254,-0.6691835401594254,-0.13577100621569124,0.06861150076477422,-0.38296287574590665,0.011097213328734637,0.5538221891667038,0.15277350828475517,-0.27128579082351956,-0.6212468014800097,0.10112061229920119,0.08343728587183312,0.05975445612858151,-0.40826210682457836,-0.727930470864857,-0.4675265909320127,-1.2262675660682167,0.01696467484045927,-0.797951558943367,-0.3835177820876443,-0.3842873331309815,-0.8177356501573785,0.6281482074295148,-0.5793650272374942,-0.785542012412892,-0.6999189648106794,-1.8243299006004539,-2.0465738140400336,-0.25361915059993484,-0.769075994238092,-1.3755210158880193,-1.8165289507797109,-1.005705550988977,-1.6090267308490973,-1.2258431784658443,-1.01560512313366,-0.5518198120381749,-1.6521854995960477,-1.0443237600258426,-2.0998713083620486,-1.276783062179238,-1.640646532050181,-1.0018093106041053,-1.4881136977101126,-1.1826238733226089,-1.3549940917157715,-1.3564750513522263,-1.850617104117269,-1.5420331121606037,-1.2345380389729825,-1.5250330815685325,-2.2182516471854656,-2.116480247842643,-1.6155297145580823,-1.3715626487138457,-1.6239728413148058,-1.1846742059592572,-2.4522085410476455,-3.225759043478148,-3.389655295917764,-2.2407428501308853,-2.4843077063302363,-2.1427467107680602,-2.1614608349941946,-1.754678618945839,-2.860376966742792,-3.4242973371250693,-2.3784794154711153,-2.688909081647237,-3.097812515603478,-2.298559637711542,-3.351690826402939,-2.864411449177064,0.6785715445308154,-0.8034638906389011,-0.7887070579719677,0.6044106031729264,-0.07431325300975677,0.07588057461403519,-0.6837618726401433,-0.7934394518495891,-2.5525402862196493,-3.007544064510426,-3.186011856024718,-3.18644754868871,-2.772307095783165,-2.8793893597041484,-2.4200568227436325,-1.7369621739619356,-2.74604555685664,-3.600178565875923,-3.763802950540088,-3.738965622931669,-3.787726623668855,-3.8983052559687232,-2.975723836138757,-4.637147082700994,-3.142550411983944,-2.9586176825566937,-5.228198908724008,-4.284283404014872,-4.227130674662756,-4.873829104342565,-4.408844752100031,-2.5855985004162028,-2.5861209603285835,-4.070997674414107,-3.9383754066551937,-4.152069662010304,-4.197171956168555,-4.241547175344851,-3.992820850525525,-3.4388951390918674,-4.0407705078118585,-3.720558988388145,-4.893846867190447,-4.4617110975908,-4.929461825297422,-4.316407478229725,-4.588155772883716,-3.791695828789584,-3.190505303814794,-4.032711982799465,-4.158572631537079,-4.668681423566839,-4.130851418326874,-4.823336779214446,-4.1314482511877895,-3.434643087955148,-2.8398387319110086,-3.7952409772084534,-3.9607261580625934,-3.246736431751546,-3.7707560716359403,-4.3676673569388536,-2.976952474177098,-2.401151362773058,-2.1587780992747843,-2.697990428449039,-3.2979353210538584,-3.520549723297238,-3.2562960247706996,-2.986090261383521,-1.648080384316802,-2.97057268736143,-3.801662894781227,-4.30410409819884,-4.0038961496287575,-3.4451341369425985,-3.576278349501051,-4.319936425458457,-3.4206365554399922,-3.295993035240267,-4.058916819464744,-4.999920301088724,-4.372089607439862,-3.736219123132351,-3.9680834902290054,-3.9263556541622675,-4.698442862225882,-4.192198874971415,-4.468751749215109,-4.30749609225114,-4.8083171338211965,-4.517752949907444,-4.343888143050927,-4.050266295443837,-4.315033458725295,-4.347098459992127,-4.068827982797647,-4.726854100128881,-4.079598867870003,-5.033298681604206,-4.877961711740463,-3.8806908829478615,-4.6155445451288575,-3.589152457816546,-4.5197073080073356,-4.306290250983469,-4.2937774900897265,-4.895480946947204,-4.876226472875104,-4.560662478540469,-4.382622157360145,-3.4723489014019266,-3.543784041704825,-4.201043064366839,-3.6466633333464373,-3.8124360168082716,-3.998965994281202,-4.719292684724647,-4.507169517531764,-4.241409193593274,-3.8600895753452558,-4.193381585234863,-4.284807546571131,-3.7347746262752417,-4.245291304273162,-4.408527163442173,-3.7539173406192017,-3.465873723674322,-4.40997473091089,-3.8489107689095765,-3.4003975372994972,-4.092255648144593,-3.936782978952217,-4.000960735720245,-4.106736323575595,-3.6252295031028647,-5.451894319700455,-5.74112593542849,-6.503667638866318,-6.5371899992738705,-6.564114834050769,-6.622899021742888,-6.085155389511804,-5.86700304299343,-5.645434831847859,-5.229005035076915,-5.447231574547136,-5.769855338114796,-6.1166493718094905,-6.321384914918348,-5.201525357881833,-5.61186448005895,-5.5638313459748705,-6.374358120652699,-5.4717622776457775,-5.544643923410436,-5.1661116238827125,-6.18337981463886,-5.989435464912842,-6.007935166068707,-5.750415174992791,-6.038111386730046,-6.225827231908928,-6.326282348477725,-5.805045384005339,-5.629124611914465,-6.441454775567928,-5.280492348113479,-5.944336774865004,-6.886208993382374,-6.149356053977817,-5.752626129932527,-7.0225812143003825,-6.819178114719007,-5.848733769605267,-5.912437871413643,-6.73182252127447,-5.912295017586856,-7.277374448996166,-6.5426281405855224,-6.400953795112006,-5.498226030919249,-6.220060448338324,-5.663886838477433,-6.370091468285523,-6.528221374922535,-6.321579491119923,-7.030000709413876,-6.791564366018147,-6.8303642324618,-6.495528053943177,-6.195139330966792,-6.893323957860104,-6.096490749405045,-5.588241434274964,-6.676470980520438,-6.292461055635387,-5.9766848845152545,-5.542000819353644,-5.590881857448725,-7.932439935141674,-7.564137100358181,-7.958236264959241,-8.856786152142668,-7.7281495781869305,-7.3466526704508555,-6.245616907786256,-6.579568678734275,-7.54007096950308,-7.430199115111201,-8.932174978259805,-7.460158606321918,-8.231540773474215,-8.482508878050055,-7.562520963139164,-6.647331118088887,-7.973622774783892,-8.19301499914367,-7.904763284255778,-7.628383393143758,-7.680473757567919,-8.129240923594113,-8.063194343101097,-7.2209039423616845,-8.059526943377547,-8.619872598328323,-9.082034963476145,-7.98084660726903,-9.105052392803817,-8.423069938813606,-9.150892694444925,-8.455231681588526,-7.677487934593615,-8.927218013323827,-7.946166185216884,-8.334088459171943,-9.130484047542483,-8.472278260712859,-8.645366053710708,-8.476334596959576,-7.750844628651498,-7.611623657122031,-8.248442841947368,-9.523308162008794,-9.1176884029272,-8.647932404459615,-7.784861326512735,-8.627512929312916,-7.07990684913688,-7.626373988319001,-8.98338689602831,-8.726386644807253,-8.389670301775855,-8.76009269349092,-7.482309974914275,-9.018938984352282,-8.786080266631627,-8.006009612013678,-8.042074752207128,-8.538298959245068,-8.812245434699443,-8.27893924896437,-8.621563580154556,-9.835601460122431,1.0554651481301662,0.4151944270967669,0.3797735488893721,0.5876796058441258,0.14460414373567138,0.11966368375496172,0.3140046788045118,1.0199414346207338,0.8332589829761639,0.46852164661100026,-0.018853747614130854,-0.27389159692565646,-0.2107535165990818,-0.6095768749786098,0.13344405815419283,0.3110063058622379,0.6358221466508989,0.5979977883923231,-0.11873501895096648,0.2962969387354755,0.3924298681307464,0.09580326440276288,0.3458053602600665,0.6605128809555743,1.2481745909778799,0.22743462760189434,0.2399570545547023,0.5387818753068823,0.11735737117888348,-0.15817884103569144,0.46535825324171143,0.5022407950368936,-0.13261146515705483,-0.5493629446474,-0.00304922625077357,0.06389587374470038,0.3911520448456812,0.13826348921596288,-0.5144463410050507,0.02079069669596091,-0.00946338768766529,-0.5879696100451307,0.10718928606284216,0.05159564719707065,-0.20765096306445105,-0.7898499821972991,0.2634342375581226,-0.6113819038124915,0.3035007687596757,-0.07048162357173592,-0.2116445163540213,0.1060392223525729,-0.3107688636521785,0.40806228109136744,0.3631120116375805,-0.22310639678811278,-0.10408725118151267,0.38290713117893577,0.21421195888110905,0.5082309453038937,-0.052974915967664335,-0.28047730862751774,-0.812445529588448,-0.5022577283438565];
  
  this.h1[14].weights = [-0.9967436146635,-0.20807595032518655,-0.5328263351871834,-0.5177921325328141,-0.04595959520756754,-0.09456009766896623,-0.0261401036987281,0.2276164464439332,-1.2235075114837821,-0.8220173102385632,-1.7933729699903904,-2.0203588358321753,-0.9410531609885033,-2.0953259934706607,-2.0433457855572446,-1.5826916668219813,-1.0141857059772283,-2.1493475316250357,-2.366532948433689,-1.578286681111966,-0.45605072500283517,-1.1476628396934723,-1.6208940987903009,-0.8146251315979213,-1.192766486223434,-2.1344485435868634,-1.6684556821322665,-0.09924754246511226,-1.9940785071039582,-1.255594257067219,-1.0180363774610222,-1.515413593196794,-1.300665869924043,-1.2675729367120379,-1.1901609381315998,-1.034838784550022,-0.6984553197419465,-0.9141852748484455,-1.401024995284545,-0.6229177849406711,-1.152165962920104,0.1017904478395827,-1.835021338424074,-1.6772386201241165,-1.0754126835639926,-1.894979899993342,-0.6398482693807312,-1.1938651603212405,-2.2106444694167364,-0.016951713001657914,-0.39882875009952123,-1.0797562964555034,0.2109138781738172,-1.5277874464489136,-1.6323692399177432,-1.1901815192301177,0.2400075752362989,0.6002359834028592,-0.8593899574345492,0.017729371260670312,0.08186938777200137,0.8674361474928598,-0.6466421407805867,-0.041952199695981296,-0.9347842371181877,-1.394819702516972,-1.7677987374959545,-0.5289154100038378,-2.017186547899934,-0.7301399856137308,-0.9157647912399031,-1.4874068594302705,-0.8595749318254965,-1.6896633139514126,-1.0961684938222298,-0.6485167813065328,-1.006370396376434,-0.6976124729346713,-0.21473053584367482,-0.8860411202865247,-1.0571727785207046,-1.3092472571018687,-1.8430572484696177,-1.4268026794452737,-1.2185399075326746,-0.7957854839804293,-2.295089903730678,-1.2900810200609312,-1.5182190775296018,-1.1264097315090689,-1.124900793068398,-2.7525386888559096,-2.268167306580666,-1.3028771682975728,-1.4325122868616105,-0.5225614455190543,-0.7389560701621809,-2.3766696328424644,-2.211014224200024,-1.5281224922370953,-1.5605996444297066,-2.766424634188515,-0.7271613918810146,0.09323895069078951,-0.5686294355014969,-1.7157049141119771,-2.4015957125447827,-1.4143315646610999,-0.1408043132044726,-1.9546318868178978,-0.8923332239996032,-1.5454236387251383,-0.7576084862069492,-1.1455052923172835,-0.7820349545327585,-2.9724074715357056,-1.1849629458446842,-1.558950329807309,-0.6220017907036886,-1.3877317657391854,-0.08587999763598644,-1.4323595864007845,0.3924965025944466,-0.08971237478900372,-1.5698045685197217,-0.1806139911980953,-0.422648021053218,0.23765993125561366,-2.328964694634743,-0.4168147702880733,-0.4237094241531646,-1.9936898113929526,-0.614750588370625,-0.409101588374297,-0.30920527723424945,-0.7723775776856209,-1.8431204954744902,-0.9859787042451055,-2.0526037868000744,-1.8205632163884495,-0.6776864092624587,-0.6822033831238571,-1.0499896856070812,-0.9558950747477973,-1.3457929719508221,-1.5161588101266559,-2.5468908278708926,-1.7598758963403907,-1.2386118660720993,-2.4044450348310304,-1.9313155227512788,-0.7252387030140621,-1.2913865655942893,-0.7279804331274321,-2.1717244421085002,-2.237445563026571,-1.9749535501656221,-1.5467346719266433,-1.6939802313599897,-0.6219823253048131,-2.41767361377445,-1.7926450730074466,-2.5009384384227102,-2.5493158069415416,-1.9821582268315312,-1.2858101459761548,-0.70901262994508,-1.907785915664312,-0.20928686351456002,-1.211078099435726,-1.712878635314769,-2.500837139376878,-1.627233338400371,-1.5673331215145316,-0.8592862700648618,-1.4325280986234288,-1.997753251843242,-2.4776134086062758,-2.031311458904419,-1.4775874628605035,-2.748828107641985,-2.675616220356237,-2.0405494736917418,-0.7633437363107427,0.06351940872770635,-0.7273990565905876,-0.7711775938913162,-0.9155215837398085,-1.6129050386883923,-0.6461953418994207,-1.6397567602000551,-0.9011547740163082,-3.8797739065261103,-1.5752875445605155,-2.753828793206077,-2.180950214681415,-2.8173450204011363,-3.068466117523583,-2.4295628658408073,-3.18543398805227,-3.553917947347606,-2.309878228302283,-2.1202853612965593,-2.712408636083378,-1.9581630973379764,-2.736868494965137,-2.737435620834221,-1.8012818008892328,-3.048090698395554,-3.1458285342211547,-3.573036299132017,-1.9415968261453507,-1.8905384379330628,-2.130625802136778,-2.446721830851246,-2.2087788884721866,-2.061383414058815,-3.009358358708397,-2.601516507324338,-2.588540411811644,-2.9693189703724805,-1.2583119394745341,-2.95444734132473,-2.2801322301558558,-1.928803587864042,-2.6145799554272537,-1.9982153947939356,-2.665844505171535,-2.9860351045286397,-1.8507325078811032,-2.0681194122301294,-2.3550119757275847,-1.0168079398092529,-1.779516733449502,-1.6789837933910643,-2.214264975208221,-1.515946474981294,-2.4923788060647984,-1.4064489883602658,-1.5747308498593813,-1.7521864870275603,-2.1305417760026826,-2.7323370567214966,-2.1780357516350026,-1.3917610579265511,-2.395163485337495,-1.9960357767604446,-2.127288323894143,-3.2578502208780336,-3.142199986005645,-2.9667978117379823,-3.5174086852485447,-3.106827213846729,-3.9239834057684857,-2.113443421313809,-3.3429751658138898,-3.121042777881392,-3.3977637038609676,-3.8584431629656346,-3.951490943921085,-2.5155707372832845,-2.074542756071213,-2.8443990249363016,-3.861104691331988,-1.6762463738807376,-2.7387024749254483,-2.4932331752954005,-2.8424510651874098,-2.0837909263017633,-1.9549095315704388,-2.3632220961018406,-2.766326226154104,-2.363000769316709,-2.1840382200799024,-2.835683414029018,-2.2470116824206663,-2.735784091679052,-2.342912496278121,-2.8103173791025955,-2.1401257640565485,-2.7106828525680426,-1.4273062364124969,-1.658421468468966,-4.016312315227326,-2.454225240848763,-3.7516928359229444,-3.0634908881964544,-3.0959905587948575,-2.784142462641615,-2.467011133152241,-1.8496898960778372,-3.5996990699609794,-2.212744217172221,-3.8947753096309783,-2.992006315087713,-1.9187010130374997,-1.6522494011721052,-3.373319321126636,-3.609796180184302,-2.932260112479301,-2.9118018558135774,-3.8064353320176894,-1.7308814101848957,-1.3610423204496538,-2.9361844585669092,-1.551238323905625,-4.7544877680653554,-3.0551206455269564,-3.6693169975615954,-2.4626096819085266,-2.095931561877024,-2.1872286151997233,-2.6558552766531136,-1.934775689355989,-1.9202175781586341,-4.393407243208357,-2.671490191693422,-1.4662021220012469,-1.820385477083997,-1.4089071723642892,0.9696015558643146,0.96123005008301,-0.5627349264639642,0.7653052798564576,-0.7000444152702021,-0.5864235146116304,0.3633465007105286,-0.9775403184483936,-0.10075833081270548,0.1692680264669683,0.08435660898293523,0.2412525293152743,0.5342233820069515,0.0668647499673341,0.20900239006412508,-0.1950094138738836,0.604782821490861,0.7567204939090876,-0.4004354760178614,-0.5807441165542884,0.7348709988071691,0.2993020214340551,-0.7125201740742859,0.5683968069720552,0.2953734477919968,0.5315289007358481,0.29627017582447895,0.5923052208300974,0.47627717847595735,-0.6806831052797442,-1.0087646266283394,0.7712477439509854,0.6186945464899787,0.3705697221495672,0.943520172558374,-1.0547138722532081,-0.7308827878135941,-0.9047682073384099,-0.1962333811767258,-0.17973591167169753,-0.21776824925595129,-0.5170073031717162,0.4561778402975252,-0.840179929266894,-0.13680226987954805,-1.2300826054848502,-0.1928885520999137,-0.17498754367391472,-0.35760724302899827,-0.16336612633820324,0.9607155129995947,0.4557630857958196,0.20245144560567385,-0.5120070268600759,0.09631791125508517,-0.16695902443354915,0.19777012662034055,0.4007967816021165,0.25288230343231266,1.8131716539349292,0.10806985569752656,-0.7891933602064248,-0.15160819696824493,0.23830450115455915,-0.0903273977929655,0.7494809274518208,0.9483006773494393,-0.21100228796824316,-0.46917656210187486,-0.7530679175813639,-0.5539611824838291,0.23972933752458658,0.03507156362684409,0.036120287075047997,-0.7577795110456976,-0.7085181158887385,0.8636019088346162,0.9246371260741075,0.3128533878070369,0.30370159540787456,0.6816644348520086,0.9571454087163535,0.9075092693674868,-0.1076280208320779,0.9721756338440597,0.8442987175715133,0.35954096747581527,0.4487621525605823,0.8539108617221164,0.9627931510525567,1.334448070249324,1.5406644439462909,0.4748473546366462,0.5797083430783578,0.14001779132899728,0.45707055310986583,1.2394720938474122,1.751791101537557,0.47324101213006814,1.0526942161494315,0.42537450202905075,1.888943316717374,1.437685741597163,0.15738958291054728,1.5678771284703583,1.9238537668298574,0.8442742782088922,0.9409999085565403,0.3382198362443499,1.1279542250640116,0.9711817064926366,1.2066705128956616,2.447537262529408,2.0934157807856812,0.7823836509851824,2.252946736192016,0.7182900999464693,1.450868852529902,1.4320692456325192,1.5832119577109556,0.3871899744398304,-0.729323657509493,-0.2536378385176574,-0.10896371386464354,0.9872936791289955,0.29564837507976405,-0.8885294592003747,-0.15559916987554745,0.7158920808448406,-0.2637511835891939,-0.22902436676551244,1.1113585504473769,1.532073304100771,0.479815712213994,0.9294327689885433,0.020449603068997704,1.7800147608482424,0.8916786949913119,1.2648869443126527,0.4825035513407496,0.6533789306113313,0.4380106197228983,0.40288494335436437,0.8090178662760801,0.12509406227204464,1.4303012096902044,2.6194373843641183,0.8086559234319984,1.6425315720094977,1.0971040395799578,1.8441950766592472,0.1982715549532538,0.5302051654297395,0.26470296822081946,0.9025341071129023,1.295265698220906,2.6327740891599887,1.7633363948800829,1.5754688034673834,1.4728137259418188,0.3191721089332752,1.2742955316657087,1.9105086780727591,2.9842995965028205,1.1494939647511986,2.7664511192961454,0.7882387109726089,1.0970471871109795,1.5222072675983094,1.941210963967649,1.064616883353286,2.1412646514344202,1.21170892609332,1.5836950629230795,2.261308357177902,0.09744701965746723,0.3993607011475427,-0.1191662782718576,1.7873030735846023,1.5899577665348343,1.9166907152090966,2.0721186490830465,1.230426737421067,0.9553621585261194,0.3711420621079644,0.724241954486925,1.0304348052565813,0.5436177779156667,1.2060986314333055,0.3239845154582257,0.4630367420895171,1.533035071831807,1.1121300872122115,1.8052787544679567,-1.0342046040505322,1.5561871565803305,1.6644592886402976,1.9925155296569022,0.8703908667206581,0.06916959369365104,1.0539821396770104,1.0463018760367566,0.9944235836133521,2.448437127334245,2.1065647102013574,0.8011419862324366,2.784714719850227,0.9367753790999132,0.8154112477037595,1.8554784966422135,2.902041833521698,3.001911697244531,2.1768040195663683,1.2497424411990867,1.0883820326847424,2.0734172428509177,0.8305504885995441,2.503333335498684,2.3317022133804417,2.780218784700653,1.7527077856402264,2.5567956486472396,1.4914619847922808,0.7183371740699849,1.5308552664178727,1.5874471773582821,2.841966255158036,2.384033229552642,0.9817486758392745,1.7926600392805208,1.967759304893191,0.7091427284657781,0.6475300422668556,2.1249466916524855,1.702108291821785,1.689057407041103,2.2377044171442355,2.0974536277730724,0.709336158392627,1.3686203613520584,0.45050315491760545,2.3323246252879537,2.3185144880731117,0.7018680352214562,1.4837392399971352,2.0534790398546408,1.1404919960332265,0.9484525446939961,1.571535442007378,0.3856857948856503,1.6398715879508245,1.8889397668287697,0.3481642793901404,1.1718229548423043,0.23264948978885278,0.8700991936727333,1.715545144801989,2.8218431582751817,2.384430476097321,2.637052216092549,1.5565949946866906,3.260709855654663,2.215490456291601,2.1732748329353453,2.133063566707878,1.9376914919759933,3.074039222123241,2.025817067333323,2.3818247683198055,2.571438383635103,2.558989831673487,2.2343257438668065,2.9572358367555163,1.1631706481636692,2.7715398835111817,2.4726650547666313,2.8208875577434167,1.314173889969014,1.1458453237465471,2.876955489612932,3.028190509618199,2.561061435402865,3.3182389115930895,3.1538853415481776,2.382397417307053,1.4199208833925612,1.5578137389520013,1.6547752752142026,2.865131210418348,3.188953187768267,3.326319856546249,2.468665413962193,2.3302927534999207,2.203309974129568,1.8683458867497746,3.3243443356110376,2.4264459761578734,2.6122769624004305,3.736938726469867,2.131922018452381,2.131436471980936,1.9693064994955463,1.7695760423946982,2.2393956111853925,3.176884402496682,2.318801847347479,2.9391206130773355,2.2610986980149725,2.458490803242537,1.6839323544387612,2.4453983676383393,1.8814602337500579,2.070169126162836,2.9218688289022863,3.156597457664576,2.867641066969117,3.4606794680418735,1.6262414966067396,2.3684609178266083,2.740406722727401,1.7194935382265608,2.5149059590022644,2.1416628756098537,3.469772389672248,1.2073887302099438,0.5460212218637982,0.2435817318294638,0.9502460241591938,1.3231639623773395,1.8766440653876606,3.3973191667129456,2.6660901634281218,3.781321607511157,2.509087144683014,2.8952686732114734,1.4206922441293464,1.4112335105676952,3.3556864970229965,2.0043190328412184,3.2308764920348834,2.781109488143981,3.1266903108619313,2.346232469312663,2.7780817036073184,2.0052784784211397,3.1641476952581087,2.2352059819511987,4.168831222601981,3.4323585705801714,2.796684394301589,2.8324822270847685,2.7214929386817626,1.6939180572001982,2.5764362755699017,1.7875632068916907,3.35441746109159,3.73656659192286,2.838807259877958,1.7594612979768844,3.539828169473882,3.412337432723765,2.8472924225035237,3.489893216384098,2.1626206839520306,2.972333898708698,2.014876835625985,2.431761313717642,3.5897006665864963,2.1655314705629545,3.4936456367004767,1.8403924015470645,2.2108438194087094,1.819421279483266,3.5072059502754014,2.880621942907764,1.34065244723923,2.3653011349733717,3.5828288398516888,3.231285619056229,2.3225330473318477,3.4499681974693064,2.7792928124193814,2.770368668135591,3.1371555520572416,-0.641706008848668,0.7370757608853467,-0.3747885197021391,-1.4309395640080955,-0.7958391741945147,-1.7745623013884388,-0.21953060830467716,-0.8699100255558477,-0.11558190028563137,-0.6612965829414078,-0.7355927292114449,0.8961944166754179,0.09555432813192392,0.2518243514236201,0.13768930405718713,0.18526737060804593,-0.6593938322190093,0.6489928105321299,-0.5774790462470066,0.47147426171145923,0.703501124081879,0.6219267600234596,-0.6353872623767381,0.340871422905194,0.690837860513317,0.5547186232519316,0.481926665823561,-0.47412309541948017,0.7483538052050113,0.5466007600143877,-0.020044772506635448,0.6195717645695985,-0.18458279996721044,-0.3592357138158157,-0.782679136742539,-0.7487921639035217,0.7743798433694885,-0.7970872786471302,0.6466736507549041,0.42991301787608505,-0.2037201612209914,-0.8953305963121182,1.2317266957525255,-0.8675795504871041,-0.5975075575562931,0.909887307251493,-0.5433734919432837,-0.547653079850891,0.9696281717876976,0.5756791098247269,0.3802028630385266,0.4182876366492722,-0.9294169138341941,0.03879896458092626,1.0349279411278869,0.6792280862050885,0.9791852520049481,0.06531102416840599,-0.7152425576742906,-0.26402660814048395,-0.17665768416261993,-0.8332824930570079,0.6586040724444693,-0.8294358616725654];
  
  this.h1[15].weights = [-0.2847553301762371,0.30996822729992557,-0.1448184090303961,-0.45113812703174405,0.5436389284529413,0.6309541045619329,-0.7273437458188208,-0.9152817791434966,-1.2345217826497008,-1.9789350608412548,-2.0712184478794478,-2.244297616541822,-1.940389095859743,-1.0341875683967499,-1.882651929312841,-1.7225999431493542,-1.792550796502101,-1.7415144409887344,-1.3223137799972067,-1.586233326134826,-1.9575982059799513,-1.850880900662628,-1.715922980504926,-1.1372947129341313,-0.6495183166893529,-1.0681098569248697,-1.48641444934957,-1.7355868481595929,-1.6522650964496552,-1.0910079295723243,-1.4101923761228907,-0.10707018247357782,-1.3972080980724093,-1.172618484788502,-1.326214700604703,-1.324478998528955,-0.5863005902605416,-0.7892272967449732,-0.8858067838654022,-0.788645920635354,-0.26285831704658225,-0.2616673698497744,-1.4137838701917254,-1.2293430370249396,-0.8681789677439021,-0.8112467193674305,-1.9170463692393858,-0.7098652397638159,-0.6168481898000454,-1.60666021850954,-0.9955179294355645,-1.0983027545254207,-0.7160940211360035,-1.4458278770404507,-1.2259442651798962,-2.2340471018310097,0.6442888114581784,0.9896679016822163,-0.45684518541587504,0.9548576484228839,0.34955479484312324,-0.07633468440165059,0.9847007138245862,0.7341748082879249,-1.3804630519018954,-1.5941293374049743,-2.6676032342808393,-2.0911465736306316,-2.455261349574863,-2.1591674322998213,-0.12455370587503996,-2.1468416521393063,-1.542702322548843,-1.8311811213179265,-1.2273786285481725,-2.4332347161229304,-1.0301645878635266,-3.314534239389928,-0.9412358621003384,-0.8204079980188923,-2.853127580518188,-1.7228147555588127,-2.2897953276117557,-3.0872162039343753,-2.1301120584948805,-1.9546945377377214,-2.972996221241836,-2.654108903263738,-1.5167589664244194,-1.6708268560611084,-2.3804831713911323,-3.1001911127280373,-2.017982049013107,-2.4955201720359206,-2.3385956023267065,-1.1188286275488661,-1.166271458261425,-1.9410734722137657,-2.3415179775940334,-2.103686950718921,-3.6324715760361697,-2.357469098372552,-2.3699841210452766,-1.4411458133585546,-2.0377668634183563,-2.803796221663312,-2.32423637599474,-1.7016220053460909,-2.1397127949009556,-2.428925077811054,-2.90363363926288,-1.2396905375483258,-0.6504254207700407,-2.0574078482343845,-1.6028376464737695,-3.0243318993205364,-2.2165320967258206,-1.7030258019517985,-1.195118077783685,-2.580011258108235,-0.8881588783198262,-1.2684910377841987,-1.41652675212889,-2.432111169571361,-2.4061100568968583,-1.3192503794563037,-1.1673328822349722,-0.531870811780851,-1.7779653197503618,-2.049277825967134,-0.8710018137004706,-2.1111617214892027,-2.041651345365864,-1.7057622492686326,-2.4831346505539083,-3.1930837584733327,-1.410378132622328,-1.962717926383238,-1.9666661524591607,-1.506818488384451,-2.0725469251372024,-2.297612562630231,-3.1256611123638343,-2.5228463575790165,-2.2751530313431965,-2.8537158821295856,-2.4097142855635343,-1.5731838351169243,-2.52694838834594,-2.00453607677736,-3.066931665497036,-2.7505504461198544,-1.4625569888808123,-2.7960281906121596,-2.7942206744512736,-3.0356400687898084,-2.3711641158128822,-2.5596609561361476,-2.495617968789385,-1.5660927993672367,-2.03862597308215,-1.4105147845967292,-2.835769426235882,-3.400422286941623,-1.5512448846479647,-3.0448271508907445,-1.1435492358764414,-3.1465863412814303,-2.2408209780621036,-2.5503231545707363,-3.6130265896687974,-2.2452340060709037,-3.371457037689278,-2.5050598774396104,-2.2937880632572853,-1.5965840338880255,-3.101882221477582,-3.3160364911935694,-1.2447179532066155,-2.4725151931247735,-2.6792448906503186,-1.7759370786382198,-3.1225811707301316,-1.4750389278738807,-1.6880538505625031,-2.532495562291267,-1.9639682899198705,-1.3149421160871533,-1.9271714002378313,-2.752889581055628,-1.76841517763818,-1.6348244806443122,-3.146530560970084,-3.194045311129809,-4.350792999088772,-4.51187272994987,-3.649005806014507,-2.9145922223304677,-3.4817643569553907,-3.070743355390939,-2.9455959460252807,-3.653150849088193,-4.281926478924854,-4.38863815368456,-4.180528599262973,-3.3818836726944754,-3.596552055800114,-4.064565305839045,-3.9158518083697156,-3.281604683499279,-4.5190841725417705,-3.1033106645214596,-2.9567989134158847,-3.813527120170688,-4.457604252433422,-3.702177075498252,-3.1905087254162536,-3.833790233931842,-4.4996614650623314,-3.5095408873203344,-3.758493237055042,-4.035025359115781,-3.795256814413615,-3.308100837257386,-2.6127153144504516,-3.759843568900656,-2.4978763433428313,-3.8464708919964017,-4.371639943513333,-3.839564712496584,-4.489295611692847,-3.0382278402471843,-2.3074490204113425,-2.6580139511356315,-3.465717258353875,-2.722794626345442,-4.1843506872953835,-3.364562117668432,-3.6461647063944023,-3.216766260217969,-2.7422051129236125,-3.1129657246313704,-3.858437830651952,-3.4772609425002297,-3.446779108443004,-3.7747968223635247,-3.1357554159934997,-2.9519042765249526,-3.639101109420251,-3.8453538057484136,-3.0878229663268297,-4.688443641826301,-4.1608462178901195,-4.404505237132391,-2.4878161435255577,-2.9664100377421856,-5.6700801776487415,-4.278324371927624,-4.91550377395702,-4.889360563465348,-5.249843889629063,-4.203333302651718,-5.020411600471326,-5.789365763701268,-3.9127566222049954,-4.1357378828265325,-5.068555185010012,-5.0110945655890715,-4.905632090909397,-5.233411747387933,-3.9341148254849028,-4.731635493383852,-4.66787455468694,-3.7483147084262307,-4.716009488588783,-5.497665637436761,-4.357161693363666,-4.830454567937598,-4.206215670139957,-4.544696863578124,-5.061318373817623,-5.057325731896359,-4.529498625790085,-4.776100336677698,-5.005532080496482,-4.691591721073107,-5.772365473221245,-4.582059427779525,-5.128869950340649,-3.8440646492771666,-4.682059226921876,-5.844987615110648,-5.090181928693746,-5.372748470562464,-5.385833557045278,-3.1771514194181982,-4.290941483208025,-5.662309811485471,-3.487202617143233,-4.4053942911398165,-5.734048681092141,-4.102612807686802,-4.643215905194342,-3.9184441384322555,-4.958118730971465,-4.358629852971204,-6.072903705629762,-4.442133870838155,-4.886206260539124,-4.8770871024862945,-3.784900383330104,-3.5286909802755675,-3.249201100906023,-3.6131581373959984,-4.069742725847533,-4.959511982678138,-4.332192938653165,-3.9879573736977254,-2.5818576786965752,-2.061984882657279,-0.828788626479033,-0.09812369596995169,-0.6434235444798458,-0.4124409399571748,0.9104875932661174,-0.21599718987623162,-0.4237383875717644,0.621913198498903,0.4989956592904142,0.14029728930841356,0.4714566627441597,0.29275061419864307,-0.7512393547302634,-0.43425339589744055,0.318544332037697,0.5153479067877038,-0.11860867740894376,-0.8040293350651279,-0.43599721284279225,-0.866511003531488,-0.6661575529472948,-0.5749629035724834,0.163226141068813,-0.8978280496269296,0.8260359644926528,-0.8669084006906373,-0.7927869270478647,-0.3885600772614171,0.48303730044026294,-0.852572009962329,0.051316341307262106,-0.2282258236218066,-0.361706598869636,0.4643645935705341,-0.048780846429166254,0.5639393580806035,-0.21504310680083044,-0.6263404522234111,-0.07202979856483724,0.4165906911196787,-0.019180544073449792,0.19691373605822424,-0.5306929389407764,-0.13988811740109836,0.7979764595171579,0.10057817742538541,-0.9008612509601727,-0.6313794187562376,-0.7222531188120863,-0.6542080355893188,-0.04067309028283236,0.03500106935395149,-0.8602762321097628,0.526044863142127,0.3150583931566234,-0.7287174518902466,0.5406176933822341,-0.3391436973162184,-0.7508008518993378,0.31627739214350814,0.2670895589487158,-0.04299071724739111,-1.1250072776517146,-0.22352870422091436,-0.3918008241848927,-0.03027070051424996,-0.9288222259886525,0.6977917369705899,-0.8853376220202094,0.41604575769787067,0.8277037908549403,0.656047716081035,0.6805861112204603,0.5628158053813855,0.6723770801027555,0.5440593668351481,0.9499870756670854,-0.12098735940709864,1.0116015669112768,0.21901120499813162,0.7795229847601453,0.012934049232802823,1.0460333875356278,0.5324700487798723,0.20827802932937411,0.5331538835853191,0.9989178189678611,0.2962196286439084,1.2081269102665502,0.6730912589510102,1.1248426644852185,-0.21980945056063156,0.284286177688505,0.7718038563628176,0.9047901991234852,0.6923625439159756,1.8324268124882772,0.638994557319194,0.5086532366843017,1.4566997871930252,0.19317188344067165,1.0363333145406766,0.39204430007747876,0.8421815408514863,0.9165830581019415,1.332735694601116,1.1156070086635494,1.5002062186846898,1.2655550076336772,0.7091775923422995,1.623708921171907,1.6951818330732915,2.0787350800617226,1.3353779853892367,2.265441286795087,2.3918866805634083,1.0941234377467746,1.622099311283663,1.7774148503755465,2.0717308134641685,0.23972359963482415,-0.6748128227675263,0.4090824159082316,0.4623945121879167,0.2880326916243878,0.7515480516132298,0.2509333835416663,-0.8027388219931209,0.9842165374213329,1.5071652503271789,2.1957128203691263,2.311229903504421,2.1520660761741786,2.2036145968652705,2.7638917859631427,0.8516180596186329,2.1055177842609414,1.4113596494542158,1.3802615700218117,1.151411938766092,3.0934777431408444,2.2718581774107194,1.902754771475873,1.3378259533054868,2.215314055235084,2.6257616779445923,2.640626932132024,2.4119725413388804,1.9601490977515559,2.1625995977977053,2.0911471563024038,1.2692139933873228,2.1768984398801097,2.0294097782864715,2.674383720502894,2.29590932705866,3.2107219028547944,2.99752076084646,2.4597455088275963,0.817746712137131,2.4201277312187006,2.617360014639672,2.281268435259343,3.105713795517806,3.1767705513382936,2.5596858550296515,1.0931521874925274,1.8363480738941544,1.6069316949257613,1.7034272683290965,2.6491448767973127,2.7817292776506033,1.9012809759704055,2.2392410386856625,3.1350311992234685,2.21469798178457,1.603980927726287,2.2877493469420997,2.49149346967721,2.3113254418112157,2.587609741056445,2.3460160744118816,2.41901014592434,1.5822615553876271,1.1159137834137627,1.3544247824253637,2.5595903120977717,2.418300168401276,2.2109988054068745,2.0091412765812064,1.0753556810047211,1.76319142494472,0.9234458942935136,1.8852341083058182,1.7327994098515411,3.1371025022294368,2.0380920315145037,2.224731102342261,1.8556097296147076,1.2303066422737055,1.4888871856685078,2.042894904255371,1.4797599385440812,3.1906485174678667,3.323139399604923,2.587531353626487,2.7717354427381844,1.093709536767839,2.4588278226236415,2.157552656011634,2.3230914485364837,3.2631903768891646,2.625849776259465,2.9568613668175088,1.6762836372156893,2.7475534316167365,0.8424418603527917,1.6571668360699048,3.146966695224436,2.971301549492628,3.1407767198515524,2.675522809573313,2.6725207683167853,2.5108104981621273,2.9756421857069997,1.8781960391355175,2.478220388339975,2.6025399585258735,2.351889577382816,1.9129987267755544,1.5862915983314554,2.1469746096837934,3.193391919392233,2.3810534371770395,2.8969327687087305,1.5834329038470862,3.482583305051803,2.5592250194288972,3.0612874735173863,1.6949288839217618,1.9539265673020132,2.505364849281429,1.8465949812941984,2.4063180063838088,2.9647829144175875,2.5648588506577865,2.2261227649763837,1.4535315918972336,2.4428244918444517,1.4948478206852118,1.377834929506611,2.203102822182565,2.8915943676428206,1.5589471549940996,2.224076432426854,1.20363433940697,2.866687339679829,3.9792214782287707,3.094635304270779,4.5203110379773355,3.185212562928423,2.883775962002661,3.441356594758322,2.2692843425729974,3.8373700568450198,4.27620810463729,3.0459265783719776,3.850933492842355,3.742824853969878,3.881970541369428,4.007382138705167,2.2270373374136927,4.032766088325181,3.929154332799081,3.6871639083112413,2.6967010257913806,2.4515892461232203,3.099744349074007,2.997605797416802,2.5778731509111803,4.210716044465986,3.0044577613280223,3.2334996168449326,3.1104139511181494,4.4666611810774235,3.5971514433569753,2.9536667375979633,3.3664934592090052,2.729197824528771,2.5469952625731413,3.8655141681893834,3.1030820504386027,3.3897808515022794,3.843982545867781,4.105873497617189,3.0897276520317156,3.3978817923094056,3.685736487951683,2.8782663473308365,4.202690861427853,3.6567873518465768,3.378191594594184,3.210783373094102,4.216831559686886,3.767447853863042,3.8401813387445767,4.58171609090138,3.255843348143857,2.815619648088341,3.0277304080988743,2.678591857717439,2.650986843270688,2.896805041147298,4.505992055405266,4.237836608755142,2.8601060166435563,3.6014298767097666,3.8094066533872617,3.6661283025424147,3.3483813488557925,4.994686856963197,2.9835622437185245,4.009849094245939,4.659168072464543,3.73777480271909,3.2931487069954377,3.5480528549384998,2.463220086194747,2.5917789180656743,5.60987178375525,4.04797153127992,5.5454591971948535,4.481101763661386,4.982109934641607,5.2306135422329865,3.694557814402516,3.6750928114166133,5.53835974457508,3.64413421498575,5.7664913062552055,4.638854304434074,4.439395405619836,4.045398718888759,4.084149883155067,3.5487638647454944,4.504123553121137,4.894083749476119,4.947442588526365,5.615172263162053,4.380527128063174,3.74906474145317,4.888619415921334,3.797290201638706,3.819972093733742,5.172178416936224,5.140180593457088,5.044298220942437,5.530349637293812,4.436282419610774,5.712338638993723,3.6614373959056334,3.64697600597877,6.020841636251887,4.172440881705768,4.454353454487756,4.619071703058773,4.257728447742967,5.542019063931587,4.736582315031809,4.410141405342671,3.9565686282166364,4.92248802157262,5.298197409029888,5.248539021179484,4.830348283133735,4.384596121112286,4.953450418486064,4.428270648990088,5.3293721713085995,4.679180568782718,5.67396275210229,3.5720217187668206,4.784851468989874,5.901466704180712,-1.040623291462024,0.29493123150764794,-0.007246036898236146,0.12896418420702038,-0.8479587755253383,-1.5212734842613476,0.0611732448467855,0.3044654455401617,-0.4267820413403623,-0.41046687349558675,-0.7360704385673477,0.2113181697388008,-0.1588895959421789,0.23473491609188768,-0.8090254493165475,-0.0261142432057395,-0.7866909939019657,-0.76065809532043,-1.1721404385073457,0.9413008966663841,0.941080343689328,-0.8995783515470743,-0.2790122332639816,-0.6755048085317997,0.6452365023181119,-0.921423372874454,-0.21169947898741423,0.1490296678253522,0.1832803624089235,-0.4043840299915678,-0.7197961281889659,0.0961383518052283,0.1249261486926047,-0.4466677879624552,-0.9014538021049201,0.15726460250476604,0.3445726072686422,-1.2260734530162556,-0.7666080027679845,0.5920562520404029,0.7355361947181418,-0.9560607371298503,-0.4366355340223392,-0.4136151315226361,-0.6094982513943061,0.6863865384161466,-0.5203225729374411,-0.8859072001034365,0.8162992143864654,-0.9108414129560806,-0.356462255511964,-0.14738369604320048,-0.344682644313675,0.744850606669084,0.4933083112701371,0.29125338223004477,-0.6899909590133244,0.54311641011892,-0.16692835348531287,0.3214033817571828,0.6690502272341334,0.5353769625703704,-0.6870754765500836,-0.6835890642912923];
  
  this.o1.weights = [-0.13983140257465299,0.13275056665834462,-0.580936466606463,-0.08624768271691244,0.0061561299455998005,-0.07908004721015181,-0.5705306262801085,0.05772093439138311,-0.05725200657663812,-0.01852590222797127,-0.36239791629918405,0.051297342368267815,0.21639955571646588,0.8938003862007262,-0.0846078200921216,-0.3752706341239544];
  
  
  //}}}

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

  for (var i=0; i < TTSIZE; i++)
    this.ttType[i] = TT_EMPTY;

  for (var i=0; i < PTTSIZE; i++)
    this.pttFlags[i] = TT_EMPTY;

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
  
  /*
  console.log('WHITE LIST ' + v.length);
  for (var i=0; i<this.wCount; i++) {
    console.log(this.b[this.wList[i]]);
  }
  */
  
  if (this.b[this.wList[0]] != W_KING)
    console.log('WHITE INDEX ERR');
  
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
  
  /*
  console.log('BLACK LIST ' + v.length);
  for (var i=0; i<this.bCount; i++) {
    console.log(this.b[this.bList[i]]);
  }
  */
  
  if (this.b[this.bList[0]] != B_KING)
    console.log('BLACK INDEX ERR');
  
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
//{{{  .makeMove

lozBoard.prototype.makeMove = function (node,move) {

  this.lozza.stats.nodes++;

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
  
    this.netwMove(frPiece,fr,to);
  }
  
  else {
  
    this.bList[node.frZ] = to;
  
    this.runningEvalS += BS_PST[frPiece][fr];
    this.runningEvalS -= BS_PST[frPiece][to];
    this.runningEvalE += BE_PST[frPiece][fr];
    this.runningEvalE -= BE_PST[frPiece][to];
  
    this.netbMove(frPiece,fr,to);
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
//{{{  .evaluate

var MOB_NIS = IS_NBRQKE;
var MOB_BIS = IS_NBRQKE;
var MOB_RIS = IS_RQKE;
var MOB_QIS = IS_QKE;

var ATT_L = 7;

lozBoard.prototype.evaluate = function (turn) {

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
  
  if ((flags & PTT_EXACT) && this.pttLo[idx] == this.ploHash && this.pttHi[idx] == this.phiHash) {
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
              pawnsS += PAWN_PASSED_OFFSET_S + PAWN_PASSED_MULT_S * PAWN_PASSED[rank] | 0;
              pawnsE += PAWN_PASSED_OFFSET_E + PAWN_PASSED_MULT_E * PAWN_PASSED[rank] | 0;
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
              pawnsS -= PAWN_PASSED_OFFSET_S + PAWN_PASSED_MULT_S * PAWN_PASSED[9-rank] | 0;
              pawnsE -= PAWN_PASSED_OFFSET_E + PAWN_PASSED_MULT_E * PAWN_PASSED[9-rank] | 0;
            }
          }
        }
      }
    
      count++;
      next++
    }
    
    //}}}
    
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
  
          //{{{  king dist
          
          var passKings = PAWN_PASS_KING1 * DIST[bKingSq][sq2] - PAWN_PASS_KING2 * DIST[wKingSq][sq2];
          
          //}}}
          //{{{  attacked?
          
          var passFree = 0;
          
          if (!b[sq2])
            passFree = PAWN_PASS_FREE * (!this.isAttacked(sq2,BLACK)|0);
          
          //}}}
          //{{{  unstoppable
          
          var passUnstop    = 0;
          var oppoOnlyPawns = bNumPawns + 1 == this.bCount;
          
          if (oppoOnlyPawns) {
          
            var promSq = W_PROMOTE_SQ[file];
          
            if (DIST[wKingSq][sq] <= 1 && DIST[wKingSq][promSq] <= 1)
              passUnstop = PAWN_PASS_UNSTOP;
          
            else if (DIST[sq][promSq] < DIST[bKingSq][promSq] + ((turn==WHITE)|0) - 1) {  // oppo cannot get there
          
              var blocked = 0;
              while(!b[sq2])
                sq2 -= 12;
              if (b[sq2] == EDGE)
                passUnstop = PAWN_PASS_UNSTOP;
            }
          }
          
          //}}}
  
          pawnsS += PAWN_OFFSET_S + (PAWN_MULT_S                                    ) * PAWN_PASSED[rank] | 0;
          pawnsE += PAWN_OFFSET_E + (PAWN_MULT_E + passKings + passFree + passUnstop) * PAWN_PASSED[rank] | 0;
  
          //console.log('W PASS',COORDS[sq],'Kdist,free,unstop=',passKings,passFree,passUnstop);
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
          //{{{  king dist
          
          var passKings = PAWN_PASS_KING1 * DIST[wKingSq][sq2] - PAWN_PASS_KING2 * DIST[bKingSq][sq2];
          
          //}}}
          //{{{  attacked?
          
          var passFree = 0;
          
          if (!b[sq2])
            passFree = PAWN_PASS_FREE * (!this.isAttacked(sq2,WHITE)|0);
          
          //}}}
          //{{{  unstoppable
          
          var passUnstop    = 0;
          var oppoOnlyPawns = wNumPawns + 1 == this.wCount;
          
          if (oppoOnlyPawns) {
          
            var promSq = B_PROMOTE_SQ[file];
          
            if (DIST[bKingSq][sq] <= 1 && DIST[bKingSq][promSq] <= 1)
              passUnstop = PAWN_PASS_UNSTOP;
          
            else if (DIST[sq][promSq] < DIST[wKingSq][promSq] + ((turn==BLACK)|0) - 1) {  // oppo cannot get there
          
              var blocked = 0;
              while(!b[sq2])
                sq2 += 12;
              if (b[sq2] == EDGE)
                passUnstop = PAWN_PASS_UNSTOP;
            }
          }
          
          //}}}
  
          pawnsS -= PAWN_OFFSET_S + (PAWN_MULT_S                                    ) * PAWN_PASSED[9-rank] | 0;
          pawnsE -= PAWN_OFFSET_E + (PAWN_MULT_E + passKings + passFree + passUnstop) * PAWN_PASSED[9-rank] | 0;
  
          //console.log('B PASS',COORDS[sq],'Kdist,free,unstop=',passKings,passFree,passUnstop);
        }
      }
      count++;
      next++
    }
  }
  
  //}}}
  
  //if (bPassed || wPassed)
    //console.log('----------------------------')
  
  //}}}
  
  //}}}
  //{{{  K
  
  var penalty = 0;
  
  var kingS = 0;
  var kingE = 0;
  
  if (wCanBeAttacked) {
    //{{{  shelter
    
    penalty = 0;
    
    penalty += WSHELTER[(wLeast & wKingMask) >>> wKingBits] * SHELTERM;
    
    if (wKingFile != 8)
      penalty += WSHELTER[(wLeastR & wKingMask) >>> wKingBits];
    
    if (wKingFile != 1)
      penalty += WSHELTER[(wLeastL & wKingMask) >>> wKingBits];
    
    if (penalty == 0)
      penalty = KING_PENALTY;
    
    kingS -= penalty;
    
    //}}}
    //{{{  storm
    
    penalty = 0;
    
    penalty += WSTORM[(bMost & wKingMask) >>> wKingBits];
    
    if (wKingFile != 8)
      penalty += WSTORM[(bMostR & wKingMask) >>> wKingBits];
    
    if (wKingFile != 1)
      penalty += WSTORM[(bMostL & wKingMask) >>> wKingBits];
    
    kingS -= penalty;
    
    //}}}
  }
  
  if (bCanBeAttacked) {
    //{{{  shelter
    
    penalty = 0;
    
    penalty += WSHELTER[9 - ((bLeast & bKingMask) >>> bKingBits)] * SHELTERM;
    
    if (bKingFile != 8)
      penalty += WSHELTER[9 - ((bLeastR & bKingMask) >>> bKingBits)];
    
    if (bKingFile != 1)
      penalty += WSHELTER[9 - ((bLeastL & bKingMask) >>> bKingBits)];
    
    if (penalty == 0)
      penalty = KING_PENALTY;
    
    kingS += penalty;
    
    //}}}
    //{{{  storm
    
    penalty = 0;
    
    penalty += WSTORM[9 - ((wMost & bKingMask) >>> bKingBits)];
    
    if (bKingFile != 8)
      penalty += WSTORM[9 - ((wMostR & bKingMask) >>> bKingBits)];
    
    if (bKingFile != 1)
      penalty += WSTORM[9 - ((wMostL & bKingMask) >>> bKingBits)];
    
    kingS += penalty;
    
    //}}}
  }
  
  //}}}
  //{{{  NBRQ
  
  var mobS = 0;
  var mobE = 0;
  
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
      
      mob = 0;
      att = 0;
      
      to = fr+10; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      to = fr-10; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      to = fr+14; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      to = fr-14; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      to = fr+23; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      to = fr-23; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      to = fr+25; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      to = fr-25; mob += MOB_NIS[b[to]]; att += BKZ[to] * MOB_NIS[b[to]];
      
      mobS += mob * MOB_NS - MOBOFF_NS;
      mobE += mob * MOB_NE - MOBOFF_NE;
      
      if (att) {
        attackN++;
        attackV += ATT_N;
      }
      
      //{{{  outpost
      
      var outpost = WOUTPOST[fr];
      
      if (outpost) {
      
        if (((bLeastR & frMask) >>> frBits) <= frRank && ((bLeastL & frMask) >>> frBits) <= frRank) {
          knightsS += outpost;
          knightsS += outpost * IS_WP[b[fr+11]];
          knightsS += outpost * IS_WP[b[fr+13]];
        }
      }
      
      //}}}
      
      knightsS += imbalN_S[wNumPawns];
      knightsE += imbalN_E[wNumPawns];
      
      //}}}
    }
  
    else if (frObj == W_BISHOP) {
      //{{{  B
      
      mob = 0;
      att = 0;
      
      to = fr + 11;  while (!b[to]) {att += BKZ[to]; to += 11; mob++;} mob += MOB_BIS[b[to]]; att += BKZ[to] * MOB_BIS[b[to]];
      to = fr - 11;  while (!b[to]) {att += BKZ[to]; to -= 11; mob++;} mob += MOB_BIS[b[to]]; att += BKZ[to] * MOB_BIS[b[to]];
      to = fr + 13;  while (!b[to]) {att += BKZ[to]; to += 13; mob++;} mob += MOB_BIS[b[to]]; att += BKZ[to] * MOB_BIS[b[to]];
      to = fr - 13;  while (!b[to]) {att += BKZ[to]; to -= 13; mob++;} mob += MOB_BIS[b[to]]; att += BKZ[to] * MOB_BIS[b[to]];
      
      mobS += mob * MOB_BS - MOBOFF_BS;
      mobE += mob * MOB_BE - MOBOFF_BE;
      
      if (att) {
        attackN++;
        attackV += ATT_B;
      }
      
      wBishop += WSQUARE[fr];
      bBishop += BSQUARE[fr];
      
      bishopsS += imbalB_S[wNumPawns];
      bishopsE += imbalB_E[wNumPawns];
      
      //}}}
    }
  
    else if (frObj == W_ROOK) {
      //{{{  R
      
      mob = 0;
      att = 0;
      
      to = fr + 1;   while (!b[to]) {att += BKZ[to]; to += 1;  mob++;} mob += MOB_RIS[b[to]]; att += BKZ[to] * MOB_RIS[b[to]];
      to = fr - 1;   while (!b[to]) {att += BKZ[to]; to -= 1;  mob++;} mob += MOB_RIS[b[to]]; att += BKZ[to] * MOB_RIS[b[to]];
      to = fr + 12;  while (!b[to]) {att += BKZ[to]; to += 12; mob++;} mob += MOB_RIS[b[to]]; att += BKZ[to] * MOB_RIS[b[to]];
      to = fr - 12;  while (!b[to]) {att += BKZ[to]; to -= 12; mob++;} mob += MOB_RIS[b[to]]; att += BKZ[to] * MOB_RIS[b[to]];
      
      mobS += mob * MOB_RS - MOBOFF_RS;
      mobE += mob * MOB_RE - MOBOFF_RE;
      
      if (att) {
        attackN++;
        attackV += ATT_R;
      }
      
      //{{{  7th
      
      if (frRank == 7 && (bKingRank == 8 || bHome)) {
        rooksS += ROOK7TH_S;
        rooksE += ROOK7TH_E;
      }
      
      //}}}
      //{{{  semi/open file
      
      rooksS -= ROOKOPEN_S;
      rooksE -= ROOKOPEN_E;
      
      if (!(wMost & frMask)) {   // no w pawn.
      
        rooksS += ROOKOPEN_S;
        rooksE += ROOKOPEN_E;
      
        if (!(bLeast & frMask)) {  // no b pawn.
          rooksS += ROOKOPEN_S;
          rooksE += ROOKOPEN_E;
        }
      
        if (frFile == bKingFile) {
          rooksS += ROOKOPEN_S;
        }
      
        if (Math.abs(frFile - bKingFile) <= 1) {
          rooksS += ROOKOPEN_S;
        }
      }
      
      //}}}
      
      rooksS += imbalR_S[wNumPawns];
      rooksE += imbalR_E[wNumPawns];
      
      //}}}
    }
  
    else if (frObj == W_QUEEN) {
      //{{{  Q
      
      mob = 0;
      att = 0;
      
      to = fr + 1;   while (!b[to]) {att += BKZ[to]; to += 1;  mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      to = fr - 1;   while (!b[to]) {att += BKZ[to]; to -= 1;  mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      to = fr + 12;  while (!b[to]) {att += BKZ[to]; to += 12; mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      to = fr - 12;  while (!b[to]) {att += BKZ[to]; to -= 12; mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      
      to = fr + 11;  while (!b[to]) {att += BKZ[to]; to += 11; mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      to = fr - 11;  while (!b[to]) {att += BKZ[to]; to -= 11; mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      to = fr + 13;  while (!b[to]) {att += BKZ[to]; to += 13; mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      to = fr - 13;  while (!b[to]) {att += BKZ[to]; to -= 13; mob++;} mob += MOB_QIS[b[to]]; att += BKZ[to] * MOB_QIS[b[to]];
      
      mobS += mob * MOB_QS;
      mobE += mob * MOB_QE;
      
      if (att) {
        attackN++;
        attackV += ATT_Q;
      }
      
      //{{{  7th rank
      
      if (frRank == 7 && (bKingRank == 8 || bHome)) {
        queensS += QUEEN7TH_S;
        queensE += QUEEN7TH_E;
      }
      
      //}}}
      
      queensS += imbalQ_S[wNumPawns];
      queensE += imbalQ_E[wNumPawns];
      
      //}}}
    }
  
    count++;
  }
  
  if (bCanBeAttacked) {
  
    if (attackN > ATT_L)
      attackN = ATT_L;
  
    attS += (attackV * ATT_M * ATT_W[attackN]) | 0;
    attE += 0;
  }
  
  if (wBishop && bBishop) {
    bishopsS += TWOBISHOPS_S;
    bishopsE += TWOBISHOPS_E;
  }
  
  //}}}
  //{{{  black
  
  var mob     = 0;
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
      
      mob = 0;
      att = 0;
      
      to = fr+10; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      to = fr-10; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      to = fr+14; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      to = fr-14; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      to = fr+23; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      to = fr-23; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      to = fr+25; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      to = fr-25; mob += MOB_NIS[b[to]]; att += WKZ[to] * MOB_NIS[b[to]];
      
      mobS -= mob * MOB_NS + MOBOFF_NS;
      mobE -= mob * MOB_NE + MOBOFF_NE;
      
      if (att) {
        attackN++;
        attackV += ATT_N;
      }
      
      //{{{  outpost
      
      var outpost = BOUTPOST[fr];
      
      if (outpost) {
      
        if (((wLeastR & frMask) >>> frBits) >= frRank && ((wLeastL & frMask) >>> frBits) >= frRank) {
          knightsS -= outpost;
          knightsS -= outpost * IS_BP[b[fr-11]];
          knightsS -= outpost * IS_BP[b[fr-13]];
        }
      }
      
      //}}}
      
      knightsS -= imbalN_S[bNumPawns];
      knightsE -= imbalN_E[bNumPawns];
      
      //}}}
    }
  
    else if (frObj == B_BISHOP) {
      //{{{  B
      
      mob = 0;
      att = 0;
      
      to = fr + 11;  while (!b[to]) {att += WKZ[to]; to += 11; mob++;} mob += MOB_BIS[b[to]]; att += WKZ[to] * MOB_BIS[b[to]];
      to = fr - 11;  while (!b[to]) {att += WKZ[to]; to -= 11; mob++;} mob += MOB_BIS[b[to]]; att += WKZ[to] * MOB_BIS[b[to]];
      to = fr + 13;  while (!b[to]) {att += WKZ[to]; to += 13; mob++;} mob += MOB_BIS[b[to]]; att += WKZ[to] * MOB_BIS[b[to]];
      to = fr - 13;  while (!b[to]) {att += WKZ[to]; to -= 13; mob++;} mob += MOB_BIS[b[to]]; att += WKZ[to] * MOB_BIS[b[to]];
      
      mobS -= mob * MOB_BS + MOBOFF_BS;
      mobE -= mob * MOB_BE + MOBOFF_BE;
      
      if (att) {
        attackN++;
        attackV += ATT_B;
      }
      
      wBishop += WSQUARE[fr];
      bBishop += BSQUARE[fr];
      
      bishopsS -= imbalB_S[bNumPawns];
      bishopsE -= imbalB_E[bNumPawns];
      
      //}}}
    }
  
    else if (frObj == B_ROOK) {
      //{{{  R
      
      mob = 0;
      att = 0;
      
      to = fr + 1;   while (!b[to]) {att += WKZ[to]; to += 1;  mob++;} mob += MOB_RIS[b[to]]; att += WKZ[to] * MOB_RIS[b[to]];
      to = fr - 1;   while (!b[to]) {att += WKZ[to]; to -= 1;  mob++;} mob += MOB_RIS[b[to]]; att += WKZ[to] * MOB_RIS[b[to]];
      to = fr + 12;  while (!b[to]) {att += WKZ[to]; to += 12; mob++;} mob += MOB_RIS[b[to]]; att += WKZ[to] * MOB_RIS[b[to]];
      to = fr - 12;  while (!b[to]) {att += WKZ[to]; to -= 12; mob++;} mob += MOB_RIS[b[to]]; att += WKZ[to] * MOB_RIS[b[to]];
      
      mobS -= mob * MOB_RS + MOBOFF_RS;
      mobE -= mob * MOB_RE + MOBOFF_RE;
      
      if (att) {
        attackN++;
        attackV += ATT_R;
      }
      
      //{{{  7th rank
      
      if (frRank == 2 && (wKingRank == 1 || wHome)) {
        rooksS -= ROOK7TH_S;
        rooksE -= ROOK7TH_E;
      }
      
      //}}}
      //{{{  semi/open file
      
      rooksS += ROOKOPEN_S;
      rooksE += ROOKOPEN_E;
      
      if (!(bLeast & frMask)) { // no b pawn.
      
        rooksS -= ROOKOPEN_S;
        rooksE -= ROOKOPEN_E;
      
        if (!(wMost & frMask)) {  // no w pawn.
          rooksS -= ROOKOPEN_S;
          rooksE -= ROOKOPEN_E;
        }
      
        if (frFile == wKingFile) {
          rooksS -= ROOKOPEN_S;
        }
      
        if (Math.abs(frFile - wKingFile) <= 1) {
          rooksS -= ROOKOPEN_S;
        }
      }
      
      //}}}
      
      rooksS -= imbalR_S[bNumPawns];
      rooksE -= imbalR_E[bNumPawns];
      
      //}}}
    }
  
    else if (frObj == B_QUEEN) {
      //{{{  Q
      
      mob = 0;
      att = 0;
      
      to = fr + 1;   while (!b[to]) {att += WKZ[to]; to += 1;  mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      to = fr - 1;   while (!b[to]) {att += WKZ[to]; to -= 1;  mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      to = fr + 12;  while (!b[to]) {att += WKZ[to]; to += 12; mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      to = fr - 12;  while (!b[to]) {att += WKZ[to]; to -= 12; mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      
      to = fr + 11;  while (!b[to]) {att += WKZ[to]; to += 11; mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      to = fr - 11;  while (!b[to]) {att += WKZ[to]; to -= 11; mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      to = fr + 13;  while (!b[to]) {att += WKZ[to]; to += 13; mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      to = fr - 13;  while (!b[to]) {att += WKZ[to]; to -= 13; mob++;} mob += MOB_QIS[b[to]]; att += WKZ[to] * MOB_QIS[b[to]];
      
      mobS -= mob * MOB_QS;
      mobE -= mob * MOB_QE;
      
      if (att) {
        attackN++;
        attackV += ATT_Q;
      }
      
      //{{{  7th rank
      
      if (frRank == 2 && (wKingRank == 1 || wHome)) {
        queensS -= QUEEN7TH_S;
        queensE -= QUEEN7TH_E;
      }
      
      //}}}
      
      queensS -= imbalQ_S[bNumPawns];
      queensE -= imbalQ_E[bNumPawns];
      
      //}}}
    }
  
    count++;
  }
  
  if (wCanBeAttacked) {
  
    if (attackN > ATT_L)
      attackN = ATT_L;
  
    attS -= (attackV * ATT_M * ATT_W[attackN]) | 0;
    attE -= 0;
  }
  
  if (wBishop && bBishop) {
    bishopsS -= TWOBISHOPS_S;
    bishopsE -= TWOBISHOPS_E;
  }
  
  //}}}
  
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
  
    trappedS -= trap * TRAPPED;
    trappedE -= trap * TRAPPED;
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
  
    trappedS += trap * TRAPPED;
    trappedE += trap * TRAPPED;
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
  
    trappedS -= trap * TRAPPED;
    trappedE -= trap * TRAPPED;
  }
  
  if (bNumKnights) {
  
    trap = 0;
  
    trap += IS_BN[b[SQA1]] & (IS_WP[b[SQA2]] | IS_WP[b[SQC2]]);
    trap += IS_BN[b[SQH1]] & (IS_WP[b[SQH2]] | IS_WP[b[SQF2]]);
  
    trap += IS_BN[b[SQA2]] & IS_WP[b[SQA3]] & IS_WP[b[SQB2]];
    trap += IS_BN[b[SQH2]] & IS_WP[b[SQH3]] & IS_WP[b[SQG2]];
  
    trap += IS_BN[b[SQA2]] & IS_WP[b[SQB2]] & IS_WP[b[SQC3]];
    trap += IS_BN[b[SQH2]] & IS_WP[b[SQG2]] & IS_WP[b[SQF3]];
  
    trappedS += trap * TRAPPED;
    trappedE += trap * TRAPPED;
  }
  
  //}}}
  
  //}}}
  //{{{  tempo
  
  if (turn == WHITE) {
   var tempoS = TEMPO_S;
   var tempoE = TEMPO_E;
  }
  
  else {
   var tempoS = -TEMPO_S;
   var tempoE = -TEMPO_E;
  }
  
  //}}}

  //{{{  combine
  
  var evalS = this.runningEvalS;
  var evalE = this.runningEvalE;
  
  evalS += mobS;
  evalE += mobE;
  
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
    uci.send('info string','phased eval =',e);
    uci.send('info string','phase =',phase);
    uci.send('info string','evaluation =',evalS,evalE);
    uci.send('info string','trapped =',trappedS,trappedE);
    uci.send('info string','mobility =',mobS,mobE);
    uci.send('info string','attacks =',attS,attE);
    uci.send('info string','material =',this.runningEvalS,this.runningEvalE);
    uci.send('info string','kings =',kingS,kingE);
    uci.send('info string','queens =',queensS,queensE);
    uci.send('info string','rooks =',rooksS,rooksE);
    uci.send('info string','bishops =',bishopsS,bishopsE);
    uci.send('info string','knights =',knightsS,knightsE);
    uci.send('info string','pawns =',pawnsS,pawnsE);
    uci.send('info string','tempo =',tempoS,tempoE);
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

  for (var i=0; i < TTSIZE; i++)
    this.ttType[i] = TT_EMPTY;

  for (var i=0; i < PTTSIZE; i++)
    this.pttFlags[i] = TT_EMPTY;

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
    lozza.uci.debug('*************** LO',this.loHash,loHash);

  if (this.hiHash != hiHash)
    lozza.uci.debug('*************** HI',this.hiHash,hiHash);

  if (this.ploHash != ploHash)
    lozza.uci.debug('************* PLO',this.ploHash,ploHash);

  if (this.phiHash != phiHash)
    lozza.uci.debug('************* PHI',this.phiHash,phiHash);
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
//{{{  .net*

lozBoard.prototype.netwMove = function (p,fr,to) {

  for (var h=0; h < NETH1SIZE; h++) {
    var h = this.h1[h];
    h.sum -= h.weights[64*(p-1) + NETMAP[fr]];
    h.sum += h.weights[64*(p-1) + NETMAP[fr]];
  }
}

lozBoard.prototype.netbMove = function (p,fr,to) {

  for (var h=0; h < NETH1SIZE; h++) {
    var h = this.h1[h];
    h.sum -= h.weights[NETINOFF + 64*(p-1) + NETMAP[fr]];
    h.sum += h.weights[NETINOFF + 64*(p-1) + NETMAP[fr]];
  }
}

lozBoard.prototype.netwAdd = function (p,sq) {

  for (var h=0; h < NETH1SIZE; h++) {
    var h = this.h1[h];
    h.sum += h.weights[64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netbAdd = function (p,sq) {

  for (var h=0; h < NETH1SIZE; h++) {
    var h = this.h1[h];
    h.sum += h.weights[NETINOFF + 64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netwDel = function (p,sq) {

  for (var h=0; h < NETH1SIZE; h++) {
    var h = this.h1[h];
    h.sum -= h.weights[64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netbDel = function (p,sq) {

  for (var h=0; h < NETH1SIZE; h++) {
    var h = this.h1[h];
    h.sum -= h.weights[NETINOFF + 64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netEval = function () {

  this.o1.sum = 0;

  for (var h=0; h < NETH1SIZE; h++) {
    var h = this.h1[h];
    this.o1.sum += h.sum * this.o1.weights[h];
  }

  return this.o1.sum;
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

  if (Date.now() - this.splitTime > 500) {
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
      
      lozza.stats.timeOut = 1;
      
      break;
      
      //}}}

    case 'bench':
      //{{{  bench
      
      uci.debugging = true;
      
      for (var i=0; i < WS_PST.length; i++) {
        var wpst = WS_PST[i];
        var bpst = BS_PST[i];
        if (wpst.length != 144)
          uci.debug('ws pst len err',i)
        if (bpst.length != 144)
          uci.debug('bs pst len err',i)
        for (var j=0; j < wpst.length; j++) {
          if (wpst[j] != bpst[wbmap(j)])
            uci.debug('s pst err',i,j,wpst[j],bpst[wbmap(j)])
        }
      }
      
      for (var i=0; i < WE_PST.length; i++) {
        var wpst = WE_PST[i];
        var bpst = BE_PST[i];
        if (wpst.length != 144)
          uci.debug('we pst len err',i)
        if (bpst.length != 144)
          uci.debug('be pst len err',i)
        for (var j=0; j < wpst.length; j++) {
          if (wpst[j] != bpst[wbmap(j)])
            uci.debug('e pst err',i,j,wpst[j],bpst[wbmap(j)])
        }
      }
      
      if (WOUTPOST.length != 144)
        uci.debug('w outpost len err',i)
      if (BOUTPOST.length != 144)
        uci.debug('b outpost len err',i)
      for (var j=0; j < WOUTPOST.length; j++) {
        if (WOUTPOST[j] != BOUTPOST[wbmap(j)])
          uci.debug('outpost err',j,WOUTPOST[j],BOUTPOST[wbmap(j)])
      }
      
      for (var i=0; i < 144; i++) {
        for (var j=0; j < 144; j++) {
          if (WKZONES[i][j] != BKZONES[wbmap(i)][wbmap(j)])
            uci.debug('kzones err',i,j,WKZONES[i][j],BKZONES[i][j])
        }
      }
      
      uci.debug('bench done ok')
      
      uci.debugging = false;
      
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
      
      uci.send('id name Lozza',BUILD);
      uci.send('id author Colin Jenkins');
      //uci.send('option');
      uci.send('uciok');
      
      break;
      
      //}}}

    case 'isready':
      //{{{  isready
      
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

  lozza.uci.nodefs = require('fs');

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
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

