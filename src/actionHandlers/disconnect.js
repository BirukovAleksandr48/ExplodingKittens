const Joi = require('@hapi/joi');
const _ = require('lodash');
const { ROOMS } = require('../constants');
const { playerBecomeOnline } = require('../changes');

module.exports = class Disconnect {

    get validationRules () {
        return Joi.any();
    }

    run (games, players, io, currentPlayer, payload, changes) {
        // currentPlayer.socket.leave(ROOMS.GAME(currentPlayer.currentGame.id));
        // currentPlayer.currentGame.leave(currentPlayer.currentGame.id);
        // _.remove(players, (p) => p.id === currentPlayer.id);
        console.log(`Player ${currentPlayer.name} disconnected`);
    }
};
