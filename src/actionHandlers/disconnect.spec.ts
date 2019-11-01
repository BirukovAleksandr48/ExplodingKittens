import { assert } from 'chai';
import Disconnect from './disconnect';
import { IActionHandler } from '../models/actionHandler';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { INotifier } from '../models/notifier';
import { spy } from 'sinon';
import { LeaveTheGame } from '../changes';

describe('actionHandlers/disconnect', () => {

    let actionHandler: IActionHandler;
    let games: IGame[];
    let users: MUser[];
    let current;
    let changes: INotifier[];

    beforeEach(() => {
        actionHandler = new Disconnect();
    });

    describe('run', () => {

        beforeEach(() => {
            games = [];
            users = [];
            current = {
                user: {
                    id: 'a1',
                },
                socket: {
                    leave: spy(),
                },
                game: {
                    id: 'cc',
                    leave: spy(),
                },
            };
            changes = [];
        });

        it('common case', () => {

            const mySpy = spy();
            current.game.leave = mySpy;

            actionHandler.run(games, users, current, changes, null);

            assert.equal(mySpy.args[0][0], current.user.id);
            assert.isUndefined(current.game);
            assert(changes[0] instanceof LeaveTheGame);
        });

    });
});
