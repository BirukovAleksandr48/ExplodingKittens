import { assert } from 'chai';
import { EGameStatus, ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import JoinTheGame from './joinTheGame';

describe('changes/joinTheGame', () => {

    it('check different recipients', () => {
        const user: any = {
            id: 'bob',
            name: 'Bob',
        };
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
        const gameJoiner = socketApp.createSocket(user.id);
        gameJoiner.join(ROOMS.GAME_FINDERS);
        gameJoiner.join(ROOMS.GAME(game.id));

        const userInGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(game.id));

        const userInAnotherGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(uuid()));

        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new JoinTheGame(game, user).notify(socketApp);
        const gameResult = {
            id: game.id,
            name: game.name,
            hostId: game.hostId,
            maxPlayers: game.rules.maxPlayers,
            participants: game.participants,
            status: game.status,
        };
        assert.deepEqual(gameJoiner.actions, [{
            actionName: 'join_the_game/you',
            payload: { game: gameResult },
        }]);
        assert.deepEqual(userInGame.actions, [{
            actionName: 'join_the_game/smb',
            payload: {
                gameId: game.id,
                user: _.pick(user, ['id', 'name']),
            },
        }]);
        assert.deepEqual(userInGameFinders.actions, [{
            actionName: 'join_the_game/smb',
            payload: {
                gameId: game.id,
                user: _.pick(user, ['id', 'name']),
            },
        }]);
        assert.equal(userInAnotherGame.actions.length, 0);
    });

});
