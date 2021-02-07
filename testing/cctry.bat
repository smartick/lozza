rem Use [ 0, 5] when testing a potential improvement.
rem Use [ 0, 4] when tweaking an existing number, like a margin for pruning.
rem Use [-3, 1] when simplifying some code that you think has little impact.
rem There is no right answer, but [0, 10] would act to help detect large elo
rem gains very quickly, but would be slower if the actual result fell within
rem the 0 to 10 window. Its really up to your specific engine's current
rem strength. As for alpha and beta, these are confidence values for
rem false-positives and false-negatives. 0.05 corresponds to 95% for both;
rem 0.10 corresponds to 90% for both. Typically they are the same value,
rem but you could bias your tests to being more likely to bail, in trade
rem for completing bad tests faster. Cutechess has access to basic SPRT
rem testing. Make sure to use whatever setting prints SPRT results every
rem few games. I think its something like "-RatingInterval N". Andrew.

del cctry.pgn

set tc=tc=0/10+0.01

set e1=-engine conf=coalface %tc
set e2=-engine conf=200      %tc

set t=-tournament round-robin -games 10000

set r=-resign movecount=3 score=400

set d=-draw movenumber=40 movecount=8 score=10

set o=-repeat -openings file=4moves_noob.pgn format=pgn order=random plies=10

set f=-pgnout cctry.pgn fi

set s=-sprt elo0=0 elo1=5 alpha=0.05 beta=0.05 -ratinginterval 10

set m=-recover -concurrency 2

"C:\Program Files (x86)\Cute Chess\cutechess-cli" %e1 %e2 %t %r %d %o %f %s %m

