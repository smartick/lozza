
rem Use [ 0, 5] when testing a potential improvement.
rem Use [ 0, 4] when tweaking an existing number, like a margin for pruning.
rem Use [-3, 1] when simplifying some code that you think has little impact.

copy ..\..\..\top ..

set a=%@random[1,9999999]

copy cctry.pgn games\%a.pgn
del  cctry.pgn

set tc=tc=0/10+0.1

set e1=-engine conf=coalface  %tc
set e2=-engine conf=candidate %tc

set t=-event soaktest -tournament round-robin -games 20000

set r=-resign movecount=3 score=400

set d=-draw movenumber=40 movecount=8 score=10

set o=-repeat -srand %a -openings file=c:\projects\lozza\trunk\testing\data\4moves_noob.pgn format=pgn order=random plies=16

set f=-pgnout cctry.pgn fi

set s=-sprt elo0=0 elo1=5 alpha=0.05 beta=0.05

set v=-ratinginterval 10

set m=-recover -concurrency 4

"C:\Program Files (x86)\Cute Chess\cutechess-cli" %e1 %e2 %t %r %d %o %f %v %m %s

