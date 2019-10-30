import { IActionHandler } from '../models/actionHandler';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { MCurrent } from '../models/current';
import { INotifier } from '../models/notifier';
import * as Joi from '@hapi/joi';
import { ROOMS } from '../constants';
import { LeaveTheGame } from '../changes';

export default class Disconnect implements IActionHandler {

    get validationRules () {
        return Joi.any();
    }

    public run (games: IGame[], users: MUser[], current: MCurrent, changes: INotifier[], payload) {

        const gameId = current.game.id;
        current.game.leave(current.user.id);
        current.socket.leave(ROOMS.GAME(current.game.id));
        delete current.game;
        changes.push(new LeaveTheGame(gameId, current.user.id));

        console.log(`Player ${current.user.name} disconnected`);
    }

}
