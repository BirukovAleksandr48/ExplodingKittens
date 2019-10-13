const _ = require('lodash');
const { CARDS } = require('../../../constants');

module.exports = (action, state) => {
    const newCardId = state.deck.shift();
    if (newCardId === CARDS.BOMB.id) {
        const index = action.player.cards.findIndex(cardId => cardId === CARDS.SAPPER.id);
        if (index === -1) {
            action.player.dead = true;
            state.release = [...state.release, ...action.player.cards];
            action.player.cards = [];
            _.remove(state.nextPlayerSequence, playerId => playerId === action.player.id);
        } else {
            const cardId = action.player.cards.splice(index, 1);
            state.release.push(_.head(cardId));
        }
        // TODO: player should choose the place for bomb
        state.deck.push(newCardId);
    } else {
        action.player.cards.push(newCardId);
    }
};
