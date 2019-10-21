const _ = require('lodash');
const { playerEndTheTurn } = require('../../../changes');

module.exports = (action, state, changes) => {
    if (state.nextPlayerSequence.length) {
        state.currentPlayerId = state.nextPlayerSequence.shift();
    } else {
        const tempSequence = [...state.players, ...state.players];
        let nextPlayer;
        if (state.direction === 'forward') {
            const index = tempSequence.findIndex(player => player.id === action.player.id);
            nextPlayer = tempSequence.find((player, curIndex) => curIndex > index && !player.dead);
        } else {
            const index = tempSequence.lastIndexOf(player => player.id === action.player.id);
            nextPlayer = _.findLast(tempSequence, (player, curIndex) => curIndex < index && !player.dead);
        }

        if (!nextPlayer) {
            throw new Error('Couldn\'t calculate next player.');
        }
        state.currentPlayerId = nextPlayer.id;
    }
    changes.push(new playerEndTheTurn(action.gameId, action.player.id));
};
