@echo off

rem ******** config start

set e1=coalface
set e2=released

set elo0=0
set elo1=5

set tc=20+0.2

set thisver=2.5
set lastver=2.4

set games=20000

set threads=2

rem ******** config end

iff isfile cctry.pgn then
  del cctry.pgn
endiff

iff "%e1" != "coalface" .and. "%e1" != "candidate" .and. "%e1" != "released" then
  echo no engine e1 = %e1
  quit
endiff

iff "%e2" != "coalface" .and. "%e2" != "candidate" .and. "%e2" != "released" then
  echo no engine e2 = %e2
  quit
endiff

copy /q ..\..\..\top ..

set a=%@random[1,9999999]

findstr -V ##ifdef ..\lozza.js > coalface.js
findstr -V ##ifdef ..\history\%thisver\lozza.js > candidate.js
findstr -V ##ifdef ..\history\%lastver\lozza.js > released.js

fc %e1.js %e2.js

echo coalface  ver = %thisver
echo candidate ver = %thisver
echo released  ver = %lastver

node --version
node -p process.versions.v8

set ee1=-engine conf=%e1 tc=0/%tc
set ee2=-engine conf=%e2 tc=0/%tc
set t=-event soaktest -tournament round-robin -games %games
set r=-resign movecount=3 score=400
set d=-draw movenumber=40 movecount=8 score=10
set o=-repeat -srand %a -openings file=c:\projects\lozza\trunk\testing\data\4moves_noob.epd format=epd order=random plies=16
set f=-pgnout cctry.pgn min fi
set s=-sprt elo0=%elo0 elo1=%elo1 alpha=0.05 beta=0.05
set v=-ratinginterval 10
set m=-recover -concurrency %threads

echo %e1.js v %e2.js of %games games or [%elo0,%elo1] at %tc

"C:\Program Files (x86)\Cute Chess\cutechess-cli" %ee1 %ee2 %t %r %d %o %f %v %m %s

rem add -debug to show all uci comms

