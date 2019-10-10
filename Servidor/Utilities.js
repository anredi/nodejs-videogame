function euclideanDistance(posX1, posY1, posX2, posY2)
{
    return Math.sqrt(Math.pow(posX1 - posX2,2) + Math.pow(posY1 - posY2,2));
}

var hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");

function randomColor()
{
    var randomColor = "#";
    for(var i= 1; i <= 6; i++)
    {
            randomColor = randomColor + hexadecimal[Math.floor(Math.random() * hexadecimal.length)];
    }
    return randomColor;
}

function readImage(url, callback)
{
    var fs = require('fs');
    if(url === null)
    {
        callback(null, null);
    }else{
        fs.readFile(url, function(err, image){
            callback(err,image);
        });
    }
};

function writeImage(url, image, callback)
{
    var fs = require('fs');

    fs.writeFile(url, image, "base64",function(err){
        callback(err);
    });
};

module.exports.euclideanDistance = euclideanDistance;
module.exports.randomColor = randomColor;
module.exports.readImage = readImage;
module.exports.writeImage = writeImage;


