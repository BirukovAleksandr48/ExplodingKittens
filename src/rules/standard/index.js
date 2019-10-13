const { ACTION_TYPES, CARDS } = require('../../constants');
const { passTheTurnToNextPlayer, takeCardFromTheDeck } = require('./utils');
const _ = require('lodash');

module.exports = (playersCount) => ({
    maxPlayers: 5,
    starterCards: {
        totalCount: 5,
        template: {
            [CARDS.SAPPER.name]: 1
        },
    },
    template: {
        [CARDS.BOMB.name]: playersCount + 4,
        [CARDS.SAPPER.name]: playersCount + 2,
        [CARDS.CHANGE_THE_FUTURE.name]: 6,
        [CARDS.NOT.name]: 4,
        [CARDS.ATTACK.name]: 5,
        [CARDS.SKIP.name]: 5,
        [CARDS.TARGETED_ATTACK.name]: 5,
        [CARDS.CHANGE_DIRECTION.name]: 5,
    },
    handle: (action, state) => {
        switch (action.type) {
            case ACTION_TYPES.END_OF_TURN: {
                takeCardFromTheDeck(action, state);
                passTheTurnToNextPlayer(action, state);
                break;
            }
            case ACTION_TYPES.PLAY_CARD: {

                break;
            }
        }
    }
});
