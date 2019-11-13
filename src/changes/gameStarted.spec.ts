import { assert } from 'chai';
import { EGameDirection, EGameStatus, EPlayerStatus, ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import GameStarted from './gameStarted';

describe('changes/gameStarted', () => {

    it('check different recipients', () => {
        const game: any = {
            name: 'game_1',
            id: 'game_1',
            status: EGameStatus.PLAY,
            actions: [],
            participants: [{
                id: 'a1',
                name: 'Alex',
                profilePictureUrl: 'http://image.jpg',
            }, {
                id: 'b1',
                name: 'Bob',
                profilePictureUrl: 'http://image.jpg',
            }],
            rules: {
                maxPlayers: 5,
                starterCardsCount: 5,
            },
            hostId: 'a1',
            state: {
                direction: EGameDirection.FORWARD,
                interactionWith: null,
                release: [],
                nextPlayerSequence: [],
                players: [{
                    id: 'a1',
                    cards: [2, 5, 2, 3, 5],
                    status: EPlayerStatus.PLAY,
                }, {
                    id: 'b1',
                    cards: [2, 5, 8, 4, 4],
                    status: EPlayerStatus.PLAY,
                }],
                deck: [3, 8, 6, 7, 2, 1, 7, 3, 3, 1, 6, 6, 5, 3, 6, 1, 1, 7, 8, 7, 4, 1, 4, 3, 1, 6, 7, 5, 8, 8],
                currentPlayerId: 'a1',
            },
        };

        const socketApp: any = new SocketApp();
        const gameHost = socketApp.createSocket(game.hostId);
        gameHost.join(ROOMS.GAME(game.id));
        const userInAnotherGame = socketApp.createSocket();
        userInAnotherGame.join(ROOMS.GAME(uuid()));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new GameStarted(game).notify(socketApp);

        assert.deepEqual(gameHost.actions, [{
            actionName: 'game_started',
            payload: {
                state: {
                    direction: game.state.direction,
                    deckSize: game.state.deck.length,
                    releaseSize: game.state.release.length,
                    currentPlayerId: game.state.currentPlayerId,
                    nextPlayerSequence: game.state.nextPlayerSequence,
                    players: [{
                        id: game.participants[0].id,
                        cards: game.state.players[0].cards,
                        status: game.state.players[0].status,
                    }, {
                        id: game.participants[1].id,
                        cardsCount: game.state.players[1].cards.length,
                        status: game.state.players[1].status,
                    }],
                },
            },
        }]);
        assert.equal(userInGameFinders.actions.length, 0);
        assert.equal(userInAnotherGame.actions.length, 0);
    });

});
