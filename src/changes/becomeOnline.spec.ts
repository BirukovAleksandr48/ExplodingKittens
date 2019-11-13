import { assert } from 'chai';
import { EGameStatus, ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import BecomeOnline from './becomeOnline';

describe('changes/becomeOnline', () => {

    it('check different recipients', () => {
        const user: any = {
            id: 'a1',
            name: 'Alex',
        };
        const games: any = [
            {
                id: 'gameId_1',
                name: 'game_1',
                hostId: 'a2',
                status: EGameStatus.WAIT_FOR_PLAYERS,
                participants: [
                    {
                        id: 'a2',
                        name: 'alex',
                        profilePictureUrl: 'some_url',
                    },
                ],
                rules: {
                    maxPlayers: 5,
                },
            },
            {
                id: 'gameId_2',
                name: 'game_2',
                hostId: 'a3',
                status: EGameStatus.PLAY,
                participants: [
                    {
                        id: 'a3',
                        name: 'olga',
                        profilePictureUrl: 'some_url',
                    },
                ],
                rules: {
                    maxPlayers: 5,
                },
            },
        ];

        const socketApp: any = new SocketApp();
        const curUser = socketApp.createSocket(user.id);
        curUser.join(ROOMS.GAME_FINDERS);
        const userInGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(uuid()));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new BecomeOnline(user, games).notify(socketApp);

        assert.deepEqual(curUser.actions, [
            {
                actionName: 'become_online/you',
                payload: {
                    games: [
                        {
                            id: 'gameId_1',
                            name: 'game_1',
                            hostId: 'a2',
                            status: EGameStatus.WAIT_FOR_PLAYERS,
                            participants: [
                                {
                                    id: 'a2',
                                    name: 'alex',
                                    profilePictureUrl: 'some_url',
                                },
                            ],
                            maxPlayers: 5,
                        },
                        {
                            id: 'gameId_2',
                            name: 'game_2',
                            hostId: 'a3',
                            status: EGameStatus.PLAY,
                            participants: [
                                {
                                    id: 'a3',
                                    name: 'olga',
                                    profilePictureUrl: 'some_url',
                                },
                            ],
                            maxPlayers: 5,
                        },
                    ],
                },
            },
        ]);
        assert.deepEqual(userInGame.actions, []);
        assert.deepEqual(userInGameFinders.actions, [
            {
                actionName: 'become_online/smb',
                payload: {
                    user: {
                        id: user.id,
                        name: user.name,
                    },
                },
            },
        ]);

    });

});
