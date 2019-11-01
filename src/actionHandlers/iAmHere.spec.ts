import { assert } from 'chai';
import IAmHere from './iAmHere';
import { IActionHandler } from '../models/actionHandler';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { INotifier } from '../models/notifier';
import { spy } from 'sinon';
import { ROOMS } from '../constants';
import { BecomeOnline } from '../changes';
import * as SocketMock from 'socket.io-mock';

describe('actionHandlers/iAmHere', () => {

    let actionHandler: IActionHandler;
    let games: IGame[];
    let users: MUser[];
    let current;
    let changes: INotifier[];

    beforeEach(() => {
        actionHandler = new IAmHere();
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
                },
            };
            changes = [];
        });

        it('current user name changed, join to GameFinders room, changes added', () => {
            const payload = 'Alex';

            actionHandler.run(games, users, current, changes, payload);

            assert.equal(current.user.name, payload);
            assert.equal(current.socket.join.args[0][0], ROOMS.GAME_FINDERS);
            assert(changes[0] instanceof BecomeOnline);
        });

    });

    describe('mocks', () => {
        it('Sockets should be able to talk to each other without a server', () => {
            const socketA = new SocketMock();
            const socketB = new SocketMock();
            socketA.join('game finders');
            socketB.join('game finders');
            socketB.on('message', (message) => {
                console.log('I AM SOCKET B.');
                console.log('I GET MESSAGE:', message);
            });
            socketA.on('message', (message) => {
                console.log('I AM SOCKET A.');
                console.log('I GET MESSAGE:', message);
            });
            socketA.emit('message', 'Hello to game finders!');

        });
    });

});
