/* global game, server */

const DatabaseServer = require("./DatabaseServer.js");
const Ball = require("./Ball.js");
const Player = require("./Player.js");
const Bot = require("./Bot.js");
const Bomb = require("./Bomb.js");
const PlayerRoundResults = require("./PlayerRoundResults.js");
const RoundResults = require("./RoundResults.js");
const uniqid = require('uniqid');
const events = require('events');

function Game(server)
{	
    this._server = server;
    
    const GameConfiguration = require("./GameConfiguration.js");
    this._configuration = new GameConfiguration();
    this._databaseModule = new DatabaseServer();
    
    this._roundResults = null;
    this._globalRoundResults = null;
    this._roundNumPlayers = 0;
    
    this._balls = {};
    this._players = {};
    this._playersImgString = {};
    this._numBots = 0;
    this._activeRoundId = null;
    var game = this;
    
    this.addBots();
 
    server.getWebsocketModule().on("connection",function(socket){     
        socket.emit("board", {width: game.getConfiguration().getBoardWidth(), height: game.getConfiguration().getBoardHeight()});
        socket.emit("balls", game.getBalls());
        socket.emit("players", game.getPlayers());
        socket.emit("playersImgString", game.getPlayersImgString());

        socket.on("readyPlayer", function(data){
            var player = game.addElement(game, Player, {windowWidth: data.windowWidth, windowHeight: data.windowHeight, socket: socket});
            
            socket.on("audio", function(data){
                game.broadcastChatAudio(socket, data);
            });
            
            socket.on("setWindowSize", function(data){
                game.setPlayerWindowSize(player, data);
            });
            
            socket.on("playerRegisterAttempt", function(data){
                game.registerPlayer(game, socket, data);
            });

            socket.on("playerLoginAttempt", function(data){
                game.loginPlayer(game, server, socket, player, data);
            });


            socket.on("disconnect", function(){  
                game.exitPlayer(game, server, player);
            });
        });		
    });
}


Game.prototype.getServer = function()
{
    return this._server;
};


Game.prototype.getConfiguration = function()
{
    return this._configuration;
};

Game.prototype.getDatabaseModule = function()
{
    return this._databaseModule;
};

Game.prototype.getBalls = function()
{
    return this._balls;
};

Game.prototype.getBallTimer = function()
{
    return this._ballTimer;
};

Game.prototype.setBallTimer = function(ballTimer)
{
    this._ballTimer = ballTimer;
};

Game.prototype.getPlayers = function()
{
    return this._players;
};

Game.prototype.getPlayersImgString = function()
{
    return this._playersImgString;
};



Game.prototype.getNumBots = function()
{
    return this._numBots;
};

Game.prototype.setNumBots = function(num)
{
    this._numBots = num;
};

Game.prototype.getRoundNumPlayers = function()
{
    return this._roundNumPlayers;
};

Game.prototype.setRoundNumPlayers = function(roundNumPlayers)
{
    this._roundNumPlayers = roundNumPlayers;
};

Game.prototype.getRoundTime = function()
{
    return this._roundTime;
};

Game.prototype.setRoundTime = function(roundTime)
{
    this._roundTime = roundTime;
};

Game.prototype.getNextRoundTime = function()
{
    return this._nextRoundTime;
};

Game.prototype.setNextRoundTime = function(nextRoundTime)
{
    this._nextRoundTime = nextRoundTime;
};

Game.prototype.getCurrentTime = function()
{
    return this._currentTime;
};

Game.prototype.setCurrentTime = function(currentTime)
{
    this._currentTime = currentTime;
};

Game.prototype.getRoundTimer = function()
{
    return this._roundTimer;
};

Game.prototype.setRoundTimer = function(roundTimer)
{
    this._roundTimer = roundTimer;
};

Game.prototype.getRoundUpdateTimer = function()
{
    return this._roundUpdateTimer;
};

Game.prototype.setRoundUpdateTimer = function(roundUpdateTimer)
{
    this._roundUpdateTimer = roundUpdateTimer;
};

