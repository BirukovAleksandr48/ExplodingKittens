const Joi = require('@hapi/joi');
const _ = require('lodash');
const { ROOMS } = require('../constants');
const { playerJoinTheGame } = require('../changes');
const errors = require('../errors');

module.exports = class JoinGame {

    get validationRules () {
        return Joi.string();
    }

    run (games, players, io, currentPlayer, payload, changes) {
        const game = games.find(g => g.id === payload);
        if (!game) {
            throw errors.NotFound(`Game ${payload} not found.`);
        }

        game.join(currentPlayer);
        currentPlayer.currentGame = game;
        currentPlayer.socket.join(ROOMS.GAME(payload));
        currentPlayer.socket.leave(ROOMS.GAME_FINDERS);
        changes.push(new playerJoinTheGame(game.id, currentPlayer.id));
    }
};
