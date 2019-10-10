
function RoundResult(name, description, playerNick, value)
{
    this._name = name;
    this._description = description;
    this._playerNick = playerNick;
    this._value = value;
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

RoundResult.prototype.setPlayerNick = function(playerNick)
{
    this._playerNick = playerNick;
};

RoundResult.prototype.getValue = function()
{
    return this._value;
};

RoundResult.prototype.setValue = function(value)
{
    this._value = value;
};

module.exports = RoundResult;


