import * as _ from 'lodash';
import { REQUEST_ACTIONS } from './constants';
import actionRunner from './actionHandlers/actionRunner';
import actionHandlers from './actionHandlers';
import * as SocketIO from 'socket.io';
import { IGame } from './models/game';
import { MUser } from './models/user';
import { MCurrent } from './models/current';

const games: IGame[] = [];
const users: MUser[] = [];

export default (server) => {

    const socketServer = SocketIO(server);

    socketServer.on('connection', (socket: SocketIO.Socket) => {
        console.log(socket.id, 'connected');

        const user: MUser = {
            id: socket.id,
            name: null,
            email: 'email@gmail.com',
            password: '123456',
            profilePictureUrl: 'http://image.jpg',
        };

        const current: MCurrent = {
            user,
            socket,
        };
        users.push(user);

        _.map(REQUEST_ACTIONS, action => {
            socket.on(action, actionRunner(new actionHandlers[action](), games, users, socketServer, current));
        });

    });

};
