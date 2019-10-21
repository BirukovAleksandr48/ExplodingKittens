const _ = require('lodash');

module.exports = class PlayerEndTheTurn {

    /**
     * @param {string} gameId
     * @param {string} playerId
     */
    constructor (gameId, playerId) {
        this.changes = {
            gameId,
            playerId,
        };
    }

    notify (io) {
        io.to(`game_${this.changes.gameId}`)
            .emit('player_end_the_turn', _.pick(this.changes, ['playerId']));
        console.log(`Player ${this.changes.playerId} end the turn.`);
    }

};
