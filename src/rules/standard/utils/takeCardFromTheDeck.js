const _ = require('lodash');
const { CARDS } = require('../../../constants');
const { playerGetCardsFromDeck, playerDied, playerUseCard } = require('../../../changes');

module.exports = (action, state, changes) => {
    const newCardId = state.deck.shift();
    changes.push(new playerGetCardsFromDeck(action.gameId, action.player.id, [newCardId]));
    if (newCardId === CARDS.BOMB.id) {
        console.log(`PLAYER ${action.player.id} take the BOMB.`);
        const index = action.player.cards.findIndex(cardId => cardId === CARDS.SAPPER.id);
        if (index === -1) {
            action.player.dead = true;
            state.release = [...state.release, ...action.player.cards];
            action.player.cards = [];
            _.remove(state.nextPlayerSequence, playerId => playerId === action.player.id);

            changes.push(new playerDied(action.gameId, action.player.id));
        } else {
            const cardId = _.head(action.player.cards.splice(index, 1));
            state.release.push(cardId);

            changes.push(new playerUseCard(action.gameId, action.player.id, cardId));
        }
        // TODO: player should choose the place for bomb
        state.deck.push(newCardId);
    } else {
        action.player.cards.push(newCardId);
    }
};
