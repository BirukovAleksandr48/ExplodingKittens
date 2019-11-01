import * as SocketIO from 'socket.io';
import { INotifier } from '../models/notifier';
import { IGame, MBaseGameInfo } from '../models/game';

export default class GameCreated implements INotifier {

    constructor (private readonly game: IGame,
                 private readonly userId: string) {}

    public notify (socketServer: SocketIO.Server) {

        const game: MBaseGameInfo = {
            id: this.game.id,
            name: this.game.name,
            hostId: this.game.hostId,
            maxPlayers: this.game.rules.maxPlayers,
            participants: this.game.participants,
        };

        socketServer.to('GAME_FINDERS')
            .to(this.userId)
            .emit('game_created', { game });

        console.log(`Player ${this.userId} create the game ${this.game.id}.`);
    }

}
