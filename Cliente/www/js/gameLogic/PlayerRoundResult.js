
function PlayerRoundResult(roundResultString)
{
    this._name = roundResultString._name;
    this._description = roundResultString._description;
    this._value = roundResultString._value;
}

PlayerRoundResult.prototype.getName = function()
{
    return this._name;
};

PlayerRoundResult.prototype.getDescription = function()
{
    return this._description;
};

PlayerRoundResult.prototype.getValue = function()
{
    return this._value;
};


