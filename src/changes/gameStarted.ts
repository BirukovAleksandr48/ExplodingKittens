import { INotifier } from '../models/notifier';
import * as _ from 'lodash';
import { IGame } from '../models/game';
import * as SocketIO from 'socket.io';

export default class GameStarted implements INotifier {

    constructor (private readonly game: IGame) {}

    public notify (socketServer: SocketIO.Server) {

        const state = {
            direction: this.game.state.direction,
            deckSize: this.game.state.deck.length,
            releaseSize: this.game.state.release.length,
            currentPlayerId: this.game.state.currentPlayerId,
            nextPlayerSequence: this.game.state.nextPlayerSequence,
        };

        _.map(this.game.state.players, player => {
            const players = this.game.state.players.map(p => {
                if (p.id === player.id) {
                    return p;
                }
                return {
                    id: p.id,
                    cardsCount: p.cards.length,
                    status: p.status,
                };
            });
            socketServer.to(player.id).emit('game_started', {
                state: {
                    ...state,
                    players,
                },
            });
        });

        console.log(`Game ${this.game.id} started.`);
    }

}
