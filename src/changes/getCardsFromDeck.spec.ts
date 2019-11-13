import { assert } from 'chai';
import { ROOMS } from '../constants';
import { SocketApp } from '../../test/mocks/socketIO';
import * as uuid from 'uuid';
import GetCardsFromDeck from './getCardsFromDeck';

describe('changes/getCardsFromDeck', () => {

    it('check different recipients', () => {
        const gameId = 'game_1';
        const playerId = 'player_1';
        const cardIds = [2, 3];

        const socketApp: any = new SocketApp();
        const curUser = socketApp.createSocket(playerId);
        curUser.join(ROOMS.GAME(gameId));
        const userInGame = socketApp.createSocket();
        userInGame.join(ROOMS.GAME(gameId));
        const userInGameFinders = socketApp.createSocket();
        userInGameFinders.join(ROOMS.GAME_FINDERS);
        const userInAnotherGame = socketApp.createSocket();
        userInAnotherGame.join(ROOMS.GAME(uuid()));

        new GetCardsFromDeck(gameId, playerId, cardIds).notify(socketApp);

        assert.deepEqual(curUser.actions, [
            {
                actionName: 'get_card_from_deck/you',
                payload: {
                    cards: [2, 3],
                },
            },
        ]);
        assert.deepEqual(userInGame.actions, [{
            actionName: 'get_card_from_deck/smb',
            payload: {
                playerId: 'player_1',
                cardsCount: 2,
                bombPositions: [],
            },
        }]);
        assert.deepEqual(userInGameFinders.actions, []);

    });

});
