import { IActionHandler } from '../models/actionHandler';
import * as Joi from '@hapi/joi';
import { ROOMS } from '../constants';
import { BecomeOnline } from '../changes';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { MCurrent } from '../models/current';
import { INotifier } from '../models/notifier';

export default class IAmHere implements IActionHandler {

    get validationRules () {
        return Joi.string();
    }

    public run (games: IGame[], users: MUser[], current: MCurrent, changes: INotifier[], payload) {

        console.log('i am here', payload);
        current.user.name = payload;
        current.socket.join(ROOMS.GAME_FINDERS);

        changes.push(new BecomeOnline(current.user, games));
    }

}
