const errors = require('../errors');

module.exports = (actionHandler, games, players, io, currentPlayer) => (payload) => {

    try {
        const { error } = actionHandler.validationRules.validate(payload, { abortEarly: false });
        if (error) {
            throw errors.FieldValidationError(error);
        }

        const changes = [];
        actionHandler.run(games, players, io, currentPlayer, payload, changes);
        changes.map(c => c.notify(io.sockets))
    } catch (err) {
        console.log(err);
        currentPlayer.socket.emit('err', err);
    }
};

