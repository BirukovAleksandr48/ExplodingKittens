import { MUser } from './user';
import { IGame } from './game';
import * as SocketIO from 'socket.io';

export type MCurrent = {
    user: MUser,
    game?: IGame,
    socket: SocketIO.Socket,
};
