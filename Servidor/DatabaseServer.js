/* global assert, server */


function DatabaseServer()
{
    this._user = "antonio";
    this._password = "password";
}


DatabaseServer.prototype.connect = function (callback){
    var MongoClient = require('mongodb').MongoClient;

    f = require('util').format;
    var user = encodeURIComponent(this._user);
    var password = encodeURIComponent(this._password);

    var url = f('mongodb://%s:%s@127.0.0.1:27017/webgamedb?authMechanism=%s',
      user, password, "DEFAULT");

    MongoClient.connect(url, function(err, db) {
      callback(err, db);
    });
};


DatabaseServer.prototype.findPlayer = function(db, nick, password, callback){
    var collection = db.collection('players');
    collection.findOne({"nick": nick, "password": password},function(err, playerFound) {
        callback(err,playerFound);
    }); 
};

DatabaseServer.prototype.findBots = function(db, callback){
    var collection = db.collection('players');
    collection.find({password: {$exists: false}},function(err, playersFoundCursor) {
        playersFoundCursor.toArray(function(err, playersFound){
            callback(err,playersFound);
        });
    }); 
};

DatabaseServer.prototype.playerRoundResultsToStore = function(roundId, playerRoundResults)
{
    var playerRoundResultsToStore = {};
    playerRoundResultsToStore["roundId"] = roundId;
    for(var resultName in playerRoundResults)
    {
        playerRoundResultsToStore[resultName] = playerRoundResults[resultName].getValue();
    }
    return playerRoundResultsToStore;
};

DatabaseServer.prototype.storePlayerRoundResult = function(db, player, activeRoundId, callback)
{
    var collection = db.collection('players');
    var playerRoundResultsToStore = this.playerRoundResultsToStore(activeRoundId, player.getRoundResults().getResults());
    collection.update({nick: player.getNick()}, {$addToSet: {rounds: playerRoundResultsToStore}}, function(err){
        callback(err);
    });
};

DatabaseServer.prototype.loadGlobalRoundResult = function(db, roundResultName, callback)
{
    var collection = db.collection('players');
    var resultsToSum = "$rounds." + roundResultName;
    collection.aggregate([{$project:{nick: 1, result: {$sum: resultsToSum}}}, {$sort: {result: -1, nick: 1}}], function(err, gRoundResultsCursor){
        var gRoundResult = gRoundResultsCursor[0];
        callback(gRoundResult);
    });
};

DatabaseServer.prototype.registerPlayer = function(db, nick, password, imgLocation, callback){
    var collection = db.collection("players");
    collection.updateOne({nick: nick, password: password}, {$set: {imgLocation: imgLocation}, $setOnInsert: {nick: nick, password: password}}, {upsert: true}, function(err, playerFound){
        callback(err,playerFound);
    });
};

module.exports = DatabaseServer;

