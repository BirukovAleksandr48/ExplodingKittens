import { INotifier } from '../models/notifier';
import * as _ from 'lodash';
import * as SocketIO from 'socket.io';
import { ROOMS } from '../constants';

export default class UsingCard implements INotifier {

    constructor (private readonly gameId: string,
                 private readonly playerId: string,
                 private readonly cardId: number) {}

    public notify (socketServer: SocketIO.Server) {
        socketServer.to(ROOMS.GAME(this.gameId))
            .emit('player_use_card', _.pick(this, ['playerId', 'cardId']));
        console.log(`Player ${this.playerId} use the card ${this.cardId}`);
    }

}
