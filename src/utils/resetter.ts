import { IResetter } from '../models/resetter';

export default class Resetter<T> implements IResetter<T> {

    private customValue: T = null;

    constructor (private defaultValue: (args: object) => T) { }

    public get (args?) {
        return this.customValue || this.defaultValue(args);
    }

    public set (customValue) {
        this.customValue = customValue;
    }

    public reset () {
        this.customValue = null;
    }

}
