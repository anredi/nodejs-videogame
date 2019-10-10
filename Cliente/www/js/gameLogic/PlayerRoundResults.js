
function PlayerRoundResults(roundResults)
{
    var roundResultsString = roundResults._results;
    this._results = {};
    for(var roundResultName in roundResultsString)
    {
        var roundResultString = roundResultsString[roundResultName];
        this._results[roundResultName] = new PlayerRoundResult(roundResultString);
    }
}

PlayerRoundResults.prototype.getResults = function()
{
    return this._results;
};

PlayerRoundResults.prototype.getResult = function (resultName)
{
    return this._results[resultName];
};

PlayerRoundResults.prototype.getResultValue = function(resultName)
{
    return this._results[resultName].getValue();
};


