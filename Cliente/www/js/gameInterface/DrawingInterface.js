
/* global Player, Bomb */

function DrawingInterface()
{
    this.init();
}

DrawingInterface.prototype.getDrawing = function()
{
    return this._drawing;
};

DrawingInterface.prototype.getScaleWidth = function()
{
    return this._scaleWidth;
};

DrawingInterface.prototype.setScaleWidth = function(scaleWidth)
{
    this._scaleWidth = scaleWidth;
};

DrawingInterface.prototype.getScaleHeight = function()
{
    return this._scaleHeight;
};

DrawingInterface.prototype.setScaleHeight = function(scaleHeight)
{
    this._scaleHeight = scaleHeight;
};

DrawingInterface.prototype.init = function()
{
    this._drawing = document.getElementById("board").getContext("2d");
    this._drawing.canvas.width = window.innerWidth;
    this._drawing.canvas.height = window.innerHeight;
    this._scaleWidth = null;
    this._scaleHeight = null;
};

DrawingInterface.prototype.updateDrawing = function()
{
    this._scaleWidth = window.innerWidth / (game.getActivePlayer().getVisibleAreaX2() - game.getActivePlayer().getVisibleAreaX1());
    this._scaleHeight = window.innerHeight / (game.getActivePlayer().getVisibleAreaY2() - game.getActivePlayer().getVisibleAreaY1());
    this.deleteDrawing();
    this.showGrid();
    this.showBoardLimits();
    this.showBalls();
    this.showPlayers();
};

DrawingInterface.prototype.showGrid = function()
{   
    var gridSize = 50;
    var verticalLineX = gridSize - (game.getActivePlayer().getPosX() * this._scaleWidth) % gridSize;
    var horizontalLineY = gridSize - (game.getActivePlayer().getPosY() * this._scaleHeight) % gridSize;
    
    while(verticalLineX <= window.innerWidth)
    {
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.moveTo(verticalLineX, 0);
        this._drawing.lineTo(verticalLineX, window.innerHeight);
        this._drawing.strokeStyle = "#A9A9A9";
        this._drawing.stroke();
        this._drawing.closePath();
        this._drawing.restore();

        verticalLineX = verticalLineX + gridSize;
    }
    
    while(horizontalLineY <= window.innerHeight)
    {
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.moveTo(0, horizontalLineY);
        this._drawing.lineTo(window.innerWidth, horizontalLineY);
        this._drawing.strokeStyle = "#A9A9A9";
        this._drawing.stroke();
        this._drawing.closePath();
        this._drawing.restore();

        horizontalLineY = horizontalLineY + gridSize;
    }
};

DrawingInterface.prototype.showBoardLimits = function()
{   
    var boardLimitX1 = - game.getActivePlayer().getVisibleAreaX1() * this._scaleWidth;
    var boardLimitX2 = (game.getBoard().width - game.getActivePlayer().getVisibleAreaX1()) * this._scaleWidth;
    var boardLimitY1 = - game.getActivePlayer().getVisibleAreaY1() * this._scaleHeight;
    var boardLimitY2 = (game.getBoard().height - game.getActivePlayer().getVisibleAreaY1()) * this._scaleHeight;
    
    if(boardLimitX1 >= 0)
    {
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.moveTo(boardLimitX1, boardLimitY1);
        this._drawing.lineTo(boardLimitX1, boardLimitY2);
        this._drawing.strokeStyle = "black";
        this._drawing.stroke();
        this._drawing.closePath();
        this._drawing.restore();
    }
    
    if(boardLimitX2 <= window.innerWidth)
    {
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.moveTo(boardLimitX2, boardLimitY1);
        this._drawing.lineTo(boardLimitX2, boardLimitY2);
        this._drawing.strokeStyle = "black";
        this._drawing.stroke();
        this._drawing.closePath();
        this._drawing.restore();
    }
    
    if(boardLimitY1 >= 0)
    {
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.moveTo(boardLimitX1, boardLimitY1);
        this._drawing.lineTo(boardLimitX2, boardLimitY1);
        this._drawing.strokeStyle = "black";
        this._drawing.stroke();
        this._drawing.closePath();
        this._drawing.restore();
    }
    
    if(boardLimitY2 <= window.innerHeight)
    {
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.moveTo(boardLimitX1, boardLimitY2);
        this._drawing.lineTo(boardLimitX2, boardLimitY2);
        this._drawing.strokeStyle = "black";
        this._drawing.stroke();
        this._drawing.closePath();
        this._drawing.restore();
    }
};


