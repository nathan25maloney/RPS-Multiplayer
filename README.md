# RPS-Multiplayer

This is probably my favorite application so far.  I have hosted it on github pages at https://nathan25maloney.github.io/RPS-Multiplayer/.

This application is a online two person multiplayer using firebase to store the players name, chat messages and game moves.  It was originally going to be just rock paper scissors but I took the ideas from Dr. Sheldon Cooper and expanded the game to rock paper scissors lizard spock.  

The biggest challenge I faced when making this application was getting the players to be removed from the game when they left the page.  This was solved using the window.onbeforeunload function to tell the firebase database to reset that player to being empty.  After both players have left it will also clear out the chat message board.
