
function main()
{
    const Server = require("./Server.js");
    var server = new Server();
    const Game = require("./Game.js");
    var game = new Game(server);
    game.startRound(game);
}

main();