Game.prototype.getNextRoundTimer = function()
{
    return this._nextRoundTimer;
};

Game.prototype.setNextRoundTimer = function(nextRoundTimer)
{
    this._nextRoundTimer = nextRoundTimer;
};

Game.prototype.getNextRoundUpdateTimer = function()
{
    return this._nextRoundUpdateTimer;
};

Game.prototype.setNextRoundUpdateTimer = function(nextRoundUpdateTimer)
{
    this._nextRoundUpdateTimer = nextRoundUpdateTimer;
};

Game.prototype.getRoundResults = function()
{
    return this._roundResults;
};

Game.prototype.setRoundResults = function(roundResults)
{
    this._roundResults = roundResults;
};

Game.prototype.getGlobalRoundResults = function()
{
    return this._globalRoundResults;
};

Game.prototype.setGlobalRoundResults = function(globalRoundResults)
{
    this._globalRoundResults = globalRoundResults;
};

Game.prototype.getActiveRoundId = function()
{
    return this._activeRoundId;
};

Game.prototype.setActiveRoundId = function(activeRoundId)
{
    this._activeRoundId = activeRoundId;
};


Game.prototype.getPlayTimer = function()
{
    return this._playTimer;
};

Game.prototype.setPlayTimer = function(playTimer)
{
    this._playTimer = playTimer;
};


Game.prototype.registerPlayer = function(game, socket, data)
{
    var databaseModule = game.getDatabaseModule();
    databaseModule.connect(function (err, db){
        if(err !== null)
        {
            //console.log("Connection error to database");
        }else{
            //console.log("Connected to database");
            var playerImgLocation = null;
            var imgData = null;
            if(data.imgData !== null)
            {
                var matches = data.imgData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                var extension = matches[1].split("/").pop();
                imgData = matches[2];
                playerImgLocation = "./img/" + data.nick + "." + extension;
            }
            databaseModule.registerPlayer(db, data.nick, data.password, playerImgLocation, function (err, playerFound)
            {
               if(playerFound !== undefined)
               {
                    if(playerImgLocation !== null)
                    {
                         require("./Utilities.js").writeImage(playerImgLocation, imgData, function(err){
                             socket.emit("playerRegistered");                 
                         });
                     }else{
                         socket.emit("playerRegistered");
                     }
                }else{
                    socket.emit("playerNotRegistered", "Player register error. The password is incorrect");
                }
                db.close();
            });
        }
    }); 
};


Game.prototype.loginPlayer = function(game, server, socket, player, data)
{
    var databaseModule = game.getDatabaseModule();
    databaseModule.connect(function (err, db){
        if(err !== null)
        {
            //console.log("Connection error to database");
        }else{
            //console.log("Connected to database");
            databaseModule.findPlayer(db, data.nick, data.password, function (err, playerFound)
            {
                db.close();
                var isRegistered = playerFound !== null;
                var numPlayers = game.getRoundNumPlayers();
                if(!isRegistered)
                {
                    socket.emit("playerNotLoggedIn", "Login Error. Nick or password are incorrect");
                }else if(numPlayers >= game.getConfiguration().getMaxNumPlayers()){
                    socket.emit("playerNotLoggedIn", "The room is full. Try to login later.");
                }else{
                    var playerImgLocation = playerFound.imgLocation;
                    require("./Utilities.js").readImage(playerImgLocation, function(err, playerImg){
                        player.setAlive(true);
                        player.setNick(data.nick);
                        game.setElementPosition(player);
                        player.setImgLocation(playerImgLocation);
                        if(game.getRoundTimer() !== null)
                        {
                            player.setRoundResults(new PlayerRoundResults());
                            game.setRoundNumPlayers(game.getRoundNumPlayers() + 1);
                        }
                        socket.on("acceleratePlayer", function(data){
                            player.accelerate(data.horizontalSpeed, data.verticalSpeed);
                        });

                        socket.on("resurrectPlayer", function(data){
                            player.resurrect();
                        });

                        socket.on("throwBomb", function(playerId){
                            player.throwBomb();
                        });

                        socket.emit("playerLoggedIn");

                        if(playerImg !== null)
                        {
                            var playerImgString = "data:image/jpeg;base64," + playerImg.toString('base64');
                            game.getPlayersImgString()[player.getId()] = playerImgString;
                            server.getWebsocketModule().sockets.emit("newPlayerImgString", {playerId: player.getId(), playerImgString: playerImgString});
                        }
                    });
                }
            });
        }
    });
};

