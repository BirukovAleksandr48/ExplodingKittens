import * as SocketIO from 'socket.io';

export interface INotifier {
    notify (socketServer: SocketIO.Server);
}
