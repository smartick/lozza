
var VERSION = '1.2';

//{{{  readme
/*

  Lozza - a simple javascript UCI chess engine.

  email:     colin@sailwave.com
  twitter:   @op12no2
  more info: http://op12no2.me/posts/1641

*/

//}}}
//{{{  history
/*

21/07/14 v1.2

21/07/14 Point nodes at board so global lookup not needed.
21/07/14 Add piece lists.

16/07/14 v1.1

20/07/14 50 move draw rule.
17/07/14 Add K+B|N v K+B|N as insufficient material in eval.

16/07/14 v1.0

16/07/14 Only reset TT on UCINEWGAME command.  Seems to work OK at last.

16/07/14 v0.9

16/07/14 Encode mate scores for UI.
16/07/14 Use separate PSTs for move ordering.

19/06/14 v0.8

30/06/14 use simple arrays for piece counts and add colour counts.
30/06/14 Split runningEval into runningEvalS and runningEval E and combine in evaluate();
30/06/14 Inline various functions.

19/06/14 v0.7

27/06/14 Fix repetition detection at last.

19/06/14 v0.6

26/06/14 Base LMR on the move base.
26/06/14 Just use > alpha for LMR research.
26/06/14 Fix hash update bugs.
26/06/14 move mate distance and rep check tests to pre horizon.
26/06/14 Only extend at root and if depth below horizon.
26/06/14 Remove lone king stuff.

19/06/14 v0.5

24/06/14 Mate distance pruning.
24/06/14 No LMR if lone king.

19/06/14 v0.4

21/06/14 No null move if a lone king on the board.
21/06/14 Add detection of insufficient material draws.
21/06/14 Add very primitive king safety to eval.
21/06/14 Change pCounts into wCount and bCount.
19/06/14 Set contempt to 0.
19/06/14 Fix fail soft QS bug on beta cut.

28/05/14 v0.3

06/06/14 Facilitate N messages in one UCI message string.
28/05/14 Fix bug where search() and alphabeta() returned -INFINITY instead of oAlpha.
28/05/14 Adjust MATE score in TT etc.

28/05/14 v0.2

24/05/14 Allow futility to filter all moves and return oAlpha in that case.
24/05/14 Fix infinite loops when showing PV.
24/05/14 Fix mate killer addition condition.
24/05/14 Generalise bishop counting using board.pCounts.
24/05/14 Don't allow a killer to be the (current) hash.
24/05/14 Don't research ALL node LMR fails unless R is set!
24/05/14 Arrange things so that QS doesn't use or affect node killers/hashes etc.  In tests it's less nodes.
23/05/14 Increase asp window and add time on ID research.
23/05/14 Add crude bishop pair bonus imp.  NB: updating a piece count array using a[i]++ and a[i]-- was too slow!!
23/05/14 Use tapered PSTs.

23/05/14 v0.1

23/05/14 Fix bug in QS.  It *must not* fail soft.

*/

//}}}
//{{{  constants

var MAX_PLY   = 100;                // limited by lozza.board.ttDepth bits.
var MAX_MOVES = 220;
var INFINITY  = 30000;              // limited by lozza.board.ttScore bits.
var MATE      = 20000;
var MINMATE   = MATE - 2*MAX_PLY;
var CONTEMPT  = 0;

var WHITE = 0x0;                    // toggle these with:        ~turn & COLOR_MASK
var BLACK = 0x8;                    // get +/- 1 (W/B) with:     (-turn >> 31) | 1
                                    // get 0/1 (W/B) index with: turn >>> 3
var PIECE_MASK = 0x7;
var COLOR_MASK = 0x8;

var TT_EMPTY  = 0;
var TT_EXACT  = 1;
var TT_BETA   = 2;
var TT_ALPHA  = 3;

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
var KEEPER_MASK        = MOVE_CASTLE_MASK | MOVE_PROMOTE_MASK | MOVE_EPTAKE_MASK | MOVE_TOOBJ_MASK;  // futility.

var NULL   = 0x0;
var PAWN   = 0x1;
var KNIGHT = 0x2;
var BISHOP = 0x3;
var ROOK   = 0x4;
var QUEEN  = 0x5;
var KING   = 0x6;
var EDGE   = 0x7;
var NO_Z   = 0x8;

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

var PPHASE = 0;
var NPHASE = 1;
var BPHASE = 1;
var RPHASE = 2;
var QPHASE = 4;
var VPHASE = [0,PPHASE,NPHASE,BPHASE,RPHASE,QPHASE,0];
var TPHASE = PPHASE*16 + NPHASE*4 + BPHASE*4 + RPHASE*4 + QPHASE*2;
var EPHASE = 180;

var A1 = 110;
var B1 = 111;
var C1 = 112;
var D1 = 113;
var E1 = 114;
var F1 = 115;
var G1 = 116;
var H1 = 117;

var A8 = 26;
var B8 = 27;
var C8 = 28;
var D8 = 29;
var E8 = 30;
var F8 = 31;
var G8 = 32;
var H8 = 33;

var MOVE_E1G1 = MOVE_CASTLE_MASK | (W_KING << MOVE_FROBJ_BITS) | (E1 << MOVE_FR_BITS) | G1;
var MOVE_E1C1 = MOVE_CASTLE_MASK | (W_KING << MOVE_FROBJ_BITS) | (E1 << MOVE_FR_BITS) | C1;
var MOVE_E8G8 = MOVE_CASTLE_MASK | (B_KING << MOVE_FROBJ_BITS) | (E8 << MOVE_FR_BITS) | G8;
var MOVE_E8C8 = MOVE_CASTLE_MASK | (B_KING << MOVE_FROBJ_BITS) | (E8 << MOVE_FR_BITS) | C8;

var WHITE_RIGHTS_KING  = 0x00000001;
var WHITE_RIGHTS_QUEEN = 0x00000002;
var BLACK_RIGHTS_KING  = 0x00000004;
var BLACK_RIGHTS_QUEEN = 0x00000008;
var WHITE_RIGHTS       = WHITE_RIGHTS_QUEEN | WHITE_RIGHTS_KING;
var BLACK_RIGHTS       = BLACK_RIGHTS_QUEEN | BLACK_RIGHTS_KING;
var ALL_RIGHTS         = BLACK_RIGHTS | WHITE_RIGHTS;

var WP_OFFSET_ORTH  = -12;
var WP_OFFSET_DIAG1 = -13;
var WP_OFFSET_DIAG2 = -11;

var BP_OFFSET_ORTH  = 12;
var BP_OFFSET_DIAG1 = 13;
var BP_OFFSET_DIAG2 = 11;

var KNIGHT_OFFSETS  = [25,-25,23,-23,14,-14,10,-10];
var BISHOP_OFFSETS  = [11,-11,13,-13];
var ROOK_OFFSETS    =               [1,-1,12,-12];
var QUEEN_OFFSETS   = [11,-11,13,-13,1,-1,12,-12]; // must be diag then orth - see isAttacked.
var KING_OFFSETS    = [11,-11,13,-13,1,-1,12,-12];

var OFFSETS = [0,0,KNIGHT_OFFSETS,BISHOP_OFFSETS,ROOK_OFFSETS,QUEEN_OFFSETS,KING_OFFSETS];
var LIMITS  = [0,1,1,8,8,8,1];

//
// PSTs based on http://chessprogramming.wikispaces.com/Simplified+evaluation+function
//

var VALUE_PAWN   = 100;
var VALUE_QUEEN  = 975;
var VALUE_VECTOR = [0,VALUE_PAWN,325,325,500,VALUE_QUEEN,10000];
var RANK_VECTOR  = [0,1,         2,  2,  4,  5,          6];  // for move sorting.

