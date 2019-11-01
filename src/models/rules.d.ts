import { IResetter } from './resetter';

export type MTemplate = {
    [p: string]: number;
};

export interface IRule {
    maxPlayers: number;
    starterCardsCount: number;
    starterTemplate: IResetter<MTemplate>;
    deckTemplate: IResetter<MTemplate>;
}
