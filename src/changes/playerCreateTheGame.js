module.exports = class PlayerCreateTheGame {

    /**
     * @param {string} gameId
     * @param {string} gameName
     * @param {string} playerId
     * @param {string} playerName
     */
    constructor (gameId, gameName, playerId, playerName) {
        this.changes = {
            gameId,
            gameName,
            playerId,
            playerName,
        };
    }

    notify (io) {
        debugger
        io.to('GAME_FINDERS')
            .to(this.changes.playerId)
            .emit('game_created', this.changes);

        console.log(`Player ${this.changes.playerId} create the game ${this.changes.gameId}.`)
    }

};
