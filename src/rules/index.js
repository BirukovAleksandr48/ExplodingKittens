const ruleNames = {
    STANDARD: 'STANDARD',
};

const rules = {
    [ruleNames.STANDARD]: require('./standard'),
};

const createGameRules = (ruleName, playersCount) => rules[ruleName](playersCount);

module.exports = {
    ruleNames,
    createGameRules,
};
