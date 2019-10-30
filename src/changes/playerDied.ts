import { INotifier } from '../models/notifier';
import * as SocketIO from 'socket.io';
import { ROOMS } from '../constants';

export default class PlayerDied implements INotifier {

    constructor (private readonly gameId: string,
                 private readonly playerId: string) {}

    public notify (socketServer: SocketIO.Server) {
        socketServer.to(ROOMS.GAME(this.gameId))
            .emit('player_died', { playerId: this.playerId });

        console.log(`Player ${this.playerId} died.`);
    }

}
