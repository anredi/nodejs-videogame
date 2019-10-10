
function ThrowBombInterface()
{
    this.init();
}


ThrowBombInterface.prototype.throwBomb = function()
{
    if(game.getActivePlayer() !== null && game.getActivePlayer().getAlive() && game.getRoundStarted())
    {
        gameInterface.getSocketInterface().getWebSocket().emit("throwBomb", game.getActivePlayer().getId());
    }
};


ThrowBombInterface.prototype.init = function()
{
    window.addEventListener("keyup", function(e){
        if(e.keyCode === 32)
        {
            gameInterface.getThrowBombInterface().throwBomb();
        }
    });
};


