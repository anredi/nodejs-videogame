
function ResultsInterface()
{
    this.init();
}

ResultsInterface.prototype.getResultsPanel = function()
{
    return this._resultsPanel;
};

ResultsInterface.prototype.displayPlayerResults = function()
{
    var playerResultsTable = document.getElementById("playerResultsTable");
    var playerResults = game.getActivePlayer().getRoundResults().getResults();
    var playerResultsNames = Object.keys(playerResults);
    var playerResultsLength = playerResultsNames.length;
    var playerResultsString = "";
    for(var i = 0; i < playerResultsLength; i++)
    {
        var playerResult = playerResults[playerResultsNames[i]];
        playerResultsString = playerResultsString + "<tr><td class='resultDesc'>" + playerResult.getDescription() +
                "</td><td class='resultValue'>" + playerResult.getValue() + "</td></tr>";
    }
    playerResultsTable.innerHTML = playerResultsString;
};

ResultsInterface.prototype.displayRoundResults = function()
{
    var roundResultsTable = document.getElementById("roundResultsTable");
    var roundResults = game.getRoundResults().getResults();
    var roundResultsNames = Object.keys(roundResults);
    var roundResultsLength = roundResultsNames.length;
    var roundResultsString = "";
    for(var i = 0; i < roundResultsLength; i++)
    {
        var roundResult = roundResults[roundResultsNames[i]];
        roundResultsString = roundResultsString + "<tr><td class='resultDesc'>" + roundResult.getDescription() +
                "</td><td class='resultValue'>" + roundResult.getPlayerNick() + " (" + roundResult.getValue() + ")</td></tr>";
    }
    roundResultsTable.innerHTML = roundResultsString;
};

ResultsInterface.prototype.displayGlobalResults = function()
{
    var globalResultsTable = document.getElementById("globalResultsTable");
    var globalResults = game.getGlobalResults().getResults();
    var globalResultsNames = Object.keys(globalResults);
    var globalResultsLength = globalResultsNames.length;
    var globalResultsString = "";
    for(var i = 0; i < globalResultsLength; i++)
    {
        var globalResult = globalResults[globalResultsNames[i]];
        globalResultsString = globalResultsString + "<tr><td class='resultDesc'>" + globalResult.getDescription() +
                "</td><td class='resultValue'>" + globalResult.getPlayerNick() + " (" + globalResult.getValue() + ")</td></tr>";
    }
    globalResultsTable.innerHTML = globalResultsString;
};

ResultsInterface.prototype.init = function()
{
    this._resultsPanel = document.getElementById("resultsPanel");
    this._resultsPanel.style.display = "none";
    document.getElementById("nextRoundButton").addEventListener("click", function(){
        game.getActivePlayer().resurrect();
        gameInterface.getResultsInterface().getResultsPanel().style.display = "none";
    });
};


