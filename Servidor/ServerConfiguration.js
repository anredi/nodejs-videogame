function ServerConfiguration()
{
    this._webServerPort = 3000;
}


ServerConfiguration.prototype.getWebServerPort = function(){
    return this._webServerPort;
};

module.exports = ServerConfiguration;