Game.prototype.setPlayerWindowSize = function(player, data)
{
    player.setWindowSize(data.windowWidth, data.windowHeight);
};

Game.prototype.broadcastChatAudio = function(socket, data)
{
    socket.broadcast.emit("audio", data);
};


Game.prototype.exitPlayer = function(game, server, player)
{
    if(player !== null)
    {
        var players = game.getPlayers();
        if(players.hasOwnProperty(player.getId()))
        {
            if(player.getRoundResults() !== null)
            {
                game.setRoundNumPlayers(game.getRoundNumPlayers() - 1);
            }
            game.deletePlayer(player.getId());  
        }
        server.getWebsocketModule().sockets.emit("deletedPlayer", player.getId());
    }
};


Game.prototype.setElementPosition = function(element){
    var randomPositionX, randomPositionY;
    
    randomPositionX = element.getRadius() + Math.random() * (this.getConfiguration().getBoardWidth() - element.getRadius() * 2);
    randomPositionY = element.getRadius() + Math.random() * (this.getConfiguration().getBoardHeight() - element.getRadius() * 2);
    
    element.setPosX(randomPositionX);
    element.setPosY(randomPositionY);
};

Game.prototype.addElement = function(game, elementClass, data)
{
    var element = null;
    if(elementClass === Ball)
    {
        element = game.addBall();
    }else if(elementClass === Player){
        element = game.addPlayer(data);
    }else if(elementClass === Bot){
        element = game.addBot(data);
    }else if(elementClass === Bomb){
        element = game.addBomb(data);
    }
    return element;
};

Game.prototype.addBall = function()
{          
    var ballsId = Object.keys(this.getBalls());
    var ball = null;
    if(ballsId.length < this.getConfiguration().getMaxNumBalls())
    {
        ball = new Ball(this);
        ball.setRadius(this.getConfiguration().getBallRadius());
        this.setElementPosition(ball);

        this.getBalls()[ball.getId()] = ball;
        this.getServer().getWebsocketModule().sockets.emit("newBall", ball);
    }
    return ball;
};

Game.prototype.addPlayer = function(data)
{
    var windowWidth = data.windowWidth;
    var windowHeight = data.windowHeight;
    var socket = data.socket;
    
    var player = null;
    var players = this.getPlayers();
  
    player = new Player(this);
    player.setRadius(this.getConfiguration().getPlayerInitialRadius());
    this.setElementPosition(player);
    player.setWindowSize(windowWidth, windowHeight);
    player.setVisibleArea();
    players[player.getId()] = player;     
    socket.broadcast.emit("newPlayer", {newPlayer: player, isActive: false});
    socket.emit("newPlayer", {newPlayer: player, isActive: true});
    
    return player;
    
};

Game.prototype.addBots = function()
{
    var game = this;
    var databaseModule = this.getDatabaseModule();
    databaseModule.connect(function (err, db){
        databaseModule.findBots(db, function(err, bots){
            for(var i = 0; i < game.getConfiguration().getMaxNumBots(); i++)
            {
                game.addElement(game, Bot, bots[i]);
            }
            db.close();
        });
    });
};


