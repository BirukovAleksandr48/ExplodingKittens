const Joi = require('@hapi/joi');
const Game = require('../game');
const { ROOMS } = require('../constants');
const { playerCreateTheGame } = require('../changes');

module.exports = class CreateGame {

    get validationRules () {
        return Joi.string();
    }

    run (games, players, io, currentPlayer, payload, changes) {
        console.log('game created');
        const game = new Game(payload, currentPlayer);
        games.push(game);

        currentPlayer.currentGame = game;
        currentPlayer.socket.join(ROOMS.GAME(game.id));
        currentPlayer.socket.leave(ROOMS.GAME_FINDERS);

        changes.push(new playerCreateTheGame(game.id, game.name, currentPlayer.id, currentPlayer.name));
    }
};
