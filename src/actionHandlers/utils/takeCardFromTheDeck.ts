import { IGame } from '../../models/game';
import { INotifier } from '../../models/notifier';
import { GetCardsFromDeck, PlayerDied, UsingCard } from '../../changes';
import * as _ from 'lodash';
import { CARDS, EPlayerStatus } from '../../constants';

export default (game: IGame, currentPlayerId: string, changes: INotifier[]) => {

    const currentPlayer = game.state.players.find(p => p.id === currentPlayerId);
    const newCardId = game.state.deck.shift();
    changes.push(new GetCardsFromDeck(game.id, currentPlayer.id, [newCardId]));

    if (newCardId === CARDS.BOMB.id) {
        console.log(`PLAYER ${currentPlayer.id} take the BOMB.`);
        const index = currentPlayer.cards.findIndex(cardId => cardId === CARDS.SAPPER.id);

        if (index === -1) {
            currentPlayer.status = EPlayerStatus.DIED;
            game.state.release = [...game.state.release, ...currentPlayer.cards];
            currentPlayer.cards = [];
            _.remove(game.state.nextPlayerSequence, playerId => playerId === currentPlayerId);
            changes.push(new PlayerDied(game.id, currentPlayer.id));
        } else {
            currentPlayer.cards.splice(index, 1);
            game.state.release.push(CARDS.SAPPER.id);
            changes.push(new UsingCard(game.id, currentPlayer.id, CARDS.SAPPER.id));
        }
        // TODO: player should choose the place for bomb
        game.state.deck.push(newCardId);
    } else {
        currentPlayer.cards.push(newCardId);
    }
};