Game.prototype.addBot = function(botInfo)
{
    var game = this;
    
    var player = null;
    var players = this.getPlayers();
    var numBots = this.getNumBots();
    
    if(numBots < this.getConfiguration().getMaxNumBots())
    {
        player = new Bot(this);
        player.setRadius(this.getConfiguration().getPlayerInitialRadius());
        this.setElementPosition(player);
        player.setNick(botInfo.nick);
        var playerImgLocation = botInfo.imgLocation;
        
        this.setNumBots(this.getNumBots() + 1);
        require("./Utilities.js").readImage(playerImgLocation, function(err, playerImg){
            player.setAlive(true);
            player.setImgLocation(playerImgLocation);
            if(game.getRoundTimer() !== null)
            {
                player.setRoundResults(new PlayerRoundResults());
                game.setRoundNumPlayers(game.getRoundNumPlayers() + 1);
            }
            var playerImgString = "data:image/jpeg;base64," + playerImg.toString('base64');
            game.getPlayersImgString()[player.getId()] = playerImgString;
            game.getServer().getWebsocketModule().sockets.emit("newPlayerImgString", {playerId: player.getId(), playerImgString: playerImgString});
        });
        
        players[player.getId()] = player;
        game.getServer().getWebsocketModule().sockets.emit("newPlayer", {newPlayer: player, isActive: false});
    }
    
    return player;
};

Game.prototype.addBomb = function(playerId)
{
    var bomb = null;
    if(this.getPlayers()[playerId].getCanThrowBomb())
    {
        var players = this.getPlayers();
        var player = players[playerId];

        var minDistance = player.getRadius() + this.getConfiguration().getPlayerInitialRadius() + 10;
        var posX, posY = null;
        var offsetX, offsetY = null;
        if(player.getHorizontalSpeed() === 0 && player.getVerticalSpeed() === 0)
        {
            posX = player.getPosX();
            posY = player.getPosY() + minDistance;
        }else if(player.getHorizontalSpeed() === 0){
            posX = player.getPosX();
            posY = player.getPosY() + Math.sign(player.getVerticalSpeed()) * minDistance;
        }else{
            var proportion = Math.abs(player.getVerticalSpeed()) / Math.abs(player.getHorizontalSpeed());
            offsetX = minDistance / Math.sqrt(1 + Math.pow(proportion, 2));
            offsetY = proportion * offsetX;

            posX = player.getPosX() + Math.sign(player.getHorizontalSpeed()) * offsetX;
            posY = player.getPosY() + Math.sign(player.getVerticalSpeed()) * offsetY;
        }
        if(posX - player.getRadius() >= 0 && posX + player.getRadius() <= this.getConfiguration().getBoardWidth()
                && posY - player.getRadius() >= 0 && posY + player.getRadius() <= this.getConfiguration().getBoardHeight())
        {
            bomb = new Bomb(player.getId(), this);
            bomb.setRadius(this.getConfiguration().getBombRadius());
            bomb.setAlive(true);
            bomb.setPosX(posX);
            bomb.setPosY(posY);
            bomb.setHorizontalSpeed(player.getHorizontalSpeed());
            bomb.setVerticalSpeed(player.getVerticalSpeed());
            
            bomb.setCurrentTime(new Date().getTime());
            bomb.setExplosionTime(this.getConfiguration().getBombExplosionTime());
            bomb.setAccelerateTimer(setInterval(bomb.updateAccelerateTime, 1000, this, bomb.getId()));
            bomb.setExplosionTimer(setTimeout(bomb.endExplosionTime, this.getConfiguration().getBombExplosionTime(), this, bomb.getId()));

            players[bomb.getId()] = bomb;
            players[player.getId()].setCanThrowBomb(false);
            this.getServer().getWebsocketModule().sockets.emit("newPlayer", {newPlayer: bomb, isActive: false});
        }
    }
    
    return bomb;
};


Game.prototype.loadGlobalRoundResult = function(roundResultName, callback)
{
    var game = this;
    var databaseModule = this.getDatabaseModule();
    databaseModule.connect(function (err, db){   
        game.getDatabaseModule().loadGlobalRoundResult(db, roundResultName, function(globalRoundResult){
            callback(globalRoundResult);
            db.close();
        });
    });
};

