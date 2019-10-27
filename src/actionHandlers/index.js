const { REQUEST_ACTIONS } = require('../constants');

module.exports = {
    [REQUEST_ACTIONS.CREATE_GAME]: require('./createGame'),
    [REQUEST_ACTIONS.END_OF_TURN]: require('./endOfTurn'),
    [REQUEST_ACTIONS.I_AM_HERE]: require('./iAmHere'),
    [REQUEST_ACTIONS.JOIN_GAME]: require('./joinGame'),
    [REQUEST_ACTIONS.START_GAME]: require('./startGame'),
    [REQUEST_ACTIONS.DISCONNECT]: require('./disconnect'),
};
