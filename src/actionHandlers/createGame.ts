import { IActionHandler } from '../models/actionHandler';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import { MCurrent } from '../models/current';
import { INotifier } from '../models/notifier';
import { GameCreated } from '../changes';
import * as Joi from '@hapi/joi';
import Game from '../game';
import { ROOMS } from '../constants';

export default class CreateGame implements IActionHandler {

    get validationRules () {
        return Joi.string();
    }

    public run (games: IGame[], users: MUser[], current: MCurrent, changes: INotifier[], payload) {

        console.log('game created');
        const game = new Game(payload, current.user);
        current.game = game;
        games.push(game);

        current.game = game;
        current.socket.join(ROOMS.GAME(game.id));
        current.socket.leave(ROOMS.GAME_FINDERS);

        changes.push(new GameCreated(game, current.user.id));
    }

}
