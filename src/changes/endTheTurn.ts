import * as SocketIO from 'socket.io';
import { INotifier } from '../models/notifier';
import { ROOMS } from '../constants';

export default class EndTheTurn implements INotifier {

    constructor (private readonly gameId: string,
                 private readonly playerId: string) {}

    public notify (socketServer: SocketIO.Server) {

        socketServer.to(ROOMS.GAME(this.gameId))
            .emit('end_the_turn', { playerId: this.playerId });

        console.log(`Player ${this.playerId} end the turn.`);
    }

}
