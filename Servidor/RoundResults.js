const RoundResult = require("./RoundResult.js");

function RoundResults()
{
    this._results = {};
    this._results["points"] = new RoundResult("points", "Points: ", null, null);
    this._results["ballsEaten"] = new RoundResult("ballsEaten", "Balls: ", null, null);
    this._results["playersEaten"] = new RoundResult("playersEaten", "Players: ", null, null);
    this._results["bombsKilled"] = new RoundResult("bombsKilled", "Exploded: ", null, null);
    this._results["deaths"] = new RoundResult("deaths", "Deaths: ", null, null);
}

RoundResults.prototype.getResults = function()
{
    return this._results;
};

RoundResults.prototype.setResult = function (result)
{
    this._results[result.getName()] = result;
};

RoundResults.prototype.getResult = function (resultName)
{
    return this._results[resultName];
};

RoundResults.prototype.getResultPlayerNick = function(resultName)
{
    return this._results[resultName].getPlayerNick();
};

RoundResults.prototype.setResultPlayerNick = function(resultName,resultPlayerNick)
{
    this._results[resultName].setPlayerNick(resultPlayerNick);
};

RoundResults.prototype.getResultValue = function(resultName)
{
    return this._results[resultName].getValue();
};

RoundResults.prototype.setResultValue = function(resultName,resultValue)
{
    this._results[resultName].setValue(resultValue);
};

module.exports = RoundResults;


