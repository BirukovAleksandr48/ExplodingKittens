export interface IResetter<T> {
    get (args?): T;
    set (customValue: T);
    reset ();
}
