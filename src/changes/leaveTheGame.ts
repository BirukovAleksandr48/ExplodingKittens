import { INotifier } from '../models/notifier';
import * as SocketIO from 'socket.io';
import { ROOMS } from '../constants';

export default class LeaveTheGame implements INotifier {

    constructor (private readonly gameId: string,
                 private readonly userId: string) {}

    public notify (socketServer: SocketIO.Server) {

        socketServer
            .to(ROOMS.GAME(this.gameId))
            .to(ROOMS.GAME_FINDERS)
            .emit('leave_the_game', {
                gameId: this.gameId,
                userId: this.userId,
            });

        console.log(`Player ${this.userId} leave the game.`);
    }

}
