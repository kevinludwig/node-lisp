const tokenize = (s) => s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(' ').filter(x => x);

const atom = (token) => Number(token) || Symbol.for(token);

const read_from_tokens = (tokens) => {
    if (tokens.length === 0) throw Error('Unexpected end of file');
    const token = tokens.shift();
    if (token === '(') {
        const L = [];
        while (tokens[0] !== ')') L.push(read_from_tokens(tokens));
        tokens.shift();
        return L;
    } else if (token === ')') {
        throw Error('Unexpected token ")"');
    } else {
        return atom(token);
    }
};

const parse = exports.parse = (text) => read_from_tokens(tokenize(text));

const standard_env = () => ({
    [Symbol.for('+')]: (...xs) => xs.reduce((acc, val) => acc + val, 0),
    [Symbol.for('-')]: (...xs) => xs.reduce((acc, val) => acc - val, 0),
    [Symbol.for('*')]: (...xs) => xs.reduce((acc, val) => acc * val, 1),
    [Symbol.for('/')]: (...xs) => xs.reduce((acc, val) => acc / val, 0),
    [Symbol.for('>')]: (a, b) => a > b,
    [Symbol.for('<')]: (a, b) => a < b,
    [Symbol.for('>=')]: (a, b) => a >= b,
    [Symbol.for('<=')]: (a, b) => a <= b,
    [Symbol.for('=')]: (a, b) => a === b,
    [Symbol.for('abs')]: Math.abs,
    [Symbol.for('pi')]: Math.PI,
    [Symbol.for('sin')]: Math.sin,
    [Symbol.for('cos')]: Math.cos,
    [Symbol.for('tan')]: Math.tan,
    [Symbol.for('sqrt')]: Math.sqrt,
    [Symbol.for('max')]: Math.max,
    [Symbol.for('min')]: Math.min,
    [Symbol.for('round')]: Math.round,
    [Symbol.for('apply')]: (fn, args) => fn(...args),
    [Symbol.for('do')]: (...xs) => xs.length && xs[xs.length-1], 
    [Symbol.for('first')]: x => x[0],
    [Symbol.for('rest')]: ([first, ...rest]) => rest,
    [Symbol.for('cons')]: (x, y) => [x, ...y],
    [Symbol.for('pow')]: Math.pow,
    [Symbol.for('list')]: (...x) => [...x],
    [Symbol.for('map')]: (f, ...xs) => xs.map(f),
    [Symbol.for('filter')]: (f, xs) => xs.filter(f),
    [Symbol.for('not')]: (x) => !x,
    [Symbol.for('list?')]: x => Array.isArray(x),
    [Symbol.for('number?')]: x => x instanceof Number,
    [Symbol.for('symbol?')]: x => x instanceof Symbol,
    [Symbol.for('fn?')]: x => x && {}.call(x) === '[object Function]'
});

const global_env = standard_env();

const zip = (...xs) => {
    const x = xs.reduce((a, b) => a.length < b.length ? a: b);
    return x.map((_, i) => xs.map((arr) => arr[i]));
};

const _eval = exports.eval = (xs, env = global_env) => {
    if (xs[0] === Symbol.for('def')) {
        const [_, sym, expr] = xs;
        env[sym] = _eval(expr, env)
    } else if (xs[0] === Symbol.for('quote')) {
        const [_, ...r] = xs;
        return r;
    } else if (xs[0] === Symbol.for('if')) {
        const [_, test, conseq, alt] = xs;
        return _eval(_eval(test, env) ? conseq : alt);
    } else if (xs[0] === Symbol.for('set!')) {
        const [sym, expr] = xs;
        env[sym] = _eval(expr, env);
    } else if (xs[0] === Symbol.for('fn')) {
        const [_, params, body] = xs;
        return (...args) => _eval(body, {...env, ...Object.fromEntries(zip(params, args))});
    } else if (typeof xs === 'symbol') return env[xs];
    else if (!Array.isArray(xs)) return xs;
    else {
        const [fn, ...args] = xs;
        const _fn = _eval(fn, env);
        return _fn(...args.map(arg => _eval(arg, env)));
    }
};

