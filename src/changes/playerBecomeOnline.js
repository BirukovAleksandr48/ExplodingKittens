const _ = require('lodash');

module.exports = class PlayerBecomeOnline {

    /**
     * @param {string} playerId
     * @param {string} playerName
     * @param {[{ name: string, id: string }]} openedGames
     */
    constructor (playerId, playerName, openedGames) {
        this.changes = { playerId, playerName, openedGames };
    }

    notify (io) {
        io.sockets[this.changes.playerId]
            .emit('player_become_online', this.changes);

        io.sockets[this.changes.playerId]
            .to('GAME_FINDERS')
            .emit('player_become_online', _.pick(this.changes, ['playerId', 'playerName']));
        console.log(`Player ${this.changes.playerId} become online.`)
    }

};