DrawingInterface.prototype.showBalls = function()
{ 
    var ballPosX;
    var ballPosY;
    var ballRadius;
    for(var ballId in game.getBalls())
    {
        if (game.getBalls().hasOwnProperty(ballId))
        {
            ballPosX = game.getBalls()[ballId].getPosX();
            ballPosY = game.getBalls()[ballId].getPosY();
            ballRadius = game.getBalls()[ballId].getRadius();
            if(ballPosX >= game.getActivePlayer().getVisibleAreaX1() && ballPosX <= game.getActivePlayer().getVisibleAreaX2()
                            && ballPosY >= game.getActivePlayer().getVisibleAreaY1() && ballPosY <= game.getActivePlayer().getVisibleAreaY2())
            {
                this._drawing.save();
                this._drawing.beginPath();
                this._drawing.arc((ballPosX - game.getActivePlayer().getVisibleAreaX1()) * this._scaleWidth,(ballPosY - game.getActivePlayer().getVisibleAreaY1()) * this._scaleHeight,ballRadius * this._scaleHeight,0,2*Math.PI);
                this._drawing.fillStyle = game.getBalls()[ballId].getColor();
                this._drawing.strokeStyle = "black";
                this._drawing.fill();
                this._drawing.stroke();
                this._drawing.closePath();
                this._drawing.restore();
            }
        }
    }
};

DrawingInterface.prototype.showPlayers = function()
{  
    for(var playerId in game.getPlayers())
    {			
        if (game.getPlayers().hasOwnProperty(playerId))
        {
            var player = game.getPlayers()[playerId];
            if(player.constructor === Player)
            {
                this.showPlayer(player);
            }else if(player.constructor === Bomb){
                this.showBomb(player);
            }
        }
    }
};

DrawingInterface.prototype.showPlayer = function(player)
{
    if(player.getAlive() && player.getPosX() + player.getRadius() > game.getActivePlayer().getVisibleAreaX1() && player.getPosX() - player.getRadius() < game.getActivePlayer().getVisibleAreaX2()
    && player.getPosY() + player.getRadius() > game.getActivePlayer().getVisibleAreaY1() && player.getPosY() - player.getRadius() < game.getActivePlayer().getVisibleAreaY2())
    {
        var playerPosXDrawing = (player.getPosX() - game.getActivePlayer().getVisibleAreaX1()) * this._scaleWidth;
        var playerPosYDrawing = (player.getPosY() - game.getActivePlayer().getVisibleAreaY1()) * this._scaleHeight;
        var playerRadiusDrawing = player.getRadius() * this._scaleWidth;

        if(game.getPlayersImg()[player.getId()])
        {
            this._drawing.save();
            this._drawing.beginPath();
            this._drawing.arc(playerPosXDrawing,playerPosYDrawing,playerRadiusDrawing,0,2*Math.PI);
            this._drawing.strokeStyle = "black";
            this._drawing.lineWidth = 3;
            this._drawing.stroke();
            this._drawing.closePath();            
            this._drawing.clip();
            this._drawing.drawImage(game.getPlayersImg()[player.getId()], playerPosXDrawing - playerRadiusDrawing, playerPosYDrawing - playerRadiusDrawing, playerRadiusDrawing * 2, playerRadiusDrawing * 2);
            this._drawing.restore();
        }else{
            this._drawing.save();
            this._drawing.beginPath();
            this._drawing.arc(playerPosXDrawing,playerPosYDrawing,playerRadiusDrawing,0,2*Math.PI);
            this._drawing.strokeStyle = "black";
            this._drawing.lineWidth = 5;
            this._drawing.stroke();
            this._drawing.fillStyle = player.getColor();
            this._drawing.fill();
            this._drawing.closePath();
            this._drawing.restore();
       }

        var playerNickFont = playerRadiusDrawing / 2;
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.strokeStyle = "black";
        this._drawing.lineWidth = 5;
        this._drawing.font = playerNickFont + "px Arial";
        this._drawing.fillStyle = "white";
        this._drawing.textAlign = "center";
        this._drawing.strokeText(player.getNick(), playerPosXDrawing, playerPosYDrawing);
        this._drawing.fillText(player.getNick(), playerPosXDrawing, playerPosYDrawing);
        this._drawing.closePath();  
        this._drawing.restore();
    }
};