Game.prototype.loadGlobalRoundResults = function(callback)
{
    var gRoundResults = new RoundResults();
    this.setGlobalRoundResults(gRoundResults);
    var gRoundResultsArray = gRoundResults.getResults();
    var numgRoundResultsLoaded = 0;
    var numgRoundResults = Object.keys(gRoundResultsArray).length;
    var game = this;
    for(var roundResultName in gRoundResultsArray)
    {
        var eventEmitter = new events.EventEmitter();
        var loadFunction = function(roundResultName){
            game.loadGlobalRoundResult(roundResultName, function(gRoundResult){ 
                var gRoundResults = game.getGlobalRoundResults();
                gRoundResults.setResultPlayerNick(roundResultName, gRoundResult.nick);
                gRoundResults.setResultValue(roundResultName, gRoundResult.result);
                numgRoundResultsLoaded = numgRoundResultsLoaded + 1;
                if(numgRoundResultsLoaded === numgRoundResults)
                {
                    callback(gRoundResults);
                }
            });
        };
        eventEmitter.on("loadGlobalRoundResult", loadFunction);
        eventEmitter.emit("loadGlobalRoundResult", roundResultName);
    }
};


Game.prototype.calculateRoundResults = function()
{
    var players = this.getPlayers();
    var roundResults = new RoundResults();
    var roundResultsArray = roundResults.getResults();
    for(var roundResultName in roundResultsArray)
    {
        var topRoundResultValue = 0;
        var topRoundResultPlayerNick = null;
        for(var playerId in players)
        {
            var player = players[playerId];
            if(player.getRoundResults() !== null)
            {
                var playerResult = player.getRoundResults().getResult(roundResultName);
                var playerResultValue = playerResult.getValue();
                var playerNick = player.getNick();
                if(playerResultValue >= topRoundResultValue && (playerResultValue !== topRoundResultValue || topRoundResultPlayerNick === null || playerNick <= topRoundResultPlayerNick))
                {
                    topRoundResultValue = playerResultValue;
                    topRoundResultPlayerNick = playerNick;
                }
            }
        }
        roundResults.setResultValue(roundResultName, topRoundResultValue);
        roundResults.setResultPlayerNick(roundResultName, topRoundResultPlayerNick);
    }
    return roundResults;
};


Game.prototype.restartRound = function(game)
{
    game.stopRound(function(){
        game.setCurrentTime(new Date());
        game.setNextRoundTime(game.getConfiguration().getNextRoundTime());
        game.getServer().getWebsocketModule().sockets.emit("nextRoundTime", game.getNextRoundTime());
        game.setNextRoundUpdateTimer(setInterval(game.updateNextRoundTime, 1000, game));
        clearTimeout(game.getNextRoundTimer());
        game.setNextRoundTimer(setTimeout(game.startRound, game.getConfiguration().getNextRoundTime(), game));
    });   
};

Game.prototype.storePlayerRoundResult = function(player, activeRoundId, callback)
{
    var game = this;
    var databaseModule = this.getDatabaseModule();
    databaseModule.connect(function (err, db){   
        game.getDatabaseModule().storePlayerRoundResult(db, player, activeRoundId, function(err){
            callback(err);
            db.close();
        });
    });
};

Game.prototype.storeRoundResults = function(callback)
{
    var numPlayersStored = 0;
    var players = this.getPlayers();
    var activeRoundId = this.getActiveRoundId();
    for(var playerId in players)
    {
        var player = players[playerId];
        var playerResults = player.getRoundResults();
        if(playerResults !== null)
        {
            var game = this;
            this.storePlayerRoundResult(player, activeRoundId, function(err){
                numPlayersStored = numPlayersStored + 1;
                if(numPlayersStored === game.getRoundNumPlayers())
                {
                    callback(err);
                }
            });
        }
    }
};


