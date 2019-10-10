const PlayerRoundResult = require("./PlayerRoundResult.js");

function PlayerRoundResults()
{
    this._results = {};
    this._results["points"] = new PlayerRoundResult("points", "Points: ", 0);
    this._results["ballsEaten"] = new PlayerRoundResult("ballsEaten", "Balls: ", 0);
    this._results["playersEaten"] = new PlayerRoundResult("playersEaten", "Players: ", 0);
    this._results["bombsKilled"] = new PlayerRoundResult("bombsKilled", "Exploded: ", 0);
    this._results["deaths"] = new PlayerRoundResult("deaths", "Deaths: ", 0);
}

PlayerRoundResults.prototype.getResults = function()
{
    return this._results;
};


PlayerRoundResults.prototype.setResult = function (result)
{
    this._results[result.getName()] = result;
};

PlayerRoundResults.prototype.getResult = function (resultName)
{
    return this._results[resultName];
};

PlayerRoundResults.prototype.getResultValue = function(resultName)
{
    return this._results[resultName].getValue();
};

PlayerRoundResults.prototype.setResultValue = function(resultName,resultValue)
{
    this._results[resultName].setValue(resultValue);
};

module.exports = PlayerRoundResults;


