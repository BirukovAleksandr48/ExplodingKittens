const _ = require('lodash');

module.exports = class PlayerUseCard {

    /**
     * @param {string} gameId
     * @param {string} playerId
     * @param {number} cardId
     */
    constructor (gameId, playerId, cardId) {
        this.changes = {
            gameId,
            playerId,
            cardId,
        };
    }

    notify (io) {
        debugger
        io.to(`game_${this.changes.gameId}`)
            .emit('player_use_card', _.pick(this.changes, ['playerId', 'cardId']));
        console.log(`Player ${this.changes.playerId} use the card ${this.changes.cardId}`);
    }

};