Game.prototype.stopRound = function(callback)
{   
    this.getServer().getWebsocketModule().sockets.emit("roundStopped");
    
    clearInterval(this.getBallTimer());
    clearInterval(this.getPlayTimer());
    clearTimeout(this.getRoundTimer());
    this.setRoundTimer(null);
    clearInterval(this.getRoundUpdateTimer());
    
    var game = this;
    this.storeRoundResults(function(err){
        game.setRoundResults(game.calculateRoundResults());
        game.loadGlobalRoundResults(function(globalRoundResults){
            game.getServer().getWebsocketModule().sockets.emit("roundFinished", game.getRoundResults(), globalRoundResults);
            var balls = game.getBalls();
            var players = game.getPlayers();

            for(var ballId in balls)
            {
                if (balls.hasOwnProperty(ballId))
                {
                    var ball = balls[ballId];
                    delete ball;
                    game.getServer().getWebsocketModule().sockets.emit("deletedBall", ball);
                }
            }

            for(var playerId in players)
            {
                if (players.hasOwnProperty(playerId))
                {
                    var player = players[playerId];
                    if(player.constructor === Player)
                    {
                        if(player.getAlive() && player.getRoundResults() !== null)
                        {
                            player.reset();
                        }
                    }else if(player.constructor === Bot){
                        player.reset();
                    }else if(player.constructor === Bomb){
                        player.destroy();
                    }
                }
            }
            callback();
        });
    });
    
};



Game.prototype.startRound = function(game)
{     
    game.setActiveRoundId(uniqid());
    game.setRoundNumPlayers(0);
    
    var players = game.getPlayers();
    for(var playerId in players)
    {
        if (players.hasOwnProperty(playerId))
        {
            var player = players[playerId];
            if(player.constructor === Bot){
                player.resurrect();
            }
            if(player.constructor !== Bomb && player.getNick() !== null)
            {
                player.setRoundResults(new PlayerRoundResults());
                game.setRoundNumPlayers(game.getRoundNumPlayers() + 1);
            }
        }
    }
    
    game.setRoundTime(game.getConfiguration().getRoundTime());
    game.setCurrentTime(new Date().getTime());
    game.getServer().getWebsocketModule().sockets.emit("roundTime", game.getRoundTime());
    game.setRoundUpdateTimer(setInterval(game.updateRoundTime, 1000, game));
    game.getServer().getWebsocketModule().sockets.emit("roundStarted");
    
    clearInterval(game.getNextRoundUpdateTimer());
    
    game.setRoundTimer(setTimeout(game.restartRound, game.getConfiguration().getRoundTime(), game));
    game.setBallTimer(setInterval(game.addElement, game.getConfiguration().getAddBallTime(), game, Ball, null));
    game.setPlayTimer(setInterval(game.play, game.getConfiguration().getPlayTime(), game));
};

Game.prototype.updateRoundTime = function(game)
{
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - game.getCurrentTime();
    game.setRoundTime(game.getRoundTime() - timeElapsed);
    game.getServer().getWebsocketModule().sockets.emit("roundTime", game.getRoundTime());
    game.setCurrentTime(currentTime);
};

Game.prototype.updateNextRoundTime = function(game)
{
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - game.getCurrentTime();
    game.setNextRoundTime(game.getNextRoundTime() - timeElapsed);
    game.getServer().getWebsocketModule().sockets.emit("nextRoundTime", game.getNextRoundTime());
    game.setCurrentTime(currentTime);
};


Game.prototype.play = function(game)
{
    var players = game.getPlayers();
    for(var playerId in players)
    {
        if (players.hasOwnProperty(playerId))
        {
            var playerPlayed = players[playerId].play();
            if(playerPlayed !== null)
            {
                game.getServer().getWebsocketModule().sockets.emit("playerPlayed", playerPlayed);
            }
        }
    }
    game.getServer().getWebsocketModule().sockets.emit("playersPlayed");
};


Game.prototype.deletePlayer = function(id)
{
    delete this.getPlayers()[id];
    delete this.getPlayersImgString()[id];
};


module.exports = Game;
