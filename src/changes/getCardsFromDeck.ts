import { INotifier } from '../models/notifier';
import * as SocketIO from 'socket.io';
import { CARDS, ROOMS } from '../constants';
import * as _ from 'lodash';

export default class GetCardsFromDeck implements INotifier {

    constructor (private readonly gameId: string,
                 private readonly playerId: string,
                 private readonly cardIds: number[]) {}

    public notify (socketServer: SocketIO.Server) {

        const bombPositions = _.reduce(this.cardIds, (acc, cardId, position) => {
            if (cardId === CARDS.BOMB.id) {
                acc.push(position);
            }
            return acc;
        }, []) as number[];

        socketServer.to(this.playerId)
            .emit('get_card_from_deck/you', { cards: this.cardIds });

        socketServer.sockets.sockets[this.playerId]
            .to(ROOMS.GAME(this.gameId))
            .emit('get_card_from_deck/smb', {
                playerId: this.playerId,
                cardsCount: this.cardIds.length,
                bombPositions,
            });
    }

}
