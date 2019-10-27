const { CARDS } = require('../../constants');
const _ = require('lodash');

module.exports = class StandardRules {

    constructor () {
        this.maxPlayers = 5;
        this.starterCards = {
            totalCount: 5,
                template: {
                    [CARDS.SAPPER.name]: 1
            },
        };
    }

    template (playersCount) {
        return {
            [CARDS.BOMB.name]: playersCount + 4,
            [CARDS.SAPPER.name]: playersCount + 2,
            [CARDS.CHANGE_THE_FUTURE.name]: 6,
            [CARDS.NOT.name]: 4,
            [CARDS.ATTACK.name]: 5,
            [CARDS.SKIP.name]: 5,
            [CARDS.TARGETED_ATTACK.name]: 5,
            [CARDS.CHANGE_DIRECTION.name]: 5,
        };
    }

};
