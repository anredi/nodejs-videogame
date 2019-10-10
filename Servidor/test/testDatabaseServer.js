const Server = require("../Server.js");
const Game = require("../Game.js");
global.server = new Server();
global.game = new Game(global.server);

var assert = require('assert');
const DatabaseServer = require("../DatabaseServer.js");
const Player = require("../Player.js");
const PlayerRoundResults = require("../PlayerRoundResults.js");

describe("DatabaseServer", function(){
    var databaseServer, dbConnection;
    before(function(done){
        databaseServer = new DatabaseServer();
        databaseServer.connect(function(err, db){
            if(err)
            {
                return done(err);
            }
            dbConnection = db;
            done();
        });
    });
    
    describe("#findPlayer(db, nick, password, callback)", function(){
        before(function(done){
            databaseServer.registerPlayer(dbConnection, "player1", "123", null, function(err, playerFound){
                done();
            });
        });
        after(function(done){
            dbConnection.collection("players").remove({nick: "player1"},function(err, data){
               done();
            });
        });
        it("si busca un jugador que no existe, devuelve null", function(done){
            var nick = "abcdefghijk";
            var password = "abcdefghijk";
            databaseServer.findPlayer(dbConnection, nick, password, function(err, playerFound){
                if(playerFound === null)
                {
                    done();
                }else{
                    return done("error");
                }
            });
        });
        
        it("si busca un jugador que existe, pero la contraseña no coincide, devuelve null", function(done){
            var nick = "player1";
            var password = "abcdefghijk";
            databaseServer.findPlayer(dbConnection, nick, password, function(err, playerFound){
                if(playerFound === null)
                {
                    done();
                }else{
                    return done("error");
                }
            });
        });
        
        it("si busca un jugador que existe, y coincide la contraseña, devuelve el jugador encontrado", function(done){
            var nick = "player1";
            var password = "123";
            databaseServer.findPlayer(dbConnection, nick, password, function(err, playerFound){
                if(playerFound !== null && playerFound.nick === nick && playerFound.password === password)
                {
                    done();
                }else{
                    return done("error");
                }
            });
        });
    });
    
    describe("#findBots()", function(){
        it("debería devolver los bots que existen en el juego", function(done){
            databaseServer.findBots(dbConnection, function(err, playersFound){
                if(playersFound === null || playersFound.length !== global.game.getConfiguration().getMaxNumBots())
                {
                    return done("error");
                }
                
                done();
            });
        });
    });
    
    describe("#storePlayerRoundResult(db, player, activeRound, callback)", function(){
        var player1;
        beforeEach(function(done){
            player1 = new Player(global.game);
            player1.setNick("player1");
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player1.setRadius(player1Radius);
            player1.setPosX(player1PosX);
            player1.setPosY(player1PosY);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 100);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            player1.setAlive(true);
            
            databaseServer.registerPlayer(dbConnection, player1.getNick(), "123", null, function(err, playerFound){
                 done();
            });
        });
        it("debería guardar una ronda de un jugador si el jugador existe", function(done){
            var roundName = "round1";
            databaseServer.storePlayerRoundResult(dbConnection, player1, roundName, function(err){
                dbConnection.collection("players").findOne({nick: player1.getNick(), "rounds.roundId": roundName}, function(err, playerFound){
                    if(playerFound !== null)
                    {
                        dbConnection.collection("players").remove({nick: player1.getNick()},function(err, data){
                            done();
                        });
                    }else{
                        return done("error");
                    }
                });
            });
        });
    });
    
    describe("#loadGlobalRoundResult(db, roundResultName, callback)", function(){
        var player1, player2;
        before(function(done){
            player1 = new Player(global.game);
            player1.setNick("player1");
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player1.setRadius(player1Radius);
            player1.setPosX(player1PosX);
            player1.setPosY(player1PosY);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 50);
            player1.getRoundResults().setResultValue("playersEaten", 10);
            player1.setAlive(true);
            
            player2 = new Player(global.game);
            player2.setNick("player2");
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player1.setRadius(player1Radius);
            player1.setPosX(player1PosX);
            player1.setPosY(player1PosY);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 100);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            player1.setAlive(true);
            
            databaseServer.registerPlayer(dbConnection, player1.getNick(), "123", null, function(err, playerFound){
                databaseServer.registerPlayer(dbConnection, player2.getNick(), "123", null, function(err, playerFound){
                    done();
                });
            });
        });
        it("debería devolver quien tiene el mayor resultado global en el campo especificado por roundResultName", function(done){
            var roundName1 = "round1";
            var roundName2 = "round2";
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 50);
            player1.getRoundResults().setResultValue("playersEaten", 10);
            
            player2.setRoundResults(new PlayerRoundResults());
            player2.getRoundResults().setResultValue("points", 50);
            player2.getRoundResults().setResultValue("playersEaten", 10);
            
            databaseServer.storePlayerRoundResult(dbConnection, player1, roundName1, function(err){
                databaseServer.storePlayerRoundResult(dbConnection, player2, roundName1, function(err){
                    player1.setRoundResults(new PlayerRoundResults());
                    player1.getRoundResults().setResultValue("points", 100);
                    player1.getRoundResults().setResultValue("playersEaten", 2);

                    player2.setRoundResults(new PlayerRoundResults());
                    player2.getRoundResults().setResultValue("points", 20);
                    player2.getRoundResults().setResultValue("playersEaten", 10);
                    databaseServer.storePlayerRoundResult(dbConnection, player1, roundName2, function(err){
                        databaseServer.storePlayerRoundResult(dbConnection, player2, roundName2, function(err){
                            databaseServer.loadGlobalRoundResult(dbConnection, "points", function(gResultPoints){
                                databaseServer.loadGlobalRoundResult(dbConnection, "playersEaten", function(gResultPlayersEaten){
                                    if(gResultPoints.nick === "player1" && gResultPlayersEaten.nick === "player2")
                                    {
                                         dbConnection.collection("players").remove({nick: player1.getNick()},function(err, data){
                                             dbConnection.collection("players").remove({nick: player2.getNick()},function(err, data){
                                                done();
                                            });
                                         });
                                    }else{
                                        return done("error");
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


