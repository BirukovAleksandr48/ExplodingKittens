const Joi = require('@hapi/joi');
const _ = require('lodash');
const { ROOMS, REQUEST_ACTIONS } = require('../constants');
const { gameStarted } = require('../changes');
const { takeCardFromTheDeck, passTheTurnToNextPlayer } = require('./utils');
const errors = require('../errors');

module.exports = class EndOfTurn {

    get validationRules () {
        return Joi.any();
    }

    run (games, players, io, currentPlayer, payload, changes) {
        const stateBefore = _.cloneDeep(currentPlayer.currentGame.state);

        if (currentPlayer.currentGame.state.currentPlayerId !== currentPlayer.id) {
            throw errors.ActionRejected('Wait your turn.');
        }

        takeCardFromTheDeck(currentPlayer.currentGame, currentPlayer.id, changes);
        passTheTurnToNextPlayer(currentPlayer.currentGame, currentPlayer.id, changes);

        currentPlayer.currentGame.actions.push({
            type: REQUEST_ACTIONS.END_OF_TURN,
            playerId: currentPlayer.id,
            stateBefore,
        });

        console.log(currentPlayer.currentGame.state);
        return changes;
    }
};
