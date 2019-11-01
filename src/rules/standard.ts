import { CARDS } from '../constants';
import { IRule, MTemplate } from '../models/rules';
import Resetter from '../utils/resetter';

export default class StandardRules implements IRule {
    public maxPlayers = 5;
    public starterCardsCount = 5;
    public starterTemplate = new Resetter<MTemplate>(() => ({
        [CARDS.SAPPER.name]: 1,
    }));
    public deckTemplate = new Resetter<MTemplate>(({ playersCount }: { playersCount: number }) => ({
        [CARDS.BOMB.name]: playersCount + 4,
        [CARDS.SAPPER.name]: playersCount + 2,
        [CARDS.CHANGE_THE_FUTURE.name]: 6,
        [CARDS.NOT.name]: 4,
        [CARDS.ATTACK.name]: 5,
        [CARDS.SKIP.name]: 5,
        [CARDS.TARGETED_ATTACK.name]: 5,
        [CARDS.CHANGE_DIRECTION.name]: 5,
    }));
}
