const Joi = require('@hapi/joi');
const _ = require('lodash');
const { ROOMS } = require('../constants');
const { gameStarted } = require('../changes');
const errors = require('../errors');


module.exports = class StartGame {

    get validationRules () {
        return Joi.any();
    }

    run (games, players, io, currentPlayer, payload, changes) {
        const game = games.find(g => g.host.id = currentPlayer.id);
        if (!game) {
            throw errors.Forbidden('Player isn\'t a host.');
        }

        game.start();
        changes.push(new gameStarted(game));
    }
};
