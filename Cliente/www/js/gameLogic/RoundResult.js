
function RoundResult(roundResultString)
{
    this._name = roundResultString._name;
    this._description = roundResultString._description;
    this._playerNick = roundResultString._playerNick;
    this._value = roundResultString._value;
}

RoundResult.prototype.getName = function()
{
    return this._name;
};

RoundResult.prototype.getDescription = function()
{
    return this._description;
};

RoundResult.prototype.getPlayerNick = function()
{
    return this._playerNick;
};

RoundResult.prototype.getValue = function()
{
    return this._value;
};


