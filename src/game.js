const {ACTION_TYPES, CARDS, TAGS} = require('./constants');
const rules = require('./rules');
const _ = require('lodash');
const DeckRepository = require('./repositories/deck');
const uuid = require('uuid');
const errors = require('./errors');

module.exports = class Game {

    constructor (name, host, rule = 'STANDARD') {
        this._deckRepository = new DeckRepository();

        this.id = uuid();
        this.name = name;
        this.host = host;
        this.gameRules = new rules[rule]();
        this.started = false;
        this.state = {
            direction: 'forward',
            interaction: null,
            deck: null,
            currentPlayerId: null,
            release: [],
            players: [],
            nextPlayerSequence: [],
        };
        this.actions = [];

        this.join(host);
    }

    join (player) {
        if (this.gameRules.maxPlayers === this.state.players.length) {
            throw errors.GameRulesError('No more places.');
        }

        player.playGameId = this.id;
        this.state.players.push({
            id: player.id,
            name: player.name,
            cards: []
        });
    };

    leave (playerId) {
        _.remove(this.state.players, player => player.id === playerId);
        _.remove(this.state.nextPlayerSequence, player => player.id === playerId);
    };

    start () {

        if (this.state.players.length < 2) {
            throw errors.GameRulesError('Too few players.');
        }

        const {players, deck} = this._deckRepository.dealCards(this.gameRules, this.state.players);
        const currentPlayerId = _.head(players).id;

        this.started = true;
        this.state = {
            ...this.state,
            players,
            deck,
            currentPlayerId,
        };
        console.log('Game started. Deck: ', this.state.deck);
    };

};
