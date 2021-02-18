
del cctry.pgn

set tc=tc=0/60+1

set e1=-engine conf=coalface  %tc
set e2=-engine conf=candidate %tc

set t=-event soaktest -tournament round-robin -games 100000

set r=-resign movecount=3 score=400

set d=-draw movenumber=40 movecount=8 score=10

set o=-repeat -srand %@Random[0,99999999] -openings file=4moves_noob.pgn format=pgn order=random plies=16

set f=-pgnout cctry.pgn fi

set s=-sprt elo0=0 elo1=5 alpha=0.05 beta=0.05 -ratinginterval 10

set m=-recover -concurrency 4

"C:\Program Files (x86)\Cute Chess\cutechess-cli" %e1 %e2 %t %r %d %o %f %s %m

