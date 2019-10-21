const _ = require('lodash');

module.exports = class PlayerDied {

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
        debugger
        io.to(`game_${this.changes.gameId}`)
            .emit('player_died', _.pick(this.changes, ['playerId']));

        console.log(`Player ${this.changes.playerId} died.`);
    }

};
