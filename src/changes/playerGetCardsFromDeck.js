const _ = require('lodash');

module.exports = class PlayerGetCardsFromDeck {

    /**
     * @param {string} gameId
     * @param {string} playerId
     * @param {Array<number>} cardIds
     */
    constructor (gameId, playerId, cardIds) {
        this.changes = {
            gameId,
            playerId,
            cardIds,
        };
    }

    notify (io) {
        io.sockets[this.changes.playerId]
            .emit('player_get_card_from_deck', _.pick(this.changes, ['playerId', 'cardIds']));

        io.sockets[this.changes.playerId]
            .to(`game_${this.changes.gameId}`)
            .emit('player_get_card_from_deck', {
                playerId: this.changes.playerId,
                cardsCount: this.changes.cardIds.length,
            });
    }

};
