import { assert } from 'chai';
import { ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import EndTheTurn from './endTheTurn';

describe('changes/endTheTurn', () => {

    it('check different recipients', () => {
        const gameId = 'game_1';
        const playerId = 'player_1';

        const socketApp: any = new SocketApp();
        const curUser = socketApp.createSocket(playerId);
        curUser.join(ROOMS.GAME(gameId));
        const userInGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(gameId));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);

        new EndTheTurn(gameId, playerId).notify(socketApp);

        const supposedResult = [
            {
                actionName: 'end_the_turn',
                payload: { playerId },
            },
        ];
        assert.deepEqual(curUser.actions, supposedResult);
        assert.deepEqual(userInGame.actions, supposedResult);
        assert.deepEqual(userInGameFinders.actions, []);

    });

});
