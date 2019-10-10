function Server()
{
    const ServerConfiguration = require("./ServerConfiguration.js");
    this._configuration = new ServerConfiguration();
    
    var express = require("express");
    this._webAppModule = express();
    var fs = require('fs');
    var options = {
        key: fs.readFileSync("./sslcert/server.key"),
        cert: fs.readFileSync("./sslcert/server.crt"),
        requestCert: false,
        rejectUnauthorized: false
    };
    this._httpsModule = require('https').Server(options, this._webAppModule);
    this._websocketModule = require('socket.io')(this._httpsModule);
    
    var path = require('path');
    this._webAppModule.use(express.static("../Cliente/www"));
    this._webAppModule.get('/', function(req, res){
        res.sendFile(path.resolve('index.html'));
    });
    
    var server = this;
    
    this._httpsModule.listen(this._configuration.getWebServerPort(), function(){
        console.log("listening on localhost:" + server.getConfiguration().getWebServerPort());
    });
}


Server.prototype.getConfiguration = function(){
    return this._configuration;
};

Server.prototype.getWebsocketModule = function(){
    return this._websocketModule;
};

module.exports = Server;


