import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { INotifier } from '../models/notifier';
import { IActionHandler } from '../models/actionHandler';
import Joi from '@hapi/joi';
import { GameStarted } from '../changes';
import errors from '../errors';
import { MCurrent } from '../models/current';

export default class StartGame implements IActionHandler {

    get validationRules () {
        return Joi.any();
    }

    public run (games: IGame[], users: MUser[], current: MCurrent, changes: INotifier[], payload) {

        const game = games.find(g => g.hostId = current.user.id);
        if (!game) {
            throw errors.Forbidden('Player isn\'t a host.');
        }

        game.start();
        changes.push(new GameStarted(game));
    }

}
