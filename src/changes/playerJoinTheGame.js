const _ = require('lodash');

module.exports = class PlayerJoinTheGame {

    /**
     * @param {number} gameId
     * @param {number} playerId
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
            .emit('player_join_the_game', _.pick(this.changes, 'playerId'));

        console.log(`Player ${this.changes.playerId} join the game`);
    }

};
