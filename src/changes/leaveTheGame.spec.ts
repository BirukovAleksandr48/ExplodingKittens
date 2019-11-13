import { assert } from 'chai';
import { EGameStatus, ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import LeaveTheGame from './leaveTheGame';

describe('changes/leaveTheGame', () => {

    it('check different recipients', () => {
        const userId: any = 'userId_1';
        const gameId: any = 'gameId_1';

        const socketApp: any = new SocketApp();
        const userInGame = socketApp.createSocket(userId);
        userInGame.join(ROOMS.GAME(gameId));
        const userInAnotherGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(uuid()));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new LeaveTheGame(gameId, userId).notify(socketApp);

        assert.deepEqual(userInGame.actions, [{
            actionName: 'leave_the_game',
            payload: { gameId, userId },
        }]);
        assert.deepEqual(userInGameFinders.actions, [{
            actionName: 'leave_the_game',
            payload: { gameId, userId },
        }]);
        assert.deepEqual(userInAnotherGame.actions, []);
    });

});
