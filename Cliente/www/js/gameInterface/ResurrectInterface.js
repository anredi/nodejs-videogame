
function ResurrectInterface()
{
    this.init();
}

ResurrectInterface.prototype.getResurrectPanel = function()
{
    return this._resurrectPanel;
};

ResurrectInterface.prototype.init = function()
{
    this._resurrectPanel = document.getElementById("playerResurrectPanel");
    this._resurrectPanel.style.display = "none";
    this._resurrectButton = document.getElementById("playerResurrectButton");
    this._resurrectButton.addEventListener("click", function(){
        if(game.getActivePlayer() !== null)
        {
            game.getActivePlayer().resurrect();
            gameInterface.getResurrectInterface().getResurrectPanel().style.display = "none";
        }
    });
};


