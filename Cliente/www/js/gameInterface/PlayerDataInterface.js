
function PlayerDataInterface()
{
    this._registerImgString = null;
    this.init();
}

PlayerDataInterface.prototype.getRegisterImgString = function()
{
    return this._registerImgString;
};

PlayerDataInterface.prototype.setRegisterImgString = function(registerImgString)
{
    this._registerImgString = registerImgString;
};

function openPlayerDataForm(evt, formName)
{
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(formName).style.display = "block";
    evt.currentTarget.className += " active";
};


PlayerDataInterface.prototype.init = function()
{
    var tablinks = document.getElementsByClassName("tablinks");      
    
    tablinks[0].addEventListener("click", function(event){
        openPlayerDataForm(event, "registerForm");
    });
    tablinks[1].addEventListener("click", function(event){
        openPlayerDataForm(event, "loginForm");
    });
    
    document.getElementById("defaultOpen").click();  
    document.getElementById("forms").style.display = "none"; 
    
    this.initRegisterInterface();
    this.initLoginInterface();
};

PlayerDataInterface.prototype.cleanRegisterInputs = function()
{
    document.getElementById("registerNick").value = "";
    document.getElementById("registerPass").value = "";
    document.getElementById("registerAvatar").value = null;
    document.getElementById("avatarFileName").innerHTML = "";
    this.setRegisterImgString(null);
};

PlayerDataInterface.prototype.cleanLoginInputs = function()
{
    document.getElementById("loginNick").value = "";
    document.getElementById("loginPass").value = "";
};

PlayerDataInterface.prototype.readImage = function(evt)
{
    var input = evt.target; 
    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      gameInterface.getPlayerDataInterface().setRegisterImgString(dataURL);
    };
    reader.readAsDataURL(input.files[0]);
};

PlayerDataInterface.prototype.initRegisterInterface = function()
{    
    document.getElementById("registerAvatar").addEventListener("change", function(evt){
        document.getElementById("avatarFileName").innerHTML = evt.target.files[0].name;
        gameInterface.getPlayerDataInterface().readImage(evt);
    });
    document.getElementById("registerButton").onclick = function (){
        document.getElementById("forms").style.display = "none";
        document.getElementById("waitingText").innerHTML = "Wait while player is registering...";
        document.getElementById("waitingPanel").style.display = "block";
        
        var nick = document.getElementById("registerNick").value;
        var password = document.getElementById("registerPass").value;
        var imgData = gameInterface.getPlayerDataInterface().getRegisterImgString();
        gameInterface.getSocketInterface().getWebSocket().emit("playerRegisterAttempt", {"nick": nick, "password": password, "imgData": imgData});
    };
};

PlayerDataInterface.prototype.initLoginInterface = function()
{
    document.getElementById("loginButton").onclick = function (){
        document.getElementById("forms").style.display = "none";
        document.getElementById("waitingText").innerHTML = "Wait while player is login in...";
        document.getElementById("waitingPanel").style.display = "block";
        
        var nick = document.getElementById("loginNick").value;
        var password = document.getElementById("loginPass").value;
        gameInterface.getSocketInterface().getWebSocket().emit("playerLoginAttempt", {"nick": nick, "password": password});
    };
};


