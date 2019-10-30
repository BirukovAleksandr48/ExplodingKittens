import { IRule } from './rules';
import { MUser } from './user';
import { EGameDirection, EGameStatus, EPlayerStatus } from '../constants';

export type MDeck = number[];

export type MPlayer = {
    id: string,
    cards: MDeck,
    status: EPlayerStatus,
};

export type MAction = {
    type: string,
    playerId: string,
    stateBefore: MGameState,
};

export type MGameState = {
    direction: EGameDirection,
    interactionWith: string,
    deck: MDeck,
    currentPlayerId: string,
    release: MDeck,
    players: MPlayer[],
    nextPlayerSequence: string[],
};

export interface IGame {
    id: string;
    name: string;
    hostId: string;
    gameRules: IRule;
    status: EGameStatus;
    state: MGameState;
    actions: MAction[];
    participants: MGameParticipant[];
    join (user: MUser);
    leave (userId: string);
    start ();
}

export type MGameParticipant = {
    id: string,
    name: string,
    profilePictureUrl: string,
};

export type MBaseGameInfo = {
    id: string,
    name: string,
    maxPlayers: number,
    participants: MGameParticipant[],
    hostId: string,
};
