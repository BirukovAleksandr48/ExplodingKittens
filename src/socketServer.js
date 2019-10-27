const _ = require('lodash');
const { REQUEST_ACTIONS } = require('./constants');
const actionRunner = require('./actionHandlers/actionRunner');
const actionHandlers = require('./actionHandlers');

const games = [];
const players = [];

module.exports.listen = (server) => {

    const io = require('socket.io')(server);

    io.on('connection', function(socket) {
        console.log(socket.id, 'connected');

        const currentPlayer = {
            id: socket.id,
            name: null,
            currentGame: null,
            socket,
        };

        _.map(REQUEST_ACTIONS, value => {
            socket.on(value, actionRunner(new actionHandlers[value](), games, players, io, currentPlayer));
        });

    });

};
