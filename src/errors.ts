import { MError } from './models/errors';

export default {
    FieldValidationError: (body): MError => ({
        error: 'FieldValidationError',
        ...body,
    }),
    NotFound: (message: string, type?: string): MError => ({
        error: 'NotFound',
        message,
        type,
    }),
    Unauthorized: (message: string): MError => ({
        error: 'Unauthorized',
        message,
    }),
    Forbidden: (message: string): MError => ({
        error: 'Forbidden',
        message,
    }),
    GameRulesError: (message: string): MError => ({
       error: 'GameRulesError',
       message,
    }),
    // if player try to end not own turn, or use card that can't be used
    ActionRejected: (message: string): MError => ({
        error: 'ActionRejected',
        message,
    }),
};
