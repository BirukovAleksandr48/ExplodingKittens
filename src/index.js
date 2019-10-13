const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const uuid = require('uuid');

app.use(express.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

const Game = require('./game');
let game;

app.post('/refresh', (req, res, next) => {
    game = new Game();
    console.log('Game created');
    res.send(200);
});

app.post('/join', (req, res, next) => {
    const player = {
        id: uuid(),
        name: req.body.name,
        cards: [],
    };
    game.join(player);
    console.log(`Player ${JSON.stringify(player)} join the game.`);
    res.send(200);
});

app.post('/left', (req, res, next) => {
    const playerId = req.body.id;
    game.left(playerId);
    console.log(`Player ${playerId} left the game.`);
    res.send(200);
});

app.post('/left', (req, res, next) => {
    const playerId = req.body.id;
    game.left(playerId);
    console.log(`Player ${playerId} left the game.`);
    res.send(200);
});

app.post('/start', (req, res, next) => {
    game.start();
    console.log('Game started.', game.state);
    res.send(200);
});

app.post('/action', (req, res, next) => {
    game.exec(req.body.action);
    res.send(200);
});


io.on('connection', function(socket){
    console.log('a user connected', Object.keys(socket), socket.id);

    socket.on('disconnect', () => {
        console.log('----------disconnect--------')
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