DrawingInterface.prototype.showBomb = function(bomb)
{
    var bombPosXDrawing = (bomb.getPosX() - game.getActivePlayer().getVisibleAreaX1()) * this._scaleWidth;
    var bombPosYDrawing = (bomb.getPosY() - game.getActivePlayer().getVisibleAreaY1()) * this._scaleHeight;
    var bombRadiusDrawing;
    
    if(bomb.getAlive() && !bomb.getIsDestroyed() && bomb.getPosX() + bomb.getRadius() > game.getActivePlayer().getVisibleAreaX1() && bomb.getPosX() - bomb.getRadius() < game.getActivePlayer().getVisibleAreaX2()
    && bomb.getPosY() + bomb.getRadius() > game.getActivePlayer().getVisibleAreaY1() && bomb.getPosY() - bomb.getRadius() < game.getActivePlayer().getVisibleAreaY2())
    {      
        bombRadiusDrawing = bomb.getRadius() * this._scaleWidth;
        
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.arc(bombPosXDrawing, bombPosYDrawing, bombRadiusDrawing,0,2*Math.PI);
        this._drawing.stroke();
        this._drawing.fillStyle = "#000000";
        this._drawing.fill();
        this._drawing.closePath();
        this._drawing.restore();
        
        var bombTimeFont = bombRadiusDrawing;
        var bombTime = Math.trunc(bomb.getExplosionTime()/1000);
        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.strokeStyle = "black";
        this._drawing.lineWidth = 5;
        this._drawing.font = bombTimeFont + "px Arial";
        this._drawing.fillStyle = "red";
        this._drawing.textAlign = "center";
        this._drawing.strokeText(bombTime, bombPosXDrawing, bombPosYDrawing + bombTimeFont /3);
        this._drawing.fillText(bombTime, bombPosXDrawing, bombPosYDrawing + bombTimeFont/3);
        this._drawing.closePath();  
        this._drawing.restore();
    }else if(!bomb.getAlive() && !bomb.getIsDestroyed() && bomb.getPosX() + bomb.getExplosionRadius() > game.getActivePlayer().getVisibleAreaX1() && bomb.getPosX() - bomb.getExplosionRadius() < game.getActivePlayer().getVisibleAreaX2()
    && bomb.getPosY() + bomb.getExplosionRadius() > game.getActivePlayer().getVisibleAreaY1() && bomb.getPosY() - bomb.getExplosionRadius() < game.getActivePlayer().getVisibleAreaY2()){

        bombRadiusDrawing = bomb.getExplosionRadius() * this._scaleWidth;

        this._drawing.save();
        this._drawing.beginPath();
        this._drawing.arc(bombPosXDrawing, bombPosYDrawing, bombRadiusDrawing,0,2*Math.PI);
        this._drawing.stroke();
        this._drawing.closePath();
        this._drawing.restore();
    }
};

DrawingInterface.prototype.deleteDrawing = function()
{
    this._drawing.clearRect(0, 0, this._drawing.canvas.width, this._drawing.canvas.height);
};

