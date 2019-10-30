import { IActionHandler } from '../models/actionHandler';
import * as Joi from '@hapi/joi';
import { ROOMS } from '../constants';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { MCurrent } from '../models/current';
import { INotifier } from '../models/notifier';
import errors from '../errors';
import { JoinTheGame } from '../changes';

export default class JoinGame implements IActionHandler {

    get validationRules () {
        return Joi.string();
    }

    public run (games: IGame[], users: MUser[], current: MCurrent, changes: INotifier[], payload) {

        const game = games.find(g => g.id === payload);
        if (!game) {
            throw errors.NotFound(`Game ${payload} is not found.`);
        }

        game.join(current.user);
        current.game = game;
        current.socket.join(ROOMS.GAME(payload));
        current.socket.leave(ROOMS.GAME_FINDERS);

        changes.push(new JoinTheGame(game, current.user));
    }

}