var NULL_PST =     [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
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

var WPAWN_PST =    [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,  50,  50,  50,  50,  50,  50,  50,  50,   0,   0,
                    0,   0,  10,  10,  20,  30,  30,  20,  10,  10,   0,   0,
                    0,   0,   5,   5,  10,  25,  25,  10,   5,   5,   0,   0,
                    0,   0,   0,   0,   0,  20,  20,   0,   0,   0,   0,   0,
                    0,   0,   5,  -5, -10,   0,   0, -10,  -5,   5,   0,   0,
                    0,   0,   5,  10,  10, -20, -20,  10,  10,   5,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

var WPAWN_PST2 =   [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,  80,  80,  80,  80,  80,  80,  80,  80,   0,   0,
                    0,   0,  60,  60,  60,  60,  60,  60,  60,  60,   0,   0,
                    0,   0,  40,  40,  40,  40,  40,  40,  40,  40,   0,   0,
                    0,   0,  20,  20,  20,  20,  20,  20,  20,  20,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0, -20, -20, -20, -20, -20, -20, -20, -20,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

var WKNIGHT_PST =  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0, -50, -40, -30, -30, -30, -30, -40, -50,   0,   0,
                    0,   0, -40, -20,   0,   0,   0,   0,  20, -40,   0,   0,
                    0,   0, -30,   0,  10,  15,  15,  10,   0, -30,   0,   0,
                    0,   0, -30,   5,  15,  20,  20,  15,   5, -30,   0,   0,
                    0,   0, -30,   0,  15,  20,  20,  15,   0, -30,   0,   0,
                    0,   0, -30,   5,  10,  15,  15,  10,   5, -30,   0,   0,
                    0,   0, -40, -20,   0,   5,   5,   0, -20, -40,   0,   0,
                    0,   0, -50, -40, -30, -30, -30, -30, -40, -50,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

var WBISHOP_PST =  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0, -20, -10, -10, -10, -10, -10, -10, -20,   0,   0,
                    0,   0, -10,   0,   0,   0,   0,   0,   0, -10,   0,   0,
                    0,   0, -10,   0,   5,  10,  10,   5,   0, -10,   0,   0,
                    0,   0, -10,   5,   5,  10,  10,   5,   5, -10,   0,   0,
                    0,   0, -10,   0,  10,  10,  10,  10,   0, -10,   0,   0,
                    0,   0, -10,  10,  10,  10,  10,  10,  10, -10,   0,   0,
                    0,   0, -10,   5,   0,   0,   0,   0,   5, -10,   0,   0,
                    0,   0, -20, -10, -10, -10, -10, -10, -10, -20,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

var WROOK_PST =    [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   5,  10,  10,  10,  10,  10,  10,   5,   0,   0,
                    0,   0,  -5,   0,   0,   0,   0,   0,   0,  -5,   0,   0,
                    0,   0,  -5,   0,   0,   0,   0,   0,   0,  -5,   0,   0,
                    0,   0,  -5,   0,   0,   0,   0,   0,   0,  -5,   0,   0,
                    0,   0,  -5,   0,   0,   0,   0,   0,   0,  -5,   0,   0,
                    0,   0,  -5,   0,   0,   0,   0,   0,   0,  -5,   0,   0,
                    0,   0,   0,   0,   0,   5,   5,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

var WQUEEN_PST =   [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0, -20, -10, -10,  -5,  -5, -10, -10, -20,   0,   0,
                    0,   0, -10,   0,   0,   0,   0,   0,   0, -10,   0,   0,
                    0,   0, -10,   0,   5,   5,   5,   5,   0, -10,   0,   0,
                    0,   0,  -5,   0,   5,   5,   5,   5,   0,  -5,   0,   0,
                    0,   0,   0,   0,   5,   5,   5,   5,   0,  -5,   0,   0,
                    0,   0, -10,   5,   5,   5,   5,   5,   0, -10,   0,   0,
                    0,   0, -10,   0,   5,   0,   0,   0,   0, -10,   0,   0,
                    0,   0, -20, -10, -10,  -5,  -5, -10, -10, -20,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

var WKING_PST =    [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0, -30, -40, -40, -50, -50, -40, -40, -30,   0,   0,
                    0,   0, -30, -40, -40, -50, -50, -40, -40, -30,   0,   0,
                    0,   0, -30, -40, -40, -50, -50, -40, -40, -30,   0,   0,
                    0,   0, -30, -40, -40, -50, -50, -40, -40, -30,   0,   0,
                    0,   0, -20, -30, -30, -40, -40, -30, -30, -20,   0,   0,
                    0,   0, -10, -20, -20, -20, -20, -20, -20, -10,   0,   0,
                    0,   0,  20,  20,   0,   0,   0,   0,  20,  20,   0,   0,
                    0,   0,  20,  30,  10,   0,   0,  10,  30,  20,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

var WKING_PST2 =   [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0, -50, -40, -30, -20, -20, -30, -40, -50,   0,   0,
                    0,   0, -30, -20, -10,   0,   0, -10, -20, -30,   0,   0,
                    0,   0, -30, -10,  20,  30,  30,  20, -10, -30,   0,   0,
                    0,   0, -30, -10,  30,  40,  40,  30, -10, -30,   0,   0,
                    0,   0, -30, -10,  30,  40,  40,  30, -10, -30,   0,   0,
                    0,   0, -30, -10,  20,  30,  30,  20, -10, -30,   0,   0,
                    0,   0, -30, -30,   0,   0,   0,   0, -30, -30,   0,   0,
                    0,   0, -50, -30, -30, -30, -30, -30, -30, -50,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];

function _pst2Black (from,to) {
  for (var i=0; i < 12; i++) {
    var frbase = i*12;
    var tobase = (11-i)*12;
    for (var j=0; j < 12; j++)
      to[tobase+j] = from[frbase+j];
  }
}

var BPAWN_PST   = Array(144);
var BPAWN_PST2  = Array(144);
var BKNIGHT_PST = Array(144);
var BBISHOP_PST = Array(144);
var BROOK_PST   = Array(144);
var BQUEEN_PST  = Array(144);
var BKING_PST   = Array(144);
var BKING_PST2  = Array(144);

_pst2Black(WPAWN_PST,   BPAWN_PST);
_pst2Black(WPAWN_PST2,  BPAWN_PST2);
_pst2Black(WKNIGHT_PST, BKNIGHT_PST);
_pst2Black(WBISHOP_PST, BBISHOP_PST);
_pst2Black(WROOK_PST,   BROOK_PST);
_pst2Black(WQUEEN_PST,  BQUEEN_PST);
_pst2Black(WKING_PST,   BKING_PST);
_pst2Black(WKING_PST2,  BKING_PST2);

var WS_PST = [NULL_PST, WPAWN_PST,   WKNIGHT_PST, WBISHOP_PST, WROOK_PST, WQUEEN_PST, WKING_PST];  // opening eval.
var WE_PST = [NULL_PST, WPAWN_PST2,  WKNIGHT_PST, WBISHOP_PST, WROOK_PST, WQUEEN_PST, WKING_PST2]; // end game eval.
var WM_PST = [NULL_PST, WPAWN_PST,   WKNIGHT_PST, WBISHOP_PST, WROOK_PST, WQUEEN_PST, WKING_PST2]; // move ordering.

var BS_PST = [NULL_PST, BPAWN_PST,   BKNIGHT_PST, BBISHOP_PST, BROOK_PST, BQUEEN_PST, BKING_PST];
var BE_PST = [NULL_PST, BPAWN_PST2,  BKNIGHT_PST, BBISHOP_PST, BROOK_PST, BQUEEN_PST, BKING_PST2];
var BM_PST = [NULL_PST, BPAWN_PST,   BKNIGHT_PST, BBISHOP_PST, BROOK_PST, BQUEEN_PST, BKING_PST2];

var B88 = [26, 27, 28, 29, 30, 31, 32, 33,
           38, 39, 40, 41, 42, 43, 44, 45,
           50, 51, 52, 53, 54, 55, 56, 57,
           62, 63, 64, 65, 66, 67, 68, 69,
           74, 75, 76, 77, 78, 79, 80, 81,
           86, 87, 88, 89, 90, 91, 92, 93,
           98, 99, 100,101,102,103,104,105,
           110,111,112,113,114,115,116,117];

var COORDS = ['??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??',
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

var NAMES = ['-','P','N','B','R','Q','K','-'];

var RANK = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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

var FILE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
  this.test  = new lozTest();

  this.pos = {};

  this.rootNode = this.nodes[0];

  for (var i=0; i < this.nodes.length; i++)
    this.nodes[i].board = this.board;

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
//{{{  .position

lozChess.prototype.position = function (pos) {

  this.pos = pos;
  this.initFromPosition();
}

//}}}
//{{{  .initFromPosition

lozChess.prototype.initFromPosition = function () {

  this.init();

  var board = this.board;

  board.id = this.pos.id;

  //{{{  board turn
  
  if (this.pos.turn == 'w')
    board.turn = WHITE;
  
  else {
    board.turn = BLACK;
    board.loHash ^= board.loTurn;
    board.hiHash ^= board.hiTurn;
  }
  
  //}}}
  //{{{  board rights
  
  board.rights = 0;
  
  for (var i=0; i < this.pos.rights.length; i++) {
  
    var ch = this.pos.rights.charAt(i);
  
    if (ch == 'K') board.rights |= WHITE_RIGHTS_KING;
    if (ch == 'Q') board.rights |= WHITE_RIGHTS_QUEEN;
    if (ch == 'k') board.rights |= BLACK_RIGHTS_KING;
    if (ch == 'q') board.rights |= BLACK_RIGHTS_QUEEN;
  }
  
  board.loHash ^= board.loRights[board.rights & ALL_RIGHTS];
  board.hiHash ^= board.hiRights[board.rights & ALL_RIGHTS];
  
  //}}}
  //{{{  board board
  
  board.phase = TPHASE;
  
  var sq = 0;
  var nw = 0;
  var nb = 0;
  
  for (var j=0; j < this.pos.board.length; j++) {
  
    var ch  = this.pos.board.charAt(j);
    var chn = parseInt(ch);
  
    while (board.b[sq] == EDGE)
      sq++;
  
    if (isNaN(chn)) {
  
      if (ch != '/') {
  
        var obj   = MAP[ch];
        var piece = obj & PIECE_MASK;
        var col   = obj & COLOR_MASK;
  
        if (col == WHITE) {
          board.wList[nw] = sq;
          board.b[sq]     = obj;
          board.z[sq]     = nw;
          nw++;
          board.wCounts[piece]++;
          board.wCount++;
        }
  
        else {
          board.bList[nb] = sq;
          board.b[sq]     = obj;
          board.z[sq]     = nb;
          nb++;
          board.bCounts[piece]++;
          board.bCount++;
        }
  
        board.loHash ^= board.loPieces[col>>>3][piece-1][sq];
        board.hiHash ^= board.hiPieces[col>>>3][piece-1][sq];
  
        board.phase -= VPHASE[piece];
  
        sq++;
      }
    }
  
    else {
  
      for (var k=0; k < chn; k++) {
        board.b[sq] = NULL;
        sq++;
      }
    }
  }
  
  
  //}}}
  //{{{  board ep
  
  if (this.pos.ep.length == 2)
    board.ep = COORDS.indexOf(this.pos.ep)
  else
    board.ep = 0;
  
  board.loHash ^= board.loEP[board.ep];
  board.hiHash ^= board.hiEP[board.ep];
  
  //}}}

  //{{{  init running evals
  
  board.runningEvalS = 0;
  board.runningEvalE = 0;
  
  var next  = 0;
  var count = 0;
  
  while (count < board.wCount) {
  
    sq = board.wList[next];
  
    if (!sq) {
      next++;
      continue;
    }
  
    var piece = board.b[sq] & PIECE_MASK;
  
    board.runningEvalS += VALUE_VECTOR[piece];
    board.runningEvalS += WS_PST[piece][sq];
    board.runningEvalE += VALUE_VECTOR[piece];
    board.runningEvalE += WE_PST[piece][sq];
  
    count++;
    next++
  }
  
  var next  = 0;
  var count = 0;
  
  while (count < board.bCount) {
  
    sq = board.bList[next];
  
    if (!sq) {
      next++;
      continue;
    }
  
    var piece = board.b[sq] & PIECE_MASK;
  
    board.runningEvalS -= VALUE_VECTOR[piece];
    board.runningEvalS -= BS_PST[piece][sq];
    board.runningEvalE -= VALUE_VECTOR[piece];
    board.runningEvalE -= BE_PST[piece][sq];
  
    count++;
    next++
  }
  
  
  //}}}

  for (var i=0; i < this.pos.moves.length; i++) {
    this.playMove(this.pos.moves[i], board.turn);
    board.turn = ~board.turn & COLOR_MASK;
  }

  //{{{  compact white list
  
  var v = [];
  
  for (var i=0; i<16; i++) {
    if (board.wList[i])
      v.push(board.wList[i]);
  }
  
  v.sort(function(a,b) {
    return lozza.board.b[b] - lozza.board.b[a];
  });
  
  for (var i=0; i<16; i++) {
    if (i < v.length) {
      board.wList[i] = v[i];
      board.z[v[i]]  = i;
    }
    else
      board.wList[i] = 0;
  }
  
  /*
  console.log('WHITE LIST ' + v.length);
  for (var i=0; i<board.wCount; i++) {
    console.log(board.b[board.wList[i]]);
  }
  */
  
  if (board.b[board.wList[0]] != W_KING)
    console.log('WHITE INDEX ERR');
  
  //}}}
  //{{{  compact black list
  
  var v = [];
  
  for (var i=0; i<16; i++) {
    if (board.bList[i])
      v.push(board.bList[i]);
  }
  
  v.sort(function(a,b) {
    return lozza.board.b[b] - lozza.board.b[a];
  });
  
  for (var i=0; i<16; i++) {
    if (i < v.length) {
      board.bList[i] = v[i];
      board.z[v[i]]  = i;
    }
    else
      board.bList[i] = 0;
  }
  
  /*
  console.log('BLACK LIST ' + v.length);
  for (var i=0; i<board.bCount; i++) {
    console.log(board.b[board.bList[i]]);
  }
  */
  
  if (board.b[board.bList[0]] != B_KING)
    console.log('BLACK INDEX ERR');
  
  //}}}
}

//}}}
//{{{  .id

lozChess.prototype.id = function (id) {

  this.board.id = id;
}

//}}}
//{{{  .go

var ASP_MAX   = 75;
var ASP_DELTA = 3;
var ASP_MIN   = 10;

lozChess.prototype.go = function(spec) {

  var board = this.board;

  //{{{  sort out spec
  
  if (spec.depth <= 0)
    spec.depth = MAX_PLY;
  
  if (spec.moveTime > 0)
    this.stats.moveTime = spec.moveTime;
  
  if (spec.maxNodes > 0)
    this.stats.maxNodes = spec.maxNodes;
  
  if (spec.moveTime == 0) {
  
    if (spec.movesToGo > 0)
      var movesToGo = spec.movesToGo + 3;  //buffer
    else
      var movesToGo = 20;                  //hack - can do better then this based on game stage
  
    if (board.turn == WHITE) {
      var remTime = spec.wTime + movesToGo * spec.wInc;
    }
    else {
      var remTime = spec.bTime + movesToGo * spec.bInc;
    }
  
    if (remTime > 0)
      this.stats.moveTime = Math.round(remTime / movesToGo);
  }
  
  //}}}

  var alpha       = -INFINITY;
  var beta        = INFINITY;
  var asp         = ASP_MAX;
  var ply         = 1;
  var maxPly      = spec.depth;
  var move        = 0;
  var bestMove    = 0;
  var bestMoveStr = '';
  var score       = 0;

  while (ply <= maxPly) {

    this.stats.ply = ply;

    score = this.search(this.rootNode, ply, board.turn, alpha, beta);

    move = board.ttGetMove(this.rootNode);
    if (move)
      bestMove = move;

    if (this.stats.timeOut) {
      break;
    }

    if (score <= alpha || score >= beta) {
      //{{{  research
      
      this.uci.debug(board.id,'asp win research depth', ply, 'alpha', alpha, 'score', score, 'beta', beta);
      
      alpha = -INFINITY;
      beta  = INFINITY;
      asp   = ASP_MAX * 10;          //  don't do shrinking any more.
      
      if (this.stats.moveTime)
        this.stats.moveTime += 250;  // add some time because of the research.
      
      continue;
      
      //}}}
    }

    if (score >= MINMATE && score <= MATE) {
      break;
    }

    alpha = score - asp;
    beta  = score + asp;

    asp -= ASP_DELTA;       //  shrink the window.
    if (asp < ASP_MIN)
      asp = ASP_MIN;

    ply += 1;

    this.stats.update();
  }

  //{{{  show dev logs
  
  board.evaluate(board.turn);
  
  this.uci.debug (board.id,'depth',ply,'PHASE',board.gPhase);
  
  //}}}

  this.stats.update();
  this.stats.stop();

  bestMoveStr = board.formatMove(bestMove);

  this.uci.send('bestmove',bestMoveStr);

  this.uci.debug(board.id,'|',spec.depth,'ply','|',this.stats.nodesMega,'Mn','|',this.stats.timeSec,'sec','|',bestMoveStr);
  this.uci.debug('');
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

  this.stats.nodes++;

  var board          = this.board;
  var nextTurn       = ~turn & COLOR_MASK;
  var oAlpha         = alpha;
  var numLegalMoves  = 0;
  var move           = 0;
  var bestMove       = 0;
  var score          = 0;
  var bestScore      = -INFINITY;
  var inCheck        = board.isKingAttacked(nextTurn);
  var R              = 0;
  var givesCheck     = 0;
  var alphaMate      = (alpha <= -MINMATE && alpha >= -MATE) || (alpha >= MINMATE && alpha <= MATE);
  var betaMate       = (beta  <= -MINMATE && beta  >= -MATE) || (beta  >= MINMATE && beta  <= MATE);
  var lmrs           = 0;

  depth = (inCheck) ? depth + 1 : depth;

  var doLMR = depth >= 3 && !inCheck && !betaMate;

  node.cache();

  board.ttGet(node, depth, alpha, beta);  // load hash move.

  board.genMoves(node, turn);

  while (move = node.getNextMove()) {

    board.makeMove(node,move);

    //{{{  legal?
    
    if (move != node.hashMove && board.isKingAttacked(nextTurn)) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    numLegalMoves++;

    //{{{  send current move to UCI
    
    if (this.stats.splits > 3) {
    
      this.uci.send('info currmove ' + board.formatMove(move) + ' currmovenumber ' + numLegalMoves);
    }
    
    //}}}
    //{{{  LMR?
    
    R = 0;
    
    if (node.base < BASE_LMR)
      lmrs += 1;
    
    if (doLMR && !alphaMate && lmrs > 10) {
    
      givesCheck = board.isKingAttacked(turn);
    
      if (!givesCheck) {
        R = 1;
        if (lmrs > 20 && depth > 5)
          R = 2;
      }
    }
    
    //}}}

    if (numLegalMoves == 1)
      score = -this.alphabeta(node.childNode, depth-1, nextTurn, -beta, -alpha);
    else {
      score = -this.alphabeta(node.childNode, depth-R-1, nextTurn, -alpha-1, -alpha);
      if (!this.stats.timeOut && score > alpha) {
        score = -this.alphabeta(node.childNode, depth-1, nextTurn, -beta, -alpha);
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
          board.ttPut(TT_BETA, depth, score, move, node.ply);
          return score;
        }
        alpha     = score;
        alphaMate = (alpha <= -MINMATE && alpha >= -MATE) || (alpha >= MINMATE && alpha <= MATE);
        board.ttPut(TT_ALPHA, depth, score, move, node.ply);
        //{{{  send score to UI
        
        var absScore = Math.abs(score);
        var units    = 'cp';
        var uciScore = score;
        
        if (absScore > MINMATE) {
          var units    = 'mate';
          var uciScore = Math.floor((MATE - absScore + 1) / 2);
          if (uciScore < 0)
            uciScore = 0;
          if (score < 0)
            uciScore = -uciScore;
        }
        
        this.uci.send('info depth',this.stats.ply,'seldepth',this.stats.selDepth,'score',units,uciScore,'pv',this.getPVStr(node));
        
        //}}}
      }
      bestScore = score;
      bestMove  = move;
    }
  }

  if (numLegalMoves == 1)
    this.stats.timeOut = 1;  // only one legal move so don't waste any more time.

  if (bestScore > oAlpha) {
    board.ttPut(TT_EXACT, depth, bestScore, bestMove, node.ply);
    return bestScore;
  }
  else {
    board.ttPut(TT_ALPHA, depth, oAlpha,    bestMove, node.ply);
    return oAlpha;
  }
}

//}}}
//{{{  .alphabeta

lozChess.prototype.alphabeta = function (node, depth, turn, alpha, beta, nullOK) {

  //{{{  housekeeping
  
  if (!node.childNode) {
    this.uci.debug('AB DEPTH');
    this.stats.timeOut = 1;
  }
  
  if (depth > 2 || this.stats.timeOut) {
    this.stats.lazyUpdate();
    if (this.stats.timeOut)
      return;
  }
  
  if (node.ply > this.stats.selDepth)
    this.stats.selDepth = node.ply;
  
  //}}}

  var board = this.board;

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

  var nextTurn = ~turn & COLOR_MASK;
  var score    = 0;
  var inCheck  = board.isKingAttacked(nextTurn);

  if (inCheck) {
    depth += 1;
    if (depth <= 0)  // don't go into QS in check.
      depth = 1;
  }

  //{{{  horizon?
  
  if (depth <= 0) {
  
    //score = board.ttGet(node, 0, alpha, beta);
  
    //if (score != undefined)
      //return score;
  
    score = this.qSearch(node, depth-1, turn, alpha, beta);
  
    return score;
  }
  
  //}}}

  this.stats.nodes++;

  //{{{  try tt
  
  score = board.ttGet(node, depth, alpha, beta);
  
  if (score != undefined) {
    return score;
  }
  
  //}}}

  var betaMate = (beta <= -MINMATE && beta >= -MATE) || (beta >= MINMATE && beta <= MATE);
  var pvNode   = beta != (alpha + 1);
  var standPat = board.evaluate(turn);
  var R        = 0;

  node.cache();

  //{{{  try null move
  //
  //  The parent node passes in nullOK == false if it did a null
  //  move.  It will be undefined otherwise, so we can do one.
  //
  
  R = 3;
  
  if (!pvNode && standPat > beta && !betaMate && nullOK !== false && !inCheck) {
  
    board.loHash ^= board.loEP[board.ep];
    board.hiHash ^= board.hiEP[board.ep];
  
    board.ep = 0; // what else?
  
    board.loHash ^= board.loEP[board.ep];
    board.hiHash ^= board.hiEP[board.ep];
  
    board.loHash ^= board.loTurn;
    board.hiHash ^= board.hiTurn;
  
    score = -this.alphabeta(node.childNode, depth-R-1, nextTurn, -beta, -beta+1, false);  // no null.
  
    node.uncache();
  
    if (this.stats.timeOut)
      return;
  
    if (score >= beta) {
      //board.ttPut(TT_BETA, depth, score, 0, node.ply);
      return score;
    }
  }
  
  R = 0;
  
  //}}}

  var bestScore      = -INFINITY;
  var move           = 0;
  var bestMove       = 0;
  var oAlpha         = alpha;
  var alphaMate      = (alpha <= -MINMATE && alpha >= -MATE) || (alpha >= MINMATE && alpha <= MATE);
  var futility       = !inCheck && (standPat + 10 + depth*40 < alpha);
  var numLegalMoves  = 0;
  var givesCheck     = undefined;
  var lmrs           = 0;
  var doLMR          = depth >= 3 && !inCheck && !betaMate;

  //{{{  IID
  
  if (!node.hashMove && pvNode && depth > 3) {
    this.alphabeta(node.childNode, depth-2, turn, alpha, beta, false);
    board.ttGet(node, 0, alpha, beta);
  }
  
  //}}}

  board.genMoves(node, turn);

  while (move = node.getNextMove()) {

    board.makeMove(node,move);

    //{{{  legal?
    
    if (move != node.hashMove && board.isKingAttacked(nextTurn)) {
    
      board.unmakeMove(node,move);
    
      node.uncache();
    
      continue;
    }
    
    //}}}

    numLegalMoves++;

    //{{{  futile?
    
    givesCheck = undefined;
    
    if (futility && !alphaMate && !(pvNode && numLegalMoves == 1) && !(move & KEEPER_MASK)) {
    
      givesCheck = board.isKingAttacked(turn);
    
      if (!givesCheck) {
    
        board.unmakeMove(node,move);
    
        node.uncache();
    
        continue;
      }
    }
    
    //}}}
    //{{{  LMR?
    
    R = 0;
    
    if (node.base < BASE_LMR)
      lmrs += 1;
    
    if (doLMR && !alphaMate && lmrs > 5) {
    
      if (givesCheck == undefined)
        givesCheck = board.isKingAttacked(turn);
    
      if (!givesCheck) {
        R = 1;
        if (lmrs > 20 && depth > 5)
          R = 2;
      }
    }
    
    //}}}

    if (pvNode) {
      if (numLegalMoves == 1)
        score = -this.alphabeta(node.childNode, depth-1, nextTurn, -beta, -alpha);
      else {
        score = -this.alphabeta(node.childNode, depth-R-1, nextTurn, -alpha-1, -alpha);
        if (!this.stats.timeOut && score > alpha) {
          score = -this.alphabeta(node.childNode, depth-1, nextTurn, -beta, -alpha);
        }
      }
    }
    else {
      score = -this.alphabeta(node.childNode, depth-R-1, nextTurn, -beta, -alpha);  // ZW by implication.
      if (R && !this.stats.timeOut && score > alpha)
        score = -this.alphabeta(node.childNode, depth-1, nextTurn, -beta, -alpha);
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
          board.ttPut(TT_BETA, depth, score, move, node.ply);
          return score;
        }
        board.ttPut(TT_ALPHA, depth, score, move, node.ply);
        alpha     = score;
        alphaMate = (alpha <= -MINMATE && alpha >= -MATE) || (alpha >= MINMATE && alpha <= MATE);
      }
      bestScore = score;
      bestMove  = move;
    }
  }

  //{{{  no moves?
  
  if (numLegalMoves == 0) {
  
    if (inCheck)
      bestScore = -MATE + node.ply;
  
    else
      bestScore = CONTEMPT;
  
  }
  
  //}}}

  if (bestScore > oAlpha) {
    board.ttPut(TT_EXACT, depth, bestScore, bestMove, node.ply);
    return bestScore;
  }
  else {
    board.ttPut(TT_ALPHA, depth, oAlpha,    bestMove, node.ply);
    return oAlpha;
  }
}

//}}}
//{{{  .quiescence

lozChess.prototype.qSearch = function (node, depth, turn, alpha, beta) {

  this.stats.nodes++;

  var board    = this.board;
  var standPat = board.evaluate(turn);
  var phase    = board.gPhase;

  //{{{  housekeeping
  
  if (!node.childNode) {
    this.uci.debug('Q DEPTH');
    return standPat;
  }
  
  //}}}

  if (standPat >= beta) {  // DO NOT BE TEMPTED TO USE FAIL SOFT!!!
    return beta;
  }

  if (standPat + VALUE_QUEEN < alpha) {
    return alpha;
  }

  var nextTurn = ~turn & COLOR_MASK;
  var move     = 0;

  alpha = (standPat > alpha) ? standPat : alpha;

  node.cache();

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
    //{{{  futile?
    
    if (phase <= EPHASE && !(move & MOVE_PROMOTE_MASK) && standPat + 200 + VALUE_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK] < alpha) {
    
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
        return beta;
      }
      alpha = score;
    }
  }

  return alpha;
}

//}}}
//{{{  .playMove

lozChess.prototype.playMove = function (moveStr, turn) {

  var board = this.board;
  var move  = 0;
  var node  = this.rootNode;

  board.genMoves(node, turn);

  while (move = node.getNextMove()) {

    if (moveStr == board.formatMove(move)) {
      board.makeMove(node,move);
      return;
    }
  }

  this.uci.debug('cannot play uci move',moveStr);
}

//}}}
//{{{  .getPVStr

lozChess.prototype.getPVStr = function(node) {

  if (!node)
    return '';

  var board = this.board;
  var move  = board.ttGetMove(node);

  if (!move)
    return '';

  node.cache();
  board.makeMove(node,move);

  var mv = board.formatMove(move);
  var pv = ' ' + this.getPVStr(node.childNode);

  board.unmakeMove(node,move);
  node.uncache();

  if (pv.indexOf(' ' + mv + ' ') === -1)
    return mv + pv;
  else
    return '';
}


//}}}

//}}}
//{{{  lozBoard class

//{{{  lozBoard

function lozBoard () {

  this.b     = Array(144);     // pieces.
  this.z     = Array(144);     // indexes to w|bList.
  this.wList = Array(16);      // list of squares with white pieces.
  this.bList = Array(16);      // list of squares with black pieces.

  this.runningEvalS = 0;  // these are all cached across make/unmakeMove.
  this.runningEvalE = 0;
  this.rights       = 0;
  this.ep           = 0;
  this.repLo        = 0;
  this.repHi        = 0;
  this.loHash       = 0;
  this.hiHash       = 0;

  this.ttSize = 1 << 24;          // tt size.
  this.ttMask = this.ttSize - 1;  // mask to index tt.

  // use separate typed arrays to save space.  optimiser probably has a go anyway but better
  // to be explicit at the expense of some conversion.  total width is 16 bytes.

  this.ttLo    = new Int32Array(this.ttSize);  // must not be Uint32.  not really sure why.
  this.ttHi    = new Int32Array(this.ttSize);  // "
  this.ttType  = new Uint8Array(this.ttSize);
  this.ttDepth = new Int8Array(this.ttSize);   // allow -ve depths but currently not used for q.
  this.ttMove  = new Uint32Array(this.ttSize); // see constants for structure.
  this.ttScore = new Int16Array(this.ttSize);

  this.ttInit();

  this.turn = 0;

  //{{{  turn
  
  this.loTurn = this.rand32();
  this.hiTurn = this.rand32();
  
  //}}}
  //{{{  pieces
  
  this.loPieces = Array(2);
  for (var i=0; i < 2; i++) {
    this.loPieces[i] = Array(6);
    for (var j=0; j < 6; j++) {
      this.loPieces[i][j] = Array(144);
      for (var k=0; k < 144; k++)
        this.loPieces[i][j][k] = this.rand32();
    }
  }
  
  this.hiPieces = Array(2);
  for (var i=0; i < 2; i++) {
    this.hiPieces[i] = Array(6);
    for (var j=0; j < 6; j++) {
      this.hiPieces[i][j] = Array(144);
      for (var k=0; k < 144; k++)
        this.hiPieces[i][j][k] = this.rand32();
    }
  }
  
  //}}}
  //{{{  rights
  
  this.loRights = Array(16);
  this.hiRights = Array(16);
  
  for (var i=0; i < 16; i++) {
    this.loRights[i] = this.rand32();
    this.hiRights[i] = this.rand32();
  }
  
  //}}}
  //{{{  EP
  
  this.loEP = Array(144);
  this.hiEP = Array(144);
  
  for (var i=0; i < 144; i++) {
    this.loEP[i] = this.rand32();
    this.hiEP[i] = this.rand32();
  }
  
  //}}}

  this.repLoHash = Array(1000);
  for (var i=0; i < 1000; i++)
    this.repLoHash[i] = 0;

  this.repHiHash = Array(1000);
  for (var i=0; i < 1000; i++)
    this.repHiHash[i] = 0;

  this.phase   = 0;
  this.gPhase  = 0;

  this.wCounts = [0,0,0,0,0,0,0];
  this.bCounts = [0,0,0,0,0,0,0];

  this.wCount  = 0;
  this.bCount  = 0;
}

//}}}
//{{{  .init

lozBoard.prototype.init = function () {

  this.b = [EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,
            EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,EDGE,EDGE,
            EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,
            EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE,EDGE];

  this.z = [NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,
            NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z,NO_Z];

  this.loHash = 0;
  this.hiHash = 0;

  this.repLo  = 0;
  this.repHi  = 0;

  this.phase  = TPHASE;
  this.gPhase = 0;

  this.wCounts = [0,0,0,0,0,0,0];
  this.bCounts = [0,0,0,0,0,0,0];

  this.wCount = 0;
  this.bCount = 0;

  this.wList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  this.bList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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
    var pPromoteRank = 8;
    var rights       = this.rights & WHITE_RIGHTS;
    var pList        = this.wList;
    var pCount       = this.wCount;
  
    if (rights) {
  
      if ((rights & WHITE_RIGHTS_KING)  && b[F1] == NULL && b[G1] == NULL                  && !this.isAttacked(F1,BLACK) && !this.isAttacked(E1,BLACK))
        node.addMove(MOVE_E1G1);
  
      if ((rights & WHITE_RIGHTS_QUEEN) && b[B1] == NULL && b[C1] == NULL && b[D1] == NULL && !this.isAttacked(D1,BLACK) && !this.isAttacked(E1,BLACK))
        node.addMove(MOVE_E1C1);
    }
  }
  
  else {
  
    var pOffsetOrth  = BP_OFFSET_ORTH;
    var pOffsetDiag1 = BP_OFFSET_DIAG1;
    var pOffsetDiag2 = BP_OFFSET_DIAG2;
    var pHomeRank    = 7;
    var pPromoteRank = 1;
    var rights       = this.rights & BLACK_RIGHTS;
    var pList        = this.bList;
    var pCount       = this.bCount;
  
    if (rights) {
  
      if ((rights & BLACK_RIGHTS_KING)  && b[F8] == NULL && b[G8] == NULL &&                  !this.isAttacked(F8,WHITE) && !this.isAttacked(E8,WHITE))
        node.addMove(MOVE_E8G8);
  
      if ((rights & BLACK_RIGHTS_QUEEN) && b[B8] == NULL && b[C8] == NULL && b[D8] == NULL && !this.isAttacked(D8,WHITE) && !this.isAttacked(E8,WHITE))
        node.addMove(MOVE_E8C8);
    }
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

    if (frPiece == PAWN) {
      //{{{  pawn
      
      frMove |= MOVE_PAWN_MASK;
      
      var to     = fr + pOffsetOrth;
      var toObj  = b[to];
      
      if (toObj == NULL) {
      
        if (RANK[to] == pPromoteRank)
          node.addPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
        else {
          node.addMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
          if (RANK[fr] == pHomeRank) {
      
            to    += pOffsetOrth;
            toObj = b[to];
      
            if (toObj == NULL)
              node.addMove(MOVE_EPMAKE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          }
        }
      }
      
      var to    = fr + pOffsetDiag1;
      var toObj = b[to];
      
      if (toObj != NULL && toObj != EDGE && (toObj & COLOR_MASK) != turn) {
      
        if (RANK[to] == pPromoteRank)
          node.addPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (toObj == NULL && to == this.ep)
        node.addMove(MOVE_EPTAKE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
      var to    = fr + pOffsetDiag2;
      var toObj = b[to];
      
      if (toObj != NULL && toObj != EDGE && (toObj & COLOR_MASK) != turn) {
      
        if (RANK[to] == pPromoteRank)
          node.addPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (toObj == NULL && to == this.ep)
        node.addMove(MOVE_EPTAKE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
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
      
          if (toObj == NULL) {
            node.addMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
            continue;
          }
      
          if (toObj == EDGE)
            break;
      
          if ((toObj & COLOR_MASK) != turn)
            node.addMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
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
  //
  // don't be tempted to split this up into black and white
  // without considering the to == clauses.
  //
  
  if (this.rights & ALL_RIGHTS) {
  
    this.loHash ^= this.loRights[this.rights & ALL_RIGHTS];
    this.hiHash ^= this.hiRights[this.rights & ALL_RIGHTS];
  
    if (frObj == W_KING || (frObj == W_ROOK && fr == H1) || to == H1)
      this.rights &= ~WHITE_RIGHTS_KING;
  
    if (frObj == W_KING || (frObj == W_ROOK && fr == A1) || to == A1)
      this.rights &= ~WHITE_RIGHTS_QUEEN;
  
    if (frObj == B_KING || (frObj == B_ROOK && fr == H8) || to == H8)
      this.rights &= ~BLACK_RIGHTS_KING;
  
    if (frObj == B_KING || (frObj == B_ROOK && fr == A8) || to == A8)
      this.rights &= ~BLACK_RIGHTS_QUEEN;
  
    this.loHash ^= this.loRights[this.rights & ALL_RIGHTS];
    this.hiHash ^= this.hiRights[this.rights & ALL_RIGHTS];
  }
  
  //}}}
  //{{{  capture?
  
  if (toObj) {
  
    var toPiece = toObj & PIECE_MASK;
    var toCol   = toObj & COLOR_MASK;
    var toColI  = toCol >>> 3;
  
    this.loHash ^= this.loPieces[toColI][toPiece-1][to];
    this.hiHash ^= this.hiPieces[toColI][toPiece-1][to];
  
    this.phase += VPHASE[toPiece];
  
    if (toCol == WHITE) {
  
      this.wList[node.toZ] = 0;
  
      this.runningEvalS -= VALUE_VECTOR[toPiece];
      this.runningEvalS -= WS_PST[toPiece][to];
      this.runningEvalE -= VALUE_VECTOR[toPiece];
      this.runningEvalE -= WE_PST[toPiece][to];
  
      this.wCounts[toPiece]--;
      this.wCount--;
    }
  
    else {
  
      this.bList[node.toZ] = 0;
  
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
    
        this.bList[node.epZ] = 0;
    
        this.loHash ^= this.loPieces[1][PAWN-1][to+12];
        this.hiHash ^= this.hiPieces[1][PAWN-1][to+12];
    
        this.runningEvalS += VALUE_PAWN;
        this.runningEvalS += BS_PST[PAWN][to+12];  // sic.
        this.runningEvalE += VALUE_PAWN;
        this.runningEvalE += BE_PST[PAWN][to+12];  // sic.
    
        this.bCounts[PAWN]--;
        this.bCount--;
      }
    
      else if (move & MOVE_PROMOTE_MASK) {
    
        var pro = ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS) + 2;  //NBRQ
        b[to]   = WHITE | pro;
    
        this.loHash ^= this.loPieces[0][PAWN-1][to];
        this.hiHash ^= this.hiPieces[0][PAWN-1][to];
        this.loHash ^= this.loPieces[0][pro-1][to];
        this.hiHash ^= this.hiPieces[0][pro-1][to];
    
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
    
        this.loHash ^= this.loPieces[0][ROOK-1][H1];
        this.hiHash ^= this.hiPieces[0][ROOK-1][H1];
        this.loHash ^= this.loPieces[0][ROOK-1][F1];
        this.hiHash ^= this.hiPieces[0][ROOK-1][F1];
    
        this.runningEvalS -= WS_PST[ROOK][H1];
        this.runningEvalS += WS_PST[ROOK][F1];
        this.runningEvalS += 50;
        this.runningEvalE -= WE_PST[ROOK][H1];
        this.runningEvalE += WE_PST[ROOK][F1];
        this.runningEvalE += 50;
      }
    
      else if (move == MOVE_E1C1) {
    
        b[A1] = NULL;
        b[D1] = W_ROOK;
        z[D1] = z[A1];
        z[A1] = NO_Z;
    
        this.wList[z[D1]] = D1;
    
        this.loHash ^= this.loPieces[0][ROOK-1][A1];
        this.hiHash ^= this.hiPieces[0][ROOK-1][A1];
        this.loHash ^= this.loPieces[0][ROOK-1][D1];
        this.hiHash ^= this.hiPieces[0][ROOK-1][D1];
    
        this.runningEvalS -= WS_PST[ROOK][A1];
        this.runningEvalS += WS_PST[ROOK][D1];
        this.runningEvalS += 50;
        this.runningEvalE -= WE_PST[ROOK][A1];
        this.runningEvalE += WE_PST[ROOK][D1];
        this.runningEvalE += 50;
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
    
        this.wList[node.epZ] = 0;
    
        this.loHash ^= this.loPieces[0][PAWN-1][to-12];
        this.hiHash ^= this.hiPieces[0][PAWN-1][to-12];
    
        this.runningEvalS -= VALUE_PAWN;
        this.runningEvalS -= WS_PST[PAWN][to-12];  // sic.
        this.runningEvalE -= VALUE_PAWN;
        this.runningEvalE -= WE_PST[PAWN][to-12];  // sic.
    
        this.wCounts[PAWN]--;
        this.wCount--;
      }
    
      else if (move & MOVE_PROMOTE_MASK) {
    
        var pro = ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS) + 2;  //NBRQ
        b[to]   = BLACK | pro;
    
        this.loHash ^= this.loPieces[1][PAWN-1][to];
        this.hiHash ^= this.hiPieces[1][PAWN-1][to];
        this.loHash ^= this.loPieces[1][pro-1][to];
        this.hiHash ^= this.hiPieces[1][pro-1][to];
    
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
    
        this.loHash ^= this.loPieces[1][ROOK-1][H8];
        this.hiHash ^= this.hiPieces[1][ROOK-1][H8];
        this.loHash ^= this.loPieces[1][ROOK-1][F8];
        this.hiHash ^= this.hiPieces[1][ROOK-1][F8];
    
        this.runningEvalS += BS_PST[ROOK][H8];
        this.runningEvalS -= BS_PST[ROOK][F8];
        this.runningEvalS -= 50;
        this.runningEvalE += BE_PST[ROOK][H8];
        this.runningEvalE -= BE_PST[ROOK][F8];
        this.runningEvalE -= 50;
      }
    
      else if (move == MOVE_E8C8) {
    
        b[A8] = NULL;
        b[D8] = B_ROOK;
        z[D8] = z[A8];
        z[A8] = NO_Z;
    
        this.bList[z[D8]] = D8;
    
        this.loHash ^= this.loPieces[1][ROOK-1][A8];
        this.hiHash ^= this.hiPieces[1][ROOK-1][A8];
        this.loHash ^= this.loPieces[1][ROOK-1][D8];
        this.hiHash ^= this.hiPieces[1][ROOK-1][D8];
    
        this.runningEvalS += BS_PST[ROOK][A8];
        this.runningEvalS -= BS_PST[ROOK][D8];
        this.runningEvalS -= 50;
        this.runningEvalE += BE_PST[ROOK][A8];
        this.runningEvalE -= BE_PST[ROOK][D8];
        this.runningEvalE -= 50;
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
    
      if (move & MOVE_EPTAKE_MASK) {
    
        b[to+12] = B_PAWN;
        z[to+12] = node.epZ;
    
        this.bList[node.epZ] = to+12;
    
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
    
      if (move & MOVE_EPTAKE_MASK) {
    
        b[to-12] = W_PAWN;
        z[to-12] = node.epZ;
    
        this.wList[node.epZ] = to-12;
    
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
//{{{  .genQMoves

lozBoard.prototype.genQMoves = function(node, turn) {

  node.numMoves    = 0;
  node.sortedIndex = 0;

  var b = this.b;

  //{{{  colour based stuff
  
  if (turn == WHITE) {
  
    var pOffsetDiag1 = WP_OFFSET_DIAG1;
    var pOffsetDiag2 = WP_OFFSET_DIAG2;
    var pPromoteRank = 8;
    var pList        = this.wList;
    var pCount       = this.wCount;
  }
  
  else {
  
    var pOffsetDiag1 = BP_OFFSET_DIAG1;
    var pOffsetDiag2 = BP_OFFSET_DIAG2;
    var pPromoteRank = 1;
    var pList        = this.bList;
    var pCount       = this.bCount;
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

    var frObj   = b[fr];
    var frPiece = frObj & PIECE_MASK;
    var frMove  = (frObj << MOVE_FROBJ_BITS) | (fr << MOVE_FR_BITS);

    if (frPiece == PAWN) {
      //{{{  pawn
      
      frMove |= MOVE_PAWN_MASK;
      
      var to    = fr + pOffsetDiag1;
      var toObj = b[to];
      
      if (toObj != NULL && toObj != EDGE && (toObj & COLOR_MASK) != turn) {
      
        if (RANK[to] == pPromoteRank)
          node.addQPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (toObj == NULL && to == this.ep)
        node.addQMove(MOVE_EPTAKE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
      var to    = fr + pOffsetDiag2;
      var toObj = b[to];
      
      if (toObj != NULL && toObj != EDGE && (toObj & COLOR_MASK) != turn) {
      
        if (RANK[to] == pPromoteRank)
          node.addQPromotion(MOVE_PROMOTE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
        else
          node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      }
      
      else if (toObj == NULL && to == this.ep)
        node.addQMove(MOVE_EPTAKE_MASK | frMove | (toObj << MOVE_TOOBJ_BITS) | to);
      
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
      
          if (toObj == NULL)
            continue;
      
          if (toObj == EDGE)
            break;
      
          if ((toObj & COLOR_MASK) != turn) {
            node.addQMove(frMove | (toObj << MOVE_TOOBJ_BITS) | to);
          }
      
          break;
        }
      }
      
      //}}}
    }

    next++;
    count++;
  }
}

//}}}
//{{{  .isKingAttacked

lozBoard.prototype.isKingAttacked = function(byCol) {

  var b  = this.b;
  var to = (byCol == WHITE) ? this.bList[0] : this.wList[0];  // king is always at index 0.

  //{{{  queen, bishop, rook
  
  var offsets = QUEEN_OFFSETS;
  var len     = offsets.length;
  var cwtch   = 0;
  
  for (var dir=len; dir--;) {
  
    var offset = offsets[dir];
  
    for (var slide=1; slide<=8; slide++) {
  
      var frObj = b[to + slide*offset];
  
      if (frObj == NULL)
        continue;
  
      if ((frObj == EDGE) || (frObj & COLOR_MASK) != byCol) {
        cwtch++;
        break;
      }
  
      var frPiece = frObj & PIECE_MASK;
  
      if (frPiece == QUEEN || dir <= 3 && frPiece == BISHOP || dir > 3  && frPiece == ROOK)
        return frObj;
  
      break;
    }
  }
  
  //}}}
  //{{{  knights
  
  var attacker = KNIGHT | byCol;
  
  if (b[to + -10] == attacker) return attacker;
  if (b[to + -23] == attacker) return attacker;
  if (b[to + -14] == attacker) return attacker;
  if (b[to + -25] == attacker) return attacker;
  if (b[to +  10] == attacker) return attacker;
  if (b[to +  23] == attacker) return attacker;
  if (b[to +  14] == attacker) return attacker;
  if (b[to +  25] == attacker) return attacker;
  
  //}}}

  if (cwtch == 8)  // this can be used towards king safety?
    return 0;

  //{{{  pawns
  
  if (byCol == BLACK && b[to + WP_OFFSET_DIAG1] == B_PAWN) return B_PAWN;
  if (byCol == BLACK && b[to + WP_OFFSET_DIAG2] == B_PAWN) return B_PAWN;
  if (byCol == WHITE && b[to + BP_OFFSET_DIAG1] == W_PAWN) return W_PAWN;
  if (byCol == WHITE && b[to + BP_OFFSET_DIAG2] == W_PAWN) return W_PAWN;
  
  //}}}
  //{{{  kings
  
  var attacker = KING | byCol;
  
  if (b[to + -11] == attacker) return attacker;
  if (b[to + -13] == attacker) return attacker;
  if (b[to + -12] == attacker) return attacker;
  if (b[to + -1 ] == attacker) return attacker;
  if (b[to +  11] == attacker) return attacker;
  if (b[to +  13] == attacker) return attacker;
  if (b[to +  12] == attacker) return attacker;
  if (b[to +  1 ] == attacker) return attacker;
  
  //}}}

  return 0;
}

//}}}
//{{{  .isAttacked

lozBoard.prototype.isAttacked = function(to, byCol) {

  var b = this.b;

  //{{{  queen, bishop, rook
  
  var offsets = QUEEN_OFFSETS;
  var len     = offsets.length;
  var cwtch   = 0;
  
  for (var dir=len; dir--;) {
  
    var offset = offsets[dir];
  
    for (var slide=1; slide<=8; slide++) {
  
      var frObj = b[to + slide*offset];
  
      if (frObj == NULL)
        continue;
  
      if ((frObj == EDGE) || (frObj & COLOR_MASK) != byCol) {
        cwtch++;
        break;
      }
  
      var frPiece = frObj & PIECE_MASK;
  
      if (frPiece == QUEEN || dir <= 3 && frPiece == BISHOP || dir > 3  && frPiece == ROOK)
        return frObj;
  
      break;
    }
  }
  
  //}}}
  //{{{  knights
  
  var attacker = KNIGHT | byCol;
  
  if (b[to + -10] == attacker) return attacker;
  if (b[to + -23] == attacker) return attacker;
  if (b[to + -14] == attacker) return attacker;
  if (b[to + -25] == attacker) return attacker;
  if (b[to +  10] == attacker) return attacker;
  if (b[to +  23] == attacker) return attacker;
  if (b[to +  14] == attacker) return attacker;
  if (b[to +  25] == attacker) return attacker;
  
  //}}}

  if (cwtch == 8)  // this can be used towards king safety?
    return 0;

  //{{{  pawns
  
  if (byCol == BLACK && b[to + WP_OFFSET_DIAG1] == B_PAWN) return B_PAWN;
  if (byCol == BLACK && b[to + WP_OFFSET_DIAG2] == B_PAWN) return B_PAWN;
  if (byCol == WHITE && b[to + BP_OFFSET_DIAG1] == W_PAWN) return W_PAWN;
  if (byCol == WHITE && b[to + BP_OFFSET_DIAG2] == W_PAWN) return W_PAWN;
  
  //}}}
  //{{{  kings
  
  var attacker = KING | byCol;
  
  if (b[to + -11] == attacker) return attacker;
  if (b[to + -13] == attacker) return attacker;
  if (b[to + -12] == attacker) return attacker;
  if (b[to + -1 ] == attacker) return attacker;
  if (b[to +  11] == attacker) return attacker;
  if (b[to +  13] == attacker) return attacker;
  if (b[to +  12] == attacker) return attacker;
  if (b[to +  1 ] == attacker) return attacker;
  
  //}}}

  return 0;
}

//}}}
//{{{  .formatMove

var PROMOTES = ['n','b','r','q']; // 0-3 encoded in move.

lozBoard.prototype.formatMove = function (move) {

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

  if (lozza.uci.options.san != 'on')
    return frCoord + toCoord + pro;

  if (toObj != NULL) {
    if (frPiece == PAWN)
      return frCoord + 'x' + toCoord + pro;
    else
      return frName + 'x' + toCoord;
  }

  if (frPiece == PAWN)
    return toCoord + pro;

  if (move == MOVE_E1G1 || move == MOVE_E8G8)
    return '0-0';

  if (move == MOVE_E1C1 || move == MOVE_E8C8)
    return '0-0-0';

  return frName + toCoord;

}

//}}}
//{{{  .evaluate

lozBoard.prototype.evaluate = function (turn) {

  //this.check(turn);

  //{{{  init
  
  var numPieces = this.wCount + this.bCount;
  
  var nwB = this.wCounts[BISHOP];
  var nwN = this.wCounts[KNIGHT];
  
  var nbB = this.bCounts[BISHOP];
  var nbN = this.bCounts[KNIGHT];
  
  //}}}
  //{{{  insufficient material?
  
  if (numPieces == 2)                                  // K v K.
    return 0;
  
  if (numPieces == 3 && (nwN || nwB || nbN || nbB))    // K v K+N|B.
    return 0;
  
  if (numPieces == 4 && (nwN || nwB) && (nbN || nbB))  // K+N|B v K+N|B.
    return 0;
  
  //}}}

  this.gPhase = Math.round((this.phase << 8) / TPHASE);

  var evalS = this.runningEvalS;
  var evalE = this.runningEvalE;

  //{{{  bishop pair
  
  if (nwB >= 2) {
    evalS += 50;
    evalE += 50;
  }
  
  if (nbB >= 2) {
    evalS -= 50;
    evalE -= 50;
  }
  
  //}}}

  var e = ((evalS * (256 - this.gPhase)) + (evalE * this.gPhase)) >> 8;

  return e * ((-turn >> 31) | 1);
}

//}}}
//{{{  .rand32

lozBoard.prototype.rand32 = function () {

  return Math.floor(Math.random() * 0xFFFFFFFF);

}

//}}}
//{{{  .ttPut
//
// Always replacing alpha/beta entries is slightly worse then below.
//

lozBoard.prototype.ttPut = function (type,depth,score,move,ply) {

  var idx = this.loHash & this.ttMask;

  if (this.ttType[idx] != TT_EMPTY && this.ttDepth[idx] > depth && this.ttLo[idx] == this.loHash && this.ttHi[idx] == this.hiHash) {

    // we have a better result from a deeper search.

    return;
  }

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

  var idx   = this.loHash & this.ttMask;
  var type  = this.ttType[idx];

  node.hashMove = 0;

  if (type == TT_EMPTY) {
    return undefined;
  }

  var lo = this.ttLo[idx];
  var hi = this.ttHi[idx];

  if (lo != this.loHash || hi != this.hiHash) {
    return undefined;
  }

  //
  // Set the hash move before the depth check
  // so that iterative deepening works.
  //

  node.hashMove = this.ttMove[idx];

  if (this.ttDepth[idx] < depth) {
    return undefined;
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

  return undefined;
}

//}}}
//{{{  .ttGetMove

lozBoard.prototype.ttGetMove = function (node) {

  var idx = this.loHash & this.ttMask;

  if (this.ttType[idx] != TT_EMPTY && this.ttLo[idx] == this.loHash && this.ttHi[idx] == this.hiHash)
    return this.ttMove[idx];

  return 0;
}

//}}}
//{{{  .ttInit

lozBoard.prototype.ttInit = function () {

  this.loHash = 0;
  this.hiHash = 0;

  for (var i=0; i < this.ttType.length; i++) {
    this.ttType[i]  = TT_EMPTY;
  }
}

//}}}
//{{{  .check

lozBoard.prototype.check = function (turn) {

  var loHash = 0;
  var hiHash = 0;

  if (turn) {
    loHash ^= this.loTurn;
    hiHash ^= this.hiTurn;
  }

  loHash ^= this.loRights[this.rights & ALL_RIGHTS];
  hiHash ^= this.hiRights[this.rights & ALL_RIGHTS];

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

  }

  if (this.loHash != loHash)
    lozza.uci.debug('*************** LO',this.loHash,loHash);

  if (this.hiHash != hiHash)
    lozza.uci.debug('*************** HI',this.hiHash,hiHash);
}

//}}}

//}}}
//{{{  lozNode class

//{{{  lozNode

function lozNode (parentNode) {

  this.ply        = 0;          //  distance from root.
  this.root       = false;      //  only treir for the root node node[0].
  this.hashMove   = 0;          //  loaded when we look up the tt.
  this.killer1    = 0;
  this.killer2    = 0;
  this.mateKiller = 0;
  this.childNode  = null;       //  pointer to next node (towards leaf) in tree.
  this.parentNode = parentNode; //  pointer previous node (towards root) in tree.

  if (parentNode) {
    this.grandparentNode = parentNode.parentNode;
    parentNode.childNode = this;
  }
  else
    this.grandparentNode = null;

  this.numMoves    = 0;         //  number of pseudo-legal moves for this node.
  this.sortedIndex = 0;         //  index to next selection-sorted pseudo-legal move.
  this.base        = 0;         //  move type base (e.g. good capture) - can be used for LMR.

  this.moves = Array(MAX_MOVES);
  for (var i=0; i < this.moves.length; i++)
    this.moves[i] = [0,0];      // [0] = priority, [1] = move.

  this.C_runningEvalS = 0;      // cached before move generation and restored after each unmakeMove.
  this.C_runningEvalE = 0;
  this.C_rights       = 0;
  this.C_ep           = 0;
  this.C_repLo        = 0;
  this.C_repHi        = 0;
  this.C_loHash       = 0;
  this.C_hiHash       = 0;

  this.toZ = 0;                 // move to square index (captures) to piece list - cached during make|unmakeMove.
  this.frZ = 0;                 // move from square index to piece list          - ditto.
  this.epZ = 0;                 // captured ep pawn index to piece list          - ditto.
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
}

//}}}
//{{{  .getNextMove

lozNode.prototype.getNextMove = function () {

  if (this.sortedIndex == this.numMoves)
    return 0;

  var maxV = -INFINITY;
  var maxI = 0;

  for (var i=this.sortedIndex; i < this.numMoves; i++) {
    if (this.moves[i][0] > maxV) {
      maxV = this.moves[i][0];
      maxI = i;
    }
  }

  var next = this.moves[this.sortedIndex];
  var maxi = this.moves[maxI];

  var tmpV = next[0];
  var tmpM = next[1];

  next[0] = maxi[0];
  next[1] = maxi[1];
  maxi[0] = tmpV;
  maxi[1] = tmpM;

  this.base = this.moves[this.sortedIndex][0];

  return this.moves[this.sortedIndex++][1];
}

//}}}
//{{{  .addMove
//
// Higher value => better move.
//

var BASE_HASH       =  11000;
var BASE_PROMOTES   =  10000;
var BASE_GOODTAKES  =   9000;
var BASE_EVENTAKES  =   8000;
var BASE_EPTAKES    =   7000;
var BASE_MATEKILLER =   6000;
var BASE_MYKILLERS  =   5000;
var BASE_GPKILLERS  =   4000;
var BASE_CASTLING   =   3000;
var BASE_BADTAKES   =   2000;
var BASE_SLIDES     =   1000;

var BASE_LMR        = BASE_BADTAKES;

lozNode.prototype.addMove = function (move) {

  var next = this.moves[this.numMoves++];
  next[1]  = move;

  if (move == this.hashMove) {
    next[0] = BASE_HASH;
    return;
  }

  if (move & MOVE_PROMOTE_MASK) {
    next[0] = BASE_PROMOTES + ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS); // QRBN.
    return;
  }

  if (move & MOVE_EPTAKE_MASK) {
    next[0] = BASE_EPTAKES;
    return;
  }

  if (move == this.mateKiller) {
    next[0] = BASE_MATEKILLER;
    return;
  }

  if (move == this.killer1) {
    next[0] = BASE_MYKILLERS + 1;
    return;
  }

  if (move == this.killer2) {
    next[0] = BASE_MYKILLERS;
    return;
  }

  if (this.grandparentNode && move == this.grandparentNode.killer1) {
    next[0] = BASE_GPKILLERS + 1;
    return;
  }

  if (this.grandparentNode && move == this.grandparentNode.killer2) {
    next[0] = BASE_GPKILLERS;
    return;
  }

  if (move & MOVE_CASTLE_MASK) {
    next[0] = BASE_CASTLING;
    return;
  }

  if (move & MOVE_TOOBJ_MASK) {

    var victim = RANK_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK];
    var attack = RANK_VECTOR[((move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS) & PIECE_MASK];

    if (victim > attack)
      next[0] = BASE_GOODTAKES + victim * 64 - attack;
    else if (victim == attack)
      next[0] = BASE_EVENTAKES + victim * 64 - attack;
    else
      next[0] = BASE_BADTAKES  + victim * 64 - attack;

    return;
  }

  else {
    var board = this.board;

    var to      = (move & MOVE_TO_MASK)    >>> MOVE_TO_BITS;
    var fr      = (move & MOVE_FR_MASK)    >>> MOVE_FR_BITS;
    var frObj   = (move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS;
    var frPiece = frObj & PIECE_MASK;

    if ((frObj & COLOR_MASK) == WHITE)
      next[0] = BASE_SLIDES + WM_PST[frPiece][to] - WM_PST[frPiece][fr];
    else
      next[0] = BASE_SLIDES + BM_PST[frPiece][to] - BM_PST[frPiece][fr];
  }

  return;
}

//}}}
//{{{  .addQMove

lozNode.prototype.addQMove = function (move) {

  var next = this.moves[this.numMoves++];
  next[1]  = move;

  if (move & MOVE_PROMOTE_MASK) {
    next[0] = BASE_PROMOTES + ((move & MOVE_PROMAS_MASK) >>> MOVE_PROMAS_BITS); // QRBN.
    return;
  }

  if (move & MOVE_EPTAKE_MASK) {
    next[0] = BASE_EPTAKES;
    return;
  }

  var victim = RANK_VECTOR[((move & MOVE_TOOBJ_MASK) >>> MOVE_TOOBJ_BITS) & PIECE_MASK];
  var attack = RANK_VECTOR[((move & MOVE_FROBJ_MASK) >>> MOVE_FROBJ_BITS) & PIECE_MASK];

  if (victim > attack)
    next[0] = BASE_GOODTAKES + victim * 64 - attack;

  else if (victim == attack)
    next[0] = BASE_EVENTAKES + victim * 64 - attack;

  else
    next[0] = BASE_BADTAKES  + victim * 64 - attack;

  return;
}

//}}}
//{{{  .addPromotion

lozNode.prototype.addPromotion = function (move) {

  this.addMove (move | (QUEEN-2)  << MOVE_PROMAS_BITS);
  this.addMove (move | (ROOK-2)   << MOVE_PROMAS_BITS);
  this.addMove (move | (BISHOP-2) << MOVE_PROMAS_BITS);
  this.addMove (move | (KNIGHT-2) << MOVE_PROMAS_BITS);
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
}

//}}}
//{{{  .lazyUpdate

lozStats.prototype.lazyUpdate = function () {

  //postMessage('info string ' + lastMessage);  //hack - never shows stop.

  //if (__jsUCI && lastMessage.indexOf('stop') != -1) {
  //  lozza.uci.debug('stop');
  //  this.stats.timeOut = 1;
  //}

  if (this.moveTime > 0 && ((Date.now() - this.startTime) > this.moveTime))
    this.timeOut = 1;

  if (this.maxNodes > 0 && this.nodes >= this.maxNodes)
    this.timeOut = 1;

  if (Date.now() - this.splitTime > 500) {
    this.splits++;
    this.update();
    this.splitTime = Date.now();
  }
}

//}}}
//{{{  .update

lozStats.prototype.update = function () {

  var tim = Date.now() - this.startTime;
  var nps = Math.floor((this.nodes * 1000) / tim);

  lozza.uci.send('info nodes',this.nodes,'time',tim,'nps',nps);
}

//}}}
//{{{  .stop

lozStats.prototype.stop = function () {

  this.stopTime  = Date.now();
  this.time      = this.stopTime - this.startTime;
  this.timeSec   = Math.round(this.time / 100) / 10;
  this.nodesMega = Math.round(this.nodes / 100000) / 10;
}

//}}}

//}}}
//{{{  lozTest class

//{{{  lozTest

function lozTest () {
}

//}}}
//{{{  .perft

lozTest.prototype.perft = function (spec) {

  lozza.stats.ply = spec.depth;

  var moves = this.perftSearch(lozza.rootNode, spec.depth, lozza.board.turn, spec.inner);

  lozza.stats.update();

  var error = moves - spec.moves;

  if (error == 0)
    var err = 'error';
  else
    var err = '<b>ERROR</b>';

  lozza.uci.debug('perft',lozza.board.id,'depth',spec.depth,'moves',moves,'expected',spec.moves,err,error);
}

//}}}
//{{{  .perftSearch

lozTest.prototype.perftSearch = function (node, depth, turn, inner) {

  lozza.stats.nodes++;

  if (depth == 0)
    return 1;

  var board         = lozza.board;
  var numNodes      = 0;
  var totalNodes    = 0;
  var move          = 0;
  var nextTurn      = ~turn & COLOR_MASK;
  var numLegalMoves = 0;

  node.cache();

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
      var fmove = board.formatMove(move);
      lozza.uci.send('info currmove ' + fmove + ' currmovenumber ' + numLegalMoves);
      if (inner)
        lozza.uci.debug(board.id,fmove,numNodes);
    }
  }

  if (depth > 2)
    lozza.stats.lazyUpdate();

  return totalNodes;
}

//}}}

//}}}
//{{{  lozUCI class

//{{{  lozUCI

function lozUCI () {

  this.message = '';
  this.tokens  = [];
  this.command = '';

  this.debugging = true;

  this.options = {};

  this.options.san = 'off';  // useful to switch 'on' in a non UCI context.
}

//}}}
//{{{  .send

lozUCI.prototype.send = function () {

  var s = '';

  for (var i = 0; i < arguments.length; i++)
    s += arguments[i] + ' ';

  postMessage(s);
  //console.log(s);
}

//}}}
//{{{  .debug

lozUCI.prototype.debug = function () {

  if (!this.debugging)
    return;

  var s = '';

  for (var i = 0; i < arguments.length; i++)
    s += arguments[i] + ' ';

  postMessage('info string ' + s);
  //console.log(s);
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

    switch (uci.command) {

    case 'position':
      //{{{  position
      //
      //  position (startpos | fen <fen>) [moves 0<move>]
      //
      
      var spec = {};
      
      spec.board  = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
      spec.turn   = 'w';
      spec.rights = 'KQkq';
      spec.ep     = '-';
      spec.hmc    = 0;
      spec.fmc    = 1;
      spec.id     = '';
      
      var arr = uci.getArr('fen','moves');
      
      if (arr.lo > 0) { // handle partial FENs
        if (arr.lo <= arr.hi) spec.board  =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) spec.turn   =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) spec.rights =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) spec.ep     =          uci.tokens[arr.lo];  arr.lo++;
        if (arr.lo <= arr.hi) spec.hmc    = parseInt(uci.tokens[arr.lo]); arr.lo++;
        if (arr.lo <= arr.hi) spec.fmc    = parseInt(uci.tokens[arr.lo]); arr.lo++;
      }
      
      spec.moves = [];
      
      var arr = uci.getArr('moves','fen');
      
      if (arr.lo > 0) {
        for (var i=arr.lo; i <= arr.hi; i++)
          spec.moves.push(uci.tokens[i]);
      }
      
      lozza.position(spec);
      
      break;
      
      //}}}

    case 'go':
      //{{{  go
      //
      // go
      //
      
      var spec = {};
      
      spec.depth     = uci.getInt('depth',0);
      spec.moveTime  = uci.getInt('movetime',0);
      spec.maxNodes  = uci.getInt('nodes',0);
      spec.wTime     = uci.getInt('wtime',0);
      spec.bTime     = uci.getInt('btime',0);
      spec.wInc      = uci.getInt('winc',0);
      spec.bInc      = uci.getInt('binc',0);
      spec.movesToGo = uci.getInt('movestogo',0);
      
      lozza.go(spec);
      
      break;
      
      //}}}

    case 'ucinewgame':
      //{{{  ucinewgame
      //
      // ucinewgame
      //
      
      lozza.board.ttInit();
      
      break;
      
      //}}}

    case 'quit':
      //{{{  quit
      
      close(); //kill worker
      
      break;
      
      //}}}

    case 'debug':
      //{{{  debug
      
      if (uci.getStr('debug','off') == 'on') {
      
        uci.debugging = true;
        uci.send('info string debug enabled');
      }
      
      else
        uci.debugging = false;
      
      break;
      
      //}}}

    case 'uci':
      //{{{  uci
      
      uci.send('id name Lozza');
      uci.send('id author Colin Jenkins');
      uci.send('option');
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
      
      uci.send('info string Lozza version',VERSION,'is alive');
      
      break;
      
      
      //}}}

    case 'id':
      //{{{  id
      //
      //  id <str>
      //
      
      lozza.id(uci.tokens[1]);
      
      break;
      
      //}}}

    case 'perft':
      //{{{  perft
      //
      // perft [depth <int>] [moves <int>] [inner 0|1]
      //
      
      var spec = {};
      
      spec.depth = uci.getInt('depth',0);
      spec.moves = uci.getInt('moves',0);
      spec.inner = uci.getInt('inner',0);
      
      lozza.test.perft (spec);
      
      break;
      
      //}}}

    }

  }
}

//}}}

//}}}

var lozza = new lozChess()

if ((typeof lastMessage) == 'undefined') {
  __jsUCI = false;
  lastMessage = '';  //so no errors when using native.
}
else {
  __jsUCI = true;
  postMessage('info string jsUCI detected');
}

//{{{  for use with node.js

/*

var spec = {};

spec.board  = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
spec.turn   = 'w';
spec.rights = 'KQkq';
spec.ep     = '-';
spec.hmc    = 0;
spec.fmc    = 1;
spec.id     = 'node test';
spec.moves = [];

lozza.position(spec);

spec.depth = 12;

lozza.go(spec);

*/

//}}}

