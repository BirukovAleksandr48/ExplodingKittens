import { assert } from 'chai';
import CreateGame from './createGame';
import { IActionHandler } from '../models/actionHandler';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { INotifier } from '../models/notifier';
import { spy } from 'sinon';
import { ROOMS } from '../constants';
import { BecomeOnline, GameCreated } from '../changes';
import Game from '../game';

describe('actionHandlers/createGame', () => {

    let actionHandler: IActionHandler;
    let games: IGame[];
    let users: MUser[];
    let current;
    let changes: INotifier[];

    beforeEach(() => {
        actionHandler = new CreateGame();
    });

    describe('check validation rules', () => {

        it('fine', () => {
            const { error } = actionHandler.validationRules.validate('name');
            assert.isUndefined(error);
        });

        it('null', () => {
            const { error } = actionHandler.validationRules.validate(null);
            assert(!!error);
        });

        it('number', () => {
            const { error } = actionHandler.validationRules.validate(100);
            assert(!!error);
        });

    });

    describe('run', () => {

        beforeEach(() => {
            games = [];
            users = [];
            current = {
                user: {},
                socket: {
                    join: spy(),
                    leave: spy(),
                },
            };
            changes = [];
        });

        it('game created, room changed, changes added', () => {
            const payload = 'Alex';

            actionHandler.run(games, users, current, changes, payload);

            assert(games[0] instanceof Game);
            assert.equal(current.game, games[0]);
            assert.equal(current.socket.join.args[0][0], ROOMS.GAME(current.game.id));
            assert.equal(current.socket.leave.args[0][0], ROOMS.GAME_FINDERS);
            assert(changes[0] instanceof GameCreated);
        });

    });
});
