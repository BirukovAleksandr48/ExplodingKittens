import { assert } from 'chai';
import { createDeck, dealCards, getCardsFromDeck, shuffle } from './deck';
import { CARDS, EPlayerStatus } from '../constants';
import { MDeck, MGameParticipant, MPlayer } from '../models/game';
import { IRule } from '../models/rules';
import gameRules from '../rules';

describe('repositories/deck', () => {

    describe('shuffle', () => {
        it('return same length array', () => {
            const data = [1, 2, 3, 4, 5, 6];
            shuffle(data);
            assert.equal(data.length, 6);
        });
    });

    describe('createDeck', () => {
        it('return array of cardIds', () => {
            const template = {
                [CARDS.BOMB.name]: 2,
                [CARDS.SAPPER.name]: 3,
                [CARDS.ATTACK.name]: 4,
            };

            const result = createDeck(template);

            assert.isArray(result);
            assert.equal(result.length, 9);
        });
    });

    describe('getCardsFromDeck', () => {
        const basePlayer: MPlayer = {
            id: '16e2',
            status: EPlayerStatus.PLAY,
            cards: [],
        };

        it('get one card by default', () => {
            const deck: MDeck = [3, 5, 2, 2, 1];
            const player: MPlayer = {
                ...basePlayer,
                cards: [],
            };

            getCardsFromDeck(deck, player);
            assert.deepEqual(player.cards, [3]);
            assert.deepEqual(deck, [5, 2, 2, 1]);
        });

        it('get few cards', () => {
            const deck: MDeck = [3, 5, 2, 2, 1];
            const player: MPlayer = {
                ...basePlayer,
                cards: [],
            };

            getCardsFromDeck(deck, player, 3);
            assert.deepEqual(player.cards, [3, 5, 2]);
            assert.deepEqual(deck, [2, 1]);
        });

        it('when not enough cards - get all', () => {
            const deck: MDeck = [3, 5];
            const player: MPlayer = {
                ...basePlayer,
                cards: [],
            };

            getCardsFromDeck(deck, player, 3);
            assert.deepEqual(player.cards, [3, 5]);
            assert.deepEqual(deck, []);
        });
    });

    describe('dealCards', () => {
        let rules: IRule;
        let participants: MGameParticipant[];

        beforeEach(() => {
            rules = new gameRules.STANDARD();
            participants = [
                {
                    id: 'aa',
                    name: 'name',
                    profilePictureUrl: 'profilePictureUrl',
                },
                {
                    id: 'bb',
                    name: 'name',
                    profilePictureUrl: 'profilePictureUrl',
                },
                {
                    id: 'cc',
                    name: 'name',
                    profilePictureUrl: 'profilePictureUrl',
                },
            ];
        });

        it('common case', () => {
            const { players, deck } = dealCards(rules, participants);
            assert.equal(deck.length, 27);
            assert.equal(players[0].cards.length, 5);
        });

    });
});
