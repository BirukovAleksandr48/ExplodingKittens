import { assert } from 'chai';
import Resetter from './resetter';

describe('utils/resetter', () => {

    it('get default value', () => {
        const resetter = new Resetter(() => {
            return 'Default value';
        });
        const result = resetter.get();
        assert.equal(result, 'Default value');
    });

    it('set custom value', () => {
        const resetter = new Resetter(() => {
            return 'Default value';
        });
        resetter.set('Custom value');
        const result = resetter.get();
        assert.equal(result, 'Custom value');
    });

    it('reset value to default', () => {
        const resetter = new Resetter(() => {
            return 'Default value';
        });
        resetter.set('Custom value');
        resetter.reset();
        const result = resetter.get();
        assert.equal(result, 'Default value');
    });

});
