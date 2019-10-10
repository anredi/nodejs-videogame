

/* global io */

function SocketInterface()
{
    this.init();
}

SocketInterface.prototype.getWebSocket = function()
{
    return this._socket;
};

SocketInterface.prototype.init = function()
{
    //this._socket = io.connect("https://192.168.43.96:3000");
    //this._socket = io.connect("https://192.168.1.128:3000");
    //this._socket = io.connect("https://desktop-7elep99:3000");
    this._socket = io.connect();
    
    this._socket.on('audio', function(data) {
        var playerNick = data.playerNick;
        gameInterface.getAudioInterface().getAudioText().innerHTML = playerNick + " is talking...";
        gameInterface.getAudioInterface().getAudioText().style.opacity = "1";
        var blob = new Blob([data.audio], { 'type' : 'audio/ogg; codecs=opus' });
        gameInterface.getAudioInterface().getAudioElement().src = window.URL.createObjectURL(blob);
        gameInterface.getAudioInterface().getAudioElement().play();
    });
    
    this._socket.on("playerLoggedIn", function(data){
         document.getElementById("forms").style.display = "none";
         document.getElementById("waitingPanel").style.display = "none";
         gameInterface.getAudioInterface().getAudioButton().style.display = "block";
         if(!game.getRoundStarted())
        {
            document.getElementById("waitingText").innerHTML = "Wait while next round starts...";
            document.getElementById("waitingPanel").style.display = "block";
        }
        gameInterface.getPlayerDataInterface().cleanLoginInputs();
    });

    this._socket.on("playerNotLoggedIn", function(message){
        document.getElementById("waitingPanel").style.display = "none";
        document.getElementById("notificationText").innerHTML = message;
        document.getElementById("notificationPanel").style.display = "block";
        gameInterface.getPlayerDataInterface().cleanLoginInputs();
    });
    
    this._socket.on("playerRegistered", function(data){
         document.getElementById("waitingPanel").style.display = "none";
         document.getElementById("notificationText").innerHTML = "Player correctly registered";
         document.getElementById("notificationPanel").style.display = "block";
         gameInterface.getPlayerDataInterface().cleanRegisterInputs();
    });
    
    this._socket.on("playerNotRegistered", function(message){
         document.getElementById("waitingPanel").style.display = "none";
         document.getElementById("notificationText").innerHTML = message;
         document.getElementById("notificationPanel").style.display = "block";
         gameInterface.getPlayerDataInterface().cleanRegisterInputs();
    });
    
    
    this._socket.on("roundTime", function(roundTime){
        document.getElementById("roundTimerPanel").style.display = "block";
        var roundTimeElement = document.getElementById("roundTime");
        if(roundTime > 0)
        {
            game.setRoundStarted(true);
            
            var totalSeconds = Math.trunc(roundTime / 1000);
            var seconds = totalSeconds % 60;
            var minutes = Math.trunc(totalSeconds / 60);
            if(minutes < 10)
            {
                minutes = "0" + minutes;
            }
            if(seconds < 10)
            {
                seconds = "0" + seconds;
            }
            roundTimeElement.innerHTML = minutes + " : " + seconds;
        }
    });
    
    this._socket.on("nextRoundTime", function(nextRoundTime){
        var nextRoundTimeElement = document.getElementById("nextRoundButton");
        if(nextRoundTime > 0)
        {
            var totalSeconds = Math.trunc(nextRoundTime / 1000);
            nextRoundTimeElement.innerHTML = "Next Round in " + totalSeconds + " seconds";
        }
    });
    
    this._socket.on("roundStarted", function(){
        game.setRoundStarted(true);
        if(game.getActivePlayer() !== null)
        {
            document.getElementById("nextRoundButton").innerHTML = "Click to Enter in the Round!";
            document.getElementById("nextRoundButton").disabled = false;
            
            document.getElementById("waitingPanel").style.display = "none";
        }
    });
    
    this._socket.on("roundStopped", function(){
        game.setRoundStarted(false);
        if(game.getActivePlayer() !== null && game.getActivePlayer().getNick() !== null)
        {
            document.getElementById("waitingText").innerHTML = "Wait while results are loading...";
            document.getElementById("waitingPanel").style.display = "block";
        }
    });
    
    this._socket.on("roundFinished", function(roundResultsString, globalResultsString){
        if(game.getActivePlayer() !== null && game.getActivePlayer().getNick() !== null)
        {
            document.getElementById("waitingPanel").style.display = "none";
            
            game.setRoundResults(new RoundResults(roundResultsString));
            game.setGlobalResults(new RoundResults(globalResultsString));
            document.getElementById("resultsPanel").style.display = "block";
            gameInterface.getResultsInterface().displayPlayerResults();
            gameInterface.getResultsInterface().displayRoundResults();
            gameInterface.getResultsInterface().displayGlobalResults();
            document.getElementById("nextRoundButton").disabled = true;
            gameInterface.getResurrectInterface().getResurrectPanel().style.display = "none";
            gameInterface.getResizeInterface().resizeResultsInterface();
        }
    });
    
    this._socket.on("board", function(board){
        game.setBoard(board);
    });
    
    this._socket.on("balls", function(balls){
        for(var ballId in balls)
        {
            if (balls.hasOwnProperty(ballId))
            {
                var ball = new Ball(balls[ballId]);
                game.getBalls()[ballId] = ball;
            }
        }
    });


    this._socket.on('newBall',function(ballString){
        var ball = new Ball(ballString);
        game.getBalls()[ball.getId()] = ball;
    });


    this._socket.on('deletedBall',function(ballId){  
        delete game.getBalls()[ballId]; 
    });
    
    this._socket.on("newPlayerImgString", function(data){
        var playerId = data.playerId;
        var playerImgString = data.playerImgString;

        var playerImg = new Image();
        playerImg.src = playerImgString;
        game.getPlayersImg()[playerId] = playerImg;
    });
    
    this._socket.on("playersImgString", function(playersImgString){
        for(var playerId in playersImgString)
        {
            var playerImgString = playersImgString[playerId];

            var playerImg = new Image();
            playerImg.src = playerImgString;
            game.getPlayersImg()[playerId] = playerImg;
        }
    });

    this._socket.on('players',function(players){
        for(var playerId in players)
        {
            if (players.hasOwnProperty(playerId))
            {
                var playerString = players[playerId];
                var player;
                if(typeof playerString._explosionRadius === "undefined")
                {
                    player = new Player(playerString);
                }else{
                    player = new Bomb(playerString);
                }
                game.getPlayers()[playerId] = player;
            }
        }

        gameInterface.getSocketInterface().getWebSocket().on('newPlayer',function(data){				
            var playerString = data.newPlayer;
            var newPlayer;
            if(typeof playerString._explosionRadius === "undefined")
            {
                newPlayer = new Player(playerString);
            }else{
               newPlayer = new Bomb(playerString);
            }
            
            if(data.isActive)
            {
                document.getElementById("waitingPanel").style.display = "none";
                document.getElementById("forms").style.display = "block";
                
                game.setActivePlayer(newPlayer);  
                gameInterface.getDrawingInterface().updateDrawing();
                gameInterface.getSocketInterface().getWebSocket().on("playersPlayed", function(){  
                    gameInterface.getDrawingInterface().updateDrawing();
                    gameInterface.getRankingInterface().showRanking();
                });
            }

            game.getPlayers()[newPlayer.getId()] = newPlayer;
        });

        gameInterface.getSocketInterface().getWebSocket().on('playerPlayed',function(playerString){
            var updatedPlayer;
            if(!playerString.hasOwnProperty("_explosionRadius"))
            {
                updatedPlayer = new Player(playerString);  
            }else{
                updatedPlayer = new Bomb(playerString);
            }

            delete game.getPlayers()[updatedPlayer.getId()];
            game.getPlayers()[updatedPlayer.getId()] = updatedPlayer;
            if(game.getActivePlayer() !== null && game.getActivePlayer().getId() === updatedPlayer.getId())
            {
                game.setActivePlayer(updatedPlayer);
            }
        });
        
        gameInterface.getSocketInterface().getWebSocket().on('deadPlayer',function(playerId){		
            var activePlayer = game.getActivePlayer();
            if(activePlayer !== null && playerId === activePlayer.getId())
            {
                gameInterface.getResurrectInterface().getResurrectPanel().style.display = "block";
            }
        });

        gameInterface.getSocketInterface().getWebSocket().on('deletedPlayer',function(playerId){		
            delete game.getPlayers()[playerId];
        });

        gameInterface.getSocketInterface().getWebSocket().emit("readyPlayer", {windowWidth: window.innerWidth, windowHeight: window.innerHeight});
    });
};


