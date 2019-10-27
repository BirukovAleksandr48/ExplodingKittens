const Joi = require('@hapi/joi');
const _ = require('lodash');
const { ROOMS } = require('../constants');
const { playerBecomeOnline } = require('../changes');

module.exports = class IAmHere {

    get validationRules () {
        return Joi.number();
    }

    run (games, players, io, currentPlayer, payload, changes) {
        console.log('i am here', payload);
        currentPlayer.name = payload;
        currentPlayer.socket.join(ROOMS.GAME_FINDERS);

        const openedGames = games.filter(g => !g.started).map(g => _.pick(g, ['id', 'name']));
        changes.push(new playerBecomeOnline(currentPlayer.id, currentPlayer.name, openedGames));
    }
};
