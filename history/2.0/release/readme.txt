Lozza v2.0a Licenced under GPL v3

1. Install Nodejs.

For Windows go to https://nodejs.org. For Linux use "sudo apt install nodejs".
Nodejs is available for most platforms including Mac and even Raspberry Pi. Use an internet
search to find out how to install it on your platform.

2. Add Lozza to your chess UI.

This is a little bit different to other engines. Edit the lozza.bat
file contained in the release to point at the Nodejs executable with lozza.js as a parameter.
Full paths are recommended. For example:-

 "c:\program files\nodejs\node.exe" c:\path\to\lozza.js

Then use lozza.bat as the engine target; similarly for Linux/Mac etc.

On Windows, modern versions of Nodejs require Windows version 8.1 or later. To run Lozza on
Windows 7 please contact me for a hack.

Have fun!

Colin Jenkins
op12no2@gmail.com
https://github.com/op12no2/lozza

PS: You can also use Lozza from the command line, Start node.exe with lozza.js as a parameter.
For example:-

cd <path to lozza.js>
"c:\program files\nodejs\node.exe" lozza.js

Then you can enter UCI commands. Use quit to exit. b displays the board. eval shows a static
evaluation. See https://op12no2.github.io/lozza-ui/consolehelp.htm for other command
extensions.

