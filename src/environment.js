const zip = (...xs) => {
    const x = xs.reduce((a, b) => a.length < b.length ? a: b);
    return x.map((_, i) => xs.map((arr) => arr[i]));
};

class Environment {
    constructor(params, args, outer = null) {
        if (params && args) {
            this.map = Object.fromEntries(zip(params, args));
            this.outer = outer;
        } else {
            this.map = {};
        }
    }

    find(sym) {
        if (this.map[sym]) return this.map[sym];
        else return this.outer?.find(sym);
    }

    _symbol(k) {
        return typeof k === 'symbol' ? k : Symbol.for(k);
    }

    put(key, val) {
        this.map[this._symbol(key)] = val;
    }
}

const build = () => {
    const env = new Environment();
    env.put('+', (...xs) => xs.reduce((acc, val) => acc + val, 0));
    env.put('-', (x, ...ys) => ys?.length ? ys.reduce((acc, val) => acc - val, x) : -x);
    env.put('*', (...xs) => xs.reduce((acc, val) => acc * val, 1));
    env.put('/', (a, b) => a / b);
    env.put('mod', (a, b) => a % b);
    env.put('>', (a, b) => a > b);
    env.put('<', (a, b) => a < b);
    env.put('>=', (a, b) => a >= b);
    env.put('<=', (a, b) => a <= b);
    env.put('=', (a, b) => a === b);
    env.put('abs', Math.abs);
    env.put('pi', Math.PI);
    env.put('sin', Math.sin);
    env.put('cos', Math.cos);
    env.put('tan', Math.tan);
    env.put('sqrt', Math.sqrt);
    env.put('max', Math.max);
    env.put('min', Math.min);
    env.put('round', Math.round);
    env.put('ceil', Math.ceil);
    env.put('floor', Math.floor);
    env.put('apply', (fn, args) => fn(...args));
    env.put('do', (...xs) => xs.length && xs[xs.length-1]);
    env.put('first', x => x[0]);
    env.put('rest', ([first, ...rest]) => rest);
    env.put('cons', (x, y) => [x, ...y]);
    env.put('pow', Math.pow);
    env.put('list', (...x) => [...x]);
    env.put('map', (f, xs) => xs.map(f));
    env.put('filter', (f, xs) => xs.filter(f));
    env.put('not', (x) => !x);
    env.put('list?', x => Array.isArray(x));
    env.put('number?', x => typeof x === 'number');
    env.put('symbol?', x => typeof x === 'symbol');
    env.put('fn?', x => typeof x === 'function');
    return env;
};

exports.globalEnvironment = build();
exports.Environment = Environment;


