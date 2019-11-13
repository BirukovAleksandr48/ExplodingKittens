import { INotifier } from '../models/notifier';
import { IGame, MBaseGameInfo } from '../models/game';
import * as SocketIO from 'socket.io';
import * as _ from 'lodash';
import { MUser } from '../models/user';
import { ROOMS } from '../constants';

export default class BecomeOnline implements INotifier {

    constructor (private readonly user: MUser, private readonly games: IGame[]) {}

    public notify (socketServer: SocketIO.Server) {

        const games: MBaseGameInfo[] = _.map(this.games, g => ({
            id: g.id,
            name: g.name,
            hostId: g.hostId,
            maxPlayers: g.rules.maxPlayers,
            participants: g.participants,
            status: g.status,
        }));

        socketServer.to(this.user.id).emit('become_online/you', { games });

        socketServer.sockets.sockets[this.user.id].to(ROOMS.GAME_FINDERS)
            .emit('become_online/smb', {
                user: {
                    id: this.user.id,
                    name: this.user.name,
                },
            });
        console.log(`Player ${this.user.id} become online.`);
    }

}
