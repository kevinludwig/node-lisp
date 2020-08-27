const {globalEnvironment, Environment} = require('./environment');

class UDF {
    constructor(params, body, env) {
        this.params = params;
        this.body = body;
        this.env = env;
    }
}

const evaluate = (xs, env = globalEnvironment) => {
    while (true) {
        /* special forms */
        if (xs[0] === Symbol.for('def')) {
            const [_, sym, expr] = xs;
            env.put(sym, evaluate(expr, env));
            return null;
        } else if (xs[0] === Symbol.for('quote')) {
            const [_, ...r] = xs;
            return r;
        } else if (xs[0] === Symbol.for('if')) {
            const [_, test, conseq, alt] = xs;
            xs = evaluate(test, env) ? conseq : alt;
        } else if (xs[0] === Symbol.for('set!')) {
            const [_, sym, expr] = xs;
            env.put(sym, evaluate(expr, env));
            return null;
        } else if (xs[0] === Symbol.for('fn')) {
            const [_, params, body] = xs;
            return new UDF(params, body, env);
        } else if (xs[0] === Symbol.for('do')) {
            const [_, ...exprs] = xs;
            for (expr of exprs) {
                xs = evaluate(expr, env);
            }
        } else if (typeof xs === 'symbol') {
            return env.find(xs); /* symbol reference */
        } else if (!Array.isArray(xs)) {
            return xs; /* literal constant */
        } else { /* function calls */
            const [fn, ...args] = xs.map(x => evaluate(x, env));
            if (fn instanceof UDF) {
                xs = fn.body;
                env = new Environment(fn.params, args, fn.env);
            } else {
                return fn(...args);
            }
        }
    }
};

module.exports = evaluate;
