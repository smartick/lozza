@echo off

rem ******** config start

set e1=coalface
set e2=candidate

set elo0=0
set elo1=5

set tc=10+0.1

set thisver=2.3
set lastver=2.2

set g=20000

rem ******** config end

iff "%e1" != "coalface" .and. "%e1" != "candidate" .and. "%e1" != "released" then
  echo no engine e1 %e1
  quit
endiff

iff "%e2" != "coalface" .and. "%e2" != "candidate" .and. "%e2" != "released" then
  echo no engine e2 %e2
  quit
endiff

copy /q ..\..\..\top ..

set a=%@random[1,9999999]

iff isfile cctry.pgn then
  copy /q cctry.pgn games\%a.pgn
  del  /q cctry.pgn
endiff

set ee1=-engine conf=%e1 tc=0/%tc
set ee2=-engine conf=%e2 tc=0/%tc
set t=-event soaktest -tournament round-robin -games %g
set r=-resign movecount=3 score=400
set d=-draw movenumber=40 movecount=8 score=10
set o=-repeat -srand %a -openings file=c:\projects\lozza\trunk\testing\data\4moves_noob.epd format=epd order=random plies=16
set f=-pgnout cctry.pgn fi
set s=-sprt elo0=%elo0 elo1=%elo1 alpha=0.05 beta=0.05
set v=-ratinginterval 10
set m=-recover -concurrency 2

findstr -V ##ifdef ..\lozza.js                  > coalface.js
findstr -V ##ifdef ..\history\%thisver\lozza.js > candidate.js
findstr -V ##ifdef ..\history\%lastver\lozza.js > released.js

rem ffind /vt"ifdef" coalface.js
rem ffind /vt"ifdef" candidate.js
rem ffind /vt"ifdef" released.js

node --version
node -p process.versions.v8

fc %e1.js %e2.js

echo.
echo %e1 v %e2 - %g games or [%elo0,%elo1] at %tc
echo.

"C:\Program Files (x86)\Cute Chess\cutechess-cli" %ee1 %ee2 %t %r %d %o %f %v %m %s

rem add -debug to show all uci comms

