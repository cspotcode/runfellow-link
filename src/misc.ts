import { memoize } from 'lodash';
import * as Path from 'path';

export interface Ctor<I> {
    new (...args: any[]): I
    readonly name: string;
}

export interface Proto {
    // can't be more specific than this because TypeScript isn't any more specific.
    // It uses type `Function` for the constructor property of class prototypes.
    constructor: Function;
}

export type HasProps<P extends string, V = any> = {[p in P]: V};

export const __root = Path.join(__dirname, '..');
export const __code = Path.join(__root, 'out');

declare global {
    type TODO = any;
}

function ident<T>(a: T) { return a; }
export function T<Type>() {
    return ident as <Actual extends Type>(a: Actual) => Actual;
}

export {cache};

function cache<K, T, A>(getter: (a: A) => T, generateKey: (a: A) => K): ((a: A) => T) & {cache: Map<K, T>};
function cache<K, T>(getter: (k: K) => T): (k: K) => T & {cache: Map<K, T>};
function cache<K, T, A>(getter: any, generateKey = (k: K) => k) {
    const ret = memoize(getter, generateKey);
    ret.cache = new Map();
    return ret;
}
