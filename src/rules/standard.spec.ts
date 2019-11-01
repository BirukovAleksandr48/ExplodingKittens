import { assert } from 'chai';
import StandardRules from './standard';
import { CARDS } from '../constants';
import { IRule } from '../models/rules';
import * as _ from 'lodash';

describe('rules/standard', () => {
    let standardRules: IRule;

    beforeEach(() => {
        standardRules = new StandardRules();
    });

    it('total starter cards count isn\'t more than total cards count', () => {
        const deckTemplate = standardRules.deckTemplate.get({ playersCount: standardRules.maxPlayers });
        const commonCardsCount = _.reduce(deckTemplate, (acc, value, name) => {
            if (name !== CARDS.BOMB.name) {
                return acc += value;
            }
            return acc;
        }, 0);
        assert(commonCardsCount >= standardRules.starterCardsCount *  standardRules.maxPlayers);
    });

    it('starter cards enough for each player', () => {
        const deckTemplate = standardRules.deckTemplate.get({ playersCount: standardRules.maxPlayers });
        const starterTemplate = standardRules.starterTemplate.get();

        _.map(starterTemplate, (value, name) => {
            assert(deckTemplate[name] >= value * standardRules.maxPlayers);
        });
    });

});
