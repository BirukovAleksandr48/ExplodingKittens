module.exports = {
    FieldValidationError: (body) => ({
        error: 'FieldValidationError',
        ...body,
    }),
    NotFound: (message, type) => ({
        error: 'NotFound',
        message,
        type,
    }),
    Unauthorized: (message) => ({
        error: 'Unauthorized',
        message,
    }),
    Forbidden: (message) => ({
        error: 'Forbidden',
        message,
    }),
    GameRulesError: (message) => ({
       error: 'GameRulesError',
       message,
    }),
    // if player try to end not own turn, or use card that can't be used
    ActionRejected: (message) => ({
        error: 'ActionRejected',
        message,
    }),
};
