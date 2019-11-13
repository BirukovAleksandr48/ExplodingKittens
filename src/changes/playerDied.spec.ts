import { assert } from 'chai';
import { EGameStatus, ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import PlayerDied from './playerDied';

describe('changes/playerDied', () => {

    it('check different recipients', () => {
        const playerId: any = 'userId_1';
        const gameId: any = 'gameId_1';

        const socketApp: any = new SocketApp();
        const userInGame = socketApp.createSocket(playerId);
        userInGame.join(ROOMS.GAME(gameId));

        const userInAnotherGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(uuid()));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new PlayerDied(gameId, playerId).notify(socketApp);

        assert.deepEqual(userInGame.actions, [{
            actionName: 'player_died',
            payload: { playerId },
        }]);
        assert.deepEqual(userInGameFinders.actions, []);
        assert.deepEqual(userInAnotherGame.actions, []);
    });

});
