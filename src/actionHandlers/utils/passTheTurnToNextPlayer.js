const _ = require('lodash');
const { playerEndTheTurn } = require('../../changes');

module.exports = (game, currentPlayerId, changes) => {
    if (game.state.nextPlayerSequence.length) {
        game.state.currentPlayerId = game.state.nextPlayerSequence.shift();
    } else {
        const tempSequence = [...game.state.players, ...game.state.players];
        let nextPlayer;
        if (game.state.direction === 'forward') {
            const index = tempSequence.findIndex(player => player.id === currentPlayerId);
            nextPlayer = tempSequence.find((player, curIndex) => curIndex > index && !player.dead);
        } else {
            const index = tempSequence.lastIndexOf(player => player.id === currentPlayerId);
            nextPlayer = _.findLast(tempSequence, (player, curIndex) => curIndex < index && !player.dead);
        }

        game.state.currentPlayerId = nextPlayer.id;
    }
    changes.push(new playerEndTheTurn(game.id, currentPlayerId));
};
