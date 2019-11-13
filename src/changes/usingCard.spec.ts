import { assert } from 'chai';
import { EGameStatus, ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import UsingCard from './usingCard';

describe('changes/usingCard', () => {

    it('check different recipients', () => {
        const playerId: any = 'userId_1';
        const gameId: any = 'gameId_1';
        const cardId = 3;

        const socketApp: any = new SocketApp();
        const userInGame = socketApp.createSocket(playerId);
        userInGame.join(ROOMS.GAME(gameId));

        const userInAnotherGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(uuid()));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new UsingCard(gameId, playerId, cardId).notify(socketApp);

        assert.deepEqual(userInGame.actions, [{
            actionName: 'player_use_card',
            payload: { playerId, cardId },
        }]);
        assert.deepEqual(userInAnotherGame.actions, []);
        assert.deepEqual(userInGameFinders.actions, []);
    });

});
