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
  
  // last update Fri Oct 01 2021 13:38:40 GMT+0100 (British Summer Time)
  // hidden layer = 16
  
  this.netScale = 3972;
  this.h1[0].weights = [-0.003955318862711721,0.013384389904033789,0.16812882880074032,-0.0888101155196881,0.427971206501101,-0.24804815431150207,-0.6368680070035073,-0.8454662882612194,0.7588960196595878,0.6788095128195866,0.37258739050168804,0.38717386622984445,-0.5540554959043189,0.06735049923176235,0.14372330290303534,0.3356031186793789,0.4815178888694545,-0.1471224040846265,0.7405919745428188,0.6587346385588465,-0.9009433191208847,-0.36580757504184813,0.8459258710476696,0.7745571475637304,0.47913504249057065,-0.32396187160377937,-0.4923508484728486,0.5260764916321666,0.9208301702859006,0.5835624232605549,0.12143925180228501,-0.6867181490854982,-0.2561891105537604,0.00339386581680763,0.018262025253983488,0.4865579381442813,-0.5097174148024134,-0.9164503521462037,0.46560277411944473,-0.6747687307935175,0.8576338803930966,0.5795839456388231,-0.37587548545077265,0.11822303224973542,-0.8651985641214964,0.0042741904613806635,0.08058884139465294,0.17821874960181217,-0.659981209556789,0.062157633247669486,0.6033478006413122,-0.9602197444435885,-0.169890980091308,0.27758635607192567,0.5102280625236016,-0.7347279667279296,-0.9504595059298384,-0.3639596846073059,0.17462819944397445,-0.8311295931412777,0.6715594140781236,0.5713112440752339,-0.599247172828616,0.8309025915227339,-0.8306027688583987,0.43120311071862094,-0.4439082207144136,-0.19348857332374908,0.2628830934230511,-0.45653735982242505,0.9525419099735056,0.8715431514418286,0.7635365585260641,0.6919935998057298,0.9580285367424727,0.8208988876536701,-0.08565434495083087,-0.94277815678012,0.3037722824689712,-0.7894841135948785,0.25606990266244145,-0.9532343173036969,0.9235678397564784,0.14670222632825178,-0.6964751812969188,-0.9093744199969281,0.841873685163004,0.6280220608946357,0.1739315534602423,-0.5149923824841841,0.9651485188291558,-0.13896611412598464,0.03944380652728927,-0.14685017813376366,-0.6905803730823064,-0.6502252358325804,0.002527775840808653,-0.5455686111481921,0.3306810133808786,0.9120970186281285,0.5465600674807394,-0.3163375974394964,-0.4121116758909689,0.6093558243181376,0.7635049436399993,0.7990369499375307,-0.7626590532604612,0.13079621031841365,0.5205742162462558,0.28699210126021535,-0.37488316188387727,0.8078528192106711,-0.3913470592651254,-0.7942211970846034,0.7146824079341273,-0.7971750395453611,0.8883079711328162,0.0513439395487561,0.3066039008059623,0.01312979655161402,0.052177231664465036,-0.20073441015814594,-0.29058546953955855,-0.12478030563955068,-0.0721149547701707,-0.17099366272727257,0.013254280464425627,0.6093194115076243,-0.15588227955439993,0.8709976207424915,-0.6661512454296359,0.6249702027111326,-0.7928809183821811,0.3516066023274234,-0.864950137215096,0.17211551324307323,0.861092798122569,-0.2021383118166298,-0.787268043908243,0.42681431922001284,0.21983915901929565,0.8675581274763896,0.6538059187638458,-0.49345067028373585,-0.13070982276151064,-0.32910399880831726,0.0607266776173593,-0.8229926417281804,-0.5473591349648493,0.7639779963972804,0.6865789602625365,0.9719825217987916,0.7081309675432249,-0.5346839558614729,-0.4157063849092438,0.24803175026079538,-0.463107922094168,-0.6408431631323017,-0.2181291198096146,0.9318445822087208,-0.14091617816852958,0.09568423578100856,0.3318789367817283,-0.345630842687516,0.40062674082456806,0.3946574906149596,-0.26659188847407256,0.4106984144273205,0.44311461241643646,0.5202130184723032,-0.4803598970715284,0.07780215821385186,0.8885223631983319,0.2928548641235033,0.06243392301209799,0.46324176439912645,0.635184959402522,-0.7911962697147036,-0.38937005892595233,0.6771797071690422,-0.6112763238374191,-0.3289892498723939,-0.71317987669928,-0.8056821181641587,0.3184075903115613,0.8546384326384341,-0.7170762185212674,-0.36470620410140275,-0.8601268625925081,-0.41515423425809467,-0.5641088804414317,-0.4393229237759829,-0.113391051516313,0.3228517390315961,-0.050407976021912826,0.11514741298272153,0.6300300519329819,0.8621001833159331,-0.8046988547388976,0.7884351418996358,-0.2854534887975024,0.33139740433280684,-0.4369846904704423,0.681369950668535,-0.2896936408735833,-0.35023514869236194,-0.3042416453024826,0.5561826499862723,-0.40468916452746795,-0.09383265574382703,-0.25770765784291094,0.39516902148632016,0.3919580468055122,0.989232875603037,-0.5262462376190618,-0.4027242722778409,0.18009912665819042,0.5487987158545825,-0.19833902107883772,-0.31105062798212435,0.9635238930659736,0.8918981719913449,0.8763850603626919,-0.0727697908561337,-0.5731249133784839,-0.4433475486424442,0.6811518446386359,-0.5141549330436259,0.28523059853090854,-0.007453909494408771,0.6876457088781414,0.7850259049534684,0.5081290372603846,0.40368018493181546,-0.8538653963858983,-0.5063299161150147,0.09245719928157903,-0.42031214119184296,0.16706622959285575,-0.5500604896208755,0.810479916632689,-0.01244104563639132,0.5874832941185639,-0.29025440809378467,-0.5910372169353897,0.42327585619217145,-0.6941162466689973,-0.8039452255433153,-0.6668378175218235,0.8778548987028136,0.6797138020774394,0.48977001991529345,-0.7409461780030495,-0.5883464723468946,-0.522732996489959,-0.8844908951866663,-0.46008520290731025,-0.40074975371623,0.9231222792754644,-0.1587752917050367,-0.1974764766214673,-0.6879360668627889,-0.013226124851676718,-0.3218032143386625,0.2178669508224454,0.6919726215067346,0.9817216457493125,-0.19994065928248766,-0.6573298596942403,-0.5852039786436228,0.5210779322316921,-0.5051394787691054,-0.20728108606542728,-0.42658174733736653,0.15807907783353253,0.08843349768533032,0.2435484641959768,0.5443717037270345,-0.6645697231561176,0.7208967076939726,0.9177218998790498,0.9456212306500438,-0.10731124867798128,-0.6089889804853168,0.8710782085824373,0.8803805931597041,0.4031032054774769,0.25640597201823034,-0.7869205175590541,0.5975468441859214,0.457062405325345,-0.7151271460192291,-0.826527314844469,-0.33203357997809735,0.5642168161243214,0.676622364661271,-0.7214122592047321,0.9157038705197046,0.5206344794578972,0.8658744028717501,-0.09818043872629038,-0.7228840497137746,-0.7889023561568828,-0.5624508143197718,0.8212205409822679,0.9319356144179368,0.2698082868478114,0.7116359432862793,0.7950287394504743,0.8988087382654182,0.9028692006698503,0.8277242406535806,-0.5547052598185216,-0.8806456701341524,-0.5130461530659969,0.43144450436478016,0.5580779852004876,0.7376250373805836,0.07488872152968144,0.3736309620592047,0.14511957336432532,-0.03659005206359993,-0.41441994792964415,0.5805135108866024,-0.9798348569825254,0.4191964859778003,-0.9906850104420373,-0.0638068838613059,0.9209106525634848,-0.04678325963863163,-0.908915880376553,0.19384305751824227,-0.7017738454771589,0.07850441609370386,-0.33962832458221165,0.45959436302228807,-0.8821796355770615,0.0815277049268199,-0.7501980087662844,-0.776240760404644,-0.3364678327176807,-0.5488244306574688,-0.7286833806945274,-0.9800888868100944,-0.19572341632590734,-0.8021893248623659,-0.4382568743734969,-0.24270680360272937,0.9978311817905144,-0.022193928147073456,-0.12813443891673693,0.04716395972696008,-0.9191727795802589,0.40895834296045136,-0.607557657565162,0.006700435323563673,0.446281236253207,-0.8248312937268808,-0.6748107769425039,0.1617288675988759,0.34452194601858804,-0.37639591645697573,0.45785601792576186,0.924278625108955,0.8014388121340899,0.8205200468017957,0.30193771358120053,-0.7670493560707768,-0.4413126190685207,0.05086022935667907,0.45742826713411433,0.47633456156205906,-0.6790844344033822,-0.12428358034052932,-0.7298376541755364,0.5351256559356213,0.10653261118574954,0.16006280605912748,-0.22313724120166092,0.27299841035583816,-0.6885265394915426,-0.28055525610289345,0.5024591710999666,0.3926479180606546,-0.7931637860380358,0.329005554171375,-0.5033231824999911,0.49982217928355643,-0.3550715866569343,-0.42806276282357114,-0.40469972086794526,-0.3314918721212079,0.5482377321096741,-0.7839651643899567,-0.9884847313664019,0.18693778469648806,0.4486762851701869,-0.09550585824465774,-0.5200225852146635,0.03172319142102527,0.3493892880941495,0.7531447143407476,-0.9188318047676363,0.5767934728117934,-0.14996695769758459,-0.8047065220286977,0.2320639704482697,0.03534534918272824,0.09554718533164443,0.222580261211952,-0.7793903106709269,0.33995839999439836,-0.23076240655957778,-0.16864495029566867,-0.25121846763059485,0.34497882743468855,0.4895471277286942,0.6112933384257961,-0.5204543831456386,0.8020302738389842,-1.0004541879103033,0.9264338691498585,-0.030488376415201877,-0.9689376276577377,-0.6491717725397105,-0.8807950692996611,0.14149135110134706,-0.9793341922938134,0.7162358167631475,-0.8242212529546927,0.4316458831868919,0.38035429895508804,0.3379929586765565,-0.8322082108090727,-0.08675664425855355,-0.07903618482156677,-0.8037342367669662,-0.9314093909232007,-0.4491263073098107,-0.5922772351439711,0.5745198093021329,0.3275886370182337,-0.031833861447467804,0.8665249914941167,0.12368443125971496,0.7358424058713173,0.34911465392747854,0.830810450745429,-0.9907745058246616,-0.6497346366434771,0.8998738474139258,-0.24195405687088153,-0.9080744646931943,0.17461136284500492,0.6676674723568509,-0.17683490408230168,0.4372626731219332,0.6995749593995247,-0.5683604611274121,0.6080016045330858,-0.34482154772788315,0.8758110392077929,0.15681073851247695,-0.36296072033351123,0.19649580205512432,0.7744956269516107,-0.7053833306310808,0.4430135055808028,-0.1254581212594322,-0.17206960449028383,0.3101607970866304,-0.6681137466254371,0.5160457959752177,-0.8992430201729449,0.6859389873737322,-0.024021378182250887,0.7350363561320113,0.15655822039011927,-0.43442591198830394,-0.44735485977640055,-0.9142207895094859,-0.34975710339036353,-0.8120401597899631,0.72635354745409,-0.9705063133033452,-0.9356078436243881,0.2006322598535861,0.05426097749819398,0.8159434957882715,-0.9652481507663939,0.4849125504819916,0.4609314257579518,0.5994400995229434,-0.7961752208000535,-0.8319158841989988,-0.6448875241914228,-0.5130226408516323,-0.022354196989476504,-0.043097699176850336,-0.41907772687373224,-0.4227953047704737,-0.42636974927227395,0.5263386677740854,-0.5110810962896755,0.21204643064476925,0.016063806666992354,-0.649197569125802,0.016056903362596256,0.7886006037496858,-0.6394002042577113,-0.8714966000436489,0.9974400362696002,-0.5110939662742061,-0.8740526516481605,0.7767325243846532,0.7910029784664552,-0.09853847541107234,-0.9246220585845965,-0.37676807839842913,0.8438397671026164,0.7767651945159082,0.9757990394226771,0.6473441634607999,-0.2346256847572737,0.9258277637428468,0.5135014714531337,-0.5939119339028607,-0.22095322437046044,0.9807157096467906,-0.2831851747736966,-0.3106571609014682,-0.014162095976995281,0.61865541218538,0.155068078202223,0.3061451838837946,0.08360291047995703,-0.8636104492651051,0.8490231726363283,0.083764420342423,-0.008248825883074972,-0.3645104933880859,-0.8238137459469766,0.8250231410442155,-0.9768851398134323,0.29543787652909936,0.4122637084792972,0.08772200274523405,0.8883316882188839,-0.25175384279091345,-0.4642317279716189,-0.48023927707512454,-0.20487258663157346,-0.5709311640473503,0.4545948640323997,0.7743379795649082,-0.5332197450590377,0.2613539713791042,-0.8968399822275928,-0.5678829193151783,0.8845881969033143,0.5908851281975789,-0.5925815317070547,0.7137597705713542,-0.05490910620988113,-0.8689774405440668,0.24313793591487104,0.37978770831513686,0.6345476097523847,0.6667816840181308,0.2680861851292009,0.5088615183868354,-0.3459783139654984,0.11429512623229222,-0.6142290572234189,0.12761139979715114,0.3222456718521661,0.7309519146275018,0.25125193084213826,-0.4216511709413581,0.5926262148688088,0.18516477265450063,0.514713376499903,0.20345072841722875,-0.5277128258513917,0.1448936397269359,-0.004724320601887702,0.4124069065374836,0.39484165135509697,-0.855495430446993,0.5972871584834947,0.7814670764294729,0.9906202550669395,-0.3297961972501273,0.8368398852755022,-0.6314447544373581,-0.979153600385648,-0.6336096838904373,0.5265238437395409,-0.5195830628764854,0.9787654175679026,0.3352795268984099,-0.033334292892916825,-0.4483047674845358,0.843290159024821,0.7636097510208746,0.6985552133884239,-0.46993690587050924,-0.29205098671140256,-0.870548444973774,0.5658194000804684,0.6543840572072852,0.5201608911935048,0.3063593989436174,0.9421125524558122,0.3355422119239599,-0.08879795471077127,-0.5355425175999378,0.8300157052202136,0.2803616913117239,0.10917479101050435,0.4489244757415305,0.6327608046291989,-0.8532312232264873,-0.4049779197165908,0.3743630762658992,-0.49767410968992565,-0.4887819366515159,-0.19186188228868686,0.5479197967698443,-0.6184256313052038,-0.4352115834856967,-0.6374696393037597,-0.32392224546315634,-0.5301608502082381,0.2680692743876727,0.9586890207938515,-0.05773447146963761,-0.04653490488198324,-0.29768703090977694,-0.6313560275868392,0.6748181136503236,0.4769588380416719,-0.8592614096156647,-0.973650035532148,0.7061985797249095,-0.5623280427674373,0.3388591974172183,0.0888820733211944,0.6040243587888859,-0.5878161765606666,-0.9313878972577968,0.2570557261910854,0.09825506280421775,0.6536994664449092,-0.8432216932376496,-0.41128727053989833,-0.5858411739030901,0.45808857088592514,-0.9026561004536051,-0.25958819021419455,-0.7222551131998909,0.25300203186344195,-0.8623497957932109,-0.6972931401932007,0.2586954359959644,-0.4766112613701086,-0.7103459376310052,0.3160792535692515,0.795956701652497,-0.08113903295552147,0.20219286054868432,0.6444789648765646,-0.815599716812446,0.4868864630938419,-0.9026628600163672,0.8685239230776983,-0.09914547244658374,0.2930961753569106,-0.6883248215519118,0.8721028654521832,-0.37542987093463903,-0.3582559638033893,-0.4787594795411677,-0.7275442928656934,0.02346549451544422,-0.23877269611063925,-0.3334705693397372,0.8070308591420456,-0.19634773203348835,-0.5700450273083897,-0.702521886984126,-0.5559347340199922,0.01649561086605013,-0.32715278426267697,-0.9759391159014346,0.30398211491733745,0.5727839554560717,-0.800275277596863,0.4657596594967493,-0.08005406369498563,0.9876620485186147,-0.3173912587974696,-0.427047866407542,0.08002726137138771,-0.3875738695316112,-0.25533841286166914,-0.0776987093123536,-0.8832078003519028,0.05303396245642546,-0.8603232082096689,-0.6644248169915328,-0.2353487893447306,-0.9436783168628252,0.9762108604594353,-0.4093033149176209,0.47715144441290847,-0.6232064453993803,0.051802564729476065,0.34504574716947245,0.583533254966087,0.1252112111758651,-0.657194844064587,0.8147545555599496,-0.6517139892334426,0.7535837507877546,-0.7842449005463257,-0.21827134350292016,0.5265252894498378,-0.6714661447508581,0.597391483915083,-0.4221233814004525,0.07528907336794957,-0.5632834495284172,0.2609572275818992,-0.9629285554597297,-0.7408258075151604,-0.465598192717051,0.7228624159684947,-0.19965788571004,0.5427215111022143,0.395418389558155,-0.32698818724667206,0.01296620599967202,0.5872271246431989,0.8174343302852841,-0.5698640263380594,-0.32690548739921393,0.5357522673626546,0.6036281171197798,0.027558408868618156,-0.1008139080604627,0.8586707992593039,-0.26422668822400897,0.500220959295052,0.4716781252342839,-0.42152315819201713,0.5716440692300094,-0.7373288104089837,-0.2949062559645716,0.890941427913105,0.8809383492306685,-0.521270703501903,-0.189538010951546,-0.923775951118753,-0.9829762476081175,0.7385204090591457,-0.1468960150013128,-0.8959574738301983];
  this.h1[1].weights = [0.9897085230364535,-0.47476385392916853,0.15726689408337036,-0.09865888555605462,0.23942887211021402,0.26251418551274197,0.20982829284984295,-0.006999905821276631,0.6765305741820863,0.15689999404047422,-0.8006446441115426,0.12130085085963017,-0.5235663453480708,0.4618929190035707,-0.20417739638451018,-0.5425619156451362,-0.6875336447101142,-0.6305556786744777,-0.6783183392930283,-0.7117099570710186,0.4223267734733201,-0.14717792945453134,-0.55161219398324,-0.5796986014907487,-0.87609674892036,0.2629999718162671,-0.7520272019542175,-0.7839812341517907,-0.7363901149397762,0.20636466019954905,-0.22502828007533604,0.6746697786993935,-0.12302608128836698,0.15477031630039675,-0.881690893555171,-0.6121306999113678,-0.5914634284614886,-0.9115782814190755,0.06952355423016746,-0.43339135424494357,0.5161917121645607,-0.2055018889258902,0.0414595626706427,-1.0027876817093295,-0.16053169519914448,0.12321633878445541,0.3771182064285296,0.08959284141042619,0.7324539798390086,0.058084379522211634,-0.49903825893620013,0.13901683427776831,0.40289281364584056,0.7023176898308197,-0.9135369100101791,-1.0327649590232713,0.057123317938477136,-0.09456993635355149,-0.8146460325691658,0.5648767166471673,0.40033565162618645,0.2536129607089723,-0.5415591803379032,0.447459730895428,0.7642934153376266,-0.6619040634238709,-0.719982628525804,0.07108367141874686,-0.6499037032425032,-0.07758415650231315,0.14429194193892061,-0.1455112759689809,0.27165021901132524,0.10657878029811131,-0.11315412152228567,-0.6400472928732328,-0.046633875284428396,-0.6767704021509329,0.5307414832698131,0.6796205432868598,-0.18142862154571254,-0.7584762619484339,-0.4323031011819652,0.6173636294611581,0.03137971358844781,-0.9725644938348718,0.8321903968669211,0.8813312537020505,0.05581697432103187,0.1835612621603689,-0.24690863378669645,0.11349267172159112,-0.19450647088392373,0.706194853080984,-0.5240973749534691,0.7962628613351622,-0.7954699651977746,0.43413341924236937,0.5601745041531563,-0.004011316236588648,-0.5546338464392786,-0.32474361781351024,0.2470042219124767,0.8396946541205217,-0.06877514308025229,-0.253319169258181,0.2313152093537838,-0.690618786651649,-0.47310688637302933,0.7771449500509869,0.3456400006711034,0.2122027133797528,0.36102026285775185,-0.4344739061669012,0.01506122302774542,-0.6698341102553933,0.3236889038802102,-0.46649492170197987,-0.19572935915490747,0.22201819842912107,0.40489430661669956,-0.5048035855286418,-0.7501451712827187,0.14865140539624286,-0.5600553858299554,-0.7806088381946614,-0.5653770732324369,0.3451370215364597,0.2514640232801279,0.579566782601756,0.8981156732660045,-0.8960242971445733,-0.6364964638901398,0.6602311281199204,-0.12945203323333912,0.8163492675846857,0.2600472055896867,-0.7805888010596541,0.5829593922997894,-0.8042892160579167,-0.40704554739697096,0.2974788396308115,-0.16570389191154122,-0.48873769245497883,-0.520317797126532,0.10257883787380215,-0.4000436285570511,-0.63095257271148,-0.9270866611819188,-0.8425826984247237,0.588211034421748,-0.5834207512454787,-0.28282855113168154,-0.6709860697563431,0.23744706420549688,0.9496017450910385,0.8294233047159266,-0.5414152356932183,0.8579140349918214,-0.05422236262163417,0.35108426843282026,-0.5776231406189363,-0.47952298398318455,-0.44717321701357393,0.7144407230823343,-0.8993818014005606,0.19885511760050553,0.45201286882594927,0.8659707895747243,0.7705865891074392,0.027445479354550537,-0.440568626425316,0.14206638606712732,0.17951930000548974,-0.7666165198222318,-0.7682232917484952,0.0014058819290595187,0.05153196330111457,-0.6261848439460388,0.5337558906487992,0.05506443623485701,0.9584525984644058,-0.6007283227445173,-0.22661678904949376,0.6725037171292133,-0.2309819729024967,-0.898244772874116,0.3480896919235555,0.18774737818031373,-0.5480722726541665,-0.44797758719406133,-0.23386808485579713,0.2414237868973598,0.7553196449747439,0.7663581261216047,-0.5328594660590961,0.6630456791531633,0.7894968771209578,0.6022922786881616,0.03195128841399762,0.6148575189726838,-0.6646833380066131,0.32615181028484186,0.25478263253092776,0.9641916648224975,-0.8075017835013715,0.6289491870097228,-0.44882641402958173,-0.9422092057060988,0.5281088230941253,-0.6489566290976262,-0.19998906474657197,-0.7093032397696205,-0.12028787421182201,0.2863934251873511,-0.9022952717151246,0.5338979689287803,-0.7060704131404909,-0.629098107017653,0.11128972031286856,0.21964792439898984,-0.2053651838756819,-0.15654758698127028,0.8277657097201422,-0.39067943702917035,0.7008080761526737,0.8340667698160525,-0.9473887945126559,0.8313965694111506,0.8189028725722363,-0.5906317646053377,-0.2191453587286224,-0.2725303262553739,0.44874755755649076,0.3921305445479334,0.5368075024308908,0.37223387952542464,0.12601911084536266,0.008342803289194142,0.3868432178411715,0.8584022208753052,-0.12868220834767133,0.6934519838032429,0.4855754635635489,-0.9352610275544281,-0.3218828193677141,0.05945670722709475,0.4082261010292628,0.296911944990943,-0.33835748277453875,0.788550941998643,0.2324969706856601,-0.0160468306605578,0.13812698996923356,0.1748795434070442,0.4892748503536717,0.6479699210791542,-0.31884396402426024,-0.2715259828661962,0.4793606910100812,-0.5876849511660395,0.9420764130775532,0.8886509615048278,-0.3874216148827641,-0.07544426625811045,0.11359365552761475,0.42299598286128987,0.85703867659226,-0.7240211879215556,-0.8922157631190294,-0.046449726434747124,0.46480991164360325,-0.3101726453007747,-0.38440652455239827,-0.6422982807934215,-0.05574072843582682,0.2810841770438527,-0.024609732462051902,0.07391771587116525,-0.03845928434950178,0.9733601418383584,-0.6726045937536753,-0.5209835112532382,-0.9905582649500612,0.7989522109957861,-0.46683634524857914,0.5597964934191683,0.5014537058235545,-0.17469111679651014,-0.6315998492724157,0.16910842463594183,-0.7771825863326538,0.44605957464824786,0.4344969281755838,-0.08458332754845393,-0.35572683282997913,-0.6711201578652755,0.45813542613267305,0.30947053676522673,0.7967048440604135,0.08927320563598917,-0.2425162571666857,-0.9745566278805865,-0.295011254791333,-0.9659867007815105,-0.12620640691897217,0.2338570728156532,0.6803277670414313,-0.7446333010293588,0.865878143966402,-0.19236175442113426,0.9806450634939476,0.7914290795032582,0.23166801512266133,0.47441250552741965,0.8029702401552266,0.21808438443726663,-0.7642900927139789,-0.4859855975218435,-0.5833755306399615,-0.6300048258153962,-0.016801472285847985,0.7556317699922062,-0.9079429813599483,-0.300222813948478,-0.1639050225348656,-0.18197255172588467,-0.07889962675451284,0.6957581131797475,0.3018964639238809,-0.13922202778337014,0.23099616946048074,-0.570779352507416,0.40639589018501965,-0.3093103308075971,-0.03107696797376043,0.7113454507488304,-0.20403379926642512,-0.34973891749749525,0.42177537952192545,-0.32529966071216887,-0.6262332377838818,-0.5478906410578729,-0.026990709159684156,0.8520036986712288,-0.7897811539893076,0.23810077851600106,0.19526076432879305,0.6303902523186221,-0.023924161661978072,-0.3804255173130553,0.3345271640491126,-0.46703328314164294,-0.6313455215219315,0.049470437797398834,0.7486964576743209,0.838919021629911,-0.5035889652180381,0.23461881629246803,-0.28948746327791214,0.0028787424777119695,-0.007754713670295023,-0.22701761804667844,0.6810283035530628,0.837009620515907,0.18588748969249402,-0.4926630556611962,-0.7290675178551259,0.023423356415390506,0.9569046023745689,0.0455458342421648,-0.03610069230601057,-0.24015734705689104,0.3081640922090923,0.8698056631665574,0.08162829502803344,0.7885208467416409,0.5486879072507296,0.5909916731050823,0.4777236142832142,0.108987819165852,-0.1748877882315829,0.2609814004641917,0.899863843895919,0.5797957978199664,0.5863147762802496,0.3276960037585823,-0.5849832669961121,0.7972327423240619,-0.8379817533656482,0.5726545415618078,0.9606898194404248,-0.5918584129187714,0.8740310513337146,0.9611582881656912,-0.6720318970025047,0.1328834755505422,0.4941700991584136,-0.7254738756623534,0.0005764939142320653,-0.9548330168479073,-0.012978617677013651,-0.9609856068705953,-0.9125147165643112,-0.49122532804013114,0.7268573786386532,-0.1918109019112674,0.13479580963355295,-0.8566566447250638,-0.194559912320731,-0.8226986810106489,0.14348154664292112,-0.5306742468546174,-0.5095915832547997,0.11450156613666915,0.03558664773236135,-0.2047083552799199,0.2679825408657297,-0.40464858165666556,0.3724609391672096,0.10973596899966838,0.37628948251836064,0.8427349959355087,-0.30008441424036847,-0.5271943086866612,-0.39918638368716003,-0.12707792720605304,0.9707664579731239,0.7495523519044331,-0.5348435379862784,-0.713562370716858,0.9130614727646807,0.7484236643174512,-0.9369842442145746,-0.7094333819875897,-0.10388121998051071,-0.5374417622571721,-0.25233352798292474,0.6603596579806701,0.43524603930712913,0.7206851699502312,-0.1991620036797741,0.2550010924352373,0.6822607679861954,-0.5062579430906271,-0.1321068932819358,0.5485288110356623,-0.8034015446488372,0.10010994995051638,0.22171243364808071,0.5088615460723693,0.22714867474589878,0.5619979875630581,0.6040465413355949,0.6728571134886902,0.08530360241153709,-0.5646570000533364,0.18760707470763877,-0.6800467480832351,-0.353157693250046,-0.8784092293462054,-0.6702588972419578,-0.09466482287613086,0.790838375028274,-0.13851207456419187,0.20932634375939674,-0.6344789705626992,0.7123718460827736,0.8856477865854979,-0.33271686309907395,0.30393687635527145,0.03667554844434132,-0.651727638711374,-0.0068186323345595014,0.9398359727728186,0.3458684968774777,-0.6016264689053943,0.2964741319693888,0.09580686896134108,-0.6370403606603858,-0.5292086118880922,-0.5936427286041447,-0.04691288553127839,-0.2768348493596113,-0.4854209424833573,0.5792492746815386,-0.8954126530258971,-0.996497027464516,-0.6067825713056385,0.009913448362987116,0.740166356412975,0.3582159934553921,0.45753859374810085,-0.8725052010787706,-0.12165226465172994,0.1458290783398842,-0.845687374664954,-0.8372490915014101,-0.42845300356103444,-0.45141779125071363,0.48306863890639623,-0.22519175932788943,-0.27817408874346267,-0.8415018137008918,-0.09050584943266658,0.8169499095605276,-0.4177351678374367,0.35204946294043693,0.08796180470715827,0.43444405560956506,-0.06926247028649188,-0.18450737472943263,-0.6571911406648375,0.2783364777843647,0.954063131176206,0.27932828139053295,-0.140616821177691,0.05293345455640326,-0.6066893258367944,-0.6915353602533508,-0.1424808677979189,-0.7447551438780566,-0.5421407228233077,0.34118188295427865,0.9326428247756736,0.0861086373754732,0.8131882252335828,-0.7563434740665838,-0.5285211287365609,0.8986525741117838,0.07658644242932693,0.6208749844721023,-0.0015461539783130631,0.16470813988877173,-0.571074390259895,-0.6875150320954676,0.13343813275191857,-0.9711635816344202,-0.26922829918443897,-0.4915284495083776,-0.8370342307485719,-0.4029966904332359,-0.6628444181238526,-0.04796643101509439,0.9711030068639197,-0.7384320320844526,-0.7666138779116389,0.3735632769204091,0.3136846132519278,-0.40671053225739995,-0.17865430096132198,0.4475762125958613,-0.1487196496002304,0.12892737526030779,0.14007209808776291,-0.7396557837729371,-0.8139695921524345,-0.7528464579221807,-0.13695921201983127,0.5532209723451105,0.49518391786337296,-0.5097740505785852,-0.6234225112517116,-0.6898408530331516,0.521069815860232,0.4469595971545407,-0.49177911215913916,-0.22261498075632405,0.9488848734145354,0.25258892485739953,-0.47611074729262864,-0.310769140223159,0.2620757737397927,-0.12252201968786935,0.7740063972167329,0.2931954587130715,0.7335599515351472,-0.4204127250772751,0.4789183879079389,-0.9032590043381847,-0.6270145728872021,-0.12260677286821835,0.4901775634705366,0.6145040865801356,-0.41161688212749725,0.8482168374973706,-0.7557117884422401,0.1886174196619453,-0.8841534556591565,0.5392236071147047,-0.545542056035926,0.9052741449822587,0.811944479161692,-0.5206919813504483,-0.4593268115991777,-0.09242991823066835,0.10841625406509925,-0.31319300059056804,0.32650075166134773,-0.4398055622762992,-0.5995923122598902,0.9897707409695851,-0.6374245262322349,0.9186446570318697,-0.738714759157757,0.5541820450460586,0.28733596454456733,-0.049240425079889905,0.7135218089694115,-0.39499162082515005,-0.757780606928657,0.062237750475756706,-0.21764269849472406,-0.5293778625103815,-0.7302021818377294,-0.02046957647649409,-0.4045330774996094,-0.1458569750885871,-0.5843436839883995,0.2999757919588772,0.9632887909609066,0.8639990577642888,0.4834965810509209,0.04598608119604411,-0.0700276652203054,0.4020266728538617,0.7707537196412744,-0.1588115828328146,0.7163186238062836,-0.9486820503241147,-0.6081349520512146,-0.938767431245562,-0.7481545498288673,0.9087866706960467,0.3694611718461452,0.7894959704165829,0.02659546018856516,0.8413723614639832,-0.928295944151568,0.311651667583527,0.915268558246868,0.015357552414352917,0.32233204597616766,0.6164206335934752,0.9347840333905493,0.7938478566907496,0.6740382845407596,-0.6531994651133962,0.10346352235597268,0.9743323243036321,-0.28563002797612314,-0.9022286622282244,-0.28039114548850397,-0.5315871508900126,0.8444381286757001,0.88649640062515,-0.3335414721286605,-0.28104544596037184,-0.0026696676855421505,0.8826372879071414,-0.8417139649819607,0.050985314035712305,-0.17067645927063702,-0.8000683235482376,0.5549410518338422,0.8164434286465331,0.44014057455977856,-0.4256147741118344,0.5583448002877439,-0.5316208673487824,0.10032537673622338,-0.9748826339189008,-0.3001364817330712,0.7446062007401478,-0.6181529568364245,-0.6656858015730358,0.37266439214975694,-0.8319226198592212,0.5257950269034309,-0.46367746886962197,0.012369955969874674,0.1060273403662105,-0.2905959716704652,-0.9497563746197248,0.1660462650781967,-0.17286603894715727,-0.601525375857352,0.45421361113586345,-0.06281795306891576,0.870656766430209,0.09669545766934527,-0.763995696529957,0.8010278276270081,0.4649707470836568,0.31641617753746126,0.046650903490131825,-0.9685846743078256,-0.5989405647439647,0.7920992129112363,-0.9773313756884545,0.3335995285208775,0.2795725028994038,0.635883094448967,-0.8638167015954425,-0.368246496146305,0.8708941663050288,0.25535462659880326,-0.6465573352226307,0.5835941874085405,0.8492227895747525,-0.931884764117161,0.25465381176999724,0.08066519030535221,-0.44941077204248503,0.4022675448389549,0.39680767694644836,-0.9067281832392758,-0.2754119865523782,-0.060742379732673164,-0.14981668407359347,0.37038321595544516,-0.9269992817251411,-0.8164342598050601,0.8924026102183635,-0.9851927561002806,-0.23735980074608712,-0.6266905006759682,-0.9610179063257637,0.4958708578684796,0.1026190869197744,0.4609180145831155,-0.08197676365545498,0.660535096810445,0.8326141634020007,-0.7967049397269867,-0.6428467257616601,-0.07496232501709578,0.3226828907018733,-0.5664383794877954,-0.24104603371999528,0.09055001261412159,0.7346232341348085,0.4580764845567509,0.7564690224345297,0.052239464131946224,0.4428906816604666,-0.2799550475148165,0.7469302457385855,-0.4361576933091501,-0.240846929702756,0.13328036220091957,0.23002730490133874,-0.663296062371844,-0.620531404537029,-0.7988517203716887,-0.6260795410558402,0.009269319102771808,-0.4102485487278489,0.635454844920133,-0.15974774312274287,-0.6805000275113714,0.7449534251220845,-0.11668106835618575,0.5798566436732207,-0.049684784640485855,-0.1567534455630354,-0.606034896565047,0.7093973297995672];
  this.h1[2].weights = [0.3034014416188504,-0.6534795862511449,0.6382070437525416,0.10329352395918745,0.07840939471867037,0.5945658191751786,-0.5634673964686119,0.18525586677782746,0.46987547348510145,-0.9192792604071373,0.36238884018600254,-0.0001833050945087257,0.1672148091338355,0.5030708791095677,0.4942801082486925,-0.48798925864645165,0.2026462866251086,-0.5273649536525781,0.3595053948700463,-0.9275875197712625,-0.23850702232622523,-0.09623628762363015,0.8617824363430223,0.3118663420354809,0.4598982663769293,-0.012353084810281245,0.19425903504684286,0.1727176982810382,-0.49559255840981165,0.7666951739590186,-0.47475026535419845,-0.6443694006340722,-0.8534579501006272,-0.7657405979067355,-0.4710155842699702,-0.9224852817071739,-0.9151540320164814,0.17896214499588853,0.4506400998523582,0.7161146719916992,0.19877250070822788,-0.4330395299830507,0.643096002863996,0.9571805933408355,-0.3945295016348661,0.865443588399527,-0.01743093103902627,0.5166769743824279,0.3390378874616635,0.5808126254461566,-0.689715787716153,-0.9016737714473247,0.9423457759008684,0.010939561141403178,0.21785754291708068,0.6372892819893168,-0.22060438898848167,-0.9628685127914358,-0.5194403282319509,-0.6655866917705957,-0.8383507691466545,-0.8013262384889499,-0.5998181710896398,-0.07352367345493382,-0.0395627053505892,0.6951598549898493,0.6414977475551832,0.029935961069024443,-0.22860157762773567,-0.7070470730738875,-0.0708050858913186,-0.5482946901347202,-0.1330030836539827,-0.04613379127648373,-0.888878096692909,0.4374062218479967,0.6060416439176057,-0.5713919053343796,-0.6924829679897763,0.1701500336621656,0.7325566840009525,0.7679977541503291,0.6217396939779305,-0.8112936476308679,-0.042060516560062655,-0.701942515596255,-0.21328421903264996,-0.3456626680747871,-0.2862682738855004,-0.6339430100055066,-0.253241392972482,-0.01855252333586823,-0.22394336448389854,-0.3083757097905359,0.092101036527389,0.7271224303302195,0.7750998936418921,0.0453178954884334,-0.07221046442088744,-0.24793343719026642,-0.9373637977680636,-0.9664365110611195,-0.4414886715542966,-0.003025182438841684,0.6248892561863982,0.13374549865360905,0.6365379865271886,0.5659302578185139,0.38600006621296734,-0.1970241378514681,0.003417490792958865,-0.47927003470291835,0.06643011207195877,0.5632872784156043,-0.8056978430940539,0.15413465138323929,-0.3681843870376382,-0.785954366916353,-0.12273881830135332,-0.28858183383644975,0.15220016903536834,0.6868767909250884,-0.8637958229904201,0.2399111786302036,0.7279795423038095,0.31282834494258915,-0.5645521287790487,-0.0024931620973361345,0.02419409658060212,0.6561789531201638,-0.9485364128436903,-0.08824938087914742,0.7212717154775545,-0.10575807850885043,0.23060519894384468,-0.8837033807931319,-0.01402230462401363,0.11943383471592536,0.24531185387124355,0.2181160448146616,0.9824348212914438,-0.7675370769824253,-0.6052747260488271,0.932598823995569,0.29793870531988315,-0.4881566740302974,-0.3262912262419934,-0.12499646640599693,-0.31707407076329797,-0.6453665846269109,-0.136516736031633,0.6594254159982145,0.2777919898320108,-0.8155660205857711,0.9534675419796157,-0.2100424042299,0.10992661947548303,-0.5772663624593447,0.5839304749220267,0.20239234685319124,0.9759643412332402,-0.3009228641659581,0.6770965396453174,0.19923730897239716,0.9456013066286982,-0.02576765428053185,-0.2091773372455839,0.5102339983209265,-0.2525112225465272,-0.5336281103430655,-0.7930246118291476,-0.5975280299715336,0.42680950498895937,-0.09298508192294073,-0.6327639133347472,0.45662261018902495,-0.3345934416707336,0.11238278852907653,0.4725740849372966,0.05682544376895495,-0.30579934499254036,0.06312447993515138,0.8611774363021102,-0.8587298715434607,0.7846002190668019,0.6257308621728829,-0.0718288505478028,0.29078515014696454,-0.6157087280273997,-0.9986291449241415,-0.8450200620458608,-0.02627587386533791,0.30616531088200505,0.16194429443575603,0.4874600951000982,0.02432665883866614,-0.8446063273340445,-0.2922410157063363,-0.5000149070346595,-0.9372226786489651,0.7308508539744809,0.675339527418884,-0.2840312796444998,-0.6897983909790693,0.4488228950644346,0.05162171435240076,-0.540021214198576,-0.93535537862762,-0.26056569957545045,0.5037033628874296,0.398811176263085,-0.4149794886522018,-0.18290360037008954,-0.3514499209536777,0.6110057621154147,0.20016239852810414,0.8300064904937613,-0.16707789406370605,-0.9490545285123604,-0.06737173317359556,-0.26933166170954864,0.23237541467613423,0.7457175238443613,-0.3826830520930613,-0.37034500760889205,0.3432280637093281,0.6847256777275375,0.7696572146072111,-0.9206331125964958,-0.836920561733685,0.6170155891958765,0.4766581516852231,0.06089911020917896,0.7296613997366029,0.14390104449087673,0.5019231374669769,-0.8808599783159395,0.7250723881090727,0.2640929333069119,-0.922002436196027,-0.5922668902867622,0.6259233593498774,-0.32773706198336594,0.128877240958576,0.39535310934902135,-0.1768503274131465,0.03198126433610587,-0.7787153981214129,-0.20336533285990016,0.0228765080586745,-0.8211710376168895,-0.01752231332250242,-0.4488300178932546,-0.38535427249483833,0.43656254790430116,-0.7363744587062337,0.7089064502118144,-0.5780159444572467,0.8337617207014787,-0.5620040118425863,0.9103676205251489,-0.45225874741471256,0.8389774578955214,0.8016048572884603,-0.558460937400109,0.4626750475855489,-0.8560251861896648,-0.9211427988150047,-0.11948098570870257,-0.3257480599909765,-0.9195760705929641,0.9632069537840375,-0.645811768045891,-0.11210002409194576,-0.6587300546685572,0.24015205317710786,0.5062132855203466,-0.6384315586636189,0.8196505782933623,0.11848709312359716,0.029466404438913567,-0.822922118831043,-0.4181219884086303,0.95654653705903,-0.8620388633533185,0.8507182919895885,0.0433615118910062,0.09588430005410341,0.11502940141366136,-0.6359254170903409,0.27050957361086303,0.2416957170769879,0.8368605852577352,0.6291051257276831,0.4236177055212417,0.2668489664730317,0.062477587099810265,-0.6750367510351647,-0.6077114008767569,0.6763885103603632,-0.912340450756971,-0.25348954146864494,0.24781866385724838,0.7425907101909676,0.022239555381285397,0.4445293980293041,-0.11110955936932236,0.21227886466215384,-0.7033310580137926,-0.1277986588600105,-0.8606608963045667,0.7557574799245922,0.5342425114462879,-0.5249704237164958,0.7236223307803209,-1.0240570760705248,0.8582786887652848,-0.7420096217118939,0.9608135294999978,-0.40082915830970883,-0.7480941772664859,-0.11316664150896326,0.1565182360971179,-0.7119305884480752,-0.9012012374247808,0.6173163776971318,0.551130831243685,-0.046747397147903255,-0.8075357202969708,0.66068591935305,-0.9570753469757504,-0.7605078831311461,-0.02658056517855272,0.281564121699323,0.301079272764155,0.8348129708373119,-0.9679520063094901,-0.450545492165276,0.894042793994509,-0.5842510261940471,-0.29985822425269215,0.73032431307494,-0.16073199964534365,0.9991845849679794,-0.03172306791547181,0.36345720640278084,0.5739183755487374,-0.960267003527305,-0.6509154345258392,-0.9227007899597338,-0.878931702300949,-0.8731255290092934,0.5416337563735022,-0.6414681526885914,-0.4709511474873668,-0.5043987191460434,0.422008877646534,0.24301548740652285,-0.14094172800077254,0.6573900957429745,0.8166232756353048,0.18196545970443914,-0.4909108915958013,0.7559946383437784,-0.1918347546374429,-0.8492755821104949,0.4093161881512286,-0.44047770833629873,0.2373981221113723,0.1595045417766069,-0.49798981420838845,-0.996970163308697,0.6081066799567988,0.8962990224846817,0.4238280713724896,-0.4722870920631258,-0.8549497671847315,0.7658962001092903,0.7291975808125731,-0.33551752661162415,-0.9834650642755087,0.5540472914973904,-0.5912848122742816,-0.26745174703983715,0.1458727477883568,0.14994275063968665,0.6578104101700855,0.34770343780057855,0.798361925881852,-0.03638954283630502,-0.7891615558341845,0.7060529551984982,-0.4678537237655194,-0.3879434614404672,0.6949459480583017,0.027712715462197047,-0.6373383631690586,-0.7979823281092676,-0.21267795437120823,-0.2505470350299206,-0.47326498801190775,-0.3660750077511819,0.4606656915902822,0.9360186143145562,-0.48651909602918236,-0.6068221158334434,-0.14989825319869146,0.5215315082078924,0.023122869466573538,0.7736370558482499,0.6238831034577139,0.7694198810977448,-0.881933617375372,-0.3406278392044362,-0.019172851538570297,-0.5816870217123643,0.509925187778626,-0.1488040889024442,0.44158022235694316,0.36644409146994317,-0.4589401094874716,-0.7722762487004792,-0.7057897343799582,-0.4135281502203065,-0.175826206232449,0.73627696723404,0.2725719746893572,-0.9757778509354589,-0.16027145974616255,-0.029913508086633338,0.26263941519415507,-0.980676203163104,0.17570268606225184,0.04606410650758814,-0.48234679888374843,0.22197384333924222,0.3764897953589647,0.5362505909474725,0.38485946049053343,0.7465195476733073,-0.45418737380947194,0.2739582125952307,0.8296656729587459,-0.005102583689153839,-0.8114243622048072,0.5858713812416108,0.349012254224105,-0.24774693875092657,0.8008832711657179,0.16428265479723755,0.37026175979086906,0.9888322387200108,-0.6289349424920817,0.337557605482886,-0.660566937926447,-0.2476646778191446,-0.039992335831366244,-0.2898265190205679,0.5403352596745649,-0.30173320641010776,-0.522597935605741,0.19960840415553624,-0.006010129830141523,-0.20425560828502945,0.5448094406996098,-0.4145503112914997,-0.4885029391222152,-0.24991776773129815,-0.1329792272442828,0.7192795846147023,0.8155178191371568,-0.397073794364491,0.05347455889627087,-0.0050563726883892475,0.3013732650426117,-0.33303343320281276,0.9596091802155863,0.16683623154629149,-0.020679335472944524,0.6015114163498385,-0.6447905587067906,0.013632543910236612,-0.38884032711154204,-0.5846710098413463,-0.35285261175176347,0.8594084682124179,-0.658343340351861,-0.7324535731728329,-0.9150016798018333,-0.9280528579561097,0.8308181238511126,-0.9617372821671778,0.7940860056265957,-0.7872434158438354,-0.23969971243288435,-0.6784135537938151,0.3597809269149507,-0.4052283142255955,-0.6518658832136167,0.7067467110472405,0.21144145939116038,-0.28424799434667014,-0.2799838315369759,0.47735748033518166,-0.3799090316918612,0.7088289571214221,0.4434197262393301,0.16138449812165692,-0.8877515866644604,-0.7396833227455646,-0.3757486303989371,-0.038794660715111944,0.06765155734331221,-0.22651480159779666,-0.1019046038816594,0.24212608692695245,-0.8056422741710623,-0.7889563162306132,-0.9701859972016075,-0.8970213040814592,-0.14796895593080264,0.879675115580983,0.8010567994770315,0.6758250498567508,0.025755457583232957,-0.5869333730352052,0.5266597711393328,0.5539889540446896,-0.8823771812327148,-0.8772923960438962,0.4678212521872685,0.0210984551725051,0.5934886389944867,-0.6917894353589822,-0.5818346300933346,0.39706334088918416,0.12894012010740288,0.8291796663238081,-0.40400608417192496,0.42654595239990056,0.09077331481197633,0.13522301437883058,-0.6041783096744149,0.8501402104263412,0.9085782725113521,-0.8229118079989944,-0.40704990173940697,0.6352225068218382,-0.6928404688450294,0.5579107343032744,-0.7331150014742861,-0.15743384331136565,0.8899362024372671,0.2657328020773421,-0.10869643904469951,0.6079956217982905,0.4268491102020706,-0.43288358358927537,0.33029319013937547,-0.18293552830609264,0.4973870260837553,-0.5767319944065152,-0.8850480664578981,-0.3914304640104012,-0.8620151317375905,-1.0001451724369812,0.9062272913789471,0.30149523519863486,0.5589338641458332,0.6276406802187836,0.7133048163828485,-0.569291576922669,-0.3243859172011838,-0.5895483693488652,-0.25311652991539874,0.0733146588882029,-0.5399728596484734,0.9789867582246817,0.7912901010427711,-0.4482449440798341,0.7622521599751263,-0.9312880592327025,-0.8181080672991059,0.7374384861230106,0.490857356144926,-0.3371702456646226,-0.09864823358091018,0.7744236288105801,-0.26223081199484854,0.6640809998031011,-0.01970154508152094,-0.4287366849101414,-0.15536917696132296,0.7374488777292093,0.8800753538825202,0.11318352341872642,-0.2032119694714618,0.9108829502116065,0.754217912412582,-0.9774133853454983,-0.4875776460188853,0.8124187673349162,0.8070725157778665,0.032630182589723396,-0.33698195319090296,-0.005080268364983054,-0.7560226201133557,0.769687054884448,-0.4968717716558228,0.02444947327789692,0.3776092615844568,-0.8473494711547198,-0.6363901855718108,0.47778505297406204,-0.6711284266749301,0.386246999257038,0.0073625006786322824,-0.9159511124115812,0.4694302416060461,-0.23080273412835517,0.7096831367923259,0.3961653276224612,0.028506565081479956,-0.3306946766596329,0.987324224059136,-0.29381620345534065,0.18404538637293788,0.48799790691697975,-0.3344931156799803,0.40542517218274104,-0.1911360982090238,0.8508641986399417,-0.8806204673392078,0.8424026033760986,-0.293813421007944,0.8820629658022838,-0.03721567639746054,-0.5618786305695191,0.228182421250509,-0.4067952561261995,0.13388070110272124,0.18215719070856584,-0.8318893898898818,0.42611785916707745,-0.8530805425022706,0.4582026634460739,-0.9376448259004699,0.6078650810027993,-0.5495001353228346,-0.1284566753853253,-0.7302488516286066,0.4815017611059036,-0.3112475107112692,0.9106752962831922,-0.5264644517587732,-0.45046920829747517,-0.6606184507777749,-0.924437832840564,-0.07721345347828466,0.29880877629010233,0.4371163317202022,0.6704481654103074,-0.919266985915276,0.12058278030726802,-0.4750986465872747,-0.5229654540172415,0.6040293903856478,-0.0433494075261224,-0.6765721256393467,0.28365216069619364,-0.9792170082099423,-0.12608116568348546,0.06371078686874693,-0.5392204060972259,0.03443421430878887,0.1538068386959362,0.8617889475083954,0.43155137345190425,0.40583518015229314,-0.17837830900817517,-0.12095349858932061,0.19732890875311715,-0.15619683590431518,0.7238791489174132,-0.28718869218015763,0.27014989122910993,0.19199733623427645,-0.9212307030609965,-0.1343027762255913,0.4498560945055313,-0.7590593433486851,0.8284452120237404,-0.10861398976236392,-0.07429052771239315,-0.37952818923573667,0.10063589805044723,0.3819278666051068,0.6597342312606108,-0.7641659727146788,0.19196309233561387,-0.010064562681596226,-0.5083703999937866,0.15583975205122091,-0.020931055051478215,-0.5804051287737364,0.21567655764532304,0.6341617390366402,0.764394150909217,-0.1082147167283622,0.2665638010045937,0.1721985278311933,0.2957177675466784,0.9385863788679291,0.6786118361704134,0.22608458501182543,0.7421718996676923,-0.1894760908117367,-0.517446649822214,0.9817596954855882,-0.3043903560733531,0.5654578814739187,0.061250282161994615,-0.424463992214169,0.4468739270714683,-0.553628329286193,0.6166323640283342,0.022866026436216668,0.9371167648151159,-0.23141324103255226,-0.3996499268312459,-0.4843322230724122,0.8924205242781316,-0.7537979739023855,-0.14092679589335808,0.9620879029801273,0.8421919072174554,-0.08658784792864228,-0.5378734103073022,-0.6758394127410382,0.8326456083859659,0.3140144485355983,-0.23328174818880948,-0.24863066954844976,-0.6271096635102881,0.6667085118280638,0.3301423905591369,0.8265450284303729,-0.7781683258581124,-0.02940569095212349,0.9711534172765389,0.4314986732377861,0.7762546801209211,0.5212629245038451,0.3914053107740439,0.6122080077423899,-0.8562827451310414,0.13320678347850273,0.059769916001897086,0.32097940671424097,-0.8345119536675139,-0.007831510128307977,0.36936187237001633,-0.8786813205194278,0.1395840798907872,-0.48776223769102206,0.5668509750016784,-0.3792860746074248,0.5652147979721474];
  this.h1[3].weights = [0.8873232211730171,-0.1784807762826306,-0.6194756850562015,0.021475519217668104,0.4103684486330761,0.5094048893569063,-0.5263501917272948,0.19888219691400533,0.787015046696078,0.7397566556942795,-0.9467464331608277,0.32123335154965604,-0.3566469909574467,0.7966866120561406,0.48778008209534657,-0.4295541282806799,0.14053026250523104,0.6673355223443117,0.8999489625683696,-0.41366725369601415,-0.16732092328212772,0.9725165758445455,0.46789341291346576,-0.968692229251997,-0.36278238325198503,-0.24175853198346062,-0.7582168296775474,0.512167268696839,0.16783017908470246,0.20307541148863245,0.20094462427029702,0.06570001489965986,-0.17863202073529916,0.11878089480277358,-0.7875865339731555,-0.8310727587615754,0.7176939240608285,-0.6387828894643084,-0.8025838977031841,0.5532402744006782,0.9618967469320483,0.876284005485862,-0.8075938978094517,-0.38407449840623886,0.3884596196773665,-0.7813083152402707,0.5783294914767672,0.5391262757799159,-0.6924819859094864,-0.16677327802404784,0.40494614578858806,0.5177388230804661,0.10111797878505135,0.5570437520528199,0.5221741532056705,-0.31547202263411345,-0.16733123667456473,0.34414948680075375,-0.5008394778781962,0.9468432467949124,0.9530580632125525,-0.6701030331097595,-0.5066132723550809,0.6961576454591603,-0.08188976364128452,-0.4198689114531468,0.48290781521273307,0.4050073921713921,0.848928768370028,-0.7258662566878117,-0.19996095802301356,-0.3779376866132659,-0.2933493936331237,-0.18330132108934458,0.007409825041707393,-0.3053087625776021,0.5673287646572263,0.8176116667576737,-0.643871848357577,-0.831130787136326,-0.6252661199352006,-0.2634339364870178,-0.1821459725618734,0.6669535192302353,0.1643085395165574,0.9143529082834893,0.6541633671142106,-0.6562891078622209,0.1715668756614493,0.5389352924026583,0.8165664406964541,0.03252468562142198,-0.4492521876489858,-0.25962690317259807,-0.3827704237050171,0.7537598974316588,-0.7592220721482625,-0.6438276212932162,-0.36734244969375673,-0.01873810760151675,-0.8238609284904922,-0.9195288336570194,0.26896084817826493,0.4955345177773929,-0.7282562882195829,-0.5621932433570442,0.3898348249495733,0.37374551391615035,-0.47361195577655557,0.1285432649205315,0.700487695021122,-0.9588213493674222,-0.42215662709160306,0.9839625979834299,-0.8987070856569053,0.502905157640505,-0.5204612331123627,0.49168641384109213,0.8490049539614994,0.24545294773342283,-0.4089643929231656,-0.36840084511815707,-0.642756478341171,0.11501480572923882,0.9363954522660848,0.602630913130914,-0.25035443640171,0.5384660364361478,-0.6054122896127236,0.6461666821544149,-0.11944897354296156,0.8001699000310382,0.7626451590090756,-0.30262362225841316,0.04436593800680739,-0.8634968221079165,-0.4767045294227338,-0.5032448510030868,-0.4126502252553448,0.892498435253102,-0.9574588773309204,0.5693750725128771,0.887161516752875,-0.6304124629710335,-0.9430215775358628,0.20642853844661022,0.6565582843584449,0.4246663036535452,-0.426204642357531,0.4068824478685735,-0.838170167086586,-0.7816780531714068,0.3074077116917781,0.9117899189330742,-0.3610327324503894,0.9829223115650205,0.5665187453920212,0.6731845902833113,0.27914076749773875,-0.012618385389990956,-0.5384151315102332,-0.4045048157350263,0.7824748409374813,0.7651577002351975,0.15812002285990767,-0.5912800070852479,-0.6196637410556246,0.02165184077815487,0.4934937347698744,0.252062459772922,-0.6237176127136667,-0.626110781158914,0.5474297788359779,0.15178621666239753,-0.04169890624127111,0.4665918714831399,-0.33072649674936966,-0.2934546692613209,0.8164725619572467,0.3500845013839768,0.7231166309780379,0.8682322522021952,0.298559782950438,-0.516419471774002,-0.19207203316311589,-0.7526020958029165,0.4251945041419873,0.08059320743580996,-0.23408437367451118,0.42336779435765287,0.07174434185122451,0.1945048511661999,0.95253976914651,0.19794509948295216,0.5756996290320179,-0.1784446453633967,-0.5484330976454495,0.1356601885390819,0.6932994419767714,0.7381528951751779,0.7481695782229169,-0.5974208742095573,0.21872333454858287,0.4899728846241082,0.6556548542241484,0.943608036160656,0.04471146477840267,-0.24892142928646285,-0.3521153108859088,-0.21571414559550095,0.42941856639247633,0.16642264066991067,0.5713413400787163,-0.6453720156313751,-0.8436764663165944,-0.8272769977128877,-0.7569332178405567,-0.8770685292877192,0.8422156089900762,-0.2672033435727225,0.417980740072908,0.4022348742672436,-0.8876037254953625,0.23679966028166718,0.4090072294713098,-0.194112680340575,-0.05219343964335442,-0.533388372142692,-0.7498424766103928,0.14416181548188264,0.9278682840440501,0.22814223321055413,-0.3704566818797586,-0.9170710444114527,-0.8036725441462603,-0.996157835873597,0.9732659599767449,-0.059798870753130784,0.8930108780616638,-0.013963340334529818,-0.7726128222427195,-0.3258929031162223,0.8553738994930705,-0.8152408791050297,0.7481758096656891,0.7190188692494484,-0.24047323705026133,-0.9684768676828072,0.6468216571097104,0.6143880230395407,-0.4284097993116203,0.309662097067542,0.3287933048492853,-0.25106021797144135,0.40626882739980336,-0.9508650884772964,0.27055511674163824,0.49008684555506865,-0.49007430223973153,0.012602394144445042,-0.5340477678497775,0.42482261217196526,-0.4846684015858218,0.5325858514578687,0.8203671199608068,0.46037016377324524,0.678864000852773,-0.4175710566474327,-0.27960810901947064,0.6290466519182517,0.3580582480747117,-0.37341908950649966,-0.09583945697205636,0.8261892103642717,-0.8329012678196939,0.5699613719261936,-0.9213673438743257,0.35627527196001224,-0.39315543131246844,0.5025294737928022,0.4273193491159899,0.1886885183206089,0.7695780710713256,0.7074670414667129,0.0775658933583594,0.5286722686374601,-0.8039910836780939,0.417940202334384,-0.10664526588209225,0.001662226333464607,0.948498472464729,-0.4006925636453387,0.5928742274606227,0.9714594324346574,-0.4625201349751127,0.7497602209599039,-0.8972288725394435,-0.3273239140561338,-0.6956833397151501,0.3900239664401757,-0.07405365964468424,-0.46255354528679166,0.5220590994933904,0.9776414049234622,-0.5104371950366913,0.22708236718899422,0.04870461695333257,-0.8861076905687918,0.022662780438325335,-0.48621343677245854,-0.7701457061687432,-0.3427582715240569,0.35898470528203064,0.006607483093493877,-0.23931783892087524,-0.025008904666653193,-0.7079901203734253,-0.28376732464433335,-0.768485676783996,-0.7612103773854576,-0.4886471380512511,-0.8561852347613451,0.3643678257822564,0.6274623701369373,0.1972897953543812,0.2697329426781203,-0.22213656378472738,0.018952411760871785,0.30658825560440556,-0.8909669446357414,0.5676650656854009,-0.6512153674138899,0.13624481734418703,0.31906116535313817,0.8481469772843399,0.91517801276199,-0.20185395038589712,-0.5279809444883405,-0.41461906749447014,0.26382873524488015,-0.9059817608782076,-0.7593743973697712,0.5167740805011577,0.4805906492083675,-0.6117244909059439,0.7579567927787865,-0.5742102329615794,0.6179117526961736,0.1000136581335801,0.5894056909278824,0.6662062503448561,0.2297169718004083,0.10026081150422568,-0.6761854820109864,0.5638923738749771,-0.07593212824067007,-0.296244552080399,0.7746648936572605,-0.43133395643071887,0.9315771218055509,0.8789519566436099,0.4288064241667577,0.7998659134560939,-0.48120685692219356,-0.8626369339573791,0.3201720911094288,0.15401659218460662,0.6986532940115749,0.8437325737590062,0.4809583901562444,-0.19319665426315838,-0.6986358804914029,0.3504376364909333,-0.03467158499957374,-0.84193744415563,-0.06880602900778518,0.23206751244688037,-0.9048754301799075,0.13968292183080924,-0.2154146383153592,0.8715429704683522,-0.9020726668064861,0.5361503852148732,-0.09519342138101075,0.03555176817387329,0.1068120583320118,0.6789805589073787,-0.1668171418086759,0.5753966476029153,-0.3220357990178,0.9250284219379585,0.24703341652015576,0.2942022279555033,-0.671815335967556,0.2928176663026905,-0.7022781981381749,0.8085385677151444,-0.5317236979548188,-0.824069892938932,0.4114020966395519,0.059173695719296836,-0.23410687671987312,-0.27007433450431106,0.31212772976595876,0.7381648637220345,0.12639411354090244,-0.39684356252941155,0.07123037573211204,-0.41421985712821424,-0.45046024635055837,0.6209644822166795,0.6261071039884893,-0.6186597030248792,-0.903211531035911,0.46624106552557376,0.15353282057256978,0.23903179722653087,-0.971949498273443,-0.04559473905745685,0.3379802416158963,-0.01566387288725217,0.9890434494951925,0.8492682887274339,0.39264626141148073,-0.11449664769635733,0.07484260041883416,-0.445749874523069,0.7802460411932421,-0.6401982924896478,-0.4642584782793714,-0.44256766030901284,-0.9272364108917991,-0.49427402555130806,0.12034132586984024,-0.6464703026927974,0.059791770656192976,0.17796735911003236,-1.00105487974576,0.34617657543667313,0.8089224025079116,0.542246474040105,-0.21227281713916168,-0.8645497104941429,-0.5894443382876822,-0.1720313316853379,-0.18713040139202786,-0.8545851526649786,0.6825112530944231,0.7496161759489995,0.23041629042724915,0.9206657214060433,-0.9461139742548257,-0.9521814252565013,-0.09900057427398509,0.34122837178062043,0.29412779301655007,0.12073546999143807,-0.012071672168713828,0.07676892752749477,-0.6790866768991726,-0.42944871600795326,-0.5014380642146781,0.5334129391314588,-0.7118832540750621,0.2684044640881451,0.49012982155929413,0.011923529034707466,-0.15741563466588998,-0.76281013974449,-0.07202241615316217,-0.691650656518879,-0.8695680719812889,0.9371097815648526,-0.2443984798959547,0.13414830628700225,-0.9693082293633026,0.01706739204516802,0.18887607809572346,0.16246070911389743,-0.7788914737409384,0.4174178210841197,-0.5971181352929035,0.11804639250598332,-0.8275415313695349,-0.5364125070375979,-0.729871973122139,-0.16047107985089043,-0.803248390918266,0.9936968285473727,-0.04851539647855042,-0.37760550448655095,0.20446083554020897,-0.5312663775808452,0.06796761822764437,0.6223597624043333,0.6791602989636767,0.3995950925229168,0.9267997965174766,0.5386875116928037,-0.9478010940541808,0.5560095950312761,-0.8796650513762556,-0.7119238749006109,0.28391196908900523,0.276757934541264,-0.26258016058954087,-0.8930469526148231,-0.9257009536631061,0.14017934636680932,0.7487142965043101,-0.2529230171088904,-0.567180669730574,-0.4113697200575534,-0.5931209821742522,-0.25989347541232105,0.640801619076098,0.456069240378372,0.7267849393407525,0.23524920231613208,0.16512649190809003,-0.01755794929033448,-0.6295969859637207,-0.5447431816681634,0.26459612909257874,-0.7400918290522518,-0.31834737655135226,0.00732839433749371,0.7585299169956462,-0.1569474272221326,-0.8338841141744929,0.03883988492609426,-0.05876751831963198,-0.5745819598709282,-0.8099606487501186,0.9264705524551201,0.3471028182101729,-0.42700937477627543,0.37939812191624206,-0.07967663823483706,-0.22691130253687147,-0.08198501078916147,-0.13045435950865816,0.07446826969157579,0.42613115692136905,0.3102385333640703,-0.6814974378585086,0.5075142248487312,0.5476609080062804,0.018260302241558033,-0.12318355049015989,0.38000440610970154,0.2870827037798169,0.884472910806761,-0.7052761721625569,0.31042246575578175,0.8108027737194994,-0.5091272195708536,0.23955816873186214,-0.691463103655876,-0.8683934649721324,-0.7992520608257605,0.19615520755003393,-0.9140845271209003,0.5934947427719075,0.08150040396578759,-0.04900137105785743,-0.9330627784678546,-0.18382000299524934,0.0867709334409389,-0.16462950011098545,-0.7638363106727154,-0.31254276351403565,0.650752574136055,0.19387258931341564,0.8099511292330951,0.3068831281319717,-0.1599295981865246,0.21393321553157063,0.3516202993403382,-0.4340430743430491,-0.1489071671345907,-0.9063650458661712,-0.08916929590587896,-0.9333012125188087,-0.9706292992867277,-0.3824771781380761,0.465743305138543,0.7697432919005246,-0.4017792694039293,0.7225926080239592,0.590591273468106,0.07353409175492652,-0.013801019943247039,0.6620427660573752,0.06669899087575877,-0.43064958821178745,0.2985022338505054,-0.3007404684333416,-0.448483395307852,-0.25713371558542897,-0.30728030848776716,0.7433624179789478,-0.23678156225441493,0.41252296548385536,-0.829636129343961,0.610728074550207,0.6819127891451939,0.6725883977487498,-0.6992972378902453,0.07329003344735285,-0.13653833825075792,-0.11380795338421269,-0.68573820804909,0.5529361847792729,-0.4118898876669198,-0.5706244162786781,0.6102239941662847,0.9397161140917402,-0.629214518403516,0.7750299095886424,-0.10274315245917794,-0.16863117570422242,-0.9503954380857208,-0.7943721696372622,-0.28225630288912434,-0.5319626591394644,-0.6197107569946289,-0.2625536952624062,-0.35175223174822884,-0.2078672015661705,0.01869567924299461,0.4195991768268932,0.5657373986187618,-0.29865732240066956,-0.22425980534957723,-0.612931375910233,-0.2007998312859994,0.040217026717526166,0.706804260313611,-0.7171089200894728,-0.4469439273749194,0.2913976232069044,0.3717000011122979,-0.4784863966761988,0.9346506632676526,0.5636210945846718,-0.943262230964938,0.29099723192400917,0.7532612128060715,-0.5101001812352061,0.7102081674623205,0.09874162312823188,-0.3300373479990293,-0.4274385091858239,-0.5849189328694377,-0.318715089872133,0.06924312316778611,-0.28433331020848507,0.3382001141699105,-0.8038259438802019,0.22395077314148001,-0.6812154712784523,-0.34570397189152724,-0.17416301131851716,-0.41546649775854644,0.15910811136271202,0.08520317953196663,-0.5529386927738354,0.4745947994667995,0.4500263367462631,-0.089896594802723,-0.5058697920668964,-0.8396380015314836,-0.5471515766394955,0.33524037807928597,-0.5876964562567194,-0.4936866766227101,-0.26596138959497845,0.9187593724356133,-0.5590986632551664,-0.5590446759270051,-0.6206180267483088,0.30640398908601024,-0.9212291130924228,-0.6733859940415907,0.13056614886159001,0.9273373756721639,-0.45817020375340245,0.11929859181261136,-0.9221051935210943,0.09202121205460859,0.5521620368201836,0.9761774853947603,0.6120609114051877,0.13442528981198015,0.8176635636654742,-0.24991418757886522,0.2743132241987038,0.6964812313225629,-0.028551044951076035,-0.15743264912499047,-0.8270667387148715,-0.8441848171718153,0.7152278065942603,0.41735799283453534,-0.07101069940107897,-0.8507222548107436,0.4656544309615981,0.5646639377877145,0.5536638844257208,-0.28158854554239016,0.05591337680915668,0.08634836768225525,0.8768040976038661,0.6453883135322045,0.8510673899164911,-0.8469525751289178,0.6394664579690186,-0.3922209792042797,0.31743910932407143,-0.9807876555960795,0.013102529322769271,-0.5388852829782752,0.34496950643403707,-0.68041271262361,0.824595945493925,-0.08215427544147741,-0.2893743543913167,-0.902796980156174,0.14795435182020714,0.20866270557214311,0.6719689511369096,-0.01671326907433224,-0.3832968452257916,0.5054554485998595,0.4057005359861819,0.6674949332856334,-0.06207449634558445,-0.8141932506678906,0.22439342018787617,-0.3732261449804559,-0.08439348056211297,-0.9830355658226475,0.04532693745806915,-0.7570865252420609,0.8251819747183224,-0.8552485660787763,-0.3651286280885577,0.08539062449314182,-0.5355346336666444,0.9893759684734054,0.45942422642318403,-0.6751477403804584,0.5813033587369473,-0.21073477783553182,0.7071086041901173,0.7892631955017765,0.2127311700083898,0.9862752230081205,0.12414090806949495,-0.8009692044090366,-0.15743871328940803,-0.6104774926572291,-0.29073002248044655,-0.6157900582246478,0.0619004768256622,-0.6729194553577356,-0.24751014060590126];
  this.h1[4].weights = [-0.08347516527373244,-0.42382256003052676,0.6721169749196556,-0.21041083816525452,0.6992510357812787,-0.5304011101406965,-0.6286190058316876,0.48888556380364934,0.3368978584656561,-0.021965844084413988,0.8340104650723413,0.5316860426659351,0.5600873578389327,0.5964789000725217,-0.5999247627437913,0.01832096081414316,-0.48984631117571187,-0.4109397728050079,-0.3005066481100307,0.11452656961678084,-0.9377647992606631,-0.3259580808858456,-0.9738742930585923,0.8962496025774872,-0.5105423933109188,0.9008490262367966,0.07383977117981091,-0.7014825780293045,-0.7806668635010631,-0.09879625892426223,0.6969138960876412,0.2307553494478868,0.3309824500274902,0.176803102631141,-0.1452964657833746,-0.8435593302990562,0.43302341318227144,-0.6198482288952101,0.7290734109701731,-0.4675116151916232,-0.2605685238873467,-0.060129817033285356,-0.2276999812499236,0.11771538898542677,-0.4295922504009249,0.07662764871912066,-0.6112180202084523,-0.4154133736753599,0.2653429085991836,-0.7088924199525676,-0.9484499144190902,-0.49987763661581197,-0.46353826805030385,-0.0014728624515160586,-0.22793024793532554,-0.0010644146195034354,-0.01478086134427814,-0.17128143766729576,0.6725472827632695,0.5306392907471942,-0.4580113136832571,-0.7277944941161487,-0.2146260709875758,0.15563078758381454,-0.031943358513399744,-0.3117967645271858,0.14041437609329305,0.5324983066414383,-0.38038857743882465,0.43012427380793244,-0.7626089137785559,0.800969537985122,0.9669636830345689,-0.22916263831242628,-0.4369113300330298,0.1625493119098392,0.9176257861178,-0.5350578804847509,0.041293116535864004,0.9374743803003718,0.830700318799607,-0.7833911066995642,0.262237852495199,-0.2964589811872755,0.9144537279953308,-0.9673692995046977,0.3686942599121928,0.11406812877398834,0.9338366140327977,-0.6765365135576329,-0.34631985009829014,0.4368252206296985,-1.0075673584586498,0.636833286203945,-0.47338592056787554,-0.6922311144360812,-0.03686047875459703,0.2872595643807465,0.5515064327594121,0.46006392976346944,-0.9317884571544074,-0.9233347566558608,-0.9582269137363694,0.005038600041190024,-0.28725717367627074,-0.14729505957924502,-0.48337055737782486,0.8776557022085653,0.5433619725165459,-0.13518797310576527,0.5809295571814249,0.6977201755107069,-0.36452085635638654,0.7517249218663538,0.6916814093789384,0.24581979029237755,-0.726846324456567,0.22109992261706604,-0.39417719475562524,-0.6512919173185887,0.19339177581353048,0.7821988373991029,0.7041142924903713,0.21432114685101925,-0.4695038364562367,-0.813014646525622,0.6907663189892217,-0.15849262695135533,0.29756822030178015,0.6384957436755704,0.2168744531184013,-0.6814016065575759,-0.5103335728001547,-0.7155090953004449,-0.799737092023084,-0.8563597302145523,-0.4241543815751295,-0.4771911844099418,-0.12804365874826906,-0.8901002109358118,-0.3448360326837326,-0.6073114040039086,-0.7255112107667291,-0.44511299762100687,-0.4559835076652944,-0.46588348021845366,0.22427484800843583,-0.20317014052356203,-0.48788739219471305,-0.9640961064900045,-0.2573042900404882,-0.26149796326072655,-0.4744686011824486,-0.09529306862595917,-0.9851462256818665,-0.8202146200713752,0.32966153219894145,0.21991187711597424,0.04770407130122921,0.34199822712161837,0.42820843477661275,-0.7294843695351908,-0.8384286251012432,0.16513410985474047,-0.9198069441257002,-0.6546057439727634,-0.8072601140402678,0.18519278281468976,0.14556180141252956,0.251886303397646,-0.47999981509337286,-0.18891889765619693,-0.9686017940203739,0.36312005885241294,-0.22912319056145333,0.8453495962235742,0.948409861751246,-0.9829064122429739,0.9111632810857544,-0.29101420272807565,0.11077319303268886,0.6123809074857355,0.82626810435987,-0.9352598926500961,0.09841130530309955,-0.6238464818623729,-0.47997062709519245,-0.7050686338397075,-0.8096891580307987,-0.06792611624953167,-0.8786095325816062,-0.2787321506800994,-0.29665926882904614,-0.31894150246726466,0.4849764302391762,-0.5060606298737279,-0.6257130158572451,0.5659344875830162,-0.3724419607514981,0.9639591263327077,0.27740383064693325,0.311935677285979,-0.18213268346139158,0.7826187665494383,0.6398437415268767,-0.09657950210163323,0.21777256785992635,-0.2517245506312626,-0.45238256894027706,0.377100424521174,-0.001573591883038644,-0.2573287050145842,0.041682219787879116,0.15949122915981173,0.7239504678165224,0.1892022925048891,0.49039359453898695,-0.6405928098719037,0.126750617198239,-0.9072138175979616,0.3313262781757272,0.17511751312450285,-0.9080400317200438,0.7551889005890416,0.9030629875896201,-0.0924834360123915,-0.9084035054803798,0.8839093153159705,0.36342430746131327,-0.7309328853234878,-0.6576763949115821,0.7160903968901164,-0.6801341767116273,0.2579781628940758,-0.38172744658300656,0.6621414534804593,-0.4467443779420226,0.32745586309866176,-0.8822891085579555,0.5334207792674285,0.14282572940066077,0.2921533890608829,0.7243132023454757,-0.8573434460128573,0.4794553957097484,0.9698427159479459,-0.5997699317965791,-0.21867196268995898,0.03499511217470816,0.7331211649512721,-0.3545367055249745,-0.3153082294230562,0.9417744572548225,-0.9252280233516172,-0.2622078500679803,-0.24992704911962746,0.6187498657526073,0.399493738408575,0.8972262852364743,0.32439995306148545,-0.23870431081567203,0.41513742400057446,-0.3024488623670001,0.015735188214236057,-0.527077467525167,0.6122382614017635,-0.46304682903121547,0.9305305640103614,-0.5745710184170224,-0.434669756398365,0.21359211870556213,-0.572414417069195,-0.8558229730740619,-0.19261767023801588,-0.9900566591755292,0.9517113565878866,0.11583383478399734,0.946796006225396,0.2320720117386094,-0.7294629843678402,0.6052369497486103,0.5833462476925326,0.8552700251652458,-0.15596357391593918,-0.43358035420148777,0.5341694283701847,-0.3156084355145748,0.798488512612076,-0.22021980104147373,0.401756720999205,0.5764270917455963,-0.2139840248869539,0.8583274096903847,0.3336134238369841,-0.7143386383837323,-0.3179283546800575,0.164943175554882,-0.7682108676867228,-0.9771609351820583,0.7603383290302483,-0.9571648709626216,0.025799168493278325,0.7749034375451019,-0.44662008220589616,0.1343315862558534,0.4667887894644872,0.1353113027888032,0.8412489739166611,-0.1643605436436851,0.1639819384425147,-0.36023471709195004,0.04084457439572984,-0.24885550609295432,0.2754513359459869,-0.5453131802760858,-0.4662752808150803,-0.567065029245817,0.6059116173210941,0.4938738605880579,0.5221304578609407,0.10816253115884993,0.8962080979011104,0.3999057928398285,-0.2045500537913193,-0.7626233197548997,0.6383154661768261,0.2336446915377613,0.6210112588490085,0.015031855066634875,0.7079437332942493,-0.7351388711394324,0.6823498580493612,0.06621643731414106,-0.22330129160523035,-0.7212258862651048,0.10782206094681081,0.1703106983265397,-0.7764182907585404,-0.66834818841023,0.5510288592221129,0.4267239040138019,-0.9525504781997698,0.22399600491987784,0.3088003240741787,-0.9193129790284962,-0.5086242723482536,0.6537044399070215,-0.813233159060066,0.5463868166799564,0.8369826242931145,0.15593257951593642,-0.9950239653634917,0.622037877542218,0.8763151699319279,0.31649323691700837,-0.9237108863936441,-0.7929210354956499,0.7394476636261079,0.22760633165020133,-0.6219892883045387,-0.6041360945224064,0.28211929043039974,-0.6453305400889737,0.060885733820821734,0.06912984331451903,0.1602711703169267,0.8885401231892517,-0.5970000741195973,-0.38537840587906036,-0.3428184223650358,0.2829738126935211,0.021080893956601423,0.5665556807067935,-0.576581311223634,-0.8809495167967557,0.2874333032463108,-0.11632118302804187,-0.29968685049961885,-0.6793080991842019,0.9660055941605363,-0.4917936429819498,-0.38534357339381836,0.5219084747588008,-0.5285122197119019,-0.4921870003021458,0.9677753281530626,0.1015272644528804,0.5821837760525366,-0.02729028930564814,-0.31383326480437557,-0.7444002517626687,0.9862042752537756,0.5479765667400199,0.9289967850099902,0.565536652426464,0.17316210717042463,0.23325254256403,0.1129349617035962,0.41307583699730016,-0.8235029982878781,-0.35754561330352314,0.7656803637658282,0.3209492689825719,-0.9734231271140236,0.2518530329260346,0.9086168468503422,-0.9143466530595147,0.16040810588877766,-0.46059909685114575,0.7986260450828084,0.44457691554364964,0.27545922711159987,0.29103127568902404,-0.9649182037991938,0.7331683154154096,-0.2847783332837703,0.8661941549399471,0.48178082355005075,0.038856312438630185,-0.5115509723787953,-0.4927711131000198,0.15660430048374205,0.1356185650802064,0.08977212994911939,-0.719535317235255,-0.20647873531956773,-0.8654422809677735,-0.20955750625510045,0.8231422831515404,0.178086460844061,0.2532918191984746,0.9350525574249527,0.0776494547334912,-0.351432813717502,-0.3883271220420423,-0.44873161354058805,0.5093493191583158,-0.3444359410555642,-0.38578404762982854,-0.3829027095295462,0.7706193650076161,-0.1234095424044801,0.1426548965590535,0.6381176000986493,0.4683048651717501,-0.8555251433183972,-0.3506972840286524,-0.566068300128602,0.8031182110467953,-0.8157108837226008,0.05482101190611866,-0.7669415385823704,-0.7005943678452474,0.05048788238464401,-0.2768433173760041,0.40256828147759605,0.07680533756546702,-0.7168813706769345,0.3613598354451087,-0.7864245731248181,0.9523756549781351,-0.7401921593506319,0.447819424158736,-0.6529317824464878,0.6122274025628576,0.34675216950528054,-0.10449772245895088,0.5675612233690132,-0.803242825891571,0.056086216005607564,-0.9608480171550654,-0.8415920257327697,-0.11218500723317237,-0.7425951666845556,-0.1433649823562421,0.8366008477095834,-0.11306388437835774,0.0963216760024607,0.8952948625728762,0.7417682683740601,0.7488837477929509,0.8885696306174219,-0.5082949687348025,0.7969109488702633,0.9217956213712222,-0.805709360890939,0.9815704935317465,-0.7157366421887639,-0.6022167931826703,0.9840617932589533,-0.7237932909829309,0.2079935978601103,0.18381748974802722,0.16350210123880204,-0.8042480794102662,-0.634738399547931,0.3948425826039181,-0.33046700932039663,-0.6620319602589293,-0.11940508636725265,0.035834337320103674,0.033591771266391214,-0.08984898106413722,-0.9572300944183064,0.45509537338161277,-0.6126527915425202,0.5523846737454363,0.5771956661956388,-0.790630128437297,-0.9742618261088837,-0.8950147117908023,-0.33630186890795627,-0.7110353917569358,-0.8765140078816901,0.027785397703310042,0.262859788639744,0.09656095965827723,-0.6573702447324538,0.8565841070223531,-0.4592511376540246,0.19782726870411804,-0.27053443304285774,-0.33564090450022305,0.22423875620976258,-0.9916750552906235,-0.8319049889270337,-0.8146371678088847,0.1759783073594886,-0.25994748403588186,0.2964945896279615,-0.4212953332242998,-0.7069430757415903,-0.6117786063686851,-0.3010856258360454,0.3511408139656218,-0.5890533502856509,-0.3441490060774736,0.9115398907325181,0.38302435567030096,0.5846802686359032,-0.07190005663956914,0.19076783851401666,-0.840460514256468,-0.5433300946996502,-0.11789363938774793,0.747734086755442,0.9487838039296693,-0.7721307400249061,-0.8596736411584402,-0.05749117575703444,0.5508646917870533,-0.7139734088045014,0.6088009747473917,0.7823797673632389,0.29563664586318583,0.8993824963163672,0.7450912588606491,-0.05021249925963555,-0.3241876111833577,0.20888505413142208,-0.1280901888636657,-0.20431748628981014,0.8544779923150913,0.6196354096662843,-0.09018388059851305,0.2560923301212366,-0.24675301814337736,0.29828362821974114,0.0410989589081422,-0.6278132883887584,0.9475881167801176,0.3179647179476351,0.9495214129405949,0.9545226084377876,0.2975839745798039,0.7492867530334844,0.6964931386393239,-0.7487855784122582,-0.6573345049420741,-0.12293016779450376,-0.0299443941022807,0.5496472339324336,0.05389690539526961,0.3853473494920835,0.0888207651404178,0.52970346285743,-0.9916970189031896,0.7122351939065009,-0.7558907287576765,0.34440976092611947,-0.6661946142496026,-0.40568667609486714,0.7251762514754513,0.2518417847861706,-0.44872804453428194,-0.1781676786239723,0.2869455870266155,-0.7869984139170924,-0.11587756555252429,-0.23132911556410723,0.038524198640687235,-0.7112773437722762,0.1687960977202179,0.7663253735038884,0.9369134686997097,0.05392488009672621,-0.3473076151882787,0.21308268133316308,-0.3863019091035909,0.4349613568281252,-0.21026104267813764,-0.3227036550755277,0.6444852034464607,-0.6375402790945458,0.579733978647581,0.7342974255433492,0.10945815328461621,0.3753599115345794,0.2927002967988263,0.9516500411433384,0.4102672115126157,0.20498588500374154,-0.1851457450645862,0.6577871994935133,0.5944358114412515,0.4346183733840421,-0.03177861047927126,-0.7188485020721672,-0.02821135020864211,0.39597606658583445,-0.2300178147058011,0.34677169133222574,0.6636965548412775,-0.043520318222562006,-0.4559453854333619,0.4747629779108658,-0.5578913285514474,-0.7234341908017198,0.2887739218685464,0.00903316398597555,-0.08703646464219145,0.4379122858506201,-0.9938456352103957,-0.8260203283521742,-0.19714022042922558,-0.30833534508066546,-0.9474294118735127,0.5102594963882598,-0.9966324725775159,0.1325585100073918,0.5346499599238844,0.052282577361675825,-0.2763801516750031,-0.43393391752539173,-0.5160641453905201,-0.34974255319211595,0.9875816560115313,0.5603025002608,0.9390617404181437,-0.8487313312536696,0.9194640998030452,0.9808401379483263,0.7061528079954131,0.595447156980529,0.8034543222327052,0.29119386197693464,0.9821423911501114,-0.5719636348454002,0.7805654006460182,-0.22403751748427417,0.015571387675945032,0.5712602924305716,0.8599403723945709,-0.33040743628547925,0.12116633085775311,-0.5758244579807058,0.5966654426531268,0.9283926169110227,0.718768527157553,-0.2629282185283713,-0.5129945938958788,0.16245759072635832,0.42445682706841875,-0.34716888375283017,0.9256415196061021,-0.20134867704428608,0.7598882430111169,-0.5762985256443923,0.5910192853170917,-0.5041804503175348,0.7248347057540234,0.5559056734170441,-0.012904419416672818,-0.10459125077075457,-0.26366642722634887,0.6399159774708366,0.27500171493895453,-0.9109911866047891,0.39903260568225224,0.6461343673635016,-0.9130281455952174,-0.39536924321159156,0.6812839081662643,-0.23974072578000258,0.023180592228331267,0.1729551448774538,0.6725826248626128,0.13468628517513703,0.9693437364680411,-0.5985690003212202,0.8994314950638741,-0.59957461814142,0.6107320276132121,-0.4401967709115891,0.7859002659115909,-0.10659017368076351,0.12042218259931171,0.5699377038039396,0.12491470505669322,-0.4542983436393432,-0.7370907617694719,-0.7679525539997161,-0.822226756289374,0.5907100973226941,0.15107118980546003,-0.6756880815318851,0.7620902169385807,-0.11106120640119936,0.9801696028847477,-0.6878246627710716,0.8347561909644491,-0.9307818534662486,0.3785707125687892,0.6215458291535946,0.888837873548204,0.35645815704034234,0.7446957857983926,0.7103151179573918,-0.7918087491956805,-0.21331365132828178,0.8160699277224996,0.9507049484101331,-0.8899903043010778,-0.17215788249272393,-0.6265818685590047,-0.8946933043898191,0.5255395375882961,0.23866264028908193,-0.33808853741988565,0.06855816330608493,-0.5145013170492673,-0.7063097036071797,-0.4039770790068743,0.14454617928351227,-0.04686948487428967,-0.3326526993622944,0.047217503498800634,-0.1490017263967011,0.7820455955626221,0.8232246516059037,0.14242403639833928,-0.9191005256166285,0.8981642691127506,0.9439755671884782,0.44027916518296734,0.5811159465853665,0.5245448789752669,-0.5187825605136128];
  this.h1[5].weights = [0.1687511124846881,-0.7657042419339652,-0.6331094144160714,-0.256313938436032,0.12473225424899104,0.04268773429978667,0.5544201847762289,0.1315550388212241,-0.2614051169426578,-0.1398501406732259,0.31576089914303695,0.9949678685032209,0.03448509645581144,-0.23266400496009462,-0.3812114091499878,-0.6266490897364188,0.48090581513679964,-0.8540517240914806,-0.972365212883139,-0.9667447949536551,0.4354955366725935,0.24848573685316183,0.5032417554177244,0.7739740072610005,0.5634184188552441,0.6619863651703586,-0.49882007430610653,-0.20169697582936869,0.7230726434063383,-0.3041698593356011,0.39042105116898707,0.2785176204482314,0.553285730122681,0.48737680186929816,0.05483053217883931,-0.19088844258126952,-0.8520225381145762,-0.9051255747621042,0.9203500638600166,-0.793061898437561,0.13222167677629038,-0.44747731757099396,-0.9747462993183248,-0.7499266940200205,0.9425561526978693,0.4551825054131689,-0.5049866757475167,-0.1623567418556176,-0.3828989948300829,-0.949163355251113,0.5829670549929743,-0.0837268299517642,-0.09675558075442404,-0.17297283915749823,-0.47730168725545413,0.5840610793448188,-0.15351367116611003,-0.8063267165293935,0.38574618655541526,0.5130711570615869,0.019206034693054708,-0.16634365038625765,0.093788240807541,0.007527208198853774,0.37981375190207856,0.8056501432442853,-0.4915254760680752,0.9693166582773086,0.03620002753239109,0.8497655203241005,0.5278895485290083,-0.4627361082476359,0.06652293681652768,-0.24417778537418733,-0.8712289478842512,0.17153509465678737,-0.31305975106506095,0.8038947316923505,0.28664869604740395,0.2917160061951485,-0.9604162645757777,0.23819941630100033,0.06197358581536941,-0.739484162655113,0.8558209134707051,0.42336161438812325,-0.36289274395024024,0.6442184824162573,0.1216100097752423,-0.5675215459116979,-0.08584174661022788,0.9185213606302318,0.4563924787917267,0.32665450720647643,-0.827577298424353,-0.3143721272529245,0.9362747599519249,-0.980915601800212,0.5509163440775938,-0.30030285970136594,0.6844555575657655,-0.5298347788701485,0.709578456253671,0.021091376325435448,-0.4996682177756197,-0.5793198880777695,0.7463059781897443,-0.9629613455791577,0.11230841429348035,0.9024785610791715,0.28429983373130063,0.5506986753074008,0.5486536779394534,-0.22657626995425337,0.1062542148919652,-0.7047171196377495,0.27070090727889073,0.7331528931426676,0.9237972127025226,0.3910610023301872,-0.8298529320466915,0.23557872253158166,-0.976399729160203,0.21910450485078398,-0.07448645089360581,0.31604340703711625,0.5575752274576171,-0.6637311877269753,0.3064015060652313,0.06498167734769068,0.2549952126264,-0.2388183178304547,-0.6192518884768761,0.9470093735829189,-0.7744020640715902,-0.4973081836410332,-0.09558571494586049,-0.4455878236812289,0.7122758191157548,0.14186217028359208,-0.20305238248066224,-0.29538488388469136,0.005574616876956219,-0.017777119842702773,0.3164767122747534,0.9558929775190329,-0.6520466491844614,-0.4254694923515013,0.8291392725142985,-0.5421504618691891,0.24470426362697673,-0.3673826025434867,0.5582106702430324,-0.0025091244186232235,0.3800294105575,0.25147377600444587,0.7202100316009047,0.8032003908347494,-0.6998245445202655,-0.6767700958929271,0.5275455826889812,-0.5497117691867314,-0.011533472510623833,0.8926333559996473,0.4888238581554438,-0.2530497738303463,0.7169590336319397,0.11626749775387313,0.0012974836297039796,-0.05146281427829343,0.7932007795655088,0.1405231243875729,-0.2579636770962776,0.5141016772084636,0.33844898101964843,-0.5249070009863496,-0.01192509823704082,-0.28722451325955195,0.16454185962772017,-0.9858622767370955,-0.6452391985476731,0.3672794353075558,0.7805043013946816,-0.4881160772055088,0.44550515439005917,0.683845400792042,-0.13051544765602546,0.6097800299150699,-0.12182637689210739,-0.48420554577204383,0.30838076083533,-0.16984361530523512,0.505402556934851,-0.47390822069986355,-0.12151392211426283,0.17895144722589149,0.05153173761861248,-0.24539787469835772,-0.11573197737904674,-0.41593740183794425,-0.9467163417158007,-0.2523291589320623,-0.6501590866360155,-0.5490493027365825,0.39662755761796,-0.8743576583009762,0.5080625080008547,-0.2762952283912878,0.910516055394816,-0.67951760897399,-0.9303273221970807,-0.4454730425619238,-0.0224638103379556,-0.30445941054761755,0.5284407385724896,0.6536320152687534,0.5758438172390566,-0.6074548095240935,-0.11804329093619777,0.21257791673748802,-0.5094384317412967,0.017892098498863834,0.0561481206477628,0.5099770948047152,-0.5989897944219031,0.558407995918963,-0.8275516564614273,-0.09879139583016121,0.7292124900635514,-0.802557454326286,-0.0834097814035446,-0.6293288548469949,0.4439909102259159,-0.07150377107622946,-0.6009059680732226,-0.36198153439683095,0.25662376856181524,-0.5778637253163467,0.593689819532913,0.15868009768173827,0.6532053342132585,0.8778686718715655,0.8600302702339347,0.11831309039960224,0.32476950080905753,0.34234337825558553,-0.2906246843428474,0.1635547698618293,-0.4791131035807642,-0.5787129390589605,-0.8089568788077266,-0.38517039163366756,0.31946511757510127,0.3098520049002409,0.46399432990518436,0.883248487652288,0.7842424929663491,0.7382048157121743,-0.4624127861496841,-0.3541868199507836,-0.8887305566563125,0.726703096652669,-0.8653572542562316,-0.9630523579944417,0.21550198741298984,0.12004979216651278,-0.763189063246758,-0.6042484412703912,-0.15368281005895612,-0.8674468063796146,0.9446779673956228,-0.9287263938601243,0.5504317968817738,-0.06046318194431029,0.2895090559844938,-0.6040699983698731,-0.36338526164907287,0.11293393797118387,-0.06324315527655008,-0.6057572042980739,-0.26520913704839116,0.20242065040450416,0.06565082069454209,0.5533739692704641,-0.27226541250007624,0.0931578184356923,0.6717918271166046,-0.8079976324002045,0.040651725838870875,-0.9047986571181565,-0.24761584400974757,-0.4277778108292054,-0.7261648625980962,-0.3606415695120012,0.8912751028203887,0.7963977623783615,-0.9004913863200658,0.5385815044414004,-0.13166495180838175,0.6445374029068753,-0.04879247565628497,-0.2850335933388067,0.5607475952835752,-0.21254072469919308,-0.14550214558402297,0.14074398284730433,0.22321292460665748,-0.39888211964055387,-0.31976379608588784,0.1773940484145954,0.6257121364930264,-0.986448450635649,0.48989286977693614,-0.11941117590573384,0.5998949001383557,0.11509085592005555,-0.8765929218225612,-0.10855875543925692,0.1950323176804003,0.5513594437936915,-0.5069964588534696,0.9533668646964063,-0.8858965405911361,-0.44984569974916044,0.955916370430718,-0.5624444012594485,0.6889591966746597,0.05137015088739056,-0.33166006957774213,0.9564960980248801,-0.5570989565859378,-0.9980988649383509,0.3097567513133794,-0.8227855302414898,0.2169074681130782,-0.3912081255222257,-0.16684314586864693,0.8311324311039823,-0.3641218479874723,0.10206672351022508,0.7675050059360591,-0.5891181008508942,0.33257164187371513,0.42530606195302023,0.6567797702695145,0.6694804355804429,0.18708358323033494,0.1508778205240238,0.6151257513941222,0.5135228070496412,0.5531072797931278,0.9514862878857883,-0.30991829556742895,-0.7084644372290277,-0.6041931428160247,0.4033809628843471,0.7118424851851092,-0.6177884514980071,0.28054145381655027,-0.0036153515651731055,-0.486644886727881,-0.990685976544403,0.18361306819066622,0.6303019980002783,-0.6788120202418055,-0.755009161955119,-0.7214085468313218,0.4432902245989694,0.03726198511437725,-0.45769784575657735,0.061812910482480124,-0.8127279298632344,0.40928618600556305,-0.33941873519422683,0.8648426479816137,0.6830242264224881,0.3063539832740811,0.6366224333893146,-0.8089585938644432,0.6227346240798536,0.33784056367494397,0.9732349735277761,0.9688088917443988,0.9843994971129574,0.5550030551801624,0.6432685802847038,0.5811314277753148,-0.5509979414747743,0.3667498509592626,-0.6583109533332503,0.7792223458530376,0.38542734955336,0.03269558776214537,0.7123290975818938,0.5956927090687552,-0.7290660426755613,0.24854075839836204,-0.323027824988462,0.3728029036336383,0.7369722915791328,0.8143047354293399,-0.5538058569666569,-0.963152558312487,0.35375460081479704,0.1952353031972517,-0.21146443358515815,-0.3027652045611542,-0.46716671893564954,-0.8391362099756046,0.007462672016828377,-0.14016434315166984,0.9071344340423824,-0.663369528909491,-0.5098855934618027,0.38378537854046807,0.24193794847049593,-0.10755871045599759,0.5540395480548034,0.10963713510061292,0.538837809299394,-0.2872891075944539,-0.4733970490799279,-0.9244660420818754,0.3715721089268013,-0.9358934507460042,-0.5187248831139482,0.6328761568688518,0.6041122838114075,0.8928140800709103,0.6930907947096242,-0.04909277477434221,-0.20728040410097956,-0.8047092536514814,0.12835572037277257,-0.49723187114797485,0.7249244782624388,-0.07815922205791473,-0.46784600203041177,0.08530799958708457,0.12165646043968478,-0.6996986538915575,-0.9847474914614729,-0.6371035483280885,0.947280368537621,0.2540823144033899,-0.5444799926629957,-0.6730588198887784,0.7222165613450495,0.05605405673350856,-0.16888237232824616,-0.8991897485813031,-0.8351583243131293,0.2101326181868478,0.587770900852939,0.5087722900589151,-0.4175658114369634,-0.9286418596849372,-0.3538346155661915,-0.04291351956831076,-0.02926624268859925,-0.6924770716996903,0.6094003819506386,-0.4943724686082524,-0.5027011171898242,-0.45586024767619876,0.3087798662990701,0.3898174532826361,-0.1830588415806491,0.09353147213373601,0.4777766738448498,-0.8902256553411831,-0.928185693411734,-0.28465891946862276,0.7182124417812551,0.30907752096655916,0.8628411027328322,0.8545278051692303,0.18285986588337885,-0.4349576592142378,0.31865250678558454,0.5921254591552341,-0.4568563387873539,0.06358088940697408,-0.647032562317901,-0.6438255667590461,-0.383348600922191,-0.786209187424147,0.5277246278988503,-0.7429883570832209,-0.14192393544458076,-0.541245158170486,-0.4503240560528748,-0.7514275696409681,0.7289147769144279,-0.9564389898275181,-0.6890518756786409,0.599151072677793,0.49225906815105014,0.8700227902605527,0.20969701449921815,-0.2716331431187195,0.0038853445283237387,-0.7934816330689867,0.9284970002040317,0.548586127012931,-0.13933327574965695,0.7467705833240044,-0.7788371846125239,0.8690530862634411,0.29778203418233384,0.2512920779512578,0.8742887197707848,-0.2987215948980646,0.7782811305166079,0.8094905731653228,0.6555329973380419,0.31602808772191504,-0.5678997604496909,-0.21905582013536565,0.44053039863707266,-0.7101103599235901,0.0731511924503252,0.9108776149987158,0.832200171620962,-0.6983973431265893,0.03531266040034769,0.8617412736017308,-0.6906950402405803,0.4797154978962425,0.2651922518117881,-0.6294445987208153,0.09275340738158798,-0.5664209162799876,0.9597342162047453,0.45921752758682843,0.11407462781182894,-0.9084342260968833,-0.2041349298348889,-0.46901243452274016,0.11677602989871304,-0.6849144817807068,0.8190799911599139,-0.11905662037017754,-0.7276983115677319,0.7621323745986766,-0.6724251858324171,-0.8840738525579483,0.3362099430010262,-0.30533878356379673,-0.5316188406470304,0.5986615187099853,-0.14315102993990272,0.3613857693091532,0.9271300448251083,0.017937970662132777,0.6298556151745769,0.7594794603560213,0.44988643532825723,0.290602158544178,0.307187022327213,-0.18516549541097096,0.48946243811577583,0.46292309630310935,-0.3118751775816962,0.28410815057890315,0.06689520865658523,0.9979699461945951,-0.9702760929684312,-0.3708822441075544,-0.47734935127708356,0.23648834294939758,0.7144687859994974,0.8570612566869966,0.9221028962125264,0.871744821668255,0.6060429000220584,-0.4000456808121679,-0.5632395394441284,-0.4899388056701251,0.6734903767818071,0.2244254160111305,-0.6761108911358625,-0.07984673382924587,-0.9095092706292621,0.5589685390450753,-0.07074821679330308,-0.1747756305990455,-0.2402431970345013,0.45305827528424597,-0.9601286414814664,0.49541713139174065,0.3455631765112692,0.7477104106307065,-0.7742016579378102,-0.18473801701132753,0.6007826911789976,-0.6576983269561761,-0.500689638845598,0.7745934357665436,-0.9328619247236428,-0.05586479641262371,0.7056340071669709,0.6905608718286107,0.953949527409744,0.364187258701919,0.7981203286276275,-0.5786648792956312,0.8681506575583826,0.47416304436009715,-0.25420549350530125,-0.221917730905269,0.7265686091475324,-0.8646887344955481,-0.8384171068837715,-0.869234855578562,0.6831879522543327,-0.44081149805938397,-0.5554020422661633,-0.5583616465250912,-0.3110164488364443,0.6570932145297317,-0.7909133158415018,0.2594857573543362,-0.03774647958760603,-0.5188458374935145,0.2179661561910922,0.058459766555422524,0.6462050856954501,-0.4098152893676169,0.5501740787013445,-0.9144485624813572,0.49077505142068967,0.5329448425383626,0.9924322341108207,-0.38620315150054246,-0.49690505442779315,-0.9385788524596338,-0.7039598741144635,0.2453565507016716,-0.8164168146388381,-0.472583351385319,0.10439340167930741,-0.8487648959707617,-0.8119808680876519,-0.4036919991902998,0.7473737109662723,0.7617783715547856,-0.2857424682494601,-0.8917001879188652,0.6971113573334476,-0.740826812405961,0.5832959304779323,0.915454673344443,-0.39248683483889835,0.8881136153068213,-0.943915311739804,-0.4317507511928681,-0.154919921373763,0.8586838437675024,0.9576747300871116,0.5304319937941981,-0.4384307004278968,-0.43480668424497415,0.8213173652681057,-0.6270882936348402,-0.5980017303602692,-0.10030591695537461,0.04674090688655179,0.6129273399702626,-0.608540024217857,-0.39429981827535515,0.8481863920520119,-0.8870029300604797,-0.44059827283548786,-0.29255764339283563,-0.6016457971235674,-0.7224968287539705,-0.15942730270106167,-0.4453658084585588,0.7792625302617848,0.20544992718645816,0.36393116983203183,0.009665325070770375,-0.6733850742319731,-0.46458701330984026,-0.11644284898255988,-0.5128421540691885,-0.12040374283772898,0.24935548931562582,-0.5187197424854707,0.9998721409671713,0.8448983019652969,0.27454242960075387,-0.33259205099859773,-0.8510179640859777,0.5885784382788327,0.4622305538225481,0.4786875513987143,-0.5367267950853409,0.7237120054231442,-0.616587214335927,0.36475308039690135,0.9430559893243631,-0.2589367794349153,0.23934030122617725,-0.028338969765234277,-0.4752806550364583,-0.5155908081872228,0.10881739099259093,-0.5018503738868025,-0.2762785326446153,-0.6921354639457782,0.19803102404941392,0.5678904806898023,-0.08421155786415582,0.7770231927131643,-0.9878123491573412,0.3596120582928568,0.36129365545130077,0.5138779395491835,0.30539850652641876,0.8549143453878946,-0.8794604660389808,0.05308115489879265,-0.8805173913361892,0.6708664967253448,0.7770419776152614,0.44820173360608373,0.9309444811412779,0.22723369503852808,0.5938248391654649,0.06043848609188088,0.8649781219214234,-0.08266842937879605,-0.5586509531422778,0.7468906375046049,-0.8427810858745945,0.12053894184029754,0.6391885537539423,-0.9695077670243313,-0.9787301165128738,0.8537083097113216,-0.09565851057242146,0.8932586224413416,0.6071693495114386,-0.35832768672748144,0.2914609144348256,0.12007886963222905,-0.7492214306396149,-0.25559030670801464,-0.9680355177204651,-0.07874557495388138,0.4692001898032296,0.8254395550840166,-0.7576943496432466,-0.1226664800906594,-0.8152735404758842,-0.39739243571769606,0.08299155142958434,0.40935728239691,0.6685576485176711,0.8473085495861402,0.19052731124638195,0.35921160743426356,-0.2059046994080326,0.10391851526890107,0.057848081816844296,0.009385363316644376];
  this.h1[6].weights = [0.5191114314468472,-0.6794934229315692,0.2574132192202878,0.2806885634541927,-0.6903822079803041,0.3945537123833325,0.4494510112813934,-0.17411055910049322,-0.24196046774798916,0.08240917222581666,-0.5219312400728059,-0.3835598026031395,-0.1746294660540747,0.31588284717707804,0.7751478562743681,0.4175071151980344,0.7262136904833782,-0.5844901305230599,-0.865310313030417,0.03643543425448331,-0.9225982167293693,0.4256609065965549,0.7636288926905275,0.05645799901107346,0.9731510170072503,0.4080706572593973,0.9426714652812997,-0.05051676074218638,-0.09811687167842414,0.3919743117987738,0.15822140809876192,0.8868775370609039,-0.3525677297917087,-0.1752865914105302,-0.9750316933311864,-0.48594430572766434,-0.5052724871019182,0.5704520215021899,-0.528033532647263,-0.8944995425387148,-0.7699812065631124,-0.6670221854881033,0.24425678103652518,-0.737458269492635,-0.22268374992761533,0.745924626757474,-0.2466807413458577,0.743122030114778,0.716809222286029,0.05449801924412053,-0.5774561415724354,0.6367543556119276,-0.37083657222700395,-0.9927295239990245,-0.15402269453118264,-0.3234911214056625,-0.5193271359282781,-0.12047002725807099,0.7108317836480134,-0.41962388145680407,-0.5547538620564589,-0.7277797903654264,0.3705558081114404,0.5530901658264278,-0.8014667086838498,0.5166110216592191,0.33769699086779476,0.33872096444723643,0.545565740102204,0.8860199322026865,0.3660720331990658,0.26029059273783256,0.29376126928496477,0.28863231233888503,-0.23832452942536494,0.7876822163661683,-0.15449166270398096,0.986156520292277,-0.6171709649340147,0.958669021520276,0.2700292782834857,0.7591146729446046,0.6395544712786932,-0.013842872908674449,0.16133054790438064,-0.6369273053419879,-0.46314175716221323,0.5942686449534736,-0.8766152966239813,-0.7509447603760306,-0.7563088669031357,-0.2631913107889712,0.7370981245359837,-0.5004813971881396,0.6699495274399027,-0.2839826118854366,-0.03383141297448114,-0.09604448913430431,0.5287930730675515,0.6709796354671603,0.33842904525033357,-0.41956169054068715,0.6621769069619536,0.8608880740968939,0.5070518134076587,-0.9923761158843825,0.6364777336629035,-0.9495128747562657,0.8296025216194561,-0.7586116510652692,-0.5669875575256108,0.03890605144801769,0.4794256444843441,-0.43355312263675855,-0.4865182141116169,0.00042704298456494274,0.6056210631306201,0.8488620443398417,-0.4827002271337621,0.8442552358217821,-0.6443421981176434,-0.7313706123614383,0.5009752996233435,-0.2633974337663974,0.09503593149195354,-0.7263732918596795,-0.9242298030899687,0.873233996820946,0.20035024795839634,-0.6292701668688199,0.17135180088306692,-0.06911227101248715,0.80322247918736,0.17823103563641743,-0.03271526982705955,0.6911797456508241,0.8768627896385115,-0.441199538128544,0.20596551897432666,0.1708825503338434,0.3574340236835489,-0.951003944740946,-0.2815100570652469,-0.14724159793587652,0.9263012934418984,-0.7513643957539173,-0.09127484388106516,0.6164558015519069,0.21424410656306178,-0.5663499074690597,0.7475009677914572,0.7598447933321731,-0.6882799076551733,-0.37042927496912403,-0.3543189260870003,0.737790234474873,-0.058574945639693676,0.4180832634324254,0.7373874221487515,0.11381780757665944,-0.596066623072729,-0.9566306384400802,0.7312820343199763,-0.8987832047789169,-0.03149596349116606,0.3413013713338136,-0.7399303933748844,-0.147666106350813,-0.43407573897985435,0.8169044342829952,-0.9822309320073982,-0.025385463041458382,0.6886785713196694,0.7252728745168854,-0.9757726438455422,0.2403516361439377,0.9093551826113626,-0.12077307385152519,0.5026602506348761,-0.8413057875072066,0.6730520378629867,0.1439270589771328,0.6593593757753605,0.544868929846711,-0.4949271580913242,-0.3435826085911531,0.15879770537271243,0.07494916286002462,0.118855480681626,0.36373871231148436,-0.6173517565061447,-0.4595888471698845,-0.09658080182421963,0.7491883659247429,0.5589871908804708,-0.08573593935922208,-0.030157959186415558,0.07965939054464341,-0.6099887479455847,0.9762575767375159,0.46809360797455135,-0.16102310485996063,-0.8563138236097172,-0.008649342060630108,-0.6578491833297283,-0.23812349323877088,-0.15286742803176706,-0.414968199091761,0.6057092523848764,-0.4171757320525686,0.37825819843563885,0.15472763150870414,-0.20444030022910065,0.2527835109408527,0.6593840389343018,0.6699740994171528,0.8517291924339082,-0.35610715465928994,-0.022542707013892938,0.3780130951932325,0.9236238472914083,0.9116324394054746,-0.2069238725110138,-0.6910992978132756,0.298120245681147,0.9846509420649749,-0.49579965834019857,-0.17382178257813302,-0.9755500477188177,-0.33700742403660067,0.8073246221241016,0.41064541259682324,-0.2612817262242368,-0.5540277697608256,0.943617185138264,0.42168959347934454,0.9730796465426215,0.1545032150141843,-0.5971620650429785,-0.9915786292571194,-0.9366275286075056,-0.8262853717176201,0.6123694052324895,0.7974862029577823,-0.9412715395933564,0.7405505663716968,-0.8612004258144471,0.5951925260255425,0.26882214019762135,-0.9572593069983485,0.5028444592235856,-0.5777503942269484,0.9486979128770107,0.7925007664097335,0.8717798726929933,-0.04831135798256677,-0.24885794329112865,0.11016003737553337,0.43088073098179425,-0.9602360431374967,-0.6640574640242073,-0.13394908468515723,-0.857916537088856,-0.2257759249549545,0.8979192282018615,-0.4440996403783247,-0.9299538236214681,-0.6525408088010216,0.45687954502549977,-0.02735527738096953,0.5150731665455424,0.05441154073388791,-0.147471539188635,0.20459196446967864,0.5631675252462867,-0.5751868963532781,-0.3331409669456561,-0.2095490099127915,0.05858491771706842,0.8621588733313424,0.8192885116486232,0.7862973714097607,-0.7182716468178058,-0.8800049444182059,0.37878488401483407,-0.22502169443750294,-0.6772385704691624,-0.12058741319447189,0.28762882535653306,-0.5773448014704591,0.5037679369971312,0.09926047275199938,0.7571091885006904,0.4936622137882212,-0.8212103147883262,0.7426505793140874,-0.16653020041330072,-0.09788724629472755,-0.02253601710791669,-0.7724564154976857,-0.674708269651268,-0.5022691368114572,0.35030442593595074,0.5307083241919152,0.634370355335489,-0.34784810984283404,0.5636229101266652,0.23630697685342547,0.2052076447743937,0.14424206201331208,0.6042251730278495,0.7343204441706694,-0.7865143089445216,-0.43217243423984697,-0.10061126703325651,-0.15803484272327462,-0.8659672127319643,-0.4248488380259544,0.6116224207130786,0.6642810610093386,0.5390016104745581,-0.1411654484041944,0.019352738416064778,-0.4595769049819559,0.9618144746001744,-0.16808700014600833,0.41814200176886157,-0.02122539856187557,-0.2973660448243952,0.5492429334467995,-0.9157419086752945,-0.748601585188995,0.7278847238738956,0.06998016916282088,-0.12979204368049832,-0.752264996126794,0.7281017652386087,0.4988398730144509,-0.855985663848675,-0.8395422813013782,-0.8876424350518913,0.20702343563097378,-0.1447551036894387,0.3362204902095345,0.1845936222574903,-0.4204932659688436,0.7988654740287988,-0.2895288814192803,0.4738646215322806,-0.2113044088323622,0.019267391461593262,0.7462548565896181,-0.7930510744931654,-0.9608048824312354,-0.7242232697766267,0.1026117346403978,-0.3158400311801426,-0.32936636164636285,-0.5868269389585905,-0.4585008901361052,0.2807178947005575,-0.44507748281726517,0.3025674212452246,-0.2095094343070172,-0.7846702614290011,-0.05768891701835047,0.6745673174529894,0.8778407490891891,0.28069298989030567,-0.6154407064055155,0.6734519948134303,-0.530281971739938,0.8575073385922656,-0.8167232336657714,0.47358137686515067,-0.42707450235853395,0.2709127871292198,0.078327231974933,-0.5251341758591054,0.695938866638129,0.6140757247886086,0.8563010392518362,0.31927958587471267,-0.2866377103899125,-0.9747438023011532,-0.5999529859892117,0.29176916679553067,0.958459716997957,0.3835375149558602,0.9365834559752888,0.024211829467424284,0.6683432175371977,0.4246709278426725,0.6449348676988865,0.7193921557057797,-0.6971489282990104,0.5653433866521772,-0.5231565297786923,-0.8915130842688316,-0.2030388365619469,-0.23338030974337817,-0.10903058852187852,-0.7199327237808111,0.46142156347358404,-0.4918052468093018,-0.9322691250170739,0.19705912375245513,0.37834261534235175,0.49363782162784103,0.7367788108354059,0.7128477172309516,0.6477383205093115,-0.16293042187268114,-0.6587859409344485,0.8969186380379288,-0.4226794236924066,-0.520362522364344,-0.42885293426763005,0.47425475729961614,-0.16287627966752896,-0.26551101407276534,0.01872332801519317,0.6172831718862828,-0.4467080394627874,0.02997539405330332,-0.042692960000107964,0.9375214488594767,-0.42776404817229996,-0.7598797440851328,-0.23852052444018101,-0.19840309521549407,-0.6823011051308018,0.16297422927291577,0.17088932230325596,-0.6086830193524254,0.19834488184436774,-0.5580139657372628,0.09705798324958705,-0.3629460260286899,-0.35071314326050285,-0.32803980519494846,-0.32101599642562517,0.03648269572771845,-0.09344896088370724,-0.15105185282108113,0.8871221329853243,-0.7826939756359468,-0.4570859231613347,0.6516245663797235,0.4471839663283383,0.10255672526095672,0.709296345114402,0.3668512804633558,-0.17148089363122096,-0.42917769862258837,-0.5051595387618122,0.6866792325898312,0.5014650935921487,-0.9857718752495042,-0.5191140282269754,0.4871321786481846,-0.5273311566943129,0.26714156436814973,0.10251706722497334,0.10224674442589918,0.023406477439001417,0.8126821722018306,-0.39329716408470783,-0.9252559297993778,-0.15536190756325038,0.02820374725683582,-0.8228231267317954,0.041360163550129184,0.19928721819406234,-0.058154470975801696,0.2989828902757793,0.6092044080027303,-0.7091636351828299,0.8211158098071282,0.676369905806189,0.5547106733692738,-0.46950775729289945,0.5002146802082748,-0.832799104536265,0.5167213614831719,0.8222714781082844,0.13864993472804743,-0.7514104828619046,0.8934281823917906,0.3253707248604316,0.888086116450067,-0.12019506837107673,-0.5011815453474033,0.25783795257556363,-0.3547560573767861,0.7495103640155704,0.8721086083460812,-0.43057531083225176,0.7546431484896224,-0.9289032064148052,-0.12977638533726563,-0.40542990324422085,-0.6320979267982318,-0.3172131627971814,-0.03909209132009862,-0.5126539423886931,0.8142276396637287,0.38531219507761083,0.3017355733001323,-0.24873165767259703,0.6445537489018349,0.957278490255755,0.039800439188128145,0.024414161580859992,0.5534103223956891,-0.0381116475165593,0.46453268701987915,0.8834338669696559,-0.31734175785520874,0.49645457915868646,0.2707860716182384,-0.9522752374101372,-0.4272115677042377,0.7482186226016437,0.5288929338381622,-0.46567936155268536,0.5355018981473474,0.5006893095134454,-0.5944093697402012,0.953948178124525,0.7895730570101834,0.41973030378742066,0.8966025867824229,0.6586738365743929,0.8277935834839902,-0.282335906563126,-0.3844986871536462,0.7473177790750949,0.4452287967144805,-0.3484411593879229,0.5423814891541147,-0.9474418618213436,-0.7254418118352783,-0.01650699598571986,0.1997743380892841,0.13301451759419547,-0.5732802044400048,-0.7916856387394752,0.48838281358994623,-0.31806120387757403,0.43656672921634654,0.10728025831795625,-0.3613441209107021,0.06289589233243378,0.7156626516481654,-0.21372865437044997,0.19363000355774496,-0.6356884071775785,-0.7402163301747956,0.45012238367456114,-0.8156799841248793,-0.40089286624427145,0.4436344812996541,0.24295703915700642,-0.2603831653810821,-0.8507302748082274,0.9525787271045747,-0.7202979454327236,-0.1326929007594046,0.6104656557260373,0.434965825362712,-0.5182764213404859,-0.24351168963344308,-0.44721838021487076,-0.6536676078496861,0.7640101780273664,0.8157925824114238,-0.48486474204398083,0.4948185388531568,0.12963397665154566,0.78391224499531,-0.13764956806171563,0.028583256271128343,0.27605042121409634,-0.6144563620639144,0.7632969135816581,0.14501323590533033,-0.1980665666597466,0.18976002146905552,0.6503584489241081,0.6364864631029188,-0.8844115851633593,0.9843829858196692,0.157879924164859,0.03324416840948341,0.8064371951234226,0.14629877370579225,0.07856460629586043,0.29127113813818956,-0.8210810335674628,0.7175638444028137,-0.645176387612069,0.2656307084586842,-0.7784667021197564,0.8216033544049778,0.1698589176685441,0.7117879442670154,-0.07102320002469832,0.39115002170204394,-0.7420900103593991,-0.2873468377235029,-0.799213933481996,0.913926053627999,0.6260721116899917,-0.540681775328779,-0.9955675854056629,-0.5169685070422998,0.903187838645555,-0.7763837663536549,-0.12238319545272948,-0.7927265039567007,0.2482490408122076,-0.11414014401942395,-0.3445456755737681,0.5697976194316086,0.23907318636118993,0.3346356692692412,0.6808220250276147,-0.5885200646908229,0.5458405635147487,-0.7872893836353162,0.7852694352706012,-0.3908258645844207,0.6954817272597715,-0.9640883630987547,-0.7191854284007306,-0.35842334340656345,-0.4684570930230975,0.17089090276928756,0.5697751876132734,0.5516159535102059,0.3407688929543249,-0.39379542939190726,-0.1662426135350653,-0.5694967086652873,-0.8859555625814169,-0.8188946715363514,-0.6036926291214507,0.9910068417488154,0.17599668251246947,-0.9674991569452381,-0.9199833059872172,-0.2574005785125009,0.2781275450019267,-0.7839153818534502,0.7784762794869006,-0.5598696235798881,-0.7405195704174095,0.05032411907351319,0.8018621558327972,-0.016447273011644472,0.9077226391038941,0.7321118801622051,0.0006647523833752301,-0.11227905818278597,-0.1321326654917809,0.9756192447331757,0.1187632500462125,-0.7149521854557502,-0.9175233932164238,0.7190087534550222,0.8507692993591178,-0.48514394333784006,-0.6573388125667755,0.004370444262597976,0.9055358483208311,-0.4705983700623203,0.5948308160474677,-0.08820848931319882,0.5973148510065925,-0.33235662704579844,-0.4406872721522524,0.6927133198751618,-0.6941166618013455,-0.4311896918474516,-0.6825351437532176,0.6165157786702692,-0.14063200247216173,0.18990990231405985,-0.06714796535992527,-0.49858956848885394,-0.08132008776653397,0.3767855455844764,0.10083077767413344,-0.45687716121808686,0.33925605431836,0.4424194646407476,-0.2075968007602873,0.6012771509965196,-0.6905137246094096,0.5994943172649603,-0.4977438074529179,0.16558143905659994,-0.04904239181692898,-0.06221493491400627,0.1549950291575691,0.6411367518042658,0.3676444829587501,-0.7529828538527588,-0.28946587502533117,0.7047873227833397,-0.8298066852682078,0.3875335202662866,-0.7813551558313122,0.04043911738689485,0.6064204391977301,0.4611203776501373,-0.05221496233930984,0.7038619330220914,-0.6531582931387165,0.5612644824349002,0.6634818792470789,0.6226786542452478,-0.9922049355454082,0.8840957979251203,-0.24361078181379675,-0.9021105192771348,0.32237392868138204,0.03719640087911846,0.3854361568087826,-0.8994216123789981,-0.3946772818508195,0.16158329292070567,-0.6594574945182698,0.9383335856444326,0.08307197581383272,-0.17199077478196503,0.33820432857277766,0.8851946434351317,-0.5049048555151023,0.37394860531312135,-0.5412738458381,0.6481759625733541,-0.36497296336084784,-0.6593101127049794,-0.35992970280063796,-0.25380609863012416,0.14936034423930974,0.39725023900767703,0.9752688908894861,0.9784418966331025,0.01307461019580006,0.9953021984183145,-0.8288332412904801,-0.7963644692400228,-0.21447429878955898,-0.18517411756756724,0.27455348250146777,-0.16605106450792279,-0.23771715744382402,0.5250495509654249,-0.009406762867396919,-0.2974607274513172,0.458246832807852,0.023149905678069994,0.8117768148201037,-0.7062663928475758,-0.5592194413972045];
  this.h1[7].weights = [-0.8285133051831357,0.3790565805159676,0.1960900392678484,0.9590715946372956,0.5376991397088666,-0.04275291730838626,0.1323860126070806,0.595132625051285,0.26777926593458573,-0.7336045058708556,0.5544464419127298,-0.8361733984433468,-0.06412205928365457,-0.7033705746957517,0.6509140385967527,-0.1899365580394683,-0.9376946568173,-0.33050743063269405,-0.16885623923097848,-0.3958385408685994,0.173242021785356,-0.9341348288463313,-0.8128915426104584,-0.2982890172064496,0.20865110615796104,-0.2620139613820805,0.7533711781155192,0.9775971373918605,-0.1859170801385071,0.2543310382594903,-0.8038669460782086,-0.5721857323129526,0.1795824515368048,-0.7511466267703607,0.3217537588925226,0.6303071055974341,-0.6425396978427079,0.03086089612627662,0.8503924721193585,0.5592316998854361,0.4557416383289157,0.24200666462657291,0.6236713999422756,0.3149853153610931,-0.9705143246470316,0.7920476871576472,-0.8943118116151388,-0.8909364421444427,-0.07668389805480443,0.8441644208436316,-0.7689655266206791,-0.939648409003041,-0.5061067164743179,0.17730564771946958,-0.30717747254168143,-0.627331857414088,0.24171729014400967,-0.6559694948024308,-0.9533215248941285,0.20717113041700896,0.2896018572390897,0.37637819323594934,-0.3611323191038691,-0.4980762881887957,0.20408007192056857,-0.4816755358911984,-0.46104700876646526,0.22783605266216062,0.021528833156865834,-0.7328843845611597,0.8728267600435909,-0.19089282628092144,0.03266009405724439,-0.5192934463494365,0.32348021939144234,-0.17547191848319113,0.3989444495931884,-0.5801131493589342,0.4541516794042656,0.553317483418617,0.510127684663733,-0.23657465339682973,-0.44866996612159027,0.15823326108378907,0.8992957726680495,-0.4650435229106566,-0.2862184416888987,0.7458775311738631,0.46457014911097716,0.5008862985674369,-0.03388211144431439,0.5379445635859179,-0.47563017678668196,-0.6676623760963336,0.6985465169809472,0.12219704676315074,-0.8297543206699864,-0.9517215617898249,0.7955606705960795,-0.5734142118278146,0.6674841283528776,-0.7961624187002769,0.4578072318266263,-0.8274855292368084,-0.0046151489515550296,-0.45399476347980144,-0.2714375293135264,0.9076675958716532,0.9771018060609484,-0.3963276172766512,-0.7796717317805293,0.7318588887656906,0.3520218980836,-0.010108799406005009,0.9290477606104334,0.6984430344901089,0.91584969098849,0.3022368722878762,-0.4141117666868318,0.11850217294938395,0.2833483423640721,-0.04765592390912212,-0.18276972132908845,-0.46204827928404973,0.16550593867107555,0.3274358565434611,-0.16338801089301083,-0.646054454086841,0.8318795558010502,-0.4937325862614273,-0.516143500248344,0.018697765163459727,-0.7705507200127922,0.9406601007576588,-0.8718557481720843,-0.22261258368234835,0.29121757573835616,-0.45449539774802894,-0.9187039384466767,-0.14822277468729905,-0.9657692206268516,-0.09961972926424321,-0.7986316876371807,-0.24434798268585098,0.2299036356884554,0.9999435402824254,-0.824966238326985,-0.8052246644092782,-0.4830531588494963,-0.9062272483028727,-0.8170707683341493,-0.2759628739479868,-0.24077820757712345,-0.6419249181092307,-0.12819820047094044,0.8427375749225962,-0.5582295144954156,0.12189583564544418,-0.5064744563072427,-0.6351946707403563,-0.996359946230048,-0.5426116105699562,0.08908030766516363,0.2660781615757427,0.22859723156150133,-0.7896439446490244,-0.6005930138197646,0.834796070137695,0.589812293943206,-0.39259845993120895,0.5826968255994671,-0.62957463805403,0.4779604042457957,-0.14545532488270518,-0.3494110134145285,0.5955045405794406,0.43028508755074074,0.9506005686142428,-0.4256045164771025,0.938560597451896,-0.20015992717540398,0.1503098034691064,0.5898922564121795,0.6685864138460735,-0.10039365860077648,0.026376026544902426,0.7578159319386297,0.9073480696254568,-0.21087496895068186,-0.14955305380501147,0.6799992904236858,-0.31022191411901184,-0.9848032712509089,-0.0800715078173199,0.7669658935626288,-0.5984035857187706,-0.9032287036963408,0.7716974835570818,-0.856532395242053,0.7305896835252225,-0.23992821797540853,0.3170280388153031,-0.9122942370416104,-0.4137456469594357,0.37145340425445034,0.5629987355330672,-0.0953563230580385,-0.0753432856563206,-0.4123893287698185,-0.005214562113974528,0.375967638306292,0.9918404442372775,0.5852781093043438,0.8787299389228602,0.18599294990386211,-0.9849990099518454,-0.9510226870875848,-0.49062428817652215,-0.6104317248132367,0.5654581853994224,0.40826392981030496,0.8695532087437379,0.7645885655854373,0.5862988953302419,-0.07682135469885888,-0.11812475739312438,-0.304866202580615,0.2655454064214842,-0.6487079993883059,0.7059980209128579,0.6711245590246876,0.8293053843234124,0.2828716017030654,-0.28063297531430165,0.4382794532854914,-0.8980015777837212,-0.1961011524897114,-0.8241360214649389,0.4985664783350418,0.9862841518275461,-0.78716252612125,-0.2093294398160631,-0.7483241726077744,0.436423648709258,0.1685625377383177,-0.12790426127896348,0.368832295009364,0.16916231060990794,0.7892309690993116,0.48265108463894313,-0.7732055396702229,-0.25147852220117856,-0.3458714835506321,0.11723079878051983,0.6284275166920781,0.37965895480961265,-0.07397706834057063,-0.1971063266155283,-0.6454569449480443,-0.46637017748635895,-0.7321617063138666,-0.23695149664801513,0.29017608335544964,-0.37216711645250655,-0.5411440855819893,-0.9321051778731114,-0.8971456452282339,0.2990120394390917,0.34640771157357025,0.6402961581528224,-0.27859105586949023,0.6012552527370123,0.7662299692223639,-0.7888092413333604,-0.7517998092671402,-0.11681941930026599,-0.26583953073781447,0.9787196390430749,0.4017957366264279,-0.3012065846942109,-0.23610887481194143,0.5707819316821051,0.32305336107775495,0.8684550396272794,-0.266270146089459,0.40830005632733435,0.352605790510878,0.7014112483608427,-0.9592201509992677,-0.01033455121014335,0.9238072198027365,0.6957847583688876,0.8491507251972431,-0.023385480092908712,-0.655325935538769,0.9876120795196266,-0.9749237895664036,0.5583117211202787,0.5929792837861619,0.39339341448392806,0.02584611388075602,0.34577879298339326,-0.34882190590082257,0.9812710694005163,0.8568982533739049,-0.848643312608356,0.438680009260316,0.7587058947288453,-0.36537417454934723,-0.2757780635444327,-0.6214566442996134,0.04647603986272524,0.25497858799625794,0.23322858116526365,0.3213234831870004,-0.8897732509224737,0.72997403416296,-0.06330889129683896,-0.42304550895247556,-0.7244489953656155,-0.5663528459474766,0.19142164013818014,0.0847925422038638,-0.6369813053023955,0.589269973031078,-0.3274045484197366,0.027747131828764874,0.9850049337386816,0.08881430878010166,0.8723721868668436,0.668548533848684,-0.11008144187279185,0.28974527584660986,0.9593513398397889,0.31529526574004324,-0.7126880175829765,-0.723747901555846,-0.7452822915310521,-0.5494148368767598,-0.3961201968196608,0.3860202161048086,0.9307323327806716,-0.7100207237367959,0.6248940620507923,-0.06963935329886076,-0.36894277235842526,-0.43856199203990404,0.9899753433126657,-0.4829513006895715,0.7553036674271167,0.29637216954913903,-0.4384978719591659,0.8934794622160386,0.9331288746450042,0.9125615745042659,0.3271371137331117,-0.008391867553139353,0.6219160414530552,-0.1522027530792345,0.8975150828815812,-0.6589829545487181,0.5535209336028271,-0.42959569968381583,-0.2548123743486201,0.21015243053117577,-0.39904604647482184,-0.7233875778882949,-0.6114204362425167,0.3571962647910049,-0.9236388109314573,0.4390639494950139,-0.566483232999636,0.38305437296405753,-0.8707818371283983,-0.2522639833350594,0.9643581840144418,0.3163010699411086,-0.9829693210442749,-0.34211076578039024,0.5396123790925368,-0.8187662146277577,0.05456792412476703,0.9057542326540714,-0.9888506643006323,0.6478165966431941,0.39123838140341904,0.7248102987399991,0.666441615319147,-0.31604185886470404,-0.3429775621078326,0.0824579085429753,-0.9209633278332423,0.6668121379942338,0.8778478821051634,0.7721552327711358,0.025215035444646577,-0.4191681594568606,0.6865375165526418,0.4282457155839521,0.08363584040186839,0.21112844145928134,0.48801596338335507,-0.9892095703185628,-0.5394240447307558,-0.3223447983419661,0.1530651390545238,-0.5240738788866793,-0.44524687068267815,0.7314228237706849,-0.8761700953687277,0.04730763914397102,0.8381147658020011,0.7727269519193056,-0.9476932858752364,0.006032976291892075,-0.5053183164539614,0.4187929256774826,0.8432186937527749,0.08782873002238455,-0.2355497983909387,0.32791012325308766,-0.5519819841114859,-0.444883234473322,-0.1523444930420607,-0.03621480562667555,0.6741020660825298,0.4119220416608267,-0.8552637887649785,-0.2150250646746231,-0.7494655790365758,-0.7367692325291392,-0.00946218250683173,-0.21881294851586233,0.49769979055076474,0.8532382922766505,-0.09318304482925513,0.8006192628675602,0.6338252466447004,0.45616006822608024,-0.684564861193877,-0.6705091665700453,0.6629733655871819,0.02083789962536864,0.48327324881872746,-0.44427383660828523,0.8089428222260784,-0.9187644321472428,-0.1974462165199138,-0.12342336366428869,-0.005234189612481158,-0.8534567397165788,-0.7823871357524647,0.6042944619675608,-0.48796729463411165,0.8943148771945937,-0.7779358906722827,0.17922370157351802,-0.41939281321381705,-0.9543196660088947,-0.4553740904469943,0.13162650406081333,-0.6534783807126793,0.4490938518549899,-0.9757232538870849,-0.22232007705050097,0.18022424959032074,-0.7094481228099507,0.33550684988217816,0.6623660318189878,0.10564648499055361,-0.2431738066024219,-0.5313411100432571,0.5952824865090143,-0.9073924135926974,-0.23288604008987354,-0.4638453903651774,0.9280517918861426,-0.54533059890577,-0.5807198550287884,-0.3474748356734095,0.5886777470063133,-0.8677107925954926,-0.327521577312971,0.8936953695470723,-0.7043585588814649,0.7296811028640242,0.5984352022069623,-0.9667118732573938,0.12830085648893377,-0.14888833927762657,0.1735900005953587,0.6038059624516882,0.19433980022191058,-0.3959174289612683,0.7823300058926207,0.10152269396336244,0.20083520644195285,0.21003119940864,0.7531260762311541,-0.24410803729820096,-0.8640298122062189,0.9479680540617034,-0.6381965678185694,-0.594701975294312,-0.15841691017566914,0.8191133809124692,-0.21685780512347155,0.1770138819057328,0.47316099520187327,0.8724182371677416,0.447484177062758,0.6696505559638114,0.822180590790941,0.49470828759734975,0.04472407184154067,0.8260295370421312,-0.9686492870749464,-0.3407016345005761,0.1175460598040351,0.6971770194586614,0.37834888136597644,-0.3338533578129137,0.6446296310293956,0.46312720020463405,-0.5595280909586314,-0.5894661851970786,0.7747538197850851,0.32427721040468643,-0.16805374263595085,-0.6129455212181123,-0.394800994945397,0.9489560701379852,-0.01461374656080192,-0.7332843451523277,-0.8532705571245767,-0.3259312775376685,-0.8449807672828911,-0.33992188559612213,-0.12228046161419531,-0.2741595108700868,-0.23900678568482026,-0.5503303954094855,-0.6615203550157271,0.60836562933283,0.13249560950105613,0.8995583965653714,-0.10238332927970524,0.08562040471927465,0.8266408646969918,-0.45359325794982025,0.9882667567488846,-0.7475885263966122,-0.21077670761748626,0.9634195234618039,-0.6806310538810796,0.49716140482644927,0.5441304027267899,0.2423301236219765,0.3943260843947895,0.9711238536713472,-0.19416439043006672,0.48533715672469807,0.6815815506304939,0.47459966723287195,-0.47818596341472724,-0.4565376773801487,0.5341716677336542,0.02301469536831338,-0.940406417161425,-0.9059410130935421,-0.8640233605903938,0.9652272210094381,-0.17347393720415555,-0.2456660724817361,0.033857719358736396,0.8414890427136571,-1.0340673999986463,-0.966016526426755,0.17250505809168676,0.8595054736500477,-0.20499140616169345,0.7268525595559102,0.040036529708134524,-0.2778110528791653,-0.4626013892340374,-0.6087535947649801,0.0007856432491217071,-0.9499907453983889,0.1289162054950488,-0.5104233899051581,-0.34538960937170415,-0.6722492755878562,0.37251429241885925,-0.34278238785142356,-0.09621063246861969,-0.2108932215788575,-0.9833364752427345,0.1625026261515115,-0.5315747348006443,0.30327571363838407,0.41566508451324063,0.3821848057458745,0.3110143250857977,-0.45518049105334185,-0.10702563146632105,0.9335600307143318,-0.5515453575375077,-0.27926596809456355,0.8202412434169464,0.8318199140010775,-0.19531736025317467,-0.9035547158063577,-0.3736621533724725,0.9787645911331811,-0.4344450752502195,0.5733887094412543,-0.003130731228474408,-0.663617171610767,0.8405912060254471,-0.9630994847721295,-0.2888518898535793,0.5677811850403421,0.8847535961866798,0.6967326834973324,-0.5861185017492251,0.05469311955323196,0.772706472901727,0.008637342091553615,0.745694813500701,0.5064275078763938,0.7391221834532816,0.5026185876443411,0.6048586230451517,-0.9422484780300735,-0.30183328486698724,-0.0669413057956373,-0.7878888013761567,0.8615326088551584,0.7090548881989941,0.4866164801532123,-0.5923079534867287,-0.037496314088745306,-0.1349210126365157,-0.44000146083691083,-0.03355643700396232,-0.000011675284850003157,-0.041043736910201,-0.3823376792820629,0.1624666895597341,-0.8022221233421265,0.9394445890863056,-0.8505408714286691,0.18552454760929987,0.12258993691579002,0.5049175342459226,-0.0409706124998595,-0.7092080890729733,0.393678911716867,0.7748442597644345,-0.26826905540251134,0.34819932826137634,0.09022877863584833,0.564458073849649,0.027006032808412767,-0.412600691583752,-0.8994335517047221,-0.28093918144400143,-0.5001744657600855,-0.09957507919897982,0.4373734337150324,0.35305451264750964,0.34126755033337236,-0.3683803919663763,0.9809066425417318,-0.5504099908467595,-0.36936876181688805,0.19282009050195878,-0.05696843908576805,-0.7380625865622993,0.2686022909270935,-0.12087056799485485,0.557965402477363,-0.3774034875868936,-0.5020105637251031,0.8504757129086388,-0.12440750375475315,-0.3873521833492179,-0.11253215736867304,-0.3630986646889588,0.8962249428069797,-0.3719808616740579,0.8382045627855825,-0.9834556611297324,0.7645598541287626,-0.46161865195044993,-0.08851390220569325,-0.4207918904656659,-0.7908388367677726,-0.9187412016567714,-0.962559847776161,0.1953414266093581,0.9540164016765202,0.7479517952647448,0.1427616886847987,0.8960476217897498,0.1436198888852216,0.20715356746749483,0.03857817444549014,0.40139425186683625,-0.37115852246305453,-1.0347617275702758,-0.21985712690291143,-0.5309668393264061,-0.3368138062577194,-0.5872570837217701,0.9729891440222173,-0.43160787388247907,-0.12661382344324792,0.8583303461345407,0.31892044228443034,0.2614577376128234,0.9097889533528999,0.21619338269663257,0.8923980636648237,0.287056568465373,0.2430307977445407,-0.13129666709920665,0.0670059047498913,0.4670079107656948,0.17259275126997917,-0.8840415667769314,-0.32001182149851726,0.34374105780085773,0.2614795139054106,0.62756459770332,0.2317863823374565,-0.9773457145215676,-0.3672334113827655,-0.807006138168418,-0.6196329035454582,-0.5813492173948406,0.7248640806688337,0.6679905741298034,0.9850678229751172,-0.8574301900469716,-0.2092989850404441,0.8155258483669966,-0.5076829851277949,0.9398962621903747,0.9056303786588122,-0.49435219876070846,0.37176449118875443,0.5824534482015641,-0.0633983700460105,-0.2171709403961567,-0.9146444155979264,0.7966229140350287,-0.9215326965614483,0.26551720422267233,-0.686028050270264,-0.3726179440834316,0.5082457308655317,0.8599294901812295,-0.2647038074534675,0.574248725064666,-0.9323209585270955,-0.4280945483845545,0.8456157645006814];
  this.h1[8].weights = [-0.33216397344856086,0.729300231561552,0.5010557845264403,0.7978403525358169,0.727791304777976,0.17229358593716793,-0.08383172901515401,0.1507445424917715,0.6891825298169465,-0.826564041333985,0.06834156199354752,0.2706576428244025,0.10889794707374924,0.5155682353068155,-0.12942381862624452,0.4104894336269974,-0.7694915725906838,0.16580088006823437,0.02352974673142198,0.11331989381763223,-0.6739325714351602,-0.588363115784014,-0.0458459590622157,-0.9389711124566714,-0.08376621753442147,-0.248216135190029,-0.0636209463414759,0.29265084157990384,0.08828104073274982,-0.9654380740353644,0.08976958007352742,-0.8375528522115478,0.09509007360157948,0.8432042188500968,0.8504660892564313,0.5925281499225716,-0.03421863393862405,-0.20003152983726918,-0.7413941543775294,-0.6856889376773422,-0.59716550448757,-0.3419672544644775,-0.8879064341619168,-0.5238783916847017,0.7351266379041251,-0.1450021519410096,0.42233379000538585,-0.7437976714860414,-0.7559219963287167,0.28249575474066013,0.6651635552854751,-0.768005996434462,0.42846869779353824,-0.4975641033261564,0.5144481400194217,0.8540126471259294,0.13008253207550569,-0.10534713437202337,-0.12148962697390653,0.10891784635167934,0.568743278559519,-0.9949797935798399,0.8535402167208104,0.8664453057702706,-0.0328591862691983,-0.21645454107878842,0.058511670814762155,0.6170333453321809,0.5920266088652625,0.0687030278113271,-0.45173769158135924,0.6455689996319244,-0.05767103427706198,-0.6908642734818415,-0.654818943337881,-0.7981238174310937,-0.6775400190461696,0.599002876356479,-0.07923373955714715,0.14320802250785783,0.08843076681418179,0.7916827995364732,-0.6242784890906705,0.7164205331213251,-0.3028271740761611,-0.5682180114236475,0.046401025879432733,-0.9401065759157938,0.37268760757754493,-0.16120891193298448,0.41596253475896533,0.02640550504009897,0.20552775596524872,0.40604644082379615,0.2469362040700311,-0.12089190616628823,-0.3852623110115819,0.17370843287907803,0.5007138157337685,-0.6173933534197314,-0.24127858992221865,-0.2962329013282202,-0.8048055705087801,0.5282276383740745,0.3518463378332223,-0.046655536276544715,0.7961709906089104,0.822642627667658,0.19332579178617185,-0.4133664680716657,-0.5553025565883598,0.17075460288947045,0.5204278303005587,-0.6801962004066056,-0.12078202299747103,0.08738701719870438,-0.5777740797198048,-0.5008129741778236,-0.6221030437701047,-0.7674587792932072,-0.8326664843471377,-0.6695479698601631,-0.27146663757043377,-0.0933937944379706,0.674795567134058,-0.6526558012185476,-0.16076280558560513,-0.18122584900303274,-0.26379743616004464,-0.22312472177176546,0.7452013239059323,-0.44190174878589206,0.117694360841953,1.0009360352964276,-0.7403095841705493,-0.7984240582235332,-0.33135643827336314,-0.20966903079534924,0.5507080245134065,-0.24140669139400847,0.1792389707912904,0.6002597687485436,0.14952120933992263,-0.20488731783257855,-0.21378285508641992,0.6233000903801564,-0.44411589899675946,-0.3372499146504001,-0.6148921341320832,-0.9873486004781294,0.5074641107686452,0.6725780895743798,0.8942597243314514,-0.6331673598625221,0.2527377345230736,0.8067682134320451,-0.9370463480842214,-0.19357733985536213,0.0943180681456374,-0.16347396698362318,-0.7360797962265957,-0.002788238683185814,-0.5007537844016785,-0.3822184481064361,0.5205158263291186,-0.32691855507622025,0.4552890161305288,0.8366951299906726,0.9152333514132297,-0.09906423763051593,-0.7925005103767799,-0.9321362078885304,-0.8015669210826779,0.9557702931504737,0.5699398189482866,0.19934822444063002,-0.47598677801237216,0.5031222637873699,0.8201916873506316,-0.5200178677395549,-0.05246079716292512,0.00687348646872989,0.959002258106709,-0.6197384423700467,0.6519668109951595,-0.746809827265563,-0.20686404444304332,-0.32215822896049473,-0.328225183217209,0.6728766542845122,0.06300687286351618,0.33250656807795975,-0.9561209368871885,-0.569933182838964,0.8040681814563364,0.7676138649141675,0.355662779175894,0.6231685093690253,0.612338003277707,0.4042704332185646,-0.6968368426972353,0.7165598381198507,-0.9111174640929454,0.05970383914815334,0.45132562253542013,-0.3895331741896302,0.29916892705493814,0.6821651004316475,0.37351014480212075,0.6500731369310199,0.3057574866461613,0.9049486367628382,-0.1751845133045631,-0.20934404847274002,0.016859278767689292,-0.5828620759632724,-0.3164762095322012,0.8700803855873858,-0.8062502224904526,-0.553491231682213,0.9203802685639421,-0.5939764664544295,0.2529666413422005,-0.3236678747442874,0.27236148542719946,-0.7916578819488082,-0.8544489745090065,-0.8266722619235235,-0.6197583101293642,-0.44655504160429543,0.6881320783009762,0.3871013251154074,-0.9901340128429605,-0.615979296122119,-0.5645467704034242,-0.5268544736814283,0.2910565321582307,0.8735734837731635,-0.6827355054794109,0.6396016636751035,-0.23223966657171924,-0.7783777571584158,-0.038682234790095076,-0.9230776117760768,0.16490735531102102,-0.9887087903333488,-0.013538793363572953,-0.6270697256226235,0.1017236327299223,-0.49980085527051876,0.2393374643531048,-0.37709643539978976,0.8504303041669163,-0.6363286741484638,0.2642825578598801,-0.8809250651263308,0.39079091753416856,-0.6429205365654853,0.9484585493125992,-0.028837742087452118,0.9320400950871384,0.18110428939765844,-0.797955850166041,0.35401930878286214,0.38742074749533706,-0.04961914700735027,-0.3129082328414632,0.9804794918777975,0.4440200058057989,0.8140193775546785,-0.04899443517896229,0.2448428372327801,-0.10511342963770777,0.8882884814337356,-0.7168194769435884,0.3777417799353838,0.8923785583383544,0.23392606104897765,0.48495516356155194,-0.005867658020876742,0.31876215556350673,0.9009423179170972,0.17881850184026055,-0.8672501977881332,-0.7207476369453484,0.8970284005148214,-0.6395692061491933,-0.36767894791037464,-0.5832597998721936,-0.09682356418685473,-0.5517289530462854,-0.9367924401194984,-0.03376988783698874,0.3802404792905213,-0.2785639767908324,-0.07316908297732416,0.27877737133164465,0.9110530915880876,-0.21790529466566697,0.12784132956294864,0.3362504315652355,-0.09807634669605446,-0.744347378771127,0.7651718742427225,-0.590630247592329,-0.20998400778903814,0.7478633488845273,-0.9199453129557206,-0.03403706564450722,0.2942254485308492,-0.426387327363461,0.7023922415315066,-0.7282189877407055,0.42853909896723386,0.5455578762360166,0.9416316387012078,-0.07140150698380937,-0.15812399523197462,0.03957656178124997,-0.7086777159905471,0.3788768169481387,0.6928183184475761,0.4232937320031425,0.39948782105653385,0.29540846289550865,0.942124711273406,-0.7757518274862396,-0.9074569483535352,0.47543181247722693,-0.04095500695203913,-0.22595083718891623,0.18451800526914916,0.7331952577404257,-0.8803580667930822,-0.8909228571422513,0.523259827215534,0.6537961741856207,0.2810334309026541,-0.4422907102039016,0.6473744263543372,-0.782406419794307,0.7696935022850283,0.40012928690728955,0.8646263313813054,0.7185154845391766,0.849793331001971,0.7951796899323976,0.9854735801761426,-0.5973636973692843,0.5872030780111346,-0.2676330256695669,-0.14077283761825657,0.08997442026620044,-0.22023145499257493,0.0035924694419605667,0.01131080959730241,-0.6461671483549154,-0.5211889579648312,-0.8759627478315516,-0.8654698013439566,-0.36801693885076026,-0.6128733679993623,-0.5043715600340526,0.10162485539818027,0.14854101759080116,-0.14530398578081646,0.432419428983318,-0.07785035123201182,0.7072711205720722,-0.5777822078749825,0.5422817876003853,-0.11230755389738234,0.9624244424089917,-0.9331337366021596,-0.8279729696698912,-0.2424943977980294,-0.5102232993386717,0.7210622813927481,0.927960351108623,0.3378628916830956,-0.05339520180627749,-0.5442614324089087,0.6236114192018934,-0.45721843889039304,0.4731269872599553,-0.45965929057390476,0.7796554811546095,-0.7479759393022212,-0.8864186285058024,-0.8138329450748145,0.06363548475471781,-0.5938700027282691,0.839529182007537,0.27777707591512235,-0.9625216073659613,-0.19273456567976532,-0.928543496065629,0.6105013266525946,-0.12158567757346868,0.6649391890548921,-0.6377031233752,0.10504344022190318,0.4959534855677286,0.576618560919849,-0.9429520799345141,-0.9205007646027381,0.14379095377953738,-0.450196693876617,0.5928810828301773,-0.34248775365400785,-0.7754304763446321,-0.04713876724893624,-0.4384281502428311,0.9438536477157874,0.45008804702096333,-0.4522364895593126,0.2790031358157829,-0.9253614352680556,0.4924922062586916,0.018915899593305117,-0.16736235643283365,0.20958547040531833,-0.6834489879828438,0.5181227879648014,0.35123476490745476,0.7276863597149625,0.5778278442569117,-0.297467171519658,0.21338248992299044,-0.9845186717150464,0.35963746324386603,-0.8222423898997023,0.16504872169245985,-0.32559707954444883,0.38744860883744114,0.36535516770239007,-0.6425482000975673,-0.15646596528191017,0.13062476553499813,0.26127812074702217,0.033807686077738985,0.7466661873414924,0.6349271633822631,0.9636664293317141,0.3713728241457481,-0.22859592137236318,-0.07786876406873144,-0.09366884760820549,0.26138003678545385,0.6024208968429795,-0.3341203380493552,0.3288529949898254,-0.6132992175877917,0.6572261338350003,-0.8134903883683715,0.3037142932445271,-0.6483586555719216,-0.06811610121624627,0.5076735243091289,-0.4089054147801468,0.29404565172147606,-0.9150124406867391,0.5166983061382435,-0.08707492628938411,-0.9132276159137718,-0.11987335482251893,0.6448852171251418,-0.6304225213598444,-0.010842457984862774,-0.4677717590244689,-0.9303870709315959,0.28401691425643083,0.3286985535579497,0.6329160428211311,0.28895295707255014,-0.7670470419306109,-0.35164333038387835,0.4363304980901983,-0.317310477670068,0.2697700602055965,0.025730173677229247,0.1373615012279531,-0.4401022353891129,-0.34003100949065745,-0.7698329116310733,0.5124978826438321,-0.5796624274610732,0.5761714670000776,0.6383212811553519,0.1316444990467107,0.41014126913019033,-0.9462620951850268,0.5476007817541199,-0.06733817605164043,0.6739795216550272,-0.29086668297065904,-0.7222939719206246,0.3321029630672082,0.17435785891597377,0.5123724281591959,-0.9053300158599259,0.09523237499708509,-0.8679255759719406,0.5640303828828698,-0.19836531574259253,0.3363059473357513,-0.7508172204050882,0.40994108001244667,-0.3755562514070526,-0.28312511692058395,-0.7691619330563952,0.5880556720989156,-0.13652945824995236,0.7499180844389658,0.5097668569223935,-0.9174844748029184,-0.7004838573041797,0.997997120694145,-0.9710123248856954,-0.18080915363950484,-0.3410744363183152,0.1220442292922614,-0.24181452337469447,-0.09720800171943478,-0.6398644793381132,-0.6634179033355835,-0.377013565089273,0.7035946203635316,-0.20074740093171786,-0.2984374131485333,0.8307810794972501,0.686449915692185,-0.1042735319248077,0.9624393479671037,-0.09718649665225955,-0.24218889057290677,-0.2694380007042757,0.2923285339971716,0.7131333842788861,-0.4360553167227027,0.43774360869065504,-0.14470231610188405,0.8991893333748046,0.8717464949965384,-0.9727714738250852,-0.06421416840965917,-0.18570036027198222,-0.6841784553902693,-0.6848066457244062,-0.022310661950971426,-0.4154397622174117,0.9561737155725719,-0.5492563972203737,-0.5243831673769127,-0.07198346202656516,-0.1333454507516088,0.5922397126877625,-0.630582536499432,-0.3298332887716365,0.9238922238603255,-0.43941133369564245,0.6411155547521717,-0.10891231244342958,0.26687687484197836,-0.2987706437113022,0.01201446679138846,0.4595699588555577,0.8158765327682493,0.5257233932369797,-0.7940855361647263,0.7533673481713905,0.7012843184252947,-0.12618420739354422,0.4510396237400002,-0.934679290945753,0.7065654212080087,0.5409909065017992,-0.026966469017219323,-0.17515031962778374,-0.2129999659825876,-0.87893151942175,0.30408063611414143,0.35602748820247887,0.15716950334835564,-0.9733366885532816,0.933235788274962,0.8959234748510306,0.19011497217084822,-0.5570262683223898,0.6231465793062632,-0.9359116563954326,0.29121704347617455,0.8913025798122414,-0.1779993055149732,0.21317748380843635,0.5332193145981836,-0.26821853655036315,0.2509617645915765,0.9032175625893055,0.20732957044348807,0.757401433048997,0.4422823388964179,-0.6297604165536839,-0.8033962749945962,0.9560952335585958,0.13895727941658073,-0.32065457536745673,-0.01092308381816887,-0.5349609101166534,0.18088235086447577,0.24480706775429165,-0.5793565891521552,0.2857526839582152,-0.10275302888357765,-0.7953273673874088,-0.7687354642430301,-0.7597309020423753,-0.3326609648809752,-0.6286489409881031,-0.6903630546793095,0.016342193332318483,-0.7716861000049765,-0.2172285726791781,-0.9477292596350508,0.42851279919142243,-0.9164858855465842,-0.4404885681455932,0.3982007895353532,0.23096741401506024,-0.012956801728747422,-0.7848559491304653,0.9590924702904422,0.12428592502733886,-0.9737188509580584,-0.5565186263685947,0.662346048020905,0.40640767087711993,-0.7317770007137343,-0.21913160096546752,0.004353324000879002,-0.567693705419353,0.5970179577171759,0.26859033022243767,-0.8105239207534042,-0.4059551438303734,-0.7775706706850019,-0.7494935191495239,0.03026689873139323,-0.5795522212868588,0.39662001536057795,0.253448296040375,0.5271096794988179,-0.5718892211172224,-0.43567123826963566,0.5497433210397671,0.7131197664009739,0.6259725612990236,-0.6464957903654351,0.2963909003262442,0.13714571945367854,0.008316921175112001,-0.5242938802297716,-0.7601516244953241,0.9675789904396723,-0.6908359736193369,0.05127223592023231,-0.6396769989117267,0.4603161712252962,-0.7247837861183534,-0.7827982932447631,-0.7905129873992682,0.982015802823241,0.49097565172256824,0.36321943074678825,0.2160929194042239,-0.025714066200750438,0.9655753249149477,-0.42413676698463226,-0.003324793867366297,-0.13189849473352216,-0.30146846404803945,0.25937520969482825,-0.9709830893579982,-0.9547086440708583,-0.49021550906141664,0.19100160702389002,0.5807763270848062,-0.1981974449896268,0.31462296256207084,0.5904040688001992,-0.7628703080862058,-0.7185096682974125,0.19292411250091085,0.31740395279761646,0.614806071461225,0.2051814127502029,-0.32306041875030544,-0.34425687861028814,0.45507169709417156,-0.5144975006728614,-0.31250868894545436,-0.7827302078362665,-0.598480719819595,-0.5446980030777433,-0.5863640679011529,0.5766331640670896,0.5157684432729469,0.7406302711049598,-0.10671592383484335,-0.015357984933307664,-0.06653724019474078,0.5248811604618634,-0.6097742646885053,-0.05680874757764572,-0.8632361562950683,-0.47664889709245695,-0.5078028858930902,-0.4675811913663951,0.3028320152001275,-0.7644846941829665,0.13383873434205146,-0.08361452075285539,0.9783893232460451,0.8716210787294313,-0.5822782119337869,0.7883545198093159,-0.7305971367150353,0.5163092540112797,-0.6058317858548171,-0.6381050015075521,0.5229109556967546,-0.8354076133878545,0.20255803334014705,-0.7967395014272265,0.8377735204900763,0.17438305899133513,-0.09401714304910755,-0.4356270088214695,0.6664016690651338,-0.8455393208656823,0.21009788206966093,-0.7277065864760884,0.9166428717364283,-0.5795826937167158,0.6964245326872818,0.1922617759104624,0.9812796118831772,-0.13297058797024452,-0.25242181432276667,-0.7127424960109593,0.5630520127417807,-0.4968574878021021,-0.738769984990948,0.9627846367711556,0.44444948051077915,-0.7391948373942483,-0.9065125313438738,-0.938587233073283,0.17945209922028083,-0.47378640522165494,-0.20679737453630925,0.11076204354841251,-0.9733460101464625,-0.24754763096636642,-0.7762960514027978,-0.18574967808060455,-0.22352198130014966,0.1402528783346913];
  this.h1[9].weights = [-0.6785289461225466,0.798434787642194,0.12902840932130522,0.14249751394704147,0.33304635444109953,-0.37161364317964063,-0.8544156770902713,0.24068137631894393,0.4748219777336533,-0.7567823479552025,-0.867333548977466,0.0085097868464629,0.18753967656468692,-0.4103660406193916,-0.25578660111655493,0.7138960592944591,0.6032633690394613,0.8804129471377699,0.3101745533828165,0.8171561677273587,0.20991388741518374,0.6806792738579588,-0.5752324561148223,-0.22869843813515026,-0.518520005675947,0.6510489754399122,-0.7165260342723856,0.5885137584386593,0.09326694129766487,-0.02989863792670834,0.9652806089503869,0.5729203604837039,-0.5567380966351556,-0.5104481396205919,0.31570533322722044,-0.29364116296489595,0.7612712012437431,-0.19370384292437806,0.8494891225216687,-0.49765683255000775,-0.2734523202258999,-0.49070807223504487,0.239001275562768,0.7398573864032884,0.9199418029741749,0.958473377553013,-0.002972395698942605,-0.24578994059320095,0.6344072946152527,-0.8397650972537469,-0.9667756330679222,-0.9252007495554784,0.08011670799981965,-0.20128165705299195,0.26390305286842347,-0.5718959966451761,0.3645315754489369,0.09435585110794076,-0.558148359684608,0.7432416488866607,-0.2794483345081682,-0.9149905350338208,-0.16263669919843782,0.3361956577552121,-0.5917665074061245,-0.25279620111774276,-0.021287409256450257,0.9168590170105013,-0.8979083433013558,0.17616294644950345,0.9682580029837703,-0.8296642104071213,0.6770558772923885,-0.8533886104966454,0.9317015794613889,-0.17980416988765457,0.5222221794208343,-0.08163790609345381,0.13134124515103746,-0.8100878591086723,0.18673060744978634,-0.19626385983809727,-0.13964441253850632,0.032846965523704925,0.172379959146928,0.7835130902718046,-0.4584457690853245,-0.07285377840861021,0.2222393923429215,-0.1357696133142682,-0.8300176043433237,0.8958192204827998,-0.25756098948524914,0.3179729259453714,0.3423604436800226,-0.42776484612195814,0.14275241396234967,-0.31400081618623693,0.9944609832475472,0.9920362226988443,0.0803445185920682,-0.935198238828992,0.38508792003515724,-0.42405908293988925,-0.4798241634520244,-0.021398443109265034,-0.6962632088368278,0.8058651580112878,-0.6202051397921231,-0.22948237628789042,0.5685379212874376,-0.15823565721093327,0.7561365010798211,0.8696619476680412,-0.09832036743366089,-0.3504022244059476,0.20159267675346093,-0.21282979106306285,0.24544745412676383,-0.7616813534014059,0.39677077423257223,-0.7889041016335714,-0.30818419353758575,0.422155518582897,-0.43243330131122387,-0.3687307101843764,0.0896018232050865,0.9231573142137086,-0.6128193647656667,-0.2383467090756808,0.6721252802741797,0.33144691197665443,-0.006939263197323583,-0.8876768821240817,0.769023083533474,-0.7096628051642112,0.15381159232186248,0.7100532124101612,0.4451388924086891,0.6708390884992821,0.45234314209710974,0.6550548069273243,-0.9094394017499475,0.9539371987215685,-0.8998111259033073,-0.6286860176969062,-0.41490114996244504,-0.21766654033076782,-0.5865635104853993,0.4080483451630353,0.07297299403948129,-0.8424938834112122,0.8798091154613528,-0.6576967215510763,-0.4919456048143717,0.837688508804578,-0.35058039181617845,0.3997910107460029,0.7029820704908334,-0.11632379288514616,0.2703353728103277,-0.8819651291469726,0.6130740230869823,0.8395921700462358,-0.2338330341639773,0.41763922269234866,0.6688773936775596,0.14147823593775885,0.4644876824181793,0.48437625250579247,-0.9112977198750742,0.5873109236983625,-0.11428533808713451,-0.008346014770318148,-0.7120806752632848,0.1256023976576829,0.6672767403651546,0.17206180818964284,-0.6342863967192396,-0.8639855049744286,-0.05125445761172022,0.9516397611031946,-1.004930022816374,0.1486781567386741,-0.4831644792045598,0.293446933203901,0.8427658166335104,-0.07138090452425155,-0.7128579508344495,-0.3936320169409569,0.21159487278548497,0.18326748152815728,0.13622635760998777,-0.26418993650927836,-0.7978254912720742,-0.12154651561030608,0.7323475972267665,-0.9346555212917584,-0.24580556885712937,-0.8503401829257249,0.7061429060913652,-0.1975431461020213,0.813074452772459,0.840982608210838,-0.06103592803656186,0.9098365350249591,0.7080920195523339,-0.16209789422553716,-0.32249567277519997,-0.10171224591666025,0.19891720745522873,0.16764810296366933,0.8671124005563312,0.4097511151428381,0.6864809133846124,0.7653350669288866,0.7361435610383357,-0.9755263097939192,-0.17262196680717576,0.022906925946739588,0.0975365577076487,-0.4511761153967127,-0.5466092865559988,-0.6837557177958865,-0.12888941398016338,-0.9679129059524446,-0.6002076846399073,-0.24612100617446842,0.9747691617896749,-0.7761653703731812,0.9291119874801097,0.09805646124445676,-0.8547886180804961,0.23683634753844396,-0.11704644160653653,-0.48878800598033634,0.41340844634216267,-0.7660953271633875,0.6831128426392494,-0.3751451125740334,-0.25819553863121153,0.6119279249772932,-0.6363681878941343,0.12084030385531981,-0.2410512136109672,0.3191735148698139,-0.7744786189004715,-0.830236900242136,0.7342864013342412,0.7176053920184571,0.10637974666329739,0.4930687942221265,0.8891001414108758,0.4786104803372859,0.7624487515555239,-0.1679880344981654,0.9902191562440495,0.24562146664250795,0.9214883363611028,-0.1636324587887516,-0.27527803307660614,0.21320857135521515,0.7624613003944689,0.19171386259835568,0.5666204770841072,-0.09383361569244099,-0.24125742715158943,0.1418564758295289,-0.5725403036405106,0.3098343188363208,-0.18633432552058998,-0.8086662415219535,0.08495743395585718,0.3496658009458886,-0.38462318880281177,-0.5853233003076653,-0.06728259848859477,-0.6828018011157103,-0.31261444225224755,-0.43533314982600774,-0.72215929047345,-0.8485682418088526,-0.3230685553357528,-0.4385764956707769,-0.7452444978631313,0.6449885499695172,-0.6813187242934643,0.5356561616404082,-0.53424122117642,0.3803691647877265,0.4436667512240843,-0.3433551810654981,-0.5013740702946821,0.6577564607920054,-0.5979873084294028,-0.18862846290837365,-0.6241335063180967,0.8016739248225604,-0.5968794221981656,0.7901413969124362,0.18214449813081265,-0.1479053364188216,0.6145469051721877,0.8535493102464015,-0.20465947434104392,-0.09474937217484879,-0.7683543911268761,0.3652759879288185,-0.7031660583740819,-0.29791713269013126,-0.9452952706512712,-0.49816351026017414,-0.6801941171891628,-0.9368359934428688,0.3278583873760654,-0.4249610148188963,0.2657810678316552,0.6307853086320825,-0.15988433212744707,0.4531852638545699,0.6866890838839005,0.1793310060748392,-0.5096382617608423,-0.49290984548977584,0.2872498146772967,0.031258908563608745,-0.6194217257187865,0.7818716211448647,-0.7397113858005646,0.435304460187909,0.7325296767911713,0.7077983957163788,-0.8640024051855174,0.5706198684818927,-0.1278131926018351,0.38372784573386554,0.43161958221265545,0.6758184956645035,-0.9121263237057381,0.532767339021953,-0.42303506176936934,0.3465200683407364,0.9563006287138804,-0.7826007355940814,-0.41333237542637774,0.8830897377207687,-0.9851484869277111,-0.3223484341241019,0.013360400418208114,0.6396629039535382,-0.6013822530224983,0.13302595875609657,0.657446377269723,0.43334117111334997,-0.5930908316153817,-0.918505102807189,-0.8546833515429878,0.4053595352461559,0.48812353094943545,0.7692373677331903,-0.8999093286884348,0.3036263760166997,-0.46005244186129524,-0.27591545062740513,0.8942132334481193,-0.7395976056530496,-0.2978192158136028,-0.7229504688517937,0.14327499094162274,-0.053394890478743434,-0.5787735587688587,-0.741144512620427,-0.8662951466594427,-0.5391902224984689,-0.011242515676832935,0.780924377422046,-0.8815288938009357,0.1890157473537787,-0.8670608700570418,-0.945124866950757,-0.1629828988497049,-0.4774743829709206,0.7076762251362022,-0.6453196754070728,0.38490432764950055,0.67939657311168,-0.6943630569809982,0.3680344512206837,-0.5375092744707581,-0.9530051777455402,-0.62598012114556,-0.044917028760391275,-0.3628939579908525,0.6367039218662204,-0.19865890627416127,-0.29308727460517636,-0.1121792283568461,0.4255909675823542,0.7102705854061286,0.5354014612789738,-0.30699965389796974,0.0030967024980641414,-0.3721981626015314,-0.20200029609315218,-0.08181669740167938,0.43829766750077315,0.3581147376972353,-0.263571394743787,-0.18030975016545345,0.22814196446294935,0.756134590226844,-0.6730269599977894,0.04063956890935308,-0.7660319578736791,0.9159267145705176,-0.23839947218344784,0.3413257732528549,-0.7982297934599422,0.8685821095572608,-0.4136972381449131,-0.7807211927271465,0.9499350975620424,0.7377557367491301,-0.5233414516229392,0.4844621418560108,-0.7544930869764874,-0.558203157010214,0.39626705209320945,-0.42748372839704196,0.9256920618310603,0.2093873466385571,0.7784595851366821,-0.8629882637378373,0.35278756574643355,-0.09658876088334784,0.45371274331163425,0.33623052695091116,0.6182854511619706,-0.3509366801526053,-0.10408917486613377,0.9095594474986819,0.8638099227061553,-0.0003372681899671548,0.17684674987325932,-0.6591494651854393,-0.16614464696049458,-0.478711840105309,0.8246719255570585,-0.9156493322062461,-0.7599214639567672,0.7186215141213737,0.07524207150713955,-0.7818711797766259,-0.17340863270758688,-0.3816106688154923,-0.7051559317848468,-0.8434662639963897,-0.015540263812412792,0.1479753668268876,-0.4997999166442126,0.8670450508440837,0.7740995768517175,0.3830851902648554,0.640497239947371,0.7419999804514388,0.7286488359789082,0.4761676458000002,-0.8589685708994076,0.17225443690083278,-0.31115939901916606,-0.9519274329659471,-0.621652239259794,-0.8278520945660577,-0.8947202931296557,-0.28634868344524084,0.515653703710674,0.7669350724409099,-0.15910880748110906,0.928642068140817,-0.016742714949653358,0.043025033993627254,0.5291479434783498,0.28372014624426306,-0.37295171538342864,-0.16944222640026807,-0.2638121791810208,-0.5608544996869396,-0.6011958751592756,-0.6077845222844402,0.7530275423614318,0.5813552993251285,0.5562778744095583,0.9952157453330907,0.5249724703255162,0.017883394306181608,0.18040263594621467,-0.9245406521835844,-0.7361900610252033,-0.9203285821716349,-0.23258473718068828,-0.5479966697757007,0.47922085245708473,0.12541698754179634,0.275750227631776,-0.4915320962093702,0.22217634583869164,0.5993373996169298,0.5700966635270354,-0.6752746105811616,0.05497429500035914,0.6835851035220708,0.2815737536812525,-0.09403927296273898,0.414292962682774,-0.3904531784263833,0.39973779606777127,-0.44798753653095885,0.5618712139897438,-0.29253632869968005,-0.5823614392202211,-0.7139096748070436,0.639190532311549,0.009772876520493069,-0.8280146202380011,0.21796591535548623,-0.5397504490821541,-0.1493700301847162,0.7220797899838869,0.33564798285708636,-0.4539494961954878,0.05697158609251415,0.7248057718081943,0.6701801129864565,-0.8107986595166606,0.7946267630516143,0.8343870958909843,0.2858684475320091,0.9695878931767806,-0.08559519044796288,0.7612798899470195,-0.9853567022870816,-0.5727700855740061,0.4356719698394109,-0.15830552461691821,-0.7642423601539835,0.5785521764192413,0.2614687465583824,-0.8214204563159191,0.04579882548603657,-0.4091550529999839,-0.6515812504342479,-0.09779226140766198,-0.5806532662153562,-0.2503818250074398,0.4968976060987777,0.6015217687523643,-0.7901616052843243,-0.6955590501055324,-0.10540111179977169,0.5665385604806696,0.49653229860558007,-0.11531198374574496,-0.4716238753722585,-0.3408679886330303,-0.04772694635013409,0.8597825027979222,0.6660627274217771,-0.25173803457818295,-0.3060725783384406,0.8027219508429624,0.6211819194047722,0.525537108780807,0.6255030521915824,-0.1974699278231623,-0.20413690101185122,-0.4636642163375933,-0.4856645715337614,-0.9806118589583219,0.21599374693444437,0.3684950816234194,0.2303407871104716,0.7039632652717832,0.39581335269566137,-0.14775671160254564,0.34750486871744063,0.6918280532047082,0.5612482917131829,-0.8708704674047335,0.8604739572077241,0.4223353641625195,-0.8772884959653755,0.6302329162756389,0.2760394512170315,-0.9175194532222664,0.8619516688870124,0.37147886335274893,0.4205794939034322,-0.6155061501500027,0.3566107710373573,0.7281198860638781,0.5023867725928441,0.4010502652333758,0.5431829945441188,-0.28954715032032197,-0.11150255204272742,-0.08859133925434862,-0.8907947070707802,-0.35015427566127366,-0.501524555331893,-0.4701611378394349,-0.9737254685877604,0.22627838368314948,0.40132975599065424,-0.5825488136080836,0.671059972141693,0.9331002793182492,0.5587967159215235,0.0875369720318178,-0.6276142860574361,-0.7539628221294656,0.8888602428013256,0.16050337386553512,0.6773095881072533,-0.5587346493018686,-0.18579218600240927,0.7913750901951059,-0.9269214154551368,-0.0020264854613803447,-0.46548445167492214,0.9528101573195968,0.2707101487879731,-0.6505039501240347,0.5338636521189,0.523737451279023,0.6776633196262555,0.4162033034167988,0.24484308543989863,0.5931891424854056,0.07083825775687323,0.4357897572349594,-0.5469514956162765,-0.9808974958751231,0.9107913128557441,-0.7901162619602689,0.18841182226441924,0.8816096705815094,-0.16832427343360637,0.05934863890397106,-0.14896896562236034,0.7111449923416501,0.4891515783103364,-0.10710640857670124,-0.8300429101677126,-0.4648383232848242,-0.9119749449036767,0.4546780540785379,-0.7665096167892314,-0.510712267916397,0.32381514861470245,-0.8543529668059828,0.37448100754041963,0.6513154372365967,0.04958889233881748,0.961094293093299,0.19623658068313696,-0.28709359629183,0.2389612991542051,-0.08057327921575523,-0.4703164962674362,0.7137797801757151,0.23953317953658446,-1.0004303265875913,0.16751229333152715,-0.7375632752750514,0.4932011548710344,-0.9566478756373714,0.8896468145796762,0.8087294744858177,0.0754096481858369,0.7552015746061833,0.07737106100914672,-0.09349730850441433,-0.4571761616473699,-0.6149880331619445,0.036119771678575815,-0.36927761802661907,0.6768804016882626,-0.5428578104608656,0.508194729188424,-0.75993414905623,0.8497505488208325,-0.3672498432989392,-0.9025631619687889,0.8305102600380089,-0.9243745936606055,-0.8893172840604154,-0.5305478381370676,-0.05355131904261782,0.2510615094196399,-0.47088974250124505,-0.1957737351999154,0.06163916278205882,0.4884873878438871,-0.23870443188467075,-0.30348774055541583,-0.6621357325959943,-0.3170694462737246,-0.31683674212818874,0.11190094045330871,-0.08535390877329774,0.02507480513247213,0.5416187615075945,0.6269908920346701,-0.30967130960505596,0.013826649024987774,0.1757484459262666,0.2809677906487569,0.7340944016796774,-0.9959734176298453,0.04327869382815822,0.6002308145125816,0.8530610707162986,0.17806192938045176,-0.1373370906947311,-0.798300187765084,-0.028104395065494357,-0.8095118333838549,0.490014602388122,-0.7372891151722963,0.16165877221583871,0.31622353470857206,0.8039855358258186,-0.7066214514861939,-0.6651370369007088,0.4802170744142961,-0.2953162407869084,0.8929262125470973,0.6161315108022845,0.40667651911289887,0.9201130977406065,-0.6925453082174576,-0.7538022412726277,0.14254896354642793,0.18172262976632766,0.34398764411026506,-0.8427351242196071,-0.7324136714426351,0.35579324984928984,-0.8378924864216732,0.1143925607880127,0.9026881071656281,-0.43071089904142734,-0.10680912863066869,0.06344456949069549,-0.2120934866478237,0.022757117307235383,0.12633599580067936,0.5173934331092447,0.30479891129854353,0.2321764516055976,0.3424384433910896,0.7868596121970012,0.258137213738937,-0.09387037386322841,-0.781437911690918,-0.5256065830548262,-0.8561593917800937,-0.40415800767972837];
  this.h1[10].weights = [0.648045744966967,0.8287374775973646,-0.07911484202229646,0.4531753415154891,-0.9072421155827244,-0.9366489110784593,0.279904514636518,-0.650801294036385,-0.5225404002665339,0.19711246371091562,0.9236164697816855,-0.5649932624547822,0.5640471622113503,0.4121575104156917,-0.6278451076709001,0.7477536430034735,-0.7222457760241845,0.8943500228129614,0.04829187758244238,-0.9753328812255722,-0.10639061249947772,-0.4143087107299778,0.8029757451035533,0.06776035919148965,0.08143788646588458,-0.6195474681894435,0.040107234552543405,0.04790869519479575,-0.6791149334096025,0.8507315260753141,0.9124724572025716,-0.016401308007748923,0.6374416382130192,0.25827039440715177,-0.5643493166442066,-0.5166736915463327,0.006906361137673864,0.834836153395424,-0.8224195134171575,-0.15680608940905477,-0.3586777915944061,0.33642083633709885,0.24368378779810446,0.16919869006592161,-0.8096303010991526,0.3833634910620691,-0.5188321016145827,-0.16030737735317818,0.08274975309007349,0.5791671489153456,-1.0101734945293392,-0.7573657489963966,0.06887249157291482,-0.7515880043926598,0.3666663813880896,0.3558188138830972,0.7649481051021172,0.9756778861062414,0.10352005091762351,0.768346447476512,-0.28273053016795524,0.9827182929720251,0.7919502885496477,0.15928114666998816,-0.8610993550704363,0.7243896138438367,0.6240788004413609,0.3430191380594775,0.8149592592358145,-0.9966852260593795,0.0553307703719903,-0.9919730737754611,-0.9949149923246257,-0.8050627212590796,-0.8798445428700981,-0.36242231557074106,-0.31870839926212563,-0.9181125081256343,0.2953025905265134,-0.5500791404333838,-0.6090612127495153,0.39310705462426726,-0.41062021221739686,-0.24120398591679013,-0.057734923300294665,-0.0631608776644796,-0.6857169557705481,-0.5410179247932211,0.9381291251349785,-0.3467256623519889,0.1891662386203727,-0.7120447053407226,-0.4364772023624527,0.4647430019004122,0.1203688701756556,-0.3105058295234647,0.5065952393221305,0.9024003880945013,-0.513475350105082,-0.3563107588589082,0.12525021236961734,-0.7915391778534281,0.26899823590187105,-0.045064168262040925,-0.09241255985584979,0.012914954234772116,0.8513124918358496,-0.11106096457171591,-0.44958765132499046,0.8688382768442837,0.11970247275282689,0.010838925499331709,-0.01659482428784694,0.1732249904609633,0.04375929278408317,0.6705096600067565,0.39502443621084304,0.7625752446738364,0.8799939089342916,-0.07124131339595267,0.8830173416500654,-0.28935241508238607,-0.7973333346300724,-0.889067572343054,0.4752626921468637,0.6544712056094953,0.7224170380792346,0.6428269473026831,-0.1901572591470315,-0.7530912447558444,-0.7333821288840161,0.1467881643793488,0.9450977235936047,-0.35744309059554996,-0.7689821734077551,-0.3684786432494195,0.6729173784527476,-0.561625203619658,0.5867748290349353,0.12272216856395292,-0.20191316465218018,0.7522087691136566,-0.21990561549604107,0.6299076857714272,0.03756375081690226,0.572233055954396,-0.4158333960076936,-0.381726966815166,0.29308012329218713,-0.6979593559619736,0.3224418798978285,0.49570199649224606,-0.5808061598997,-0.8728693069215658,0.7006777280836193,-0.9600023566447607,0.8258364752769398,-0.701583251223967,0.3890838937058361,0.6382913634801514,0.8596842056992466,0.7807648878275314,0.4348884701483356,0.04611612846253743,-0.9561462239277144,-0.4252956010993837,-0.7567476560267234,-0.9345242817430421,0.9551080170576377,-0.7401662449886272,0.3255147260910707,-0.7964014266258461,-0.5582933033908944,0.45599808450141555,0.6528166397616084,-0.7566015972720075,-0.13418858722860594,0.06144719640227095,0.11099020329070106,-0.869921555658711,-0.8500007312055489,0.12297150186896551,-0.8248371741205236,-0.19374864380030632,-0.7718041782285333,0.30580346549996584,-0.3417972125567967,0.699964905774346,-0.8435393973676181,-0.18540901108372215,0.9644415276541362,-0.47619918570158365,-0.006529238678399565,0.3609601665079327,0.477690497975503,-0.6417694775616166,0.887071705780598,-0.22109709791720283,0.40963825247329017,0.4894262225467987,0.5194648993527176,-0.8774371879249108,0.23401219486382807,-0.44300073792587236,-0.15380526423952928,0.20879925588431064,-0.9741196365482313,0.5767653161362182,0.5453747466154145,0.10989834294885131,0.12079038962017252,-0.01729464336492898,0.05913494586136363,0.036119614700003404,-0.797950275400133,-0.4920991894482187,0.9031165579052031,-0.734237901341993,0.9463673184740106,-0.6810540296036572,0.2915845606535059,0.9826573521674711,-0.7588642764931783,0.17484925068294235,0.6966759765244845,-0.7057188188432431,0.30296017136663234,-0.978152502510934,0.6072156920591996,-0.044619543703727074,-0.8407271721443857,0.3246701667714831,-0.10920027289535346,-0.4514534907908708,0.09609226428914133,-0.79141342143784,0.4104855893269066,-0.987927451817683,0.21000119734871292,0.44638250978276733,-0.19493858502860253,-0.322396244508362,0.9815010989267349,-0.29169970011058405,-0.9602309127157129,-0.3460409478764044,-0.8719477721634343,-0.2958673510433196,-0.6740144916331541,-0.35447823123582,0.10014038083917715,0.6814719896898893,0.954866743408829,-0.686296218228115,0.9852283417747165,0.5659388853603907,-0.13909572714225346,-0.25088035443327616,-0.19715506536062416,-0.5881436938393633,0.059846562617231806,0.9760805756081092,0.46952590049898135,-0.7688279970865743,-0.23880454207122087,-0.41480586105123074,0.44284461276258635,0.5038109528435916,0.9009774004583084,-0.1162393534140986,-0.06896946401592345,-0.7757208338546399,-0.07668288473635688,-0.24621107235366668,-0.995308629634515,0.4560036590647577,-0.9429082099483803,-0.8126589613671331,-0.8616268080352313,0.4858377155679171,-0.16401246542621792,-0.23084520305059045,-0.68674129420109,-0.40880741025111217,0.3322361145545191,0.8655779574492353,0.10115980809845525,-0.5962246145991775,0.31756852973258304,0.3312975239824944,-0.797029019136107,0.3642099249139652,0.978797148520123,-0.9867169160094723,-0.10348996901316378,-0.7797592524181349,0.06957361378564379,-0.20845971549116626,-0.8704701391971074,0.3029559641395914,0.34473896444198715,-0.8337761564550046,0.04206940586980786,0.4801724206277374,-0.5804047574905408,0.39595795473900397,0.9664004473985305,-0.895857673446541,-0.6889129324590969,0.6548463808525276,0.19020911030395923,0.9297021353574015,-0.815394924091433,-0.04498266466557638,0.7876936681891576,0.8205897469336112,0.46990030818901185,-0.18503403936764048,-0.5913034015309816,0.9135989509538441,0.8409407255552291,0.0666506731817043,0.766537359195877,-0.2786940981392106,0.5826835931364309,0.8625824178875473,0.23944338640930604,0.9304970608916722,-0.5993707243412353,0.8874862105645336,0.40557532476925723,-0.11150412589912077,-0.6893206813512379,0.07391600437085435,-0.593142934253635,0.9932797430343783,0.10238448906476082,0.36301582897168766,0.04351327633422042,0.6843015191013812,0.646185477492559,-0.9046628663385881,0.21229769821615996,0.1244788315728289,0.4395332685990881,0.31812756935867287,-0.668169063754195,0.4824683372409175,-0.15387046505520577,0.5321718802774438,0.8847144447485067,0.6807333432453141,0.11465236186898098,0.8545328763830857,-0.4082625682841407,-0.3775145774330169,0.13115333037681812,-0.5743865317354071,0.9018924661762138,0.09647502328434845,-0.8398709493029131,0.12676297501662173,-0.4259251196980119,0.9174572102658374,-0.9790035607687935,0.4694651544461101,0.299735210332946,0.5388223724152718,-0.5632920468555211,-0.6668089487687603,-0.36279720596294107,-0.5435939052170617,-0.7973402147718301,-0.21531031889838143,0.23179215855020566,0.27234105477067266,-0.4152770966299914,0.05433602550328142,0.8464874867406165,-0.37485710322554916,-0.690612563117416,0.048097732729906015,0.3526667232525225,0.8527981089857207,-0.5624478012913774,-0.08270488711096391,-0.6638418674146376,-0.8659812665664726,-0.3706289728302812,-0.6489108974606053,-0.7446209520013198,-0.9348535499648243,0.41129469656674883,0.2505840329988635,0.27229026406272344,0.8865558862121321,0.003930113031449349,-0.6328503270438269,0.465672548486882,0.635715883784896,-0.7824705035253214,0.48671611772094137,-0.9540654095855527,-0.2072439667876577,-0.14775730281868557,-0.12801667308868267,0.6670635023978684,-0.35959286197614265,-0.9536113891092358,0.36224373884229677,-0.6050268041578625,0.4095190132598512,-0.6603764199620216,0.805334492071021,-0.2588705275416106,-0.40487368391570994,0.18275305315745122,0.8870540784392406,-0.9026756406626474,-0.995126780600032,-0.3738170022316455,-0.263206597205783,-0.4357964412891104,-0.9260421869409922,-0.006090548121723437,-0.39478036047843923,0.9270904732708773,-0.2619161920129278,0.7459939766063242,0.3201092156355201,-0.5636170673429615,-0.6749889893892744,-0.1333869842349061,0.31144404116715463,0.11267444836821404,-0.7688331561574373,0.5384667146498489,0.46453179726427785,0.7505486444018256,-0.03643389671961036,0.13288594302773893,-0.44889982380839877,0.6299784250270841,-0.6354230115996558,-0.34226902367050904,-0.9765318691650076,0.944408818918637,0.844292901408441,0.5259677684095495,0.415150381976563,0.002300787787140265,0.11708868188687434,-0.055772727884968384,0.6801271426844924,-0.5237373069754058,-0.19331751380816828,-0.6819704008800372,0.2179775945294516,-0.4123516345588289,-0.8142912065424045,-0.47402205371495393,-0.5491125993947005,0.5181601589082727,-0.3774454603075006,-0.7094971874143523,-0.816554428580953,-0.16785817190475585,0.9358449123823024,0.7693149254551169,-0.9824161899730358,-0.14294061605598518,0.5275633728120128,-0.31091347754150495,-0.9662773382354277,-0.8999801616962716,0.18556008709464625,0.523090532315294,-0.5564560076940964,-0.41780841785773615,0.6976564956439998,-0.6820908512170807,-0.6703662486493533,-0.8635046009468798,0.05051085351200623,-0.14616342183736797,-0.7025925502721778,0.11330702710196001,0.8217893630527053,0.5803751679844629,-0.2640946818510603,-0.7515147608549861,0.7052962213377856,-0.47604275607393776,-0.41361553341269086,0.07617609546667026,0.5709232533208392,-0.865032460184997,-0.9501732692876225,-0.2839148959230842,-0.8977062746174148,-0.011515835449828688,-0.17100058702575383,0.6521486321221442,0.6713485889131564,0.3712872780751906,0.5307942365909057,0.14986597431600973,0.43970986616447033,-0.12056125554181311,-0.995094331444246,-0.8343703920647502,0.5213447079939938,-0.41573125493567864,0.42756585886734816,-0.22384007306971487,0.03899770862741599,0.386436709045874,-0.9272511153783474,-0.2511075056843237,0.39365064303301006,0.16298866013818442,-0.15670304336552315,0.26809733215211295,0.8353242383467778,0.056608281981462255,0.020593225996716164,0.6528089884948151,0.6279229921675972,0.3153580551250143,0.23646941345039976,-0.49132927250445524,-0.12567388841956792,0.32337645217670197,0.44720380608697413,0.00048281929806057866,0.12758646292154951,-0.9001341504616459,0.14304137820758012,0.550317676898249,0.5086587507702749,-0.9845207895964894,-0.7807210685944744,-0.9401882165731724,0.33770227972686573,-0.43825509867498325,0.33780569018586476,-0.3076347483678965,-0.3143589794773436,0.7589571016730595,0.4507396122926643,-0.9639027846562342,-0.41752092070688374,-0.595037995905807,-0.15790600066476548,0.5538089823175795,0.9130599951164569,0.4823499260176163,0.029331411651578928,-0.48286951418129287,0.7055570492652221,0.6585863665092547,-0.3366498008913878,-0.7289180133763955,0.9448570294965218,0.4569056190495282,-0.5682195576494481,-0.6217701971311825,0.6900000285332291,0.11138579729891934,0.0033718147388868136,0.16496708309386865,0.11349497313154498,0.2666219490450277,-0.9078405235360861,0.6490817417262754,-0.7211412696717425,0.43648807201388273,0.7613671341815789,0.3190850238255923,-0.09649152933597377,0.1327372192366758,-0.25980779386050684,-0.31341851463219844,0.08649446279711043,-0.17738680556565917,-0.5680860806558313,-0.5833416361314392,0.7224411345304559,-0.42734217462928936,-0.41555087255228906,-0.6751369237930331,-0.6947285566735032,-0.5796073232175598,0.23283428399094663,0.44192053134800696,-0.10694582647680478,-0.8426913881990078,-0.3480653305902697,-0.27667545380500086,0.4272382349360069,0.11472147851452358,-0.9825974890865231,0.045295117647006826,0.6530821957626817,-0.9069751762718142,-0.9199188528544022,0.8871657497991855,0.45871137046580973,-0.458688005705224,0.6826991424821763,-0.22880498199307506,-0.19182729074161017,-0.22952652599407525,0.37593102075065576,-0.2071073087257169,-0.811754180746749,0.9220739689531524,0.6584594540989058,0.287122260069022,-0.6496732820714222,0.048862243681837746,-0.3146200288538677,0.6018673868123915,0.5043547040841146,0.3116643266506523,0.1828253078481171,0.5147041194983815,-0.5977282851297779,0.8811139030176145,-0.20028944259733,-0.900670235556916,-0.729482910277074,-0.4160249481100272,-0.3891873254825484,-0.7084939665185495,0.5473443800150289,-0.9696779750060798,0.760141578452619,0.805460837408422,0.6649739050373231,0.972600092972458,0.6096656302027482,0.2644242061431718,-0.44128883280615583,-0.8567900348493457,0.9020512968690069,0.7364239327169491,-0.4159657772860985,0.8173756943884426,0.8197960903234202,-0.3657473434524511,0.12985016332433827,0.7884009591050787,-0.05478958764906014,-0.8303757383681237,0.2202218361258809,0.4347760315134762,-0.3872026659266629,-0.7840751595085997,-0.6226998019255415,-0.6454149100119089,-0.45180434904975836,-0.27038857883129924,-0.15657100461350468,-0.31095259014760795,-0.5266990677942988,-0.6394028586320741,0.9682468894030883,0.4531101597575095,0.9328620156094833,0.3434337616099143,-0.2785254511983672,0.1837703464794676,0.6874496985018019,-0.07704706986089947,0.7456972066359818,-0.29232637513043214,0.07746863014805196,-0.9878880893151551,0.09884483505099337,-0.45657433165678885,-0.4759804667332299,0.8134946953976895,-0.47064270017023246,-0.8063252473265052,0.8341566251081308,-0.5772083993223399,-0.2589832840287466,-0.22225655406168424,-0.3375239750926302,0.36686050253291796,0.4570661792394274,-0.7965087796408682,0.7504876000919263,-0.6880848361481148,-0.4274851060517166,0.7354781588965638,-0.0621714159004489,-0.28893412338641256,0.17148993850164146,-0.7099424765634388,-0.9124769389340737,-0.17842544111909062,-0.9880133513816044,-0.45565861716638684,-0.1030554241619844,0.736528411979513,-0.48019518079159274,0.42248698560765435,0.44439833007008317,-0.09113292826717857,-0.8219309608483361,0.5256647271152092,0.5554752885433607,-0.11120459890075261,-0.40767034769019633,0.614057809709388,-0.7840397921161952,-0.8339028758880963,-0.7403106104307267,-0.47608289749416854,-0.4101985968490674,0.3663860696559177,0.7114339084602664,-0.9730527557989928,0.5057625776828809,0.16898113443506568,-0.146258645010083,-0.21167222185297643,-0.4994909729201918,-0.14538697262403008,0.9268762517882323,0.8726850228147631,0.1671667255385097,0.44039161672719546,0.6580197530114411,-0.6212088885663614,0.5654213575309694,0.22356985898162723,0.15745184774800772,-0.838148179573476,0.8156485159679157,0.30962619058487956,0.49464072608410564,-0.6514348740784145,0.7315961910004641,-0.18984286932015695,-0.7817919559591413,0.0028377502776818463,0.6872616524528021,-0.9011299044307441,0.36489230150461643,0.6326901995724724,0.2853077702986761,-0.12946669792779522,-0.4234392489543253,-0.2564840026979205,-0.1123590817540641,-0.7448253202824726,-0.17390661157921744,-0.12193370591163866,-0.7723949423517323,-0.7006780407353211,-0.323806579176496,0.9128609513558311,0.6169910915886144,0.6071544339964625,0.695336406705211];
  this.h1[11].weights = [0.6030231158262862,-0.5647813108929607,0.8514402121122813,0.03841480579438805,-0.14312934341073902,0.6456881127184384,-0.5189934944724999,0.5619421385698713,-0.9447987468118547,-0.07602756340342003,0.09736420105658626,-0.7518382231995163,-0.9533531607532957,0.7232076895658218,0.8252903204433488,0.5244401283012518,0.5658593062308096,-0.16518711641288672,-0.9191294445974527,0.5388386375026638,0.04186887540307795,-0.4546014338412021,-0.06069520387638603,0.36698889664417195,0.5520608475884082,-0.796325162017814,0.6394762761785276,0.5235995476012112,0.18890150792586388,0.6318022841036514,-0.20066395670623424,-0.9016589365693229,0.6827505833192725,-0.4840475522769142,-0.27304707098498077,-0.15595908719041,0.9629151222822134,0.5101659699347058,-0.7516477747075279,0.33791339703667306,0.15215924165885736,-0.44474969850261203,-0.012049280443062686,0.20120608719801958,0.8517963330493897,0.0872950980711019,-0.4808451391213876,0.19814529217021862,0.5190372556768755,-0.6292278370373088,0.7451564846485497,0.8924628881037568,0.04980574402665673,-0.24974280472423635,-0.2403004620559125,-0.979556155019457,0.6817666876920985,0.9845176056728739,-0.6463940106243675,0.18023997948389203,-0.8513995024044498,-0.17844774085256132,0.26103803074608134,-0.009027311020033846,-0.4703062948285126,-0.418385554665301,-0.42991278016801027,0.3285823242255817,0.41167320777150784,-0.8487323540532248,-0.3836314237180206,-0.7959662613987868,0.5102985704571064,0.4347957382071537,-0.9720869624158388,-0.14953085012570275,-0.34795228346277335,-0.7638019174986191,0.1429018701037042,-0.0722627101278777,-0.15459708448558632,0.12760356090271754,-0.7562497885875512,-0.29929758982704835,-0.7413810413211043,0.5171436786169518,-0.458972007791856,-0.1817507439895632,0.3471081619279234,-0.7551766904494837,-0.6447736208457778,0.08169816731253736,-0.9487885362812691,-0.8958140345127998,0.15546466790956293,-0.23272576720537091,-0.17019847970604135,0.931747634529584,0.6408357476293708,-0.8798516117988521,0.3085754051530241,0.4447742953818165,-0.969021854526944,-0.7187390843382881,-0.9359234611239341,0.3821507528084113,-0.3966950623504983,0.36579840756149595,0.7512604573835283,0.5508993616731578,-0.4660970587115628,0.7491309529381218,0.27358930297552947,-0.15707345533417816,0.1797273043002482,0.7909952621800475,-0.7815730407506079,0.5945717456487759,-0.6606544372433228,0.6090959304199549,0.5696756364169216,0.10446459795797527,0.42353597577584773,-0.6664834953629939,-0.13762738405083516,0.5535104070355669,-0.8853773096956089,0.059760510523507365,0.4361257796549039,-0.029387333082004242,-0.850636081067863,0.5991832058936307,0.907323204857972,-0.8148554379380625,-0.8646269251863188,-0.39055450352325216,0.23354576240977099,-1.000710238560713,0.40600977636471797,-0.45190759794695196,0.2350153049893186,0.8529068485285591,0.26755526191543044,0.8587305659348397,-0.8722845402213013,0.6606456842432725,0.594125922701773,-0.8338216633501092,-0.6783536575698723,-0.3482234401422499,-0.811826331635124,-0.9408577118298238,-0.2139153471247168,-0.9763505609955481,0.7753780112180928,-0.1503016416485617,-0.6076630250666354,0.8212385681089742,-0.14614147590867288,-0.10709601929222089,-0.8175315033862776,0.6930501780330175,-0.6517370391779396,0.2714846603164471,0.3675144611235731,0.6646776794745379,-0.48701774816944854,0.14185384110606278,0.8308029030507241,0.35488526736799686,0.25584713601768105,-0.6696376718981981,0.4977442154487763,0.3054416369642078,0.11897935032702033,0.676382365132505,0.6582422956973886,-0.6321086500004212,0.34440773653725265,0.3766614911706216,-0.8141939518426338,-0.2537497650641775,-0.9982260404310789,-0.19179708063831458,0.5579749366925447,-0.23523469641335315,-0.006804685321456542,-0.5287207609746507,-0.08594301913356003,-0.15412285026851275,0.9821117256706425,0.753911029606983,-0.06766220696899053,0.3959633848702162,-0.9653793441917767,0.9073578726605954,-0.8963989891471179,-0.5522255176600732,0.04173281099459253,-0.5577163131637007,0.8962569513206986,0.06580320195099823,0.7694448908213295,0.5007059662561365,0.22460491099997487,0.2325584142677889,0.6189610723744381,-0.5897209880007134,-0.5751756734904226,-0.518476389834354,-0.11991760770780309,0.306725477502917,-0.9104629799738765,0.45581403909992313,-0.3497764898162272,0.6973096680307617,-0.9847547160323493,-0.13417987571601378,-0.2666302554672025,-0.6886470365316041,0.1596393616528344,-0.19866303989665512,0.4258239175251843,0.23106433201399862,0.9032644373740514,-0.43958454223757354,0.013402149956207582,-0.551448015573224,-0.48719891622891837,0.8046700330367427,0.09336701148642178,0.6029595155249549,-0.6405406374583347,0.6108825719023819,-0.27106695964432354,0.6769355470159467,0.9102584519876775,0.9169786747844407,-0.3302678644431987,-0.0037366106941338004,0.5733348805340953,0.6076162975091896,0.9726080532493354,-0.35627974196091633,-0.6087909601080507,0.18131003854097,0.3531790140691065,-0.8058036053347885,-0.08998612680492553,-0.6259743268501701,0.100681310597056,0.47703258655122843,0.4877069101053929,-0.7670618790908641,-0.3445940869965424,0.3293417517181436,-0.9471180790313024,0.08253105346429575,0.8896123532697467,-0.371003829591229,-0.3701464613406106,0.3283128330589209,-0.9744989351300982,0.6699123794800675,0.16787614359138234,0.5607549503796488,-0.5567954304413283,-0.7518466264541542,0.06645209894916762,-0.03776768254846887,-0.9292754374179855,-0.6002933690789375,0.5891181174730762,-0.744394418300194,-0.6250281154282056,-0.8768449348122923,-0.44202131119526256,0.48232241070767806,-0.6243731993419757,-0.03655464561005651,-1.002722749611314,0.9374063159816503,-0.17582833192375188,0.3670408576779282,-0.31093635417683785,-0.5019074825502521,0.776670644961035,-0.1595237875233879,-0.6405011078766625,-0.15947783091406154,0.5883172199093335,0.4497678334805638,-0.8172104586617318,0.767705873227622,0.7182354706582255,-0.10084799973538751,0.04127930482996727,0.0037922369022802293,-0.21452104143427803,-0.8329304041673121,-0.42162633051602577,0.6969180132934709,0.3565538324866916,0.6522727522715916,-0.5449390316490257,-0.9231798395419073,0.941024020802531,-0.5337204764639465,-0.6275767988741142,-0.9820051120986519,0.9134729553908957,0.31559169784147195,-0.7023485760615147,0.24548441840713692,-0.8337875380717146,-0.9404710726141381,-0.5008334720876024,-0.33022022802302675,0.4077364010246175,-0.30643239084556645,0.49930590316580004,0.38018310717502457,-0.8334413118082361,0.6802394285367633,0.8641913405411408,0.3665703212780667,0.41390103545607787,0.8739944855890546,0.07817326116954848,0.028357038363333937,0.9346409655233103,0.6577681163408959,0.5396017286716721,-0.23187780447165401,0.3172211366404077,-0.38582234281347455,-0.24342326082241114,-0.25913100020655205,-0.13316633622249277,0.7990074468462237,0.5103942363041075,0.30971730411036064,0.7163020767647724,0.16949225184653358,-0.8803823254113498,-0.9645775511608194,-0.8312858146214321,-0.9199426594454865,-0.8313012760457237,-0.8507884401558496,0.6364168681015655,-0.9831768447110718,-0.38027757707241366,-0.7314862112609598,-0.303553516733589,-0.24535833425766632,-0.39701953559327674,-0.029099082484551845,0.18532973202228445,0.9587435015250555,-0.27929801926852305,0.8449673782423257,0.8869756527671762,0.19172337713927987,-0.8386672177373228,-0.7783608693886405,-0.041726635631930034,0.10300277354985411,0.38613010555100513,0.6948271705740254,-0.9601403997245144,0.8662679496524721,-0.15264924832329985,-0.8747008345968766,0.2530629127564807,-0.900079123403459,-0.3943578663831349,-0.8494790705599471,-0.09606335902079571,-0.04567965908026576,-0.6057698441853622,0.7679751237575404,-0.13948459033322202,-0.9499618778930138,-0.8552710499671572,-0.7920136584346005,0.18806947771958882,-0.8350089568855519,0.08612800207169613,0.5130437311725968,0.3038067634272754,-0.5013579497027316,0.04824091700825429,-0.35656264703934465,0.6307828678455188,-0.07803378738184547,0.7128689778205287,0.02121116538868115,-0.2969577453811046,0.20729492339178768,-0.8969632882243092,0.7280235481973276,-0.852212382504237,0.9140609560837576,-0.6925188844544781,0.5472073453865397,-0.4059825453276015,-0.30363447941771937,-0.360507937667203,-0.6070319300286816,0.03058136825628299,-0.36617753045012663,0.689395406845976,-0.8427153539015818,-0.4086511047672477,0.48871333801987116,0.2822650833798188,-0.06411525414147752,0.10662085730601469,-0.12941610803372255,-0.32050270290443805,0.8062490966518032,0.09228677479093964,0.9310979737864266,-0.24104594983214123,-0.2824247770208381,0.003610503097873333,-0.2928650151645842,0.4021725712051104,0.40638735676344384,0.4986088069708129,0.5725016167057714,0.9061272424294373,0.42467898808184024,0.93390671399288,0.26767939195033685,0.437265933889939,-0.7442713563950337,0.07137745765634004,0.4308596508560038,-0.46404779405621355,0.12309681997626498,-0.3986102271537031,-0.7616637072265782,-0.7360471601622378,-0.25923505276472003,0.7115604021091846,-0.5800600796724464,-0.6688569138215618,-0.47217644043107937,0.18668486620881,0.8690538924463687,-0.23162880356935625,-0.48426979916851837,0.28492307828225555,-0.7141178281046788,0.92810075071712,0.7520635396935273,0.5824035054667569,-0.9965032291523588,0.6569572714568832,0.6089530267489967,0.5172230856089209,-0.7339948178160057,-0.6738854077542826,-0.27095329124861556,-0.6624357546326959,-0.1596102254937381,0.07164150930204939,0.7161434922110623,0.21888439382205396,0.20498364025486335,-0.3860955012223262,0.9089694456518749,-0.29552944450418367,0.37735729407665136,0.2724939432003168,0.44371966122320006,0.535807345416615,0.5857241501930596,-0.17184623254062106,0.44794664283394353,0.8463925186086626,-0.42919217010346067,-0.7448786351373754,0.8908395439652098,0.9107097173716917,0.9057417351297573,-0.031675883370606894,-0.7997857291415409,0.3465605393650749,-0.9803984833417291,-0.20908112618971586,-0.9843885696476657,0.09747123272476865,0.3937600722762709,0.2953322868066454,0.5409574624586582,0.5993967183626503,0.13698381108289953,0.12112067985830734,0.13166939976907954,0.402932771555509,-0.1946462868594357,-0.9927952315457975,0.32655613310936643,0.9883516730058751,-0.06465503408027545,-0.46729826207612385,0.6919734516801265,0.7311226257316118,0.9520495933152855,-0.236480029772227,0.790987140846648,-0.13597255895525157,0.07153420529221856,0.0072445626469837664,-0.19499790445415466,-0.06503006537012887,0.06108356394185631,0.8605935929875529,0.7907283363832363,-0.3652377702926965,0.2860872949237894,-0.19823550914108037,0.04761176153302842,0.36979327378601273,-0.3753148363960849,0.553028200290497,-0.45424753048662636,-0.16270812734120152,-0.07881350425385229,-0.6158110468159759,-0.5165682625225628,0.30326299239221105,-0.49930328158842485,0.24665834635236947,-0.937646063049782,-0.23994119628809815,0.7905428937084006,0.04596078132402675,0.7130158383673882,0.4570641554167795,0.7823227631284859,0.4887283370428137,0.09470187530362568,0.7003942323014698,-0.7386434485058708,-0.4972159540221461,0.6507910942754008,-0.0005064570730379364,-0.5990613530678479,0.35368775141227865,0.5003821338809827,-0.6600792377944245,0.3375524269564763,0.3783272991890848,0.3272375854824896,0.8842060862849628,0.42684361896200856,-0.7615957310472384,0.710488815246873,-0.8085922953087807,0.8333736303834387,0.2920263485709339,-0.269298402456902,-0.4101837996889819,-0.8016658558058564,0.37463051505912026,0.8855919222457829,-0.5710529768039212,0.256753001518009,0.8805991720035273,-0.7957744582417686,0.14650315246235923,0.6687840668398325,-0.32986996498483434,-1.0056781954020877,0.8575013939365053,0.8393010155506178,-0.055054146350252096,-0.07745387110692796,0.886457199294423,0.6734546898050823,0.2814013998850985,0.7424587263017842,-0.8952502458891078,-0.54153676410035,-0.16512284925578008,0.5087061458713165,-0.6186962375619155,0.47142434166219344,-0.29149466666735413,-0.02134198091647348,0.9675618739679205,-0.8256531074212936,-0.5232628563413351,-0.8751551933728905,-0.15152574666959356,-0.8770580966774114,0.9577832544401927,0.6552313531266543,0.37164720118946676,-0.36000161589386553,0.9746856519138649,0.7401358577615824,0.3314607037264544,0.7592056109204603,-0.5835147235372712,0.4170849782567723,0.7793347375209605,-0.41087410419671183,-0.014123248684942531,-0.8675339282801826,0.20719509881644427,-0.9241021729640022,0.2149622600318533,0.02509746906999624,0.5396399437244915,0.20903544343259167,0.26280854216759925,-0.03298405210257612,0.5265706423676141,-0.20747269584529926,0.18591059177118074,-0.5039959934742504,0.25711717641032994,0.25541876652578194,-0.9388628233736204,0.4038673848457892,-0.5861973778167499,0.20354531843925489,-0.9138350267820416,-0.7594984177873679,-0.057533748192919475,-0.9784780025403388,-0.8143318026154553,-0.9242779940851733,-0.7480977296631292,-0.7660033093672758,0.3210509103792271,-0.7108094708753638,0.573628037854678,0.475218373074503,-0.7426371991210733,-0.7545199313535382,0.9329126549620961,0.9035675596704364,0.046965468187337975,-0.18615997946816,0.11632326822081823,0.27147786789759815,0.3022698054347121,0.011419690709648121,0.8307352041083703,-0.13029883528693445,0.35272239045568415,0.2907551349675157,-0.47859140892525903,-0.49936830066284277,-0.4867604694646722,0.15510487730032388,0.845352861263496,-0.26571934896139815,0.7508094172269903,-0.9552273000591311,-0.16644941518425416,-0.8781080853501345,-0.8681138587922935,0.47725646450533094,0.6030116831396155,0.25722219638176885,-0.9592354411864756,0.25621983220785094,0.12641736704709558,0.8038811195759051,0.14459559167831923,0.49793707633106693,-0.9429174061093077,-0.7260045590819387,-0.5865999158751974,-0.06247293351233351,-0.9700853371441263,-0.41513287384188013,0.8678007346015241,-0.3523594014193949,0.031801050700307254,0.6684288009667104,0.7125705382536955,0.2726212758386503,0.07560130274679802,0.03485116177173926,0.9568707064695905,-0.029550268077353115,-0.21387288601544988,0.6424621471704385,0.15666771029948925,-0.5562049300536365,0.2065645518399301,0.45277432169622794,-0.39083734465408504,-0.15934531688844147,-0.8098757634002131,0.6529377361758929,-0.1791180704666142,0.9851968879933456,0.04097174719145333,-0.737559002995929,-0.16694002147638046,0.8764684208189514,0.4797798649375592,0.8412261986670581,-0.7356915651983955,0.028685633761555043,-0.055487287996876716,0.8402731694244111,-0.25278033841839587,-0.1407248156133201,-0.13996263089067246,0.48698499133823264,-0.05719421997433651,-0.06751793129883296,0.7357910136211147,-0.4698002124716978,0.18854186519891478,-0.4872886737341646,0.990345832612936,-0.18216778189775235,-0.032632447539859444,0.8311472409243994,-0.7351038276211718,0.6599759158880936,-0.37258489744835066,-0.9317737581190841,0.8468429539580566,0.7790697209645987,-0.5331962105876122,0.8292660535393941,0.9852133157306644,-0.40156444936408103,0.3418074904128649,-0.7675535219976167,-0.23836983402938325,-0.5741290681534583,0.5363669564748085,0.9227067723003395,-0.6230156472100332,-0.9992838076379807,0.5247274239028514,-0.6151571977607634,0.06818042633012872,-0.8535902386424423,0.8996881603287729,0.9849551754029591,-0.03825645792618962,-0.7121015083215725,-0.16229758763109564,0.3974517928234576,-0.35772697151800936,-0.27185537358516126,-0.29202602978738285,0.6137714430548054,0.7530098197867289,-0.36517272798531525,0.6409117663688372,0.7269017504253291,0.5936948151476664,-0.4663030399700138];
  this.h1[12].weights = [-0.6203641563758744,0.12800271861894963,-0.3700578358687303,-0.3595822889083129,0.1382619300068959,-0.6236415054617073,0.03466800407571613,-0.5386441803369064,-0.4016192909794557,0.5783682905073656,-0.11259991794818106,-0.747508506785649,-0.8028121149351825,0.5746815050627629,0.9992879519552019,-0.602319828908401,0.8881305137182042,0.969904216619522,-0.5685742287844605,-0.6293744383389059,0.4559717119620163,0.8228919976038431,-0.5467864089515168,-0.5852413340284808,-0.6945881889247937,-0.5140732508183696,-0.8603396398721819,-0.723674639391074,0.3367946709019547,0.31270254435678607,0.8864860852998342,0.17119769968174917,0.4080510077155045,0.42114562933218525,-0.7573358713674064,-0.7951470349683001,-0.616874404492717,0.8538335600484075,-0.892452393482802,0.6214872817317756,0.03854214410944031,0.6765103615372278,-0.8395447343498965,-0.21155766234221268,-0.6155477315690726,-0.2649373767479561,0.27469382654315644,0.9225663205052416,0.16978469889787354,-0.9313497531630149,-0.023623127807105546,0.9324273142137237,-0.37077108961977734,-0.0029021639772353926,0.29209191111838606,-0.21389976183026083,-0.4468797299923617,-0.41918362840687795,0.9767951830983246,-0.19739679816019828,-0.5751269628586209,-0.9496502069215156,0.2522462758729893,-0.9812143702310161,-0.28943472768105855,-0.5876263237735445,0.9227098216246643,-0.8573050751795318,0.7383773040777073,0.9473849780866033,0.5839735860226285,0.009225239807116816,-0.8576843485738788,-0.2426161770643841,-0.27351719466919955,-0.4633633137577138,0.2653253051374843,0.42373141970704187,0.723261072092527,0.9755514710995775,0.6598398676500118,0.8538466517567703,0.34950094819804567,-0.6147259142408532,0.09115870035027794,-0.3056533899649112,0.7697459221003751,0.7555765314880639,-0.34232382863067284,-0.44490642913191863,-0.5532476073927924,-0.7616933050048393,-0.5462135745869569,-0.3043001586438342,0.7122524218138421,0.35651083382820686,-0.31069421746702386,-0.2284737447906709,0.5167258316692971,0.279762043492334,0.7134682819282948,0.9541385745937209,0.39330020583859415,-0.9139835493539114,-0.0016844822863275298,-0.016348641295718502,-0.2506293259015914,-0.008839720853400174,-0.46957061813469547,-0.19692336148806097,0.05349415844055339,0.7720289999172562,-0.5191485828994781,-0.7246838988047841,-0.697659053168499,0.02479278230044755,-0.18935006911723953,-0.7707262091277347,-0.45527832699288073,-0.36962258325809905,-0.5635964050943719,0.1388930205506082,0.5441728463312404,0.42364029635446754,0.546356243995592,-0.18570326113362148,0.7760822122793261,0.8774528170973042,-0.9580017867642502,-0.11826017301251979,0.712747419382396,-0.4750623223459347,-0.9599588256178481,-0.005950519323484848,0.8940855494815181,0.924056534895451,0.8712868000464002,0.7872309008925075,0.3924651106544775,-0.6227548062407096,0.37996863679351955,0.6992258689349996,-0.02773657798587371,-0.2239334288502589,-0.42682467623521453,0.46461899059502093,0.32469870877154494,0.71328840776297,0.15163485735403123,-0.8076546801350243,-0.7318588219533915,0.3654689095833626,-0.4777717471654916,0.5345970751041499,-0.9475763916842805,0.8734043669682563,0.7322196115629022,0.12637132600663728,-0.651760778028825,-0.9366104888203093,0.14728766751016145,0.8226302871165005,0.9923992005542966,-0.5622381872571527,-0.481335875027933,0.8967053049203233,-0.3003612729891384,0.3818414267001185,-0.06489400059991447,0.12261746665309638,-0.8593024032965504,0.0288123611494752,-0.5734133200866789,0.5508917681017808,-0.2667958045724016,-0.35631289575997804,0.28976036455912,0.2863591006974456,-0.6929388752062163,0.06277082488629716,0.7249862195565497,-0.00046717619185150666,0.5416501557580756,0.08782424251839918,-0.30116494785829806,0.5724259599578291,0.18789827240647364,0.24309223070318467,-0.12310099471709417,0.35430830070539954,-0.3577440867694418,-0.07026204629081904,-0.22494151906578655,-0.06421305205923786,-0.8628651817381011,0.5110354356232579,-0.4419341677943046,0.5684159061688104,0.6754545064068678,-0.32176731238235246,0.5480284868481851,-0.003287638426979353,-0.4253155693978746,-0.08047201893636796,0.6937368972042023,-0.8359369671140339,-0.9670333307191452,-0.5248830595645539,-0.6037040043031959,0.027355820520885997,0.2585360586375721,0.7812210214088555,0.1294933821291186,0.6688173569492639,0.28284218719488435,0.7367220701867222,-0.9087513261252955,-0.4853598588550685,0.18428548861521332,0.060520137750152546,0.22312064293443987,0.9823981634632734,-0.14707913204016274,0.8685664720674212,-0.021449075361832312,0.03522115572907853,-0.09773889091793775,0.6310198794861087,0.10387156934339256,-0.42226196507011665,-0.8347231904904333,0.44447716629723166,-0.3354001025485373,-0.6040860341822223,-0.512202602540347,-0.9532668732699496,-0.39788348327491213,0.8305758111852051,0.9487755318784054,-0.23712154853281756,-0.422373087326812,0.46018321703724735,-0.029909816253132836,-0.1484318493498205,0.5165119905571673,-0.22497278086956335,0.10684637690347691,-0.460132159753208,-0.8354678134092004,0.8628265289706987,0.7483499674399215,0.9439071045698005,-0.6730224161721575,-0.40272500589843035,0.7014946961128251,-0.9707635189824827,-0.9778207919622522,-0.7235132088523347,0.7918667811138886,-0.3803613551824471,-0.7830484921593319,-0.4197742583334301,0.29791027859240227,0.8097651467115358,-0.4166411641266018,-0.47093551424478725,0.5425254322422854,-0.3075649816041903,0.003565391511776319,-0.17602584166088894,0.6574962003752871,-0.018717445549099997,0.6421621879509659,0.2752304463566982,0.15999300214107465,0.9691316905075483,0.6447406081543944,-0.4955028954108798,0.9561893554015588,0.6788661495415007,0.9933485406357732,-0.035360769579158374,-0.8165373012950081,-0.2012351506009391,-0.6954557375495164,0.06836777602476264,-0.9037939691986432,-0.38969739184600866,0.5716185759865507,0.3530449210203566,0.6535067312543859,0.40246546629705804,-0.9732827139816924,0.7209029313515901,-0.04504009143295864,0.5210049798115908,0.31888528199729155,-0.4585890165532095,0.7690320705307172,-0.7573883979201708,-0.08906053242618363,0.33569988219082064,0.08517616215990788,-0.41375083388535383,0.17655193346689463,-0.7294409673268544,-0.6242855797634271,0.4113364975285212,0.26892573668116176,-0.1657481191523517,0.61251145139922,0.6847441354565645,-0.6522461608266981,0.3460841816702942,-0.905293254009461,0.338524277222983,0.056681297262027565,-0.035555722340230536,-0.8657209488534975,0.8638350085719844,0.34903528186734034,-0.7726459615958537,0.2996908907209108,-0.2705543475841904,-0.6841379428317574,-0.6322448640245111,0.06980052425994004,-0.4245172887142796,-0.5118774333395587,-0.5700475990815529,-0.48863498802968897,0.03734084594695598,-0.5698319982802418,0.02053148319727786,0.5451689744128445,0.2134956844229691,-0.8296266286585536,0.9690278818942305,-0.8388678633665343,0.26295409496201666,0.2196911518422578,-0.518149017363381,-0.43279159100107617,0.46139154824041334,0.6925917923377284,-0.33138486705702086,0.0005840952614959602,-0.5915176620756605,0.5471075665734557,0.6461669533929084,0.33984826089449727,-0.024773550604931378,-0.9826587442725246,-0.6777075092017038,0.5946231787153555,-0.5526350794554197,-0.7652978864535334,-0.3521481474223751,0.49123722088960076,0.904889252769539,0.9648697737469767,-0.39461121523927845,0.5213636068586829,0.3303676017061689,0.5701939238934802,-0.48496311693017274,-0.5237339276205001,0.12749344469520943,-0.0298985310245103,-0.32018206258469917,-0.46933159325514207,0.6011111158389033,0.7951325687225824,0.9334923403916058,0.7950266463244554,0.05792822322176811,0.6784346251615272,-0.9730657634996185,0.8462963065923119,0.15506692379483236,0.9383858349726547,-0.03705047363132964,-0.011447588117475352,0.4630611676180938,0.49081150440864096,0.5554884478454207,0.4364947807913042,0.6239280096263893,0.38901347833185085,-0.3010389438118253,-0.9337199025063923,0.10209795470997118,0.48544698824173016,-0.0780435629924781,-0.8363909668386887,-0.4715189500294535,0.30780392264413253,-0.940151045386547,-0.06600717700064031,0.0945227205857736,0.32908224192576624,-0.23132455569199734,-0.46633751615615565,-0.055858940288593804,-0.1970365194426454,0.31153522257700766,-0.2482215680972393,-0.9905448445325045,-0.1773395184997354,-0.5689142133204788,0.00355947632852767,0.17185562403496404,-0.5090020458554362,0.19715745145229752,0.766349930074406,-0.013168230292822217,-0.6775852081998568,0.8168751010240554,-0.2464457172159353,0.4705532667353839,0.14018610540015966,-0.09536775392635412,-0.4238857202287709,-0.8536592016942581,0.7615525260712716,-0.2834320521159883,0.25141723365098884,0.2623643570196332,-0.2736173488168873,0.5334118895802948,-0.8410354737845928,0.6275181827163318,0.11695592111936798,-0.3839857830446851,0.22412405492187956,-0.796040075793761,0.1797727256261076,-0.020398068742687545,0.9536004713006953,-0.9749971727064832,-0.3980341647290939,0.04717416485993953,0.6871996195503609,0.7362879661427892,-0.5546190284267487,-0.4449232516921646,0.04969166994322549,-0.10179836707289747,-0.14925980831210725,0.8730199527821662,0.7059508203155954,-0.894862542439143,-0.8779937537803929,0.8271302121407852,-0.6840403654547906,-0.962286168200391,-0.9975373038010608,0.7870336609191484,-0.8306348923466375,-0.04310130436671762,-0.636327583940802,-0.8332627204913835,-0.4519584707344891,-0.937576464857608,0.7493748397342153,-0.18927795064127043,0.42416163648718136,0.2127311072579946,0.1326654817062562,-0.4718804163266594,-0.801718260029103,0.6620776773259668,0.1482350266629031,-0.5024075636265668,-0.628522652133409,0.852413464669012,-0.8736320534992142,-0.7853376254186739,0.3555085824472049,0.020037586307255092,0.3390928405350125,-0.7326484411610219,-0.324482284333142,0.3453545419065183,-0.6338206510236265,0.5424042964354593,0.8045763439734057,0.35866104857746567,-0.7263309121754556,-0.33473335947854865,-0.13275103962862392,-0.8075266992356396,-0.569241175061962,0.33354166000147584,-0.5309881545108885,-0.6782004388624502,0.002728994566120921,0.2333929156160451,0.44163591070649694,0.5403020201816002,0.04286508104061174,0.35700165167634296,-0.724861720890581,-0.0036054059151588375,0.4043755120751901,0.3226859256072975,-0.6465666644001513,-0.20790041039826285,0.9321111154337501,0.5269540609877049,-0.9077075816440178,-0.8517069648519451,-0.9034549906306051,-0.8884694693661331,0.36562931738233057,0.842511596894941,0.20532225583772848,-0.5615750848775857,0.3732223234406317,-0.8753503898246863,0.15322298720712862,-0.7157091445507505,0.4910324310401873,-0.30771834376147567,-0.5847938311832083,-0.5178990010463693,-0.6540746672786522,0.08236351250774726,-0.9835062901019416,-0.521306738048003,0.09628598897014197,-0.8182571982120947,-0.0271106438505622,0.47796822520450516,-0.5148447414726139,-0.5601681282370294,0.40746873150416696,0.10404146965046479,0.9697475507499626,-0.20186916768279392,0.5589522859281213,-0.7854606861066245,-0.002006802841143094,-0.36491382335516215,0.4219082334687838,0.7830126956403507,0.7552925691319125,-0.8315873509412075,-0.4296578438981075,0.0821120890824187,0.1869301737258783,0.8358720585566626,-0.7934782912122077,0.691171689540847,-0.9176014357372673,-0.025949319924386413,-0.32931247874525343,-0.40917975724119426,0.6815453527311345,0.49521635155213645,-0.17126297695950413,0.6679405280016502,-0.2352378585217022,0.8794094127531852,-0.2854363133914742,-0.0442800368822508,0.37478642209396407,0.035828946900714705,0.11386817312329131,-0.722552637500525,0.8457567424047816,0.5977793432720595,-0.9443455580243578,-0.6162014616722399,0.4778558332028383,0.8314271907374912,-0.8204185897351526,-0.3622651679551841,0.20853976134870364,-0.9650819764380233,0.8914885395174375,-0.5523877652413771,-0.32254081794190204,1.003217341944008,0.24730526998099212,-0.2906749097355707,0.46521154560785766,0.2644697805671877,-0.7028378176939503,0.10312462514870238,-0.07382239829234018,-0.4133642947236045,0.8283132823314963,-0.9750595880986613,0.7743306214210545,0.2770149963019472,-0.37076934244765936,0.05477489744596812,0.7583026917057603,-0.919794080118258,0.560587563072448,0.5927506356839877,-0.004150992100916703,-0.9571718593125558,-0.19604232923711518,-0.34055854059283813,-0.34793722136949473,0.47792485504620547,0.0737639716543393,-0.4824572029254157,-0.08091715054401742,-0.050624218422486295,0.5281050121439818,-0.8153002477665207,-0.865031978521542,0.6166254118138618,-0.7619163530612865,0.789054590123942,0.9455862542529563,-0.5434918933442391,0.39484206092840285,0.5700807816954356,0.12137198937218018,-0.41277737055074576,0.6512515642947901,-0.7442169796032014,0.6635152007772978,-0.02256728442360169,0.5096107408038097,-0.6424031900929308,-0.8523055845444543,-0.942316874894341,0.885655804188629,-0.042467939658970055,-0.5611114971432136,-0.547927005724129,-0.557984646737509,0.7755833152765049,-0.40939202097937655,0.338286237307328,-0.4594510897809858,-0.5509457671193394,0.8517886214477335,-0.8331128681664453,0.6710753796260428,0.38891684196529985,0.9566465539381874,0.989353474454632,-0.7104593858318149,0.16225955124722763,-0.9530568159762955,-0.5348950780653501,0.6962116089252129,-0.9095300456360714,0.5021571594209817,0.39022713066657183,0.35593124136891197,-0.3282221874987889,-0.07552012769254955,0.3205116596312075,0.7191777311147071,-0.43197722066644745,0.2684068404954956,-0.07788409374055093,0.9061492218732542,-0.28044616123262556,-0.23139163967137258,0.5466587393500713,-0.6294822088057347,-0.21268098013450312,-0.6271170222346781,-0.7376362430725267,0.35359112132613785,-0.25293835745751897,-0.37685661482132504,-0.6524626506711149,0.8614621813642813,-0.3602581758172636,-0.5995451436986892,-0.9641319514547766,0.44182666722648783,-0.6093120904036198,-0.7071038140489467,0.687783464940873,-0.260542803026733,0.9174545984268504,0.03437414707220305,-0.9863611801274685,0.2096850301794461,-0.31004114473349853,-0.7275330949469182,0.4432436943573526,0.8144135989411002,0.5952881992197032,-0.6912747658343369,-0.5011824643818026,0.3988783879379937,0.9360466289146497,-0.1847144360313861,0.7423981128201419,-0.9088090677671102,-0.7702243234860112,-0.47576085395841333,0.27212999152842104,0.0515086566450753,0.8365096125807663,-0.20885821856500011,-0.7790113781973178,-0.049566735985412884,0.7761988898992567,-0.16171096215833491,0.45741048532388034,-0.9968204126541349,0.23102889888690833,-0.8063527245417313,0.23984170123518334,-0.824034663453307,0.43392491556408896,-0.8109788578324795,-0.9534318945722345,-0.2017028039424493,0.22999615320541342,-0.03884742580383432,-0.746183725550288,0.265151373211617,-0.6973047252845178,0.2265426458998886,0.25972180035346454,-0.6894686938812568,-0.8151801325896821,0.24358112051569708,-0.5581634270329988,-0.6467058117819986,0.798051048782815,-0.6742487494256216,0.2361736050152938,0.7853802860465984,-0.022725647435872517,0.016160229695661724,-0.18433315383020138,-0.305776574339434,0.9413700421009461,0.17720226142354253,0.11393495702250403,-0.08372407976223997,0.2491133473659313,0.5949152464980131,-0.5502353185387483,0.2838979165710907,0.7145099772974393,0.7878665831558032,0.5503905116780551,0.13590963502145922,-0.94473941351384,-0.8438885224046465,-0.14901017817745826,-0.6249361872344559,0.285852557700172,0.9272540235613466,-0.8636139172211206,-0.6797218627723987,-0.4852344789768511,0.8363991112358276,0.021195301231120525,0.6682899000909297,-0.6975697848213986,0.27622222080172915,-0.30400598281081687];
  this.h1[13].weights = [-0.2467585699021062,0.9018831551232398,-0.12464311433303799,-0.5934577663918605,0.09612173616084174,-0.1657774872011637,0.9638872425225786,0.7311535591192908,-0.09850007443380202,-0.400245124416324,0.5925395033414358,0.706418178291939,-0.796974504649997,0.44249499016059396,0.9232231133032862,0.9506091467913463,-0.8826115251109845,0.1559896181452716,-0.4762980851778749,-0.5380262848172305,0.4911473872665957,-0.7982204315282446,0.4929905528988081,0.4961738542251745,-0.8641035842019444,-0.9319911934765427,0.5550198770822076,0.3249995668725385,-0.7110740981537368,-0.44418782581554267,0.8183630940377001,-0.965153107898502,0.06436475093098953,-0.7834632265818612,0.3311957633802892,-0.8308019160626104,-0.4024532675396404,0.015290713079263163,-0.5376118605163183,-0.34107956254366384,-0.02511139772809236,-0.5759817798875119,0.09232278441870044,-0.9450940696814273,0.9243811852041711,0.6742744734535732,0.14259902656016887,0.6769446518077521,0.05108943673908491,-0.6449294889759793,0.015598956530043727,-0.7472695843184783,0.38568754232663094,0.787081169908164,0.5198341942264175,0.5281644008708413,-0.46408431805677797,0.35537198444681684,-0.3186691414389964,0.18682347017108913,-0.8881049616648165,-0.5868256861797541,0.33808173421915466,-0.15709592005921413,-0.3947676305377413,0.17176506248212536,0.9511184653501296,0.15686964308269827,-0.01965069876998916,0.5224070970511803,-0.19292537416421765,0.07840203591635181,0.04360469888171069,0.8821195193949117,-0.9009946494687854,-0.900433773598507,0.7993017269107239,-0.7571096806894851,0.1896881931756606,-0.5047094709869996,0.4838181315983614,-0.42185916718065014,-0.4443480858571576,-0.2865135467101798,0.8857327205137062,-0.7426672803688783,-0.5465394577480077,-0.7287764279312137,-0.5029302599756328,0.886163732247396,-0.68222080741729,-0.6325964475932607,-0.9756999534872818,0.976212124460121,-0.40314281328770485,-0.43696807033946494,-0.07779016434171263,0.30424042580250327,-0.9853417207992061,0.21203051223555544,0.03782245689493309,-0.8778382293283902,0.6976361202642108,-0.9122074497876391,-0.04029904575667032,0.07211535519768478,0.2122294997060001,-0.16193011952362812,0.9192681199511327,-0.23374112526108373,0.39428701049741316,0.45705971641616144,0.7663344334729555,-0.386338736273674,-0.3730338135456143,0.6924689068855473,0.995209808364083,-0.27635367046248216,-0.569226120872402,0.4305918830036754,0.2545209676156555,-0.5489069555557733,0.5410222663753617,-0.6508355456628743,0.6192398880007811,-0.39288542562048495,-0.31382393668092934,0.3998376950437403,0.07817898244245378,-0.3250606549227494,0.573187415498392,-0.1956029820733465,-0.37049719987773744,0.7271436580109099,-0.05785729527695427,-0.8163034343354761,0.6338581025775226,-0.8311438436344392,0.8882726063767195,-0.09336178539900032,0.984103791405063,-0.4413140379880859,0.07534645687821635,-0.5106556365019497,-0.1023577723749646,-0.1682526434438515,-0.9623141748299225,0.7636434205867769,-0.10239382628244423,0.9452535670360906,-0.1286012327270834,-0.7173103287620152,0.012716569456761341,-0.5946416581555182,0.43691635418421193,0.8628442370616288,0.7725320092195299,-0.6452732446139079,0.8796490731093114,-0.5985580676016532,-0.025423840558842288,-0.8617267333850176,0.9361726542110609,0.32683594285076795,0.8549207410331412,0.5253490029922032,-0.8606092097194296,-0.7224959757749636,-0.041883987439402685,0.703413549423866,0.7098281481039267,-0.72095279928796,-0.6016065169181553,0.156501250524689,-0.04287084385430169,-0.9168825948594803,-0.8734628903273898,-0.17849128569499614,-0.6950696010145477,-0.7517841659458078,-0.38299598637862386,-0.5155891752603695,-0.33711868609091394,0.19147000627150537,0.63224940042324,-0.7147879769296401,0.2814175467464238,0.22047583733199808,-0.40699496502205934,-0.21052548626876266,0.5927025432726394,0.5397212535115615,0.3526467619104467,0.23851193329343778,-0.8713817001950205,-0.8347542104565105,-0.3966234763776151,-0.5274938407855213,-0.07219706681239167,-0.008050648293262101,0.8806897094708073,-0.9509994415351846,0.9966355310655223,0.9699076583175317,0.9211028653654766,-0.9335374947181526,0.4655535995289513,0.32845186201839505,0.8840220494948744,-0.743116101943861,0.7472357055144329,-0.8545315476778885,0.11402474148642029,0.37632476934355696,-0.4701009008264855,-0.4121643788953392,-0.7948219690974095,-0.4809577633359185,-0.6787014116075379,-0.2534936908648011,0.9440279294788125,-0.7691340532848845,0.6569804312728076,0.48899443668579096,-0.9475435947909859,0.15225912032141167,-0.4446833206845952,-0.3689765579465197,-0.6073098048566815,0.5581293629827988,0.5494655722366112,-0.9536687892283885,0.12387891889926878,-0.049595841038517635,0.9047549723147202,-0.8864785643130763,0.1312123986761556,-0.6444491329078975,0.712570013971267,0.9806757341264251,0.38802684372608287,-0.15138884058774588,-0.25493618867624385,-0.7061289621440076,0.689798049804315,-0.34592287731967547,-0.7521580387261356,0.1656397656998216,-0.6544234906657646,0.9745059378903324,0.9177990918836793,-0.9085641096247671,0.5745752268213462,0.6181963789866997,0.348577202540914,0.10741947105390047,0.8997830350511329,0.7218702824357961,0.22020542021301928,0.9442471173437352,-0.47636549360920544,-0.7047518168610893,0.4389980358255495,0.19449369014084544,-0.18638366847587995,-0.8888831922790327,-0.009719948500884592,-0.6844147564524188,0.6210889578204598,-0.5414812485203079,0.4918009085152465,-0.966224677854429,-0.42982119698610927,0.1341844265532145,-0.9928817996037516,-0.6909823193025602,-0.8621861454579366,-0.2491685821335342,0.20849831205351269,0.08963917360339971,0.6519603844170628,-0.18305447932145194,-0.21228094182865187,0.9829626793499103,-0.8669147590682676,-0.8196281218674906,0.9808417084343816,0.478697128938911,0.07245975146450995,0.3647726646687148,-0.539532460453857,0.5568954304712025,-0.6346478833166393,0.3085218600446827,-0.19346208148394958,-0.9445425936682535,-0.8033893466169297,0.18466152161271557,0.7902660400193334,-0.4416509308707218,-0.5123762999922674,0.642646905084171,0.5171736663742316,-0.67425180477822,0.5264242076484706,-0.03581310747375854,-0.7974258673894785,0.9016354833233983,-0.02957315229146914,-0.7195813023437888,0.1295307461280374,0.5114363241608475,-0.4376455472377694,-0.7546749796125263,0.834110545166844,0.07281063457633885,-0.11785420724860228,-0.6298463679053463,-0.3694568140022231,-0.021730281677999036,-0.7138571197397626,0.5977653163012165,-0.2577259194860262,0.829493353224709,-0.46817350982811146,-0.12883088072421175,-0.6642075016751718,0.5282343000914156,-0.4898990409792761,-0.861972687530074,-0.5330735723708362,0.5332114722505696,0.8628839979845875,-0.8294779377966295,-0.390495759623848,0.8939850871405984,-0.8948291610120174,0.877611400791721,0.6682200847859694,-0.8564245341750724,0.1836338124758166,0.5534232438933084,-0.4545997321378892,-0.8913557386270407,-0.8825965146774003,-0.9786382483381685,0.00825548984273308,-0.13826442612157142,0.9938943147934515,0.25793519123841,-0.14100953442389894,0.6914554389059043,0.24856989157993578,-0.5348268599719047,-0.16714386556645167,-0.46085640875433737,0.8640448102172905,-0.46838346149091364,-0.2522004849369598,0.7750116612905238,-0.1233632409316057,-0.4171255973351944,-0.754784819050789,-0.8504987412231153,0.3504474966520413,-0.6080195425113324,0.058864423341213244,-0.29837145258912995,-0.3210129522000852,0.06331225343821413,-0.6806388015411046,-0.7331219938321992,0.7861838406166685,-0.7881968972878733,0.9171268636433828,-0.569306219946502,0.6016459251596475,0.4816822078875095,0.5273159910135157,0.8245475140290669,-0.3374845912414422,-0.8265268936315834,0.2987928485067954,-0.25303073859429404,-0.960325975983801,-0.9992747574989642,-0.7990193099450855,0.5501115021925012,0.8060992294835523,-0.49048224049420863,-0.8364556553171272,0.014937360020566004,-0.840495690524828,-0.9862103565805278,-0.35540977418875336,-0.5360771321618529,0.0648128960601687,-0.630676375735326,0.9203705412008174,-0.11583037183504617,-0.7850345773748646,0.7880246137161724,-0.9365159835690151,0.23205063077690302,-0.48296042674344947,0.47580615784902563,-0.7560409085415714,-0.8587810409373308,0.7537791580818567,0.06531968647814124,0.6890307117941209,0.9620176102672398,0.6427996310611417,-0.4968315123437893,-0.7699869966226104,-0.7196221153330062,0.7314422510469563,-0.8301000270437515,-0.11825487806993511,0.3678467470151653,-0.20208142385353722,-0.6735873329278611,-0.8389971360828248,0.13519548619261823,-0.4790843425082508,-0.2720233641693999,-0.8995044687838984,0.39208957534257866,-0.18010698756572666,-0.5659384235111183,0.13521058283804582,-0.8873836322883079,-0.6720173557572702,0.3952533408785151,-0.4481253450437894,0.06826202785659163,-0.224080277813651,-0.25593563284277465,0.5184817029309595,0.5404359276737035,-0.47426169654144523,0.8070629553428668,-0.6659675698921972,-0.49545942517246955,-0.10802838907217405,0.5000395651213059,-0.3154273279464914,-0.21738601890089582,-0.0026484499698348485,-0.5002646680003436,-0.7486273215028075,0.9709805065411679,-0.6671282335981308,-0.9372983120539006,0.15885999559773825,0.8455920961607684,-0.2462802011390566,0.177534794663869,-0.1597665315866489,-0.6458364325855273,-0.4343641728073977,-0.27412133757646134,-0.14341691081122668,0.7022161450662877,0.23154609544697005,0.38422930398412847,0.7499265790357132,0.6217797394146151,-0.04127164802934727,-0.4765966402275294,0.5700555581160066,-0.7076125131007431,0.8166716560904128,-0.8225783769941207,-0.3992085460687539,-0.9018351226966983,0.40400748800610853,0.9405794648653117,-0.5766629563729545,-0.6612134438635391,0.6985315572856892,0.4969446515804281,-0.6927669487416397,0.7466905838759272,0.07963840932945516,0.43666640478563495,0.1247913078928018,0.5316496309726025,0.8857237270046923,0.16033176138907074,-0.41517556899316604,0.15208828814619987,-0.1614164085981353,-0.4017063164945613,-0.8877151143044898,0.7692193273903808,0.43620042937781356,-0.5787231764299204,0.6413852207912809,0.27542907934844274,0.2226405872685095,-0.6060651366944396,-0.32284367936848596,-0.5667809347593827,-0.48994710938677016,0.4789575312465212,0.46430432272077654,-0.4260144405380406,0.7049254748634162,-0.5478694774017036,-0.9235715289360437,0.7984355903747656,-0.652115006340321,-0.2997897646192461,0.7575285850871593,0.98801608538183,-0.8102103604911648,0.2848389869153913,-0.1830850699748784,-0.2118255110820346,0.15170120777539425,-0.6309544284006472,-0.8228497302799354,0.5251925245054295,0.18326120636703447,0.5723292659523874,-0.24535459593906997,-0.09952472085720375,0.9066073113262311,-0.3446084916049952,0.7119179766565727,0.8962346081833922,-0.9669023789046161,-0.30303112349371353,0.8873839465363023,-0.3510641711816643,-0.3538479868686386,-0.9410326640199934,-0.9274009340713985,0.7461169774587098,-0.44819437542171114,0.776447889622026,-0.1037753639284817,-0.0962412291130526,-0.16050496025067018,-0.4494163728083972,0.9826825289608772,0.847898007902634,-0.06472798465073475,0.027104015164302088,-0.49368803375098336,-0.03505730354254921,0.5315626041240297,-0.4698075788071471,0.4922511768391013,0.48033677637587,0.6964179639770552,0.4426078634041702,-0.09606887846195092,0.37076355937749506,-0.4912799319846584,0.27338787626382416,-0.8843640040186459,-0.6475479757329308,-0.11262919379135083,-0.25543726114660276,0.5426669033689422,-0.07359529915622995,0.5780618540634633,0.20613267306088798,0.980319113076049,0.6492938929770408,-0.9376548171225394,-0.3102569781725068,0.7248376690876686,-0.31562218571756817,-0.5697532986162559,0.6596907932583954,-0.9812668164491414,-0.2555540471361161,0.8705242922105706,0.004399397869111487,-0.49696691577760654,-0.8796191244826477,-0.15455812129889063,-0.43981620937720894,-0.32603354494567527,-0.21386947696876335,-0.23686652657877175,-0.623440571870718,0.7792365708753479,-0.7378144628994854,0.18245375117063523,0.7869245791682881,0.13950255253255647,0.23396932991786762,-0.7467088700059155,0.5689424172106419,0.36129801140162954,0.7411318264812622,0.8173548652021206,0.7669910484033796,0.8538387847579372,0.41446325489664443,-0.04214101777182152,-0.5124404628859869,0.38691477935876434,-0.08007334490725854,0.23336130817612993,-0.3592711592280249,-0.8067333377959377,-0.43556480928778296,-0.8554223416626505,0.3676304661141219,0.010847008612681402,-0.43564277497067566,-0.7789275551896805,0.27795367794589954,0.3450150924764966,0.07042499330633584,-0.8552795273176663,0.6189704747910583,-0.35900897323461956,0.1691371076187054,-0.10760770319739092,0.46051272385516573,-0.3720560548317624,-0.9335598973404982,0.2798560414650775,0.5757867301326659,-0.2771174784156702,-0.25649348013287865,-0.4790687687976652,-0.13877793963572763,-0.9951600356590378,0.44794966800937525,-0.4475216837070808,-0.5453975388517094,-0.5796469904425123,0.4704247517275775,0.36418453819399554,0.8117655264479431,-0.6884935128037973,0.45887495894262254,0.4225270758495734,-0.9538869053018176,-0.4319329331008496,0.0055839127074675,-0.30431795352759633,-0.2603866785531551,-0.9162232962250811,0.6189774807466564,-0.8395708846805365,0.603263412910033,-0.9017826806780957,-0.5952943620162867,-0.9329112812076421,0.030381592988511653,0.05651582428728904,0.21003482265402723,0.21629476529206565,-0.18700845354547418,-0.1733904631939729,0.005368936104546182,-0.1590163207476393,-0.05050807527066815,0.15296927955834924,0.6060192379510748,0.3986998670437378,0.32701256726447697,-0.17824682410375228,0.18247918846213884,0.08910916890402226,0.7296377225642464,-0.7912856485594814,0.6140934368997316,0.5821935448215784,-0.1400668955743704,0.6083106103016926,0.4049785602687725,-0.6408032611883809,-0.7066953766176511,-0.5196519427071332,0.21804805877263173,0.23566072455569023,-0.24149329453057258,-0.6289811836447711,0.2696175679688878,-0.7181486267473284,-0.012931612568366056,0.1784305735640477,0.22142481454657814,-0.17454777888714507,-0.34080047093522525,0.06913683247376261,-0.832922034216174,0.2785681437828131,-0.9561392604222336,-0.9283779245902446,-0.2166065149968282,0.3305582978482985,0.40427866758340436,0.6404773424624953,-0.7812942126839676,0.5961817996204468,-0.7574188082232675,0.7538794888778866,0.9138447805319925,0.644218675588995,-0.7063151370231039,0.8944083390431556,-0.2338980068349751,0.3186540457163013,0.6290669901855414,0.4872073285264614,-0.42721311875982987,-0.04491932472456309,0.7323273057944609,-0.8604830710129503,0.38975341688765636,0.6585570763152323,0.5953134206789842,-0.7092628896948558,-0.524021958058106,-0.4290552653147484,0.8227207798176204,-0.12108658905828391,0.532666320692931,-0.6884596828599985,-0.028369172775300495,0.4711851728306859,0.7784266092489115,0.6380154111091761,0.9929492869943976,-0.6877245968535693,0.14184745307266095,0.8032036884966729,0.8733727901221858,0.4890381040443661,-0.8309372713305433,-0.6751707272589154,0.8735830256217281,0.30396152446969055,0.668159792964981,0.641252094521568,0.12045617931981696,0.18891030733081235,0.2858579496878344,0.06142111914930434,-0.5431501664930362,-0.24207697282472612,0.09320367085041821,-0.7608893395757312,-0.5610933303592691,0.4671997427813473,-0.14555233013534935,-0.11103157937803122,0.7611516325158678,0.7563331367045114,0.6789938284466316,0.6216638370179695,0.2110365207534118,0.5099771472914645,-0.3951184577006635,0.20190815999668152,-0.6687223324482929,0.5631160176784892,-0.7994342459853478];
  this.h1[14].weights = [-0.937024316569123,-0.46164879055348784,-0.5844041166519744,-0.5649501621191768,-0.31569496817690545,-0.313105054356523,0.7962417356333891,-0.06051783796384269,-0.07628727493946187,-0.5029228537552867,-0.16851949857629459,0.1974230980476564,-0.07034496186620678,-0.027083300823994804,-0.7678961650911114,0.13835846771355056,0.37072860054036105,-0.9356617793277809,0.042728849835131526,-0.8221436799416095,0.7680060742156553,0.4236090514521994,-0.45593368385672955,0.8801141595222957,0.21202664651954692,-0.5823650246112909,0.9507301198203669,0.9648794077320064,0.8796487124025971,0.968707363217644,0.2518740126693173,-0.014995646089900498,0.3620172826639194,-0.3708917727827725,-0.8576251170391092,0.6804624709057093,-0.42681930779736815,-0.7411441395105539,0.4443228658812819,0.7688793373529774,-0.8830604799049412,-0.5597352562507075,-0.657688276007621,-0.2478792544267211,0.7215289542432289,0.6116213287270063,-0.2785281162634659,-0.1099396399470707,-0.9527435293167109,0.2597890722062363,0.736974655153485,-0.8189697949100969,-0.18656823543981374,-0.2472597220999513,0.08853855295561809,0.04928336173215478,0.6616489380948987,0.45008847800823837,0.683957512167745,0.1893148330739849,0.1782478926485398,-0.6003944298212582,-0.3484938232494015,0.7437035436281412,-0.2756120329689486,0.07713007065979956,-0.13558463374057947,-0.010650859675556627,0.34066783310629145,0.23555723047003066,0.4627081091410828,-0.38825675535925686,0.5111544104844918,-0.9092651608698097,0.27228103890958444,-0.492974074100895,0.8438775067643349,0.4933431824597882,-0.5965093233459098,0.6898451255351569,-0.757116066666826,-0.44164826152262593,-0.7834440907389086,0.15603937381202748,0.3961850960225327,-0.9918608681518946,0.5692478489091031,-0.43661787263483676,-0.7913141902813492,-0.4880085163948608,-0.07436484513085369,0.8689254837062917,0.2012296409409047,-0.37303746146278655,-0.9527467379033021,0.7496758377135766,-0.44821282110795513,0.05788989288961247,-0.5646299668288659,-0.3077418125063039,0.8387146737307193,0.7249995161994448,-0.24833657509814666,-0.6652528018190463,0.7656172806665922,-0.46000062167593603,0.9633480660800906,-0.7481813452696883,0.343319128572859,-0.9426144950734151,-0.8197816722608735,-0.41290891697459076,0.7205768966277967,0.10521734659524772,0.3709943542437956,-0.5161377053847077,0.7122533318349628,-0.13525788737863625,0.7080166248383465,-0.2436292627646215,-0.5459155823106484,-0.8246787164605158,-0.2761987456145495,0.1479360714608764,0.8723252196407724,-0.7174081130054646,0.5847202048712119,0.8546724355724455,0.056264116312434984,0.6040148687580202,-0.22997282954668863,0.06580940810080715,-0.8853752919043129,0.86751568681812,0.77003911656755,-0.47449886106707495,0.8237907052790321,0.6139547472926801,-0.015304590045051976,0.7204316203694656,0.5925659937906071,-0.3374100267620927,-0.6349365343200318,-0.8075228136364949,0.8795447655781639,-0.03656205206819932,0.35727065241999184,0.5229680287391907,-0.8967968535054573,0.18470557377714775,-0.07708265714281652,-0.20007399379029034,-0.16415915978286083,0.38431152404440494,0.7675760449160134,-0.05715486605795508,0.15422283857522526,0.9023742476223883,0.3598435771780842,-0.650130816916308,0.8315480494508333,0.16257973120446967,0.6390753980668792,0.881045397494326,0.24757918298688053,-0.67362796296236,-0.010363338920580265,-0.7305231937495755,0.31402475347574516,-0.34782227800545695,-0.8647150962084876,-0.23684061519139699,-0.8541619639636453,0.016318160566502735,-0.47953571759695324,0.40339071649441466,-0.30592233665461227,0.9549362616436786,0.08315922121219463,-0.6681965977519281,0.699647801289652,0.3879776268076477,0.5913283140453971,0.040021260235684815,-0.4965208978972444,-0.4980276502994359,0.4318701440811872,0.5929582581729947,-0.8465597010509837,-0.9056407564089817,0.1802816827855732,-0.35154128957456093,0.5626389573112321,-0.9468936656179298,0.8867725416069268,-0.745505718919693,0.8347831109284324,0.5067793235039174,-0.7672410317805357,0.8967025639429276,-0.6974716744194039,-0.4745175469975454,-0.7615456510452483,-0.28852158937536937,-0.9070303410183501,0.765299598870488,-0.5521536345162797,0.934502063589691,-0.397101101631067,0.15937843148165665,-0.6666974615147664,-0.8183015532235632,-0.9375041844729942,-0.442809743260832,0.016273673570543934,0.0607355044939397,-0.6316780046026466,0.10577859519837192,-0.41592483636655975,-0.7944688469892922,-0.11140551323637024,-0.3061227245814278,0.6714557750806841,-0.555211334461136,0.5054475190230253,0.9333185617218299,-0.5255564544219729,-0.253896013056124,0.7672330603134322,-0.6716427529096001,-0.6858952486120731,-0.95109591047592,-0.1955288325145848,0.35784939264376275,0.22905830292443566,-0.3585931732407685,0.6221053659230046,-0.294534093873973,0.24481805628923534,0.5886345380733997,-0.38798916454175836,0.36891824533658796,0.7343465304368315,0.42110245232396265,0.3506350865902694,0.10894497234430725,-0.9844584720765156,-0.5929893886212622,0.4277198230099852,0.7168171880308756,-0.661593925504883,0.14574221472878252,-0.9599259455439473,-0.17382422333953246,-0.5666658475466976,0.333391848936319,0.68266442475102,-0.2810309319740793,0.1598835286802469,0.31024814468955386,-0.2712714442369683,-0.45697522066645946,-0.6820612288907946,-0.24589974150640817,-0.622562689538375,-0.7701024273140141,-0.03072168462962892,-0.24269162542807912,0.9199561773095971,0.178564346535529,-0.6381886204081403,0.8605534983991704,0.030156974142171507,0.5483272269657047,-0.263478323622152,0.606858472321801,0.22849670163689842,-0.9370765421326582,0.3502441743112393,-0.5291620519917725,-0.4644297402662221,-0.8070360243434223,0.7415660251418597,-0.457459682198296,0.5953367189946045,-0.5191581334122486,0.020748940831920085,-0.20309068664927005,-0.05830014414207433,0.9453136313768006,-0.5966885894763491,-0.014407780728055007,0.49570903955318885,0.12864739326059385,0.6065019153444443,0.8733912521634921,-0.7890218666958864,-0.8396065855618641,0.4572501059351529,0.5584610913326141,0.10654584009851487,0.14256495686419246,-0.3719980024836828,0.5402207886458257,-0.008131152770619298,-0.12486267990938776,-0.03379392346319253,-0.4234693573934601,0.5492321288974552,0.8852423386129437,-0.32889375419805494,-0.8321354645994625,0.7812631122158624,-0.03446807914119988,-0.999074328274895,-1.0266734482436939,-0.436326033945491,0.7986567253325816,-0.8372248700523597,-0.9110679960572321,0.190255338712374,-0.5833775129763293,0.6111331833908699,-0.33180953261720464,-0.8441014951849738,-0.140699901563567,-0.8895241471095024,0.25317186558967336,0.9825521428151907,-0.9694479477507508,0.7141843287791216,-0.1067216322937769,0.8650450353120864,-0.5496598559278992,-0.3365289934205385,0.5767717169864417,0.6530484483413149,0.396675235905438,-0.01481887387802285,-0.4808913119307891,0.24627312184004324,-0.521065205426332,-0.5547527172572331,0.6715044238318595,-0.39334337712048795,0.8432793047496397,0.4404506152087741,0.5651344789573269,-0.09771587111366316,0.01583844625792632,0.6178484594273344,-0.1802467025433109,-0.3588806158960282,0.11661290518750883,0.14086789884483872,0.19063669051150225,0.759570651935595,0.2698382815300639,0.6034091527552686,-0.4055292139403131,0.9216856994588445,0.882261539944214,0.9415788082420508,-0.9749801346867161,0.07515255936521047,-0.2611228662366256,0.3271393455653212,0.48440526998571337,0.7898169328579481,-0.3229778156055337,-0.24064536787262947,-0.5347361648881319,-0.20063109698934162,-0.8413241014892074,0.8453377443005214,-0.45087423845968005,0.9384812443647816,0.5416712797560589,0.437687832243446,0.7615581099393893,-0.2840482103640907,0.8082466458516476,0.8045954033116218,0.49330448932282867,0.980535049194593,0.9321647840083873,-0.4156813024530801,0.5088008611779218,-0.28181771931227084,0.6786955111391064,-0.13967635931737288,0.4683876067432369,0.012883135346973155,0.4742934192144311,0.7945965532253735,-0.05047270036944952,0.43202452698136357,-0.05959230958562102,0.8217080122265791,-0.18722861338070018,-0.6667288043191655,-0.9557214188828975,-0.03396266978941126,0.1461705500860619,0.2667603398392041,-1.0051669264105128,-0.8726078382845875,0.40911138883821774,-0.4992234184060193,0.28596129569434675,-0.10037201842985974,0.6853248365030062,0.6119641824811008,-0.0387036612448853,-0.6588791402577723,-0.9603196525615721,-0.5757385602073969,0.3745006200535054,-0.01803400230991128,0.4040083918881723,0.0775003222428204,0.2851602417813776,-0.13003588538654848,-0.21962474467790866,0.18559227160223088,-0.8124362272517756,0.7411785146616952,-0.9166070320777635,-0.19664287213605594,-0.3714870720849191,-0.6371455394346542,0.2327878452341674,0.7411802554712132,0.00936835691854684,0.6469851869012316,-0.35027744762807983,-0.37195851277374825,0.5569070323247882,-0.8245993664362593,0.1851993001548331,0.4656687331088487,-0.9553072069280577,0.9607861683185166,0.6819000617089594,0.6266911006713056,0.9475996477598847,0.021350543735278116,-0.14808795696391508,0.822988470951227,0.88305222716483,-0.4546615940371691,-0.9170298148083672,-0.4893540533131246,-0.9830685257101126,-0.4712443266540078,0.6392364891849929,0.7726546968855499,0.6877620854490987,0.6366837250630218,-0.5587529690717108,-0.22737011931260914,-0.9966759575840877,-0.12552336608028924,0.8875731153397003,0.4741081239034201,-0.07334462286258503,0.6270009811504899,0.8053099874506454,-0.7353923260273931,0.378919158523047,-0.014002304135871885,-0.5292461285687344,0.6223804072338068,0.6931232628561401,-0.2604835767636328,-0.56456422085557,-0.7884632556529472,-0.6310138468362444,0.1834217552987249,-0.6306112439914344,-0.24283082817564688,0.6575547647593927,0.42522043299132967,0.9154735033533722,0.622339619848697,0.8182598471973618,-0.006521242078765264,-0.9148356986126829,0.20507442361182487,-0.7556020854644371,-0.5450884831596161,-0.9604704701281597,0.6609559152370302,0.3771594083364433,-0.271430826698984,-0.35957615092089995,0.8568718062637057,0.02198645150418287,0.049389016649328536,-0.6781797543159058,0.7169200066661958,-0.0619749767917873,0.9406701139398204,-0.5038249805315244,-0.7781313876007312,-0.17234122570122776,-0.6988504267689054,-0.3067566194126257,0.553454567047443,-0.49699950102021806,0.1880902248909415,-0.1123327673794326,-0.9474882498318599,0.3982845768606608,0.8060540197659413,0.392138273688619,0.5160059288963282,0.9279611456029323,0.3411085599069922,0.7202689310338,0.7689861127304557,-0.00027187881675540634,0.78106006343096,0.9129072377227653,-0.564502112192063,-0.4159900601551367,-0.5174673083397173,-0.6979484303320581,-0.5334584835867197,-0.3115548159682586,-0.38765972510146113,0.2769266857919872,-0.237388667773731,0.9933080616536162,0.2944670191862635,-0.4825347365039299,0.13540717277964037,0.5272809495748373,0.504607501164291,0.8681152336973292,0.724010991897591,0.35550748099555274,0.524007977725223,0.09788428662126682,0.9083516993765542,0.8754210014438335,-0.18296973046204024,0.5575931694626457,-0.32451614218031444,0.8784582456286781,-0.4935485353565952,0.1842791665412234,0.0480559615694294,0.5941988128090832,0.9540702922583625,-0.5108132444467591,-0.10607140594857231,0.9977855915558517,-0.6459775182006275,-0.05891282779799904,0.265424300510704,0.05025504465326823,-0.2320401231414661,0.5025559808243523,0.7747768640070537,-0.4939004790995636,-0.12009453664380941,-0.026964428407291092,-0.9607890922778111,0.20158878546588355,0.9504920894855072,-0.9135445598098545,0.9583470064234662,0.06004106886298075,-0.7788771053691482,0.954390359708688,0.07548258051600416,0.37309090608090667,0.14259743764012944,-0.657566157822942,-0.5275213901335332,0.19457772615091615,-0.43546770162951876,0.21087280913608517,-0.2011057897268704,0.7831883591723973,-0.427604312744879,0.6464453595749134,-0.5811215656248117,0.9136409302649109,0.0873484201539435,-0.7365367069531636,0.6352356974808001,-0.41616675469170855,0.357896836442786,0.8867213525368904,0.27642629246986494,-0.3324209611671989,-0.6167642085694109,0.5197594779796341,-0.42373934775796057,0.21089100456127932,-0.7221428064817563,0.7985755336146426,0.5720925623123103,0.9884283227870005,0.4718561453782399,-0.6401539312312065,-0.007492190550700169,-0.1416229684907843,0.511021406381114,0.3662036667287933,-0.028565173442748722,0.9038872302308024,0.1070752671394627,0.7701223462267642,-0.83943993116616,0.30402401527827827,0.8786362918645393,-0.8042814373275147,0.3293522793635415,0.5705914762216199,0.8113688755902537,0.6824449696129413,-0.899107598875084,-0.2975956862461154,0.21169069664056758,0.2051498945795801,0.5069294267596568,-0.8458646773155548,0.7849471540044529,0.832785731572268,-0.012659551256453247,0.29001433088810386,-0.6742503258255826,-0.6056192777211996,-0.28883098340020535,0.6867140757130603,-0.9088416936085228,-0.6924955044129086,-0.2052736250250336,-0.43551408593931834,-0.9363477801878315,0.27633714001779347,0.5403796183015286,-0.7883211160194749,0.8339215235785954,-0.3794777057843383,0.8330262742875685,0.15886729243921024,-0.791711365761693,0.5911802735570584,0.6202720582051086,0.947468624263818,0.5025261987207734,0.6672919138521164,-0.5809240113281777,0.2940171875207373,0.08320082264410938,0.19872660344913806,-0.6505803755162427,0.44036568861571657,0.289293262936129,-0.75515503646161,0.8545137585393692,0.3668783943437172,0.42166989838052543,-0.07639277004781797,0.01674944903864548,0.09209870209924091,0.8942386128268698,0.8439268469988789,0.6157468676336781,-0.7576199561700918,-0.9079972500053202,0.7776924044002737,0.9108250195768567,0.5836300455938834,0.31068184208501887,-0.3219092306375405,0.3780758704786487,-0.19035462118987337,0.3363969998718834,0.8239828183757631,-0.9043184025842012,0.8063093358918747,-0.7737609320055315,-0.5491436849381012,0.38027032800179933,-0.568232164931225,0.8999100460971228,-0.09673787717809575,-0.4630981873043578,-0.7684847652571593,0.8413402173031922,-0.04129754434389979,-0.63687477355481,0.45758781954881533,-0.7667268429952712,-0.03590933133081948,0.9856380472037979,-0.015232880869213386,0.18938670116525044,0.84609907672457,0.4887475492093891,-0.5530130124342433,-0.9533275718617358,0.3656965280521408,-0.8440995776813303,-0.7309592784541779,-0.9068722884786301,-0.9656947665746234,0.335041080222352,0.3447620650150366,-0.06326345089351795,-0.14706743868971658,0.19987544807943738,0.019529152022122367,-0.006838915685098617,0.9612352343428828,0.2352369270092381,-0.9429484601260895,0.0656907800970371,-0.6542758125378407,-0.8002815963131552,-0.40492465052274706,0.622366663479297,-0.6192077018829208,-0.7519032395864552,0.42125806885778333,-0.11779000866485995,-0.5587217217521614,0.057679232020926556,0.24625284916646184,-0.8244841220897521,0.6586619570493063,0.4416329335598539,0.32246414210066576,0.7001980428495927,-0.5660139564943312,-0.5010144614034537,-0.6564732755482885,-0.8727217881627674,0.07334026778525293,0.7794124600831425,0.17662479271291376,0.7197619684086882,0.3605283721919776,-0.15378965563859942,0.6487163971293631,-0.7960155813011397,0.31521817010855446,-0.7145469006951529,-0.28409540975754144,-0.7096265747902031,-0.1305989683220144,-0.24636750194891707,-0.5727469669112595,0.00270351035488671,-0.3027101591615938,-0.3853346518723671,0.5831509069291883,0.16515714425507588,-0.3818831255542187,0.10430404606894723,0.9226364335466268,0.7463006405015065,-0.7820944352260377];
  this.h1[15].weights = [-0.5815730002555819,0.6905169800194266,-0.4499049973522098,-0.31989221924292277,-0.8788807104407348,-0.0011651149655218518,0.06436585671371642,-0.6179342800640217,-0.8236183152203516,0.5115304998034389,-0.8426588336163514,0.002770966956992971,-0.07979298217130223,-0.7919572371282505,-0.3327772119028432,0.7145914444858044,-0.13486554015353025,-0.30133238851032834,0.9609262606303223,0.01831705025988479,0.15795405897601306,-0.19728045838822153,0.5350769053009028,0.33267119330202805,0.4276625540983035,0.9510664439756474,-0.02531774474089629,0.6279449742800662,-0.761859343848928,0.5453906727835749,-0.07786942414089554,0.5611499726602992,-0.649470897686587,-0.13764976529183168,-0.3355407725070122,-0.171345405972114,-0.06540716454961856,0.425331620676847,-0.3776100683755089,-0.10526135438293843,0.07137275095909802,0.3499603952393264,0.7887281650514935,-0.33451552509458654,-0.04104996537981454,0.6105904730208964,0.4896245240128271,0.7019860578935363,-0.6831785614732399,-0.32519037979711196,-0.635608962570001,-0.7776991149759115,-0.04166154265283651,-0.5441406551162769,0.19085355517323682,0.12960452488067545,0.5806083626289649,-0.5593225034522176,-0.27356894429781464,0.6786255112917647,-0.716895894984102,-0.7884774413446314,0.43921483223590574,0.10903744294676043,0.2370897871961232,-0.7745345036427337,-0.7399113562265999,0.7299031383362653,-0.317489415436844,0.6718225869336835,-0.49260265209940457,0.3521444426315874,0.23988562669095473,0.7240957919076039,-0.5715416606942386,-0.8577720131991473,0.165880271012978,0.22806025043797765,-0.8414879809029581,0.007592770189910899,-0.9021198389824908,0.0922668274376434,-0.8286047791737196,0.9414688403015304,0.7792928154805593,-0.5930087252474457,-0.07688284928092544,0.5043270031904136,-0.8977939059674578,0.22457499983590143,0.17714130880412515,0.8544189422205013,0.8283144194814132,0.02808164588578994,0.4569880070704526,0.914045583764613,-0.034263600330908986,-0.35977882368646763,0.6664874091393701,0.8432708866582973,-0.553156945562214,-0.9433363114662923,0.1789770872479534,-0.2438869522642067,0.13614589422778942,0.6792744979828349,-0.10752952137815974,-0.10333919564964732,0.7572161153808926,0.9449734278313547,0.8040265833644815,0.3170398551118689,-0.8511407146412197,0.23237829628661485,-0.2347138544390154,-0.853411967977124,-0.8005144259584684,-0.15329031120304557,-1.0001110370249588,0.5206540977296709,-0.09309792046824138,0.09513380293700441,-0.4639382828024454,-0.6095015209113973,0.9764553213239776,-0.07366775455145615,0.8718110188755364,0.5954173048189197,-0.3458334386015279,0.6772417526822715,0.5505757910583151,0.47514035673391847,0.7384243747842789,0.03325300090097587,-0.08171623381806181,0.7704589610013199,0.44828712718847713,-0.2608055862490665,-0.26241007187731513,-0.8636430232406849,-0.6716998796452271,-0.08017374934539769,0.18218939347943602,-0.045270613684334104,-0.6185938982962701,-0.23403679764185562,0.592277712650371,-0.6286529603933908,-0.017878710122964898,0.10783405973558297,-0.7100970009847042,-0.02732557976063603,0.5634241679563732,-0.8482661751588754,-0.28244881411651085,-0.017468912087331413,0.8630587236370542,-0.1957784341249258,0.05530009244801067,-0.9488241619147804,-0.5966751847437607,-0.09791274406965536,-0.3126958925487132,0.6004207169293053,-0.9547891796268467,-0.2983006255417499,0.9273896735360063,0.3459614592802624,0.7150453369383835,-0.10853279042270216,0.057313606364351136,0.23040286650301026,-0.5547494715501021,-0.07511985736631621,0.09087541293264906,-0.02088500769770097,-0.940549991938134,0.481034254247,0.9373847125116002,-0.22458097840463903,0.3701204508232367,-0.7470346734214472,-0.9871481644961697,-0.5177129658838534,0.7495561120289909,-0.5154077792670809,0.006139659871962828,-0.8935858115260648,-0.6390197967808291,0.6117809135135739,0.8998870305121142,0.16595114978120493,0.3985643673598204,-0.6479084512444638,0.7594024958918809,-0.021997452889759152,0.40201933505230536,0.08486341309918045,0.8311792999884856,0.7624715428807312,-0.30464334160520845,-0.195011794206252,0.96136659781734,-0.5619460415970797,0.37530322340156713,0.7096762532206622,-0.4930177460246941,-0.4943564812644726,-0.7894120916383349,0.3086107527051157,0.8138363277732908,0.39281135911090476,0.18468023568366476,0.973795362614092,-0.13271957025632705,0.1043255869940713,-0.5629051415386797,0.9217898070903038,0.9886587237965053,-0.11674356382503483,-0.13666024826559914,-0.903939018209498,-0.7896096550941062,-0.8618325550382026,0.6512804199519825,0.3567965757091259,0.40368150857379753,-0.9121736918429815,0.6249944661420219,-0.6113563486383862,-0.20521397835457317,-0.7194665611480848,-0.8041380086867531,-0.9341215989821746,-0.36962362068416343,-0.14033950864852132,0.8434545628028146,-0.4872156221607838,-0.4645004862326566,0.843093329089877,0.3240971362619108,-0.5980126307785631,0.7810625795520673,-0.3122542199398183,0.8379483848937961,-0.029596518865546036,-0.2910281931654614,-0.1932346600627296,-0.515402229615503,0.2811906886977623,-0.30878598370899435,-0.7653189494446117,-0.06589886438722715,-0.19196605022832455,0.186778222201885,-0.7689972205974414,-0.3481596818896495,-0.46627495373280975,-0.8747009942060009,-0.16415225976484485,-0.5021674084566764,0.4250319986379407,0.24670597388658091,0.4736364894553605,-0.43269419241755946,-0.19526427969273724,0.3286742364978124,-0.5831563332994225,-0.6370212318180134,0.17690927969928683,0.3319969822153338,0.7807557597222163,-0.8274000133774948,-0.736720935382729,0.944165218441691,0.47623168317324327,-0.16156960739122062,0.6234355280692473,-0.2816645276111658,0.5640929797853026,-0.8212125080205188,0.5789462449661003,0.7851199429516988,0.6946507578469132,0.6387070687894238,0.7403960659855382,0.5796235677098174,-0.7581262516361003,-0.4823921303169047,0.34333765119713366,-0.6010967663775665,-0.038778918619349755,0.9562132055605825,0.7775750955661554,-0.2906254800974786,-0.6163741325523224,0.12203871233022778,0.27833663693025307,-0.7634369727568783,0.5896660455733181,-0.8203404384198215,-0.266182284986259,0.9030296148969904,0.6680350015075933,-0.31111522936204394,-0.22012138838335174,-0.7030811553590982,0.04464936680665644,-0.5980621553958152,0.9592947046950127,0.27848778022814996,-0.17277962409698003,0.33867088223595126,0.6087101653776994,-0.6219130702114707,-0.7793403809767936,-0.7596371590389714,0.6141710766300894,0.08335102198757148,0.06508750927960741,0.16860567645604663,-0.5558904720122387,0.4343638864773589,0.6138368630959495,0.7642485261506249,-0.17457747586932978,-0.16172354149049642,-0.1914110770283203,0.0032121327570584723,-0.9840742385428258,-0.4681306037859633,-0.9756748072861954,0.6353802665356788,0.9042004009145157,0.529226424307583,0.2441794960021557,-0.5659048041450053,-0.2748785890395567,0.5089482387752841,0.9315093600344269,-0.42322524377759124,0.9495587807889694,-0.5396715029730884,-0.028880066843030475,0.8495665915744635,-0.7474561615013163,0.38009180682056465,0.6551249605102983,0.8898103374546923,0.6402438017793829,-0.3307005395283792,-0.26035997092039453,-0.9941776936461297,0.1090426287709103,0.7182184349865687,0.6803319333940543,-0.24499430621298363,-0.9713718221194994,0.46510361060534533,-0.8665504899880241,0.7025286204986356,-0.8886677362500253,0.869381237019771,-0.5041630578762942,-0.5299001055514783,-0.21445713737443386,-0.38183916540911184,-0.7047648996631596,-0.9161213562145423,0.036551211780951866,-0.5479684677759871,-0.40320436394086867,-0.04745333623715292,-0.7239494254180188,0.8112188512081226,-0.6536617248815186,-0.7362424591029668,0.608322321312023,-0.33733094758780047,0.3585968735518538,0.408886859942925,-0.3912610203320072,0.3839734349568755,-0.49611703511725685,-0.5956470620888576,0.7002869153412123,-0.5819886029793424,0.04439649875296103,-0.8052244998923181,-0.18396974615716344,-0.28899737109962986,-0.3850008269878784,0.7198036126391553,-0.5046887532554252,0.3243986253701868,0.38583666659652155,0.22306285719140323,-0.8866119105860408,0.16694136997386474,0.13470873511757644,-0.9826414419583465,0.5928690865845088,-0.3847206258583354,0.5660587052087188,-0.11325490463483756,-0.8243817508595149,0.04619448041043831,0.1403857510408931,-0.7198495995074854,0.41874245257272064,-0.9066872100911487,-0.037162634621956604,-0.8241458439416307,0.363465492252643,0.8035361821097621,0.4234464484639782,0.993109230900854,0.938580979218179,-0.9753610111310125,-0.09307100368266262,0.5021860092278467,0.15620122290444804,0.7996105831173054,-0.7259022820370299,-0.6303594380922648,-0.6973761988613678,-0.051302465769952656,-0.6362043632612717,-0.8060667467452668,0.5075562174595771,-0.019010280910631307,0.5157655970748707,-0.551407497820446,0.09576987463887447,-0.7553365055368836,0.5016352415734902,0.7353608094479835,-0.8940925891014109,-0.4926701934040735,0.7584735628757282,0.31434298308758857,0.1801225840763525,-0.5034847252539683,-0.7897365815800219,-0.5612597192646276,0.717328065134037,0.7167256402466426,0.9542155212819585,0.2033782946489453,-0.6324802197361398,0.8383597711039028,0.9948973631963708,0.7337068067769035,0.8263844724881506,-0.7971630748848483,0.2836098759019965,0.14642028536954785,-0.7353866961140197,-0.903023421476377,-0.8333890488960554,0.05464026145657259,0.28620465197004585,-0.8763854996753385,0.9652963416199956,0.2997764161586852,0.33878234670420276,0.02828062983349819,-0.2762430850938098,0.8437454522449289,0.9600049737643104,-0.4224066234701851,0.296697872202083,0.723363136964286,0.2896860295848113,0.31578599553429126,0.02457330710510534,0.6339939610170139,-0.9131576885590192,-0.56858496164216,0.2880265239731583,0.37231820933022586,-0.8078467369395472,0.1766470390552797,-0.5246019596120096,-0.9229814279426359,-0.5560224866488458,-0.006823081785940469,-0.22591747249207902,0.6124684318963186,0.7488286926727361,-0.9750489778064023,-0.6222226077659322,-0.6838830535275039,0.8723280431807998,-0.3164266346246877,0.09708216443863041,0.14889482834110304,0.0177250742864993,0.20474397949365056,-0.47342858117889913,-0.844935101701892,-0.6994180925496448,0.9614549358904559,0.5195191395779574,-0.9431876570766258,0.649026150101482,0.4624838928021401,-0.17009135513821927,-0.3501896806611192,0.06080497409634558,0.5738262406857583,0.7475352287018812,-0.5388977017276008,0.48765231292686195,-0.48376568126178243,0.8493837136562852,-0.5061617018198598,0.6663255003202179,0.962810140859388,-0.5748492070118202,-0.9499194029037845,0.6023394523438252,-0.23144064679798534,-0.6595280297789227,0.28923181520914676,0.5449026305150759,0.2813049504915916,-0.6660012452514442,0.6574991790813828,0.6716920928889761,0.5469113471042298,0.9884423329936011,0.47743021315308515,-0.9281156103170951,-0.6837698081172648,0.7456610754527792,0.5875050475954641,0.2730653175422514,0.07954126485910713,0.16580993501117386,0.6655404858340159,-0.2502428754415225,0.6888920993941713,0.9939746945201271,0.33212233691610077,-0.2529775184123762,0.06808908949385747,-0.14782873569632698,-0.9858669220497962,-0.34095299929669787,-0.7383565113953815,-0.9809854157651727,-0.7379049140041285,-0.8271201930322603,-0.24516938635010202,0.28456560920419466,0.286491408225461,0.6054545638400011,0.5754367855199665,-0.3293761083339293,-0.3618186375976432,-0.17076690735449018,0.9401059654655625,-0.0028157220699837576,-0.6761435654059793,0.021939877599304998,-0.34182240582020373,0.18928624963446547,-0.22169270657734583,-0.29904006267877326,0.5843466683288967,-0.37456325665313417,0.033692749304030295,-0.8313556244880077,0.7043822254613916,-0.3432314072806735,0.5810413085266268,0.2001402117892234,-0.22833882546843826,0.6067766481658191,-0.7115308977517475,-0.1594729737131055,-0.7393496519655408,-0.07488218490748037,-0.6575923609006489,-0.6843660183029113,-0.32664597199193096,0.3660031061211551,0.8208530970498258,0.902985519263828,-0.9810794113757771,0.20634859463370434,0.41103347469351553,0.5377599091356333,-0.9028267404104248,0.5334355729357674,0.16786925829195365,0.5014260471466635,-0.5865774398263612,-0.10984558750013627,0.8362113485513392,0.7386451577822909,0.7872428171254319,-0.6942650927769483,-0.03663423123534216,-0.10705141687240113,-0.7716058615968048,0.5919729326076457,-0.37190031398774337,0.23121694068998225,0.8254342555600379,-0.674064369370398,0.4449055445196415,0.4767290672211297,0.6144104154543298,0.3327502263789379,0.03173102612033862,0.11023175038408238,-0.06784106341223911,-0.17301023064804422,0.3972101146079489,-0.20680575442314633,0.533202020588397,-0.32843999854763883,-0.45858123562358666,0.8626601842410193,0.4080931330670583,0.3166900013612801,0.5443412071035336,0.4406480154048889,-0.3842548940062384,0.027047766047906888,0.5086526040568503,0.3770778522561967,-0.2787374054740858,-0.974310602023796,-0.28543754509891206,0.14854863179223657,-0.9697718325584116,-0.13965789414567947,-0.2755449493364185,0.32156959933224655,-0.12529861162514652,0.006149088288486916,-0.056484510801464806,0.46022245124946565,-0.08847755048537244,0.44837591384259173,-0.38679536595826325,0.9765757810275165,-0.5293990657033073,0.8676336492805266,0.3172338451184467,0.8572788373461468,0.7743435231465514,-0.48698273205102655,-0.35357687923824926,0.8696008317783723,-0.5324106459180215,0.6801514205899756,0.9250386484749207,0.904374447771079,-0.08645973800415857,0.16648991791300913,-0.7094200484165939,0.5201672135346078,0.0016400369759869326,-0.12302718806270481,0.11095035408412104,0.25576533411138136,-0.016323584082369835,0.6843292974517373,-0.9480526854037981,-0.43376389731666376,-0.6378266538722285,0.3604468187596003,0.4909423260765885,-0.9516762764531774,0.4592300248885651,0.7193093952829845,0.6765774035861509,-0.1481076224023999,-0.3652538542441989,-0.05432661292327217,-0.7263471527890081,0.6916690409215975,-0.40178187460945197,-0.9372594754463524,0.7424452294265903,0.7827398588521582,-0.32153062839336694,-0.025125786558128596,0.16788897208775602,0.02909553744199958,0.01252484992055231,-0.92990286648711,0.0790113576306535,-0.7562313668423566,-0.02085100308712183,-0.5252472680890571,-0.29600825794364677,0.4577006366493301,0.6672695159510443,-0.9852221841089327,0.32568159986949946,0.18656736384395417,-0.2305312760034134,-0.9440257042375628,0.6581064341179328,0.8391650735997742,-0.42851413212784784,0.35013442085818874,0.8089933342887669,0.8917574255385486,-0.5010240380783175,0.24527412908848006,0.13609366599444742,-0.16154012324418685,-0.05480450179376544,0.633782228193054,0.3293813584337632,-0.9125175916236854,-0.844212736818748,-0.5765040456673683,0.39476656563017387,0.2175634936764418,-0.7419527676599535,-0.7090445509593711,-0.47816893405587285,-0.5602654002980489,0.8338656659518047,0.7776079322368293,-0.42683153765378823,0.8744162579008379,-0.4556878140145606,-0.07773597876845939,-0.8331440932486047,-0.6928005503498692,0.7662706911187469,0.6394694570868277,0.8525639326518187,0.8549370013327777,0.4201797710411527,0.8761127146376042,-0.8677919343660981,0.09110375591274164,0.8742681954896366,0.19054390014872363,0.13785491859251303,0.8952370461132833,-0.2581752626255625,-0.6780648843026232,-0.4482287316221762,-0.09433956998433049,0.7721497690972502,-0.1884817190060495,-0.3275513694773747,0.9731511980539412,-0.6498185897860893,-0.5361053133791637,0.4120814988344976,0.7454574729952713,-0.31262487787222737,-0.5531380993446202,-0.29483988560473495,0.44670391194874326,-0.8508294435529764,-0.29713027186699953];
  this.o1.weights = [0.0036776854821428465,0.0029236606122556284,0.0004830277745050582,0.004994620293802808,-0.001733050981943922,-0.0017823010309724096,0.002134719731999892,0.004666045019269224,-0.0006343615024259177,0.0029904309575152135,-0.002270668824457165,-0.000448483534263514,0.005501701177739171,0.0015790524475622564,-0.0035538379891377047,-0.00027378477248787814];
  
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
//{{{  .evaluate

var MOB_NIS = IS_NBRQKE;
var MOB_BIS = IS_NBRQKE;
var MOB_RIS = IS_RQKE;
var MOB_QIS = IS_QKE;

var ATT_L = 7;

lozBoard.prototype.evaluate = function (turn) {

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
  
  e = myround(e) | 0;
  n = myround(n) | 0;
  
  //}}}
  //{{{  verbose
  
  if (this.verbose) {
    uci.send('info string','net eval =',n);
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

  //for (var i=0; i < NETH1SIZE; i++)
    //console.log(this.h1[i].sum, Math.max(0,this.h1[i].sum));
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

