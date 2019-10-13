const { ACTION_TYPES, CARDS, TAGS } = require('./constants');
const { createGameRules, ruleNames } = require('./rules');
const _ = require('lodash');
const DeckRepository = require('./repositories/deck');

module.exports = class Game {

  constructor (rule = 'STANDARD') {
    this._deckRepository = new DeckRepository();
    this.gameRules = null;
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
  }

  join (player) {
    this.state.players.push(player);
  };

  left (playerId) {
    _.remove(this.state.players, player => player.id === playerId);
  };

  start () {
    this.gameRules = createGameRules(ruleNames.STANDARD, this.state.players.length);

    const { players, deck } = this._deckRepository.dealCards(this.gameRules, this.state.players);
    const currentPlayerId = _.head(players).id;

    this.state = {
      ...this.state,
      players,
      deck,
      currentPlayerId,
    };
  };

  /**
   * @param {{ type: string, cardId?: number, playerId: number}} action
   */
  exec (action) {
    const curState = _.cloneDeep(this.state);
    const preparedAction = this.prepareAction(action, curState);

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

    this.gameRules.handle(preparedAction, curState);
    this.actions.push({
      ...action,
      stateBefore: this.state,
    });
    this.state = curState;
    console.log(this.state)
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
