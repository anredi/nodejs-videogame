function RoundResults(roundResults)
{
    var roundResultsString = roundResults._results;
    this._results = {};
    for(var roundResultName in roundResultsString)
    {
        var roundResultString = roundResultsString[roundResultName];
        this._results[roundResultName] = new RoundResult(roundResultString);
    }
}

RoundResults.prototype.getResults = function()
{
    return this._results;
};

RoundResults.prototype.getResult = function (resultName)
{
    return this._results[resultName];
};

RoundResults.prototype.getResultValue = function(resultName)
{
    return this._results[resultName].getValue();
};

RoundResults.prototype.getResultPlayerNick = function(resultName)
{
    return this._results[resultName].getPlayerNick();
};


