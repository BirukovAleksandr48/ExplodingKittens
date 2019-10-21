const _ = require('lodash');

module.exports = class GameStarted {

    /**
     * @param {object} game
     */
    constructor (game) {
        this.changes = {
            game,
        };
    }

    notify (io) {
        debugger
        const { game } = this.changes;
        const payload = {
            direction: game.state.direction,
            deckSize: game.state.deck.length,
            releaseSize: game.state.release.length,
            currentPlayerId: game.state.currentPlayerId,
        };

        _.map(this.changes.game.state.players, player => {
            payload.players = game.state.players.map(p => (
                p.id === player.id
                    ? {
                        id: p.id,
                        name: p.name,
                        cards: p.cards,
                    }
                    : {
                        id: p.id,
                        name: p.name,
                        cardsCount: p.cards.length,
                    }
            ));
            io.to(player.id).emit('game_started', payload);
        });

        console.log(`Game ${this.changes.game.id} started.`)
    }

};
