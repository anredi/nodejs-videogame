
use webgamedb
db.players.drop()
db.createCollection("players")
db.players.createIndex( { "nick": 1 }, { unique: true } )
db.players.insert({nick: "jugador1", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador2", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador3", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador4", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador5", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador6", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador7", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador8", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador9", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador10", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador11", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador12", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador13", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador14", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador15", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador16", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador17", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador18", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador19", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador20", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador21", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador22", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador23", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador24", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador25", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador26", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador27", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador28", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador29", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "jugador30", password: "123", imgLocation: null, rounds: []})
db.players.insert({nick: "Albania", imgLocation: "./img/Albania.png", rounds: []})
db.players.insert({nick: "Argentina", imgLocation: "./img/Argentina.png", rounds: []})
db.players.insert({nick: "Belgium", imgLocation: "./img/Belgium.png", rounds: []})
db.players.insert({nick: "Brazil", imgLocation: "./img/Brazil.png", rounds: []})
db.players.insert({nick: "Cameroon", imgLocation: "./img/Cameroon.png", rounds: []})
db.players.insert({nick: "China", imgLocation: "./img/China.png", rounds: []})
db.players.insert({nick: "Finland", imgLocation: "./img/Finland.png", rounds: []})
db.players.insert({nick: "Australia", imgLocation: "./img/Australia.png", rounds: []})
db.players.insert({nick: "Greece", imgLocation: "./img/Greece.png", rounds: []})
db.players.insert({nick: "Mexico", imgLocation: "./img/Mexico.png", rounds: []})
db.players.insert({nick: "Romania", imgLocation: "./img/Romania.png", rounds: []})
db.players.insert({nick: "Slovenia", imgLocation: "./img/Slovenia.png", rounds: []})
db.players.insert({nick: "Sweden", imgLocation: "./img/Sweden.png", rounds: []})
db.players.insert({nick: "Turkey", imgLocation: "./img/Turkey.png", rounds: []})
db.players.insert({nick: "Uruguay", imgLocation: "./img/Uruguay.png", rounds: []})

