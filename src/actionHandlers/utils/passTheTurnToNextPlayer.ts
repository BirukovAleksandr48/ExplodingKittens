import { IGame, MPlayer } from '../../models/game';
import { INotifier } from '../../models/notifier';
import * as _ from 'lodash';
import { EndTheTurn } from '../../changes';
import { EGameDirection, EPlayerStatus } from '../../constants';

export default (game: IGame, currentPlayerId: string, changes: INotifier[]) => {

    if (game.state.nextPlayerSequence.length) {
        game.state.currentPlayerId = game.state.nextPlayerSequence.shift();
    } else {
        const tempSequence = [...game.state.players, ...game.state.players];
        let nextPlayer: MPlayer;
        if (game.state.direction === EGameDirection.FORWARD) {
            const index = tempSequence.findIndex(player => player.id === currentPlayerId);
            nextPlayer = tempSequence.find(
                (player, curIndex) => curIndex > index && player.status !== EPlayerStatus.DIED,
            );
        } else {
            const index = _.findLastIndex(tempSequence, player => player.id === currentPlayerId);
            nextPlayer = _.findLast(tempSequence,
                (player, curIndex) => curIndex < index && player.status !== EPlayerStatus.DIED,
            );
        }

        game.state.currentPlayerId = nextPlayer.id;
    }
    changes.push(new EndTheTurn(game.id, currentPlayerId));
};
