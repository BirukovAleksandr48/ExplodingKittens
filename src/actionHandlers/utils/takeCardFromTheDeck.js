const _ = require('lodash');
const { CARDS } = require('../../constants');
const { playerGetCardsFromDeck, playerDied, playerUseCard } = require('../../changes');

module.exports = (game, currentPlayerId, changes) => {
    const currentPlayer = game.state.players.find(p => p.id === currentPlayerId);
    const newCardId = game.state.deck.shift();
    changes.push(new playerGetCardsFromDeck(game.id, currentPlayer.id, [newCardId]));

    if (newCardId === CARDS.BOMB.id) {
        console.log(`PLAYER ${currentPlayer.id} take the BOMB.`);
        const index = currentPlayer.cards.findIndex(cardId => cardId === CARDS.SAPPER.id);

        if (index === -1) {
            currentPlayer.dead = true;
            game.state.release = [...game.state.release, ...currentPlayer.cards];
            currentPlayer.cards = [];
            _.remove(game.state.nextPlayerSequence, playerId => playerId === currentPlayerId);
            changes.push(new playerDied(game.id, currentPlayer.id));
        } else {
            currentPlayer.cards.splice(index, 1);
            game.state.release.push(CARDS.SAPPER.id);
            changes.push(new playerUseCard(game.id, currentPlayer.id, CARDS.SAPPER.id));
        }
        // TODO: player should choose the place for bomb
        game.state.deck.push(newCardId);
    } else {
        currentPlayer.cards.push(newCardId);
    }
};
