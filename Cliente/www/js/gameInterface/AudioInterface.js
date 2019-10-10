
function AudioInterface()
{
    this.init();
}

AudioInterface.prototype.getAudioPanel = function()
{
    return this._audioPanel;
};

AudioInterface.prototype.getAudioText = function()
{
    return this._audioText;
};

AudioInterface.prototype.getAudioElement = function()
{
    return this._audioElement;
};

AudioInterface.prototype.getAudioButton = function()
{
    return this._audioButton;
};

AudioInterface.prototype.init = function()
{
    this._audioPanel = document.getElementById("audioPanel");
    this._audioElement = document.getElementById("audioElement");
    this._audioElement.onended = function(){
        gameInterface.getAudioInterface().getAudioText().style.opacity = "0";
    };
    this._audioText = document.getElementById("audioText");
    this._audioButton = document.getElementById("audioButton");
    this._audioButton.style.display = "none";
    var constraints = { audio: true };
    navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.mediaDevices.getUserMedia);
    navigator.getMedia(constraints, function(mediaStream) {
        var mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.onstart = function(e) {
            this.chunks = [];
        };
        mediaRecorder.ondataavailable = function(e) {
            this.chunks.push(e.data);
        };
        mediaRecorder.onstop = function(e) {
            var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
            gameInterface.getSocketInterface().getWebSocket().emit('audio', {playerNick: game.getActivePlayer().getNick(), audio:blob});
        };

        gameInterface.getAudioInterface().getAudioButton().addEventListener("click", function(){
            mediaRecorder.start();
            gameInterface.getAudioInterface().getAudioButton().disabled = true;
            gameInterface.getAudioInterface().getAudioButton().innerText = "Recording...5";
            
            var secondsCounter = 5;
            var interval = setInterval(function(){
                secondsCounter--;
                gameInterface.getAudioInterface().getAudioButton().innerText = "Recording..." + secondsCounter;
            }, 1000);
            
            setTimeout(function() {
                mediaRecorder.stop();
                clearInterval(interval);
                gameInterface.getAudioInterface().getAudioButton().innerText = "Push to Talk";
                gameInterface.getAudioInterface().getAudioButton().disabled = false;
            }, 5000);
        });
    }, function(err) {
    console.log("Ocurrió el siguiente error: " + err);
   });
};


