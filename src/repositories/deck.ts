import * as _ from 'lodash';
import { CARDS, EPlayerStatus } from '../constants';
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

    if (deck.length < count) {
        count = deck.length;
    }
    for (let i = 0; i < count; i++) {
        const index = deck.findIndex(cardId => cardId !== CARDS.BOMB.id);
        player.cards.push(_.head(deck.splice(index, 1)));
    }
};

const dealCards = (gameRules: IRule, participants: MGameParticipant[]) => {

    let totalCardsForPlayer = 0;
    const deckTemplate = gameRules.deckTemplate.get({ playersCount: participants.length });
    const starterTemplate = gameRules.starterTemplate.get();

    const players: MPlayer[] = _.map(participants, user => ({
        id: user.id,
        cards: [],
        status: EPlayerStatus.PLAY,
    }));

    _.map(starterTemplate, (requiredCount, requiredCardName) => {
        deckTemplate[requiredCardName] -= requiredCount * participants.length;

        const requiredCards = [];
        for (let i = 0; i < requiredCount; i++) {
            requiredCards.push(CARDS[requiredCardName].id);
        }

        _.map(players, player => {
            player.cards = [...player.cards, ...requiredCards];
        });

        totalCardsForPlayer += requiredCount;
    });
    const deck = createDeck(deckTemplate);
    shuffle(deck);

    _.map(players, player => {
        getCardsFromDeck(deck, player, gameRules.starterCardsCount - totalCardsForPlayer);
    });

    return { players, deck };
};

export {
    shuffle,
    createDeck,
    dealCards,
    getCardsFromDeck,
};
