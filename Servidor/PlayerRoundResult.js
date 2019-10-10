
function PlayerRoundResult(name, description, value)
{
    this._name = name;
    this._description = description;
    this._value = value;
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

PlayerRoundResult.prototype.setValue = function(value)
{
    this._value = value;
};

module.exports = PlayerRoundResult;


