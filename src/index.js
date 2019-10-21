const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const _ = require('lodash');
const CHANGES = require('./changes');
const Game = require('./game');
const { ACTION_TYPES } = require('./constants');

app.use(express.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

const games = [];
const GAME_FINDERS = 'GAME_FINDERS';

io.on('connection', function(socket) {
    console.log(socket.id, 'connected');

    const currentPlayer = {
        id: socket.id,
        name: null,
        playGameId: null,
    };

    socket.on('i_am_here', (playerName) => {
        currentPlayer.name = playerName;
        socket.join(GAME_FINDERS);

        const openedGames = games.filter(g => !g.started).map(g => _.pick(g, ['id', 'name']));
        new CHANGES.playerBecomeOnline(currentPlayer.id, playerName, openedGames).notify(io.sockets);
    });

    socket.on('create_game', (gameName) => {
        const game = new Game(gameName, currentPlayer);
        games.push(game);

        socket.join(`game_${game.id}`);
        socket.leave(GAME_FINDERS);

        new CHANGES.playerCreateTheGame(game.id, gameName, currentPlayer.id, currentPlayer.name).notify(io.sockets);
    });

    socket.on('join_game', (gameId) => {
        if (currentPlayer.playGameId) {
            throw new Error(`You should leave previous game before join to next.`);
        }

        const game = games.find(g => g.id === gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found.`);
        }

        game.join(currentPlayer);
        socket.join(`game_${game.id}`);
        new CHANGES.playerJoinTheGame(game.id, currentPlayer.id).notify(io.sockets);
    });

    socket.on('start_game', () => {
        const game = games.find(g => g.state.players.find(p => p.id === currentPlayer.id));
        if (!game) {
            throw new Error('Player\'s game is not exist or you are not host.');
        }

        game.start();
        new CHANGES.gameStarted(game).notify(io.sockets);
    });

    socket.on('end_of_turn', () => {
        const game = games.find(g => g.state.players.find(p => p.id === currentPlayer.id));
        if (!game) {
            throw new Error('Player\'s game is not found');
        }

        const action = {
            type: ACTION_TYPES.END_OF_TURN,
            playerId: currentPlayer.id,
            gameId: game.id,
        };
        const changes = game.exec(action);
        for (let change of changes) {
            change.notify(io.sockets);
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected')
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
