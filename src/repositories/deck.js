const _ = require('lodash');
const { CARDS } = require('../constants');

module.exports = class DeckRepository {

    shuffle (array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    };

    createDeck (template) {
        return (_.reduce(template, (acc, requiredCount, requiredCardName) => {
            for (let i = 0; i < requiredCount; i++) {
                acc.push(CARDS[requiredCardName].id);
            }
            return acc;
        }, []));
    }

    /**
     * This method mutates arguments!
     */
    dealCards (gameRules, players) {
        if (players.length > gameRules.maxPlayers) {
            throw new Error('Too many players.');
        }
        if (players.length < 2) {
            throw new Error('Too few players.');
        }

        let totalCardsForPlayer = 0;
        _.map(gameRules.starterCards.template, (requiredCount, requiredCardName) => {
            gameRules.template[requiredCardName] -= requiredCount * players.length;
            if (gameRules.template[requiredCardName] < 0) {
                throw new Error(`Too few "${requiredCardName}" cards.`);
            }

            const requiredCards = [];
            for (let i = 0; i < requiredCount; i++) {
                requiredCards.push(CARDS[requiredCardName].id);
            }

            _.map(players, player => {
                player.cards = [...player.cards, ...requiredCards];
            });

            totalCardsForPlayer += requiredCount;
        });

        if (totalCardsForPlayer > gameRules.starterCards.totalCount) {
            throw new Error('Too many starter cards per player.')
        }

        const deck = this.createDeck(gameRules.template);
        this.shuffle(deck);

        _.map(players, player => {
            this.getCardsFromDeck(deck, player, gameRules.starterCards.totalCount - totalCardsForPlayer);
        });

        return { players, deck };
    };

    getCardsFromDeck (deck, player, count = 1) {
        for (let i = 0; i < count; i++) {
            const index = deck.findIndex(cardId => cardId !== CARDS.BOMB.id);
            if (index === -1) {
                throw new Error('Not enough common cards.')
            }
            player.cards.push(_.head(deck.splice(index, 1)));
        }
    }
};
