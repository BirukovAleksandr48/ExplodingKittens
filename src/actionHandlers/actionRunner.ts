import errors from '../errors';
import { IActionHandler } from '../models/actionHandler';
import { IGame } from '../models/game';
import { MUser } from '../models/user';
import * as SocketIO from 'socket.io';
import { MCurrent } from '../models/current';
import { INotifier } from '../models/notifier';

export default (actionHandler: IActionHandler, games: IGame[], users: MUser[],
                socketServer: SocketIO.Server, current: MCurrent) => (payload) => {

    try {
        const { error } = actionHandler.validationRules.validate(payload, { abortEarly: false });
        if (error) {
            throw errors.FieldValidationError(error);
        }

        const changes: INotifier[] = [];
        actionHandler.run(games, users, current, changes, payload);
        changes.map(c => c.notify(socketServer));
    } catch (err) {
        console.log(err);
        current.socket.emit('err', err);
    }

};
