import { assert } from 'chai';
import { EGameStatus, ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import GameCreated from './gameCreated';

describe('changes/gameCreated', () => {

    it('check different recipients', () => {
        const userId = 'a1';
        const game: any = {
            id: 'gameId_1',
            name: 'game_1',
            hostId: 'a1',
            status: EGameStatus.WAIT_FOR_PLAYERS,
            participants: [
                {
                    id: 'a1',
                    name: 'alex',
                    profilePictureUrl: 'some_url',
                },
            ],
            rules: {
                maxPlayers: 5,
            },
        };

        const socketApp: any = new SocketApp();
        const gameCreator = socketApp.createSocket(userId);
        gameCreator.join(ROOMS.GAME_FINDERS);
        const userInGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(uuid()));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new GameCreated(game, userId).notify(socketApp);

        const supposedResult = [
            {
                actionName: 'game_created',
                payload: {
                    game: {
                        id: game.id,
                        name: game.name,
                        hostId: game.hostId,
                        maxPlayers: game.rules.maxPlayers,
                        participants: game.participants,
                        status: game.status,
                    },
                },
            },
        ];
        assert.deepEqual(gameCreator.actions, supposedResult);
        assert.deepEqual(userInGame.actions, []);
        assert.deepEqual(userInGameFinders.actions, supposedResult);
    });

});
