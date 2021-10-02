//
// https://github.com/op12no2/lozza
//
// A hand-coded Javascript chess engine inspired by Fabien Letouzey's Fruit 2.1.
//

var BUILD = "2.1";

//{{{  history
/*

2.1 30/09/21 Add small network.
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

  this.sum      = 0;
  this.sumCache = 0;
  this.weights  = [];
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
  
  // last update Sat Oct 02 2021 11:11:11 GMT+0100 (British Summer Time)
  // hidden layer = 16
  
  this.netScale = 100;
  this.h1[0].weights = [-0.4823824464103259,-0.7855969073442957,0.4659998142925712,0.6972867190654317,-0.02836081503556498,0.291299581844219,0.18364865946298892,0.4901989814472465,0.2375770398647109,0.9425349050585863,1.3886222674161768,0.3288943979253461,0.3588373648333242,1.182479439933963,0.797778528323678,0.11612805993781486,0.7500279862133037,0.17452601656132125,0.3002255599549896,0.6685933144252751,0.6889625612494109,-0.20926438698349692,0.9016636961468713,0.08891631520050189,0.5354307562036911,0.013346872176842188,0.34845194312027955,0.41539309822074894,0.8977440157026353,0.5499975479751703,0.32069171057520246,0.0009237642255675873,0.28450799067037474,0.825316578972688,0.5192106799558189,-0.22791887945272915,0.9331451589473221,-0.2359750162061661,0.6144806018407769,-0.7438381827829861,0.6816119600716514,0.5511352100425027,0.08511508771611573,0.801924314224527,-0.6921841553399942,0.1319765896239584,0.7160011738734783,-0.20998957251718106,1.2946324718336224,0.9898678395720826,0.44404683380552795,-0.8329995807943252,-0.006769150341250921,-0.39015085053188264,-0.26741390177526214,0.48450275179762486,-0.8290319652886748,-0.6128752498407519,0.2298740679529394,-0.5133031432722284,-0.3963353797875291,0.7813455081047245,0.3079414499705484,0.8093346701422188,0.2546234387848244,1.3843387248261303,0.7358081653780301,0.8240624393856745,1.2510398467918251,0.9030458119796662,1.0291138537541182,0.45300751889233265,-0.23852540373728198,0.9052431171826404,1.4199524073665102,1.3643895828121355,0.4998573389798529,0.24140342144869467,0.9589648100734922,-0.364726140411098,-0.32962128827526943,0.11514892821356341,1.0031535986636568,-0.13087883016657523,0.23903141927308788,0.7042488044794946,1.3896287886752219,1.1985305654006535,0.6951352085800462,1.1612577442022187,0.6435764408186432,1.6967138530240753,0.46720825820281464,1.6680870340412155,0.9555592892574013,-0.23929624992137047,1.0036892089426896,-0.027549232420429694,-0.08347255136861004,0.3293700059021486,1.1625924750653143,1.2964254687291188,1.4276130147390382,0.15347110728752392,1.6735981671664149,0.6489937674529468,0.3627539170046438,-0.13864163968351828,0.8813358673487404,0.48289920636189887,1.3220568980582017,0.9170101262991643,-0.27817695001712633,-0.2916850234236394,0.5911420442409112,1.418059555927031,1.8003061386611265,1.3205413241486763,1.2257900892576234,-0.1837342045703827,0.4095662135113113,0.02440355347186608,0.7592792867881425,0.24312224883772346,-0.41816646224165416,0.583978375283667,1.2788729045324316,1.2509438323581759,1.3597101821884447,1.0492706067578241,1.2837918563948467,1.1378287438403734,0.6931372110676611,0.6294224500842114,0.7799997177067252,0.19424717748197978,1.4516598756073302,0.37389893880869834,0.6756433302199365,0.7035808075209709,0.425190267247927,0.7113401906861478,1.2519055272888622,-0.12189731038906901,1.2830513104716763,0.8254935244927132,1.3338916492751904,-0.04433957538120762,1.4240068868399272,1.5994895584107134,1.006532655816215,0.8080480679453794,0.5393242186914143,0.10991058372927319,0.7296509577562338,1.1255265988342964,1.3125258118666931,1.074722213982409,1.1619978954831944,0.5313683355197069,1.6201978068910383,0.8004840985610084,0.35607929124634125,0.27022559143505986,1.352597305901115,1.843829966621429,-0.26292095478192706,-0.3413428304932426,0.14259056914408297,0.9216583558266722,0.9923136496698011,-0.1483465310846529,0.5731298034888044,-0.036870640535969855,0.38309960377042207,1.3496210523891832,0.5461986530643719,1.820916959032291,0.5221822014394378,0.4362311140947894,0.882654192983551,0.8745611914775178,0.8204733138612974,1.016881192345473,0.10675710996598309,0.7599217742139677,0.1060560104541605,0.37857711644270475,0.8339216640446784,-0.05913141655431176,1.5497161317810006,-0.06484301923525032,2.1523226067228403,2.0720328133083896,1.1807793516396097,1.5603332881250995,1.9135645882236403,0.7059125922150601,1.584964913726072,1.3443432219202336,1.2425164907484938,1.4927410442024238,1.6885092362904217,1.5196501725513445,1.4380609373785942,1.4787184175983583,1.920863192047525,2.1003957750698943,1.1187614537394217,0.5910729997450562,2.134887451597759,0.4179675511508753,1.8019489616075308,1.759864244821816,2.012816603059754,1.046562253692143,0.8809449755819022,1.79737140374107,1.709052299997533,1.8869221730238093,2.13323720136956,1.0702146459089685,1.7596521448568994,1.689055180573149,0.43036970960326826,0.5218756664079157,2.0622800018914917,2.3551964193475268,2.2240051054468184,2.3346674185674785,1.0723482980877441,2.150333063497071,1.5433140951465205,1.9194435770741494,0.9629240213522725,1.8076677324090935,0.7773502942167883,1.2106658650873678,1.7951230951003943,1.9119729634934983,0.19768664774571412,1.1890480138801889,0.3858841134202681,0.7042681006833529,0.6787725008190801,1.1545801070290969,0.8547162594170912,1.665303055622609,1.8188157069092883,1.4206520295627156,0.58429571262933,1.7017552069850255,1.3166038127227286,1.6996031874794624,1.389192614000281,0.4001374455987909,3.3623475154460527,2.226622962257335,2.184784108923232,2.0825728274918407,2.1796992313522274,2.0803481985724233,2.341492141571459,2.636378344024879,3.2335531104230637,2.4257191851930657,1.9012929152385138,2.799375842357011,3.0343130337160535,1.5310042085499218,2.367183882789758,2.0403696474853903,2.026206364731851,3.188727736876154,2.696308891967216,2.793471994896751,1.530508302345985,2.3379093996130442,2.6946651797862415,2.846629485940996,1.5950603773140146,3.2514643821375087,2.326398614328983,3.0944812987392525,1.5930568382926624,2.9619823992847056,2.2699220803224502,1.8179463655790313,3.130431725985024,2.979666318764142,2.835255606200789,2.955721110636968,1.9354319489780774,3.3180885331637335,1.810604148663027,3.2120076800750965,1.256211649380338,1.799803977812136,2.034915498282117,3.0788061260065347,2.1297246422045117,1.6637291204038214,2.744669902602954,3.296345156162859,2.276336781146422,2.1232320446215693,2.8151818600816854,1.4540650996026667,2.9125312253668443,2.8981524060406727,1.7140279716315965,2.898699204884356,2.947997807992716,1.6846119694831312,2.656050533949174,3.175859117265748,2.5732842210770914,2.0310509888236234,2.738643021075879,1.9742574799768415,0.8614030108022652,1.0170110825503123,0.797016851414002,-0.08828482944819391,0.8006147407422741,-0.043072322295599104,1.035400294581439,0.7278385818267961,0.06851302403380785,0.9418553721407003,-0.22768937008579496,0.8547128400174774,-0.11720272276600288,-0.46316012417040503,0.3760736003029818,-0.1610940006601827,0.8705152248956979,0.8013378980017358,-0.5871336154878455,0.2605092024346315,-0.5161805182264201,0.1459051813374738,-0.43624355933639647,-0.1707856339026525,-0.5230223261580212,-0.01589941834144815,0.995706563815592,-0.9699956268148,-0.14412355857201525,-0.5311010690279938,0.22873730098396483,0.049158418463904965,-0.30038955119199096,0.7175540310448592,0.679617914962742,-0.30828353020359306,0.7756548904784725,-0.8794742038020497,-1.107458019630525,0.3003689022506526,0.48220440146666504,-0.858095789918145,-1.1181032943493547,0.0838057117145225,-0.2641309646988678,-0.8997841919901225,0.8428332968677862,-0.661923223732049,-0.7263927336390669,1.0804311265396134,-0.32169380427668476,-0.004859805834180918,0.09246733779142305,0.5004467640465188,0.5614121526228724,0.5742410984832461,-0.30011273589434245,0.2646286286928724,-0.8849582442630217,-0.5727839411078363,-0.3806943438798675,-0.6240903385867778,0.24772770863865262,-0.40127589834844885,0.27456446737826257,-0.8792286277521453,0.739972698410281,0.8717537506883555,0.5795402480745757,0.6077346582381251,-0.4501642570634292,0.19913651313323566,-0.1231365527837506,-0.16477876303623376,-0.1347756594999631,-0.4396328280434759,-0.7597298079254693,-0.29577402015363535,0.16902149644663875,0.33700096935095536,-0.4721194449227767,-0.2066441358890889,-0.8334421009554891,0.15057628966816664,-0.662151810427085,-0.47433475209100157,-1.0958268433628788,-0.9827229755627201,-0.2924933457417256,-0.7238033082440397,-0.31967930486020507,-0.9522592247378857,-0.34382051178226114,-0.2984085410116645,-0.33429878499912147,-1.1153326223794844,0.370845299194134,0.39030994733323576,-0.7967725754843454,-0.1356665571947299,0.9396487518216519,0.5809911603367466,-0.60140949652451,0.015460892993204082,-1.2088046788722875,0.3086766210156351,0.07300954588308681,-0.39031774176950274,-0.6099342317384291,-0.9215888506820042,-0.40734402235323536,0.3070408189480525,-1.832732524893584,-0.4461050764304435,-0.6993296220311634,-1.5946995840350096,-0.8027289111369308,-1.2700054774874283,-1.6656749869168057,-0.13576302949176733,0.19773799191931785,-0.6627954340635993,0.7024034071327705,-0.7924034815982464,0.6840169625043098,0.995111989093532,0.5991720896116393,0.5786158982608014,-1.201574683342387,-0.5213160900192586,-0.629647229852671,-0.3609437127712709,-0.22051538604701285,-1.8348695722486246,-0.4578073382337382,-1.4073447836002817,-0.30678514999737766,-0.18227407368012594,-1.3870667360497297,0.40054075883011475,-0.49716434182146024,-1.0305837269728646,-0.4542564003975794,0.25990429579264007,-1.1184979826359984,-0.7162085888923009,-0.8631845760848064,-1.458897549698729,-0.5452460391100126,-1.567231661946154,-1.6629139498164127,-0.3739136160984514,0.09680353020518352,-0.06422129631586189,-1.7030864297730546,-1.39896462422997,-1.6598252476757471,-1.5316724349819228,-1.3962784328407474,-1.6558168604065109,-0.17172879516811843,-0.8039783279730356,-1.1108630492352496,-0.14526497558317414,-0.6425821097783565,-0.3420706721055505,-1.0129550651993462,-0.29090764239439604,-1.0047052614073302,-1.534088263292959,-1.2146708231220298,-1.3739455875171438,-0.8181642428187741,-0.3971061634158923,-1.1530698617166801,-0.00044915285713964824,-0.5656266719999182,-1.649863171110194,-0.03233347028845284,-0.6843255532710802,-0.7440554635961895,-0.4352157614882442,-0.40381052131921163,-1.4513259941027448,-0.09481202919423432,-1.2809052805981986,-1.3890010575512945,0.2537144566517592,-0.3589159856361764,-0.512277152689077,-1.5019087718075195,-0.43064373309600906,-0.22765509293201316,-0.05361590491697792,-1.6047486757004696,0.41145801984732755,-1.0970699053157704,0.16124758007689538,0.07038521494944046,-0.3167136220072995,-1.7490311285589308,-1.5392073430283835,-1.6039855314035358,-1.1789738436857051,-1.082132314424059,-0.7301345290062968,-0.37987179744053123,-1.3887141665554994,-0.27032400784146443,-0.12865196490377134,-1.3893625367658713,-0.9562451052167616,0.10803861353785464,-0.43254976685667934,-0.3203436337235652,-1.147048471083847,-0.6013195364292807,-1.5566675848631584,-0.06649652157363428,0.12589392272888741,-0.5431153171623413,-0.24311530719269864,-0.3891687029956023,-0.8551602019479719,-0.6307987460256361,-0.8749264316480013,-0.20992585170832662,-1.0540044853006767,-0.07903462720614665,-0.6430946394437255,-0.43757449972072243,-0.9810317407841743,-1.5787116332143305,0.07363614364836021,-0.3088847851868499,-0.11165845229172941,-0.0766555315198974,-0.8949800629740577,-1.306396212612007,0.13375948051323863,0.10389937090800817,-0.8124037164971415,-0.0050526177711839775,-1.6320289847480325,-1.3388103447277446,-0.06462737394521867,-1.5494108909467197,-0.3845560387860947,-1.3683071354057774,-0.058947634703087455,-1.4336797749139212,-0.12042089905519261,-0.04068172596350226,-0.33340599044317276,-1.3897628645558247,-1.3306980971658795,-1.2307405327639156,-1.971959422304991,-1.3394063150669977,-1.0112652757780651,-0.48998992079272813,-2.388735325832763,-1.3692469072943187,-1.9500018581373342,-1.2437200393387835,-1.2926219576821545,-1.349127184909407,-2.2866828011584923,-0.5748523223879313,-1.6727194339335953,-1.9163403508133665,-1.019141028145159,-0.45508755904296966,-1.915517486286347,-2.3325279541829915,-1.4348779931813798,-1.1777442295369516,-0.8645718469693618,-0.6385099528641446,-0.8864376431618125,-0.2299220566108871,-0.5016060811184908,-2.4468759082659326,-1.137260990950628,-0.5696058080483234,-1.5119187826414653,-1.4721586719385304,-1.8238016584398082,-1.1917964374234167,-2.335028417947005,-1.2780290857407994,-0.32167224354609736,-0.7573897950134266,-1.1700556725953921,-1.166812658840392,-0.41634056331451347,-1.6692109118252885,-2.0761645492629395,-0.6441973886821292,-1.1298995929033,-0.9469227482960594,-0.6644132946069393,-0.9051107727025202,-0.5058603539511055,-1.2231842559666921,-2.1882032366560003,-1.184255679115129,-0.6223689658180619,-1.8137000997652686,-1.147041654832172,-1.9305505615559286,-1.207106864819826,-2.1729380994585057,-1.2679535956670425,-0.9470584937863116,-1.585807714912297,-0.7030695226905602,-1.4419175245778344,-0.2237436864479597,-1.0260766184053949,-2.781531452072032,-2.9059926705810244,-2.990902487534387,-2.4977061050093816,-1.2565266709255574,-1.34316495284912,-1.6283644068487202,-2.3877161642038596,-1.6925757099721173,-2.6701130311091643,-2.141051629392117,-2.7177648025227508,-2.038226378085505,-2.0043877700177113,-2.9968185064676374,-2.718944298008119,-2.9764324306003034,-3.1975049191755263,-3.0165980048694885,-2.523063555032517,-1.7271866231389996,-2.9573292805261624,-2.7998693325434187,-3.1293859459308124,-1.9203527785147603,-1.4913198473406986,-1.8251016528984663,-2.4303529633781307,-2.0983592449295303,-2.6823030234494696,-2.535924614638893,-2.762104677735175,-2.657617619503167,-3.226020629083378,-1.4212180204725953,-3.3596095340601857,-2.9216539862734185,-1.7182789457417433,-2.8096856057389057,-2.2918296756833825,-2.3960586706053637,-2.5195179941354464,-2.978704581406673,-2.1630887720196443,-2.6458885370282266,-1.342387967228649,-1.8679028695811148,-3.1889480460213564,-2.17811036499973,-2.3991534771698504,-2.1230472892125682,-2.1806244284299385,-3.1024355422802414,-2.8263728614378887,-2.840345930107683,-1.9665573693574163,-2.466953370431711,-1.683129392840727,-1.8389720087071604,-2.662244604173421,-1.6003020494584272,-3.0425574571641447,-3.2791884973984273,-1.9703628341793493,0.2314195418369588,-0.7187364470902218,-0.3383078961066495,0.8442930742297442,-0.562540397262833,0.6061340917479634,-0.12823906374306468,1.05535399233167,-0.8533542650060676,0.8254650214867701,-0.754752908510687,-0.1845401195408188,-0.8686044946000443,-0.3484165313859139,-0.5534533234944783,0.1703214016023809,-0.0777119646354701,0.7511723046465902,-0.2772707987486665,0.8544683638160239,0.22821136682428897,0.15913603274891303,1.1800601246149962,0.7769500062519036,0.6836270065923411,-0.21037950721379145,-0.4862433749763846,0.1477538521702851,0.37648909459014107,0.2964476964232468,-0.7655499028794046,-0.47312854749184885,0.6343708097680342,0.44714522756742153,0.18011199820885615,-0.33535299825517134,-0.2977101343274999,-0.4678916038460774,-0.9457052878265721,-0.6054752066146403,0.9710733077327746,0.7866654631216,-0.7911604066163825,-0.550432494391091,-0.23370508241943738,0.8790579344250897,-0.6852171165698915,0.16986012661557698,0.2169873218755097,-0.944392735270147,0.9285066461340291,0.7365543149953031,-0.09779351298288687,-0.7465833772856248,0.4375298684011197,0.799034834495666,-0.1269048961538449,-0.7741771451396829,0.5515313674525909,-0.09619855667716386,0.49005488539232156,-1.0781708318625876,0.9132255219469709,0.9509484435881018];
  this.h1[1].weights = [-0.04422800224697143,-0.8632695628986533,0.11727282854600007,-0.986571878911866,0.4958458410599147,-0.7074871996930607,0.8642893923958281,-0.5281417447050121,4.130861744676353,3.544950407419685,2.7076445657026262,3.2142334200915545,3.4162744395517404,3.462481582776133,3.615327918482344,3.540108440907103,2.653249829467275,2.231386420232893,1.8050823444850175,0.6400804016839845,2.3574769936583926,1.987605874359577,1.9141565060453867,1.692533847284835,1.656266157454676,1.4213478953516692,1.1648213501492102,0.794670405921551,0.9452984382026092,1.3609308419028094,1.7382212978443283,1.3200205901894508,1.5305185174007336,1.5541951504810774,0.6954369873907548,1.559903532510636,1.5323767337536145,1.2704940748171978,1.5371728694061868,1.4512566422637994,1.2501124064218925,1.4710747713302332,1.0090320874261989,1.3753820753628208,0.3457531990479141,1.4069565599250982,1.0055021327754563,0.15935792976096277,0.943714792128745,0.2153774795034932,1.3245186432498044,1.3482674025683783,1.2256080529073652,1.1109314395448353,1.1749151250134955,1.11867585525005,-0.2654735701234592,0.7457881809657554,-0.851276976550916,0.9317360476120746,-0.4358959975706105,-0.9742232000158997,0.12338823517760122,0.8213723652496063,2.1614982400590197,3.4446240914880013,3.8454650805272528,3.473886608845896,3.1574320367903757,2.4949618582562394,1.8312645642586742,2.433714314178337,3.1969147585818263,3.415024084296822,3.3898911458597936,3.8398606983834154,3.9750388998155257,3.404275976674828,3.1712427340417912,3.2465034937499704,3.4898985575964656,3.6931153168019395,4.389056300567874,4.323376815304628,4.094999006772834,4.056512218012358,4.209247671387254,4.127935600071927,4.244714810681111,3.935876272058925,3.481223401657479,4.009438320873214,4.015796662640762,3.0670306972811385,4.11589296268069,3.9839882888027462,3.0453757721592574,3.3026337720682872,4.142200958832694,4.671592852738152,4.320171513975805,4.114626245391209,4.2539669338638335,3.9292229702698878,3.730573539523811,3.4748286906549395,3.9836279717761953,4.375420828825968,4.7921696552590864,3.0835339360322154,4.273004322178497,3.5480244697072667,3.4770585604579423,4.04835586512098,3.3718128956692883,3.2625627737472622,4.128676576319865,3.4439572307074955,3.1334211932833202,3.8336616906249255,3.337018978869358,3.380092285697565,4.146876468737373,3.867356496346314,2.9939151204351875,3.240443145732161,3.1988307179099382,2.442598802016204,3.8311940587066386,3.9637620179402706,3.2786285935885053,3.989310906376671,3.340403477124421,3.897341672892051,3.5018070247536746,3.952851154234606,3.2697022523715606,4.35562721011915,3.9667151465180437,3.459348248344488,4.212058430688052,4.700095731869496,4.167403205538615,3.993386056033064,4.057334035444432,4.4722353253406615,3.5174455314109574,4.70801894157817,4.069401274949792,4.309141445808878,4.769726364949868,4.084654111565669,3.294914657970554,4.891773434512861,3.80203988786032,4.0022517494456356,4.0190815918205764,4.054510567873934,3.9991508941004046,3.8548919874777923,3.7982805402695687,4.1459045812020126,3.6186644751011454,4.673013720626452,3.9511587031360116,3.7870337944975647,4.518132110826062,4.193166169447358,3.6699426430754447,3.9521366742127513,4.294964322874101,4.790648025750699,4.865500171096406,3.2614180241713706,4.610006754794674,4.195820395598999,3.415328793592083,3.966098532237431,4.493568850570259,4.210533513881652,3.828241793179197,4.248100286330279,3.792847260437096,4.389370838113889,3.3293245935046087,4.482376103244198,3.858466885571518,3.9883158537641266,4.419864508251499,3.9135340436112727,4.128982757052408,4.331144746096942,6.084219711979232,6.1894906564611745,6.652160484221663,5.88139468530233,6.643910879863363,6.3896600396352445,5.986068967041723,6.414116323188675,6.128837198864969,6.727775136964976,6.276776660598567,7.200092999915837,6.592990174485569,6.589412756997018,6.5497282372329035,6.238673527953091,6.75939549861733,6.710698798031757,5.610354314957475,6.821903117434895,6.563598817956396,6.4943107381243435,6.021091245866055,5.971551940335856,6.228003631589118,6.184718176022456,6.48737360727108,5.901423909294527,6.103492084981377,7.109286264855982,6.169970720851494,6.8199907765688,6.642201481698086,6.615458124554261,6.2703098573127765,6.015134215099854,5.976494076199867,5.743678613532786,6.417179930868703,6.43820763618361,5.406019117798669,6.504027825155943,6.319242154057064,6.476051613429639,6.564943203404753,6.270831531234412,6.672948143656856,6.531697748341561,6.026015329649989,6.244254683535393,6.105115883336447,6.707913731750069,6.685311587269998,6.050780869706056,6.924546863272859,6.453707011621602,5.3417466752313345,5.719785250786571,5.897278970669729,6.824561818702553,6.522059451127021,6.591061249299777,5.611384616641141,5.771296292019383,11.484377695263923,11.161739439684204,12.737376339978752,11.942525002530024,12.564745880593225,12.765680881042169,12.716260108158325,12.058568534602875,11.985358374037926,12.527321626359424,12.256741037005966,12.314073359038684,12.34936969930161,13.590509981405216,13.18160457552209,12.891920965231431,11.98798029849052,12.633299645409757,12.783490688902651,12.627071690681742,12.785529381261366,13.296538761935203,12.543481878963608,12.987143242769113,12.611264444548361,12.182274285805658,12.363835303673238,12.38288072197379,13.224015418152918,13.018380621081096,13.010697764740387,12.650166083455183,12.10980737065287,11.904746671790114,12.30131746522671,12.407869297730374,12.455559005357712,12.199940434478034,13.06838681888427,12.13418954758824,11.898931236782719,12.274263104088558,12.887569604627204,12.267041179888066,12.314879683607959,12.068602076161865,12.386022153026996,12.040934007734187,11.817047376518493,12.334083279753822,12.647585125212858,12.832829386302599,12.452453240275036,11.88976990071723,12.162112000706754,12.322411214456544,12.0085558601167,12.467368595080188,11.842310356206301,12.257621975754255,12.375465984361988,12.331156367712554,11.796521158340397,10.751088218403392,-0.48055762245697875,-0.11294563136461942,0.19677308663459772,-0.351944694628301,-0.14481364273743735,0.2630001343198353,-0.4392955147233682,-0.30336672387610336,-0.31422105808971684,0.1919360800159949,0.5760131767649577,0.3363365961012815,0.5990889819529162,0.9581745115241147,0.08448421788503663,-0.15965583861857546,0.34917427483564434,0.7559079559840838,0.8453717237712705,-1.312600275262038,0.037333015625942635,0.5180066490065568,0.7552516810265463,-0.31575152987970406,0.2649098706389941,0.3078700280522688,0.1395785247436238,0.4466921343149151,0.6177039764674435,0.4248941652921613,0.4167007593618974,-0.06582793967215374,-0.40330138644175595,-0.4455880573064235,0.22979576176242875,0.1258197250499839,0.7790787118483568,1.0093017219401212,-0.5765533693614918,0.3304050579947775,0.0665922631016801,-0.13870651984489374,0.30153536225814154,-0.22450999387818055,0.026087749449289425,0.4723652415777961,-0.11135102570022214,0.055091218456872613,0.2813542822190675,-0.44334903347781807,-0.30565262371753765,-0.20189700347823136,-0.09704369037042604,-0.2076548764498844,0.1513551071233871,-0.7309804672696649,-0.4590528962719059,0.6304915855411595,0.7561454339702612,-0.7591705103520233,0.6541551094873501,0.33004590600567024,-0.14350374118297488,-0.21621906417678005,-0.13435959137264009,0.6268868882968723,-0.593537678046459,-0.5850594480013034,0.5566639363349242,0.6284501870884673,-0.715271425199802,0.8445346579873969,-0.49898169802211834,-1.1753366011748818,-1.6966318542058667,-0.7575818860810178,-1.3971805085657247,-0.9023750440855226,-0.7105671004456222,-0.7970672496778746,-1.423484025786117,-1.5903844523625221,-0.6728871792231537,-0.8962547776428681,-0.37577311050717466,-1.5124421839745827,-1.5185590203672226,-0.7501798611810968,-1.4234342800236874,-0.6203277412406109,-0.25923352484499745,-0.4054639767484565,-0.4054698976465113,-0.8221755701849047,-0.4485809917906977,-1.0004983467836273,-1.3210249473026336,-0.2557086656693874,-1.051485424810383,-2.035462506984969,-1.3427159871998702,-1.4810795460593782,-1.8947314192078677,-1.328850069831681,-1.166523185991732,-3.0856625135018683,-2.2043823594794785,-3.08999365202644,-2.5254676904530866,-1.5847541044396243,-1.1719847386064566,-2.002953770099078,-5.42643762576265,-4.094622614042095,-3.52594153225319,-2.626181644778196,-4.218894913257181,-3.3252288610994136,-3.083220086472057,-3.80029118907748,-0.4681835240487353,0.3052050292043975,0.6622152847756326,-0.5714895082242837,0.731250106837217,-0.4507582960175651,-0.7166693810705791,0.8843351781559368,-3.1771377326281636,-3.062062066985916,-3.3256793512731413,-3.8342132850700184,-3.712756709509825,-3.594729295397542,-2.9407699768836135,-2.6989055266100745,-3.750761532614977,-3.4074173516449973,-3.196077369383718,-3.4307064507008476,-4.03268856026327,-3.185088245576863,-3.6195379631416844,-4.367763603706428,-3.608508632794107,-3.7319240985053326,-3.5415014640356963,-3.25157132087113,-4.043056401229981,-3.675773229398806,-3.5084708725797666,-4.018265687519689,-3.1438059908372136,-3.482340581615694,-3.1420941790317696,-3.4955906057085446,-4.216635407531574,-4.14562939013563,-4.135752372233968,-3.610255872713662,-4.050025061349049,-4.130967400991345,-3.1405702001088835,-4.4590304437103665,-4.105233549497221,-3.8928412866033324,-4.299750978142758,-3.2547421315698917,-3.025988203938682,-3.444387492596555,-3.339073243082753,-4.164390376850961,-3.190031146727068,-4.265474206367213,-3.5135820971702483,-3.9759286140011705,-3.4315462575846087,-3.0228811380204847,-3.8480990464552094,-3.020709416274268,-3.0825973034317853,-3.869233123426914,-3.3953021583558636,-3.5372594975991567,-2.205263459136224,-3.83202715508854,-3.4367680147956796,-2.7293658153205493,-3.961198722423208,-3.001311118974677,-2.69977363219954,-1.8391727918005893,-3.3067713308709275,-3.4151328247965793,-4.297657485070645,-3.599068390768625,-3.492934197624055,-3.6391935837322005,-4.1676419856354885,-3.0853169940701215,-3.8048864312167785,-3.524933256279114,-3.438823597705035,-3.9804182133573764,-3.5129323010730897,-4.812028039121652,-4.233215958638848,-3.7392219049071382,-3.1050054006780665,-4.481322056990072,-5.080454356229723,-4.815801309775877,-4.027800733374072,-4.9875635387510515,-4.139684482954451,-3.785989279386318,-4.019423883958538,-4.121774488788225,-2.969991571824889,-4.443909213894129,-3.928028480803529,-3.531840346000275,-4.482261191405677,-3.6396198987626076,-4.013409149142192,-3.717744478256823,-4.353900358275746,-3.7392042871099944,-4.092863206431629,-4.167606154852882,-3.5995849856567377,-3.7105035315628903,-4.58318239425494,-3.4378019427512263,-3.998393066795557,-4.436075072484609,-4.207350444110831,-3.4736387303008325,-4.961123227676276,-4.197042634861482,-3.5407976731603097,-3.6646952327725395,-4.876361502578429,-3.7493951965294134,-3.820080232189931,-4.912703982497806,-4.1942440238273795,-3.944274790621598,-4.252997910556141,-3.903043222519803,-3.404336069849483,-3.902163326375032,-4.202570915045388,-3.7594694687091064,-3.529452712838312,-3.889867987373349,-6.632370482887039,-5.918648175990488,-6.406330177061006,-6.9638957990943435,-6.809752070009474,-5.849555188491722,-6.255159701126187,-6.424214256401674,-6.045854821084783,-6.0294205909982646,-5.3741831244613065,-6.6331816841694415,-7.296388956204248,-6.0539086347663496,-6.066495612604073,-6.482328990374354,-5.752746280415718,-5.988254788679359,-6.193679231273317,-6.453380306334002,-6.53881519005867,-5.977416205309892,-6.062631425494855,-5.905955601920625,-5.874953878517011,-7.188179995899585,-6.037984397424413,-6.583060705628159,-5.3841791472785445,-5.726230477190656,-7.036528393564067,-5.723753017068615,-6.095831152685897,-6.975272476005161,-5.530917561395274,-6.312827231439963,-6.516853281060771,-6.179987253689319,-5.9924132458902655,-6.402080535397751,-6.005459716423849,-6.115723183202176,-6.808966097725294,-5.3782503185930155,-5.54382555077101,-6.556065672472825,-6.020012375040406,-6.547631044777505,-5.669974099528089,-6.365047664741643,-7.201624808191477,-6.160187606448652,-5.861386242943017,-6.331797180450654,-6.221494511316036,-5.887311527193635,-5.911561527238476,-5.764834722651638,-5.6701024367095165,-6.922064770951996,-6.194487801538581,-6.197627565993227,-7.173427239231309,-6.34136139382002,-11.805139389770297,-12.505446977981709,-12.180556091755607,-12.157193782780276,-12.500319046373386,-11.638682805799323,-11.49515802606586,-10.9956553552425,-12.260995886746159,-12.142745211589284,-12.26931331664916,-12.110226104507692,-11.366351455561173,-11.907928565684282,-13.193507670060947,-11.679363330398392,-11.81346184080647,-12.51688364101683,-12.661931885413386,-12.276528558778505,-11.743182126827406,-12.39861437904561,-12.244571222843456,-12.459274643496222,-11.94568793621246,-12.130171129592881,-11.649709940652755,-12.18081995193043,-12.123825504639322,-12.234408272221245,-13.226758600253666,-12.152723869485428,-11.56559532922181,-11.597800548408944,-12.41657260428828,-11.636098936564055,-12.18495376997772,-12.414621788399005,-13.109647908739149,-12.82836897873776,-11.132749721799645,-11.380098968117172,-12.308285982161587,-12.51972929980235,-12.76608605476318,-12.519358087904262,-13.615736930998157,-12.458661411956923,-11.485135387769102,-11.2946386695008,-12.53061575512343,-13.27956541010425,-12.76420624596548,-12.259209587214718,-12.395906418087757,-12.126546996923981,-13.08522158323932,-12.779159831843048,-12.635516900088241,-11.99881596517897,-13.19192340791018,-12.934537552608527,-12.978264832662976,-14.713781450038752,0.6235020160639605,0.6232919895286396,0.37871469732135765,0.5684428406078931,-0.48650511255377316,0.36161210413420014,-0.5509435890538703,0.11997932708244399,0.6183462694495657,-0.42405919044017476,-0.5015477692536076,-0.31460769978008407,0.06665737507680236,0.7912670167861573,0.4695205212860101,-0.2630878184926926,0.6890252538499132,-0.535055347367059,-0.4117962349546432,0.15216547424199423,-0.6981927446807944,-0.03788968953436673,-0.02037049422824483,0.4865836590459448,1.0834706047643878,0.2311290546027773,0.22409339961290756,-0.599810671211036,0.36612852473014584,0.3350011482490224,-0.5639577162395322,0.3348638830376776,0.1640566068584622,-0.5160452884328102,-0.755714154101761,0.5587391117534258,0.06059929282207802,-0.9172325616466093,0.5148537429842295,0.9512978773383794,0.8244891984594612,0.0643000625113913,0.22286486059819352,-0.04972668639998619,0.7914960253799583,0.6329854545962216,0.37564780078968585,-0.05501203222884425,-0.5622609032241848,0.6690377378507468,-0.9722325249067877,-0.647266548764291,0.5945465008384687,0.14267764679801037,-0.2065744416788514,-0.8111390009084835,0.5645769277102648,-0.41578686558277717,0.4720150842871974,0.45952129097310457,0.9729737782803572,-0.9416010828553206,-0.04048168562247225,-0.10406191119441896];
  this.h1[2].weights = [-0.6695734542998615,0.4511652814998244,-0.06589391418625601,-0.16658100065934578,0.17338336543188948,0.4326637498958892,0.2070452531936331,-0.4312967311902587,0.5437197155285294,0.45803984407685455,0.4656016446209667,1.118268102827127,1.3382031805368577,-0.13699149274315411,0.7968858530507987,0.3688632070667438,0.14694718522882255,-0.24934269013203966,0.6870761636863247,1.0173599908602091,-0.24021208436081734,-0.0267503954347269,1.2108523216399567,0.33241492580677795,1.1120687615781666,-0.4380363209094187,0.876135919275347,-0.6181636927512723,1.0610196838344117,0.03858210795445755,0.43290076385457155,0.4820353528442416,0.2924335721152791,0.02080540633461545,0.8675074048579036,-0.39137493499188536,1.1528602032265787,0.6604916550711428,0.1154445314342512,0.18833146877580442,-0.09486478707924609,0.33250012634984877,0.7150286611894602,0.07459301101441915,0.2883573650777607,0.456816441829543,0.6959461263976027,0.44833826599321047,-0.6676380874080399,0.4497407439891874,-0.1729458201841097,0.8279628622723484,0.885125792213149,0.7901964882790172,-0.5547590201593905,0.4806987607180888,-0.21604708034871756,-0.4582880557663729,-0.5521802675340237,0.41981477450728066,0.5439415662038329,-0.5298585183400388,0.8252427727694989,-0.5397820627400791,0.048358868608996186,-0.12956532274478438,0.8984300436153877,-0.15280429507409615,1.7639087633557389,1.1840669905034826,0.7075535420418142,0.7142886532583145,1.0303957863088071,1.205105580609909,0.7825243343930476,0.8356212608572133,0.0673074050297553,1.2397929209404515,1.3982519610337234,0.7314969573257424,1.6691129750919083,0.3131493308279998,1.5195140761560115,0.756555502130579,0.1109646477931105,0.9914569926137916,0.7943221456818503,0.9415162203778995,0.14514379768194316,1.4184729019960753,0.6819756988167365,0.9304968266362358,1.9670706270242622,1.5830781054988194,1.823517965664685,1.7424723816424748,1.5694412728059157,1.7304892292092975,1.4145456429713734,0.7818634660593317,0.9382765206076917,1.8144238625353883,0.5835824470659264,0.0935783255953981,1.6208377171796713,1.303161355789465,-0.18396703823438737,1.4704851949511177,0.022135378527390212,0.46479679160124804,0.8025222546171333,0.911144799697136,0.888042163723325,0.6771925299934847,0.013492908870254115,1.5151468939091883,0.2613139830461904,1.436914398689868,0.8602120148486957,1.7288210178944725,0.7366051022362066,-0.1969339163549326,0.23967030612410836,1.5940261970898606,0.7016169040616538,0.804204899461077,0.8063213103404139,1.2172888314836958,1.5216838776010222,0.8022478767254996,1.001702172947152,0.2726571891739715,1.2630626234091766,1.483928795528303,1.148998088751736,1.2637566608332584,0.8002599934888388,1.5694351677991372,0.8723778463886597,-0.06504991925281568,0.6487003777843927,1.4278839486631316,0.23775538641698424,0.8171233158147464,-0.005721807051337951,1.29158290996348,1.3714605182491604,0.9264361226441721,1.5326716629931272,0.24458271859118097,0.8353500299476536,1.7211815119930534,1.5891183553219526,0.7802686747533092,1.7602643803441245,1.4241320166069569,0.14828091852660122,1.3469350635389952,0.3270123970952498,0.7248126537623091,0.22736021313184354,1.1002601280048157,0.9416369750067348,0.8121116190204627,0.35129914861606215,0.7850978321484284,1.122562552785348,0.8516443364762082,1.0443381455254075,0.39657795927259754,1.2875611164826288,0.036667299337730185,1.0574745477320677,1.083592023579936,0.4106231845510389,0.005310686579281932,0.907180318520338,1.5978229892503006,-0.041166868691924256,1.320001897975178,1.5209436369114924,0.8132432732787149,0.6159592042199485,0.5870763645673017,-0.03998645203544647,0.16434352455679713,0.08132260131204469,0.3211034862230878,0.09505708419047199,1.4286486833844285,0.1775580286076123,1.5474420466699936,2.3384962522696244,1.8131785931165183,0.6326340011532043,2.008463552718545,1.8725067069230399,1.8086024297342607,1.301258606161769,1.2488250364596087,1.0678463239974014,0.5809797298517735,1.2307301891259848,0.8998473893882102,0.8112488543401567,1.4335428519878797,0.8072839347058569,0.5789740055495766,2.1585417470366006,1.500409850431934,2.033080750993263,1.8722481889081117,1.562647968891803,0.4398933526061132,2.0693775499152394,2.082920817808036,0.8271445287588698,1.6030444175497431,0.8602500420462171,0.890800139747798,1.4826887254673045,0.8373012036232188,0.6080115836285465,0.7729675591114736,2.3631802750197357,2.1423188406362144,1.0916281443232791,2.414471902834861,1.2671078829549451,1.2691956573415804,1.1610704568902392,1.3830663999497665,0.5675720113627696,2.160841537839171,0.7633596396136457,1.7792208145721207,0.7950622996576036,2.2310085630411054,0.5960044663037712,0.9104888508852476,0.9446905556057206,2.0893181053921146,1.4855569572386012,1.1609914441224451,0.5702329160753695,0.6473338736988454,0.8019994774873431,1.0260513833988993,1.7940378451679113,1.9720948916168617,1.11113025418215,1.404576668265145,2.1357061426499317,1.954039539067119,2.253441247858885,1.1404406676967112,3.491007649650454,3.1984795838764875,2.959076593429788,2.872239048155488,3.2508241794310773,2.07908901000927,2.7939584658422825,2.5559495157443375,2.125238449783279,1.8749261915134725,2.898844461351669,3.885806152739409,2.839385002665656,2.0161778320071946,2.203946859921845,3.3862024918104447,3.5833329642579663,2.960239694843351,3.022030692600701,2.0359736121287204,2.425561890458778,3.289531399290662,2.120495366488533,2.4846715325397546,2.5838342856637517,1.9830604812827313,3.3093018378715713,2.2715985345737613,2.4392071611981367,3.6982637493846653,3.704390442306581,3.272961353457485,2.5769796154565254,3.0499595150722754,2.942160145728522,3.3129306669558867,2.2525259620663425,2.6400804041782138,2.1103185641495985,3.281638364019918,3.1824499120375855,3.5052579519821796,3.5678692921907773,3.4964562830800117,3.2171648493942366,3.2469706875691458,3.4155013322609538,3.5021719285532193,3.6421053335777565,3.0813693599975283,3.184372031688434,2.739743054959106,3.859010599315337,2.207913666353883,3.225040977931952,3.549821184617651,2.270806440860239,1.8675770046839775,3.250004968489874,2.8753663778956837,3.0637886385588726,2.1695768123344097,2.6782509308070974,3.3300868866584974,0.3737126030592583,0.49618373958611217,-0.5975825720666506,-0.3260319413941771,-0.5914275319880847,0.3864783419161464,-0.08514696128797378,-0.8732856447081333,-0.1078808439011509,0.8746032788903798,0.9537137240950497,0.07654092602474466,-0.3376970913768684,0.3139656670912412,0.2025380537544776,0.9036989034101216,-0.33137673033154924,-0.29410014540651963,-0.527215420496497,0.8808130220606174,-0.6466882066311488,0.348788956989273,-0.4850790934023757,-0.16692266708975267,-0.16729225813170184,-0.35269894431562004,-0.7517966491560447,-0.6113890973561198,-0.1638653647907486,-0.8119257703757652,0.5060311457817256,-1.0300667157171886,0.02253302398475872,0.604512270887626,-0.506816164927828,-0.38116082477104263,0.5156717794909714,-0.5216987900877312,0.8781981034961632,-1.0270804637067827,-0.6428612877408634,0.4551182501447083,-0.772626018521201,-0.22156560283042492,-0.33548949597432715,0.506536866112715,1.0560923490340663,0.16229192029374295,0.6020278318033538,0.3992080470916305,0.46938572354392816,0.04193308060994689,0.6520434657015383,-0.7269233248360002,0.16490693414553703,-0.7503572182949679,-0.7452645210762799,0.18200291057448564,-0.6773940435598027,0.651745649004663,-0.8426750613013804,0.01665222805278928,0.11442148831565975,-0.5885725571202413,-0.2120789488267727,-0.33603575241321826,0.9235164579715525,-0.061214004746991346,-0.5529230319426084,0.07292933042637317,0.31679274968560156,-0.44301691039348645,-0.23364878036378603,-0.11072607537780606,0.618676198710976,-1.0692465974990781,-1.0346263244309832,-0.7667871048100846,-0.3125705223983452,-0.33857555790488436,-0.24349399620040565,0.5116459687656549,0.042847101218413786,0.6058897478985199,-0.7975647800193322,0.19714528669841974,0.14262972476676564,-0.6581948086233046,0.5763844786003364,0.16171103874512724,0.6327627531100163,0.12893568731701488,0.5122777392457056,-0.832969495259883,-0.4681552750277746,0.5542052636234077,-0.04847704778019458,-0.3141182223579537,0.571725943875134,0.32914924345154284,-0.0612373371481621,-0.6560380170470319,-0.450521969325248,0.4597658267986731,0.21833479699813757,-1.0133374634126828,-0.6342131603131965,0.03661034484186062,-0.8659014606572318,-1.3899086671765728,-0.22174824052372452,-0.2808309374847939,-1.3297547692304834,-1.3468172621339278,-1.3873879704987344,-1.5283431516439774,-1.6301269275450145,-0.7365212467442561,-1.347654933454281,-0.3171161290826823,0.08978796750728835,-0.029140164608375763,0.6562817424801217,-0.26279045073674245,0.07402658755055658,-0.5971954123446102,0.8246002974717626,0.4651916935420468,-0.3341006971978828,-0.574550972244027,-0.3309704863571094,-0.12826245996785554,0.017551339220320383,0.05636745160666105,-1.4198489131234666,0.2611260376418032,-0.7206475611355189,-0.41080632912750653,-1.6498353334457418,-1.2068541188355877,-0.8621794930732074,-0.4271842090639467,-0.08593129303865699,-0.0953763301903249,-0.44228893340788444,-0.8376322984641817,-1.2028748683762285,-0.3908079792258355,-1.8751159310921592,-0.8385526787074241,-1.3914958168295637,-0.8946850823926662,-0.9041173693677634,-1.4350754245315656,-0.785784269070987,-0.5021802366076916,-0.16172520335342816,-0.12142502430386443,-0.33378587658750136,-0.6956268787465524,-0.5669869277420013,-0.5484239183371369,-0.9145064544303653,-0.11645413008738513,-1.1303059389694008,-1.8347528337399996,-1.5186019938923705,-1.450425348365433,-1.1944483553893042,-1.390713215545017,-0.5791123085941262,-0.6478440455813287,-0.4249734615931623,-1.983718368249047,-0.42935359416877855,-1.0303415613015934,-1.5780844727950227,-1.2511668652413455,-0.17791208194628785,-0.1535732790025325,-0.3834169288302523,-1.8816648885531906,-0.9315131109379541,-0.5697458531958125,-0.3830772573351265,-0.5302251006851698,-1.238076732341125,-0.36175799587095553,-1.3450990623995691,-0.5904783689132759,-0.08436312622228442,0.17035183235930076,-1.8156445908727987,-1.9263738523403873,-0.40392831550288566,-1.5295388406989996,-1.3454038753257833,-1.7861190522222972,-0.06769097104618209,-1.7587944250946976,-0.22468653566535413,-1.5011542757219931,-1.4298139192665587,-1.7790998731807557,-0.8709251088787995,-0.13924874704249232,-1.5997765103208779,-1.8058194099632512,-1.7234870807632816,-1.55724638360691,-0.2756191364997965,-0.5211098153710852,-1.2602644737732986,0.010581885324727985,-0.08345524268241133,-0.1704899107087297,-0.4449937609588576,-1.1361453163471942,-0.8259461088783158,-0.26340249296104884,-1.85666009118086,-1.8953987523090923,-1.2764414190494209,-1.7333991992696538,-1.4998164598733434,-1.9553037541128002,-0.290664016997845,-0.1449435935142493,-0.4566014099722422,-1.6727711713212852,-0.5286102049226452,-1.5417236062041184,-1.102733677721973,-0.41891553507260065,-1.2271309567589177,-1.5301790731496558,-1.3196921905845116,-1.5996648884652187,-0.19795874952688566,-0.1054802952583031,-0.9583091883510917,-1.083350372998547,-0.13073405990959722,-0.8808814538038159,-1.380334366213424,-0.3810712025134858,-1.3860163125718064,-0.8807797332353363,-0.11486956211569635,-0.10658806482310243,-0.7349998423303542,-0.4514966140055764,-0.341140483855765,-1.5216866189378226,-1.1507859093558181,-1.6791940426961722,-0.5723729659703831,-2.2650891161490163,-1.9993039546495597,-2.3668320940516008,-2.0910760540509274,-1.93241127493692,-2.1271247796138595,-0.6739035432143974,-1.641114208341109,-0.5728692941349028,-0.9426322352341887,-0.6500654109272967,-1.8057487619385586,-1.608200099575496,-2.305436451765806,-0.9915677217542822,-2.338321013236008,-1.122240296944837,-0.68320415934976,-1.3851063894155287,-0.6725893947017372,-1.137677819558029,-1.0301722371086763,-1.3227020117250712,-1.6864062898993428,-1.2239375626351159,-1.4202376678863509,-0.9643921861311027,-1.3257491983714376,-0.5565560998932152,-0.8689936380394628,-2.2271259841666127,-0.9556006643703927,-1.3520480820181515,-1.8182305979018045,-1.6020078547566423,-1.4190224504199582,-1.860346184157541,-1.402040940144238,-1.8149473372190748,-1.131701761855803,-0.8660983919667974,-1.1583374231441683,-1.353542678576034,-1.9648808116555883,-1.0188482820309173,-1.3237602118553065,-1.8463842700048192,-1.2669962932886325,-1.7150337836866665,-2.1567365048955507,-1.3470381297813419,-2.298290820116535,-1.2112105122221053,-1.8339533196506708,-2.0646982245763406,-0.9835281434584564,-2.0372335250849667,-2.160474537796958,-0.8185590062404524,-2.264976411478594,-0.6647490102397031,-2.082291668101596,-2.3171813390767277,-3.0843417035681093,-3.1020187949562246,-2.481895589997135,-2.7799361164715637,-2.3708335917213086,-3.474719064746021,-3.2055304236473536,-2.6658472787158507,-2.7848265263863428,-3.435798671597829,-3.0473859250619912,-2.899118769511851,-3.677071928374866,-2.549101646091428,-3.252840226098664,-3.3738764341057177,-2.1829251517200188,-2.933293800785048,-3.1908693859215633,-3.048381154410713,-3.06623796941657,-2.367530961517077,-3.057481184378795,-2.129883816818565,-3.6578470723955165,-2.930358073394219,-3.5808007795753265,-2.3913340131328775,-3.30768911886848,-2.076707156911316,-2.4198290605048642,-3.002565337816951,-3.367099943663853,-3.676706775891177,-3.5283317289466005,-2.1793103879019906,-3.7058321261333367,-1.8805559752491214,-3.455586751025898,-2.4354556532885487,-3.477774454338538,-1.9377927449538512,-2.6103785033238878,-3.437955917500485,-3.4821866799709396,-3.0232179865325994,-2.1621055727225946,-3.543205606304786,-2.594159977226256,-2.994147026311124,-1.9056944692612363,-2.911564430195016,-3.7824296241302457,-3.7597027205653046,-3.46808047680973,-3.128716742671084,-2.0155069852449654,-3.4711145497717935,-2.7670989694930435,-3.471390418409927,-3.3872327786055285,-3.5118901353994545,-1.7343882643016484,-2.080561298906705,0.262080108785392,-0.9044491336227919,-0.7442496394926834,0.21106982711889524,0.19952126910161067,0.09465306931953371,0.05361767660652101,0.46475817033040745,-0.7754370439606146,0.22856361172745632,-0.2959983572533708,-0.48551854758850044,0.45052726298563933,-0.4746213720139609,-0.9781954937706486,0.20797503431047856,-0.6685552925629348,0.6951006704047972,-0.049429474923388936,-0.3571283101558167,0.5751753358011495,-0.9018192565907404,-0.6360976160969359,-0.24432382583221288,-0.036232681014389916,-0.5037080621441772,-0.4278384934410985,0.7836484516400747,0.3122198789605977,-0.45416614803049404,0.08224604513574756,-0.3661646637510054,0.25214646133848884,0.717731568926082,0.5486327470859189,-0.6215043968635064,-0.38531367957067536,0.8390575258167724,0.10506992267984851,-0.5309373108436883,-0.5213493431885377,-0.3932113174753506,-0.2692091820162004,-0.25921973822977656,-0.897265529271834,-0.13187724653826147,-0.4166748524827007,0.9164559484158843,0.6700804521017351,0.6018707331153257,0.5182897114986913,-0.6395594155165253,0.17987845688879986,0.49103524632248946,-0.4008796415271403,0.7539984213310167,0.7394191051701436,1.0616122191263244,0.34663430493421343,0.6051313944010583,0.7870351843808558,0.14179502142556077,0.40096125046539643,0.8726601798297405];
  this.h1[3].weights = [-0.4282780744689578,0.010213683491688386,-0.03794820302427171,0.20830378007625105,0.9740946564211792,0.7707737727835817,0.47288432950476933,-0.7469056860626675,-0.985175690989649,-1.3149979501908726,0.3264924362445812,-1.3082431062614055,-0.12820578571734498,-0.4656157400853721,0.33129567133057675,0.32784384331093036,-1.1509524188229519,0.4575173215502908,0.5722173815897486,-0.7189833624194961,-0.7283194007615794,0.054185347079447437,0.25650654513215626,-0.31456685087159886,-0.04406153741606355,-1.180191653412788,-0.20347580462476555,0.5308831031089085,0.3323768343442592,0.0398609947992137,-0.04521508655780518,-0.25025503083117473,-0.6890281320886312,-0.45484382719285527,-0.6478828944257606,0.6562121130159917,0.6940028982740343,-0.07172169318263422,-0.35723507573874774,-0.7129105964140894,-0.024827241245971195,-0.8519785024382434,0.6370301975238563,-0.062181171290677704,-1.0568196247809434,-0.3370103986764204,-0.4411537238971161,0.42289488548708765,0.40896967127727885,-0.16145461640549566,0.6522422304090111,-1.0254055404299376,0.41706742493591653,0.44972089908056007,-0.4207152319661959,0.6927245448063873,-0.7913845973659379,-0.7327242365406677,0.6841578326115161,0.9026687202811083,0.63527058556889,-0.2462169503495173,-0.03993444537524571,0.503293241328719,0.03628973573932063,-1.1258547406159076,0.02004018684494857,-0.7568344306968364,-1.1739395542440716,-0.3210050085852334,0.5441687838628521,-0.05082811023320575,-0.8574225641760642,-1.3074118239843604,-0.5432354543109038,-1.1084392791485507,-1.0561522597261919,-0.859155861475317,-1.4351650523419637,-1.0176212236535622,-0.12757560123903983,-1.571346156788001,-0.33750183634805075,-0.086200184409812,-1.3884722446368936,-0.9327102381781002,-0.6433069262943178,-0.5782887376834367,-1.5012662180969487,-0.7118744580121937,-1.575537761609678,-1.133897246927482,-0.09473537286787577,-1.0224617226301913,-1.5023008528413082,0.23080800581663455,-1.038004338190998,-0.7775624679854715,-1.1572468885221505,-0.5977494513608751,-0.23418117767446828,-0.388801243902635,-1.2505320659953687,-1.3911718492281648,-0.2765732706244087,-0.3607227676211765,-1.3373358613267126,0.15095050772729798,-0.5606828099274707,-1.2902786041673597,0.3177371761608515,-0.4209370397910366,-1.1061527109592422,-0.3886860211335586,-0.7955560460072015,-1.5237469412538804,-1.344537181931995,-0.7484383320602678,-0.32315728808700156,0.21635331721993822,-1.3495104752087448,-1.2142468266644766,-0.5813945645365737,-0.24207096562619534,-1.1350041800105157,-0.1570653213749628,-0.9851599128272249,-0.3968834517750865,-0.427167949356791,0.3393465509034931,0.08160585252808199,-0.01718511063961298,-1.445877113316912,-0.576998290279624,0.21774156101512973,0.3544576077264503,-0.8669216262206115,-0.7188572872526844,0.3076787655326855,-1.1081066441710428,0.2675919014337564,-0.9271774748673,-0.42634276294469153,-0.8291589370209029,-1.1637728634020983,0.07835764623661932,-0.8851028339189876,-1.0364985028323537,-0.8057652779972662,-0.8234236592797433,-1.5561164381324135,-0.2611969888254063,-1.4489328632872014,-1.3569204834573136,-0.8121566186732537,-0.06351695156159477,-1.0529208994640848,-0.7059670007456699,-0.6916452031321128,-1.5012916013094564,-1.513975720853764,-0.9480057931327581,-1.264271717868529,-1.2386949666073992,-0.2779776705075291,0.028804282353440815,-0.5531581267818728,-0.4964759404866259,-0.66568617154611,-1.1261787945986717,-0.32323056571170244,0.21183460085840036,-0.9996539626962756,-0.4978293925760782,-0.3623706490222151,0.19002463131443245,-0.6810393560231105,-0.4016346720807575,-0.6624106262161144,-1.4425734260154024,-0.5445924272139951,0.027190068210122282,-1.5786468316989628,-0.21640393507210215,-0.12395487171249181,-1.187849742973761,-0.31087430655467685,-0.08215476901961331,-0.06272137060519922,-0.5499794752924257,-0.7446403567552969,-0.41942930357203656,-0.1788478167919393,-1.679584831677935,-0.42611577690707336,-1.1466513660446476,-1.161630536164104,-1.5782032092249698,-0.2559088649557939,-1.6561073791179952,-1.2867928272726155,-1.2701592165420297,-1.4994370816022284,-1.7068098123967996,-1.1245395230155908,-0.8513442085213245,-1.2416279908873713,-0.7263982315102708,-0.11369602743217855,-0.28237573343262984,-1.1250818503617352,-0.014483514969495345,-1.8481439730308113,-1.0963575350659431,0.009121437739070464,0.0027216311527169575,-1.6865695771081686,-1.7467421629606483,-0.43185387307481093,-1.372795151229503,-0.3048405177964955,-0.8917430719545821,-1.5152203308336452,-1.3252420505450166,0.06625843610544675,-0.5960745574028772,-1.1412151737921292,-1.1896348425899004,-0.29831980352112636,-1.6312478374742694,-1.5004363758402084,-1.6308504533912833,-1.180516315062015,-1.8061477692579606,-0.9546609856406424,-0.47047756249138023,-1.3892083551139174,-0.4123735635770466,-1.4420881856816241,0.06472074987648364,-1.1307929056766428,-1.1008778019097645,-1.226927329313951,-0.07598098294132076,-1.1661753346804304,-1.422977018433564,-1.2641693906975533,-0.45012777304423196,-1.5692286559308297,-1.4728564283126417,-0.37911278672954596,-1.224292182347329,-0.5846964220765722,-0.42517742358691807,-0.2535648187057128,-0.5254565890911654,-2.361630104546876,-2.151854421442173,-1.1746334900893372,-2.3614022668617505,-0.8819879534382941,-1.4072778665683423,-1.2462612929017143,-2.476749352566265,-2.640321434100203,-1.5693100957725166,-1.1422932531260819,-1.434747983352971,-1.7930018801909684,-1.5230440665818663,-2.8506741277036465,-0.8229897405233002,-2.1378756330722855,-1.887431943277873,-2.2845686675430903,-1.8975020474393798,-2.4930342582970626,-1.7690128518659656,-2.543414626630283,-2.718143970213729,-1.1755779995953384,-2.1274405174073427,-2.6295921559614177,-1.8155412670303372,-0.9953773655219542,-1.283813345115069,-2.688824183445792,-2.080363226897575,-0.90260779535535,-1.3358996811760149,-1.401072605417044,-2.2713978001403006,-0.9826390387707168,-1.2505600772981817,-1.9951966284230247,-1.816232550115577,-1.9296871760141583,-1.6695695930805203,-1.3344845517403843,-1.995918843152964,-2.3839092398809933,-1.7023447393752018,-2.671432170872258,-0.9056317985943361,-2.018420457060684,-0.7622974969182125,-2.2220537589231673,-1.8836615191984005,-1.3621665369924023,-1.8973445218130296,-1.6763083333260256,-2.1733696328862475,-0.8843834371304037,-1.5790318834604296,-1.2948230830582321,-1.8908191707142743,-2.0411482641222287,-1.2221559231776515,-1.9892637336023018,-2.3957566245498736,0.8356549107152356,0.45342654111752767,0.28429658853696294,0.08938803627380808,-0.015293804760454097,0.6045306333908033,0.28415024898126656,0.4650194488401402,-0.6440721788688754,-0.5964251188011375,-0.6815491813041623,0.2585494298978005,-0.8334079200492,-0.35894727310523267,-0.2744965748051126,-0.1987077954836965,-0.2412740925972672,0.6379954022968677,0.14007823492621976,-0.8216095849459645,0.6615511325844263,0.7884184482256371,0.7144811937148733,-0.2930954539630067,0.021329367907231226,-0.5226793387636376,-0.6828831239460116,0.5851807874322268,0.2778963660976474,0.275303919233021,-0.3116793613265247,0.029738820573851937,0.780900041460748,0.8730691659060964,-0.3569935917469069,-0.8997596703239239,0.7431730475211213,-0.0011367154697004183,-0.6135067102053654,0.9237098423976778,0.2647454072871427,-0.7877346992969854,-0.6170640208553654,0.8090644082805252,-0.21614052011273052,0.8139516012239355,-0.0464823832358225,-1.008655107819464,0.049405593302744744,0.4596302792109074,0.4051369020046685,-0.9028060467673729,-0.061009461795487246,0.11938612638519278,-0.46805785921150306,-0.23395280949774042,-0.4178441423476919,0.3459299009554454,-0.8241377241590835,-0.3694250703402115,0.7895360730163643,-0.4466252215465789,0.4543680417374053,0.8829486400524157,0.6316179213127375,-0.030887002296430488,0.9602425901478417,0.8509264979864528,-0.8432300071469392,0.3935225705087677,0.45496132639356723,-0.8397035329607756,-0.7668549411418191,-0.6248519577017785,-0.1472237412238977,-0.012831487142954366,0.01318783144385679,0.5942828501486219,0.23877509822821516,-0.20382062907436238,-0.1656218968535557,-0.5371841177534493,-0.3851973655124979,0.8817893442854875,0.06478272773211276,0.7287386170261162,-0.20089102407518247,0.37198341145811264,0.38705378545318775,0.33248513307758604,0.8315996828030329,-0.8516863732355128,-0.2450283079915808,-0.5814052955930042,0.9516970415042022,-0.2888240280709481,0.5733458722011114,0.6499181832366028,0.06988984575788786,-0.6722467727637194,0.5803017721816667,-0.32980134979147335,-0.5743501986866248,-0.35836104377374634,1.007276327199371,1.232221735755844,0.6771064970357479,0.774630272068834,1.045117864324855,0.5378194762999343,1.0154690035219092,1.045962593974439,-0.364287841941319,-0.17350763464100577,0.5810052187014778,1.341049538284454,-0.3505661127799589,0.6271893251223357,1.4072209602960413,1.1364152737210773,-0.3889345116959144,-0.17058898097321462,0.17858808001136994,0.23433265188657604,0.34307518675818915,0.3315977122645051,-0.22980943037802115,0.5185926058513175,-0.016219018410216685,-0.17314605816140785,0.13086302979475392,0.20852037263360487,0.3506023131798876,0.7342305444835192,-0.17114971124570263,-0.293291929940742,0.5426078702882617,0.7290350839619866,0.9855532232356827,0.7757862662552764,0.4293193089603688,0.7518326577494343,0.5661425990546302,0.24775794073299742,0.18201260239987105,-0.0855032647546352,-0.4708028667125825,0.3975562468002923,0.06170785100889794,0.03763152048589126,0.43366375254287703,-0.037400327857554067,1.1761111928646026,0.4079656434253394,0.2071367879249466,0.272872763358358,1.2333979398969568,0.12040050763489184,0.33065998181707956,0.9152484295026923,1.2174177384804012,0.7296378231093068,0.043761754194062474,0.17200564614403627,-0.273144405593917,0.577862958985456,-0.21629967803828926,1.4791890766810534,0.9431634023098896,1.547189310731418,1.2357093769235026,1.5015904593820835,1.2739737473033397,0.12341439583200654,-0.10390597211917325,0.09327690717401768,-0.39783519098116477,0.5664276502164522,1.138856687561062,1.1968838977084928,0.28001735004223577,0.29517544793966927,-0.34194975541604045,0.4627725855188601,0.9316014334501728,1.0000979716804896,0.943171704324418,0.6693967527717841,1.1125092798427219,1.3955185922234714,0.3366446363769667,-0.32352365628693214,1.2972025326094148,-0.06629119005835016,0.6792712082860829,0.9571023642239876,1.2605035406455252,0.5394314448741006,0.3416327490715979,0.5431257030456363,0.7538410005848721,1.2465289266068134,0.7825501242401826,0.8459720473553615,0.3869973374075884,0.4519567160872726,0.0714805290554243,0.8253231322609974,0.760837619468894,0.7617789182688319,-0.08083429163227389,0.6586652646516264,1.0639126478623364,0.8950058760759168,1.5232004027538224,1.146870468017362,1.2406979897988464,0.9721825465080266,1.5643359104957273,0.05764290818202911,0.5455340667622809,0.7292652264773433,0.9396639406061513,-0.33410801736648266,0.6721097664060899,0.5870494524968324,1.3443998549116198,0.4736663090138699,1.216098129451761,1.5505095714790949,-0.3532671539247071,1.0974194218664524,0.5547937071055515,1.0438430055786183,0.24886227442223371,0.5378099849594093,0.9580641363396255,0.389752889231254,0.772474864191873,1.2934639605441183,1.332774870024075,0.44650591777447657,1.2708454336463135,-0.34199940484323815,1.1620908582808709,0.9348355146802414,1.5358101236543458,0.774299865442177,-0.09876146257707877,0.4453357046960353,1.0887154372493117,0.42641962038355824,1.569414771726169,0.9880754747666537,0.07121459465606574,-0.16694290183677793,1.3113846445493313,0.7981021467445438,1.2975264805396012,1.1851251793128432,0.6909501642233459,0.24836596542515427,0.9435834083046034,0.018993102616686984,0.4430445272631126,0.8081333287434956,0.9355592943828975,-0.04430539697054499,0.2625279579707854,1.283392227648245,1.5291948523891579,-0.03883266039490097,1.2154456542479042,1.049738617567034,0.11425440904040386,0.41558098399159155,0.07807194621505244,1.8285405020967282,0.5722592988555274,1.1424232473519595,0.12441903064020358,1.3939769776000752,1.4569893442638946,0.40957256076517373,0.884788014938223,0.6023193609545372,0.944208066579392,0.07986725750987862,1.1533813113030367,0.16318944977165536,1.7841894184481935,1.788094455006485,0.7078244830282067,0.4645863275992782,0.4202164800091453,0.9127613142521593,0.9199715147455452,0.9190971298265951,1.136182631809636,1.3500417429030258,0.07243017106847595,0.5098135935863016,0.4180620843298724,1.7512304053350036,1.0293440876331155,0.5752351163016267,0.7186099926951703,1.1237644960095055,0.5221906040451519,0.9914639978185177,1.2076086581009886,1.7862550018004069,0.8487237740029492,1.7103700149795598,-0.006737799032041531,0.14810311139106133,1.0592691851702403,0.8169572207740983,1.5583037375957989,0.44820355449112526,2.5014892082457703,1.0810652901079172,1.8552393550680646,1.407705654894674,2.0052247091411743,1.173947238427334,1.19135183758962,1.445132346462382,2.5821053553639466,2.6021785630256558,2.181533505002321,1.1707921686666762,1.1260194810839743,1.2083921019923554,1.889674197981929,1.1927426997438015,1.4935400862767583,1.3787524738199681,1.0469917193891916,0.9904037534784598,1.81615139554078,2.264644673452292,2.516549783068881,1.878024083779225,0.7706143311478388,2.214069582396733,2.6624620580282765,0.8532253145152229,2.6881251895551737,1.0499396272937402,1.3029106248076812,1.5213893796030296,1.8172490940696508,1.5181852701627934,1.8996810884677908,2.041614642243709,2.239574114924448,1.8241404466242046,1.1802998356600816,1.479732396701232,1.7957477411704144,2.2108306906861044,1.7848029437161406,1.5486052730007687,1.4736253744938184,2.4580438324881375,2.220250555154755,0.9968755884452963,2.401974576948901,1.6566480145767524,2.465416716653848,1.8568064862631133,0.8367260793616385,2.0924675553833794,2.178212022084211,2.6339717777925666,0.8554076698447111,1.6485635019205818,1.963903715690618,1.647698157092366,2.4552416463832776,0.8319804938905372,2.0850464611366535,2.09341121019654,-0.18701411941283255,0.4401967559609591,-0.463267408319389,0.7536838841739771,0.030204626629474755,-0.2755785434933291,0.5578045699442976,0.2562085232946047,0.47365198864570746,-0.10589684448802317,-0.9584030554264411,-0.9726645201869225,0.8861919939666724,0.751860236659442,0.877561441672588,-0.801912389206153,-0.32508235583023004,0.705258002085797,0.43651667452502574,-0.04254362316702405,0.7675334210580841,0.7685403836881245,0.7166465795985687,0.42969103465031944,0.8319853964647005,0.8842148743693625,-0.8900582590428274,-0.22731168052422782,-0.2471221664982998,0.005545191688384113,-0.3210238925406347,-0.14322352352915893,0.377001906945968,0.49032955742271617,0.9542402940326609,0.7230622612503755,-0.6523903809772881,-0.6083621881865027,-0.6420265660060297,0.5375273050609141,0.7464905706050662,0.3714997032637176,0.21700522718753204,0.6548028983178518,0.4945015409772571,0.8451940992433573,0.8520828072964907,-0.22284431295423338,-0.10091258249996822,-0.2540576404983319,-0.7191030181010776,0.9168008224690636,0.1543170230749114,-0.42668467241032776,0.12406732942023167,-0.5961179853709424,0.13251853661510893,-0.3137711111445716,-0.801128480611853,0.6057329292752207,0.09904703320433036,-0.7491259271983066,0.5668555673463558,-0.06091576063947274];
  this.h1[4].weights = [-0.41131051958104203,-0.18233856135243798,0.5282365981778998,0.648270958855389,-0.7608303874917559,-0.2902291801357544,-0.10428900375581796,-0.7057626118515334,-2.7246240679043576,-3.0398273926266994,-3.065916211785171,-1.6967296285446014,-2.2703825309711347,-2.3179866180487805,-2.729904045087949,-2.974037200391498,-0.7358025847533118,-1.4046519818149807,-1.5460839088659422,-1.5242077878941636,-0.5217266134032994,-1.253903500916317,-2.1730122615589362,-0.7970110037393587,-0.7122799799439704,-0.3751155188537124,-0.7467199015504794,-1.552516052972486,-0.6819415045521716,-1.8002097094931127,-0.6344538940309731,-0.9424611053915786,0.036477689849069274,-0.816255688934624,-0.136829601464433,-0.31717853496525555,-0.605174589408425,-0.6210399192239608,-0.3833222480926952,-0.05098439999557152,-0.601911417623251,-0.725610994389265,-1.8753811799500784,0.07182830856460591,-1.1851982100157346,-0.8462967135530258,-0.5545124472741355,-1.0532869140779693,-0.4548827858224933,-0.8554019794391934,-0.8247194872049992,0.20286741671862454,-0.4095223598417625,-1.7925110281740606,-1.6830613383408268,-0.896043692334144,0.2892547848443363,-0.998348283225762,-0.8743577700623262,0.832284445566402,0.8162863430377425,-0.8489067390205678,-0.8686106391461941,0.5910596327214197,-2.631822525338695,-1.8999990624971959,-2.2732850471014894,-2.581055061767288,-1.7733214249640057,-2.0400148368672197,-2.909033873259122,-1.152544223901761,-1.9211464429728713,-3.1859015814471645,-2.593164318204472,-2.6580096621384888,-3.2998560315204646,-3.77342242426677,-2.6918063069138247,-2.258598000534356,-2.1097765355561298,-3.3924245761369587,-2.12526390608712,-2.9308568250051548,-3.64606313101931,-2.0615452544173745,-2.141920851308721,-1.8225213161164544,-1.9111162059574607,-2.2108180486158795,-3.9526441407749524,-3.3054345154256777,-2.792406098854349,-3.6780412763877433,-2.820020005357726,-3.4251428281269938,-2.0160905097735426,-3.13398116213398,-2.3477691575037505,-2.4004821480757608,-2.2784468406554805,-2.3169935653697986,-1.8153822438136629,-2.22334255446498,-2.555727493331396,-2.5202101177611027,-2.811293549927399,-3.6186639357047823,-2.555102686142453,-3.392002351910135,-2.157211012343878,-1.9949819148324017,-1.8347139847040899,-2.2277174159533413,-3.560027514271352,-2.716851660996841,-2.085807732764618,-3.051847169044128,-2.6357247756770312,-2.66139414369907,-2.083466462712966,-3.4099983056738057,-2.465050799076868,-2.271487503638333,-2.938095711093128,-2.7492059405356604,-2.782559706766841,-1.9914554621089133,-1.9080989595397868,-3.281049104671919,-3.403598877172106,-2.063237729074829,-3.298488472265028,-2.6040109295956144,-3.4152882882365287,-3.0916576273949024,-3.539237675807049,-2.3421757899429525,-2.422613756966491,-3.76362622593053,-3.6207683987819292,-2.880667195829371,-3.3003996854329296,-2.1403081999614026,-3.4079053320812513,-2.5478465027414905,-3.4644748484051733,-2.8731458708424795,-3.1982729728184798,-3.536663788397769,-3.087265852660029,-3.3322438389064972,-3.4313822845382433,-2.6086108766353577,-3.675410382029953,-3.822387536382274,-4.190922646274788,-3.884109335436471,-3.3837296708669897,-3.235270608323665,-3.685162761307349,-2.450724163500964,-3.6665987937667155,-2.2647278712318046,-3.712824293999113,-3.057594943521651,-2.899421133381833,-3.210259555926835,-3.5488889099349996,-2.9856864900799485,-2.2879984743562574,-3.828814954927656,-2.710738053849062,-3.5943092557092378,-2.324611870230981,-3.833911883937618,-3.4177094517458504,-3.571209030380663,-3.107757614628347,-3.550480601081693,-3.6937171413531416,-3.3835968144685182,-2.70672196922919,-2.575798540371151,-3.642225677221064,-3.014169745487479,-2.4717605856773552,-2.8397772824980656,-2.9758218771250053,-1.8744389967149777,-3.0961563375390933,-2.012841402158262,-4.666551284206477,-5.11799970309048,-4.727107383144148,-5.32282014929768,-4.946533060323008,-5.13818186520465,-5.133393340690262,-4.398906449667191,-5.307790875405188,-4.835305079489801,-4.92192720107108,-3.8384912958047432,-4.819886467420856,-4.7605836146029805,-5.173860444187504,-5.71587586172536,-4.055994507493906,-4.397730834549279,-5.614250057958727,-4.597257851695603,-3.7985472475208133,-5.21166047620832,-5.006880666936933,-4.741042879199329,-4.765123519599295,-3.8211512915316805,-5.662340222821158,-5.253316129944063,-5.116122846239142,-4.893738044869038,-5.574356240224478,-3.706438812996144,-3.635006442585178,-4.062881284334446,-5.471233450945212,-4.134939585306367,-5.420071205074531,-4.8465385509611485,-4.075433070239569,-4.344842836984592,-5.208088321391371,-4.321490982366495,-4.535833337773395,-4.296096449022658,-3.714848141959433,-5.2997364200270365,-4.7192064292542515,-4.475419489488837,-5.212673047486313,-3.986623015091097,-5.159966768127288,-4.339362650660751,-4.846841397921765,-5.334509658977808,-3.9107973294173797,-4.073344674119887,-5.114136729880498,-4.257140528512051,-5.1033050271608,-4.1053523474873845,-4.600442558137919,-3.855210140197136,-5.0576154496014984,-4.590855020709734,-8.485720400547175,-8.929535349694797,-8.345058997648895,-9.696579027875098,-10.165361321016674,-9.687917901189156,-8.524809954159764,-9.163272382459736,-8.614780035047186,-9.51919449042768,-8.52712630593723,-9.006987240622427,-9.296630765663275,-8.669648721344412,-8.59281135085018,-9.063497369235659,-8.84822678723933,-8.307944549502455,-8.899250140649588,-9.194604250083797,-10.151446424184162,-8.91604877353701,-9.692781471606033,-9.383345014937378,-8.624519259237873,-8.752841013218122,-8.701595337536371,-9.316796555106182,-9.321933528548115,-8.663749108120657,-8.277909484158796,-9.255819004216354,-9.700138577718876,-9.062589034885265,-8.934268559072917,-9.869859830622836,-10.05756695122255,-10.186020492117514,-9.07744477186258,-8.866721965346029,-9.125148061623866,-8.473759378070076,-8.431277306925175,-8.88737864383954,-8.34122622747256,-8.48508018590113,-8.991057689867025,-9.850581434667424,-8.901551119193089,-8.862657154206556,-9.431311894112351,-8.329953537080648,-8.780919715519849,-9.753669885893327,-9.084106371739153,-8.11661187004211,-9.063902165471836,-8.587179436288443,-9.248521817428161,-9.48676985530045,-8.052692056006427,-9.391237842855714,-8.986597930039494,-8.506857659500774,0.02709463702179308,0.4477678513127388,0.16085544838262333,-0.3466712358960362,-0.3350740462920987,-0.5630235745721742,-1.1984243883554406,-0.8142879716294511,-0.5791136596212196,-0.33621356568269467,0.06848395131476616,-0.6656213718918801,0.04229544509497475,0.5113605147585837,0.45553142787364126,-0.9258890297232677,0.5583827106923386,0.33300540992201105,-0.7871836143040323,-0.6842111392038399,-0.3719849882343048,-1.352696827074893,-0.38806433460081674,-1.2333345507269962,-0.06755560502626934,-0.7597420235352398,-0.7858720029161798,-0.7522736428402469,0.017450185529547482,-1.0677985873033267,0.2076349032889256,-0.26299514247333766,-0.37269326770421285,-0.526737902597112,0.12745496780391474,0.03285035828924642,0.46645951404836683,0.38969279167328635,-0.6706906188875902,-0.1415991135441617,0.5399063793525998,0.0733842229727767,-0.6365754762826928,-0.9886665500293323,-0.9074794679126459,-0.41760489742300977,0.6972443546720356,0.1487570183494526,0.6518161305192163,-0.008617127476922577,0.010157152090122497,-0.3020731683040121,-0.5624299596796651,-0.10328625381338011,-0.7112941580813105,-0.9504581508201875,-0.6484310858718269,0.5415367513760624,0.21699819308125934,-0.05425164744282421,-0.49133581638784013,0.7639769813653445,0.3486929252333654,0.3791115988410617,0.4869708444351315,0.9693405311786147,0.9329487580568281,0.5731803794786972,0.8824128646151101,-0.6078483950222324,-0.4946325994701244,-0.22115848849065278,1.2778817483909763,0.5870221637064403,0.2505826640965414,0.3140496714400697,-0.10986980589885917,0.9785102251033945,1.281905902615122,1.3400325959148152,0.6822350591857177,0.5547033314695651,0.8275329279291733,0.660312676828508,1.537682773916959,1.0146422823454142,1.3810605358997634,1.3140471048956257,1.261198799603605,1.23399607716561,1.3512161493244776,1.4151153803566379,1.595918248234965,0.9319609169393788,1.3911823032838213,0.44578523534543785,1.0234931174165,1.4280426703105362,0.2733853963457132,0.3952636272868651,1.4978780454741683,0.29548647283396146,0.30157494027681025,1.6478697342131916,1.801076628334439,0.79695104543189,1.744487702454918,0.7302569983007393,0.4568313401079779,0.620288984362252,1.8719822901296326,1.0091790217151406,2.4414318801800556,2.6950719915495442,1.82549444284618,2.0362200011518636,1.7278200238885986,2.1079778405012317,2.312238368733878,2.407223033617265,0.10858500386969405,-0.4900608928168757,0.07520157565841856,-0.38873707610715424,-0.12643750728808767,0.8139140100810938,0.038159611738947774,-0.21616887245685135,1.850316184466709,3.282394126333029,1.9481395558867343,2.2584489853911096,3.5445659319445997,1.8081086407250184,2.0458569238571087,2.6251172229705353,2.5329505293698173,2.3993623985554304,2.635847221289507,3.1368080514947163,2.171345799324772,2.8187110106490114,3.169002167327802,2.3787235064710415,2.7097326272129285,1.9693022239494469,2.4860619376074053,3.4006953173595087,3.305801275177234,3.441361246713447,2.722092975341628,2.6475063144364257,3.344886708837338,2.925838940930559,3.183289107050349,3.554973429432545,2.998219840027991,2.694162016496317,2.3546580447018357,2.921840108308365,2.040572775761684,2.721380969340725,3.3376984982832494,3.629683739706648,3.6871110806347973,3.807438508605328,2.264571183292536,3.131246388028946,3.0164085381810257,2.448866054643205,3.406374223197589,3.007059335583176,3.40069593912736,2.954133929538028,3.437429104305252,2.2048546689804938,1.7588551946059248,2.638612516597745,2.839431454086733,3.262646544800445,3.481009119153808,2.036899644513894,3.136291242050163,1.7353978232202427,2.145031412874544,1.816884776735036,2.553558372208793,3.0611649345193004,1.9073629948866193,2.432195802783863,3.170460256914356,1.8365365148183626,3.2627186741213556,3.0080161282903406,3.0196738813028827,3.3862794020270623,2.1552673439034513,2.414912531351979,2.949508974003148,3.06586934013369,3.267989054324232,2.755697874877801,3.387395655729235,2.9235524075361914,2.5542156569097436,2.491471191125337,3.9647030308301483,2.256671100652511,3.4179170235661656,2.406238079677357,3.1214723319734192,2.643197198541745,3.781683001583641,3.017785988160966,3.6163729502450646,2.9317182230182914,2.9548627753283485,2.1848718227131747,3.661773146106361,3.7978357680500463,2.239316820427292,2.2539955939618417,1.8850742259620048,3.685179974722272,3.296707268077936,2.585188056219362,2.7877091544418553,2.9128376790650754,2.9086348333657432,2.776338734843519,3.3906029266535884,2.99331183664658,2.6029935717029646,3.3423380129933093,3.532786313657633,2.5014732890882474,2.2942629023436885,2.9573238133404027,3.1637141022725235,3.3742918347348647,2.6737164469390797,3.3778975182809985,2.2307731298573805,2.9165758123238206,3.440459357621368,2.662139150705256,2.232472017738651,3.242165229320327,2.703639420682495,3.657511083361823,2.860791279850151,2.827616041549327,2.915427757665004,2.9624879830322826,2.73177242413855,2.352251833173528,3.561743454788327,4.822067313426444,4.0024822836950245,3.9774504568717104,4.345690404288115,5.32569239885943,3.8159533844472455,3.9297917321017706,5.3638944272271285,4.302014087278089,5.3802814154064915,4.126342138794419,3.8510395240903694,4.477082456091878,3.6752825225621275,5.357281748625744,3.9434473652260995,5.076554515930129,4.756283119349464,4.489992598986947,4.083937916725834,3.9752443017017676,5.421716481595663,4.556862908019037,5.33135097235676,4.038726351779168,4.2927613758111445,4.769747728562015,5.291489663423471,5.3260708295316626,3.939115996642564,4.865407846944021,4.071872347823458,4.118745848173455,5.207387391303164,5.126554284040348,4.361026954281411,5.008667154094202,5.012428854570086,4.319262933839777,4.778680305298331,4.928437125909821,4.834226965343281,5.275990613983308,5.50330622919572,3.885869944824308,5.497960766703828,4.637194164564694,5.26638829673585,4.789243284209892,4.476587245851922,5.05419221621428,4.182408399226703,4.805918868675357,4.729540449754993,4.73864469010094,4.958241046679233,5.312128058841091,5.491880838402776,4.973579854491036,4.782207214443748,5.501502987984869,4.329082825521169,5.409229761158698,9.090679270761827,7.972363530148839,8.570081227768572,8.253727695201723,8.63717584971211,9.32865756855925,9.090238395530436,9.220940905506788,7.926503803019607,8.023495597520713,8.728174703749836,9.488915500720168,9.057476343139962,9.692489134818182,8.19368821669199,8.00783399201264,9.511776663288275,8.489079605864182,8.712668091683033,8.880213047621229,9.540320493773937,8.515922685775159,9.047401282333107,9.412930685977761,9.62852838277522,9.26997258435084,9.314952987591115,8.93098189638452,8.915531192511542,9.130558265476099,8.808488299835485,8.625981847697114,8.889847966715113,9.283513135546759,8.747900899311514,9.929744625787922,8.972494553089664,9.704585311775874,8.677880903377664,8.811400547994147,9.204262258750742,9.528701778412016,9.503562854833623,8.803677102861402,9.286535691873953,9.844997104740207,8.62945327869607,9.068399964405165,8.744696925319671,9.447606755148227,9.053054581966308,8.608934056209794,8.521680001897469,9.821889644461898,9.39933403948394,9.84044313343633,8.457933924353137,8.148381430447486,8.29306308736712,9.172762983562338,8.899160517671621,8.54872259957805,9.443087815798936,8.243456479475292,0.40755069231764873,0.15252303060320682,-0.5648977648414872,0.45120889196994135,-0.05498179903372679,-0.1678202598091156,-0.40497439238738253,-0.7553382463624164,-1.1346612528369553,-0.6227482187473086,-0.39060694071862156,-0.9546666890044296,-0.7644060399371412,0.3153043734434614,-1.0197767404776907,-0.9653106958378559,-0.45876502024259297,-0.42970564290248153,-0.43892229174669606,-0.03350145877877306,-0.24678660498196328,-0.5594860398432854,0.3698857855603451,0.18553536688784036,-0.7052993766665412,-0.6873428334761785,0.779210546036102,-0.5456227675566429,0.4257311174661677,0.8839599789071552,-0.4587689424953198,0.14886904730513514,0.399978918629785,0.06183533189310934,-0.6384520773639948,0.10222577104320031,-0.24548333373455247,-0.11619162117645178,0.18142609643454205,0.40609869469891025,0.40729425570422284,-0.27539445392597717,0.4013069570337385,0.38571585068218744,0.1983817950015333,0.8148978565859475,0.3177785621446123,-0.8570671922212674,0.43800735278165226,-0.321939315639061,0.4720734859543707,-1.0462098794610994,0.5647454565177786,0.0880074595100648,-0.39512566556514334,-0.04511322871346998,-0.4762849966519794,-1.1374174459548536,0.23745239176808733,-0.7228830475191953,0.2600712572369346,-0.31155355362328463,-0.3509336277692489,0.3956780694913099];
  this.h1[5].weights = [-0.7012310238092403,0.07841123804172101,-0.7170578166831683,0.4005396640665011,-0.11234977196227991,-0.7273769674382997,-0.08943339440676912,0.36055874108159447,-1.3330960530269271,-1.8496019122490859,-1.8234888351196008,-1.3186065116503758,-1.5570481272352148,-0.40746349318454034,-1.8494294449656674,-1.8167371356881954,-0.3415596962261226,-0.49024679215448935,0.24863046956750892,-1.2571893941239098,-1.0755869348845597,-0.021189871530830268,-1.2149528572249602,-1.2880867698607754,-0.13214292234953906,-0.5554889534144289,0.49811493265105594,-0.2314765832367761,0.424418127500965,0.30923832007432506,0.412419641120146,0.47001496160934436,-1.017657979723857,-0.9903590039819661,-0.8581863165724074,-0.5174134775757395,-0.5116792531241252,0.4357006485118688,0.1904248208915248,0.5820805608270314,-0.8458251445071422,-0.4698783945791374,0.6030511504582372,-0.4616238319105849,-0.8077472504530528,0.09918863260436425,-1.086861080043332,-0.9244613677226879,-0.27334600754143284,-0.7654046068482107,-0.9632366597286671,0.008220753977597178,-0.22485660266211208,0.27758387483741825,0.37510885146714373,-0.43623514083433107,0.5354932156561429,0.9870806569310164,-0.24235836214992945,0.6736560543972394,0.6026900968448032,0.3251044028571459,0.6703616841393298,0.22721335410463217,0.032224862050659414,-0.7733867237417082,-1.8290112580327875,-0.654147147959029,-1.091568077208693,-1.3948246836590004,-0.9449479424363066,-1.1382962592509673,-1.3528881700463855,-0.6036441440662461,-1.7534199215496107,-1.7996225453085286,-0.5384835451961547,-0.18427926657193253,-0.35531345350700916,-1.0271183053678408,-1.7495944978565285,-0.4984431454500981,-1.4415752513055096,-1.5949168469792896,-1.8723752991110874,-1.1340258721485899,-1.3677675925683044,-1.7733977512390704,-1.665008465521024,-0.40244461864272796,-0.8367539254250743,-1.3786547160062113,-0.17856768737613188,-1.4699529144622139,-0.32601593047217103,-1.8758305688020962,-0.0005737964667832532,-1.3748768014915784,-1.8075711416496472,-0.6253125708737783,-1.5158640862463315,-0.8896958271075284,-1.3609835261453123,-0.8334309533740359,-0.11064496810522235,-1.0333257815933226,-1.1655701440214583,-0.47556428582088184,-0.5014894346223618,-1.7720471981491557,-0.789633292101351,-1.8749490899137158,-0.08910248502263245,-1.6970827212857849,-0.7433225283167711,-1.4972221021828065,-0.2467356439641235,-1.6151210990519058,-1.7070461080135257,-0.4796141376863665,-1.0219998178270038,-0.5550136302291213,-1.7271360051294067,-1.76658940846936,-1.6213576794250246,-0.606164140049209,-0.08832438893354608,-1.198281508281602,-0.11007320972113802,-0.6050267158592656,-1.8273022298277368,-1.4811718580206614,-1.586094417542998,-1.5076948467445555,-0.5104129476009173,-0.887328543496111,-0.668604443016461,-0.6761286351927729,-0.9315481884941709,-0.7827361584671952,-1.0683132468997725,-0.0444420669314847,-1.5338095474068514,-0.5715977220496333,-1.1212126534021234,-1.6342737698847227,-1.7984822568966679,-0.5807420256177461,-0.6711554306603601,-1.8684951258165203,-0.5670315412850769,-0.6354983369722488,-0.8761554922060445,-0.19318620099296732,-0.10280728130809338,-0.6950224051274839,-1.0890664586366674,-0.5233766795166828,-1.926873885670349,-0.5269286477669872,-0.5232903043834338,-1.409539345822327,-0.9536275697177854,-0.5368943517910401,-1.2645311478576844,-0.3573503950080471,-1.5098294430093149,-0.12880065457397227,-1.689484594589592,-1.5727209506761355,-1.3955727562579185,-1.0096621085194717,-1.0687231307438012,-1.2251251685788043,-1.3154062823566424,-0.4293565622219878,-0.9599452203175499,-0.37927507503361063,-0.6214196005195949,-0.12366190073512877,-0.800124151081176,-0.6356283734893567,-1.1135640976795784,-0.29959122518110354,-0.8825394919934233,-0.414543069786881,-1.2225158868562829,-1.4433571330593788,-1.9163073108502682,-1.9142767457138248,-0.6886778066777699,-1.8186916424906505,-1.9323313479079118,-1.2893354805163935,-2.1230502428926776,-1.5397861224276197,-0.7731943634103354,-2.2892767421656797,-2.0984360883823507,-1.3168538357007142,-1.162608248318567,-2.3737734931779073,-0.9699248618587814,-1.12383451707699,-1.6751290677830821,-1.6058681953738239,-2.300801648823813,-1.7746750248516565,-2.1291380991236686,-1.653572856146522,-2.122461838267261,-1.5752805589046743,-1.561452575230018,-2.3522224091981356,-2.079284359513206,-2.19612228332132,-1.7633058964607686,-2.0955723205529124,-2.18605770074469,-1.669087629432339,-1.800756543326047,-0.8119928648850354,-1.5566056260240193,-2.450408709087961,-1.6142302740180716,-1.9710373811989321,-2.0954184045832194,-2.0145895328020273,-2.4964163499144534,-1.2774784402454087,-1.0038877024903534,-1.4685174680699264,-1.727763562695896,-1.303849485530916,-1.953746467456597,-1.2507879591743087,-1.4689458540757865,-1.4224244955809389,-0.688486555891387,-1.6025013794989962,-0.8190052121153976,-1.9015954854684978,-1.5122706984462093,-1.3634500779092122,-1.2778898040643685,-1.8388961644064867,-2.608765687203816,-1.7761803300591728,-1.5045162378745507,-1.2803991081541763,-1.438326179019065,-2.3509736429561707,-1.1345516374689,-2.1603048939803444,-2.340394830440417,-1.6867663052047566,-2.9662819980488737,-3.409052764958306,-3.2997927860137612,-3.316814054520984,-2.5358829246243095,-3.977565828240999,-2.2069775759419423,-3.292384177949722,-2.0867493044395715,-2.5941546330812755,-3.3832799148427397,-2.600316487812731,-3.165739848212564,-3.709567084421862,-2.669622288873461,-2.7565523791665245,-3.229845882967391,-3.125680024538722,-3.836387260933908,-4.081440891735809,-4.184357784946965,-2.5767659601175104,-2.80199708023751,-3.2975077066341703,-3.3293277026371073,-4.090100151962054,-4.040977577909505,-2.8286962155279305,-2.939013509007516,-2.328392915734053,-3.0091810897932065,-3.0042796344834906,-3.0801974317990033,-2.309592798922255,-3.3921337277761796,-3.297368670507505,-4.106973660104459,-4.201621625984501,-3.134442035488891,-2.7919728802588,-3.898485753056327,-2.5318959251321242,-2.1502192705939147,-2.551423219179143,-2.2666308490875693,-3.8012595522541606,-3.2063791222008367,-2.9110253061164792,-2.5042104550906337,-2.50573671341419,-2.5428540571142735,-3.9020137413941716,-2.709862695946513,-2.2500328993164223,-2.6067470027825976,-3.378050532360605,-3.7315602367942984,-3.6002636179342327,-2.889008089667364,-2.6627217568667914,-3.357117956880702,-2.87039972480384,-2.064382442235813,-1.8769245828501253,0.7466462188225869,0.4921889549796098,-0.9744274419154073,-0.2772685277472361,0.46619161501623163,-0.5853908675589682,-0.24502773957511767,0.5842106888533207,0.5686628397289735,0.4636111711803501,0.25673647908291597,-0.027188825923763208,0.3007560633145592,0.12942935293881994,-0.9030733225498239,-0.12874834688686196,0.6752279912274157,0.3467957103354981,0.4613468042515327,-0.663729058860613,-0.3189555310522051,0.6996940796070849,-0.4099175302626503,-0.36173721614930876,0.469922576009136,0.09818042580145249,0.4658222994522018,-0.2778065935299258,0.42609615142413815,0.8214087264551113,-0.5351442485140658,-0.545941222626532,0.4428385263738298,-0.8513626586613856,0.5722175837224425,-0.6546201075741105,0.3421183597318702,-0.7777129893391606,-0.44477459580501155,-0.37680449663670545,0.13714702658502603,0.2475945278781033,0.7978581756326543,-0.8682731011604945,0.8432007975238562,-0.4364024367683675,0.5279698222431123,0.26216598896758087,-0.5767522838631439,0.22685698420108277,-0.517467813567972,0.5702690135033948,-0.36526581564575217,-0.4078771396370081,0.5606656381415485,0.15581025282813876,-0.48473271380889943,-1.0369189478270533,-0.7571883752003035,0.4519383099501056,-0.3986508807715957,0.610578182527188,-0.6175290723641415,0.0143263965523338,0.7394510432694767,0.88270105051661,-0.8711826222459451,-0.9040336787816021,0.12388123938149809,0.5392711819927114,-0.08286136414459788,-0.3348660718134928,1.1016940624352332,1.1015428873664939,0.6909069715581013,0.0842533854678253,0.5640705484748125,0.10576758503227013,-0.25665942629239674,-0.812173608358061,0.6605309472206435,1.3331086806750805,-0.3618811961509943,-0.41334442752507433,0.3700241092167294,0.9959190411632154,-0.21622129580431243,0.22103192400560162,0.6294933366752289,0.2944372935859828,1.1345542588417665,1.1313618001689518,0.7252158274807382,-0.09385474891518232,0.8838233588389137,-0.5439212539735869,0.995563363442699,0.1696283717414459,0.1892359745707321,-0.43713583089970676,-0.7859674642825125,0.8977689131149985,0.5285578323696448,0.09229330901639174,1.4203243932922927,0.6898087122723671,0.7209595890598163,0.1327310596572876,0.916944050512865,-0.25130444788706735,1.3183937194980344,0.11812071570715567,1.4327685399880319,1.7495721608465866,0.892800738612638,0.5746096191379577,1.6243736257944714,1.3963692910477186,1.0713227246387467,0.002155779084538414,-0.6484490220024872,-0.8719820550457875,-0.795480692115845,-0.368493234176988,0.3479485273753702,-0.9796712409916708,-0.4666321479362394,-0.07161279019051126,0.3366007445824111,1.8974720835772154,1.5406728442769437,1.7676059462459714,0.6409805890630832,1.4274900807796642,1.6492584861505881,1.6978028957509046,0.6985876476670292,1.8146516163679713,1.4116218282078377,1.5175485268006144,1.644660399629209,1.5671529914705826,0.415802445657733,1.6722473672205813,0.9313572173143376,0.5565701104730078,1.393328998225186,1.0323916011132819,0.07643810916983301,1.7869942836560935,0.7450600346095305,0.11476590649069461,0.5101957152965605,1.3710439127803165,1.2759066421958938,0.8931035535458923,1.9258396431067788,1.6681889734955433,1.2090139625186025,0.5763715333679198,-0.0048379394736415855,0.24401666224876087,1.823036275439891,0.2359438414475042,1.8610834506794434,1.074814239163305,1.4246935681954496,1.215477199797867,-0.12291014199120026,1.0982925748682206,1.245625902797135,0.6584413735632779,1.2975575249561186,0.6507477603195634,1.0747197802124089,0.17748341886280194,-0.0248650345498495,0.1211229347783359,0.012552556481772401,1.7895521930274054,1.1315994391533561,1.1025906114700674,1.2740317885772752,1.424413005322259,0.5392526604239567,0.6857794774282592,1.5224896884453403,1.7240493409497428,1.657227830128362,0.2939160722474517,-0.06874776235504455,0.8185652633332844,0.3160926739905676,1.3020499419085994,1.3468579704575308,0.7282681129949282,1.7454828163565277,1.0739719191996528,0.291421658185234,0.6289334224968454,0.7765423027084501,1.174203229586798,0.7257920953278271,0.8225076050967847,1.7462256245458938,0.32563780932839725,0.3281253909909206,1.5016194057079895,1.5380617805783154,1.5256788451857632,0.6194920780209924,1.9729360378830425,1.3730521572452319,0.4571801290548957,0.03332475512662769,1.7387568224444296,0.03218727308869826,1.9067837963537555,1.9421217539836797,0.6626131480559007,1.8164633788221491,1.345763890359368,1.8621478651451953,0.8676399558286813,0.42314482811306897,1.1180303642062044,1.0291955554662902,1.6587480603644302,1.8715143015032876,1.814391060652917,0.5652209385612791,1.4562514983280685,0.4699069930484878,1.7490268228773647,0.5404694990212411,1.1138150943193288,1.2821519849636638,1.6483330855779799,1.1134878825250039,1.4563846125192164,0.6858054114247962,1.4767481641394478,1.1658164120193788,1.919197839163166,1.6312712084568513,1.1006140304000687,1.9092768063557475,1.0064488193030217,1.5531309720306326,0.32596244825762577,0.42941351309850895,1.5926534199054725,0.9323731619085305,1.6958705865171024,1.96962168094873,1.1817911117677307,1.277519381429105,0.9171834214178368,1.7793411673230226,0.6843428287305879,1.4407018209860085,1.6981466289037705,1.493334356948265,1.0002704335683832,1.481457030338653,2.471900090638571,1.7054919659407115,2.646165552290402,0.9814838689940233,1.5407732977571977,1.7755396331806905,0.9609253061248882,1.6153202091853023,1.8959429874065588,1.1594778172070321,1.6211027512389518,1.8351068077953772,1.307720895105424,0.9253999838408878,1.5967698356199265,1.6217892251887003,1.0499583655555864,1.4597495816562562,1.6835190406473273,1.7469037699932326,2.505143022844803,2.0442182717617463,1.5826232151215105,2.0091326070855686,2.161941883641099,1.5502544856831335,2.00121029816452,1.5552922953695862,0.9510383715456856,1.6397817832819193,0.9526169533688286,0.8698670645287714,1.1802482671997772,2.055540436224795,2.499979676247233,1.6067455411762686,2.3247789127851037,0.9201918033296829,2.1401211845658388,2.611870491640861,1.499810927626345,0.9077501720535849,0.8648481763514251,2.6277150437924903,2.5298904426369995,1.1478302997635628,2.194751748633385,2.515072089027362,1.8721092444892908,2.2491385843359883,2.3690465053812257,1.020640529571653,1.833388475479388,1.4054307574886258,0.912886509548552,2.6052396041441988,3.9145121137404595,3.689805429326351,3.414428297271287,3.6594037952887892,3.1815238414704434,2.78260520475431,3.7788689097808765,2.5511038900829193,2.5556063562974893,3.3703059257617944,2.5386077779609604,2.8489387716804577,3.6777422231858394,2.2543178470868486,3.836781687568536,2.5281075667390387,4.008875105807094,2.5691706583445755,2.2590406347279024,3.2854608501862654,4.055836393392635,2.1612351185177823,3.192329330626095,2.0566045208067134,3.7995633151558263,3.3683931507869236,3.2158867691137947,2.206706940708306,2.3358834017567043,2.9640922728889776,2.4527797339025565,3.8889835389383074,2.7894584920334884,2.590064298964028,2.453007774634639,3.626707198201336,3.2895547152146727,3.833632719337703,2.054864609950167,3.618641090248996,3.8930474163572213,2.280218131832536,3.9008659634083385,2.684993933139616,3.837043923859478,2.8106470894300126,3.046028968844254,2.3057861775339537,2.539143634872645,3.988104588535359,2.9072140505068127,2.4070593095140604,2.6330443036740725,3.8456522353783873,2.5191930825682602,2.5197142316099423,3.7301497804650565,3.70221056254023,2.249633258210367,2.543845181501755,3.2782140401015534,2.4202619444668194,3.5573468792094936,0.3627822879946182,0.6175738397746844,0.7548297712611778,-0.08112058955013844,-0.44695564698893603,-0.14409902680100176,-0.7472897851739214,0.3669035636115732,-0.5721622445942388,0.6308536793725064,-0.4521829133400961,-0.31796637486986534,0.43944430000895174,-0.12577280416950162,0.06796166762842533,0.5109852080178835,0.6997405095283856,0.3792211297573225,-0.8907717200038475,0.8061466711911776,-0.2604375322108214,0.44937265246190533,-0.604082910702001,0.5157990846755177,0.6920128822590975,0.6826173634360945,-0.7592203781834802,0.8763980878507722,-0.874122312558717,-0.701584342087031,-0.41095385518594135,-0.23591890917241215,0.32197983026002786,-0.4351876755713566,-0.1435185133853077,-0.2900887988047057,0.6986188880877893,-0.6687495547346166,0.2554467646302703,-0.9044939698151777,0.18054883537508812,-0.7997538256833868,-0.7952775927931099,-0.9629871955892597,0.5201533459326814,0.7637220128373448,-0.5529103015918173,0.21905556804355972,-0.5107586467947227,0.49619019571292844,-0.5895582207014787,-0.5503285542048496,-0.3134296059277136,0.7715385315474259,0.725792619224309,-0.31981463831713364,-0.9727562881849312,0.6288119486812218,0.751605161624388,0.794093664930108,-1.0931168711109212,0.5644047393088493,0.006039059039029403,0.30094968137230105];
  this.h1[6].weights = [0.6179165653577137,-0.7680859677935787,-0.4897473864579598,-0.24910229724658217,0.6348752827074127,-0.01531533959313558,0.7712183725040709,-0.6832352390388787,-0.47008065854399883,0.3198485671099457,1.0061207452453549,0.7078114225003902,-0.458104914096342,-0.005232566233127214,-0.6912688964327582,0.5901870373176971,0.3846750253639063,0.8522885855722042,-0.20495219892741026,-0.2979359048086815,0.3237042339335784,0.8245432107673506,-0.34221591117633776,0.3832665176339072,-0.03351277876321551,0.48774156754578596,0.20398545034811083,-0.47878552593238954,0.07283011064659863,-0.34885971690090656,0.9812941909476545,-0.7137932519947584,0.8387923830996108,-0.9709156992743845,0.9900801447690843,0.597771959824058,-0.02118677955931979,0.8755092129398071,0.15502678912039242,-0.882365150024236,0.9004087967788271,0.6263478126672355,-0.20200473047618656,-0.8934342005870792,0.24753059740037625,-0.5917768896235371,0.0649559924595117,-0.7181255313071895,0.37635505463893343,-0.6527280180252977,-0.3480335990687536,-0.6997107097851053,0.7934821309132705,0.6646357571667398,-0.9185497543512186,-0.5001227410648341,-0.9988135671692282,-0.18840714639871647,-0.5211276164658685,0.3504335791325599,0.7559519869535243,0.19092317335896158,-0.9916111290149594,0.4659073676461909,0.08559994663236253,0.922355060154803,0.3610819541378432,0.6799539964781232,0.5637651877809349,0.17173944895074264,-0.030565394196935894,1.1037009236332727,-0.16533863200740231,0.6583435721735996,0.05725368180383348,-0.11974851967008518,-0.06780002595738227,-0.030756541572455557,-0.7289226409444638,0.38700176366372024,-0.32828595648165754,0.978368220147073,1.1589607087662526,-0.01136594457192902,-0.16050298486642045,0.14297407707034965,0.26292790320887427,0.6406665259809706,0.5579861612928121,1.3023707655222685,-0.10730092624140711,0.5313075918510348,0.7454299204321702,-0.6235206991368809,-0.4206612622640911,0.5733923526148085,-0.018046508603998465,-0.1815533422786668,0.16897834070984474,-0.11132504767094578,0.588603602761527,0.7122745668526604,1.0758575400986734,0.5059216988723859,-0.7134058644377247,-0.4440162456157915,-0.2247244194573865,-0.6524717449449954,-0.5789701817977302,0.7359328107428853,0.5306846963493647,-0.24455169357163242,0.23407435111984365,-0.5259340471911216,-0.7760276941066832,0.3760083242438084,-0.3763820359430131,-0.5848840197736082,0.3284360817663828,0.4731149830519261,0.1413619219221246,0.06014500527597819,0.1450872127698053,-0.10924512117348774,-0.6545134293294749,0.5435185280442699,-0.697102415232431,-0.5795215122433055,0.14602111688685607,-0.06269737631677053,-0.28287980684954456,-0.339572963083738,0.2275767361907714,0.3252491497629638,0.0004593992732289847,-0.7128293690847487,0.2297602031727934,0.2809763932145359,1.0351274157008135,0.20368357751008387,-0.1372080998210612,1.2553805591737972,-0.27969844480978234,0.7339544878917524,0.48495777547982105,1.0736342396316239,0.03404395557098813,-0.19571201185348566,0.07689206418778194,-0.05939171193482683,-0.12785315776136144,-0.19606339193996605,0.5240562502623934,-0.5776931164595999,-0.426385989714706,0.7894453738210994,0.06274306615735728,0.2619108390734632,0.2271469733286185,0.3730242460449075,-0.7516728535159402,0.35039259585812527,-0.18071421756287653,0.007919870413180189,1.2046547817047804,0.33490276412159115,0.9884050944506635,0.3676083816760509,0.9812509439208632,-0.396407464135247,-0.2532694262440391,0.48920876998422863,0.35759652139311465,0.7695169428622434,0.8381526407829797,0.8680236053048834,-0.09028521697251288,-0.018511918406653283,0.4187464735106081,0.7021069408914021,-0.5217006104952393,1.1523435240049862,0.9485509456889942,1.1895835274808826,0.4825186925330335,-0.13065423192767706,1.0259195620342156,-0.48269670864179115,-0.3078651152990104,0.05133883346825502,-0.41381014831759094,-0.7192281508227901,-0.33496195851976857,0.2872888629954663,-0.10927982485864109,-0.42080500713681024,1.292763390275475,0.11674812559859694,0.9371072880459708,-0.4124569344469248,0.555938880908861,0.49621244421532335,-0.42324326294522807,0.3429431798082589,0.4958486183164009,-0.32052248242960957,0.5553137313573278,0.6064897836702773,0.28104003927408217,0.7022304281240728,1.2766954690757564,1.325296263613614,0.41617072899152724,0.5955022154535187,0.7841032970269067,-0.5596555950304103,0.9380380697102618,1.3938108846243573,-0.09488104983073749,0.49460910417581766,0.29328525855008636,1.0063695105893098,0.002212508358330432,1.0450963666586335,0.13938645971167726,0.1362527555792235,-0.49875524343056676,0.4468258550810127,1.029349077126094,0.7656061494347286,0.55826610225181,-0.45903083636508235,0.4264726391203241,0.3276896639892756,0.45202484232345336,0.18040340319122972,1.123680953238825,0.3242080047353097,1.049438129948617,1.0259353046181026,-0.25229319955127993,0.3241295117623539,1.267101784066864,0.4630325671524258,-0.032679561447633315,0.3203641329653189,-0.2938782178650148,-0.31006983314089653,-0.11941468044467901,1.0079757447265936,0.8426553430766759,-0.012045136140032314,0.24238892889563418,1.2446774212677474,0.9833738314157016,0.9079563323986347,1.6116662352103532,0.8015187058187612,-0.10766296581731243,0.853306882143922,1.3368672735937508,1.2546570951499265,0.4691777377027823,0.7548679534122885,0.2115801509109667,0.9856706617836287,1.4304041815338682,1.5533903330564347,1.3775135796887812,1.780407445001062,0.4122536598649282,0.4096997986908359,1.3506413372625008,0.3510423282403115,1.7158645747231989,0.8882538941667213,1.1261510864629716,0.8898279701905426,0.28248371174766385,1.743178926900276,0.38088613270565447,1.122961891706502,1.4119894917662348,0.07559682730769737,1.0186331093104424,0.36950267339109233,1.2568212017854041,0.37691458260690736,-0.10837055974830333,1.4945227298268233,1.185309921963264,1.0502979446082477,0.9871695610774818,0.47642156486483705,0.5208697476508254,0.011126527681266091,0.8365493741811905,0.4376066174916186,0.43212467118981995,1.547207769021387,0.8758332750570982,0.8758685399876183,0.30872635669584325,0.9827858225571348,0.10228927867022661,-0.1394462956562707,1.0266934955747433,0.25340051948104114,-0.10438311850914096,1.2794396850519898,0.8621475585191621,0.8041333468740618,1.6755699080128137,0.2070942480007866,0.3327404461412939,1.5814632900802534,0.9620930357465285,0.8124053373664859,-0.2539733205583392,-0.1820195413767983,0.20269679740641774,0.8355932780574776,-0.7876955549766698,0.6720343827815748,-0.5560802797683597,-0.18566239953432387,0.01838233913735878,0.6966945132205314,0.6218686617546404,-0.45012048192371706,-0.9866672364187089,-0.9032617533047748,-0.8625037424824348,0.760810752267258,0.5342681704076155,-0.26198704133899997,-0.3413619635775319,-0.7735497773027523,0.11304460522679108,-0.8452721805604764,0.10085049195400915,0.7239007389830735,0.06768852558137514,-0.13175104770081558,-0.021981049693681212,0.3596233080415356,-0.15377349378092314,0.4945624642109534,-0.8176583622427103,0.24384589718051064,-0.42396870847568113,-0.09110480104594627,-0.4640671554092825,-0.7217991905407627,0.16728702758586733,-0.4086914430079589,-0.25576086551615573,-0.71215457303987,0.27417874759862215,-0.15287580530061481,0.6473071855386635,0.5175212426760295,0.8545463741077308,0.759535406541892,0.10157707876377799,-0.6467446116507589,0.1266153627523257,0.3182844878442993,0.6196712340494734,-0.9047189946695038,-0.0007423180608846765,0.7693825024827876,0.48090006265506136,1.0382594706099983,-0.5118873068321517,-0.7640227161294516,-0.5817685192208866,-0.7413385090345886,0.534255397503797,-0.21946580788843167,0.6425458107099349,0.4687697216350883,0.012227136908784221,0.5610333014831744,-0.08420789734311196,0.7840798769816453,0.7306533575840937,-0.30987253640816137,0.9086338147691642,-0.06575993117622225,-0.08532596490304512,0.019062400742853924,-0.9424310998108426,-0.23378469778742053,0.931529867130461,-0.3054357402249279,-0.29482683270871335,-0.6766121222445932,-0.632137394257343,0.0782000848400784,0.4750540684636534,-0.5395441759625283,0.6312153124051191,-0.5115062941597333,-0.5522020495077158,0.7393615153606683,0.3215877149845861,0.08113163051360274,0.5528130021042713,0.014983641138567694,-0.011560556206559049,-0.9835340152946316,0.22430765057270077,0.2828812885266678,0.035681635736603635,0.6879049703415753,-0.6172571296781304,-0.32499724330247903,0.7817819065146272,0.11180751473320846,-0.6005877487254101,-0.2609881160755479,0.6466783547313796,-1.0193367449944326,-0.09607201803437096,0.08736664847316236,-0.6099289817362843,-0.22578526708427313,-0.7460122362091863,0.5546006595706479,-0.4327468682229067,0.25314057919169364,0.34011696816379966,-1.2513264263993291,-0.36485468345249494,-0.10514346533110387,0.15313372900182082,-0.9862808147425484,-0.30432228019073726,-0.8981116428408273,-0.313493960524748,0.47146219669273615,-0.4397805517564679,0.6611667119904525,-0.7796355345018409,0.9419417828469734,0.14619552164938865,-0.8452972230352702,0.7792479431967039,-0.4232436648016738,-0.5428158340633756,-0.9641281766745873,-0.1887657944286693,-0.7153606358573649,-0.2831587719668442,-0.4187768909207392,-1.0526421711662606,-0.3435829315434494,0.22599936527315864,-0.8048742632401481,0.7378049111008379,-0.5348685540032454,-0.9458431311035801,0.28982858542592166,0.7376669299801331,-0.6033564274276917,-0.5956743550438008,-0.5003543020395546,-0.7395577380895535,0.22367299492683207,0.5713592387896648,-0.850602544443159,0.12291474990451379,-0.18009491303686545,0.5246003487265977,-0.6554865450822512,0.5848224699970767,-1.1966502320365517,-1.0924690190000494,-0.19538095273033035,-0.5253700337435122,-0.5931322801568093,-0.16525047832669718,0.05072275474773209,0.6005809642482619,0.7523207554413744,0.47615598641636553,0.16830969164846069,-0.9780311890107264,-0.21573654274034518,0.11224976964009249,0.08608999998069261,-0.5430389884287782,-0.8308013627798075,-0.4730644034060381,0.4413270818184296,0.2684634833296749,0.08211342808812444,0.5152883231243706,-0.3652861090275293,-1.0043384456023412,0.3050926516760162,0.0004487750888029843,0.10656946038677757,-0.904085327824889,-0.7395602964071382,0.6420824280193401,-0.8129634166608722,-0.18849482370849055,0.20450818233921841,0.3147571707315885,0.4660355895060842,0.7149701155831032,-0.0026936726382737718,0.21894606592187474,0.06450573516034899,0.006495360800879963,0.2778780632277624,-0.4233924659398492,0.08383905672968153,0.1056128441715178,-0.09743741312916769,-0.3566906855550939,0.5970520566936115,-0.08173063276244541,0.6316545715743139,0.2543345378610203,-0.015283307664428347,0.24821987951915842,-0.5315516528436832,-0.6591056533527645,-0.799942877831544,0.6200593481211987,-1.1242233149193162,-0.19723713605707263,-0.5819095849963661,-0.987662580401829,0.31268952805357025,-0.8734819200132136,-1.0553075706425399,0.47651429836103615,-0.051324445704538015,-0.577739326177524,-0.07600699146854048,-1.1708951227199755,-1.046040011874999,-0.21244960233277543,-0.06041997929922569,-0.6984246332695847,-0.08719917826903581,-1.1842489675157502,-0.7733400868274087,0.07479018163428178,-0.3046799664568108,-1.218985739097579,0.06540448722391132,-0.5083550476878105,-1.2721114911855782,0.3643260895579898,0.38322128647703874,-0.17785105843033353,-0.37033580229184077,0.6569308873125793,0.22398498466883865,-1.0054153093044227,0.24382234868287267,0.569430559203854,0.4099140556493412,-0.8720653830603793,-1.1664852112442254,0.47773183903757804,-0.9726784372379895,-0.4056825475756686,-0.8501560356503134,-0.7815333264525841,-0.8149751366297866,-1.1785443199222827,-1.3259007273477903,0.10762499790977598,-0.7431195802800659,-0.1660506577912501,-1.4543195156963356,0.2637596778563226,-0.5703970157642232,0.2575746668577059,0.2712792359761467,-0.35637762575623544,-0.0342445433031004,-1.275294250717274,-1.1054230902090163,-0.20465081331277565,0.43458978608578347,-0.05424828424433953,0.07547832885663855,-1.2005458076598392,0.09807810096329571,0.3304798837009773,0.07584578885954385,-0.43697795620404134,0.06972147462874213,0.21075393636418704,-0.29897672224163047,-1.2938414991693465,-0.011164839228146616,-0.08222014407421692,-0.3661193744288226,-0.44597243074164855,-0.2716369092642912,-1.4242976189782295,-0.7346813279262775,-0.06512338793487336,-1.1564387816697106,-0.6623596157850581,0.025425057153979917,0.06115827473826411,0.5080249643308998,-1.1237304664886243,-0.6653881240293366,0.086217546011224,0.4080690676859037,-0.17019645554143883,-1.2129651460326882,-1.2263652309086994,0.19717368003800292,-0.18459927334993406,-0.6912705426942528,-0.571137349443729,0.14878876981745706,-1.227610360405253,0.0816628151808247,-1.0498559934127816,-1.180660146048302,-0.8366267347133902,-0.7213098920227737,-0.6761612728858021,0.15678139170516914,-1.1262352726147162,-0.0642888572713104,0.5173142265404664,0.289147078810547,-0.022299191163348928,-1.1414583250790502,-0.6900149587198099,-1.4415229056549461,-1.173555594263227,-0.13522057679035338,-0.7496240454251761,-0.1228743890880326,-0.6639681133776029,-1.7560666927582225,-0.5119665612171793,-0.3076322849090869,-1.8164050117046895,-0.698617429745174,-0.7570086671249411,-0.8803144474481244,-1.32779116502079,-0.3778926397450428,-0.6521702893862489,-0.48640306541502404,-1.6145318222165461,-0.18821930088984837,-0.11044582599569872,-1.1133607121794078,-0.23567014054916618,-0.48251516857080334,-1.3432884098113846,-0.9180731522517953,-0.9932966982532399,-1.2721254158465543,-1.5788973322377773,-0.2554156120113851,-0.27741656779723634,-0.6780380734406308,-0.10951572338648877,-0.3205265444394279,-1.0543276808967816,-0.17096718917645323,-0.23638194145909874,-0.01533837015760708,-1.1803980408008992,-1.5160350236365225,-0.7961003569092376,0.021062173032537587,-0.2478909947365782,0.05795331451895583,-0.9724643129890893,-1.5495254192581533,-0.6035300075889981,-0.20773092606774668,-0.33547398397630307,-0.9048474140362771,-0.8332206329841461,-0.13999809567192395,-0.3704226645800779,-0.856983089694582,-0.12828720422131595,-0.7873040289502299,-0.8206876638548507,-0.34696325643764364,-0.5411345031955002,-0.9885786263512198,-1.0830334878554384,-1.3881990992502926,0.7526289685057965,0.7750916771998448,0.7520390832244295,0.5492376031500552,-0.8811233168833357,0.6746142475791649,0.9644027778586051,-0.8970035636110404,0.7985961557733914,0.30905090561651427,-0.3268656670891132,0.4949842333296887,0.09862956947046891,0.9467795491764827,0.5382243720160679,-0.9934518019998263,-0.4144315486933924,0.6536686165778491,0.9709330163521165,0.6392087691549266,0.010687711038288163,0.8622064373140668,-0.43026624953584697,-0.8371165158496562,0.14944873275847448,-0.07039533255474809,0.601717132109993,0.7002815386164684,0.22485970032629918,-0.9140509630284955,0.07627409889460433,-0.27341294943591016,0.9521593100181688,-0.23212087732334458,-0.4819021301959602,-0.36659052517476,-0.12963493863629186,-0.8069960171250808,-0.8501285074960016,0.7117699495610419,0.1299571500479446,-0.5619982750641195,-0.7072870530663521,0.9933125407256823,-0.7815071519948418,-0.4355700463544013,-0.8962340522497683,-0.6840525791617755,-0.8803544564456911,-0.04753882898418821,0.7470006766367422,-0.14196736205286628,0.48891310281776884,-0.00017044136147023646,0.5308837075203221,0.26393501344157794,0.7949192404795036,0.3438994276160059,0.6200189009192878,-0.8091690298607509,0.601487762790505,0.691540451192759,-0.823858854231939,-0.9550092645229246];
  this.h1[7].weights = [-0.3877259363794576,-0.7865707865776148,-0.5890118167001028,0.22836678004359046,-0.4008517516161505,0.24447066965974606,-0.9327833993562646,0.8616377055666673,-0.8612897664949967,-1.9881367601061801,-1.3377826310303247,-0.7011021173305874,-1.949649706118649,-1.2290316195055588,-1.3034614554745245,-2.119696096176216,-0.4451991255768563,-1.4037976312459526,-2.106397633982777,-1.4730435043789765,-0.33472591145617403,-1.7807351110251444,-0.3114505028018154,-1.8308474404608632,-0.9556396556197122,-0.6886498142053039,-1.1209562784220097,-1.704610677349999,-0.6860710825760356,-1.2106424265322255,0.1232895329876214,-1.4561586995261038,-0.9295515574123663,0.20674055582655126,-0.9934388080727119,-1.089182330821219,0.126819674619532,-0.5693563018200102,-1.1550481685480736,-0.7684488985664589,-0.35683231386125264,0.13702816276790836,-0.9290580815826551,-0.3292253721440266,-1.1776394487126751,0.07707448798080004,-0.8226096000037364,-1.3352236603475136,-0.8589330751011859,-1.227582260194081,-1.0941736057552287,-0.2652899218394705,-0.9437494113954709,-0.903239479694821,-0.252386366857666,0.2980466712686912,-0.1696821638293322,-0.28065978577320605,-0.9776973234901538,-0.03997084110022353,0.47859353337249866,-0.39772736028102207,-0.10888731260530982,-0.6570851607393187,-1.831911054994569,-0.4331949550369929,-0.5656147111452076,-0.33732283794772067,-2.1815344523469196,-0.9420070850651664,-1.7871753188022967,-0.9142886764831402,-1.9602766468855206,-1.563788179799482,-1.2534129962955287,-1.0420959781226018,-1.4855570897403998,-1.5660222773301784,-2.040477918577199,-1.2937276825216506,-1.4431649472878114,-1.8762341169468042,-1.8653880788924746,-2.2689696362608904,-0.6602410707380629,-2.0765969390653867,-1.6703442643619313,-0.8813048389856797,-0.38104561385829633,-1.1583141161056894,-1.6396779725270019,-1.200246211263737,-1.3913418320341187,-2.3848569190923508,-0.3875853273134383,-1.3244363941850654,-2.132974717475141,-1.9864915404090828,-1.4816137428983376,-1.9482547283984637,-0.8667375195397681,-0.9118697623038712,-1.8109878324685766,-0.9943245531440092,-0.5119727635033751,-1.7900162853741517,-0.9643437487456288,-1.927161948248867,-1.5092653096115582,-0.6353679319535381,-1.906562735630207,-1.1655033743297487,-2.03762551961317,-1.7998723331665325,-2.025986081637173,-1.295450585843409,-0.554117529053556,-0.4629391095464037,-1.2115216331240715,-0.8182006646644502,-0.43610370571894147,-1.2424728658145245,-0.31481483729300186,-1.2385407604805767,-1.1454740275106474,-1.511069795606752,-1.2717468402293524,-1.1934194069360604,-0.9900825197939718,-0.7190155141447604,-1.819545001996707,-2.3648758275091377,-0.4488190709133846,-0.32566975581048846,-0.8404237292283027,-2.1229509482848137,-1.3385939420180284,-1.404540556202091,-2.2118362161933125,-1.524720706290682,-0.6841452312093913,-1.45815729104368,-1.5811463406488127,-1.5824269640185455,-0.7662785016317482,-1.8794141820431813,-2.477763328910206,-1.1335548083392188,-2.4725139133144434,-1.4871486819799782,-1.3217478025646907,-1.7747008561760067,-0.6963472235852601,-2.1735572222982795,-1.4434092564069745,-1.5524740833542081,-0.9626613329391297,-1.3667291883466717,-1.1933709672066852,-2.1776747288799445,-1.5567040377254762,-1.0447769019652338,-2.219998120726355,-1.4956630981462213,-1.2667169895545571,-1.783507712069657,-0.9304039586917574,-1.6778767111806911,-1.4177956326903391,-1.9077845891757028,-1.7483420987506564,-1.334301219671231,-0.6525538450490884,-2.646721992986761,-1.5726487461605452,-1.0974146959381275,-1.2529455407149246,-0.7729567052375909,-1.24244963567655,-0.49713655170028015,-1.5594425088940282,-1.1252442296318261,-1.3924212855016675,-1.8171659604699137,-1.8563874406421823,-1.093558536611719,-1.289262755170798,-1.903037855983715,-1.3742770800353592,-2.3011086807645835,-2.280488496845288,-1.5686304499317836,-2.6835356827181274,-1.8929284256095344,-2.2350058105287154,-2.7974984402924794,-2.331765507519062,-1.4717698530885566,-2.276503182265432,-2.1399077945103153,-2.7685097642044023,-2.246439806339876,-2.9996138761271087,-3.055734458857612,-2.8123910890831882,-2.823287952251241,-1.5458736611294854,-2.5021786140523665,-2.9825901666503993,-2.7113243274757814,-2.4867060801787813,-2.750546618279774,-2.551635464677554,-2.915825991400902,-2.091900185472702,-3.096183779384937,-2.6361473348913274,-3.2014976996868225,-2.302871355717274,-1.9615817792309314,-2.4918292295640194,-2.458184969307663,-1.844942084109111,-3.078536687700939,-1.5372859398232361,-2.197208830441673,-1.3813521072405708,-2.7434329655311647,-1.5844513618686191,-2.6562741938055705,-3.6831356372520387,-2.0618422578246447,-3.4364394561956604,-1.8570011545904952,-2.6099657460513854,-2.707763643463166,-2.6928889633396396,-2.7254336707152356,-1.7791963448012331,-2.6317518113543894,-1.9362979653084265,-3.0372280628312587,-2.218040359299736,-3.5938485334957164,-2.1716314130267587,-2.9405346334997526,-1.690894190235862,-2.0754644301212126,-2.2873889338187348,-3.147800785555069,-3.0087863180752366,-1.6086477384587818,-1.9684018561957841,-2.9512332458139814,-2.2107452739252267,-1.6458709376408867,-4.4739671884757275,-5.450060141035663,-5.081041622022997,-4.733603466766187,-4.454074696619124,-5.3005844210375255,-5.608842156546052,-5.430161936110907,-4.435037623370615,-3.80711003690735,-4.275788957557545,-4.58997857079754,-4.082115464931821,-4.680644791224553,-3.9481913706572924,-4.718045874435566,-3.341030094397247,-4.074375736339555,-3.380898398565215,-4.950688618256207,-3.902961689160536,-4.621675183163006,-4.998344109761628,-3.8736649117337327,-4.048313883161988,-3.5963371924401,-4.085653844157892,-5.27384681656555,-4.67405948412635,-4.768378554644678,-4.61015392532987,-3.4140493819141002,-5.1313722500538095,-5.033519147945481,-4.287991048495831,-3.5329304986879264,-4.300708604473492,-5.460609284880059,-4.018377729375973,-4.372148173627849,-4.525044554990479,-5.164579011576168,-5.3483672522445405,-4.209558142618365,-3.8450350046201747,-4.576762681041158,-3.3151864323289466,-3.334501595506852,-4.381366556174136,-4.676398597607869,-3.7217748366610786,-3.4936769133887093,-3.728446324232124,-3.9347223154635027,-3.6332700410398164,-4.7138092400751805,-4.761854871106326,-4.684558923576361,-5.307524266565665,-5.191600312708141,-5.153099742066089,-3.4816059948762623,-3.2882271030477903,-4.579115892515292,0.9938096142313158,0.5617855661600772,-0.2837597679739018,0.809263924579238,0.12432000034373887,0.4427743568255547,-0.5751689561189016,-0.4229352349485538,-0.17674498889588766,0.47574159919133185,0.13836824084184532,-0.02406532554005685,0.3176226330132404,-0.11265324467508356,-0.07279231102761438,0.4711981926782907,0.7552361880949702,-0.7207350207991157,0.6344406454694235,-0.2915642272152703,0.32704954663710356,-0.1973973086766238,0.27505991983020966,-0.8329860760555986,0.5414211430208731,0.22855920130447732,0.06194845539199688,-0.0373920133706782,-0.9135042014097511,-0.2502420661184301,-0.2794282444818979,-0.3982495981368631,0.3764639760899954,1.0511675770362865,-0.619649944199641,-0.2611650459203524,-1.0616808868434466,-1.030043413677637,-0.5185696870008921,-0.060416966999643384,-0.8144443271215139,0.43773428960617405,-0.7079185112808513,-0.5408482812317419,-0.6334736365729713,0.14133600208443103,-0.8924729112848978,0.09549781571132532,0.5050590039118503,0.34907514684876223,-0.14376279388937116,-0.49463222256657574,0.4549536906826715,-0.6131627442592815,0.9413346032743807,0.3226971300173863,1.0410267302083545,-0.29159505463386626,0.19097734631422816,0.23765679825997263,0.7794818358325226,-0.19785428734011692,-0.8537478256530584,-0.24748483169710206,0.3984051082711333,0.7614251786924728,0.967495359823654,0.6795544143357826,0.784433313896812,0.3666409519424043,-0.28732441203269055,-0.3303502496508397,0.7516658749468556,0.9826586499656097,0.725132446736321,-0.4518205614639433,0.07332414081118516,0.7722842220149435,1.5106527363258702,0.6258112054587209,-0.12602425951376725,0.8282347909618447,1.0873001322815241,1.0593134242915312,-0.20507992245306053,-0.729317565559084,0.5293672535101053,-0.07180852488015808,-0.3389291999335429,1.381184802550302,0.8218158601295459,-0.054344583569591126,0.36887747295373435,0.3334094569583688,0.9472603598341504,0.527723303270076,0.019470520541635287,0.6788410101359645,1.5243862133379964,1.1646140382806915,0.8266681841350301,-0.010057599943121696,0.8377960809688295,0.7260970374746222,0.11245465698609204,1.1273747706716135,0.63211006063631,0.0788261058163025,-0.021490516210709715,1.4406358433995328,-0.013248353423612219,0.8351267848220145,1.6580967454310702,1.2262470533941308,2.2928261277872357,1.7252026771350686,1.775130318067026,1.5865814294129132,1.608342571715339,2.1671358756199384,-0.07157730590708855,-0.19804790029607178,-0.15070927443836846,0.2357040832006736,-0.27889497687530884,0.23490866689729595,0.7790308314560925,-0.42977494992680265,1.7461201019741333,1.2428925994434175,0.780235948796089,0.8299882239038398,0.44734657987753346,0.5729696875590611,1.4863209402181146,0.1848992367547355,0.9699290983950862,0.2560022790212344,1.4599100186041283,1.1960276702928396,1.2722341846018526,1.7712609792934997,2.008320901566937,0.8898203672068051,1.1489535027385915,1.8002987848883463,1.2767125035371076,1.7150335781522301,1.9795285351540772,0.8057022748470705,1.7317379648564604,1.7000945227745778,1.701894997050889,0.4669194819402402,1.936517468185021,2.015606030902667,2.077460602586295,1.1971980127668738,1.2232293376949062,0.5470618333079487,1.2150623187101328,1.9458953596158635,1.5478332066516276,2.4309713151595918,1.2924594541040662,0.3175022174199903,1.5977563171572235,1.6547604756343182,1.6427144861705971,0.9171368854673286,1.0933568405582665,0.6038875115500466,2.081260413211329,1.9823424068530175,1.215082925371334,1.318952428327933,1.903306467619655,1.6873096208830212,1.5750065778732416,2.152467067146388,2.0677618201439603,1.2296408791199025,1.5668247325723752,0.5360200115862324,1.156044120013485,0.5049987655515136,1.505398850702548,1.9273272375540624,1.0914563177600425,0.2502204091318702,1.0339327778113288,1.6781173080160976,1.712660077936613,0.8170421737433112,0.8073699769953123,1.7660260642102876,2.2051713573867415,2.0530289998414504,2.436478279387532,2.113298632240491,2.0909134144904398,1.9262872795841732,1.5408797007753612,1.9556288472192194,1.9076819038211599,1.0736809363299296,1.3609899164488901,1.8141761119937228,1.9120892988756149,1.3130468039428578,1.0444280873981489,1.5064284259707976,1.3564918429825903,1.8110376192350035,1.0577686593403155,1.5994701990069875,1.519267725832046,0.858142724021387,2.0086512172259314,0.7786041401812341,2.252994486080331,1.9273874792384251,1.3406074235543874,0.5600094151416845,1.1091710210051837,1.1640869785847625,1.6273378699348855,2.330123507380652,0.7129739813802248,0.3908006543267381,2.3501016550278524,0.8652764530091841,0.3951726804016118,2.0557327651523964,1.0492266959354997,2.418682206539767,1.8002175686117141,2.0275265855580953,1.3395932074914354,0.6517427223718686,2.2090636726126864,1.5110397968816485,2.3420294427623234,1.4163332635405539,0.3636634962278705,1.1950169647914672,0.36917811743574525,0.3912094323960202,1.4096453751808846,0.7931110297024606,2.107028263429347,0.7130097633969121,1.137344379710895,0.847410278720217,1.3873459239141746,0.8813046232774788,2.9692283392539367,2.8094749850209806,2.000696242110649,1.3967798333181807,2.6825776815291245,2.682372228792062,2.893073247498142,2.582714294418306,1.66459782588816,2.469300596018786,2.392526660738958,2.8799048097443074,1.6385073306832298,2.440734940449883,1.7928919670361811,1.7212486268895952,2.011618408034087,2.503289607059765,2.423009264432756,1.9841996869828742,2.4549484078495256,3.1915553230941165,2.969568414731,2.9847240768205197,1.6739940273442486,3.1185802883626077,2.4081513716470146,1.5761929565199377,2.476084365209873,1.7482720843234347,1.5017828580029118,2.8037865649542355,2.042166699535994,2.0499949290225006,1.84192212511313,1.2329485638587685,3.0233903583627217,3.372966165147751,1.4982167230487273,3.16472260915032,3.4267164965437638,2.8927016122095335,1.7889455771030218,2.356535434741701,1.916262878444005,2.3384998964009864,2.4301497477585015,1.3418490917641328,1.9867167711811267,3.1321027702253246,2.39824103629197,3.309847285310438,3.571116530933568,1.6591549937800323,1.3997384717506351,2.656253874459321,2.777884706882391,2.3689357500013766,2.6692026659345975,2.0255473785610656,3.4843418574548766,2.4363899561926745,2.1013961198793933,2.161969408757008,3.537389797452328,4.816617389757579,4.530512577012261,4.510346530396831,4.766635473095236,3.7805886554760053,3.8493404368971444,2.899969445019024,4.909864334884418,5.017200179520097,4.843806629536427,5.189646524812244,4.68656123374297,4.219383435871922,3.67090233675697,4.464340606578764,3.881901229104268,3.4181080960902763,4.8643601577569155,4.970466894584514,4.954864232402261,3.7046410330463737,4.809986144923801,4.038445651369544,4.685679228787057,4.0267510520922,3.7385550033799615,4.741649644934147,4.347393859310178,4.251920663922857,5.349821339861335,5.426649554693996,3.930626826741177,3.3311090733552033,5.20329664921381,4.66044108055397,4.405169480209312,4.9562031332005265,4.190683208795894,4.752778036505177,3.9174220552231893,4.690626544293665,3.7367952370592077,5.472587173486268,5.117483027200771,3.5516985420231975,4.978713716764508,5.315906217651893,4.583573079900207,4.755748325829891,3.606571895569481,4.289814550049199,5.200703394260389,4.3602615179343305,4.21576233249021,3.6572079952320466,5.390606426281542,4.387867649433451,5.354877843613254,5.398534206721309,4.505614505182921,5.144015948651663,3.610030554036838,4.192559510925429,-0.40690798784417,-0.7411552303456995,-0.5761324179020547,0.28194862782545294,-1.0288942493659066,0.05827613702038313,-0.9058369234776464,0.7548850468654459,0.7077078145144858,0.8094712865706447,-0.3708909780479994,-0.007320153289078519,-0.22093423110942584,-0.8752536269438383,1.2360348869505098,-0.008269696667965674,-0.23249617984543244,-0.4626060745437796,-0.22826858078212262,0.9108048059171453,-0.08890844121633476,-0.12008629214307888,0.15504382492300894,-1.100240831256286,-0.11217159226769137,-1.2865338649334876,-0.8929608413572225,0.4822375200773821,0.7835343408000268,-0.39554470219608545,-0.22994322941449755,-0.45734304601982806,-1.1951939047255051,-0.7034955492141579,0.2891795735286293,-0.46204869230420764,0.27827119814227397,-0.5582741059965303,0.9985159489080663,-0.5813831108868408,-0.1799789683384958,0.7792973550534928,0.6926396076689162,0.31490274477032315,0.7754004006443231,-0.7750691005779344,-0.17226907516956744,0.40585691856703393,-0.5193654825885395,0.17617664115148224,0.014078118420252585,-0.33824527610817035,0.48457653706164516,0.03522298995554193,-0.7431226660858208,0.5708842126428059,-1.1485413110317793,0.1846644298034635,-1.004583892158089,-0.17887884144334015,0.48977784024433146,-0.507378334194765,-0.6558562413873958,-1.1149595020187262];
  this.h1[8].weights = [-0.9305423197968845,-0.4767499144974998,-0.18809504996710524,-0.5243553873564633,-0.7042652379318057,-0.31996838917250514,0.7848230811242756,-0.19021109785120993,-0.7748524671072426,-1.0864549757310082,-2.1285585992874863,-1.0478430289645033,-0.6244992590722868,-2.0090822018391035,-1.2633749953616469,-1.7886414420811567,-1.7442879385840717,-0.5574651701199923,-1.2563334302346907,-0.9674646490597771,-0.23729013319805586,-1.6995246234476487,0.01040362495874591,-1.3615386846167725,0.09757837305897421,-1.7324087918887077,0.18719387404935292,-0.4766780865931351,-1.4237762607172253,-1.0923687953980996,-0.5346904892444039,-0.6909134885642403,-0.6860355304507931,-0.5041297704604984,-0.8462478679903561,-1.115145962066062,-0.7107778638021336,-0.4881486897232792,-0.7079848735525162,-0.8006353867953014,-0.1594236853361134,-0.5468007285263703,-0.06178734746802377,-1.0093585218584196,-0.5008085694571593,0.4243098563974468,-0.13756736224542823,-0.7434737809323481,-0.4470170219548128,-1.106866899021536,0.305403605947664,-0.18211460695564038,-0.9465615933876889,0.14090445127196072,-0.42961880645807077,-0.8681762106482764,0.2578165847698761,-0.37331822784990676,0.008013114514420216,-0.7565980422435463,0.0597853898292775,-0.01484181862494438,-0.8962216480058087,0.00916622810951262,-0.6412886392520246,-1.5710718861849922,-0.8019339234600771,-0.9652212484619145,-0.3598264188659417,-0.5397384728660859,-1.3731494221943805,-0.566391118009406,-0.3617290759872426,-0.30465502223279595,-1.8613910264792275,-1.6726419782166317,-1.5796971275149736,-2.0444152926845005,-1.530443911672041,-1.4289392741894538,-0.4510097229707812,-1.883238900570151,-1.0218222300487525,-2.1101698383623333,-0.4138710108380045,-0.7901502435694419,-1.3066873915167365,-0.27205744772702445,-0.6700261912695958,-1.9072534548543578,-1.3280768810903325,-1.4133547558203885,-1.4603996655709575,-1.4714758873802138,-0.7616634717243564,-0.2262869710730271,-1.9463724679804542,-0.542597774056499,-1.0508490138188662,-1.8578376833584522,-1.5446164198497363,-1.8894530224939927,-0.6824712136367348,-1.758715762706154,-0.529598895732524,-1.3622567975294317,-1.7513466731491854,-0.24666838053753518,-1.5906647747005396,-2.1415751770670495,-1.9555586314025313,-1.453311872475529,-1.9751244162569142,-0.29866726545981637,-0.4345278501970662,-0.39813892318561134,-1.2364272859496857,-1.3523284678157048,-1.611115384326881,-2.126035000422253,-0.7701352493278254,-1.7256538776365624,-1.0321454618885444,-1.105021971114848,-0.7129023539282046,-1.7063917639793065,-2.178127005878457,-0.5489746010171169,-0.5043007579867465,-1.9606259506837265,-0.6071425181498272,-0.9436888416202989,-1.1269115971267447,-1.1790096661605614,-1.4646852893202273,-1.9822924344866983,-1.945570998615092,-1.2524332782956222,-1.5928123300876809,-1.7438482582981611,-1.9629239485559251,-1.4470541669695154,-1.9338824055527037,-2.229954511021076,-1.8775008010966265,-1.6082604780223013,-0.9776049212958052,-2.083695941330809,-0.6155541445468264,-0.7778031748087154,-1.0983846736923868,-1.7121529413165102,-1.7434073352173154,-1.4105512744846378,-1.6341367442660817,-0.9190414151310279,-2.275585102981953,-2.189458063733926,-2.129580707756127,-1.5373419821368204,-0.6514315772110827,-1.3304972780248134,-1.9408929194669515,-2.1256154013248443,-1.9117562549852771,-1.7040714143675448,-0.7808760649339306,-1.0848550548864047,-0.5040070249980767,-1.9761713044026767,-2.1850138816872495,-1.469476059116739,-1.375496852053675,-1.5891058381411272,-1.6590731121945832,-1.1652040676064999,-1.2761839479417485,-0.7106864087798016,-1.3408729201525849,-0.8790124741131298,-1.3959811707760061,-1.9599258768147299,-2.1044462215642463,-1.9685867614018089,-0.965134989141318,-2.267660538585346,-2.0302580082442323,-1.3944082659000938,-1.0844237355515727,-0.5892418591056778,-0.7547970095718675,-0.45481396696559145,-1.9756224851943398,-1.4572076578552315,-2.383683403234865,-1.843083020436279,-2.1266753501567277,-1.7673332771568224,-2.1916582609918067,-1.6968020731743632,-2.6621734110705253,-2.5794599139357364,-2.4011209301913863,-1.3897324098397477,-3.0649616409960845,-3.059951582843146,-1.9226988468337185,-1.4187979641638466,-2.3500885998952494,-2.059600795433044,-1.7461941985458964,-2.70403110776493,-1.967177898419549,-2.7644706239131955,-1.735483181991511,-3.1180861886230704,-1.468217021539541,-1.7205715037352143,-1.6461357615047865,-3.217819379210506,-2.8971604664568242,-2.500634208352768,-2.3522521600109183,-1.8379279198408707,-2.2189252826640478,-1.9846857059813054,-2.9413432975383325,-1.6653176286482174,-2.466117686123563,-1.664729013257504,-3.502987586277221,-1.478594520222176,-3.1627234268493876,-1.6611654303490542,-2.077892348988734,-2.8048657150455343,-3.0087791981641105,-1.8930458914317445,-3.061768090007906,-2.5410200839941672,-2.5941291814225518,-1.770227525181027,-1.357103403365233,-2.94944861133974,-2.316543429060491,-1.6774097976088431,-2.518691608384384,-2.337996924728055,-1.7792728804336184,-2.6763699941219334,-2.7572831023560185,-3.1633989100531967,-2.575898629591853,-2.496781225530452,-1.9992749896103104,-2.430065528927851,-4.016988577499251,-4.3969816966211415,-3.546215022742694,-3.353365496509592,-4.956826912085483,-3.268419694862168,-5.153282659296433,-5.156722840235647,-4.6521922477305635,-4.618391671281576,-4.891616226665218,-3.851665818778183,-4.293998134949123,-3.577694821141913,-3.371336556265336,-4.372605376314466,-3.427851127412065,-3.907215163396706,-4.27985292246815,-5.144830450498525,-3.8169116513757615,-4.24516202009576,-4.642050206844992,-4.154645767529509,-4.239354793424551,-3.954164895372085,-3.4424649768306455,-5.2714043846196,-3.6151059235718384,-4.662564594796503,-4.677048952199036,-4.95801433087982,-5.08553084089399,-4.794604108428178,-5.182641356215426,-3.434190223233737,-4.47501452449696,-4.1470936591006975,-4.101699091160876,-4.55219325762318,-4.707093254328372,-3.636907940413308,-3.6358050250023703,-4.646858452884543,-5.255001423690621,-4.0728465513539405,-4.196356276914806,-3.628801211155072,-3.9700657428894277,-4.271631875361894,-4.994077901009642,-4.149243153057946,-4.129991259803733,-3.9066328941839377,-4.247508072530722,-2.953234236282962,-4.2651720538754025,-4.314226823518353,-3.8760237800117046,-3.5760051145579,-3.3370480152944784,-3.932570836624607,-3.2370485733293544,-4.054803645480618,0.606693072994973,0.2976450074311251,0.4152582217921745,0.2019903522101153,-0.1087902031943121,-0.42143615589123457,0.5250419363898196,-0.19985218786046352,0.6544212510934411,-0.362574930774788,0.835914355990125,0.7685352572972998,-0.4028919345948847,0.35839604802486463,0.0729742418846457,-0.46399497333665346,-0.6443589152672873,-0.6850524073271668,-1.1580719132678094,-0.6555872621436217,-1.0538536896579407,-0.5165529708400942,-0.6777371748268846,0.15667706927780942,-0.37631328921894447,0.6515019416378737,0.02614806622166114,-0.6687073762622557,-0.37073409053129724,-0.48750221923812803,0.10679187301273614,-0.1629432501329762,-0.482716233466199,-0.1673012946594503,-0.5289876762311908,-0.3310454409278333,-0.0023881748348493406,0.8742190759728764,0.04274247821754347,-0.19470883205695913,-0.5229974102389204,-0.23105383704967072,-0.057949624767003535,0.6439013287096774,0.42536964579161696,0.2762558754069754,-0.14797413568299703,0.47158259041493356,-0.8927331166823143,-0.4019229806997178,-1.0449214750237028,0.3546026355196277,0.6295039357517724,0.46131273805055795,0.0840286267103226,-0.3270312306796394,0.39451138923580603,-0.1952156850598613,0.703096667095059,0.4242353024127179,0.018645301132969718,-0.7976985076886423,-0.7045428870090298,0.5105418353419827,0.009718800465938315,-0.49932921356305204,-0.9503443767864499,0.4011473554057785,0.8351164757280634,0.7422155204588523,0.3429309409139063,0.061998832077442945,-0.1716599541854045,0.4287921277972104,0.7058971789790108,0.860528114783805,0.2989659741001394,0.9803221464117089,0.6766378656837417,-0.7147238742635142,1.2331310406325235,0.25629741240548987,0.8018488647691623,-0.1850256759459631,-0.3038501745874299,-0.5136390164413861,-0.5796532992818293,-0.7202470462652937,-0.0429107893718812,-0.26839718853445255,0.4814559993969215,1.22118336784614,1.0594774535547469,0.012430723366890934,-0.39460837032810026,1.4042589826686485,-0.08889420074248199,1.0873496497428286,1.4197344959684368,0.9574657698248132,-0.8130757291327065,1.1021116430014863,0.8050572634030215,0.2273008615017373,1.4029196948285994,0.671345107106688,0.2744545354586454,0.3921540370071784,1.184776474520407,1.599093805038238,1.3068126419345478,1.688341636827945,1.2076907636466798,1.360978519658726,2.181716636545048,0.4206833461714501,0.8347120220408254,1.794706250636823,0.4906403912692301,1.5219362641287886,-0.9836149992844998,-0.859253475379762,0.3025311740430441,0.10173063888015577,0.4195632022201585,0.7552151308455355,0.43390962721855386,0.02929755009455981,1.1284783963046623,0.90028149322391,1.924498105524545,0.6457703563991358,1.8298016736356792,1.3595559467913902,0.7448483344105202,1.7316184069128002,0.3258300555451484,1.687402951251893,0.8051706539777556,2.0257909348157437,1.7681896417276541,1.9041873353497878,1.1512562165673152,2.070067046120152,1.3896395295383503,2.121892487974607,2.2355816678459504,1.8491016706682748,0.48363161859433945,1.3864244496056635,1.981633551539014,0.16016172144242796,1.4325252099388788,0.341858613975786,2.1893653113054157,1.2198705470016322,0.9471614281204321,1.3544159457965874,1.0287679548620543,1.4583498485597728,0.9872417555518866,1.9692396993002226,1.7099275195276582,1.8070896947457158,1.414939292912539,0.8458833034436753,1.3509625818613038,1.7853248902026628,0.774110292702178,1.5209870838843067,2.0892362890432006,2.0817017722277913,1.1170616033051075,0.9712007713309604,1.9391892922249048,0.5619882762397855,1.4602868913603562,1.874865818064552,1.5650238723885879,1.191798391966302,0.6582025193508388,0.4071078464846874,1.4652987458858349,0.7572420427487064,1.3067656594648753,0.6037741788733823,1.1383980859542724,-0.0060595413157407884,1.0655123071496173,1.2040823447450748,1.3682498251791915,1.1486428946661857,0.8179514077736418,1.9165080057471782,0.3083055125243148,1.5152157738743062,0.9259417679801426,0.8426363745763459,2.408599095039717,1.7001834344818936,1.1492645187027506,1.9153991446277945,1.7966397376415035,0.6559078595577786,2.397906431511268,1.599511975518662,0.8069744556425026,0.4572965470312791,1.3540033580490631,1.2650925017175105,0.7547807811822488,0.5298675769976336,1.1757569096507214,1.9985461095051926,0.673596712575348,0.3933298763784673,1.8542744153695094,2.153724081032865,0.5863177318661857,2.135905572216908,1.7189499449417314,2.5210434535573287,2.0334890879890524,1.328394458465059,1.4115271838719883,1.6149085185516816,1.9080779591848636,2.4645126074240173,1.8676414056760622,1.9744220673080253,1.3320145934513998,1.306941748635282,2.286098890294922,0.8871451811308451,1.9588031985141208,1.8386438057068246,1.640802696095832,0.9092292876186018,1.446888875675308,1.7448283095485628,2.0173222394600394,0.5898161056816926,1.255424496877973,1.5348771441643534,0.8146919850216388,1.5581717639201167,0.7000370676466204,0.3355461118723583,1.524012452627828,1.6511643374924048,1.4492074200867182,2.361934711217206,1.0321158131036747,0.4086860350227704,1.9986216903160672,0.38681529626816136,3.026066653262507,1.7635661694093747,2.7563083206386074,2.139508082083025,2.282611350765497,2.254505362179631,1.8321123936670625,2.9314542387774924,1.93661002296326,2.870756693349386,1.7098476832908378,1.6710627840261434,3.2682809282120453,1.740447781865674,2.4219588560700336,1.327915313082336,2.907510217612314,0.9145505422597457,3.0168228986911285,1.662960480200749,3.1931635975928048,3.056405229543876,2.2357317200703366,1.8442883971518367,3.027961246936436,2.1013083232167875,2.1627614058517186,2.537231581703334,2.2659058262778786,1.6504165128132624,2.7873140937374266,2.7236070777656023,2.669515550907541,2.0175090550569603,2.143350671034683,1.1761003431084105,1.564086820259808,2.473376066670401,2.585262644859447,3.1846193023489033,1.5735503760330471,2.5853968822862243,1.516882058993041,2.765803440173559,1.6035875143914076,2.1849680557930613,1.7545156262680857,1.140224352255971,1.8047877828748906,1.683520539155967,1.8797960029297698,2.8501371538787494,1.952702356332773,2.6047431718176943,2.912610980931202,1.4110659338024332,2.0901823639883115,1.9149702330472236,3.2654497383741963,1.7558596039138934,1.7562625079042626,1.711634207131153,1.4714891877272422,2.7558576836494435,4.154582128147275,3.2678371296964626,4.384046868262103,5.059179511925031,3.775607341796873,4.620756399051425,4.104903612077482,3.2977493951061323,3.5202917014461326,4.361415016566962,4.703041213894422,3.9519926282791165,5.228186771576074,3.318124290947135,3.347055472839922,4.105202299723785,4.390344743483551,4.406374708629773,4.005050554639074,3.9664783407671984,3.509639233700838,5.030629205621547,3.848207680598052,3.9279436694994625,3.4621620194401914,3.3038736115834015,4.634837869648949,5.107168648117948,5.118976710394452,4.993665520536906,3.9874966589308865,4.500065666535029,4.680123682429281,4.041099438681949,4.630709090080415,3.5546176601022315,4.286637436072524,3.257539677389204,3.781446070996152,4.5293511822933485,3.7610383668623872,3.9573855690734563,3.924834265233154,3.787631463853219,4.29738760678908,4.195738122405447,3.914272919227289,3.8263395975543437,4.099859501577931,4.412269717144512,4.507802445120154,3.3638498691309535,4.641831280429645,4.615580877865271,4.074586422033697,3.3712377634623207,3.6601983757971306,4.742490458557757,3.927185661254644,5.012707834277278,4.802381122825671,5.050819194445689,4.7896202177167035,5.233595847788004,-1.2111486705212198,-0.6863937475840458,0.48168030807264534,-0.7805063075451956,-0.36778329622038397,-0.45882568585968164,0.169018803505712,0.06743831622943175,-0.37356108414239625,-0.18091974829990906,-0.3832548211293155,-0.7275805975659058,-0.3264131839673801,-0.7493888109143213,-0.6098940432200368,0.9640705966844424,0.5095794628013609,-0.42654229398390553,0.3406257035088507,-0.24364449470192118,0.49718996417759204,-0.5015093010255048,-0.066655853369998,-1.057305383935094,-0.2394214230777291,0.16530559390324545,-0.11074567305320933,-0.062076050704108786,0.007354886186846622,0.1238158701239861,-0.4420087476653067,-1.0238132332554841,-0.5456868718802003,0.3606654667533871,0.25282975907587785,-0.10112129573558161,0.7685726421501731,1.0150300951822617,-0.22111837905090007,-0.7792328513605954,0.6581728094421144,0.16234255734111136,-0.5852208591813723,0.027875472531385614,-0.013806599228595789,0.3277070687202077,0.9263194420174695,0.5991735216892129,-0.07873926950044459,0.5382504964447867,-0.888887865816835,0.7532589530873914,-0.28698148056150524,0.7017493891088578,0.34443522317597236,-0.10013922256267059,0.12698791337671028,0.4264305073225535,0.3309668543370116,-1.0054085213935628,0.6866960047828096,-0.23258048094312925,0.17516998901951142,-0.999542110866609];
  this.h1[9].weights = [-0.21407331468652835,0.4082844749244061,-0.5347271158027085,0.1345432092942418,0.4249563485576098,0.9649548203451306,-0.6122759615261986,0.42540132656260177,0.06585246882991092,-0.6131664536039386,0.24558282812519602,-0.41159608501565714,-1.0262480028070555,-0.6581988124232462,-0.3240778306859719,-0.9175538379109159,0.7449897957933276,0.4845218380108784,-0.9525228251258804,-0.06582807113224422,0.6909389128086312,0.09631110389174365,-0.6095181168797493,0.6666997543462332,-0.11090712547652179,-0.7172703063941265,-0.5693276259746565,-0.6638316544743058,-0.6554382834869261,-0.74467444682742,-1.0541649242700564,0.7645166558160269,-0.5758405365736574,-0.1770365127082401,0.6513658527030285,0.33411801104358957,0.6247699879274404,-0.1097204098145438,0.10122913969765956,-0.7793988922557221,-0.8982632255024409,-0.9122991899024031,0.11848926465900629,0.23395977145920904,-0.4227980460586233,-0.951421198067936,0.42408690038836067,-0.18481099189625186,-0.7457796861518677,-0.5959679261951046,0.2705796950304797,-0.8200209657139684,0.5800186778259359,0.16455215563015602,0.6299525283641353,-0.02050066046631049,0.24972416303847433,-0.9430783022738809,0.3729694401953605,-0.8373532927160379,-0.37747574899391223,-0.1621667889359153,-0.3468705499201805,0.40445364581910104,-0.46338993575307275,-0.38341853278354787,-0.8347264206328251,0.6409993415917999,-0.6202455695706806,-0.9732754307506901,-0.6550833972621587,-0.31019749028344196,0.44190963359032853,-0.9312901940990972,-0.8827194778248989,0.578928539231588,0.5313231940565234,-1.019160303535013,0.5823174607843433,0.577939625457892,0.1292190538817585,0.020388762277566395,-0.22466183682944108,-0.6005177470842721,-0.4778665003095452,-0.6063220074550316,0.16329541960775038,-0.7291828995754419,0.3616153707845658,0.3731067861725752,-0.7703938032670874,0.5592725215410047,-0.7444141872021027,0.027601629084873857,-0.3719161595178394,0.23228851455587202,-0.47914256086777124,-0.557379685262035,0.4423657888520984,0.7368312167526566,0.7898616223537676,0.46608890167435535,0.12895630160251823,0.2844965872018577,0.1562324510613924,0.10786155812251776,0.4004450723330819,-0.32710423049274817,-0.042517982889443216,-1.0819348456220461,0.08027302785961217,0.3950204505918226,0.028183621314080424,-0.9238771502635826,-0.03595175942012255,-0.7091895861587798,0.3894838628378137,-0.6525585375354548,-0.9964905839750411,0.35019092034852717,0.9115851694380848,0.7015538693395896,0.1860600935816436,0.5952817089772002,-0.8740389072110665,0.48275827256285514,0.7479382232380106,0.7118296719630007,-0.40073173585899724,0.7433277228719988,-0.6256890820416269,-0.6576309454088696,0.515678009183628,-0.5224373832776184,-0.02758733679034492,0.7900626173926498,-0.7386357843915548,-0.9898953786427412,-1.0299451166088898,0.19313950054251194,0.7507256282658219,0.652288505243895,0.13553506399563334,-0.8886092692375359,0.4505766342792503,-1.0519230816285814,0.5083300131502346,-1.0113275265400952,-0.32225937603469607,0.23527304543946853,0.15359300834757034,-0.7854795190691236,-0.2523778568447996,0.28417561254380724,0.43450744767454014,-0.5510598342520054,0.126745302991285,-1.1481263880445554,0.37930252497871436,-0.5859179697542984,-0.6842118334367889,-0.6399375828951237,-0.527276450990253,0.32340253585018836,-0.9276701128810951,0.6054219114367476,-1.0890105594632977,-0.0742294780152615,-0.0756932792164727,-0.7580531078089283,0.2059425506551432,-0.10464735384530961,0.3519947023699199,-1.1350479762346528,0.6990242590448724,-0.9881643233527617,-1.026936232949457,-0.9594688944786317,-0.7936097470532799,-0.37834275164602005,-0.6176874552662842,0.6846285319164347,-0.9967949286904808,-1.109581886513803,-0.46596895602186156,-0.10403462024074515,0.5297413317046089,-0.5058672643915015,-0.9851586614231546,-0.5984576648724852,-0.3673552423189592,0.533441240016605,-1.2209868287045418,-0.7326358750003881,-0.43844618563608007,-0.3347111062125961,0.43326687902789673,0.31114841259354437,-0.4734914853547448,0.14830533580255634,0.031088712820942808,0.2183047030746588,-0.42387292454461595,-0.07662936076121557,-0.8722397722683456,0.3676795070267557,-0.21558468643520473,-0.4232655450543199,0.1831342011791475,0.0032170876126765167,0.49737005570261095,-1.1144323225200636,-0.5463125753348712,-1.0609714365006058,0.04694186547402683,0.10357542226101282,-0.8601454194922955,0.20329548346684542,0.2960423404368906,-0.8527628347027163,-0.9055976826908932,-0.11096432776993152,-0.506038651860522,-0.22643834234224974,0.15477844210903227,0.6088339114267562,-0.11212566308724778,0.4046659194758027,0.5318840875741125,0.1709561801089852,0.010024130347208683,-0.2819541648004852,-0.08712543932497517,-0.5819092464657811,-0.8051525623630618,0.2051105148166432,0.46683754919515286,0.04634014492876822,-0.7179236262498806,0.0002536977984556226,-1.113364893399052,-0.6078861430991281,-0.2983461137104274,0.37287274226920697,-0.05483165249329232,0.5047589558774056,0.40476593564067775,0.765844423645605,-1.1809620029893881,0.18920198530295407,-1.3205784514691021,0.393439988977138,-0.9062266040086977,0.03914711423948955,-0.11787384924889058,-0.5588844563809732,0.24303385795674579,-0.7907499231716653,0.035568382972661905,0.31749076634512663,-0.40867988252485316,0.19243385030922042,-0.9232729477816775,-0.6167451694827496,-1.3415182125523215,-1.299183185956276,-0.018632857497256194,-0.5172488695745262,-0.5087965011978779,-1.362313391104446,0.004646261904442841,-0.8788101673105565,-0.06659030651238888,-0.42973082496072285,-1.297168797393336,-0.6170394786641755,-1.0531610588056606,0.19988793412940523,-0.17996947592781315,-1.1571665273924567,0.2301167640899527,-0.2816785424762699,-0.9036977839727939,0.28195997034680115,0.3878627064836889,-0.25231758193837545,0.068296021645242,-0.5625209758191296,-1.2418078129055208,-0.5405882717915594,-1.2847241971188883,-0.09405150985479128,0.2043509265658879,-0.3814532546099535,-0.9939069302480278,0.1988038503404291,-0.9187923492345744,-0.40223341493274906,-0.19681166942167128,-1.2203735015635648,-0.04218808457798233,-0.49288750847784907,-1.1457606424773825,-0.5466057307033952,-0.6472268974483577,0.13342223751259,-0.28506429113394094,-0.27069660195175355,-1.1858610245399506,0.052428892291442576,0.46624958439235975,0.44172491012842596,-0.8808153315209205,-1.4041090600615485,-0.032173762588479725,0.23429479478772702,0.0172523607087445,0.5079100419707835,0.0695950456845015,-0.05353119177522949,0.5569396521488725,-0.8501677476815845,-0.4639421103590773,-0.9555562809357087,0.3771570538505391,0.4769693963781045,-0.3932128795924439,0.7386398023316857,0.6395784341132437,0.1402288535820359,0.08621446348898985,-0.8566887009800507,-0.9333920396096312,0.6105216228627981,0.7769351693045717,0.433050832855066,-0.22955703197942579,-0.42250630353851265,-0.27143373681784183,-0.17927699003327777,-0.7467236492771095,-0.3625395215947394,0.08919049123262737,0.2266631798868486,-0.834001103051351,0.35133865914505363,0.391988374922039,-0.5401975104127884,-0.35043918752197517,0.0289798620568451,0.8444386480053863,0.15245669853068441,1.0281119281501092,-0.7750154298613627,0.912874655953527,0.25061301110320117,-0.39956204207525425,-0.32831219284582686,0.5939830879521178,0.01781365280593182,-0.5241068580254797,0.4778632294678362,-0.6615076515347527,0.7263635400809841,-0.738938604884612,0.5547767483709785,0.8057554017639855,-0.2619703630730754,-0.3828777022997963,-1.022810874753993,0.28745867253044716,0.46311645895637604,-0.14577058385012398,-0.4685481998585223,-0.42185084917758847,-0.08616665797720918,0.45975973362136446,-0.850983453317498,0.7279647077236766,-0.3772167195567394,-0.08007025339142841,-0.5387927675727288,0.4373772544389488,-0.3125361269763942,-0.8122160351271264,0.4956215638113539,0.1748288135033942,0.8709303796458165,0.7351528769474678,-0.045397211493127365,0.43438627169501753,0.7764368493070899,0.42922999676771867,0.04736536965960577,0.1896426127162229,0.7383714965629121,-0.8405867258285655,-0.19768099814884432,-0.8851905604143251,-0.8231680570438165,-0.5553357665238237,-0.5029215535902788,-0.006101967277958763,-0.86468430287939,0.01413615508894411,0.37582091637759624,-0.6413281113206328,-0.6426953313031044,0.12829877487683095,0.7784402356036909,0.2237802594976478,1.077197543970104,0.6837920245330849,0.35986545578332246,-0.466255523571141,0.2095680373458315,-0.7703296462509012,-0.7080367897863866,0.5006179707365274,0.9924024917271428,-0.45487109533822756,-0.2187590742206819,-0.4115688521848397,0.21674641625217142,0.7584380917729397,0.22024393499370493,-0.7961545611757924,-0.42232339958408044,-0.5447008443679758,0.7492247860604024,0.0028815490711042472,0.9573919401030574,0.06627958623768888,0.20543890731596268,0.11060535311039336,-0.0173176967202549,0.08816488966361764,0.21785090351231284,0.08407189618714297,-0.3220343824647986,-0.016958162248585484,0.8990492351154722,-0.08398962393471754,0.5208533448195838,-0.03612236962162152,-0.5130408931292312,-0.8978742881202413,0.4125930141057266,0.9261067762529595,-0.6288120891880941,0.1262281752858774,-0.7784194641787243,0.08393371247630993,-0.307848361969473,-0.7561014783452267,-0.8508827082598787,-0.20082749056529692,0.3950005262595706,-0.4941570881009381,-0.6556446543537345,0.34847790128640643,-0.5225801433539886,-0.8174475406902556,0.8079730833866868,0.014096798661495623,-0.7545281299758824,-0.5119244457447121,0.829145034646581,0.5965959612615722,-0.4227316312758537,-0.6627358108406436,0.601444325715231,0.014548974822786678,0.47530193774871854,-0.11973361817731003,0.19345157480239597,-0.17476329520813796,-0.5681204994778811,-0.33338101668014275,-0.7305325710156083,0.8121995424425024,0.6243784974945161,0.13445498576257844,-0.3652267127472681,0.7260063119629445,0.16124654207391112,-0.3128466862883051,-0.8679504713369197,0.48211265804927833,-0.5322217590945021,-0.7264185624449524,0.7168532845638219,0.9027810297591802,0.5470721746848066,0.4457373088647059,1.1038535467192145,0.10882483182004699,-0.48540588953918584,0.20814100490349138,-0.6524300793464992,-0.07983721777426878,0.6886762236973648,0.5846251207118874,0.8190005049165807,-0.6462621872954369,-0.1578658753270154,0.04622375141108338,1.0297866971054577,-0.27025500257732865,-0.3674903711936379,-0.4596796058449179,-0.6397929451739549,0.7891066185698421,0.3702846639509643,-0.8476369812333303,-0.1408602908055178,-0.680119417634125,-0.5293927409853968,0.3353806792056463,-0.3292941646013466,-0.5668463599520702,0.6535040068237885,0.16469923023254007,0.8434112242377436,-0.3835062956398173,-0.14110004581681282,0.5499753111996092,0.3971545068004079,0.6403158334202357,0.9581714388669228,0.08672603660463218,0.271408853077472,-0.0833776107937409,0.38970953293481453,0.5558547711843513,0.6591933922200613,-0.050134299557172135,0.954410824535035,0.44366032761169205,0.9928071421724167,0.9185890308407728,-0.5964829054439633,-0.6079317414074321,-0.1473320687878294,-0.34108257192535385,0.3419019240772321,-0.7012266983585018,-0.4793884748442552,0.9773186190338741,0.053610955708058905,0.860509446702736,-0.5435045601639549,0.12300390170073398,-0.2499363304056179,-0.3579804389377116,-0.21241970594716492,-0.6268081411683359,-0.41252195377787754,-0.8610811541933581,-0.4494078274625949,0.5391438880802603,0.4977191323080669,0.4517681099166908,0.08829454553614301,1.022380331196908,0.9063474127386028,0.00897240697239705,-0.8819309533719505,0.39475306639678076,0.2515797775348945,0.5016287458192454,-0.3873401125324706,-0.07660430523751383,-0.8320134851681433,0.24787388664995175,0.33892436029185374,0.9027876689393057,0.39543402770354785,0.03766311043404201,0.8165383068975773,-0.1542457226442085,0.8278166760585747,0.6553547421883787,0.15862155741278122,1.0148927677313693,0.4421112493344021,0.5578560372341648,1.2377285232790298,1.0265352873544265,-0.15162247649892638,0.8719319032168391,-0.6100857051849043,1.0318254429927194,0.8063031406612164,0.6520042147768624,0.6867659756331951,0.9673923902466285,0.019018527006476355,1.0927039836140537,-0.5985223391917824,0.07094864711333691,-0.308917099448091,0.846375963738429,0.9439689719240114,-0.3266256002987623,0.726608435979287,-0.17185451599279525,-0.28440356913993964,0.38194094932448114,-0.1533503196452519,0.5824280732523478,0.023045526080611087,1.1481482634120934,-0.5375314223426237,0.00487828932811359,0.5237315201303704,0.38365664314128034,-0.33341607978549515,0.42568235953054795,0.3604614784176363,-0.11168357599306203,1.1368991067030683,0.9724314446937365,0.9736580633691647,0.5981084518699689,0.1695988767228997,-0.6108494721183826,-0.7054103018140332,1.1385542130418005,0.5559112998288624,1.1055922155327174,0.8936672526556133,-0.248199913656637,0.4405821564401614,0.7234705272004417,0.0004191261000345494,1.2432661663496056,1.0164645304654774,0.4386816537395235,-0.5855074823555545,-0.33761326839745986,1.181318257085547,0.5900143044355536,0.8271354760795514,-0.23482790326793834,-0.2536618823318831,0.23142600376197472,0.4303016077828572,0.9348989318028876,1.3182211341983967,0.31443585006621383,0.13271668070442105,1.0268248810042218,0.32276056673426906,1.0579494465616013,0.715700840465609,-0.026497116695888112,0.16447871656461752,0.20639851948164195,0.7364827217808593,-0.04054523640328729,1.4309556175793572,0.9238741056042126,0.6137724803812104,0.6192464451318728,-0.16161099015382205,1.0953180019725208,1.2263873248862687,0.546918779586825,0.3561901832736398,0.7913769009280943,0.46413387477967727,0.3219350724558066,1.0237439690754604,0.5553180233305846,1.242845505979538,1.183831924186171,0.2049688247926765,-0.330797222555495,0.08758801860249221,0.0515309961780764,-0.07392664303573784,-0.4630128391451583,0.6654096308763956,0.8093614244373748,0.7750516395389934,1.253457568916287,-0.12395841625105926,0.37309593402249264,0.5153465845793858,-0.34919342526023833,-0.32897324227956365,-0.35316823004068176,0.926848985446166,-0.41960950416213283,-0.2934901183083357,-0.005299016275536266,1.1960491017521229,0.48172519396016755,-0.12164133035582705,0.11146631303067948,-0.45066168874291296,-0.4570813219420732,0.3702133856846202,-0.2186285237102688,0.19006889362762985,0.21880132552946607,0.012346309179186872,-0.7875373940617202,-0.07744321359237324,0.6891670961693191,-0.04880165752356613,-0.017168535965969806,-0.05568197029831693,0.8508776522166308,-0.21449636072995487,-0.843182160676702,-0.19830758788110886,0.40354509279497286,0.06427883406545805,-0.5392780467079256,-0.030726980149055942,-0.1370037026041819,-0.05417272942654496,-0.9900740062665655,-0.7652891035179747,-0.7208306910382232,-0.9149583546168516,0.37477226908957,0.07976142821251025,-0.36225413832245135,0.2416448589059255,0.45010422666449945,0.2823889672360795,0.2106078869166708,-0.9957938345101214,-0.5558605059386296,0.5425885152505682,0.4264982638407806,-0.286735355076447,0.8667505285597114,-0.3507035194640163,-0.9140372154359684,0.45283610665874185,0.37826130483802234,-0.428462985564555,0.12280975094504967,0.5648256340684957,-0.2872196686992272,-0.1182965503075038,-0.8372309324334796,0.9925451980910998,0.3217943508213137,0.992816050274316,0.5179720475873878,-0.8543662374324773,0.4689968992843599,0.8583802718354514,-0.14343377871530802,0.5280645898127427,-0.037990393510874985,0.505751690397073,0.6896621946312325,0.120458600640185,0.8878357762847092,0.2456375567138844,0.5594622814928569,-0.43794162505898804];
  this.h1[10].weights = [-0.010422300580343435,0.31804373340827174,0.6724495888244695,-0.7622362665996212,0.9006577089511798,-0.07720742074279263,-0.18988087502873174,0.07763948326449155,-1.508317690503,-1.464855242118751,-1.0196831279386627,-1.1256784295304794,0.2811880361512402,0.09324742718459124,-1.2189323972580073,-1.3898270224735596,-0.27932097936987266,0.21584373035614737,0.0008832947348585214,-0.630665691074721,-0.4172141886193514,-0.2992480173715165,-0.6846785898690813,-1.1568170198009624,-0.8557473956146354,0.15648674703650303,-0.80640604407585,0.5787782374908669,-0.4995629597752942,-0.4063368190692375,0.6788724315950677,-0.0933344086274962,0.15325899858750894,-0.42091354857371077,-0.2897542496881831,0.17942390977752048,-0.7343310735568122,0.547429987069067,-0.18880678150827268,-0.005217331882568144,-0.23877966157621777,0.11206239894296222,-0.3495509324469524,-0.77102817206776,-1.028719672398128,-0.8549838126075071,0.15453033225537355,0.12360636303401086,-1.0180106000047973,-0.755559873750778,0.5807718977841756,-0.44990606127635496,0.054012403406888836,-0.4861721074178222,-0.6236500133477942,-0.24575858272343973,0.6051082509020205,0.3020167398467053,-0.5426174836761035,-0.6897099655319927,-0.9586570035075477,0.545047975353099,-0.4360922494639312,-0.5916660486907506,0.4894872117882462,-0.6781911763456203,-0.6369775902198229,0.5940817741590726,-0.7658998997440379,-0.35266656011837566,0.14396848985665647,-0.35744381989263047,-0.8178475352728333,-0.19751274069168107,0.4056924301500147,0.026374042633765967,-0.82678427446603,-1.2266333252001773,-0.6317220561481673,-0.32005339711867276,-1.0096543411875107,-0.6905554240955095,-0.06084907962973172,-0.0993770206932386,-0.3389051456566691,0.30139602971092944,-1.174235643844636,-0.7026311465820335,-1.331908454288746,-0.6698976703189466,-0.09997001091550609,-1.0541494828495166,-0.06594896268359096,-0.3400215840559786,-0.8109456271217657,0.4618222099991715,-0.7335705379083274,-0.3121733546644476,-1.1824480709836747,-0.602428878916055,-0.8739222152511388,-0.2402650318863628,-0.2703110192783886,-0.44969622419944344,-0.07528735108542964,-1.2787608561314654,-1.2045274765283092,-0.21808841325257325,0.4578226227751098,-1.100702145536186,-0.0423400046788287,-0.8238909158997477,0.3219347722601889,-0.33271980534142126,0.1204685341718094,-0.8178435625359033,-0.22420277599405233,-0.06932930163939435,-0.8828982260362372,-0.17032132447322557,0.6750512327249684,-1.0997324005575062,0.5478891096631928,0.2936558356908124,0.17200618340242263,-0.9935227235018363,-1.4208588440610053,0.3244271902421589,-0.5760750710261202,0.49412653938773216,0.46668767698775937,-1.1991760651216017,-1.3666427310774139,-0.31883136191366296,-0.5681111742501024,-0.07138149130898502,-0.04315638530566314,-0.13368684462899233,-1.3856816146685995,0.16358214697012374,-0.17767607462434212,0.5523734783824935,-1.399533826524209,-0.17761940253522968,0.45847384823456216,0.07703718722729608,-0.6909543267185113,-0.19204448213283637,-1.1471635044132977,-0.6083972314055197,0.3492868356910653,-0.7479808104607749,-1.0728553558053633,-0.9931207388966008,-0.17883639469400903,0.3122711717998504,-1.3923075829828897,0.06446703630713765,0.00612402363033576,-1.0023974099489021,-0.03493529486214898,-1.0138790745388568,-0.9420553959221425,-0.10395682636406951,-1.1929747286545669,-0.24423012906253472,0.14698366106481836,-0.002025564910975725,-0.07828733822859349,-0.1360493617175796,-1.4972483158839258,-1.3565331822963778,-0.8314225105378127,-0.09046741603976069,0.2302119366001318,-0.5020329788611059,0.33735194155282777,0.39013352527427403,-1.3267020334049562,-0.03170452255604978,-0.24616787659344488,0.31354880495048837,0.007058395774005957,-0.8099646302091765,0.44821140504897933,-1.2379559388515897,-1.099738820306539,0.3719824580869859,-0.27572558377434775,-1.1464679555518686,-1.2005079847658127,0.0050687614796300065,-1.1322032707131653,-1.562819540880083,-0.05397850281467659,-0.04815707381640402,-1.3893480352273953,-0.8169033587312524,0.17923386443809106,-0.6752085380973135,-0.025668642458928352,-1.5415632154685448,-0.19825524355930255,-0.8816507338474543,0.11587020478167746,-0.1784748443037283,-0.6245348586525835,0.12255809436505687,-0.29515887561115917,-1.3021372339057393,-0.2893285087615969,-1.2225347166825644,-1.1049937057081334,0.003834017169694731,-0.46257404133594526,-1.2136778692437866,-0.11574051971102027,-1.1152824789250007,-0.5316175938304843,-1.7442291391828704,-1.5164111947705115,-0.22076184146580424,-0.49687865937039494,0.1109874362028713,-1.605830900616634,-1.2197210309328452,0.17759495407452067,-0.3933510124425203,-0.3324793293741945,-1.4843376893462519,-0.32661340972093156,-0.5552151242250921,-0.42081194000520433,0.0019130670525617872,0.05021207909317191,0.26670889168833256,-1.5082618330950324,0.3143648973249697,0.18238672986284518,-0.522495934295224,-0.2093856527960816,-0.9065702831681286,-1.23034120235314,-0.9581188996199735,-0.47773908711560054,-1.5404881952442113,0.0165741366585786,0.36746481269147424,-0.12113239477518319,-0.993052571382685,-0.7859432579533414,-0.4255067412977158,-1.195776119146658,0.28566087304533533,-0.20542560090894127,-0.8780289950366119,-1.8813914507062766,-0.8046835017314682,-2.390974810994353,-0.39919772890288374,-2.3073370947739607,-0.5243760920577595,-1.8886395714432604,-1.2958495303765867,-0.34614839845935313,-0.9416639883592258,-2.0554067135755627,-2.263602571655558,-1.62250162822358,-1.24940048375349,-1.3991978959536628,-1.3025453028742566,-1.591984658090885,-0.3089571744951411,-1.1665046072219576,-1.2151234730389981,-1.3857194769488537,-1.6553474968266417,-1.9183755805203906,-0.9433681756080697,-2.176972985655943,-1.2449233133099888,-1.905166766282997,-1.6330437929079145,-1.0011439402320275,-0.9396640920094198,-0.4900845300280675,-1.1113211941136307,-0.4148392045700475,-1.9776059297672963,-2.069006598523823,-1.8617694849257973,-0.8764090287259299,-1.1693316756061793,-1.6825778016384372,-1.6379681905519041,-1.3504799435128139,-1.5453653414782331,-1.4107274297768153,-1.8140885586566438,-1.9579792227594124,-1.3672322824902856,-2.2511681602738007,-0.5407977484682882,-0.5257471585379897,-1.0077720429289052,-2.0351547903358465,-2.0826546390981355,-2.39130853007436,-2.279344217489672,-1.5980264842690235,-1.9722836496982048,-1.6361795023479562,-1.7173583729647977,-1.283070440934206,-2.309663370352952,-0.7991001967434856,-1.3572647110560985,-1.9856583310550975,-2.148189639584299,-0.6293912873558831,-0.8675475118193382,0.42284612145389483,0.6798709750022977,0.16584966751414418,-0.07144167981540278,-0.9023634339320477,-0.42559768089284317,0.13488998219889123,-0.2064313301486675,-0.8556775240164103,-0.8128544010341154,0.29768317078000217,-0.6896878144174468,0.591246186993448,-0.2535140605809526,-0.9767988457767875,0.6412240789801793,-0.3448658955290362,-0.16067193397226232,-0.31899466503009793,0.32736353277698305,0.20517276923289948,-0.6227878407703388,-1.0341132460862754,0.6388464103391573,-0.45984750013577114,-0.19351386617404315,-0.4354872368875779,-0.5093377837036224,-0.4661304559218615,0.390387211080214,0.5588321162455865,-0.7299713917600587,0.3417777489085595,-0.3615124664755823,-0.5379043739204695,0.7764436628811437,0.8602005036676074,-0.15728646225214063,0.07417409993729414,-0.30411742387159724,-0.8005331039757811,-0.9138058209744028,-0.9106832895893723,-0.5444382198900507,-0.6961374680021939,0.16162506639853613,-0.39267839784250147,-0.5792871395575894,0.6478555082204719,-0.7810888641852364,0.5078251110319534,-0.8974160182118217,0.6782618123291351,0.6653109932789368,0.9228056854316224,0.6694621022494649,0.4174991334840257,0.05716322970317491,-0.8391193117940122,-0.9521936513199838,0.016325466067773006,-0.7418897794523265,-0.12485158691687426,-0.9557197323919118,0.657298000108435,-0.253766642838551,0.7759753251072152,-0.6151243321783326,-0.5252897899350861,-0.7108285049789296,0.23074054523879173,0.5805573428560785,0.692090936835315,0.5340923569116968,-0.9854026986506789,0.6009645623941263,-0.2528724907690386,0.9046642993143751,-0.6105029850760367,-0.03133648919142001,0.2800863905042984,1.0797375888984655,-0.2965823717395387,0.7265523124792639,0.9943294813735666,0.8512921303113465,0.3892384470199994,0.9451116066583938,0.9934680608665932,0.15198243932413397,-0.21062145909829982,-0.6391651919735455,-0.26492866407935056,0.0010752297778464552,-0.2299665699427287,0.9404905871878955,-0.1950933099823456,0.07704439782300083,-0.18232333414314977,-0.4529172626962315,-0.2742624558790853,0.0451305771033978,0.8063032164597312,1.2366726244812754,-0.5230769625971169,1.1843404941383957,-0.4747724459820353,0.4596562911240179,0.5815722943982067,0.8538465646876509,-0.0033923971698925984,0.5410210660737561,0.17924884779978012,1.3407010487978805,-0.44137280238883303,0.5781801762010107,0.5555804719969482,0.0523630805101052,0.9153099360121408,-0.9872973788795218,0.21781717186163352,-0.295362054892208,-0.07178456417979673,-0.554205158778009,0.4798488492798083,-0.8079243628824755,0.4881507492077122,0.6329869840237344,0.08301077764357541,0.14595611758882004,-0.4736727364800641,0.4745521939649089,0.9261824000621487,-0.6515502155918051,1.226048381341812,0.27177150486544244,1.2470496206783064,-0.040104550453583264,-0.2842197575287171,0.8508218234826226,0.3599541495585312,0.9771904342345297,0.43124630917312445,1.298258457634859,0.22809530536130423,1.1345942946131544,-0.2863479285885797,0.8747357621889302,-0.4007571603348526,0.8847931306421505,-0.15409437092982353,1.0534788311894796,-0.48385704091101234,1.1048244617986078,0.48318474930962046,0.3025028100467668,0.29249224818577363,-0.2620029003329829,0.3977762828782286,0.4039636894776773,-0.4627311537937191,-0.46153877014696504,0.7249521842005318,0.553901856209555,0.07763279337189329,0.4376732156779614,-0.17305784418045744,0.5976758041494773,-0.3793016021605881,0.7623812164318464,0.6671732268353319,0.3886281653518373,-0.013303884684611014,-0.40507828302366433,1.0816100054390914,1.1630142578799114,1.332873570561254,1.0843882803628557,-0.3532449463686515,1.4232590554249052,-0.2138236231026745,0.11502284918530772,0.9956527024722976,0.08781065663111315,0.03077730443447371,0.9509506186893558,-0.2778577521157123,-0.2956300740023739,0.624632284489591,0.3623096397715101,-0.31157433828953607,1.2036337338635827,1.0602538519017963,-0.0907554758216531,0.7183299059839396,1.2326493875992817,0.44000662072825963,0.7023556178042866,0.9847263722479269,0.7436870080287917,0.6728758864263238,-0.23349490623118022,0.31986365693404,1.3333414928068816,0.4627077913128015,0.05637129953962998,-0.09062767773905206,1.328476895708541,1.513025795186835,0.5581140857940458,0.6923947915346451,-0.4669778802426512,1.3219765509497836,1.2412632244376216,0.28351231424675,0.43458400556624194,0.3977137099617105,-0.5043384977580317,1.498608429690799,-0.4386780129084321,0.18326133091479418,0.27598162195370957,0.022270342623003987,0.8925147870554807,0.303213502240709,0.9751712277077808,1.3921827190088822,0.3941650023440524,0.20135553081923402,0.9387529904351071,0.804202057876687,-0.5372317459351731,-0.12806997484697527,0.49314880307054315,0.7926973805608686,0.09357315910807364,1.3735109761111544,1.1721478313066367,-0.24852106650345543,-0.1856300770606655,0.9636524492150187,0.018813170826584742,0.9926662254565967,0.039058928384748594,-0.2027788734171655,0.5648705608417713,0.4489969105324691,0.5504699320493893,1.2330937392892873,0.6425443510750533,1.0540298497913654,0.6975033890851882,-0.4665831270721995,0.7403610866852034,-0.2110660836443924,0.07778563714450676,1.534477141655581,1.0658587782178706,0.21902189119986007,-0.1345257721112261,0.4865745751947848,1.625178160839065,-0.07842434576854364,1.361256096188362,0.8632149225671022,0.011061829680395157,-0.10391299012308547,0.6395352841640356,0.2751102634300841,0.7475891655050557,0.7340527133664536,0.9148932989535489,0.9489859005888122,1.4832405272890246,0.8685981843838093,1.6441149891558395,0.3491112933388588,1.5045802572206328,0.4274025512999668,0.7658047173793988,1.6416771547896962,1.5030486893216566,0.3031023544315978,0.4476116011704265,1.013475974639628,0.08043032586885529,0.1390247879384226,0.6135137713296258,0.9679922021551443,0.17697260316875046,0.7192128072394116,0.8400152832192217,0.01095694384905904,1.012959823191811,0.3881406383199495,1.1083863974250145,-0.18306168811533013,1.5971728287748364,1.2761763372906665,1.6198525202632321,0.7763668191429717,-0.03499636294924655,0.02848814436153951,0.3051097271015986,-0.051509965953150466,-0.03509225007729456,0.3924983002644709,1.320489613365263,1.452110725537444,0.4818589424479566,1.4879003825052046,-0.06181952290170188,1.5677342151002087,1.13024171681604,1.4873011329797157,0.9328162552472865,0.1643492566668105,0.5131031698363977,0.8931574482862544,0.9935696013246539,1.809689964368609,0.779772637651915,1.4287308971995591,1.6053950523690474,1.741282578843219,1.7787607090336548,0.9516121511080958,1.605109386503331,0.7693707847045456,1.2605852524799976,2.0732547596752253,1.8715233744954203,1.7460418972652993,2.0532780446284318,2.177844193142642,2.2854556778471737,1.7529287001275193,0.5588262184188507,1.0251219837203016,1.6442446622916622,2.0255711928809625,0.49657329596976346,2.148211932453086,0.942960989761511,0.5753353393626324,1.5781376203992379,0.6210516052394186,2.4552497094228296,0.9315525009909711,1.9091919039849272,0.6136497657294051,0.8882127902129647,1.612377680481204,2.0311721990535863,1.560149900438016,1.549835516778778,1.5868923477891341,0.7383195505793227,2.031922188581781,1.3145490225365222,1.4023676777035305,2.108995187817414,0.9507511113045355,0.7841165787867566,1.4969371660340711,1.0273760767633764,0.9567730069146659,0.6157733143507811,2.128018557346308,0.5651188293308745,2.315547195547652,1.2967221954666666,0.8854482417621302,1.094046356027118,1.0854230902806634,1.7768665023099663,1.1891929862524553,2.1135753622618854,1.3548781272885042,0.5550298123113465,2.079774115200402,1.1184040743905492,-0.47574428408331665,-0.5833148566968341,-0.1553493778329542,-1.051825762785442,-0.17556167661749345,-0.2421991635567992,-0.594655970189369,-0.28077741890777197,0.8475488754690369,-0.29223511424749665,-0.7315204247787674,0.4493017646604406,0.5646259128233467,0.7410678594262834,-0.4954756868011421,-0.9383956504719972,0.39588349821115726,-0.5713496858425691,-0.616746184216739,-0.5453832715758428,0.22593301109026767,-0.34610457354226737,0.6393325568993202,-0.6114941127723351,0.1658049301635641,-0.4193330392140139,-0.6348672402008698,0.07828475498280818,0.4460608913630248,0.0023301291240081018,0.09515925550799981,-0.45549599330904517,-0.2210977350915536,0.5257752563319339,-0.8129764773228755,0.5427653264799713,0.3845185734011204,-0.5677397760407636,0.2357803732908639,0.8137684850903054,-0.5272096678262762,0.556670459642289,0.17098042563233776,0.6869258591032414,-0.9732422367522066,0.20407757984700053,0.19907433054787202,0.561212633206308,-0.830479503769619,-0.629659683224331,0.25127821908904624,0.12509126777185292,-0.09449417556118651,0.7606165946066024,-0.6780331584298525,-0.48573367593762123,0.31065789301930385,0.458826132638199,-0.3256760989403845,0.2999446968595609,0.15262440034888888,-0.393663493420348,-0.055432258595645933,0.3812126285219748];
  this.h1[11].weights = [-0.1882031620374649,-0.17441005232122864,0.35953083658034,-0.022996490210435372,0.3963554815301138,0.7947416697271885,-0.7150591728531341,-0.2953930832953886,-1.737149244262973,-3.5398775916635117,-2.4252505832726867,-1.3328523917295068,-2.423879845046957,-0.924742762173582,-2.84208517055771,-2.1031965777403827,-0.6853831997833436,-1.3170352960291516,-2.6564689197143054,-0.29297520470684024,-1.4785750237848014,-1.66615849752316,-1.5106854161695582,-1.8681094209595954,-0.3685190148096317,-2.159020210469944,-1.3943078414770673,-2.016570841043749,-1.5564077991496341,-0.17583746046296214,-1.8108197205224488,-1.5152284364554982,0.11729821646081244,-0.14935666350699497,0.18048110266898273,-1.461491551440653,-0.8651543497689684,-1.0086509064681968,0.29019705294809545,-0.4048476972931974,-0.9709189270603388,-0.08957679446136317,-0.08149913154918084,-0.314207422053637,0.6330810422156968,-1.1614634970280324,-0.9838621560155059,-1.4407374686396361,-1.341912123064414,-0.8109128954365025,0.08888716635935213,0.12884283607103755,-0.6126973976159537,-0.22095355785997334,-1.816724949991948,-0.8645045339088917,0.6852974508144238,0.2400286943203418,0.6041141789070341,-0.31067847104977675,0.0024509627554545332,-0.5474627301766488,0.8493936853642419,0.9472718649342031,-1.3043779298421774,-0.9282780935715903,-1.644050990431769,-0.7385123429167398,-1.8897570664540173,-0.7824956031180966,-1.5880700237920835,-1.5134859752844365,-1.4945382333391388,-0.6904672367225112,-1.976259693067278,-1.195418597569762,-1.6566504282233279,-2.07006320375905,-1.4250710540695328,-1.188472774877746,-0.9546060920145025,-1.5175947704261552,-2.2079161108459777,-2.4957985727499525,-2.5706223738700973,-2.1882507804883407,-1.8129749061049016,-0.9649166247093046,-2.118268887364962,-1.519743129943035,-2.437607898234912,-1.4090895462109931,-2.6399248768390633,-1.3402526799886212,-2.263695480247138,-1.0952200714043145,-1.7963931558340307,-1.617821573361729,-1.6466532099896953,-1.814492040095628,-2.1865234028921505,-1.8232906631957826,-1.726573423280089,-1.3905003354638674,-1.2691628273098081,-2.0677173989055015,-1.5190609794674217,-1.751111745639953,-2.2440276938599926,-2.5574765031549216,-2.6388868503809233,-0.9136257933078108,-1.968288154356834,-1.4784283497723822,-2.416183890331717,-2.2872123277063556,-2.723167210366978,-2.2456296391630395,-1.6322745168151935,-0.8168389036279526,-1.8223223964181652,-1.7244055623052121,-1.0198047921537876,-0.9015806706491476,-2.155430698710634,-2.32299706505233,-0.986016377039199,-1.6761989275779594,-1.9506956599137357,-1.3625796295850094,-1.6702401221363121,-1.738565802367161,-1.4274205341791284,-1.1130200291282077,-1.832029156153673,-0.7751052666078139,-1.0836046828472965,-2.454092437931115,-2.3193053743674494,-1.4884549725633198,-2.6599418218048374,-1.8662796829236379,-2.067724402789083,-1.8142244368749776,-2.5789854998448463,-2.1018048611722833,-2.2079036164606545,-2.04270915687312,-2.979080197179807,-1.437308927049511,-1.0684367057870086,-1.447908580097673,-2.526282442267023,-1.2293396111622643,-2.0183029273320683,-1.9576576520636166,-2.6048526708526287,-2.449565153950293,-2.286463811580023,-2.9001612631670284,-2.3912617911725214,-2.9403489939989678,-2.926649421960809,-3.0796122677985918,-2.989109342401726,-2.999690814611486,-1.939802839674954,-1.9852603167570295,-1.1778845865612464,-1.625463341271562,-1.308363853738862,-2.163006489503939,-2.8096053140616672,-2.8028906114074417,-1.9846915905247107,-2.6888580475507973,-2.3617047666464117,-2.224685446654243,-2.0267641519437656,-2.626551156077427,-1.682705643929398,-2.0775167932447407,-2.308247601346962,-1.7438925217394208,-2.0600009361696365,-1.3308208372135293,-1.836792888924142,-1.1293370132089229,-1.5221974315441587,-2.5726543816601652,-0.7552605791590072,-2.6366308214075644,-2.9959181175438836,-2.5478168096581615,-3.3179731573668922,-3.4195091425891446,-3.600905344834184,-3.590520351827279,-2.7749811213309488,-3.2151907514061273,-4.013880695142878,-2.18131386775257,-3.515682542955133,-3.76807447653453,-4.254755925331103,-2.8710586166450276,-2.9610756263563953,-3.5406699782710556,-2.561109239524943,-4.1953292356897895,-3.5500717182275827,-2.7160265063751643,-3.626762764987777,-3.011581674668265,-4.114549014333633,-2.9257071479087493,-2.676305947181528,-3.176501274495169,-3.3839719456777053,-2.5828692204474026,-3.2836369652952406,-2.1897851047205346,-3.4802763389738773,-2.8416992810751798,-4.004119610904375,-2.50782173763262,-2.6974324539120187,-3.7731029376285075,-3.9476128088046982,-3.8579986978913334,-2.820577996692735,-3.172934057891098,-2.5291046149846292,-3.08696246866565,-3.692154984430161,-3.3427195667673515,-2.856482830874298,-2.4501402485476524,-2.1257324579494665,-1.5672629053475602,-3.4469329058243785,-4.1203418995900725,-2.8950612929025143,-3.669483521852622,-2.5513210628211738,-3.158625067298778,-3.3906541099875445,-1.9698283489023176,-3.072887775706941,-3.4807544876800263,-3.8113290317218604,-2.68195092544809,-2.5502597201836,-2.354100301615381,-2.2269823089186014,-4.207804065873997,-5.294563083011002,-6.419457661153894,-6.100598070088057,-6.516638407380772,-5.312443730297255,-5.499495960740799,-6.047969875108376,-5.94314978227441,-6.019255239159053,-5.777667027148789,-6.8969754286484,-5.3108302999254535,-6.638533650001223,-6.107605232345965,-6.323665571559519,-4.587616391399347,-5.59495102522991,-4.639292812846905,-5.066046605178941,-5.877973838414588,-6.149448853921397,-5.376553422449681,-5.085903072744591,-5.00097380055592,-5.445533254447351,-5.688881183604163,-6.738474895207474,-5.434422400470744,-6.913591682976196,-4.725625743393041,-5.017448300817021,-5.2593168206788965,-5.763249979303559,-5.744471033074103,-5.735208619042488,-6.731510810975452,-6.58386575237824,-5.322292380516282,-5.772580475524473,-4.521397643005505,-5.147562150163272,-6.772299209492256,-5.882644161707149,-4.934382420544507,-6.652004357251123,-6.593271539570234,-5.254657977222726,-6.030821272544624,-5.667955728922156,-5.608860174116446,-5.221530108408554,-6.038639841777399,-6.123138526044149,-5.922918703092637,-4.610258107861147,-5.377276238384195,-5.11997239291247,-4.877703432024091,-5.883720896055843,-6.065620946768104,-6.134188978042794,-5.383240372684796,-5.7143282529169515,-4.628455163594405,1.1229798862085347,-0.6671063007222607,-1.054033029297675,0.08077747245416891,-0.9069240595693837,0.2972242312892645,-0.04371616267361469,0.3938824133147955,-0.5210791805877518,0.2714147587964516,0.6174323602835726,-0.031075596374473487,-1.199195349442552,-1.0882035574758662,-0.7592218557838181,-0.27973127003120063,-0.42177792985256024,-0.3200572125331223,0.04858800568185975,-0.5818319760458718,-0.6334157676923494,-0.4721841271363351,0.06715036564471191,-0.3883733750295887,-1.0151635293519858,-0.6577462426254869,0.34079754288693703,0.8427739004027086,0.6357485298235868,-0.6740763888416235,-0.6869988776195581,0.009982516317559727,-0.4461239165355249,-0.038268524440266544,-0.8675326121987194,0.29741383077993716,0.04091067939669883,-0.9622721686923178,0.16795007000692866,0.31115744546371915,-0.21670092199749963,-1.1852574015104669,0.050741384352834554,-0.857591230586306,-0.6544224084574097,-0.3487484239430468,-0.8526792850326729,-0.14837566508018293,1.041165497503366,-0.8109694491036267,-0.007250854490767178,-1.1038054994221054,0.43035781458125405,-0.44091054790298273,-0.6678872095480028,-0.843272515213794,1.039972909559861,0.010368519737950182,1.1313674971569072,-0.5399452990186213,0.26065961936760446,-0.38697532622744407,0.11302170086059775,-1.0043833701966174,0.9292128473457861,-0.7298437961068163,0.13860542126963926,0.9835189122605335,-0.6376311162164754,-0.175835435279728,-0.41385148828370477,0.2683826686211326,0.7644351308515225,-0.16076816450326928,0.6687824046019755,-0.0416132467482464,0.482437949956959,-0.2675392205785748,0.5764019629243781,0.058063768028428,0.48772411071017563,0.8824492136414704,0.13900939379532046,1.4175283992524064,0.7543283770061644,0.6320279769855893,0.6372698496707959,0.6427708820659385,0.49908261544622284,1.3426400641582739,1.260242981241414,0.8113421630011627,0.9596834715205472,-0.10045201336045811,-0.01839448918709608,1.6211737507438602,1.4297797747183187,1.2611115761577758,1.9934570558185631,0.9814258155613907,0.9184957793337754,0.7831539299552074,0.7306303159173037,0.5970917586018609,1.1833072777213998,1.0717229027907147,0.8526186865818548,1.6684829875698328,0.5880344855545995,1.5661073114283368,1.2493637413175516,1.966815505052519,3.0102843547229132,2.5215065782405386,1.6885889044393625,1.983627817029441,2.39975020672047,0.7193171373406938,1.5772425412813527,2.453843903843571,-0.7284308666063111,0.747583417897983,-0.7229590732441404,-0.946177249639446,0.1768135309266068,0.5227969462619084,0.2623641396635068,-0.201327080587407,2.1122841029994768,1.5240745371443374,1.168926242846657,1.4349503047804653,0.9386872343296693,1.9104861031402451,1.9020420718163094,1.7273970040637623,1.5583380575505785,2.247755875135652,1.4635335564360836,1.954523451456965,2.135685644276623,1.9092293145282575,1.4233686644471057,0.6844898289769794,2.0372875507631276,2.045048674571727,1.1699458645394487,1.1989177437537721,2.0134206619103963,1.7083216732150064,1.5052718395287963,2.0584779265075133,0.9159812740134762,2.069551248950765,1.9347821884190048,1.548960588108728,1.4557050612333509,2.3727640669396606,2.656619931187987,2.2016930095988987,2.471296347991636,1.9108660448650279,2.6328497461836515,1.7075357693640747,0.9318342899799411,2.606669885239564,1.8321898959455136,0.4239492829143123,0.9519971161804078,2.020987489482796,1.7629361719475485,0.687746502909328,1.981523517400948,1.7544520756238813,1.6805480921948501,2.3735636699586107,1.1129658333225985,0.674616512051122,2.2143561080676215,1.9317979052016587,1.636657370914741,2.762905346953528,0.8784546142949072,0.2815582362152218,0.4779682164217923,0.6025374350007975,1.2151930875278076,0.5529287548121306,1.1345337885213678,1.7247503888802713,0.8637232035513712,1.6846112054764086,1.1241582317258323,2.1620210041693406,2.6953918430546513,0.6709336473620584,1.6382123442617975,2.249360878978765,1.1087182441175538,1.7127499264676402,1.2401009716885023,1.4390529340048006,1.9371897725244527,2.449398088775368,2.9284099836897814,3.0471517368647385,1.5194027705167286,1.9841303147659952,0.9985183698877719,1.654344002871725,1.5111369150624938,2.793237585908073,2.0660189106754254,1.5140085576919384,1.9584977729144106,1.6962651667192832,1.800880704463997,2.1658345956834997,1.943092886553657,2.624836925862768,3.0398745436665595,2.5964529675190415,0.9180286673514053,1.505004336599035,0.8289303247432176,1.904242732672515,2.6989546773070767,2.339944754149034,2.2207532398728427,2.6542500634811543,1.7090390720020021,1.8658164162751976,1.465544545155232,2.1657287940591043,1.7985828291075885,2.1859821711501772,1.712951401148383,2.545813487180919,1.0869789248673363,1.0151194517071125,1.6404422529782687,1.4658088416341895,1.6373386754676709,2.0227439529011146,1.5267790915042108,1.4946810185811992,2.3591473635227116,1.336543732957889,1.0890237075594043,1.3486576881364936,1.536169352458194,1.9382456161520996,1.4388892052319884,1.9698066078841707,0.8479449083693882,2.4909333023591294,2.8371600198029676,2.364145235397727,2.6303259160511283,3.6372454995843113,3.824542099768945,2.6443001477823938,2.927730495999058,3.297704283117962,2.484928125608119,3.3377898804576267,3.660694412525969,3.004436178986594,3.0942600378612894,3.437014643640372,1.8247846803091643,3.4955711162894216,3.3168415205645636,2.5691972317793588,2.6283694047165236,2.817067531757781,2.6036447111978522,2.9491971696984143,2.802551022622338,3.5508039159423608,2.5163723313050754,3.7053646912612566,3.455699076476476,2.2962148847657873,3.678679139162772,3.6276895035744308,2.2221503869488686,3.7328541053421143,3.1915011826330213,3.3447192075347085,3.3911043436754733,3.106402872523778,4.034043271709286,2.805457260988126,3.348232011406029,2.172301051264117,3.048361076943708,2.708757343470075,3.4063061642257613,3.58677220589513,3.9918096351729946,3.4520054067013852,3.177778170199248,3.5420336843492928,2.617348935837141,2.6340647588462285,3.9765142248023793,3.855424450130186,3.609294353186926,1.9158974259607835,3.5090577309562905,3.4056611784194697,2.809392509242809,2.8292913333702923,3.1870605528551548,3.8923840225885593,3.7413483222622563,2.242307449425025,3.870324304632122,3.1940445824365526,6.086309948380756,4.70553533489108,4.9082429488817105,6.164709133554264,4.511693062011341,5.250932988393412,5.295409224729769,5.071054583003691,5.763798511842138,6.12181396451325,5.693206960911138,5.873276805813374,5.486848394155025,4.645134753191218,5.408933758379114,5.284816263295098,4.569672843822527,6.435352735277675,5.986587571715686,6.058829860502375,4.628584695002073,6.563138075006869,4.665093854437094,5.12147904956967,4.494361310071345,5.973300598466116,5.650905033402907,6.212835861896395,5.923825956131112,6.648647812469105,5.532354339478871,6.072105609152401,4.607331079528551,4.9314668533391455,6.585531412560476,5.74430488674857,5.921428847184611,6.400050146162833,6.14069500548963,5.330509726412098,4.755514500401757,5.088989955714844,6.462275003298563,6.352742931506402,5.805820197338348,4.85326400200695,6.393169480405399,5.225029571079196,6.336452161817837,5.940337255990467,5.849381481061056,6.75962145513448,5.867918805291063,4.936473615879275,4.9233183159802145,5.532321621120534,6.163071180258272,6.160750256012796,6.506869642371739,4.904000251053801,6.152461138327021,6.354296005892021,5.354813698451966,5.910196709157955,-1.093190278737689,-0.62406913673744,0.41233988569038127,-0.6029306086539777,-1.3770125007780263,-0.17938093383467044,-0.21582121463781076,0.05004175394411275,-1.2139923859088235,-0.07685998066251098,-0.657741761576287,-0.1533619242544028,-0.47752944475343334,0.587610483854769,0.11807584979441432,-0.5414211518210719,-1.0617894487281332,0.706015052193222,0.7981274522669438,0.5623609226429963,-0.6720053149051195,0.33275839256850637,-0.02105235788999649,-0.2722142276255864,0.3995003845372537,0.036075189119248154,0.600582180553334,-0.10549080979433746,0.7420698309073808,-0.40723066092407145,-0.27955803614202684,-0.6167565683985458,-0.054625349356413194,0.034763592163550086,-0.11489766317031014,1.2065922702897327,-0.262049982620004,1.136425691642506,0.8161347804117473,0.7690681777376671,0.7473548035644554,0.3359634269411846,-0.37257780024097925,-0.9769266758773586,-0.7672170918627791,1.050441828973355,0.19883890416716005,0.6004037686287432,-0.4900840018159194,0.8404411946615943,0.5422954406311098,-0.6039594118709221,0.18280065743498553,0.0159370874713226,0.5442217602286537,-0.03777104183188631,-1.173283590049172,0.4729830339914688,0.5347345936504018,-0.8849994550183946,-0.599346323156474,0.4420012158477466,0.08986696497159448,0.18227547431949184];
  this.h1[12].weights = [0.3885008040368687,-0.3212789198753767,-0.05157408282583198,-0.9958018818293843,-0.24234983969279789,-0.8530854110246273,0.34081836945325206,-0.47881055259497707,1.5183214072350448,1.2794942687917454,-0.011161166124361728,0.6546487587257332,0.5896475952614718,0.03557738607637295,-0.37180877909695426,0.6212477754777631,1.1100220444353928,0.45896675933384823,1.0958311598042725,0.5097887603020357,0.9168920647600514,0.7325064591489632,-0.8336701707656363,0.08967737464708841,-0.3066102739583775,-0.36234368784200205,0.28104986369620516,-0.4387638323133283,-0.000029738644966404952,-0.5194304961497165,1.0994443740134623,-0.6017842840733769,0.6339678911572576,0.10314367108574432,0.0010828021403199793,0.20863633224882286,-0.5595884794962316,0.6951857039969271,0.559548048090538,0.5210047268720466,1.0579137972004433,0.8475418662737746,0.959750797431382,0.5171942723091438,0.8227726637714552,0.8788727778515546,0.19559170860708874,-0.6066608176767443,0.38120324292724417,0.5001509059936472,0.7184258145410645,-0.33951799307813607,-0.14415300248243812,-0.17054756427714182,0.5325902539128735,-0.39062175450487635,0.8027067331372129,0.053295901185903105,0.3021139565640554,-0.09193841716294537,-0.0959685732093023,0.9487807741305656,-0.9031442341969167,-0.5216022057857983,-0.11070913665685783,0.6448791600548017,1.0890614057672863,1.3863683755169773,0.16554063007233796,1.1511972129297017,-0.38663706927087044,0.46320833832011016,0.33363322106591786,-0.2104648112970023,1.4832458729719933,0.1912037524191236,-0.24204838620696162,0.6774559063064878,0.6576443222248971,-0.114869700737072,0.7577000426342714,-0.3620494233083391,1.215099012676508,0.9053007676518033,1.4449941588591537,1.3587759448372494,-0.5292566978315236,0.6415040888912885,1.257744318900006,0.09942085654407185,0.11498473749946557,1.2449499366159402,1.6117311816538296,-0.18779621879928968,0.6840233640736655,0.06557683193824675,1.4580453166895888,0.21224047404420418,-0.24548577836258326,0.3803206485936449,0.22409192963049313,0.696701658725122,1.3837903774374718,0.2627778940204096,0.9060384162885526,0.3903996996070123,1.044164712284271,1.1661392963816308,0.3201200308747068,-0.3806420106896534,0.21985227895209586,0.8120303298410145,0.6291205194208711,0.06431645933265893,1.2002102238418437,1.3148669507657218,0.8051928699308094,0.3694918953772351,-0.3919267912842478,1.03977675961325,-0.22410774146446083,0.489184375121447,0.19158546478628508,1.4071834451203753,0.5332115125518492,0.5014588458509032,0.8594562827729537,0.1858227379047185,1.1375198169887886,0.425706071422151,0.7490147917505872,1.3694953337989606,0.13318085192470375,-0.24468524034598158,0.8313798769925088,-0.318397675348169,1.1058306544921117,1.3293881311299203,0.20681657387657723,1.0168499205298687,-0.03702878839074269,-0.11872851952726149,0.2511297769074698,0.6386205209386169,0.6680766955141724,0.3903394463553259,1.6163788846031995,-0.25949674000747214,-0.0556695919449358,1.0490812457903174,0.8685974003594588,0.806305385664281,-0.1653330484610608,0.07708674960501666,-0.16020938378017358,0.29678922458834256,-0.07609108891055562,1.120286830848558,-0.3965286864518559,-0.1151730157002352,0.7854450476812151,0.015183244216206563,0.6549417562881366,0.08054661234515732,0.9692227215425226,0.9895681170617036,1.1836622046584122,-0.5724570182936239,1.084149412932095,1.1431173273089799,0.23479087183101727,-0.37196111688380046,0.639519079454953,0.16309474424777373,1.3729206851621674,-0.127461653860707,0.4213435029450791,1.4239176599735106,1.1077716081889462,-0.19660263084402535,1.2516327412226342,0.9743626933060603,1.222849453264921,0.28795329671086883,0.9378130778617526,0.6212847417284907,0.3155205092164754,1.4106682133609054,1.3992776536159537,-0.39660584190303094,0.8562342749911344,-0.20628875458721851,1.393448557384833,1.5957393421833614,0.9861877695204814,1.7848935800613286,1.8248067366268315,0.5046410869361716,1.7323868562660336,1.7141293820170127,0.981960101681091,0.4006662568599875,1.3864298520654081,0.07112314494057911,0.4726642980907615,1.0325750210230047,0.3980770874743665,1.4613951092830846,1.3218732572007925,1.9567975103083568,1.8986182375294676,0.10110489156732134,0.13339230744408406,0.07569139429758874,1.3696097620052303,1.0873733409766537,0.8454491550565945,1.789595970218994,1.9401636590879372,1.9142234509332963,0.252690061875276,1.2387313872123324,1.4131487209089215,-0.14216556233273459,1.3597785246583984,0.6441047977135085,1.1106597253192907,0.2553693150232358,0.333789366280455,0.11352069101576705,2.1624084108524073,1.1815830556628455,1.2361967052750222,1.12376814113212,1.3861169659057182,0.3949096922256551,0.7812862026805044,0.2948577466743991,0.03730403054633136,0.16838168627737005,0.07378385052185418,1.289927582765338,1.0162103778932663,0.2926919808921387,1.32718010624646,0.27164708847973024,1.0553794954969156,0.9661885122214157,1.520959256935452,0.2724613287267177,1.703049673811422,0.29390626093734595,0.5705051204539965,0.7518616689426727,-0.061668274483116604,0.18993682669540868,1.6678209985203751,2.9382907480633245,0.9971150880626712,1.254666671845686,2.3917543692877286,2.761008809530983,2.3780503912093596,2.9505658060460145,1.8644005915087394,2.0233445169226156,1.2662834837227255,2.3594540736779894,1.6956017299839132,1.1523768722176404,2.7707901171389517,1.072628031654127,1.8295272281234987,2.1824190281145963,0.9234196636928059,2.6005564152517033,0.9616077594294266,1.0690694792323594,1.7586708396525303,1.3552788338887645,2.5095659297931507,1.8022340229537681,1.6110143411694546,1.5831323412628904,1.0865342080358404,1.0008401496303372,1.0633106001365162,2.3845294206464716,1.01100088660151,1.381354583311954,1.099385622022923,2.1971373088710675,2.644514008111779,2.647344431080261,1.679400901513272,1.6622328998770597,1.1703800211281838,1.4136591277381891,1.8687235006393426,0.972077718136023,2.7209921101168097,2.8860139788667833,1.600048709939872,2.7141874790332396,1.069591050203966,0.8267242551091125,1.4660793982700742,2.29022911965205,2.274509225251789,2.546981817403851,1.0048007279114286,0.6984798304292198,1.2719230419448484,2.50385371960933,1.3225203703681494,2.020302802839212,1.6299960433850684,1.8206600893602305,1.0519268575216172,0.5670160100037349,0.13702200329052427,0.9741936334815681,-0.828151002931382,-0.8610450357847311,-0.8655994010440912,-0.37608193962771136,-0.5879778219710489,-0.7601611243790345,-0.48450380145926203,0.8170188616185584,-0.16044469146701645,0.13973842448920484,0.5489926547558475,0.9890008422734651,0.29404226752477425,-0.3163460886629692,0.36020618392008946,-0.12172821052845693,0.6362457568887689,0.43834427638157253,0.36580470715033137,0.5826307024348389,-0.022361712445544257,-0.7228315536723197,-0.4650569179889684,0.6738013003248254,0.7281509135469593,0.29489117860142405,0.8639570515277516,-0.8169195946921488,-0.5184784676098464,-0.21669643759891793,0.5440582682575329,0.6931942254120621,1.0294035361031642,0.7055313372182229,0.036529563906726494,0.048018335157962604,-0.5614012497592303,-0.556568419202794,0.6788817988848582,-0.5191763029010134,-0.4810587907234171,-0.21732570643482435,0.5928253074407374,-0.12269064423007657,0.95911451995349,0.40085390006405947,-0.7430230447208379,-0.8424320648918248,0.33952041108136316,-0.7005697525179952,1.0710392272139462,0.8179623586375244,-0.8996059449844664,0.12754674981364195,0.4050600183621031,-0.7589756264370314,0.6524410205718527,0.490013876083862,0.1866478445518817,0.17088594787826297,-0.9404789519498196,-0.12425914217158995,-0.5536294317635355,0.6845884082329143,-0.5853319507382837,0.41129835516900215,0.09951545022374741,0.40634692842538556,-0.09432952541510708,-0.4505583031774538,-0.28912123011759244,-0.8169922749879289,-0.03588438737354596,0.4588168236437958,-0.42428228819018415,0.3336221711443597,-0.5228370487209402,-0.7685940350937912,0.2429318791169398,-0.2990079184213713,-0.8658025168000372,-0.4649926302245813,0.36189229346941065,0.6711380974463558,-0.7379691608386907,-0.7690949821176059,0.6448371015362385,-0.3549815505969003,0.5387916757547401,0.0286067145857125,0.1453945489496164,-0.09321609370912538,0.47811705135489735,-0.9093033292104749,-1.023681385949879,-0.9571482607482462,-0.3589697388808923,-0.6749827931601483,-0.2923317166407671,0.17062243944173014,0.419390965379586,-0.6617735360495407,0.4852727868435661,-0.17813396005719803,-1.1789757467980821,-0.9869397835537599,0.5235885525555042,-0.5526223947653062,-1.3111664882338288,0.4516446060110802,-1.4370206603365785,-0.7590707552330735,-0.9752113373061004,-1.407402923194338,-0.5549109730393806,0.42055966968472586,-0.10287360470553057,-1.5214077783381887,0.780835433097995,-0.49598368712974317,-0.10435013302402663,-0.684520220127498,0.912723941790512,0.4824946834398216,0.23913212823942676,-0.5811280992200696,-0.15942923344461632,-0.7991528274505413,-0.5170085583043545,-1.3292627050167714,-0.8766906441370942,0.07674743518161015,-0.05163241334077606,-1.196908361854599,-1.3459515461323128,0.5294741807857496,-0.8986293683243046,-1.0026533655044998,0.4817278769777083,-0.24430594396480274,-1.3393136427748724,-1.1424835192081348,0.4168304034520613,-0.22613653088865637,-0.8954643364248916,-0.906061883441961,-0.07662151322502617,-0.06852126544126336,-0.15237081617345458,-0.7305601700096895,-1.4648791918200368,-1.1991811427426373,-1.0713866949630289,-0.3573940248894783,0.19982011770650662,-0.17914295593544727,-1.2193317085675677,-0.7561416987587227,-1.2579682889391415,-0.70670574663223,-1.227907582385138,-0.867414712238405,0.19544350370119767,-1.0388659680833754,-1.4998869575904636,0.33692775623980975,0.13250858105812688,-0.38061345554117715,-1.6566318546769023,-1.4372772329315364,-1.3108897982997543,-1.6992428303001534,-0.5691968913840043,-1.0603959876643978,-0.3247244388448795,0.03122864415295649,0.09900681956294118,-1.5243886283358692,-0.4656291895789141,-1.0289868337024097,0.2873460576616134,-1.2758646287352762,-0.06665502759729211,-0.3702525957182801,0.3007166049683666,-0.2799753911607224,-0.07127159743999396,-0.1294536089378765,0.3845338710682338,-1.185890912283088,-0.011701374711865508,-0.881801578665829,-0.7223926847210512,-0.5006498778064851,-1.3897776802737674,-0.12443784031889596,-0.22841058619312882,-1.167434953607656,0.09934763554208405,-0.4971948922687556,-1.2336278955227944,0.06096022874608074,-1.6038878986110459,-1.0259263706116672,-1.3009605077839923,-0.22503525386120135,-0.9530948712333296,-0.42434379700341174,0.14712202448744843,-0.026887983914285075,-1.0221497515554592,0.26279412981448663,-0.7586100403420646,-1.389055305259578,-1.4979279299002197,-1.5458841131326502,-0.687460663255154,0.4078681123497311,-0.4992357515485753,-1.0935156322803565,0.30591183706998143,-0.583361356085271,-1.402718982499224,0.052864399694229944,-0.10195903954807205,-0.1869877885288975,-0.9372923901589503,0.4405368405977255,-0.9963210670271998,-0.4651739214676166,-0.39776894113652744,-1.2235674711360447,-0.44767731273216943,-0.5581995418942033,-0.1938445453325033,-1.5621397797008587,-0.3165432607537565,-1.3322565252386378,-1.1792430549639592,-0.9821023531193123,-0.4787600939635753,0.11693017344634668,-0.6406998537862375,-1.361430838118232,-1.3083135538293669,0.17763299155689755,0.07188450718474268,-0.8626349131481663,-0.6510468139602303,-0.6797615940563086,-0.676076280425382,-0.09528089359615753,-1.4578615063956741,-0.8301162586933953,-1.3570184338032576,-0.3145188438865066,-1.6262319481553609,-0.7681956290835972,0.012633115965852813,-1.5910536326006883,-2.066277978982253,-0.39862531378976845,-0.298307540596427,-1.142625472345259,-1.1180353313286329,-0.6025565065436913,-0.5371326182352213,-0.280175873039245,-1.460385930001737,-0.3240964907429244,-1.6431259673293974,-0.29283134769401714,-0.9236699061365871,-1.6523739664192045,-0.34888124242617363,-1.4766263365726993,-0.10580389509735032,-0.14728801030445218,-1.7679651823950768,-0.3980760075649936,-1.2747291634598485,-0.5307494620908475,-0.6124153206283532,-1.2803547819994299,-0.2615102432125924,-0.583963339554128,-2.132076079564479,-0.5100955875317816,-1.6899403087758387,-1.161891924795227,-1.7172062399713919,-1.93127196686905,-0.06842943822313244,-1.117208291036117,-1.2726183666780577,-0.48242774486857265,-1.5090953264356144,-0.45045304037969225,-1.3718887733964757,-1.145085499732373,-1.080330996337417,-0.20974164514282573,-1.666201194593244,-1.5015990579115293,-1.513780242528555,-0.9737306885365381,-1.7795331121705802,-1.5588255307423962,-0.9066352180350193,-0.6651006807824102,-0.9672027905370012,-1.041396210687172,-1.095121689524576,-0.18091649470507096,-1.9988650141028454,-1.7809475934183696,-1.2225865643880947,-0.7595383533148296,-2.6849565159209656,-1.9293816254211242,-1.0191182244825019,-2.599768939153373,-0.6448218569052507,-1.7613477236548485,-1.7661181123407954,-1.6371833212516202,-2.732939716052332,-1.9413585261952935,-2.362847461211756,-0.9232593605097873,-2.062047684819447,-2.765852969516283,-1.139736315950345,-0.6128542934159696,-1.508564450178679,-1.3448662261799629,-1.0242835974889817,-2.5664506455955958,-2.2695577012432735,-2.593458162488826,-1.404234551073577,-0.7518433922185834,-1.6930071468523615,-2.4037913758763816,-1.9211308025745,-2.0979558687252737,-2.730993533342243,-2.264932612468007,-2.286348815739554,-1.4701152339948067,-1.0415997816189497,-1.8491428463171615,-2.219990855343439,-2.295484584494026,-1.255020596923251,-2.149250619699953,-1.9479987471397089,-2.6721454266469733,-1.1154265464998807,-2.2067006900715036,-1.3962635518648245,-1.5302775798630976,-1.0777988718021978,-2.637965435472743,-1.9031866383667004,-2.6714068128838457,-0.7844816984777244,-1.8114988101726703,-0.9359987245715307,-1.7764432666843963,-2.6614597414476897,-1.5402514181242715,-2.243731650376136,-2.276075718160978,-1.3134486116990736,-2.935750598638697,-2.3213038753713433,-1.5218948343543024,-1.1465584665996071,-2.7431255181651335,-1.9011849013568742,-1.947573679929819,-0.04929531649643667,0.48770796113408543,0.016054347128092752,-0.46246721924455225,1.0402761741422262,-0.37484339133658495,-0.7563743828445655,0.2960153515692849,-0.22472643324891065,0.6232761396980041,-0.23775877398506834,-0.9735668223751247,-0.5255612521434694,-0.4001528086862855,-0.7425874527795272,0.7245254687722923,1.0366569913475274,-0.011795051932981462,0.3864773812436479,0.7253211864337534,0.6936014408233824,-0.3542729189114203,1.0991148314061083,-0.23351969912227716,0.30509838834672104,0.9920242318009277,-0.2841286076002267,0.537050378074958,0.2739580587526794,0.0994355086326659,0.6077589165440711,-0.45170405548439707,0.42716309474333736,-0.3330305012840144,-0.08479647705418718,-0.7975499003862395,0.5993699679376238,0.38280115918332597,0.5103557314377429,0.4400733627944621,0.4194073431935473,-0.4850439589746444,0.9486753145336168,-0.2843507453288132,0.10742314504455133,-0.37037291168447145,0.2904961165856558,0.6985776726802058,-0.21197704503835738,-0.07304239694652238,-0.18299526645642317,0.16895908643307053,-0.8370489611399018,0.8888076445947748,-0.7823125879559326,-1.0055485709703822,1.1015083448453276,-0.5985079191264063,0.8297901709534742,-0.06449012190181169,0.7650570518179007,-0.04252702699717926,0.3054262962969312,-0.7857997119265655];
  this.h1[13].weights = [0.974285710485808,0.22620911763270835,0.8675960444829283,0.7101849700498812,0.7240407255283592,0.7828926765354582,0.6727325753474207,0.6610507729514685,1.241699624980208,0.9744574286971784,1.5809224218459403,0.5232763724446295,0.33890947236854624,0.6169815890004616,0.3715713959738417,1.834454739655536,1.48719245967219,2.3264683966346786,1.4852712559609451,1.4134556821631872,0.035678990323074034,0.17787605238739473,1.3978169245716503,1.4358224118535645,-0.2489119045873785,0.39067664508946387,0.734659914673294,0.8339317108090085,0.32153585835204507,-0.6567767848447701,0.1331795463925368,-0.48868861210948006,-0.9524034994585291,-0.6929668470591585,0.792569235087839,-0.19978399879119257,-0.7401915378115284,-0.4135158854223391,0.49843180082458416,1.0865193898805428,-0.5345857601790702,-0.1933965261191522,-0.39327175137698434,0.7317002147654788,0.2966366230620391,-0.32308089950127883,-0.3393067888844687,0.71565423506711,0.9720687364433938,0.5157796611092088,0.30938437414333575,0.8581511211308406,-1.0405586437873284,-0.30703532476803397,0.6641127752828379,0.5094971161660206,-0.5453993336338083,-0.6390223935382711,0.06292238462271404,0.8650906761260613,-0.740486555263228,-0.32708582870468383,0.04007123616076669,0.7317750590506109,0.4647250009728333,0.44765304873519013,0.41409902979919416,1.512041002793207,1.6406170133538813,1.2345693010203755,1.053053132925935,0.9026782517757307,1.6490298801807843,0.5407135786302476,1.1118772535072623,0.3868200939300069,0.6551509577158817,0.40406958860859904,0.32048213250088786,-0.08256669135689734,1.2833601944075432,0.37447057974383213,0.43375072156646083,0.8574947310550055,1.1191682384036497,2.137945364798369,0.6804369828723885,0.7487345809184933,0.22041861130129412,1.8061084076747276,0.9555015813549793,0.7912106824695695,1.9094796527495508,1.5394594963266126,1.5798272467082706,-0.01907966789879646,1.7761873582036698,0.949763305749426,1.3617186867115103,0.958772566299649,2.295071670486281,1.4969655799805592,1.597300704730915,1.7655555362754105,1.6624436200395825,1.3339322856562592,1.7903673525613273,0.13619136674719157,0.4642185689721912,1.9906913456161677,0.7516567832556719,0.5312909074676085,0.529211255431751,0.7770428876666261,0.6983433419833907,0.14238849529448744,1.934993522746686,0.5428404071473157,1.0998405850990096,0.16432858931234273,1.193578446656063,1.2491837563925225,0.971676379980349,0.26749893283957143,1.0892430742004462,0.19689447878831726,0.3465442545680709,1.0428174757794493,0.9377028471807128,1.7344175665192154,1.2222831746754532,1.4266323996297594,1.2848782963282357,1.0860258244769905,1.1373349273183282,0.9927389477224119,0.30099266717344964,0.9534627090226531,2.3993109597060442,1.7559085149705185,1.4593479109340597,1.0343790823682724,1.0408695556530276,0.9923489075489476,0.3704173239061827,0.8120863054630884,0.7446961374592442,0.5546473420585045,0.45552502101287445,0.9612601202174367,0.14613167691225537,-0.028153807919622614,1.0859735356419382,0.6545635660479278,1.927664151376152,2.289136354429634,0.9151099574322917,0.4579933923338263,0.7862956032316705,0.745523697892667,0.7614535100408346,1.970235770518381,0.6443812461422765,2.0996436990827414,0.9109260109819469,2.19867349011789,0.9315192572987527,1.7400827991089762,1.2751001366349501,0.660215563480366,1.4664481128213833,1.2327216305369728,0.37033244890436506,2.0635670745794483,1.04793042020948,0.5083987906411224,1.6507562373699798,1.4075012325133316,0.6679751416946542,1.2670976405805023,0.6799198935742238,0.03862012393865286,2.1309533550891944,0.5138917723663116,1.0002634750445387,0.7016713878467117,1.794083627389765,2.1827978373115458,0.6140696665954866,1.571591644900809,0.03915046322718277,1.1256100205439012,1.6154513636075352,2.248751663978909,2.808481431159873,2.2345495361163077,1.9745764109721038,0.9434295731708533,2.34754581483354,3.1344806667782517,2.479607506722984,2.2134388522766466,2.9977142244450867,2.841291194950381,1.4979115285601436,1.7780188952193394,1.9193748178015055,2.0860748372080513,1.316229408212159,1.3010115292877293,1.7211763558247497,1.7099527708058966,2.7183806108973276,0.5932682067180634,1.1052272875916702,1.6263643384123214,2.7830199672892264,1.7230361103509026,1.7078773980657056,2.4156407681025343,2.0607411197670977,1.2732175331951563,1.5870609991653564,1.941718320335582,2.87763177163501,2.2216847724793527,1.9786248354752847,1.8969081812049022,1.622999585584486,1.8632963810670362,1.232645992472016,1.381492339003196,1.5077405754483741,0.8500100632121641,2.010092115786994,1.1906970400587458,2.7060587158179543,1.2958266189665968,2.450574614451108,0.6248023429379346,1.7896774832542943,1.7333686154155517,2.0780931563918688,2.0259715411882167,1.9755929535854249,1.172223599521368,1.1784790416026696,1.479529731955662,2.051260651534578,2.3168412509996616,2.2097566274631273,2.379197181107846,2.2803780467559434,1.9460637410810642,1.426430405190043,2.9035168341419273,3.029640008929229,4.575133957293182,4.069741932125851,3.9574771877094754,3.7711632164307995,3.6286131819557177,3.1213969237675885,3.452890399160847,2.6958481564704346,2.727167125204068,4.418029070962872,3.4121264690784625,3.263228104044331,2.646765952486038,3.514304004730803,4.211818190938069,3.2718598812500703,3.47406154360925,3.077335427666011,3.3853415948997867,4.135871106207404,3.7688961720693297,3.838436909339552,3.115050932486882,3.2358982063210395,3.914463968439359,2.939389933397057,4.192832724013423,3.7913487821409912,3.473982291598304,3.267648241293652,3.202082581334818,2.449986693423688,4.025899267851912,2.957247826288853,3.8041123380452273,3.9855186870357193,2.8653314899568656,3.0528939043023264,4.253550780317425,2.5415205682607325,4.423736264412744,3.6622865053958025,3.8198107118305242,4.471314574129807,4.359508787968995,3.6343514591883284,2.925199429931859,3.1783062266580013,4.1568149506180685,3.1131306773148433,3.7514623362909827,3.6300666312599756,3.9093506239430025,3.505905140147272,2.8687130951171977,3.2185414085683104,3.1719727135700837,3.170782604073762,4.319245111678007,4.1440270671102475,3.2474806286981597,3.5743998580192273,3.4419928496718866,-0.7034996024305088,-0.6215960892199214,0.36343331744978685,0.3544081336022138,0.08911298702531306,0.5463986400154563,0.49782168627846635,-0.10522343062030907,0.21729105731474763,-0.8646230489153354,0.38732263355175606,-0.7974160284250349,-0.05666044850485421,0.0014391720062355271,0.5379844987049092,-0.3601934778326149,0.815259079191697,-0.3407050676255469,-0.5862963630887811,-0.17846482128499566,1.0673568428189697,-0.32146199397311703,1.0775241409251495,-0.35287370437760923,0.38474848288844304,0.094327596176935,0.05335647362023101,0.3895910243825752,0.4417268081058695,0.5184104310086005,-0.09449909495620808,-0.5890516945718881,-1.1524651590310757,0.42846056287233464,0.23620039509330593,0.6824513469002846,0.3111787502525413,0.41080900630714967,-0.9385598540880985,-1.0592360323890446,0.09051851795582007,-0.3412557757649958,0.7377393264656393,-0.6111804112889963,0.4494287222456701,-0.4608873621832825,0.33869507204494165,-0.6260005538611597,0.5286785701282539,0.8934262409441728,0.46967318798651075,0.07583179251487097,-0.1443452625917462,0.5994154184319378,-0.8163879273290175,-0.3115694012890402,0.038482036014932525,-0.8793790899432704,0.7482427270944662,0.3073510888811959,-0.354967803632066,-0.5490372369765918,0.42951443758477464,1.0520977385228893,0.13141255908136218,-0.0361702736494518,-0.7107153399416584,0.45362589162602784,-0.3754497013064464,0.4634166496704788,0.8754496618011172,-0.28482364040514874,-0.2971150728898171,-0.9771002912724822,0.4672842507905597,-1.114829030621087,0.24614793422706055,-0.2821967410604493,-0.8896427588936122,-1.1745340342148745,0.2662447086806527,0.10882881003700844,-1.271780160321784,-1.3188942773221564,-1.6611779558667343,0.5962238050606357,0.14961457493534866,0.36874646576773223,-0.46103300782563056,-0.34030428027899906,-0.10263504370446656,-0.4734752815110337,-0.7662823266251213,-1.4068671989968187,-0.5530567300351157,-0.13813197929356408,0.1679205364000424,-0.8460449023640004,-0.10882253240021661,-0.002656970352660057,-0.6107176429006109,-1.4538719379251424,-0.2675467579132722,-0.3746987840172592,-1.075831925155165,-1.5714472992249318,-1.0709511177802857,-0.9919744603454623,-0.6164594140033319,-1.359983349411078,-1.3128460858325386,-1.7950955846228758,-2.2618051386744744,-1.29284818595505,-0.17947185215361539,-1.0995026256803477,-1.7315863661851263,0.03933139778633023,-1.8632519806148773,-1.6942814403501385,-0.5114001850476293,-0.0754767896527051,0.14400645596605477,0.4983909986449353,-0.8118617034580273,-0.9582091248354283,-0.24418223095151692,0.5478076077760088,-1.6787673240448446,-0.7006635900176896,-1.231163751700683,-0.47143368797285656,-0.2187190792145635,-1.826492456986412,-1.6661748438918116,-0.014757291797727215,-0.37988660055533807,-0.8712844208654807,-0.7752832588875049,-0.3032791883100783,-1.1211472421305182,-0.4526742756700212,-0.1847539541137256,-0.48181029937412134,-0.5811560559887591,-1.5738677371017498,-1.3057649210248534,-1.4979030270009321,-0.12899609241375568,-1.3210885227056397,-0.7478305917365896,-0.18169665812702926,-0.34371663268535446,-1.7694992013651807,-1.4335106539268148,-1.5509113443246634,-0.5955311607110073,-2.394824458404559,-1.7929804905195375,-0.8810972855114156,-1.9040466102935645,-0.6213542561697231,-1.3096120513557228,-0.34248728135662765,-0.7133690703888845,-0.39044097416757656,-1.4805620862580071,0.06669583534704533,-0.5563161020285364,-1.2013066105513877,-0.512805546703583,-1.9400992784410378,-0.729918536260916,-2.0323310740996856,-1.1727828876033117,-0.5832822334536001,-0.9798798309571563,-1.8634306986460303,-1.9148661700245628,-0.21711274403931158,-2.1186894653272503,-1.4393048083395983,-0.0017621882515265347,-0.5274770795014861,0.02820363591746376,-1.9103769414066625,-0.8956497366730295,-1.79614124686178,-1.093370923638213,-0.94113388175305,-0.6208052674364881,-1.4530310422540471,-1.8599389730082254,-2.04717583983558,-0.6100803052925138,-1.5627954701086404,-0.9581355895594955,-1.777487720492665,-0.30633030012291584,-1.4201735570579166,-0.5741227612356643,-1.155363542957501,-1.4244708087088895,-0.6099674279563166,-1.2678141706459927,-1.00031866526058,-1.7365962125086716,-0.9296062515009709,-1.595034138268639,-0.5206342078214384,-1.7784390133446586,-1.2534275701504947,-0.42804589002926724,-1.648408268785734,-1.8516551803687207,-1.9063362938519897,-0.1511640476950197,-0.6259868256044133,-1.9882907129232459,-1.8726666152021387,-1.2295239038372463,-0.8881454290948505,-1.609620642078108,-1.020273454673154,-1.3278329586266793,-1.8651922322197696,-0.7453363243851502,-2.114295170150678,-1.8230948250894081,-1.0767208210246735,-1.6900567067044145,-0.4986067218832826,-0.35779026636722994,-1.9507553438259373,-2.4278733467161566,-0.8653732595234165,-1.8553205391104766,-0.9749425261708512,-0.7076958685970077,-1.1713972872949716,-0.39006560026082265,-1.6817131671943948,-1.7042446319452769,-1.0742789369270136,-0.5150412489750664,-1.5031700512717672,-1.3727681349333778,-0.8969133987003115,-1.3942533953880278,-1.918509641040547,-0.8901025683420462,-0.22898055375093623,-0.7773935989782832,-1.0399661925107586,-0.7177474552288317,-1.577039118187909,-1.830719306520668,-2.0398792300145594,-2.446884724148574,-2.8597979151697945,-2.1933097315235517,-1.8480398150421553,-1.4185285133191485,-1.939951737377019,-1.3488622901691907,-2.455714012705561,-2.451289235532611,-3.1566556694809655,-1.1435304979139471,-2.4662069785334007,-2.6253216476046934,-1.2700235745067523,-1.5685950193260612,-2.0722594064362276,-2.0324420030306207,-2.399966450180399,-3.106642042010065,-2.251045886542337,-2.3273024950051893,-0.9616050965790847,-2.2834162796409476,-1.2045518898819825,-2.0762254998777645,-2.4740695556857433,-2.6713634880952903,-1.6518025202745727,-2.3274930850145186,-0.7453358520231682,-3.0968401848671783,-2.267504588722184,-1.9075704704520091,-2.1092095439610286,-1.564781671490576,-1.8343566251537593,-2.63174464765558,-1.6774726004601361,-3.26721682638818,-2.8178185242952,-1.2769104715212518,-1.0815974680165497,-2.303849036130019,-3.0731789418452817,-2.840598044296286,-1.6097242095484068,-3.025809458309178,-2.781592563324072,-1.4493915762403269,-2.1529057283460142,-1.409258808954063,-2.466154393952893,-1.4213041964948419,-1.891956137071586,-2.78260322270217,-2.44671980694672,-1.002318581689242,-2.893494520836266,-2.1030150235560594,-2.664167918564123,-1.2073340478820669,-1.9974464108731944,-3.1102754504062196,-2.668572924171224,-2.9103535267533185,-4.023535971997948,-4.036800470573869,-2.8721781282394705,-2.702352801492651,-2.0744581961339277,-3.3494863477159766,-2.8991999898565313,-3.10137115783606,-3.090292004845277,-4.706303281728017,-4.481934564959681,-4.020689908312523,-3.4438176073059514,-3.571288584459299,-2.8780452534718086,-4.111820257472979,-4.142435603051662,-3.6785746273801876,-2.7862933732603556,-3.9540722626177742,-3.2798601684953312,-3.331711021670262,-2.7441236678900336,-2.827179643153844,-4.444308605354224,-3.8972881662571655,-3.707781056663797,-3.325196106071146,-2.88868182769869,-3.2179444366637475,-3.89557450698173,-2.604603678999574,-3.161258324810035,-4.223479299345929,-3.8183916632972563,-3.1940004490982448,-4.315386752447933,-4.028938922435159,-2.3824668626906975,-3.20195095934286,-2.9514629149816742,-4.318826422199029,-3.5382513042439383,-4.051222284187304,-3.9180338072223324,-3.064703860515856,-3.280251446409992,-2.6627727577878906,-3.7948356662806484,-3.482265309615385,-3.4245596289540106,-2.6637169479640948,-3.434695685646734,-4.065853922150125,-3.504588926553214,-4.309069395920162,-3.974848609464591,-3.7173092013709064,-2.6123798624522396,-3.0766524572446174,-3.1076523590378153,0.8176379135254099,-0.2966374810327052,-0.030023283943529308,0.829143850842063,-0.46050956978457736,-0.6530744153705155,0.37318352891917844,0.3443526331803153,-0.6801452342341986,1.061927157759134,-0.31864130809194763,-0.5949852466271471,-0.624220063934224,-0.11114725744252626,0.38650675341086144,-0.24234047425900437,0.05373213466075695,0.23826946139441393,0.03355590142662938,1.0471137124991226,0.32572644983562576,0.4548637187722273,0.42923746221695686,-0.0977555271241107,0.246649029919337,-0.20990829065314903,-0.39441686969458806,-0.23861137382601527,-0.812018314753114,0.32034501720533887,-0.6852017758066739,0.6846263371055014,0.9895771955279686,0.7867149016237883,-0.39902932288082404,0.22634331383439338,0.4326208722481223,0.18880279499474936,-0.5838028625551678,-0.9813625069660006,0.9836006692866532,-0.05373635441807371,-0.7016439025839956,0.6381793190919172,0.08943069669452938,0.49495104474244683,-0.8177774876458311,-0.27341031119705933,0.3342157506556945,-0.9592302267668478,-0.21747571456567044,-0.36578946756110964,0.18506455498917615,-0.7399349046175202,-0.899350165411766,-0.023460049114706734,-0.6739737609543393,-0.3177144829525679,0.045733837435857204,-0.19304134309729076,0.8533266340285969,0.35269517639473036,-0.54135080916379,-0.03635440989784316];
  this.h1[14].weights = [0.4876637715921617,0.14700588041421403,0.35214364683565647,0.8303846917407585,0.4765677399447097,-0.6222998135983588,-0.3358450305129259,0.33721919213235685,1.5937729610257527,0.8398473548682933,1.667125499703415,-0.17110695581654772,0.08537491292355108,0.46297522497804133,1.7290398644224516,1.7930575655865924,-0.31396492238412416,1.0347980524270513,-0.09176362758032543,1.0034358103616485,1.3111479768806913,0.29144903184158044,-0.3060045384218394,0.6887002904041606,1.2250349158213343,1.0241898462309809,0.1984759284898902,1.3404795615876088,0.14521432988634053,-0.7156180812939916,0.353765959135632,1.1418616111166016,0.340265510751212,0.07763451727380737,-0.8122777898354107,0.6388566788414584,-0.6620087220365968,1.188444992678765,0.6252152632331358,1.0619820314356727,0.6615495281509539,-0.8420645049080314,0.43055954053876544,-0.39358581835396694,0.17886444138214339,-0.07209097351513365,0.9566987850759577,-0.446764641767532,0.2184483565329168,-0.2435722666599541,-0.040966103104480976,1.0056017572228666,-0.600973831013535,0.4457591886043031,-0.48383824658990915,0.36645626574534973,0.3247988336867693,-0.6006836463973029,0.6773570293885536,0.5125370362868069,0.5960640566287729,-0.3264369108716556,-0.12179352893917939,-0.5008337258078033,0.5323428254175457,-0.3548004275579434,1.072964695565055,-0.2351628183392875,1.3921590525667953,1.4326946961240734,0.8146935341452316,0.8877106144674826,0.5699011081736326,0.4289689902574693,1.4330708042575906,1.2530083306434714,-0.06625033390704037,-0.2441231417112363,0.7888847100957602,0.6873341539740648,0.19630337318833074,0.8249562220827386,0.27301841192135434,0.4993189274205732,0.9362179195826298,1.16255751575571,1.5605212552869239,1.4073634701260513,0.6701607479212013,0.1593507601796455,0.3443821924136377,1.0617185841540502,0.1717341308386395,0.068785002955476,0.8697764697503633,1.0730697550116985,0.21972181519965484,-0.33422093843981915,-0.16617592798478734,-0.35476492040052493,-0.044211315195809286,-0.2712210141752462,1.0919685957037706,-0.47029496119722625,1.594933421599315,0.07284882271517022,0.49716486430707346,-0.19453340569937225,0.42947467625260044,-0.1276189132224047,0.0838535412338733,0.3419102811504286,0.36970951741277636,-0.2334889528674357,0.6464432856850264,0.4530581474106698,1.6561279861142597,0.3914285255170519,0.18455336648310064,0.44379695824223064,-0.404871543343596,0.1916970961454271,-0.22964846347106355,0.17280332254770073,1.078439192123948,1.0740443965800102,1.3203722827158906,0.32960293891051473,1.1184813964618388,-0.025954286088594077,0.34898486055115113,1.4984533712253891,1.1677199945423322,1.433138118426516,0.39203269175775074,0.09093495877320812,1.3100214449069119,0.9152805892424821,0.13684891947375707,1.5632566141169317,1.0934272830888239,-0.09252575434879864,0.8578246530210112,0.5407320117578838,-0.18196215457646295,-0.17191411559730133,-0.05699491013854248,1.421994800785759,-0.027131352867055987,1.0105619040402536,1.347401974880748,-0.24065018471532135,0.019145930483249,0.1368496211864623,0.465164497775653,0.5933163757778633,0.4670452057270485,-0.11287566014229479,0.9452333887263156,0.5565499821025474,1.2985905108430411,1.0371539294186252,1.4458981156318438,0.6946573323943968,1.0074965255621025,0.7178359145523582,0.6504142135258532,1.1175254579958185,1.64483287710526,1.6062492618424205,1.8414242901083548,0.5231628980630707,-0.2001454514349284,0.3332882854693733,0.6116432784991925,-0.0705159174564056,0.5963447738826326,1.7914114691661365,0.8408127261154715,1.686250045225339,1.49809679458167,1.069359032480898,1.501471115117576,0.11141668738045969,0.3117060289061943,0.778340161159754,-0.20309161241825585,0.9368930401840104,0.14671738255337677,0.8854541622413945,0.7027227503864643,1.1470220538954439,2.0176076406256667,1.8701107077913492,1.9359120618247725,1.7719952782830466,0.2605847770030599,1.9359095882694315,2.0677291410810437,2.1394705450647065,0.8412704542323137,1.5638208813984409,1.435593295104631,1.3828469636477068,1.3519706912632317,0.8643554717142226,1.186341392405424,1.359018722883419,2.0696721137890375,2.1318891189390405,0.4041999894824509,1.241327824888464,0.29154901406412637,0.9649447756236459,2.181988561576604,0.6774931751613084,1.3808143297375144,1.494700595954858,0.36513908667643885,0.5622982656770958,0.78119115988795,0.7676187559853985,1.207792807808755,1.9237140367672854,0.5066947541790309,1.35890615009265,0.4192139483470953,1.9730521175863518,1.3116974071966385,1.7204250259958682,0.7751215162773117,1.0802353233429494,1.2575703919914516,1.6809218017721141,0.23180265027776825,1.6083130968839612,1.3442420716767904,0.6935885929072738,1.4265853204528371,1.17162017940494,0.09899029888367081,0.47990000348604495,0.7341878150045728,0.7578834699893714,0.9568237597873631,1.8072304854659593,1.3636086614792629,0.6271972688699293,1.7670621044279937,0.673356168836738,1.8009268309060915,0.2554031419919226,1.419029820748646,1.5641800506432437,0.4851662406368054,1.368298682528767,2.308329041984862,3.128487673574245,1.5923879533032117,2.9519417129466126,1.6425922435070053,1.7793753795626965,3.00709227655855,3.3699843994567824,1.9175671031476444,1.3474774931266156,2.4810831655272745,2.0309553812566055,2.7178870400876645,1.6038140758837702,1.9001738423356305,1.2262712659871766,2.312134329340138,2.5580318969512392,1.7777772560191962,1.7792126177907412,2.186743053342636,2.4018705180678257,3.0071676204817397,2.4815003971605254,1.6661075321452747,1.7000441766232923,3.0821208313263724,1.895839026418744,2.9446413056325302,2.5737995606737383,1.666001343665272,1.9722302088718517,2.4695837361111144,2.399683601287282,3.1805707572837063,1.2347935500528076,2.5471262348274304,1.379901546029871,2.9060392942326096,1.3624141343757885,1.3213406270682717,2.4254294708698976,1.7979549498598335,1.7305884448206794,2.118984631451003,2.596874777891329,1.6193894684292867,2.758913799967173,1.1807804803113906,2.698164980269799,1.2746646344930348,2.371464619224335,3.0791752384427706,1.9884643029116547,0.9658683383577121,1.4870212424866083,1.7051554231035118,1.6938600599146747,1.821389337104117,1.8407678702005168,2.430221290252775,1.7308094718276505,1.4996519713567569,2.2583362194727665,-0.2014638126993281,-0.7834032420266241,-0.6170461711423835,0.2201115670685737,-0.5481313209254141,-0.6979741201005389,0.7828545433433576,-0.47435227197474206,-0.032247465806467354,-0.46500604454680106,-0.7749474268220836,0.43550990179450283,-0.5470197173942755,-0.7194712304109387,0.933356546288205,-0.7808534742892106,-0.49833876782326264,0.9235524115174869,-0.6298282323366066,0.5118588455876113,-0.4937389633008073,0.7556016206282044,0.6966515674639145,0.14009176170295667,-0.48609760399586727,0.60227857698073,0.6465253517109398,0.4931807832130173,0.5531746026522014,0.26697764123581214,-0.02348156326721498,0.4892502692550034,0.6722092471424569,-0.7793488797805744,0.07916143192624214,0.07419229305874568,0.8551643675351507,-0.729208005310197,0.6805301615496104,-0.003022802708376982,-0.6201045133986693,0.3767418628421607,-1.0469551140341218,0.6037371502425244,-0.838245621889579,0.39416831695593835,-0.6960832848458535,1.0473527278682633,0.079333900495612,-0.6037284566039448,0.8547718948733478,0.47763226572646517,0.6071137119309223,-0.0751993348174195,0.2516475926124895,0.5199983621774894,-0.4870013207701361,-0.2024465099132642,0.1527422664727854,-0.5995860860308758,0.9304286184381785,-1.0839017430324933,-0.6999900460878978,0.24204009621095582,0.14243924965699462,0.9582220673585646,-0.12696503927921032,0.15468884150339823,-0.33434446782107896,-0.19184860444134078,0.9773427987101213,-0.37329368817261965,-0.8301572619586792,0.2178459271260461,-0.7172548735726652,-1.0268561907343923,-0.6192536929379863,-0.5519932866954863,-0.33456193507415877,-0.7124847598237861,0.34459133038606443,-0.5558552433083503,-0.819068380160161,-0.4366501368344152,-0.02529088823826746,-0.9849378388849892,0.1856954796673759,-0.7730352190550674,0.06616512345481539,-0.7230177188182386,-0.21199154783982843,0.2537519403783834,-1.0672284714954061,-0.6758823792541272,0.4936293140111371,-1.0002655638575484,-1.408144622726205,-0.6178450962787704,-1.0279235300082772,0.11873878628897246,-0.9036346925516691,-0.1896356015650224,-0.2177974043468906,0.5654642322246175,-1.4193415033687633,-0.13437757617430662,-1.168518984220531,-0.3428633673626433,-1.1272411555936779,0.40678837767910586,-0.5555155301024725,0.4196240565500852,-0.3262854495317212,-1.3410724274514756,-1.0545949683859057,-0.4788384647833153,-0.562998099983546,-0.38573821436187616,-0.10573961745478161,-1.3741118454737455,0.5629649647143138,0.8396380019124043,0.5420710799116102,0.19852512278347323,0.45879480866357314,0.6177387058362842,-0.35654016587396997,0.9870751826924771,0.2871632853282226,-1.1232552567262981,-1.3967454240315837,-1.6288233183315983,-0.25135384668606825,-1.6175486486180526,-0.8355181371979704,-1.0964540312169349,-1.2882743974071027,-0.568389102294193,-0.4459014526095435,-0.2988251246844203,-0.44996104516596613,-1.1172432453579009,-1.4304597368702263,-0.5099810722746844,-0.6222426259596532,-1.6503004225734386,-1.6333020695960045,-0.5820701815448638,-0.8506768522559345,-0.8330666540156867,-1.0229981631982377,-1.1262997498691432,-0.4696085209907757,-0.6673234614872846,-0.323533368414545,-0.673818840310794,-0.9153422939380133,-0.6232917470747075,-0.17737093787770752,-1.287285224353421,-0.05584724381434267,-0.15039045070201976,0.04601450476760538,-1.2116162382918896,-0.043499142129262924,0.008556250406398362,0.015020351777769317,-1.2769458686026944,-0.8811028047244238,-1.7747371461840398,-0.17132355551825584,-0.6802519372457827,0.18483918805175661,-0.05130896211822224,-1.1074419211559836,-1.3121265636330557,-1.1494058042304196,-1.2505082249943882,-0.760139401871471,-1.0316106404729004,-1.3175123479689594,-1.2624834520968375,-1.4004949603285635,-1.3334954468457336,-0.32353769581079883,-1.5455745984269547,0.40576776254790875,-0.37575586845166614,-0.5541859127351975,-0.5514422073183893,0.1998360121820327,0.29769828064711457,-0.989266800270272,0.20176927015808693,-0.06863050982332743,0.1112312487503311,-1.504127010194744,0.17412280921280596,-0.4010343263645973,0.03071312363257731,-1.7327947768771825,-0.3740201955780341,-0.0019269148788467422,-0.4728596113694991,-0.30872062708994197,-0.992533267425646,-0.16974546809636026,-0.9639061190213722,-1.4379765288985795,-1.207959090714052,-0.5399073816114047,-0.6838046137581962,0.39005365643567574,-0.3298596181785551,-0.4901922969720285,-1.0875580345469096,-0.5648265997587009,-0.3155606481120021,-1.7202066846653787,-1.6250530205301195,0.07586252184613905,0.1492835022001658,-1.0935668310480635,-0.6723896462504383,-1.441384551907627,-1.0474447764139176,-1.7578774422438055,-0.5637132609467476,-0.3338054277154944,-0.1518263284827036,-0.8878763626570052,-0.1741492417963163,-1.009454699934809,-0.7646421785116991,-0.1664068824150737,-0.22809253246303982,-1.6720824088836077,-1.6771215469460843,-1.5582615536776896,-0.7353785005529321,0.12439032239861117,-0.9082578013412858,-0.11777839684079867,-1.3095404097589418,-0.6121458382674991,-1.5447735697672407,-0.8627187819132482,-0.3414933262443157,-0.7836598151751702,-0.21807946903821754,0.2642275231822025,-0.4085231261610135,0.16151742699715835,-1.1852683106932949,-0.0353379850291708,-0.03816814880245997,-2.011353644127681,-2.148394573741848,-1.5452753150542766,-1.9405719268843202,-1.8281315997045438,-0.4809392003294482,-1.2999353775339741,-0.9906779458871865,-1.2601401682476805,-0.2839691680879219,-0.6914396399501067,-1.1340094141917407,-1.9243789081396114,-1.6626721149550074,-1.44654475942031,-0.4480618937561087,-1.926636014033467,-1.7065945798428872,-1.1397217877519619,-1.6488742646811372,-2.1277578461040694,-0.37484516481634567,-0.17183641566376112,-1.6966016843350533,-0.9751995317378889,-0.3278116250533677,-1.3758788403270616,-2.1196769984255215,-1.931514423992104,-0.5022032855440748,-0.954794052354169,-0.7270289525704237,-2.0420949915927045,-0.9628302231444656,-1.020430992621672,-1.023657919563316,-1.7184403819441285,-1.3184744640848338,-0.5138333704628026,-1.1437174740734473,-2.1432681059137266,-1.7140147519826876,-1.7330121954588293,-1.3127191290282283,-0.5079519719632357,-1.516656618842272,-0.5959062386390197,-0.48836367229798494,-1.1889494802881475,-0.9915669083540036,-1.975615242204765,-0.8167318599149476,-1.89620307781208,-1.9463694664253317,-1.3976157428441027,-0.42900483820935525,-0.6553387668143674,-0.4302376336423865,-0.3725005274739113,-0.3901437619440975,-0.5701099603896527,-1.3049252576593153,-1.2942374125507388,-0.009621208228586918,-1.4202743494458758,-2.661593790715843,-2.4282365431662654,-3.0629903834170444,-2.606857430852897,-1.0201294952608169,-1.297996330653999,-1.5598268355833782,-1.1610404845988331,-1.3713689975525785,-2.416900084698715,-2.63775291477025,-3.0047320408876965,-1.249292265290491,-2.392879745769341,-2.7985906175421666,-2.4917736916843976,-2.167689687212467,-1.5310388437960787,-2.6585487746937733,-2.38791642244708,-1.3825971408996633,-1.8370179213782014,-1.4810791173643993,-2.6444806841023167,-2.322981221125905,-2.579060968636838,-1.5640056389382455,-1.866499101315845,-3.111849475288003,-2.924427518139137,-2.9331978746698013,-1.9349435633886167,-2.547335353735769,-1.445331355442902,-2.426260596476387,-2.591079367057689,-2.676177324172131,-1.4387099320549985,-2.227904693803049,-1.55037066000355,-1.2762410138374989,-2.9769106628388644,-1.6029699140498117,-1.4717092775621292,-2.228142178675579,-1.8158098782849674,-2.78948063452858,-2.900338350590082,-1.6562261159893472,-1.730746839988327,-2.6914512419906997,-3.125136494914236,-1.3020388935600775,-1.9363138054155022,-2.2624931545092157,-3.0597514413816262,-1.9354891314089164,-2.0475010944447063,-2.312917133755742,-2.2808981055705786,-1.6731839498782557,-1.5738389389508856,-2.298294642329471,-0.3841540419601469,-0.46486589779977905,1.0254869209564426,-0.11900126590740186,0.3927372833345005,-0.386745605307226,-0.03861662434279138,0.7058599250943436,-0.17795125282765903,-0.5341899239024289,-0.2696579169971265,-0.018559555390326988,0.07211123481402038,-0.09108373601265744,0.0947097592037521,0.516223194414822,0.34211049072419886,0.530971445005565,0.3820852449529747,-0.5780105481408327,-0.842118624842876,-0.25685000103696604,0.9856263123385828,-0.6403438829917039,-0.7682605316807926,0.10867125595137966,0.7653775309556384,-0.8877184641328023,0.8003597803113897,0.7812320521114593,-0.17678360098292026,-0.1969016216957561,-0.665719971963882,-0.18988483997358482,0.5973149369908959,0.5929581299441905,0.47439759273483817,-0.12851083830498408,0.8458927413416716,0.22809383737528957,-0.06231025860563037,-0.6773627816728087,0.5159642236475047,0.6175401618474522,0.19760795846082563,0.3363609417123766,0.02224323088553788,-0.825144772371145,-0.4730956364075374,0.36093790492730476,-0.42586254863183576,-0.9149933963900266,0.09908878682529423,-0.7381572625612498,0.6516253542862435,0.41231722036288476,-0.2133893112934072,0.14459067634180756,-0.10935747926985633,-0.5267998481889861,0.19247386970703426,-0.17601276883375472,0.4978215005862186,-0.3089073906984597];
  this.h1[15].weights = [0.8411073875323472,0.18582063646614833,-0.7440806956716277,-0.033563423212785715,0.13034648807244853,-0.68181544204276,-0.06117063737963857,-0.242223694516011,-1.058268519060829,-0.8542949656436556,-0.798626735046416,-0.5610475954191172,0.4629413507535437,0.3624351651081651,0.46870561548560413,0.12430855286585105,0.48874891000236,-1.4133896583942898,-0.9098077263038321,-1.0393025870697958,-0.09835978158875788,-1.2530183928627519,-0.5960205813101674,-0.27868508008091625,0.41533529044052075,0.171443942286798,-0.35674656259359067,0.5151210756560145,0.00489829430420371,0.5617201831354566,-0.6506730458092581,0.49541368560513194,-0.8780610694395128,-0.6753168496822811,-0.45769670705717896,-0.06864957441749373,-0.14098571712171232,0.6957160771241984,-0.04592425943009838,0.5354498209783641,0.38038640792376766,-0.1923551065326445,0.5780815402393596,0.8598498856745184,-0.4044121407179632,-0.8800002814406915,0.12064306642712914,-1.1719335505987185,-1.1212789541646124,0.08823736664698667,0.6505701728899894,0.45434219028274997,0.9078110442313628,-0.10219946361981311,-0.5225285456731517,0.7081871868413324,0.6138824168452763,-0.2241911149888578,0.47019340278752564,-0.27628314145718313,0.39348443114544995,-0.2440081702249599,-0.1304052492217016,0.6493222383662101,-0.36438776489209057,-0.9908570310323194,-0.34614655343778017,-1.0968104996695915,-0.3037315224383143,-0.8915095293586959,-1.2875865525145325,0.12895024879363062,-0.0125565204335696,-0.26931711838939915,-1.2118409061991,-1.2831319159277252,0.45598225576993723,0.42230107245353654,-0.7528613344420001,-1.0818160922232154,-0.6473127377865329,-0.12946168894279345,-0.35850675958962613,0.488472503485353,-1.3165089281756628,-0.7365660305648434,-0.9379825752055571,0.147776069157443,-0.3133251125758098,-1.1694681663340623,-0.714997235511998,0.3044185508422892,-0.8131948903707221,-1.3586075442638654,-1.0243380735486511,0.09615562389821819,0.47008868035115753,-0.8533792657784647,-0.3176770493602716,-0.06483020995883705,-0.678469309598624,-0.09303677512246682,0.5422552485953057,-0.35365436524068167,0.20451720125332787,0.38570138810947246,0.0400268368160225,0.14499619437678435,-0.5087999567665231,-1.2872156788194409,0.19834732943504713,-0.8559010024058601,-0.2724667353984318,-0.6133724740078115,-0.4368949650493562,-1.111081689283597,-1.0713268044000466,-0.2071857247596885,0.4754800267959931,-1.2218439371571232,-0.15936807380207985,0.6292344598957937,-0.1641013639832559,-0.289374235612334,-0.9651424427031832,0.5650862414066414,0.053667962749987246,-0.7735006091475974,-0.5257979847616652,-0.24682746038988979,-0.6066128087336816,-1.187773175268579,-0.6160384230050081,-0.44939419332041475,-0.6746554678189152,-1.1856148032883957,-0.6439072914560732,-0.49566713894907033,-1.1259610130002158,-0.03989411821081064,-0.2309156261906835,0.514631730897105,0.28915919533680184,-1.2073494902844564,-0.5017469385980304,0.45866018595705593,-1.0098548564941898,0.15617188142586397,0.17727179854337735,-0.5454631703802846,-0.880894744920124,-0.4842283867237217,-1.3331370748004785,-1.00820921751401,-0.14316450555377846,-0.910318968162426,-0.26356763293496255,-0.6952176981394947,0.4151800789445212,-0.3446535091784369,0.07454215556451937,0.4185080576428747,-0.21595352254413638,-0.7496291879649838,-0.25474168354066795,-0.9582114088913847,-0.3300991757005525,-0.9245482867814845,0.3280085406818143,0.25669711583094906,-0.5876578555955932,0.4268302781872633,-0.3757892746467269,-0.46874798226514064,-0.9103696015391369,-0.14353957628645972,-0.7892492837289404,0.14457126398951006,-1.1536548107468942,0.16797960421473795,0.3200251004524824,-0.996028505036339,-0.3511137014854932,-0.9707216053028056,-1.1123579973611515,0.1756739675021052,-0.5322615206763998,-1.4351831987398596,0.3511077186689861,0.08003693185803527,-0.27163851426841884,-0.19657376760120687,-1.7854557127793058,-1.2421777081994545,-0.7706129341214254,-1.4685810172958162,0.039353385430190096,-1.603543111986176,-1.334693656441292,-0.2977507201719393,-1.7844883936061913,-0.18518920176722692,-0.6931892343562474,-0.8226863091017595,-0.6725983217325299,-1.2690498452270658,-1.2061079731556605,-0.7083957226352262,0.1649898031886917,-0.2406100749792395,-1.2290626394745987,-1.2163050471872072,-0.8000601245767794,-1.549559105119363,-0.5176192686443328,-1.0206576242217327,-1.1637289485451014,-1.442005634738405,-0.384195407687348,-1.3106486364646304,-0.9851371145530401,-1.6693039377950758,0.021928715334421874,-0.2501603442718961,-1.616058361773007,-1.4816668369707384,-0.8282233920425613,-0.6396044134826077,-1.672078045211,-1.627255763216761,-1.0918757672274102,-1.1936738392465611,-0.8100497933258967,0.12127233865102549,-1.1969276299815292,-1.3940701723050042,-1.408650081085317,-0.2271469447179722,-0.6294819594936379,-0.7733918713330373,-1.4430839537619693,-0.2510807178973287,-1.0191887259675234,-0.3177320092476,-0.4557945819369458,-1.6288628464721622,0.146892179810472,-1.36722741527065,-0.4194292549159537,-1.3944190792043751,-0.1357472896902399,-0.9027608462706055,-1.430410599200442,-0.8188073094274352,-1.1515254917093054,-1.1218850990433606,-0.6204766899631904,-1.7759661408211662,-1.726630763157198,-1.5288411989759116,-1.5991315174635194,-1.0611870679210116,-1.0683031412528092,-1.5434038294497507,-1.8757475699601571,-1.6238923279593145,-2.4203991950575783,-1.6028782497973486,-0.853173755547669,-0.9364663144388604,-1.9146075007427195,-1.3258291715911465,-1.8787769701077224,-1.398872196145693,-1.6414775422677854,-2.5134395720412352,-1.005885021131367,-1.5373361428205627,-1.9490731371361127,-1.6419414411711828,-0.6239821294133181,-1.6490654130851699,-1.320953445403813,-2.2929486235736416,-1.9474139117214178,-1.708898646528912,-1.6752995602853094,-2.1710992424396482,-0.6391392100789012,-1.5891996368213839,-2.057400327396582,-1.9033959064062844,-2.0162385694527623,-0.7049393816986356,-1.1579490911158348,-1.7946081002440744,-2.1426221256566054,-1.6868058882180548,-1.8999949647832695,-2.0132490303470423,-0.8305316392182585,-2.2901819825389205,-2.3655761005727,-1.8929531244949598,-0.979355634007457,-0.8854613046357775,-1.2229667178431525,-1.838273728809297,-1.0521791288421996,-2.2212846683249037,-1.5279850372287973,-1.111166972320313,-2.123656018349261,-0.7650283652797227,-1.4321714688438225,-1.2428029690904387,-1.4157204934938525,-1.2468128200057118,-1.3080771490068643,-1.0666773837133723,0.9032228394194469,0.27974627989671164,0.7242264527605206,-0.6254648050886118,0.7967732085978434,0.6491454645718895,0.7923608559353688,-0.8485010841213518,-0.9028433340490648,0.23186494287089418,-0.9092264949839356,-0.09260628968097928,-0.8600956939213691,0.19765556392205313,-0.24548337350165442,0.97048425808608,-1.0609204394398977,-0.09073783552416799,0.13985736435492133,1.0219870246823344,-0.9013386015258095,-0.7585311384735927,-0.5467997114368406,0.4299104604473369,0.7344465067630442,0.8255642963718134,-0.3809065121135636,-0.3858558911370185,0.8899683398204811,-0.9228389619584958,-0.8413711695439945,-0.4773719273370144,-0.6559086568798947,0.13042812545983123,-0.47417279957368796,-0.635844427752786,0.11448253972326385,0.38808446613587383,-0.5068898156277973,-0.34958217566626243,0.9554577757230062,-0.3599526995889397,0.5728469137197925,-0.8765703370053607,-0.5689175097819481,0.61155709419519,-0.8852442558964644,-0.42389701977765926,0.06179291548508231,-1.0536599730234117,0.019931043581505065,0.8665317917057386,0.5310109346574864,0.5590325059622893,-0.13494898995203122,-0.07067463472050485,0.3131625012166516,-0.39406858507916226,0.23570631012806748,-0.8507681191427175,-0.1548549773483842,0.019797684903529834,0.4271224981656935,-1.1161547390471709,-0.9046589693491978,-0.6128254497164063,-0.3901933546113807,0.44060081978908583,-0.7613158441128061,0.9458559453240349,0.22429883029457764,-0.03950282993269383,0.5584087314363876,-0.0819734193745308,-0.9111543933331562,-0.19077956090208378,-0.20636035736839517,-0.5299729777475103,-0.5039410237068255,0.6688960736495074,-0.3611816815538781,0.016942729025866587,1.0812626129241742,-0.13701073094808897,0.9142739952141907,0.2984516771001096,0.8364855441753438,-0.8229690535522959,0.7205651622611404,-0.4726856587104896,-0.30696501482792243,0.8992016226973474,-0.5731877549158574,1.08483365643438,0.15856264140481366,-0.15429011990814645,0.6842457970657435,0.5024468599159506,-0.012360293191399113,0.738994102752319,-0.9250326205692224,-0.5415510873749948,0.18560955460197465,-0.784197840955008,1.263285849258306,0.27355261536943903,-0.7421346427399148,0.8914464513903793,1.0639512231532329,0.010993421913529039,0.4614244264864288,0.10171933856341198,-0.22406546592595714,0.8474673027772389,-0.0927964969619545,1.090050506410212,0.38770275966138906,-0.43068137716200783,1.0363954551478964,0.49496867166058833,-0.9658436204471861,0.21094205297108903,-0.6205278189813925,0.19692091890574348,0.6577030397382826,0.4266757923406006,0.5798153062551301,-0.2103712319199511,0.22347196931428168,0.3543021556796948,1.328173573095263,1.4018220068935003,1.1400826647552327,1.5300202649299646,-0.013337530463930629,0.007750020935889712,0.17640775420489857,-0.14629107525657686,-0.07254457158344337,-0.55375301321734,1.0682952546706215,0.720189427213885,0.008178826281930824,0.9104838517526094,1.1748723661008078,-0.23938658912116642,0.6044713300069917,0.6206064018314205,1.1719435314516284,-0.323174609607558,-0.1663116214996229,-0.38527580842763376,0.5639429436767268,-0.21425550840989385,0.9671023541773319,0.9604227229374888,0.1618814750766211,0.004146138392863338,0.7683715295871213,0.2769963320627302,-0.0966854328593901,0.05132294582747846,0.8474985934186855,0.19527134892132475,0.9040308436148176,0.7205005361187794,-0.5167833479235191,1.1345819477974408,0.8804705624898058,-0.21373172922616288,0.5202176899315352,0.6374808631619978,1.4673941564574926,-0.3185132081965781,0.013415145411266238,0.9422011500083984,0.23309267120332985,-0.16021648751768197,1.3485110059658283,0.20546173164054127,0.22882852807825715,0.44946737342318244,0.46326206245827,0.36241277975812686,1.0249397515207503,0.6482574938108919,-0.307130146072082,-0.36937557817049504,-0.14635258611727336,0.2979140223775935,0.8188055738293986,1.214563038177055,0.18570021330569278,0.7067620830048239,0.0537175001607599,-0.37214572458459694,1.0629520088581426,-0.1684349593129341,1.0381664918403255,-0.3827445907845995,1.0179820908086976,0.9542608477678759,-0.40568111589670053,0.8939261301378749,1.0610530326734378,1.1510387256543024,-0.20954520447773786,0.7359311534654638,-0.012233776607958869,0.24881434003435693,1.0622340076059638,-0.4152010066033676,0.8297384134981486,-0.4437182601719613,-0.12851869569376634,0.6051181193610814,1.4044850459995692,1.0845587124612073,1.3542583352537088,-0.5349167410590483,-0.42370145519355445,1.1903687860592844,0.648207166221272,-0.17175397604935735,-0.488393930303507,0.6392356481994398,0.8886941847008526,0.02369632287629771,0.473748219321411,0.28296614890289284,0.9546622363000682,1.2130583343941304,0.8387091837645342,-0.5134779141696989,0.10740396540847041,0.7939639244829906,1.4577401481267842,1.5277961742778718,-0.10521207908985751,0.7705135593480784,0.4460223477333821,0.49487506743991605,-0.13695264979294586,0.1790183431824699,0.9764330716464725,0.8848703137921702,0.3828648840237007,0.9733314992471387,0.022132369642683326,-0.5185660411844585,-0.4216513637150735,0.9443905139276955,1.0516013679328802,-0.48545078982947487,0.4575589029533432,1.3268657704276048,0.8148726694552197,1.7684675980897122,0.30693363981345306,0.29359003509349935,-0.05592322861585656,0.12143564828866824,0.1643681058654669,0.2836420320383987,0.5630174057789442,1.3685060943994598,1.3551056573342586,0.6705175405703501,1.6684648902103967,1.3675054505548296,1.7124263991382105,0.23803011901446705,1.5666073314037672,1.0929833436628276,1.2400130100654767,0.9422235677744292,1.2682996538397884,0.5852940129268331,0.6146053712954783,1.3663771952478065,0.017132266785580406,1.6426154626273644,0.6391699327576771,1.7310796164505406,0.8324852406738311,1.7553112052582642,1.5479971722525938,0.17096343718257245,1.8745426066126207,0.2676030296355945,1.1199755502370896,-0.2991519548890433,1.179321943902321,-0.037743069245922564,1.255382416380927,0.5149796375603699,0.4224781922602041,0.45544806472148197,1.510125518125187,0.24548046479399796,0.32927471254220825,1.5377822446039524,0.4308513908259636,1.1371470111773956,1.4778910511475427,1.7189017670658235,0.810614143363333,-0.07184630437552686,0.38339487792404897,0.2835352880836525,-0.17680767856198176,0.8522724271045299,1.2778480015662148,0.756562983245886,-0.04593421219439885,1.3861806872859954,1.5109656525510338,1.0256080264514438,0.6094003936878356,-0.1408792076525985,1.6228652076957861,1.85255187763619,2.3471960214229686,1.3943999816526988,1.8660428668436218,0.6434229756951477,1.3638655138661522,0.5247509525902689,0.9589349227113801,1.1313745993148183,1.2791461941787077,0.5158348242170067,0.9108028612698436,1.7687269095512224,0.9270753753630732,1.900948354797309,1.1918580471826088,1.864570822139844,0.7212470133202494,2.062985661643361,1.8162110613532076,0.9051357827441957,2.2755147757995866,1.4690075821824766,0.7593974755514108,1.6426003721752542,0.8803493748871475,2.0352799247796605,0.5843072253371558,1.066359244683729,2.280896971495615,0.8774072984690783,0.9490511892659304,2.2702177482806936,0.856767971371038,1.7041776674051208,1.0063985359943644,1.4584025798781755,0.9635484160398283,2.322492525310319,1.1635718491429294,1.128812955079582,2.302699808117482,0.7162193408979591,2.277532455777294,1.5092813160848713,1.8926952494869678,1.367572724441334,1.143234813887609,0.997040766584604,1.9958732375524284,2.449292204756109,0.946421054330667,1.3367732598291195,0.5913009246406254,2.1637280191998065,2.4040379102280944,2.3354577615703094,2.1076584262778226,1.461153080955813,1.9380898576088152,1.4955396994755323,1.2818385848867346,2.0308100248084306,-0.44378379937749807,-0.5624981715500851,-0.04616566446412638,0.15530816291823749,-0.8785409783547536,0.29247421372084975,-0.48713479762236367,-0.35797118832027836,0.4701725022718618,0.1097503247233154,0.010118243339256318,0.7301638929139076,0.8325279594751825,0.6048880678849127,0.8340245431071776,-0.8340272157378591,0.14440517300878622,-0.950540013690154,-0.6116818378487009,0.21950936621616732,0.21133380754058834,0.6024778697540758,-0.9335647571937439,-1.0036316629008664,0.7674454273509078,-0.34939704788496856,0.17657337945855447,-0.2374215331722572,0.8290349238117629,0.3870159558797869,-0.21485103552780363,-0.39005606988023617,0.6572571792911229,0.1575135338657545,-0.7017736527956896,-0.33251607828307056,-0.3161936349632888,-0.5595759889908877,0.6725314417873813,-0.27976372054646004,-0.9945241275100803,0.20922774282462483,0.859026678068846,0.3223213229993396,-0.041094424955686645,0.2937341272033974,-0.1715257147462437,-0.8639468278628025,-0.018908603623896653,0.8853352475435033,-0.792356693432107,-0.5033821244161745,0.5092671832396697,0.7468146030360957,0.04450249712751481,0.5297198629139265,-0.39434640162889545,0.4522831979832867,0.3643094526989322,0.28553740515188075,0.9084510278257091,-0.39662131414467683,0.016652181054122726,-0.5780210229433463];
  this.o1.weights = [0.1683518785490925,0.676584865163976,0.2582515913526278,-0.24319231157818308,-0.621572115222562,-0.2878905706992756,0.06243051369463284,-0.34239420009154053,-0.37958328634592636,-0.033330913463342236,-0.09683960607800277,-0.2717452447350597,0.1124313179572391,0.31860904381907856,0.14170495010590212,-0.10153786099847062];
  
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

  //{{{  init running evals and h1
  
  for (var i=0; i<NETH1SIZE; i++)
    this.h1[i].sum = 0;
  
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
  
    this.netwAdd(piece,sq);
  
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
  
    this.netbAdd(piece,sq);
  
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
  
      this.netwDel(toPiece,to);
    }
  
    else {
  
      this.bList[node.toZ] = EMPTY;
  
      this.runningEvalS += VALUE_VECTOR[toPiece];
      this.runningEvalS += BS_PST[toPiece][to];
      this.runningEvalE += VALUE_VECTOR[toPiece];
      this.runningEvalE += BE_PST[toPiece][to];
  
      this.bCounts[toPiece]--;
      this.bCount--;
  
      this.netbDel(toPiece,to);
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
    
      //{{{  white
      
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
      
        this.netbDel(PAWN,ep);
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
      
        this.netwDel(PAWN,to);
        this.netwAdd(pro,to);
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
      
        this.netwMove(ROOK,H1,F1)
        this.netwMove(KING,E1,G1)
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
      
        this.netwMove(ROOK,A1,D1)
        this.netwMove(KING,E1,C1)
      }
      
      //}}}
    }
    
    else {
    
      //{{{  black
      
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
      
        this.netwDel(PAWN,ep);
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
      
        this.netbDel(PAWN,to);
        this.netbAdd(pro,to);
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
      
        this.netbMove(ROOK,H8,F8)
        this.netbMove(KING,E8,G8)
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
      
        this.netbMove(ROOK,A8,D8)
        this.netbMove(KING,E8,C8)
      }
      
      //}}}
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
//{{{  .evaluate2

lozBoard.prototype.evaluate2 = function (turn) {

  var e = this.netEval();

  e = myround(e) | 0;

  if (turn == WHITE)
    return e;
  else
    return -e;
}

//}}}
//{{{  .evaluate

var MOB_NIS = IS_NBRQKE;
var MOB_BIS = IS_NBRQKE;
var MOB_RIS = IS_RQKE;
var MOB_QIS = IS_QKE;

var ATT_L = 7;

lozBoard.prototype.evaluate = function (turn) {

  return this.evaluate2(turn);

  //this.hashCheck(turn);
  //this.netCheck(turn);

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
  var n = this.netEval();
  var h = (e + n) / 2;
  
  e = myround(e) | 0;
  n = myround(n) | 0;
  h = myround(h) | 0;
  
  //}}}
  //{{{  verbose
  
  if (this.verbose) {
    uci.send('info string','hybrid eval =',h);
    uci.send('info string','net eval =',n);
    uci.send('info string','phased eval =',e);
    uci.send('info string','phase =',phase);
    uci.send('info string','eval =',evalS,evalE);
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

  if (turn == WHITE) {
    if (Math.abs(h) > 200)
      return e;
    else
      return h;
  }
  else {
    if (Math.abs(h) > 200)
      return -e;
    else
      return -h;
  }
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

  for (var i=0; i < NETH1SIZE; i++) {
    var h = this.h1[i];
    h.sum -= h.weights[64*(p-1) + NETMAP[fr]];
    h.sum += h.weights[64*(p-1) + NETMAP[to]];
  }
}

lozBoard.prototype.netbMove = function (p,fr,to) {

  for (var i=0; i < NETH1SIZE; i++) {
    var h = this.h1[i];
    h.sum -= h.weights[NETINOFF + 64*(p-1) + NETMAP[fr]];
    h.sum += h.weights[NETINOFF + 64*(p-1) + NETMAP[to]];
  }
}

lozBoard.prototype.netwAdd = function (p,sq) {

  for (var i=0; i < NETH1SIZE; i++) {
    var h = this.h1[i];
    h.sum += h.weights[64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netbAdd = function (p,sq) {

  for (var i=0; i < NETH1SIZE; i++) {
    var h = this.h1[i];
    h.sum += h.weights[NETINOFF + 64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netwDel = function (p,sq) {

  for (var i=0; i < NETH1SIZE; i++) {
    var h = this.h1[i];
    h.sum -= h.weights[64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netbDel = function (p,sq) {

  for (var i=0; i < NETH1SIZE; i++) {
    var h = this.h1[i];
    h.sum -= h.weights[NETINOFF + 64*(p-1) + NETMAP[sq]];
  }
}

lozBoard.prototype.netEval = function () {

  this.o1.sum = 0;

  for (var i=0; i < NETH1SIZE; i++) {
    var h = this.h1[i];
    this.o1.sum += Math.max(0.0,h.sum) * this.o1.weights[i];
  }

  return this.o1.sum * this.netScale;
}

lozBoard.prototype.netCheck = function (turn) {

  console.log('out weights',this.o1.weights.toString());

  var netEval = this.netEval();

  for (var i=0; i < NETH1SIZE; i++)
    this.h1[i].sum = 0;

  for (var sq=0; sq<144; sq++) {

    var obj = this.b[sq];

    if (obj == NULL || obj == EDGE)
      continue;

    var piece = obj & PIECE_MASK;
    var col   = obj & COLOR_MASK;

    var netsq = NETMAP[sq];

    if (col == WHITE)
      var off = 0;
    else
      var off = NETINOFF;

    var iw = off + (piece-1)*64 + netsq;

    for (var i=0; i < NETH1SIZE; i++)
      this.h1[i].sum += this.h1[i].weights[iw];
  }

  var netEval2 = this.netEval();

  console.log(netEval,netEval2);
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

  for (var i=0; i > NETH1SIZE; i++)
    board.h1[i].sumCache = board.h1[i].sum;
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

  for (var i=0; i > NETH1SIZE; i++)
    board.h1[i].sum = board.h1[i].sumCache;
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

