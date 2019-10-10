function Ball(ballString)
{
    this._id = ballString._id;
    this._posX = ballString._posX;
    this._posY = ballString._posY;
    this._radius = ballString._radius;  
    this._color = ballString._color;
}

Ball.prototype.getId = function()
{
    return this._id;
};

Ball.prototype.getPosX = function()
{
    return this._posX;
};

Ball.prototype.getPosY = function()
{
    return this._posY;
};

Ball.prototype.getRadius = function()
{
    return this._radius;
};

Ball.prototype.getColor = function()
{
    return this._color;
};


