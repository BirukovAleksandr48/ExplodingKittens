const { ACTION_TYPES, CARDS, TAGS } = require('./constants');
const rules = require('./rules');
const _ = require('lodash');
const DeckRepository = require('./repositories/deck');
const uuid = require('uuid');

module.exports = class Game {

  constructor (name, host, rule = 'STANDARD') {
    this._deckRepository = new DeckRepository();

    this.id = uuid();
    this.name = name;
    this.hostId = host.id;
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
      throw new Error('No more places.');
    }

    player.playGameId = this.id;
    this.state.players.push({
      id: player.id,
      name: player.name,
      cards: []
    });
  };

  left (playerId) {
    _.remove(this.state.players, player => player.id === playerId);
  };

  start () {

    if (this.state.players.length < 2) {
      throw new Error('Too few players.');
    }

    const { players, deck } = this._deckRepository.dealCards(this.gameRules, this.state.players);
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

  /**
   * @param {{ type: string, cardId?: number, playerId: string, gameId: string }} action
   */
  exec (action) {
    const curState = _.cloneDeep(this.state);
    const preparedAction = this.prepareAction(action, curState);
    const changes = [];

    switch (preparedAction.type) {
      case ACTION_TYPES.END_OF_TURN: {
        if (this.state.currentPlayerId !== preparedAction.player.id) {
          throw new Error('Wait your turn.');
        }
        break;
      }
      case ACTION_TYPES.PLAY_CARD: {
        if (this.state.currentPlayerId !== preparedAction.player.id
            && !preparedAction.card.tags.some(tag => tag === TAGS.USE_WHENEVER)) {
          throw new Error('This card could be played only in your turn.');
        }
        break;
      }
      case ACTION_TYPES.INTERACTION_RESPONSE: {

        break;
      }
    }

    this.gameRules.handle(preparedAction, curState, changes);
    this.actions.push({
      ...action,
      stateBefore: this.state,
    });
    this.state = curState;
    console.log(this.state);
    return changes;
  }

  prepareAction (action, state) {
    const preparedAction = _.cloneDeep(action);

    if (preparedAction.cardId) {
      preparedAction.card = CARDS.find(card => card.id === preparedAction.cardId);
      if (!preparedAction.card) {
        throw new Error(`Card id '${preparedAction.cardId}' not found.`);
      }
      delete preparedAction.cardId;
    }

    preparedAction.player = state.players.find(player => player.id === preparedAction.playerId);
    if (!preparedAction.player) {
      throw new Error(`Player id '${preparedAction.playerId}' not found.`);
    }
    delete preparedAction.playerId;

    return preparedAction;
  }
};
