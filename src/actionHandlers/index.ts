import { REQUEST_ACTIONS } from '../constants';
import createGame from './createGame';
import endOfTurn from './endOfTurn';
import iAmHere from './iAmHere';
import joinGame from './joinGame';
import startGame from './startGame';
import disconnect from './disconnect';

export default {
    [REQUEST_ACTIONS.CREATE_GAME]: createGame,
    [REQUEST_ACTIONS.END_OF_TURN]: endOfTurn,
    [REQUEST_ACTIONS.I_AM_HERE]: iAmHere,
    [REQUEST_ACTIONS.JOIN_GAME]: joinGame,
    [REQUEST_ACTIONS.START_GAME]: startGame,
    [REQUEST_ACTIONS.DISCONNECT]: disconnect,
};
