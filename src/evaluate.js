const {globalEnvironment, Environment} = require('./environment');

const Fn = (params, body, env) => (...args) => evaluate(body, new Environment(params, args, env));

const evaluate = (xs, env = globalEnvironment) => {
    if (xs[0] === Symbol.for('def')) {
        const [_, sym, expr] = xs;
        env.put(sym, evaluate(expr, env));
    } else if (xs[0] === Symbol.for('quote')) {
        const [_, ...r] = xs;
        return r;
    } else if (xs[0] === Symbol.for('if')) {
        const [_, test, conseq, alt] = xs;
        return evaluate(evaluate(test, env) ? conseq : alt);
    } else if (xs[0] === Symbol.for('set!')) {
        const [_, sym, expr] = xs;
        env.put(sym, evaluate(expr, env));
    } else if (xs[0] === Symbol.for('fn')) {
        const [_, params, body] = xs;
        return Fn(params, body, env);
    } else if (typeof xs === 'symbol') return env.find(xs);
    else if (!Array.isArray(xs)) return xs;
    else {
        const [fn, ...args] = xs;
        console.log("fn", fn);
        const _fn = evaluate(fn, env);
        console.log('_fn is ', typeof _fn, _fn);
        return _fn(...args.map(arg => evaluate(arg, env)));
    }
};

module.exports = evaluate;
