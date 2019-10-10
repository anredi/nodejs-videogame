
/* global Player */

function RankingInterface()
{
    this.init();
}

RankingInterface.prototype.getRankingPanel = function()
{
    return this._rankingPanel;
};

RankingInterface.prototype.getRankingList = function()
{
    return this._rankingList;
};

RankingInterface.prototype.getRankingButton = function()
{
    return this._rankingButton;
};

RankingInterface.prototype.getRankingDeployed = function()
{
    return this._rankingDeployed ;
};

RankingInterface.prototype.setRankingDeployed = function(rankingDeployed)
{
    this._rankingDeployed = rankingDeployed;
};

RankingInterface.prototype.getRankingTopSize = function()
{
    return this._rankingTopSize;
};

RankingInterface.prototype.setRankingTopSize = function(rankingTopSize)
{
    return this._rankingTopSize = rankingTopSize;
};

RankingInterface.prototype.init = function()
{
    this._rankingPanel = document.getElementById("rankingPanel");
    this._rankingPanel.style.left = (window.innerWidth - 270) + "px";
    this._rankingList = document.getElementById("rankingList");
    this._rankingButton = document.getElementById("rankingButton");
    this._rankingDeployed = false;
    this._rankingTopSize = 5;
    this._rankingButton.onclick = function (){
        if(gameInterface.getRankingInterface().getRankingDeployed())
        {
            gameInterface.getRankingInterface().setRankingDeployed(false);
            gameInterface.getRankingInterface().getRankingList().style.height = "90px";
            gameInterface.getRankingInterface().getRankingButton().innerHTML = "&#x25BC;";
        }else{
            gameInterface.getRankingInterface().setRankingDeployed(true);
            gameInterface.getRankingInterface().getRankingList().style.height = "200px";
            gameInterface.getRankingInterface().getRankingButton().innerHTML = "&#x25B2;";
        }
        gameInterface.getRankingInterface().showRanking();
    };
};

RankingInterface.prototype.showRanking = function()
{
    gameInterface.getRankingInterface().getRankingPanel().style.display = "block";
    var rankingList = document.getElementById("rankingList");
    
    var players = game.getPlayers();
    
    var playerValues = [];
    for(var playerId in players)
    {
        if(players[playerId].getRoundResults() !== null)
        {
            playerValues.push(players[playerId]);
        }
    }
    
    var orderedPlayers = playerValues.sort(function(player1,player2) {
        var player1Points = player1.getRoundResults().getResultValue("points");
        var player2Points = player2.getRoundResults().getResultValue("points");
        var returnedValue ;
        if (player1Points < player2Points || (player1Points === player2Points && player1.getNick() > player2.getNick())) 
        {
           returnedValue = -1;
        }else{
           returnedValue = 1;
        }
        
        return returnedValue;
    });
        
    var rankingHTML = "";
    var playerListPosition = 1;
    for(var i = orderedPlayers.length - 1; i >= 0; i--)
    {			
        var player = orderedPlayers[i];
        if(player.constructor === Player && player.getAlive())
        {
            if(gameInterface.getRankingInterface().getRankingDeployed() || (!gameInterface.getRankingInterface().getRankingDeployed() && (playerListPosition <= gameInterface.getRankingInterface().getRankingTopSize() || player.getId() === game.getActivePlayer().getId())))
            {
                if(player.getId() === game.getActivePlayer().getId())
                {
                    rankingHTML = rankingHTML + "<li id='rankingActivePlayer'>" ;
                }else{
                    rankingHTML = rankingHTML + "<li>";
                }
                rankingHTML = rankingHTML + "<span class='rankingPlayers'>" + playerListPosition + ". " + player.getNick() + ": </span> <span class='rankingPoints'>" + player.getRoundResults().getResultValue("points") + "</span> </li>";
            }
            playerListPosition++;
        }   
    }
    rankingList.innerHTML = rankingHTML;
};


