import { INotifier } from '../models/notifier';
import * as SocketIO from 'socket.io';
import { IGame, MBaseGameInfo } from '../models/game';
import { MUser } from '../models/user';
import { ROOMS } from '../constants';
import * as _ from 'lodash';

export default class JoinTheGame implements INotifier {

    constructor (private readonly game: IGame,
                 private readonly user: MUser) {}

    public notify (socketServer: SocketIO.Server) {

        const user = _.pick(this.user, ['id', 'name']);
        const game: MBaseGameInfo = {
            id: this.game.id,
            name: this.game.name,
            hostId: this.game.hostId,
            maxPlayers: this.game.gameRules.maxPlayers,
            participants: this.game.participants,
        };

        socketServer.sockets.sockets[this.user.id]
            .to(ROOMS.GAME(this.game.id))
            .to(ROOMS.GAME_FINDERS)
            .emit('join_the_game/smb', {
                gameId: this.game.id,
                user,
            });

        socketServer.to(this.user.id)
            .emit('join_the_game/you', { game });

        console.log(`Player ${this.user.id} join the game.`);
    }

}
