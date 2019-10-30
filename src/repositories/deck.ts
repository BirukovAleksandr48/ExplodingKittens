import * as _ from 'lodash';
import { CARDS, EPlayerStatus } from '../constants';
import errors from '../errors';
import { IRule, MTemplate } from '../models/rules';
import { MDeck, MGameParticipant, MPlayer } from '../models/game';

const shuffle = (array: any[]) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
};

const createDeck = (template: MTemplate) => {
    return _.reduce(template, (acc, requiredCount, requiredCardName) => {
        for (let i = 0; i < requiredCount; i++) {
            acc.push(CARDS[requiredCardName].id);
        }
        return acc;
    }, []) as MDeck;
};

const getCardsFromDeck = (deck: MDeck, player: MPlayer, count = 1) => {
    for (let i = 0; i < count; i++) {
        const index = deck.findIndex(cardId => cardId !== CARDS.BOMB.id);
        if (index === -1) {
            throw errors.GameRulesError('Not enough common cards.');
        }
        player.cards.push(_.head(deck.splice(index, 1)));
    }
};

const dealCards = (gameRules: IRule, participants: MGameParticipant[]) => {
    let totalCardsForPlayer = 0;
    const template = gameRules.template(participants.length);

    const players: MPlayer[] = _.map(participants, user => ({
        id: user.id,
        cards: [],
        status: EPlayerStatus.PLAY,
    }));

    _.map(gameRules.starterCards.template, (requiredCount, requiredCardName) => {
        template[requiredCardName] -= requiredCount * participants.length;
        if (template[requiredCardName] < 0) {
            throw errors.GameRulesError(`Too few "${requiredCardName}" cards.`);
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
        throw errors.GameRulesError('Too many starter cards per player.');
    }

    const deck = createDeck(template);
    shuffle(deck);

    _.map(players, player => {
        getCardsFromDeck(deck, player, gameRules.starterCards.totalCount - totalCardsForPlayer);
    });

    return { players, deck };
};

export {
    shuffle,
    createDeck,
    dealCards,
    getCardsFromDeck,
};
