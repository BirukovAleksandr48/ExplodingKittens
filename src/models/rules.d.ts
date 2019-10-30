export type MTemplate = {
    [p: string]: number;
};

export interface IRule {
    maxPlayers: number;
    starterCards: {
        totalCount: number;
        template: MTemplate;
    };
    template (playersCount: number): MTemplate;
}
