import { assert } from 'chai';
import { createDeck, dealCards, getCardsFromDeck, shuffle } from './deck';
import { CARDS, EPlayerStatus } from '../constants';
import { MDeck, MGameParticipant, MPlayer } from '../models/game';
import { IRule } from '../models/rules';

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
        let gameRules: IRule;
        let participants: MGameParticipant[];

        beforeEach(() => {
            gameRules = {
                maxPlayers: 5,
                starterCards: {
                    totalCount: 5,
                    template: {
                        [CARDS.SAPPER.name]: 1,
                    },
                },
                template: (playersCount => {
                    return {
                        [CARDS.BOMB.name]: playersCount + 4,
                        [CARDS.SAPPER.name]: playersCount + 2,
                        [CARDS.CHANGE_THE_FUTURE.name]: 6,
                        [CARDS.CHANGE_DIRECTION.name]: 6,
                    };
                }),
            };
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
            const { players, deck } = dealCards(gameRules, participants);
            assert.equal(deck.length, 9);
            assert.equal(players[0].cards.length, 5);
        });

        it('too few SAPPER cards in the deck', () => {
            gameRules.starterCards.template = {
                [CARDS.SAPPER.name]: 10, // too many
            };
            let result;
            try {
                result = dealCards(gameRules, participants);
                assert.isUndefined(result);
            } catch (err) {
                assert.equal(err.error, 'GameRulesError');
            }
        });

        it('too many starter cards per player.', () => {
            gameRules.starterCards.totalCount = 10;
            let result;
            try {
                result = dealCards(gameRules, participants);
                assert.isUndefined(result);
            } catch (err) {
                assert.equal(err.error, 'GameRulesError');
            }
        });
    });
});
