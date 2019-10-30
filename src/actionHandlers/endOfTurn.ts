import { IActionHandler } from '../models/actionHandler';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { MCurrent } from '../models/current';
import { INotifier } from '../models/notifier';
import * as Joi from '@hapi/joi';
import * as _ from 'lodash';
import { REQUEST_ACTIONS } from '../constants';
import { takeCardFromTheDeck, passTheTurnToNextPlayer } from './utils';
import errors from '../errors';

export default class EndOfTurn implements IActionHandler {

    get validationRules () {
        return Joi.any();
    }

    public run (games: IGame[], users: MUser[], current: MCurrent, changes: INotifier[], payload) {

        const stateBefore = _.cloneDeep(current.game.state);

        if (current.game.state.currentPlayerId !== current.user.id) {
            throw errors.ActionRejected('Wait your turn.');
        }

        takeCardFromTheDeck(current.game, current.user.id, changes);
        passTheTurnToNextPlayer(current.game, current.user.id, changes);

        current.game.actions.push({
            type: REQUEST_ACTIONS.END_OF_TURN,
            playerId: current.user.id,
            stateBefore,
        });

        console.log(current.game.state);
        return changes;
    }

}
