import gameRules from './rules';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import errors from './errors';
import { IGame, MAction, MGameParticipant, MGameState } from './models/game';
import { MUser } from './models/user';
import { IRule } from './models/rules';
import { dealCards } from './repositories/deck';
import { EGameDirection, EGameStatus, EPlayerStatus } from './constants';

export default class Game implements IGame {

    public id: string = uuid();
    public hostId: string;
    public status = EGameStatus.WAIT_FOR_PLAYERS;
    public state: MGameState;
    public actions: MAction[] = [];
    public participants: MGameParticipant[] = [];
    public rules: IRule = new gameRules.STANDARD();

    constructor (public name: string, host: MUser) {
        this.hostId = host.id;
        this.join(host);
    }

    public join (user: MUser) {
        if (this.rules.maxPlayers === this.participants.length) {
            throw errors.GameRulesError('No more places.');
        }

        this.participants.push(_.pick(user, ['id', 'name', 'profilePictureUrl']));
    }

    public leave (userId: string) {
        _.remove(this.participants, p => p.id === userId);
        if (this.status !== EGameStatus.WAIT_FOR_PLAYERS) {
            _.remove(this.state.nextPlayerSequence, p => p === userId);
            this.state.players.find(p => p.id === userId).status = EPlayerStatus.LEAVE;
        }
    }

    public start () {
        if (this.participants.length < 2) {
            throw errors.GameRulesError('Too few players.');
        }

        const { players, deck } = dealCards(this.rules, this.participants);
        const currentPlayerId: string = _.head(players).id;

        this.status = EGameStatus.PLAY;
        this.state = {
            direction: EGameDirection.FORWARD,
            interactionWith: null,
            release: [],
            nextPlayerSequence: [],
            players,
            deck,
            currentPlayerId,
        };
        console.log('Game started. Deck: ', this.state.deck);
    }

}
