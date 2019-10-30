import { IGame } from './game';
import { MUser } from './user';
import { INotifier } from './notifier';
import * as Joi from 'joi';
import { MCurrent } from './current';

export interface IActionHandler {
    readonly validationRules: Joi.Schema;
    run (games: IGame[],
         users: MUser[],
         current: MCurrent,
         changes: INotifier[],
         payload);
}
